import { createServerOnlyFn } from "@tanstack/react-start"
import { desc, eq } from "drizzle-orm"
import { db } from "@/db"
import { todos } from "@/db/schema/todos.schema"
import { createDal } from "@/server/dal"
import type { Todo } from "./todos-contract"
import type { TodoRepository } from "./todos-repository"

const todoDal = createDal("todo")

function toTodo(row: typeof todos.$inferSelect): Todo {
  return {
    createdAt: row.createdAt ? row.createdAt.toISOString() : null,
    id: row.id,
    title: row.title,
  }
}

const createTodosRepositoryImpl = (): TodoRepository => {
  return {
    list: () =>
      todoDal
        .run("list", () =>
          db.select().from(todos).orderBy(desc(todos.createdAt))
        )
        .map((rows) => rows.map(toTodo)),

    findById: (id) =>
      todoDal
        .run("get", () =>
          db.select().from(todos).where(eq(todos.id, id)).limit(1)
        )
        .andThen((rows) =>
          todoDal.requireFound(rows[0], { key: "id", value: id })
        )
        .map(toTodo),

    create: (title) =>
      todoDal
        .run("create", () => db.insert(todos).values({ title }).returning())
        .andThen((rows) =>
          todoDal.requireFound(rows[0], { key: "title", value: title })
        )
        .map(toTodo),

    rename: (id, title) =>
      todoDal
        .run("rename", () =>
          db.update(todos).set({ title }).where(eq(todos.id, id)).returning()
        )
        .andThen((rows) =>
          todoDal.requireFound(rows[0], { key: "id", value: id })
        )
        .map(toTodo),

    delete: (id) =>
      todoDal
        .run("delete", () =>
          db.delete(todos).where(eq(todos.id, id)).returning({ id: todos.id })
        )
        .andThen((rows) =>
          todoDal.requireFound(rows[0], { key: "id", value: id })
        ),
  }
}

export const createTodosRepository = createServerOnlyFn(
  createTodosRepositoryImpl
)
