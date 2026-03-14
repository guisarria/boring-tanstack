import { createFileRoute, redirect } from "@tanstack/react-router"

import { SignUpForm } from "@/modules/auth/components/sign-up-form"

export const Route = createFileRoute("/(marketing)/(auth)/sign-up/")({
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
      <SignUpForm />
    </div>
  )
}
