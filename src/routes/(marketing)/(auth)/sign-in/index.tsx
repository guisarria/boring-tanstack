import { createFileRoute, redirect } from "@tanstack/react-router"
import { z } from "zod"

import { SignInForm } from "@/modules/auth/components/sign-in-form"

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute("/(marketing)/(auth)/sign-in/")({
  validateSearch: searchSchema,
  beforeLoad: ({ context, search }) => {
    if (context.user) {
      throw redirect({ to: search.redirect ?? "/dashboard" })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <SignInForm />
}
