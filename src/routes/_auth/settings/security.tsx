import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/settings/security")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/settings/security"!</div>
}
