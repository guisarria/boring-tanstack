import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <main className="page-wrap px-4 pt-14 pb-8">
      <h1 className="font-bold text-4xl">aaa</h1>
    </main>
  )
}
