import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed/dashboard/models")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/dashboard/models"!</div>
}
