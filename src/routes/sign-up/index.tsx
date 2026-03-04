import { createFileRoute } from "@tanstack/react-router"
import { SignUpForm } from "@/modules/auth/components/sign-up-form"

export const Route = createFileRoute("/sign-up/")({
  component: RouteComponent,
})

export default function RouteComponent() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 pb-12">
      <SignUpForm />
    </div>
  )
}
