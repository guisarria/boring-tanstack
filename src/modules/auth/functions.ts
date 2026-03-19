import { createServerFn } from "@tanstack/react-start"
import { getCookie, getRequestHeaders } from "@tanstack/react-start/server"

import { AppError } from "@/lib/errors"

import {
  getSessionResult,
  listSessionsResult,
} from "./server/auth-service"

async function resolveSession() {
  const headers = getRequestHeaders()
  const result = await getSessionResult(headers)

  if (result.isErr()) {
    throw new AppError(result.error.code).toResponse()
  }

  return result.value
}

async function resolveSessions() {
  const headers = getRequestHeaders()
  const sessionToken =
    getCookie("__Secure-better-auth.session_token") ??
    getCookie("better-auth.session_token")
  const result = await listSessionsResult(headers, sessionToken)

  if (result.isErr()) {
    throw new AppError(result.error.code).toResponse()
  }

  return result.value
}

export const getSession = createServerFn({ method: "GET" }).handler(
  resolveSession,
)

export const sessionsAction = createServerFn({ method: "GET" }).handler(
  resolveSessions,
)
