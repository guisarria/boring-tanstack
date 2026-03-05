import { createFileRoute } from "@tanstack/react-router"
import { SignOutButton } from "@/modules/auth/components/sign-out-button"

export const Route = createFileRoute("/_authed/dashboard/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext()

  return (
    <>
      <div>Hello {user.name}!</div>
      <SignOutButton />
    </>
  )
}
