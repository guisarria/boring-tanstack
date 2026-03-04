import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import {
  getPublicErrorCode,
  getPublicErrorMessage,
} from "@/config/helpers/rpc-client"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  createTodoMutationOptions,
  deleteTodoMutationOptions,
  renameTodoMutationOptions,
  type Todo,
  todosQueryOptions,
} from "@/features/todos"

export const Route = createFileRoute("/todos")({
  loader: async ({ context }) => {
    await context.queryClient
      .ensureQueryData(todosQueryOptions())
      .catch(() => undefined)
  },
  component: TodosPage,
})

function formatErrorMessage(error: unknown): string {
  return getPublicErrorMessage(error)
}

function formatErrorHint(error: unknown): string | null {
  if (getPublicErrorCode(error) === "DATABASE_ERROR") {
    return "Check DATABASE_URL and run migrations for the todos table."
  }

  return null
}

type TodoRowProps = {
  isDeleting: boolean
  isRenaming: boolean
  onDelete: (id: number) => Promise<void>
  onRename: (id: number, title: string) => Promise<void>
  todo: Todo
}

function TodoRow({
  isDeleting,
  isRenaming,
  onDelete,
  onRename,
  todo,
}: TodoRowProps) {
  const [title, setTitle] = useState(todo.title)

  useEffect(() => {
    setTitle(todo.title)
  }, [todo.title])

  const normalizedTitle = title.trim().replace(/\s+/g, " ")
  const isDirty = normalizedTitle.length > 0 && normalizedTitle !== todo.title
  const isBusy = isDeleting || isRenaming

  return (
    <li className="flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
      <form
        className="flex w-full items-center gap-2"
        onSubmit={async (event) => {
          event.preventDefault()
          if (!isDirty || isBusy) {
            return
          }

          await onRename(todo.id, normalizedTitle)
        }}
      >
        <Input
          aria-label={`Edit todo ${todo.id}`}
          disabled={isBusy}
          onChange={(event) => setTitle(event.currentTarget.value)}
          value={title}
        />
        <Button disabled={!isDirty || isBusy} type="submit" variant="outline">
          {isRenaming ? <Spinner className="size-4" /> : "Save"}
        </Button>
      </form>
      <Button
        disabled={isBusy}
        onClick={async () => await onDelete(todo.id)}
        variant="destructive"
      >
        {isDeleting ? <Spinner className="size-4" /> : "Delete"}
      </Button>
    </li>
  )
}

function TodosPage() {
  const queryClient = useQueryClient()

  const todos = useQuery(todosQueryOptions())
  const createTodo = useMutation(createTodoMutationOptions(queryClient))
  const renameTodo = useMutation(renameTodoMutationOptions(queryClient))
  const deleteTodo = useMutation(deleteTodoMutationOptions(queryClient))

  const [newTitle, setNewTitle] = useState("")
  const [renamingId, setRenamingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const handleCreate = async () => {
    const title = newTitle.trim()
    if (title.length === 0 || createTodo.isPending) {
      return
    }

    setActionError(null)

    try {
      await createTodo.mutateAsync({ title })
      setNewTitle("")
    } catch (error) {
      setActionError(formatErrorMessage(error))
    }
  }

  const handleRename = async (id: number, title: string) => {
    if (renameTodo.isPending) {
      return
    }

    setActionError(null)
    setRenamingId(id)

    try {
      await renameTodo.mutateAsync({ id, title })
    } catch (error) {
      setActionError(formatErrorMessage(error))
    } finally {
      setRenamingId(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (deleteTodo.isPending) {
      return
    }

    setActionError(null)
    setDeletingId(id)

    try {
      await deleteTodo.mutateAsync({ id })
    } catch (error) {
      setActionError(formatErrorMessage(error))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="page-wrap mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pt-14 pb-8">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl">Todos</h1>
          <p className="text-muted-foreground text-sm">
            Create, rename, and delete todos using the new RPC + DAL
            architecture.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className={buttonVariants({ size: "sm", variant: "ghost" })}
            to="/"
          >
            Home
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Create Todo</CardTitle>
          <CardDescription>
            Keep titles short and clear. Empty titles are rejected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex gap-2"
            onSubmit={async (event) => {
              event.preventDefault()
              await handleCreate()
            }}
          >
            <Input
              aria-label="Todo title"
              disabled={createTodo.isPending}
              onChange={(event) => setNewTitle(event.currentTarget.value)}
              placeholder="What needs to be done?"
              value={newTitle}
            />
            <Button disabled={createTodo.isPending} type="submit">
              {createTodo.isPending ? <Spinner className="size-4" /> : "Add"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
          <CardDescription>
            Each row supports inline rename and deletion.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {todos.isPending ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Spinner className="size-4" /> Loading todos...
            </div>
          ) : null}

          {todos.error ? (
            <div className="space-y-1">
              <p className="text-destructive text-sm">
                Failed to load todos: {formatErrorMessage(todos.error)}
              </p>
              {formatErrorHint(todos.error) ? (
                <p className="text-muted-foreground text-xs">
                  {formatErrorHint(todos.error)}
                </p>
              ) : null}
            </div>
          ) : null}

          {todos.data && todos.data.items.length === 0 ? (
            <p className="text-muted-foreground text-sm">No todos yet.</p>
          ) : null}

          {todos.data && todos.data.items.length > 0 ? (
            <ul className="space-y-2">
              {todos.data.items.map((todo) => (
                <TodoRow
                  isDeleting={deletingId === todo.id}
                  isRenaming={renamingId === todo.id}
                  key={todo.id}
                  onDelete={handleDelete}
                  onRename={handleRename}
                  todo={todo}
                />
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>

      {actionError ? (
        <p className="text-destructive text-sm" role="alert">
          {actionError}
        </p>
      ) : null}
    </main>
  )
}
