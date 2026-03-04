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

export type TodoIdInput = z.infer<typeof todoIdSchema>
export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type RenameTodoInput = z.infer<typeof renameTodoSchema>

export type Todo = {
  createdAt: string | null
  id: number
  title: string
}

export const todoTags = {
  all: ["todos"] as const,
  detail: (id: number) => [`todo:${id}`] as const,
  fromId: (id: number) => ["todos", `todo:${id}`] as const,
}

export const todoQueryKeys = {
  all: ["todos"] as const,
  detail: (id: number) => ["todos", id] as const,
}
