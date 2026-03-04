import {
  mutationOptions,
  type QueryClient,
  queryOptions,
} from "@tanstack/react-query"
import type { PublicError } from "@/server/errors"
import type { RpcResponse } from "@/server/rpc"
import { unwrapRpcResponse } from "@/server/rpc"
import type {
  CreateTodoInput,
  RenameTodoInput,
  Todo,
  TodoIdInput,
} from "./todos-contract"
import { todoQueryKeys } from "./todos-contract"
import {
  createTodoRpc,
  deleteTodoRpc,
  getTodoRpc,
  listTodosRpc,
  renameTodoRpc,
} from "./todos-rpc"

export class RpcClientError extends Error {
  readonly payload: PublicError

  constructor(payload: PublicError) {
    super(payload.message)
    this.name = "RpcClientError"
    this.payload = payload
  }
}

function unwrapOrThrow<TData>(response: RpcResponse<TData>): TData {
  const result = unwrapRpcResponse(response)

  if (result.isErr()) {
    throw new RpcClientError(result.error)
  }

  return result.value
}

export const todosQueryOptions = () =>
  queryOptions({
    queryKey: todoQueryKeys.all,
    queryFn: async () => unwrapOrThrow<Todo[]>(await listTodosRpc()),
  })

export const todoQueryOptions = (input: TodoIdInput) =>
  queryOptions({
    queryKey: todoQueryKeys.detail(input.id),
    queryFn: async () => unwrapOrThrow<Todo>(await getTodoRpc({ data: input })),
  })

export const createTodoMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: async (input: CreateTodoInput) =>
      unwrapOrThrow<Todo>(await createTodoRpc({ data: input })),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: todoQueryKeys.all })
    },
  })

export const renameTodoMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: async (input: RenameTodoInput) =>
      unwrapOrThrow<Todo>(await renameTodoRpc({ data: input })),
    onSuccess: async (todo: Todo) => {
      await queryClient.invalidateQueries({ queryKey: todoQueryKeys.all })
      await queryClient.invalidateQueries({
        queryKey: todoQueryKeys.detail(todo.id),
      })
    },
  })

export const deleteTodoMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: async (input: TodoIdInput) =>
      unwrapOrThrow<{ id: number }>(await deleteTodoRpc({ data: input })),
    onSuccess: async (payload) => {
      await queryClient.invalidateQueries({ queryKey: todoQueryKeys.all })
      await queryClient.removeQueries({
        queryKey: todoQueryKeys.detail(payload.id),
      })
    },
  })
