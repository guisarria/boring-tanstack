import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed/dashboard/inbox")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/dashboard/inbox"!</div>
}
