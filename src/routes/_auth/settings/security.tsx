import { createFileRoute } from "@tanstack/react-router"

import { Container, Section } from "@/components/ui/design-system"
import { AccountSessions } from "@/modules/auth/components/account-sessions"
import { getActiveSessions } from "@/modules/auth/functions"

export const Route = createFileRoute("/_auth/settings/security")({
  beforeLoad: async ({ context }) => {
    return await context.queryClient.fetchQuery({
      queryKey: ["sessions"],
      queryFn: ({ signal }) => getActiveSessions({ signal }),
    })
  },

  component: RouteComponent,
})

function RouteComponent() {
  const { sessions, sessionId } = Route.useRouteContext()

  return (
    <Section>
      <Container className="flex max-w-lg flex-col gap-y-6">
        <h2 className="text-2xl">Security</h2>
        <AccountSessions sessionId={sessionId} sessions={sessions} />
      </Container>
    </Section>
  )
}
