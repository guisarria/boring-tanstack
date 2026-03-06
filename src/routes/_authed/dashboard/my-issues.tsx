import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed/dashboard/my-issues")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/dashboard/models"!</div>
}
