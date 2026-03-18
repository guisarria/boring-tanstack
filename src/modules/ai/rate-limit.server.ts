import { lte, sql } from "drizzle-orm"

import { db } from "@/db/index"

import { ENTITLEMENTS_BY_USER_TYPE, getUserType } from "./constants"
import { ChatbotError } from "./errors"
import { getMessageCountByUserId } from "./queries.server"
import { ipRateLimits } from "./schema"

const BOT_USER_AGENT_PATTERN =
  /\b(bot|crawler|spider|curl|wget|postmanruntime|insomnia|python-requests|httpclient|headlesschrome|phantomjs)\b/i
const IP_WINDOW_MS = 60_000
const MAX_REQUESTS_PER_IP_WINDOW = 30

function normalizeIp(rawIp: string | undefined): string | null {
  if (!rawIp) return null

  const firstForwardedIp = rawIp.split(",")[0]?.trim()
  return firstForwardedIp || null
}

export async function checkRateLimit({
  userId,
  userRole,
}: {
  userId: string
  userRole: string | null | undefined
}): Promise<void> {
  const userType = getUserType(userRole)
  const messageCount = await getMessageCountByUserId({
    id: userId,
    differenceInHours: 1,
  })

  if (messageCount >= ENTITLEMENTS_BY_USER_TYPE[userType].maxMessagesPerHour) {
    throw new ChatbotError("rate_limit:chat").toResponse()
  }
}

export function checkBotId(headers: Headers) {
  const purpose = headers.get("purpose")
  const userAgent = headers.get("user-agent")

  return {
    isBot:
      purpose === "prefetch" ||
      purpose === "preview" ||
      (typeof userAgent === "string" && BOT_USER_AGENT_PATTERN.test(userAgent)),
  }
}

export async function checkIpRateLimit(
  rawIp: string | undefined,
): Promise<void> {
  const ip = normalizeIp(rawIp)

  if (!ip) {
    return
  }

  const now = new Date()
  const resetAt = new Date(now.getTime() + IP_WINDOW_MS)

  await db
    .delete(ipRateLimits)
    .where(lte(ipRateLimits.resetAt, now))
    .catch(() => {})

  const result = await db
    .insert(ipRateLimits)
    .values({ ip, count: 1, resetAt })
    .onConflictDoUpdate({
      target: ipRateLimits.ip,
      set: {
        count: sql`CASE WHEN ${ipRateLimits.resetAt} <= ${now} THEN 1 ELSE ${ipRateLimits.count} + 1 END`,
        resetAt: sql`CASE WHEN ${ipRateLimits.resetAt} <= ${now} THEN ${resetAt} ELSE ${ipRateLimits.resetAt} END`,
      },
    })
    .returning({ count: ipRateLimits.count })

  const count = result.at(0)?.count ?? 0

  if (count > MAX_REQUESTS_PER_IP_WINDOW) {
    throw new ChatbotError("rate_limit:chat").toResponse()
  }
}

export async function resetRateLimitStateForTests() {
  await db.delete(ipRateLimits)
}
