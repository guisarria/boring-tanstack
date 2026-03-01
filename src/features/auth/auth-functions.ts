import { createServerFn } from "@tanstack/react-start"
import { getCookie, getRequestHeaders } from "@tanstack/react-start/server"
import { auth } from "./auth"

export const sessionAction = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders()
    const response = await auth.api.getSession({ headers })

    return {
      session: response?.session,
      user: response?.user,
    }
  }
)

export const sessionsAction = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders()

    const sessionToken = getCookie("better-auth.session_token")
    const sessionId = sessionToken?.split(".")[0]

    const sessions = await auth.api.listSessions({
      headers,
    })
    return {
      sessions,
      sessionId,
    }
  }
)

export const getSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders()
    const response = await auth.api.getSession({ headers })

    return {
      session: response?.session,
      user: response?.user,
    }
  }
)

export const ensureSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw new Error("Unauthorized")
    }

    return session
  }
)
