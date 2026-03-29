import type { Result } from "neverthrow"

import { AppError, type ErrorCode } from "./errors"

export function unwrapOrThrow<T>(
  result: Result<T, { code: ErrorCode; message: string }>,
): T {
  if (result.isErr()) {
    const { code, message } = result.error
    throw new AppError(code, message).toResponse()
  }
  return result.value
}
