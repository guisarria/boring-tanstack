import { createServerFn } from "@tanstack/react-start"
import { getCookie, getRequestHeaders } from "@tanstack/react-start/server"
import {
  type AuthServiceError,
  getSessionResult,
  listSessionsResult,
  requireSessionResult,
} from "./auth-service.server"

function toHttpError(error: AuthServiceError): Response {
  if (error.code === "UNAUTHORIZED") {
    return new Response(error.message, { status: 401 })
  }

  return new Response("Internal Server Error", { status: 500 })
}

export const getSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders()
    const result = await getSessionResult(headers)

    if (result.isErr()) {
      throw toHttpError(result.error)
    }

    return result.value
  }
)

export const resolveSessions = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders()
    const sessionToken = getCookie("better-auth.session_token")
    const result = await listSessionsResult(headers, sessionToken)

    if (result.isErr()) {
      throw toHttpError(result.error)
    }

    return result.value
  }
)

export const resolveRequiredSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders()
    const result = await requireSessionResult(headers)

    if (result.isErr()) {
      throw toHttpError(result.error)
    }

    return result.value
  }
)
