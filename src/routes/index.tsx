import { createFileRoute } from "@tanstack/react-router"
import { ThemeToggle } from "@/components/theme-toggle"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <main className="page-wrap px-4 pt-14 pb-8">
      <ThemeToggle />
    </main>
  )
}
