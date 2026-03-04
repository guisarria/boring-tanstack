import { createFileRoute, Link } from "@tanstack/react-router"
import { ThemeToggle } from "@/components/theme-toggle"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <main className="page-wrap mx-auto flex max-w-3xl flex-col gap-4 px-4 pt-14 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl">Boring TanStack</h1>
        <ThemeToggle />
      </div>
      <div>
        <Link to="/sign-in">Go</Link>
      </div>
    </main>
  )
}
