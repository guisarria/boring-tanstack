import { errAsync, okAsync, ResultAsync } from "neverthrow"

import { AppError, type ErrorCode } from "@/lib/errors"

import type { Session, User } from "../schema"
import { auth } from "./auth"

export type PublicUser = Pick<
  User,
  "id" | "name" | "email" | "image" | "role" | "emailVerified"
>

export type SessionPayload = {
  user: PublicUser | null
}

export type SessionListPayload = {
  sessionId: string | undefined
  sessions: Awaited<ReturnType<typeof auth.api.listSessions>>
}

export type AuthServiceError = {
  code: ErrorCode
  cause?: unknown
  message: string
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

export function requireSession(headers: Headers) {
  return fetchSession(headers).andThen((response) => {
    if (!response) {
      return errAsync<Session, AuthServiceError>({
        code: "unauthorized:auth",
        message: "Unauthorized",
      })
    }

    return okAsync(response)
  })
}

export function getAuthenticatedUserId(
  headers: Headers,
  errorCode: ErrorCode = "unauthorized:auth",
) {
  return fetchSession(headers).andThen((response) => {
    if (!response?.user) {
      return errAsync<string, AuthServiceError>({
        code: errorCode,
        message: "Unauthorized",
      })
    }

    return okAsync(response.user.id)
  })
}

export async function requireAuthenticatedUser(
  headers: Headers,
): Promise<PublicUser> {
  const result = await fetchSession(headers)

  if (result.isErr() || !result.value?.user) {
    throw new AppError("unauthorized:chat")
  }

  return toPublicUser(result.value.user)
}

export function listSessions(
  headers: Headers,
  rawSessionToken: string | undefined,
) {
  const sessionId =
    typeof rawSessionToken === "string" && rawSessionToken.includes(".")
      ? rawSessionToken.split(".")[0]
      : undefined

  return ResultAsync.fromPromise(
    auth.api.listSessions({ headers }),
    toProviderFailure,
  ).map<SessionListPayload>((sessions) => ({
    sessions,
    sessionId,
  }))
}
