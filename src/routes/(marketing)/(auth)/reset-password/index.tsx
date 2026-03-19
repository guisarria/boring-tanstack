import { createFileRoute, redirect } from "@tanstack/react-router"
import { z } from "zod"

import { ResetPasswordForm } from "@/modules/auth/components/forms/reset-password-form"

const resetPasswordErrors = ["INVALID_TOKEN"] as const

const searchSchema = z.object({
  token: z.string().optional(),
  error: z.enum(resetPasswordErrors).optional(),
})

export const Route = createFileRoute("/(marketing)/(auth)/reset-password/")({
  validateSearch: searchSchema,
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <ResetPasswordForm />
}
