import { z } from "zod"
import {
  createRpcMutationWithInput,
  createRpcQuery,
  createRpcQueryWithInput,
  zodInputParser,
} from "@/server/rpc"

const todoIdSchema = z.object({
  id: z.number().int().positive(),
})

const createTodoSchema = z.object({
  title: z.string().trim().min(1).max(200),
})

const renameTodoSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1).max(200),
})

type TodoIdInput = z.infer<typeof todoIdSchema>
type CreateTodoInput = z.infer<typeof createTodoSchema>
type RenameTodoInput = z.infer<typeof renameTodoSchema>

export const listTodosRpc = createRpcQuery(async () => {
  const { listTodosDal } = await import("./todos-dal")
  return await listTodosDal()
})

export const getTodoRpc = createRpcQueryWithInput({
  parseInput: zodInputParser<TodoIdInput>(todoIdSchema),
  handler: async ({ input }: { input: TodoIdInput }) => {
    const { findTodoByIdDal } = await import("./todos-dal")
    return await findTodoByIdDal(input.id)
  },
})

export const createTodoRpc = createRpcMutationWithInput({
  parseInput: zodInputParser<CreateTodoInput>(createTodoSchema),
  handler: async ({ input }: { input: CreateTodoInput }) => {
    const { createTodoDal } = await import("./todos-dal")
    return await createTodoDal(input.title)
  },
})

export const renameTodoRpc = createRpcMutationWithInput({
  parseInput: zodInputParser<RenameTodoInput>(renameTodoSchema),
  handler: async ({ input }: { input: RenameTodoInput }) => {
    const { renameTodoDal } = await import("./todos-dal")
    return await renameTodoDal(input.id, input.title)
  },
})

export const deleteTodoRpc = createRpcMutationWithInput({
  parseInput: zodInputParser<TodoIdInput>(todoIdSchema),
  handler: async ({ input }: { input: TodoIdInput }) => {
    const { deleteTodoDal } = await import("./todos-dal")
    return await deleteTodoDal(input.id)
  },
})
