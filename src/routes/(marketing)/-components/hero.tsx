import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container, GlowText, Section } from "@/components/ui/design-system"
import { Route } from "../route"
import { DitherCanvas } from "./dither-canvas"

type HeroProps = {
  description?: string
  primaryCTA?: { label: string; href: string }
  secondaryCTA?: { label: string; href: string }
  title?: string
}

function Hero({
  primaryCTA = { label: "Get Started", href: "/sign-up" },
}: HeroProps) {
  const { user } = Route.useRouteContext()

  return (
    <Section className="relative max-w-5xl pt-68 pb-34">
      <Container>
        <div className="flex flex-col gap-y-2">
          <GlowText as="h1" className="">
            Bootstrap your app
            <br /> with the best defaults
          </GlowText>
          <p className="text-lg text-muted-foreground">
            TanStack Start template
          </p>
          <div className="mt-4">
            <Button
              nativeButton={false}
              render={
                <Link
                  className="flex items-center gap-x-2"
                  to={user ? "/dashboard" : primaryCTA.href}
                >
                  {primaryCTA.label}
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
