import { ChatbotError } from "../errors"
import { getMessageCountByUserId } from "../queries"
import { ENTITLEMENTS_BY_USER_TYPE, getUserType } from "./constants"

const BOT_USER_AGENT_PATTERN =
  /\b(bot|crawler|spider|curl|wget|postmanruntime|insomnia|python-requests|httpclient|headlesschrome|phantomjs)\b/i
const IP_WINDOW_MS = 60_000
const MAX_REQUESTS_PER_IP_WINDOW = 30

const ipRequestBuckets = new Map<string, { count: number; resetAt: number }>()

function normalizeIp(rawIp: string | undefined): string | null {
  if (!rawIp) return null

  const firstForwardedIp = rawIp.split(",")[0]?.trim()
  return firstForwardedIp || null
}

function pruneExpiredIpBuckets(now: number) {
  for (const [ip, bucket] of ipRequestBuckets.entries()) {
    if (bucket.resetAt <= now) {
      ipRequestBuckets.delete(ip)
    }
  }
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

  const now = Date.now()
  pruneExpiredIpBuckets(now)

  const existingBucket = ipRequestBuckets.get(ip)

  if (!existingBucket || existingBucket.resetAt <= now) {
    ipRequestBuckets.set(ip, {
      count: 1,
      resetAt: now + IP_WINDOW_MS,
    })
    return
  }

  if (existingBucket.count >= MAX_REQUESTS_PER_IP_WINDOW) {
    throw new ChatbotError("rate_limit:chat").toResponse()
  }

  existingBucket.count += 1
}

export function resetRateLimitStateForTests() {
  ipRequestBuckets.clear()
}
