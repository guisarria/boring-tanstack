import { createFileRoute } from "@tanstack/react-router"

import { Main } from "@/components/ui/design-system"
import { Hero } from "@/routes/(marketing)/-components/hero"
import { StackSection } from "@/routes/(marketing)/-components/stack-section"

import { BlurOverlay } from "./-components/blur-overlay"
import { CloneRepository } from "./-components/clone-repository-section"
import { Footer } from "./-components/footer"

export const Route = createFileRoute("/(marketing)/")({ component: Index })

function Index() {
  return (
    <>
      <Main className="flex flex-col items-center gap-y-20">
        <Hero />
        <StackSection />
        <CloneRepository />
      </Main>
      <Footer />
      <BlurOverlay position="both" size={85} />
    </>
  )
}
