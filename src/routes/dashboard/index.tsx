import { createFileRoute } from "@tanstack/react-router"
import { ensureSession } from "@/modules/auth/auth.functions"
import { SignOutButton } from "@/modules/auth/components/sign-out-button"

export const Route = createFileRoute("/dashboard/")({
  loader: () => ensureSession(),
  component: RouteComponent,
})

function RouteComponent() {
  const session = Route.useLoaderData()
  return (
    <>
      <div>Hello {session.user.name}!</div>
      <SignOutButton />
    </>
  )
}
