import { createServerFn } from "@tanstack/react-start"
import { getCookie, getRequestHeaders } from "@tanstack/react-start/server"

import { AppError } from "@/lib/errors"
import { unwrapOrThrow } from "@/lib/server-utils"

import * as authService from "./server/auth-service"

function getAuthContext() {
  const headers = getRequestHeaders()
  const secureToken = getCookie(authService.SESSION_COOKIE)
  const fallbackToken = getCookie(authService.SESSION_COOKIE_FALLBACK)

  const sessionToken = secureToken ?? fallbackToken

  return { headers, sessionToken }
}

export const getSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const { headers } = getAuthContext()
    return unwrapOrThrow(await authService.getSession(headers))
  },
)

export const getActiveSessions = createServerFn({ method: "GET" }).handler(
  async () => {
    const { headers, sessionToken } = getAuthContext()

    if (!sessionToken) {
      throw new AppError("unauthorized:auth").toResponse()
    }

    return unwrapOrThrow(await authService.listSessions(headers, sessionToken))
  },
)
