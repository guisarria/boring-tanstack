import { z } from "zod"

export const todoIdSchema = z.object({
  id: z.number().int().positive(),
})

export const createTodoSchema = z.object({
  title: z.string().trim().min(1).max(200),
})

export const renameTodoSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1).max(200),
})

export const listTodosSchema = z.object({
  cursor: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(100).default(50),
})

export type TodoIdInput = z.infer<typeof todoIdSchema>
export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type RenameTodoInput = z.infer<typeof renameTodoSchema>
export type ListTodosInput = z.infer<typeof listTodosSchema>

export type Todo = {
  createdAt: string | null
  id: number
  title: string
}

export type TodoPage = {
  items: Todo[]
  nextCursor: number | null
}

export const todoQueryKeys = {
  all: ["todos"] as const,
  list: (input: ListTodosInput) =>
    ["todos", "list", input.limit, input.cursor ?? null] as const,
  detail: (id: number) => ["todos", id] as const,
}
