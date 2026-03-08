import { createFileRoute } from "@tanstack/react-router"
import { Hero } from "@/routes/(marketing)/-components/hero"

export const Route = createFileRoute("/(marketing)/")({ component: Index })

function Index() {
  return (
    <div className="container relative flex h-full w-full flex-col items-start justify-start">
      <Hero />
    </div>
  )
}
