import { createFileRoute } from "@tanstack/react-router"
import { SignUpForm } from "@/modules/auth/components/sign-up-form"

export const Route = createFileRoute("/(auth)/sign-up/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <SignUpForm />
    </div>
  )
}
