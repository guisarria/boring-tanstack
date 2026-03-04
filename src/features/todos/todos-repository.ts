import type { AppError } from "@/server/errors"
import type { AsyncResult } from "@/server/result"
import type { Todo } from "./todos-contract"

export type TodoRepository = {
  create: (title: string) => AsyncResult<Todo, AppError>
  delete: (id: number) => AsyncResult<{ id: number }, AppError>
  findById: (id: number) => AsyncResult<Todo, AppError>
  list: () => AsyncResult<Todo[], AppError>
  rename: (id: number, title: string) => AsyncResult<Todo, AppError>
}
