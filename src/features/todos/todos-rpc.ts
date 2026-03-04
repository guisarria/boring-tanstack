import {
  createRpcMutationWithInput,
  createRpcQuery,
  createRpcQueryWithInput,
  zodInputParser,
} from "@/server/rpc"
import {
  type CreateTodoInput,
  createTodoSchema,
  type RenameTodoInput,
  renameTodoSchema,
  type TodoIdInput,
  todoIdSchema,
} from "./todos-contract"

async function resolveTodosUseCases() {
  const { getTodosUseCases } = await import("./todos-composition.server")
  return getTodosUseCases()
}

export const listTodosRpc = createRpcQuery(async () => {
  const useCases = await resolveTodosUseCases()
  return useCases.list()
})

export const getTodoRpc = createRpcQueryWithInput({
  parseInput: zodInputParser<TodoIdInput>(todoIdSchema),
  handler: async ({ input }: { input: TodoIdInput }) => {
    const useCases = await resolveTodosUseCases()
    return useCases.getById(input)
  },
})

export const createTodoRpc = createRpcMutationWithInput({
  parseInput: zodInputParser<CreateTodoInput>(createTodoSchema),
  handler: async ({ input }: { input: CreateTodoInput }) => {
    const useCases = await resolveTodosUseCases()
    return useCases.create(input)
  },
})

export const renameTodoRpc = createRpcMutationWithInput({
  parseInput: zodInputParser<RenameTodoInput>(renameTodoSchema),
  handler: async ({ input }: { input: RenameTodoInput }) => {
    const useCases = await resolveTodosUseCases()
    return useCases.rename(input)
  },
})

export const deleteTodoRpc = createRpcMutationWithInput({
  parseInput: zodInputParser<TodoIdInput>(todoIdSchema),
  handler: async ({ input }: { input: TodoIdInput }) => {
    const useCases = await resolveTodosUseCases()
    return useCases.delete(input)
  },
})
