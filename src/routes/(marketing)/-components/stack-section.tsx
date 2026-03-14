import type { ComponentType } from "react"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Container, GlowText, Section } from "@/components/ui/design-system"
import { Icons, type IconProps } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

//TODO: Vite+ Oxc Oxfmt Nitro Resend React-email
type Library = {
  name: string
  description: string
  icon: ComponentType<IconProps>
  documentationUrl: `https://${string}`
}

const stack = [
  {
    name: "TanStack Start",
    description: "A full-stack framework powered by TanStack Router and Vite.",
    icon: Icons.tanStack,
    documentationUrl: "https://tanstack.com/start",
  },
  {
    name: "TypeScript",
    description: "End-to-end type safety across client and server.",
    icon: Icons.typeScript,
    documentationUrl: "https://www.typescriptlang.org/docs",
  },
  {
    name: "Drizzle ORM",
    description:
      "A lightweight and performant TypeScript ORM with developer experience in mind.",
    icon: Icons.drizzle,
    documentationUrl: "https://orm.drizzle.team/docs",
  },
  {
    name: "Neon",
    description: "Fast Postgres databases for teams and agents.",
    icon: Icons.neon,
    documentationUrl: "https://neon.com/docs",
  },
  {
    name: "Better Auth",
    description:
      "A framework-agnostic, universal authentication and authorization framework for TypeScript.",
    icon: Icons.betterAuth,
    documentationUrl: "https://better-auth.com/docs",
  },
  {
    name: "Tailwind CSS",
    description: "A utility-first CSS framework.",
    icon: Icons.tailwind,
    documentationUrl: "https://tailwindcss.com/docs",
  },
  {
    name: "Base UI",
    description:
      "An open-source React component library for building accessible user interfaces.",
    icon: Icons.baseui,
    documentationUrl: "https://base-ui.com/",
  },
  {
    name: "Zod",
    description:
      "TypeScript-first schema validation with static type inference.",
    icon: Icons.zod,
    documentationUrl: "https://zod.dev/",
  },
  {
    name: "shadcn/ui",
    description:
      "A set of beautifully designed components that you can customize, extend, and build on.",
    icon: Icons.shadcn,
    documentationUrl: "https://ui.shadcn.com/docs",
  },
  {
    name: "Vite+",
    description: "test",
    icon: Icons.viteplus,
    documentationUrl: "https://",
  },
] satisfies Library[]

function StackSection() {
  return (
    <Section>
      <Container className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-2">
          <GlowText className="text-4xl lg:text-5xl">The Stack</GlowText>
          <p className="text-muted-foreground text-lg">
            Built with modern, production-ready tools so you can focus on
            shipping.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:[&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1">
          {stack.map(({ name, description, icon: Icon, documentationUrl }) => (
            <Card className="flex w-full flex-col justify-between" key={name}>
              <CardHeader className="gap-y-2">
                <div className="flex items-center gap-x-3">
                  <Icon className="size-6 shrink-0" />
                  <CardTitle className="text-base">{name}</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent className="self-end">
                <a
                  className={cn(buttonVariants({ variant: "link" }), "px-0")}
                  href={documentationUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Documentation
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export { StackSection }
