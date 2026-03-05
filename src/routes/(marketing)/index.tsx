import { createFileRoute } from "@tanstack/react-router"
import { Hero } from "@/routes/(marketing)/-components/hero"

export const Route = createFileRoute("/(marketing)/")({ component: Index })

function Index() {
  return (
    <div className="container flex w-full items-center justify-between">
      <Hero />
    </div>
  )
}
