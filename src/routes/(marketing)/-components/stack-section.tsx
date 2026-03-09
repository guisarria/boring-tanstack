import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"

const stack = [
  {
    name: "TanStack Start",
    description: "A full-stack framework powered by TanStack Router and Vite.",
    icon: Icons.tanStack,
  },
  {
    name: "TypeScript",
    description: "End-to-end type safety across client and server.",
    icon: Icons.typeScript,
  },
  {
    name: "Drizzle ORM",
    description:
      "A lightweight and performant TypeScript ORM with developer experience in mind.",
    icon: Icons.drizzle,
  },
  {
    name: "Neon",
    description: "Fast Postgres databases for teams and agents.",
    icon: Icons.neon,
  },
  {
    name: "Better Auth",
    description:
      "A framework-agnostic, universal authentication and authorization framework for TypeScript.",
    icon: Icons.betterAuth,
  },
  {
    name: "Tailwind CSS",
    description: "A utility-first CSS framework.",
    icon: Icons.tailwind,
  },
  {
    name: "Base UI",
    description:
      "An open-source React component library for building accessible user interfaces.",
    icon: Icons.baseui,
  },
  {
    name: "Zod",
    description:
      "TypeScript-first schema validation with static type inference.",
    icon: Icons.zod,
  },
  {
    name: "shadcn/ui",
    description:
      "A set of beautifully designed components that you can customize, extend, and build on.",
    icon: Icons.shadcn,
  },
]

function StackSection() {
  return (
    <section className="container flex w-full flex-col gap-y-8 py-24">
      <div className="flex flex-col gap-y-2">
        <h2 className="font-bold text-2xl tracking-tight">The Stack</h2>
        <p className="text-muted-foreground">
          Built with modern, production-ready tools so you can focus on
          shipping.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stack.map((item) => (
          <Card key={item.name}>
            <CardHeader>
              <div className="flex items-center gap-x-3">
                <item.icon className="size-6 shrink-0" />
                <CardTitle>{item.name}</CardTitle>
              </div>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}

export { StackSection }
