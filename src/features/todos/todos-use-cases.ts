import { err, ok } from "neverthrow"
import type { ActionKit } from "@/server/action-kit"
import type { AppError } from "@/server/errors"
import type { AsyncResult } from "@/server/result"
import type {
  CreateTodoInput,
  RenameTodoInput,
  Todo,
  TodoIdInput,
} from "./todos-contract"
import { todoTags } from "./todos-contract"
import type { TodoRepository } from "./todos-repository"

type TodoPrincipal = { id: string }

export type TodoUseCases = {
  create: (input: CreateTodoInput) => AsyncResult<Todo, AppError>
  delete: (input: TodoIdInput) => AsyncResult<{ id: number }, AppError>
  getById: (input: TodoIdInput) => AsyncResult<Todo, AppError>
  list: () => AsyncResult<Todo[], AppError>
  rename: (input: RenameTodoInput) => AsyncResult<Todo, AppError>
}

type CreateTodoUseCasesDependencies = {
  actions: ActionKit<TodoPrincipal>
  repository: TodoRepository
}

function normalizeTitle(title: string): string {
  return title.trim().replace(/\s+/g, " ")
}

export function createTodoUseCases(
  dependencies: CreateTodoUseCasesDependencies
): TodoUseCases {
  const { actions, repository } = dependencies

  return {
    list: () => actions.publicAction(() => repository.list()),

    getById: (input) =>
      actions.publicAction(() => repository.findById(input.id)),

    create: (input) =>
      actions.publicAction(
        () =>
          actions
            .validate(input, (value) => {
              const title = normalizeTitle(value.title)

              if (title.length === 0) {
                return err("Title is required")
              }

              return ok({ title })
            })
            .andThen(({ title }) => repository.create(title)),
        {
          invalidate: todoTags.all,
        }
      ),

    rename: (input) =>
      actions.publicAction(
        () =>
          actions
            .validate(input, (value) => {
              const title = normalizeTitle(value.title)

              if (title.length === 0) {
                return err("Title is required")
              }

              return ok({ id: value.id, title })
            })
            .andThen(({ id, title }) => repository.rename(id, title)),
        {
          invalidate: (todo) => todoTags.fromId(todo.id),
        }
      ),

    delete: (input) =>
      actions.publicAction(() => repository.delete(input.id), {
        invalidate: (data) => todoTags.fromId(data.id),
      }),
  }
}
