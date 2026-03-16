import { createFileRoute, redirect } from "@tanstack/react-router"

import { ForgotPasswordForm } from "@/modules/auth/components/forms/forgot-password-form"

export const Route = createFileRoute("/(marketing)/(auth)/forgot-password/")({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <ForgotPasswordForm />
}
