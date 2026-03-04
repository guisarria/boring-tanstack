import { createFileRoute } from "@tanstack/react-router"
import { SignInForm } from "@/modules/auth/components/sign-in-form"

export const Route = createFileRoute("/(auth)/sign-in/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <SignInForm />
    </div>
  )
}
