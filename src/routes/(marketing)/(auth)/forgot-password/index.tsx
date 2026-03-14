import { createFileRoute, redirect } from "@tanstack/react-router"

import { ForgotPasswordForm } from "@/modules/auth/components/forgot-password-form"

export const Route = createFileRoute("/(marketing)/(auth)/forgot-password/")({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <ForgotPasswordForm />
    </div>
  )
}
