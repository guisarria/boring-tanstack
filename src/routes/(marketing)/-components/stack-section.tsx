import type { ComponentType } from "react"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Container, Section } from "@/components/ui/design-system"
import { Icons, type IconProps } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

type Library = {
  name: string
  description: string
  icon: ComponentType<IconProps>
  documentationUrl?: `https://${string}`
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
      "Universal authentication and authorization framework for TypeScript.",
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
    description:
      "The unified toolchain. It manages your runtime, package manager, and frontend toolchain in one place",
    icon: Icons.viteplus,
    documentationUrl: "https://vite.dev",
  },
  {
    name: "Oxlint",
    description:
      "A high-performance linter for JavaScript and TypeScript built on the Oxc compiler stack.",
    icon: Icons.oxlint,
    documentationUrl: "https://oxc.rs",
  },
  {
    name: "Oxfmt",
    description:
      "A high-performance formatter for the JavaScript ecosystem, part of the Oxc toolchain.",
    icon: Icons.oxfmt,
    documentationUrl: "https://oxc.rs/docs/guide/usage/linter.html",
  },
  {
    name: "Nitro",
    description:
      "The next-generation server engine for building ultra-fast web applications and APIs.",
    icon: Icons.nitro,
    documentationUrl: "https://nitro.unjs.io",
  },
  {
    name: "Resend",
    description:
      "The email API for developers, designed for modern web workflows and deliverability.",
    icon: Icons.resend,
    documentationUrl: "https://resend.com/docs",
  },
  {
    name: "",
    description: "",
    icon: Icons.voidLogo,
  },
] satisfies Library[]

function StackSection() {
  return (
    <Section>
      <Container className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-2">
          <h2 className="font-pixel text-4xl tracking-tight lg:text-5xl">
            The Stack
          </h2>
          <p className="text-muted-foreground text-lg">
            Built with modern, production-ready tools so you can focus on
            shipping.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:[&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1">
          {stack.map(
            ({ name, description, icon: Icon, documentationUrl }, index) => {
              const isLast = index === stack.length - 1

              return (
                <Card
                  key={name || index}
                  className={cn(
                    "flex  min-h-40 flex-col justify-between ",
                    isLast && [
                      "relative overflow-visible outline-none transform-[translateZ(0)]",

                      "before:content-[''] before:absolute before:-inset-px before:-z-2 before:bg-[url('./assets/void-background.jpg')] before:bg-center before:bg-size-[150%_150%] before:rounded-lg before:animate-[move-background_16s_ease-in-out_infinite]",

                      "after:content-[''] border-transparent after:absolute after:inset-1 after:-z-1 after:rounded-[7px] after:bg-card dark:after:bg-[#1F1F1F]",

                      "justify-center items-center",
                    ],
                  )}
                >
                  {!isLast ? (
                    <CardHeader className="gap-y-2">
                      <div className="flex items-center gap-x-3">
                        <Icon className="size-6 shrink-0" />
                        <CardTitle className="text-base">{name}</CardTitle>
                      </div>
                      <CardDescription className="text-sm">
                        {description}
                      </CardDescription>
                    </CardHeader>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center lg:-top-4">
                      <Icon className="dark:fill-foreground size-12 fill-[#1F1F1F]" />
                    </div>
                  )}

                  <CardContent
                    className={cn(
                      "z-10 w-full flex justify-end",
                      isLast ? "absolute bottom-0 right-0  pb-2.5" : "self-end",
                    )}
                  >
                    {documentationUrl ? (
                      <a
                        className={cn(
                          buttonVariants({ variant: "link" }),
                          "px-0",
                        )}
                        href={documentationUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Documentation
                      </a>
                    ) : isLast ? (
                      <span className="text-muted-foreground/50 font-mono text-sm tracking-tighter">
                        Soon...
                      </span>
                    ) : null}
                  </CardContent>
                </Card>
              )
            },
          )}
        </div>
      </Container>
    </Section>
  )
}
export { StackSection }
