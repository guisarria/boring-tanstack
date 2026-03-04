import { createServerFn } from "@tanstack/react-start"
import { err, ok, type Result, type ResultAsync } from "neverthrow"
import {
  type AppError,
  internalError,
  isAppError,
  type PublicError,
  toPublicError,
  validationError,
} from "./errors"

type RpcMethod = "GET" | "POST"

type MaybeResult<TData, TError extends AppError> =
  | Result<TData, TError>
  | ResultAsync<TData, TError>
  | Promise<Result<TData, TError>>

export type RpcResponse<TData, TError extends PublicError = PublicError> =
  | { ok: true; data: TData }
  | { ok: false; error: TError }

export type InputParser<TInput, TValidationError extends AppError> = (
  rawInput: unknown
) => Result<TInput, TValidationError>

type ZodLikeSchema<TOutput> = {
  safeParse: (
    input: unknown
  ) =>
    | { success: true; data: TOutput }
    | { success: false; error: { flatten: () => unknown } }
}

function toErrorResponse(error: AppError): RpcResponse<never, PublicError> {
  return {
    ok: false,
    error: toPublicError(error),
  }
}

export function toRpcResponse<TData>(
  result: Result<TData, AppError>
): RpcResponse<TData, PublicError> {
  return result.match(
    (data) => ({ ok: true, data }),
    (error) => toErrorResponse(error)
  )
}

async function executeRpc<TData, TError extends AppError>(
  run: () => MaybeResult<TData, TError>
): Promise<RpcResponse<TData, PublicError>> {
  try {
    const result = (await run()) as Result<TData, AppError>
    return toRpcResponse(result)
  } catch (cause) {
    const safeError = isAppError(cause)
      ? cause
      : internalError("Unhandled RPC error", cause)

    return toErrorResponse(safeError)
  }
}

function createRpcFactory(method: RpcMethod) {
  return {
    withoutInput<TData, TError extends AppError>(
      handler: () => MaybeResult<TData, TError>
    ) {
      return createServerFn({ method }).handler(async () => {
        return (await executeRpc(handler)) as never
      })
    },

    withInput<
      TInput,
      TData,
      TError extends AppError,
      TValidationError extends AppError,
    >(options: {
      parseInput: InputParser<TInput, TValidationError>
      handler: (args: { input: TInput }) => MaybeResult<TData, TError>
    }) {
      return createServerFn({ method })
        .inputValidator((input) => input)
        .handler(async ({ data }) => {
          const parsedInput = options.parseInput(data)

          if (parsedInput.isErr()) {
            return toErrorResponse(parsedInput.error) as never
          }

          return (await executeRpc(() =>
            options.handler({ input: parsedInput.value })
          )) as never
        })
    },
  }
}

const queryFactory = createRpcFactory("GET")
const mutationFactory = createRpcFactory("POST")

export function createRpcQuery<TData, TError extends AppError>(
  handler: () => MaybeResult<TData, TError>
) {
  return queryFactory.withoutInput(handler)
}

export function createRpcQueryWithInput<
  TInput,
  TData,
  TError extends AppError,
  TValidationError extends AppError,
>(options: {
  parseInput: InputParser<TInput, TValidationError>
  handler: (args: { input: TInput }) => MaybeResult<TData, TError>
}) {
  return queryFactory.withInput(options)
}

export function createRpcMutation<TData, TError extends AppError>(
  handler: () => MaybeResult<TData, TError>
) {
  return mutationFactory.withoutInput(handler)
}

export function createRpcMutationWithInput<
  TInput,
  TData,
  TError extends AppError,
  TValidationError extends AppError,
>(options: {
  parseInput: InputParser<TInput, TValidationError>
  handler: (args: { input: TInput }) => MaybeResult<TData, TError>
}) {
  return mutationFactory.withInput(options)
}

export function zodInputParser<TInput>(
  schema: ZodLikeSchema<TInput>
): InputParser<TInput, AppError<"VALIDATION_ERROR", { issues?: unknown }>> {
  return (rawInput) => {
    const parsed = schema.safeParse(rawInput)

    if (!parsed.success) {
      return err(
        validationError("Invalid RPC input", {
          issues: parsed.error.flatten(),
        })
      )
    }

    return ok(parsed.data)
  }
}

export function unwrapRpcResponse<TData, TError extends PublicError>(
  response: RpcResponse<TData, TError>
): Result<TData, TError> {
  if (response.ok) {
    return ok(response.data)
  }

  return err(response.error)
}
