import { desc, eq, lt } from "drizzle-orm"
import { createDal } from "@/config/helpers/dal"
import type { AppError } from "@/config/helpers/errors"
import type { AsyncResult } from "@/config/helpers/result"
import { db } from "@/db"
import { todos } from "@/db/schema"
import type {
  CreateTodoInput,
  ListTodosInput,
  RenameTodoInput,
  Todo,
  TodoIdInput,
  TodoPage,
} from "./todos-contract"

const todoDal = createDal("todo")

function normalizeTitle(title: string): string {
  return title.trim().replace(/\s+/g, " ")
}

function toIsoDate(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (typeof value === "string") {
    return value
  }

  const parsed = new Date(value as string | number)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed.toISOString()
}

function toTodo(row: typeof todos.$inferSelect): Todo {
  return {
    createdAt: toIsoDate(row.createdAt),
    id: row.id,
    title: row.title,
  }
}

function listRows(input: ListTodosInput) {
  const limit = input.limit + 1

  if (input.cursor === undefined) {
    return db.select().from(todos).orderBy(desc(todos.id)).limit(limit)
  }

  return db
    .select()
    .from(todos)
    .where(lt(todos.id, input.cursor))
    .orderBy(desc(todos.id))
    .limit(limit)
}

function toTodoPage(rows: typeof todos.$inferSelect[], limit: number): TodoPage {
  const hasNextPage = rows.length > limit
  const pageRows = hasNextPage ? rows.slice(0, limit) : rows
  const items = pageRows.map(toTodo)

  return {
    items,
    nextCursor: hasNextPage ? (items.at(-1)?.id ?? null) : null,
  }
}

export function listTodos(input: ListTodosInput): AsyncResult<TodoPage, AppError> {
  return todoDal
    .run("list", () => listRows(input))
    .map((rows) => toTodoPage(rows, input.limit))
}

export function getTodoById(input: TodoIdInput): AsyncResult<Todo, AppError> {
  return todoDal
    .run("get", () => db.select().from(todos).where(eq(todos.id, input.id)).limit(1))
    .andThen((rows) => todoDal.requireFound(rows[0], { key: "id", value: input.id }))
    .map(toTodo)
}

export function createTodo(input: CreateTodoInput): AsyncResult<Todo, AppError> {
  const title = normalizeTitle(input.title)

  return todoDal
    .run("create", () => db.insert(todos).values({ title }).returning())
    .andThen((rows) => todoDal.requireFound(rows[0], { key: "title", value: title }))
    .map(toTodo)
}

export function renameTodo(input: RenameTodoInput): AsyncResult<Todo, AppError> {
  const title = normalizeTitle(input.title)

  return todoDal
    .run("rename", () =>
      db.update(todos).set({ title }).where(eq(todos.id, input.id)).returning()
    )
    .andThen((rows) => todoDal.requireFound(rows[0], { key: "id", value: input.id }))
    .map(toTodo)
}

export function deleteTodo(
  input: TodoIdInput
): AsyncResult<{ id: number }, AppError> {
  return todoDal
    .run("delete", () =>
      db.delete(todos).where(eq(todos.id, input.id)).returning({ id: todos.id })
    )
    .andThen((rows) => todoDal.requireFound(rows[0], { key: "id", value: input.id }))
}
