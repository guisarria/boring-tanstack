import { err, ok, type Result, ResultAsync } from "neverthrow"
import { type AppError, internalError } from "./errors"

export type SyncResult<TValue, TError = never> = Result<TValue, TError>

export type AsyncResult<TValue, TError = never> = ResultAsync<TValue, TError>

export function fromPromise<TValue, TError>(
  promise: Promise<TValue>,
  mapError: (error: unknown) => TError
): AsyncResult<TValue, TError> {
  return ResultAsync.fromPromise(promise, mapError)
}

export function fromPromiseInternal<TValue>(
  promise: Promise<TValue>,
  message: string
): AsyncResult<TValue, AppError<"INTERNAL_ERROR">> {
  return ResultAsync.fromPromise(promise, (cause) =>
    internalError(message, cause)
  )
}

export function requireValue<TValue, TError>(
  value: TValue | null | undefined,
  onMissing: () => TError
): SyncResult<TValue, TError> {
  if (value === null || value === undefined) {
    return err(onMissing())
  }

  return ok(value)
}
