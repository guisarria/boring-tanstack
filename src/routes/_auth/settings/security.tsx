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
      <Container className="flex max-w-lg flex-col gap-y-6">
        <h1 className="text-2xl">Security</h1>
        <AccountSessions sessionId={sessionId} sessions={sessions} />
      </Container>
    </Section>
  )
}
