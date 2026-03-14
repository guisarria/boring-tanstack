import { createFileRoute } from "@tanstack/react-router"

import { Container, Section } from "@/components/ui/design-system"
import { ChangePassword } from "@/modules/auth/components/change-password-form"

export const Route = createFileRoute("/_auth/settings/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Section>
      <Container className="max-w-lg">
        <ChangePassword />
      </Container>
    </Section>
  )
}
