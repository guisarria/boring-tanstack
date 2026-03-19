export type ErrorType =
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "rate_limit"
  | "offline"

export type Surface =
  | "chat"
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
  "forbidden:chat":
    "This chat belongs to another user. Please check the chat ID and try again.",
  "unauthorized:chat":
    "You need to sign in to view this chat. Please sign in and try again.",
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
  "bad_request:database": "An error occurred while executing a database query.",
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again later."

export class ChatbotError extends Error {
  type: ErrorType
  surface: Surface
  statusCode: number

  constructor(errorCode: ErrorCode, cause?: string) {
    super()

    const [type, surface] = errorCode.split(":")

    this.type = type as ErrorType
    this.cause = cause
    this.surface = surface as Surface
    this.message = getMessageByErrorCode(errorCode)
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

export function getMessageByErrorCode(errorCode: ErrorCode): string {
  return ERROR_MESSAGES[errorCode] ?? DEFAULT_ERROR_MESSAGE
}
