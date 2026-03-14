import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Container, Section } from "@/components/ui/design-system"

import { Route } from "../route"
import { DitherCanvas } from "./dither-canvas"

function Hero() {
  const { user } = Route.useRouteContext()

  return (
    <Section className="relative max-w-5xl pt-68 pb-34">
      <Container>
        <div className="flex flex-col gap-y-2">
          <h1 className="font-pixel text-5xl tracking-tight lg:text-6xl">
            Bootstrap your app
            <br /> with the best defaults
          </h1>
          <p className="text-muted-foreground text-lg">
            TanStack Start template
          </p>
          <div className="mt-4">
            <Button
              nativeButton={false}
              render={
                <Link
                  className="flex items-center gap-x-2"
                  to={user ? "/dashboard" : "/sign-up"}
                >
                  Get started
                  <ChevronRight />
                </Link>
              }
            />
          </div>
        </div>
      </Container>
      <DitherCanvas />
    </Section>
  )
}

export { Hero }
