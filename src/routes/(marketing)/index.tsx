import { createFileRoute } from "@tanstack/react-router"
import { Hero } from "@/routes/(marketing)/-components/hero"
import { StackSection } from "@/routes/(marketing)/-components/stack-section"
import { Footer } from "./-components/footer"

export const Route = createFileRoute("/(marketing)/")({ component: Index })

function Index() {
  return (
    <div className="container flex h-full w-full flex-col items-start justify-start">
      <Hero />
      <StackSection />
      <Footer />
    </div>
  )
}
