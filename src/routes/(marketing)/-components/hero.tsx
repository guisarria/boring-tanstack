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
  title = "Bootstrap your app with the best defaults",
  description = "TanStack Start template",
  primaryCTA = { label: "Get Started", href: "/sign-up" },
}: HeroProps) {
  const { user } = Route.useRouteContext()

  return (
    <section className="container relative flex w-full items-center justify-between py-60">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-6">
          <h1 className="w-4/6 font-bold text-4xl text-foreground tracking-tight sm:text-5xl lg:text-6xl">
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
          </div>
        </div>
      </div>
      <DitherCanvas />
    </section>
  )
}

export { Hero }
