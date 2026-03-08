import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Route } from "../route"
import { DitherCanvas } from "./dither-canvas"

type HeroProps = {
  description?: string
  primaryCTA?: { label: string; href: string }
  secondaryCTA?: { label: string; href: string }
  title?: string
}

function Hero({
  title = "TanStack Start Template",
  description = "Bootstrap with the best defaults.",
  primaryCTA = { label: "Get Started", href: "/sign-up" },
  secondaryCTA = { label: "View Docs", href: "/docs" },
}: HeroProps) {
  const { user } = Route.useRouteContext()

  return (
    <section className="flex w-full items-center justify-between">
      <div className="flex items-center justify-between">
        <div className="flex h-full w-full flex-col gap-y-6">
          <h1 className="font-bold text-4xl text-foreground tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            {description}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button>
              <Link
                className="flex items-center gap-x-2"
                to={user ? "/dashboard" : primaryCTA.href}
              >
                {primaryCTA.label}
                <ChevronRight />
              </Link>
            </Button>
            <Button variant="outline">
              <Link to={secondaryCTA.href}>{secondaryCTA.label}</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <DitherCanvas />
      </div>
    </section>
  )
}

export { Hero }
