import type { PublicError } from "./errors"
import type { RpcResponse } from "./rpc"
import { unwrapRpcResponse } from "./rpc"

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isPublicError(value: unknown): value is PublicError {
  if (!isObjectRecord(value)) {
    return false
  }

  return (
    typeof value.code === "string" &&
    typeof value.message === "string" &&
    typeof value.status === "number"
  )
}

export class RpcClientError extends Error {
  readonly payload: PublicError

  constructor(payload: PublicError) {
    super(payload.message)
    this.name = "RpcClientError"
    this.payload = payload
  }
}

export function unwrapOrThrow<TData>(response: RpcResponse<TData>): TData {
  const result = unwrapRpcResponse(response)

  if (result.isErr()) {
    throw new RpcClientError(result.error)
  }

  return result.value
}

export function getPublicError(error: unknown): PublicError | null {
  if (error instanceof RpcClientError) {
    return error.payload
  }

  if (isPublicError(error)) {
    return error
  }

  if (!isObjectRecord(error)) {
    return null
  }

  if (isPublicError(error.payload)) {
    return error.payload
  }

  if (isPublicError(error.error)) {
    return error.error
  }

  return null
}

export function getPublicErrorCode(error: unknown): string | null {
  if (isObjectRecord(error) && typeof error.code === "string") {
    return error.code
  }

  return getPublicError(error)?.code ?? null
}

export function getPublicErrorMessage(
  error: unknown,
  fallback = "Unexpected error"
): string {
  const publicError = getPublicError(error)

  if (publicError) {
    return publicError.message
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message
  }

  if (isObjectRecord(error) && typeof error.message === "string") {
    return error.message
  }

  return fallback
}
