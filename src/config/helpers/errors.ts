export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "DATABASE_ERROR"
  | "INTERNAL_ERROR"

export type AppError<
  TCode extends string = AppErrorCode,
  TDetails = unknown,
> = {
  cause?: unknown
  code: TCode
  details?: TDetails
  message: string
  status: number
}

export type PublicError<TCode extends string = string, TDetails = unknown> = {
  code: TCode
  details?: TDetails
  message: string
  status: number
}

type ErrorConfig<TCode extends string, TDetails> = {
  cause?: unknown
  code: TCode
  details?: TDetails
  message: string
  status: number
}

type LookupDescriptor = {
  key?: string
  value?: unknown
}

type DalNotFoundDetails<TEntity extends string> = {
  entity: TEntity
  lookup?: LookupDescriptor
}

type DalConflictDetails<TEntity extends string> = {
  entity: TEntity
  reason?: string
}

type DalDatabaseDetails<TEntity extends string> = {
  entity: TEntity
  operation: string
}

type DalNotFoundError<TEntity extends string> = AppError<
  "NOT_FOUND",
  DalNotFoundDetails<TEntity>
>

type DalConflictError<TEntity extends string> = AppError<
  "CONFLICT",
  DalConflictDetails<TEntity>
>

type DalDatabaseError<TEntity extends string> = AppError<
  "DATABASE_ERROR",
  DalDatabaseDetails<TEntity>
>

export type DalError<TEntity extends string = string> =
  | DalNotFoundError<TEntity>
  | DalConflictError<TEntity>
  | DalDatabaseError<TEntity>

export function appError<TCode extends string, TDetails = unknown>(
  config: ErrorConfig<TCode, TDetails>
): AppError<TCode, TDetails> {
  const error: AppError<TCode, TDetails> = {
    code: config.code,
    message: config.message,
    status: config.status,
  }

  if (config.details !== undefined) {
    error.details = config.details
  }

  if (config.cause !== undefined) {
    error.cause = config.cause
  }

  return error
}

export function toPublicError<TCode extends string, TDetails = unknown>(
  error: AppError<TCode, TDetails>
): PublicError<TCode, TDetails> {
  const publicError: PublicError<TCode, TDetails> = {
    code: error.code,
    message: error.message,
    status: error.status,
  }

  if (error.details !== undefined) {
    publicError.details = error.details
  }

  return publicError
}

export function isAppError(value: unknown): value is AppError {
  if (typeof value !== "object" || value === null) {
    return false
  }

  return (
    "code" in value &&
    "message" in value &&
    "status" in value &&
    typeof value.code === "string" &&
    typeof value.message === "string" &&
    typeof value.status === "number"
  )
}

export function validationError(
  message: string,
  details?: { issues?: unknown },
  cause?: unknown
): AppError<"VALIDATION_ERROR", { issues?: unknown }> {
  return appError({
    code: "VALIDATION_ERROR",
    message,
    status: 400,
    details,
    cause,
  })
}

export function unauthorizedError(
  message = "Unauthorized"
): AppError<"UNAUTHORIZED"> {
  return appError({
    code: "UNAUTHORIZED",
    message,
    status: 401,
  })
}

export function forbiddenError(message = "Forbidden"): AppError<"FORBIDDEN"> {
  return appError({
    code: "FORBIDDEN",
    message,
    status: 403,
  })
}

export function internalError(
  message = "Internal server error",
  cause?: unknown
): AppError<"INTERNAL_ERROR"> {
  return appError({
    code: "INTERNAL_ERROR",
    message,
    status: 500,
    cause,
  })
}

export function dalNotFound<TEntity extends string>(
  entity: TEntity,
  lookup?: LookupDescriptor
): DalNotFoundError<TEntity> {
  return appError({
    code: "NOT_FOUND",
    message: `${entity} not found`,
    status: 404,
    details: { entity, lookup },
  })
}

export function dalConflict<TEntity extends string>(
  entity: TEntity,
  message: string,
  reason?: string
): DalConflictError<TEntity> {
  return appError({
    code: "CONFLICT",
    message,
    status: 409,
    details: { entity, reason },
  })
}

export function dalDatabaseError<TEntity extends string>(
  entity: TEntity,
  operation: string,
  cause: unknown
): DalDatabaseError<TEntity> {
  return appError({
    code: "DATABASE_ERROR",
    message: `Failed to ${operation} ${entity}`,
    status: 500,
    details: { entity, operation },
    cause,
  })
}
