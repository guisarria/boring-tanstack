import { createServerFn } from "@tanstack/react-start"
import { getCookie, getRequestHeaders } from "@tanstack/react-start/server"

import {
  type AuthServiceError,
  getSessionResult,
  listSessionsResult,
  requireSessionResult,
} from "./auth-service.server"

function toHttpError(error: AuthServiceError): Response {
  if (error.code === "unauthorized") {
    return new Response(error.message, { status: 401 })
  }

  return new Response("Internal Server Error", { status: 500 })
}

async function resolveSession() {
  const headers = getRequestHeaders()
  const result = await getSessionResult(headers)

  if (result.isErr()) {
    throw toHttpError(result.error)
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
    throw toHttpError(result.error)
  }

  return result.value
}

async function resolveRequiredSession() {
  const headers = getRequestHeaders()
  const result = await requireSessionResult(headers)

  if (result.isErr()) {
    throw toHttpError(result.error)
  }

  return result.value
}

export const sessionAction = createServerFn({ method: "GET" }).handler(
  resolveSession,
)

export const sessionsAction = createServerFn({ method: "GET" }).handler(
  resolveSessions,
)

export const getSession = sessionAction

export const ensureSession = createServerFn({ method: "GET" }).handler(
  resolveRequiredSession,
)
