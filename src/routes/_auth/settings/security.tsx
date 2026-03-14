import { createFileRoute } from "@tanstack/react-router"

import { Container, Section } from "@/components/ui/design-system"
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
    <Section>
      <Container>
        <AccountSessions sessionId={sessionId} sessions={sessions} />
      </Container>
    </Section>
  )
}
