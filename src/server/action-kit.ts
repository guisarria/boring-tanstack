import { errAsync, okAsync, type Result, ResultAsync } from "neverthrow"
import {
  type AppError,
  dalNotFound,
  forbiddenError,
  internalError,
  isAppError,
  unauthorizedError,
  validationError,
} from "./errors"

type Maybe<TValue> = TValue | null | undefined
type InvalidateTags = readonly string[]
type AppResult<TValue> = ResultAsync<TValue, AppError>

export type InvalidateResolver<TData, TContext> =
  | InvalidateTags
  | ((data: TData, context: TContext) => InvalidateTags)

export type ActionValidator<TInput, TOutput> = (
  input: TInput
) => Result<TOutput, string | AppError>

export type ActionKitPorts<TPrincipal extends { id: string }> = {
  getPrincipal?: () => Promise<Maybe<TPrincipal>>
  invalidateTags?: (tags: InvalidateTags) => Promise<void> | void
  mapUnknownError?: (error: unknown) => AppError
}

type OwnedActionOptions<TPrincipal extends { id: string }, TResource, TData> = {
  entityName?: string
  invalidate?: InvalidateResolver<
    TData,
    { principal: TPrincipal; resource: TResource }
  >
  loadResource: () => AppResult<Maybe<TResource>>
  ownerId: (resource: TResource) => string
  operation: (args: {
    principal: TPrincipal
    resource: TResource
  }) => AppResult<TData>
}

export type ActionKit<TPrincipal extends { id: string }> = ReturnType<
  typeof createActionKit<TPrincipal>
>

export function createActionKit<TPrincipal extends { id: string }>(
  ports: ActionKitPorts<TPrincipal>
) {
  function toAppError(error: unknown): AppError {
    if (isAppError(error)) {
      return error
    }

    if (ports.mapUnknownError) {
      return ports.mapUnknownError(error)
    }

    return internalError("Unexpected action failure", error)
  }

  function safe<TValue>(operation: () => Promise<TValue>): AppResult<TValue> {
    return ResultAsync.fromPromise(operation(), toAppError)
  }

  function requireValue<TValue>(
    value: Maybe<TValue>,
    error: AppError
  ): AppResult<TValue> {
    if (value === null || value === undefined) {
      return errAsync(error)
    }

    return okAsync(value)
  }

  function requireCondition(
    condition: boolean,
    error: AppError
  ): AppResult<void> {
    if (!condition) {
      return errAsync(error)
    }

    return okAsync(undefined)
  }

  function validate<TInput, TOutput>(
    input: TInput,
    validator: ActionValidator<TInput, TOutput>
  ): AppResult<TOutput> {
    try {
      const parsed = validator(input)

      return parsed.match(
        (value) => okAsync(value),
        (error) => {
          if (typeof error === "string") {
            return errAsync(validationError(error))
          }

          return errAsync(error)
        }
      )
    } catch (error) {
      return errAsync(toAppError(error))
    }
  }

  function normalizeTags(tags: InvalidateTags): string[] {
    const cleaned = tags
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
    return [...new Set(cleaned)]
  }

  function resolveTags<TData, TContext>(
    invalidate: InvalidateResolver<TData, TContext> | undefined,
    data: TData,
    context: TContext
  ): string[] {
    if (!invalidate) {
      return []
    }

    const raw =
      typeof invalidate === "function" ? invalidate(data, context) : invalidate

    return normalizeTags(raw)
  }

  function withInvalidation<TData, TContext>(
    data: TData,
    context: TContext,
    invalidate: InvalidateResolver<TData, TContext> | undefined
  ): AppResult<TData> {
    const tags = resolveTags(invalidate, data, context)

    if (!ports.invalidateTags || tags.length === 0) {
      return okAsync(data)
    }

    return safe(async () => {
      await ports.invalidateTags?.(tags)
      return data
    })
  }

  function contextAction<TContext, TData>(
    context: AppResult<TContext>,
    operation: (context: TContext) => AppResult<TData>,
    options?: { invalidate?: InvalidateResolver<TData, TContext> }
  ): AppResult<TData> {
    return context.andThen((ctx) =>
      operation(ctx).andThen((data) =>
        withInvalidation(data, ctx, options?.invalidate)
      )
    )
  }

  function principalContext(): AppResult<TPrincipal> {
    if (!ports.getPrincipal) {
      return errAsync(unauthorizedError("Authentication is not configured"))
    }

    return safe(ports.getPrincipal).andThen((principal) =>
      requireValue(principal, unauthorizedError("Sign in required"))
    )
  }

  function publicAction<TData>(
    operation: () => AppResult<TData>,
    options?: { invalidate?: InvalidateResolver<TData, undefined> }
  ): AppResult<TData> {
    return contextAction(okAsync(undefined), () => operation(), {
      invalidate: options?.invalidate,
    })
  }

  function authAction<TData>(
    operation: (principal: TPrincipal) => AppResult<TData>,
    options?: { invalidate?: InvalidateResolver<TData, TPrincipal> }
  ): AppResult<TData> {
    return contextAction(principalContext(), operation, {
      invalidate: options?.invalidate,
    })
  }

  function ownedAction<TResource, TData>(
    options: OwnedActionOptions<TPrincipal, TResource, TData>
  ): AppResult<TData> {
    const entityName = options.entityName ?? "resource"
    const context = principalContext().andThen((principal) =>
      options
        .loadResource()
        .andThen((resource) => requireValue(resource, dalNotFound(entityName)))
        .andThen((resource) =>
          requireCondition(
            options.ownerId(resource) === principal.id,
            forbiddenError()
          ).map(() => ({ principal, resource }))
        )
    )

    return contextAction(
      context,
      ({ principal, resource }) => options.operation({ principal, resource }),
      {
        invalidate: options.invalidate,
      }
    )
  }

  async function toSerialized<TData>(
    result: AppResult<TData>
  ): Promise<
    { success: true; data: TData } | { success: false; error: AppError }
  > {
    return await result.match(
      (data) => ({ success: true as const, data }),
      (error) => ({ success: false as const, error })
    )
  }

  return {
    authAction,
    contextAction,
    ownedAction,
    publicAction,
    requireCondition,
    requireValue,
    safe,
    toSerialized,
    validate,
  }
}
