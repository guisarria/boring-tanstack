import { Link } from "@tanstack/react-router"
import { ChevronRight, Terminal } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function CLITerminal() {
  const [isHovered, setIsHovered] = useState(false)

  const lines = [
    { type: "command", content: "$ npm create boring-app" },
    { type: "output", content: "✓ Project initialized" },
    { type: "command", content: "$ boring add auth" },
    { type: "output", content: "? Select provider: GitHub, Google, Email" },
    { type: "cursor", content: "" },
  ]

  return (
    <Card
      className={cn("rounded-lg border border-border bg-muted")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between border-border border-b bg-muted/80 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-muted-foreground/30 transition-colors hover:bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-muted-foreground/30 transition-colors hover:bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-muted-foreground/30 transition-colors hover:bg-green-500" />
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Terminal className="size-3" />
            <span>Terminal</span>
          </div>
        </div>
      </div>

      <div className="p-4 font-mono text-sm">
        {lines.map((line) => (
          <div
            className={cn(
              "rounded px-1 py-0.5 transition-colors duration-200",
              line.type === "command" && "text-foreground",
              line.type === "output" && "text-muted-foreground",
              line.type === "cursor" && "h-4",
              line.type !== "cursor" && "hover:bg-muted/50"
            )}
            key={line.type + line.content}
          >
            {line.type === "command" && (
              <span className="mr-2 text-primary">›</span>
            )}
            {line.content}
            {line.type === "cursor" && isHovered && (
              <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-primary" />
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

type HeroProps = {
  description?: string
  primaryCTA?: { label: string; href: string }
  secondaryCTA?: { label: string; href: string }
  title?: string
}

function Hero({
  title = "Build something boring",
  description = "The CLI that does nothing, beautifully. Just kidding, it does plenty, but with minimal fuss.",
  primaryCTA = { label: "Get Started", href: "/sign-up" },
  secondaryCTA = { label: "View Docs", href: "/docs" },
}: HeroProps) {
  return (
    <section className="flex w-full py-16 lg:py-24">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-6">
          <h1 className="font-bold text-4xl text-foreground tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            {description}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="flex gap-x-2"
              render={
                <Link to={primaryCTA.href}>
                  {primaryCTA.label}
                  <ChevronRight />
                </Link>
              }
              size="lg"
            />
            <Button size="lg" variant="outline">
              <Link to={secondaryCTA.href}>{secondaryCTA.label}</Link>
            </Button>
          </div>
        </div>

        <CLITerminal />
      </div>
    </section>
  )
}

export { Hero, CLITerminal }
