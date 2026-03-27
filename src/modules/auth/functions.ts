import { createServerFn } from "@tanstack/react-start"
import { getCookie, getRequestHeaders } from "@tanstack/react-start/server"

import { AppError } from "@/lib/errors"

import * as authService from "./server/auth-service"

function getAuthContext() {
  const headers = getRequestHeaders()
  const secureToken = getCookie("__Secure-better-auth.session_token")
  const fallbackToken = getCookie("better-auth.session_token")

  const sessionToken = secureToken ?? fallbackToken

  return { headers, sessionToken }
}

export const getSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const { headers } = getAuthContext()
    const result = await authService.getSession(headers)

    if (result.isErr()) {
      const { code, message } = result.error
      throw new AppError(code, message).toResponse()
    }

    return result.value
  },
)

export const getActiveSessions = createServerFn({ method: "GET" }).handler(
  async () => {
    const { headers, sessionToken } = getAuthContext()

    if (!sessionToken) {
      throw new AppError("unauthorized:auth").toResponse()
    }

    const result = await authService.listSessions(headers, sessionToken)
    if (result.isErr()) {
      const { code, message } = result.error
      throw new AppError(code, message).toResponse()
    }

    return result.value
  },
)
