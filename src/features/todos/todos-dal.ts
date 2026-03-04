import { createServerOnlyFn } from "@tanstack/react-start"
import { desc, eq } from "drizzle-orm"
import { db } from "@/db"
import { todos } from "@/db/schema"
import { createDal } from "@/server/dal"
import type { DalError } from "@/server/errors"
import type { AsyncResult } from "@/server/result"

export type Todo = typeof todos.$inferSelect

const todoDal = createDal("todo")

const listTodosDalImpl = (): AsyncResult<Todo[], DalError<"todo">> => {
  return todoDal.run("list", () =>
    db.select().from(todos).orderBy(desc(todos.createdAt))
  )
}

const findTodoByIdDalImpl = (
  id: number
): AsyncResult<Todo, DalError<"todo">> => {
  return todoDal
    .run("get", () => db.select().from(todos).where(eq(todos.id, id)).limit(1))
    .andThen((rows) => todoDal.requireFound(rows[0], { key: "id", value: id }))
}

const createTodoDalImpl = (
  title: string
): AsyncResult<Todo, DalError<"todo">> => {
  return todoDal
    .run("create", () => db.insert(todos).values({ title }).returning())
    .andThen((rows) =>
      todoDal.requireFound(rows[0], { key: "title", value: title })
    )
}

const renameTodoDalImpl = (
  id: number,
  title: string
): AsyncResult<Todo, DalError<"todo">> => {
  return todoDal
    .run("rename", () =>
      db.update(todos).set({ title }).where(eq(todos.id, id)).returning()
    )
    .andThen((rows) => todoDal.requireFound(rows[0], { key: "id", value: id }))
}

const deleteTodoDalImpl = (
  id: number
): AsyncResult<{ id: number }, DalError<"todo">> => {
  return todoDal
    .run("delete", () =>
      db.delete(todos).where(eq(todos.id, id)).returning({ id: todos.id })
    )
    .andThen((rows) => todoDal.requireFound(rows[0], { key: "id", value: id }))
}

export const listTodosDal = createServerOnlyFn(listTodosDalImpl)
export const findTodoByIdDal = createServerOnlyFn(findTodoByIdDalImpl)
export const createTodoDal = createServerOnlyFn(createTodoDalImpl)
export const renameTodoDal = createServerOnlyFn(renameTodoDalImpl)
export const deleteTodoDal = createServerOnlyFn(deleteTodoDalImpl)
