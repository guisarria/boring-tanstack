export type ErrorType =
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "rate_limit"
  | "offline"
  | "internal_error"
  | "conflict"

export type Surface =
  | "chat"
  | "schedule"
  | "auth"
  | "api"
  | "stream"
  | "database"
  | "history"
  | "vote"
  | "document"
  | "suggestions"
  | "activate_gateway"

export type ErrorCode = `${ErrorType}:${Surface}`

export type ErrorVisibility = "response" | "log" | "none"

export const visibilityBySurface = {
  database: "log",
  chat: "response",
  schedule: "response",
  auth: "response",
  stream: "response",
  api: "response",
  history: "response",
  vote: "response",
  document: "response",
  suggestions: "response",
  activate_gateway: "response",
} as const satisfies Record<Surface, ErrorVisibility>

const STATUS_CODES = {
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  rate_limit: 429,
  offline: 503,
  internal_error: 500,
  conflict: 409,
} as const satisfies Record<ErrorType, number>

const ERROR_MESSAGES: Partial<Record<ErrorCode, string>> = {
  "bad_request:api":
    "The request couldn't be processed. Please check your input and try again.",
  "unauthorized:auth": "You need to sign in before continuing.",
  "forbidden:auth": "Your account does not have access to this feature.",
  "rate_limit:chat":
    "You have exceeded your maximum number of messages for the day. Please try again later.",
  "not_found:chat":
    "The requested chat was not found. Please check the chat ID and try again.",
  "not_found:schedule":
    "The requested event was not found. Please refresh the calendar and try again.",
  "bad_request:schedule":
    "The event details were invalid. Please review them and try again.",
  "forbidden:chat":
    "This chat belongs to another user. Please check the chat ID and try again.",
  "unauthorized:chat":
    "You need to sign in to view this chat. Please sign in and try again.",
  "unauthorized:schedule":
    "You need to sign in to use the calendar. Please sign in and try again.",
  "offline:chat":
    "We're having trouble sending your message. Please check your internet connection and try again.",
  "not_found:document":
    "The requested document was not found. Please check the document ID and try again.",
  "forbidden:document":
    "This document belongs to another user. Please check the document ID and try again.",
  "unauthorized:document":
    "You need to sign in to view this document. Please sign in and try again.",
  "bad_request:document":
    "The request to create or update the document was invalid. Please check your input and try again.",
  "internal_error:database":
    "A database error occurred. Please try again later.",
  "internal_error:api":
    "An unexpected server error occurred. Please try again later.",
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again later."

const VALID_ERROR_TYPES: Record<ErrorType, true> = {
  bad_request: true,
  unauthorized: true,
  forbidden: true,
  not_found: true,
  rate_limit: true,
  offline: true,
  internal_error: true,
  conflict: true,
}

const VALID_SURFACES: Record<Surface, true> = {
  chat: true,
  schedule: true,
  auth: true,
  api: true,
  stream: true,
  database: true,
  history: true,
  vote: true,
  document: true,
  suggestions: true,
  activate_gateway: true,
}

function isErrorType(value: string): value is ErrorType {
  return value in VALID_ERROR_TYPES
}

function isSurface(value: string): value is Surface {
  return value in VALID_SURFACES
}

function parseErrorCode(code: ErrorCode): {
  type: ErrorType
  surface: Surface
} {
  const [rawType, rawSurface] = code.split(":")

  if (!rawType || !isErrorType(rawType)) {
    throw new Error(`Invalid error type in code "${code}"`)
  }
  if (!rawSurface || !isSurface(rawSurface)) {
    throw new Error(`Invalid surface in code "${code}"`)
  }

  return { type: rawType, surface: rawSurface }
}

export class AppError extends Error {
  type: ErrorType
  surface: Surface
  statusCode: number

  constructor(errorCode: ErrorCode, cause?: string) {
    super()

    const { type, surface } = parseErrorCode(errorCode)

    this.type = type
    this.cause = cause
    this.surface = surface
    this.message = getErrorMessage(errorCode)
    this.statusCode = STATUS_CODES[this.type]
  }

  toResponse() {
    const code: ErrorCode = `${this.type}:${this.surface}`
    const visibility = visibilityBySurface[this.surface]

    const { message, cause, statusCode } = this

    if (visibility === "log") {
      console.error({ code, message, cause })

      return Response.json(
        { code: "", message: DEFAULT_ERROR_MESSAGE },
        { status: statusCode },
      )
    }

    return Response.json({ code, message, cause }, { status: statusCode })
  }
}

export function toErrorResponse(error: unknown): Response {
  if (error instanceof AppError) return error.toResponse()
  return new AppError("internal_error:api").toResponse()
}

export function getErrorMessage(errorCode: ErrorCode): string {
  return ERROR_MESSAGES[errorCode] ?? DEFAULT_ERROR_MESSAGE
}
