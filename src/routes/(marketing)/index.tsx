import { createFileRoute } from "@tanstack/react-router"
import { BlurOverlay } from "@/components/blur-overlay"
import { Hero } from "@/routes/(marketing)/-components/hero"
import { StackSection } from "@/routes/(marketing)/-components/stack-section"
import { CloneRepository } from "./-components/clone-repository-section"
import { Footer } from "./-components/footer"

export const Route = createFileRoute("/(marketing)/")({ component: Index })

function Index() {
  return (
    <div className="container flex h-full w-full flex-col items-start justify-start">
      <Hero />
      <StackSection />
      <CloneRepository />
      <Footer />
      <BlurOverlay position="both" size={85} />
    </div>
  )
}
