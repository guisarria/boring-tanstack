import { createFileRoute } from "@tanstack/react-router"
import { Main } from "@/components/ui/design-system"
import { Hero } from "@/routes/(marketing)/-components/hero"
import { StackSection } from "@/routes/(marketing)/-components/stack-section"
import { CloneRepository } from "./-components/clone-repository-section"
import { Footer } from "./-components/footer"

export const Route = createFileRoute("/(marketing)/")({ component: Index })

function Index() {
  return (
    <Main>
      <Hero />
      <StackSection />
      <CloneRepository />
      <Footer />
    </Main>
  )
}
