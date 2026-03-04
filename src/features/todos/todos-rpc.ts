import {
  createRpcMutationWithInput,
  createRpcQueryWithInput,
  zodInputParser,
} from "@/config/helpers/rpc"
import {
  type CreateTodoInput,
  createTodoSchema,
  type ListTodosInput,
  listTodosSchema,
  type RenameTodoInput,
  renameTodoSchema,
  type TodoIdInput,
  todoIdSchema,
} from "./todos-contract"

async function resolveTodosServer() {
  return await import("./todos-operations")
}

export const listTodosRpc = createRpcQueryWithInput({
  parseInput: zodInputParser<ListTodosInput>(listTodosSchema),
  handler: async ({ input }: { input: ListTodosInput }) => {
    const todosServer = await resolveTodosServer()
    return todosServer.listTodos(input)
  },
})

export const getTodoRpc = createRpcQueryWithInput({
  parseInput: zodInputParser<TodoIdInput>(todoIdSchema),
  handler: async ({ input }: { input: TodoIdInput }) => {
    const todosServer = await resolveTodosServer()
    return todosServer.getTodoById(input)
  },
})

export const createTodoRpc = createRpcMutationWithInput({
  parseInput: zodInputParser<CreateTodoInput>(createTodoSchema),
  handler: async ({ input }: { input: CreateTodoInput }) => {
    const todosServer = await resolveTodosServer()
    return todosServer.createTodo(input)
  },
})

export const renameTodoRpc = createRpcMutationWithInput({
  parseInput: zodInputParser<RenameTodoInput>(renameTodoSchema),
  handler: async ({ input }: { input: RenameTodoInput }) => {
    const todosServer = await resolveTodosServer()
    return todosServer.renameTodo(input)
  },
})

export const deleteTodoRpc = createRpcMutationWithInput({
  parseInput: zodInputParser<TodoIdInput>(todoIdSchema),
  handler: async ({ input }: { input: TodoIdInput }) => {
    const todosServer = await resolveTodosServer()
    return todosServer.deleteTodo(input)
  },
})
