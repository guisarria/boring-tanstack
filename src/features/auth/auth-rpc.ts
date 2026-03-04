import { createServerFn } from "@tanstack/react-start"
import { getCookie, getRequestHeaders } from "@tanstack/react-start/server"
import { unauthorizedError } from "@/config/helpers/errors"
import { auth } from "./auth"

const readSession = async () => {
  const headers = getRequestHeaders()
  const response = await auth.api.getSession({ headers })

  return {
    session: response?.session,
    user: response?.user,
  }
}

const getSessionHandler = createServerFn({ method: "GET" }).handler(readSession)

export const sessionAction = getSessionHandler

export const sessionsAction = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders()

    const sessionToken = getCookie("better-auth.session_token")
    const sessionId = sessionToken?.split(".")[0]

    const sessions = await auth.api.listSessions({
      headers,
    })

    return {
      sessionId,
      sessions,
    }
  }
)

export const getSession = getSessionHandler

export const ensureSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw unauthorizedError("Sign in required")
    }

    return session
  }
)
