import {
  mutationOptions,
  type QueryClient,
  queryOptions,
} from "@tanstack/react-query"
import { unwrapOrThrow } from "@/config/helpers/rpc-client"
import type {
  CreateTodoInput,
  ListTodosInput,
  RenameTodoInput,
  Todo,
  TodoPage,
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

const DEFAULT_TODOS_PAGE_SIZE = 50

function normalizeListInput(input?: Partial<ListTodosInput>): ListTodosInput {
  return {
    cursor: input?.cursor,
    limit: input?.limit ?? DEFAULT_TODOS_PAGE_SIZE,
  }
}

export const todosQueryOptions = (input?: Partial<ListTodosInput>) => {
  const resolvedInput = normalizeListInput(input)

  return queryOptions({
    queryKey: todoQueryKeys.list(resolvedInput),
    queryFn: async () =>
      unwrapOrThrow<TodoPage>(await listTodosRpc({ data: resolvedInput })),
  })
}

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
