import { createFileRoute } from "@tanstack/react-router"
import { sessionsAction } from "@/modules/auth/auth.functions"
import { AccountSessions } from "./-components/account-sessions"

export const Route = createFileRoute("/_auth/settings/security")({
  beforeLoad: async ({ context }) => {
    return await context.queryClient.fetchQuery({
      queryKey: ["sessions"],
      queryFn: ({ signal }) => sessionsAction({ signal }),
    })
  },

  component: RouteComponent,
})

function RouteComponent() {
  const { sessions, sessionId } = Route.useRouteContext()

  return (
    <div>
      <AccountSessions sessionId={sessionId} sessions={sessions} />
    </div>
  )
}
