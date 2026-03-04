import { createFileRoute, Link } from "@tanstack/react-router"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <main className="page-wrap mx-auto flex max-w-3xl flex-col gap-4 px-4 pt-14 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl">Boring TanStack</h1>
        <ThemeToggle />
      </div>
      <p className="text-muted-foreground text-sm">
        Starter project with feature-sliced RPC/DAL architecture.
      </p>
      <div>
        <Link className={buttonVariants({ variant: "outline" })} to="/todos">
          Open Todo Page
        </Link>
      </div>
    </main>
  )
}
