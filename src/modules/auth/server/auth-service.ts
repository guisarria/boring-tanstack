import { errAsync, okAsync, ResultAsync } from "neverthrow"

import type { ErrorCode } from "@/lib/errors"

import type { Session, User } from "../schema"
import { auth } from "./auth"

const PUBLIC_USER_KEYS = [
  "id",
  "name",
  "email",
  "image",
  "role",
  "emailVerified",
] as const

export type PublicUser = Pick<User, (typeof PUBLIC_USER_KEYS)[number]>

export type SessionPayload = {
  user: PublicUser | null
}

export type SessionListPayload = {
  sessionId: string
  sessions: Awaited<ReturnType<typeof auth.api.listSessions>>
}

export type AuthServiceError = {
  code: ErrorCode
  cause?: unknown
  message: string
}

const SESSION_COOKIE = "__Secure-better-auth.session_token"
const SESSION_COOKIE_FALLBACK = "better-auth.session_token"

export { SESSION_COOKIE, SESSION_COOKIE_FALLBACK }

function authError(
  code: ErrorCode,
  message = "Unauthorized",
): AuthServiceError {
  return { code, message }
}

function toProviderFailure(cause: unknown): AuthServiceError {
  return {
    code: "internal_error:auth",
    cause,
    message: "Auth provider request failed",
  }
}

function toPublicUser(user: NonNullable<Session["user"]>): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    emailVerified: user.emailVerified,
  }
}

function fetchSession(headers: Headers) {
  return ResultAsync.fromPromise(
    auth.api.getSession({ headers }),
    toProviderFailure,
  )
}

export function getSession(headers: Headers) {
  return fetchSession(headers).map<SessionPayload>((response) => ({
    user: response?.user ? toPublicUser(response.user) : null,
  }))
}

export function requireAuthenticatedUser(
  headers: Headers,
  errorCode: ErrorCode = "unauthorized:auth",
) {
  return fetchSession(headers).andThen((response) => {
    if (!response?.user) {
      return errAsync(authError(errorCode))
    }

    return okAsync(toPublicUser(response.user))
  })
}

// Token format is "<sessionId>.<signature>"; split to extract the ID prefix.
export function listSessions(headers: Headers, rawSessionToken: string) {
  const sessionId = rawSessionToken.split(".")[0]

  return ResultAsync.fromPromise(
    auth.api.listSessions({ headers }),
    toProviderFailure,
  ).map<SessionListPayload>((sessions) => ({
    sessions,
    sessionId,
  }))
}
