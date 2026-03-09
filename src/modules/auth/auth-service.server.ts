import { errAsync, okAsync, ResultAsync } from "neverthrow"
import { auth } from "./auth"

type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>

export type SessionPayload = {
  session: NonNullable<AuthSession>["session"] | null
  user: NonNullable<AuthSession>["user"] | null
}

export type SessionListPayload = {
  sessionId: string | undefined
  sessions: Awaited<ReturnType<typeof auth.api.listSessions>>
}

export type AuthServiceError = {
  code: "UNAUTHORIZED" | "AUTH_PROVIDER_FAILURE"
  cause?: unknown
  message: string
}

function toProviderFailure(cause: unknown): AuthServiceError {
  return {
    code: "AUTH_PROVIDER_FAILURE",
    cause,
    message: "Auth provider request failed",
  }
}

export function getSessionResult(headers: Headers) {
  return ResultAsync.fromPromise(
    auth.api.getSession({ headers }),
    toProviderFailure
  ).map((response) => ({
    user: response?.user
      ? {
          id: response.user.id,
          name: response.user.name,
          image: response.user.image,
          email: response.user.email,
        }
      : null,
  }))
}
export function requireSessionResult(headers: Headers) {
  return ResultAsync.fromPromise(
    auth.api.getSession({ headers }),
    toProviderFailure
  ).andThen((response) => {
    if (!response) {
      return errAsync<NonNullable<AuthSession>, AuthServiceError>({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      })
    }

    return okAsync(response)
  })
}

export function listSessionsResult(
  headers: Headers,
  rawSessionToken: string | undefined
) {
  const sessionId = rawSessionToken?.split(".")[0]

  return ResultAsync.fromPromise(
    auth.api.listSessions({ headers }),
    toProviderFailure
  ).map<SessionListPayload>((sessions) => ({
    sessions,
    sessionId,
  }))
}
