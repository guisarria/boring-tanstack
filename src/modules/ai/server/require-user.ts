import { requireSessionResult } from "@/modules/auth/server/auth-service"

import { ChatbotError } from "../errors"

export async function requireUser(headers: Headers) {
  const sessionResult = await requireSessionResult(headers)

  if (sessionResult.isErr() || !sessionResult.value.user) {
    throw new ChatbotError("unauthorized:chat").toResponse()
  }

  return sessionResult.value.user
}
