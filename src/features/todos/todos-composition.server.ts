import { createServerOnlyFn } from "@tanstack/react-start"
import { createActionKit } from "@/server/action-kit"
import { createTodosRepository } from "./todos-repository.server"
import { createTodoUseCases, type TodoUseCases } from "./todos-use-cases"

type TodoPrincipal = { id: string }

const getTodosUseCasesImpl = (): TodoUseCases => {
  const repository = createTodosRepository()
  const actions = createActionKit<TodoPrincipal>({
    // This feature is public for now. Keep the auth port in place so
    // auth/ownership rules can be switched on without changing use-cases.
    getPrincipal: async () => null,
    invalidateTags: async () => undefined,
  })

  return createTodoUseCases({
    actions,
    repository,
  })
}

export const getTodosUseCases = createServerOnlyFn(getTodosUseCasesImpl)
