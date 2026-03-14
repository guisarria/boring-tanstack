import { createFileRoute } from "@tanstack/react-router"

import { Container, Section } from "@/components/ui/design-system"
import { ChangePasswordForm } from "@/modules/auth/components/change-password-form"

export const Route = createFileRoute("/_auth/settings/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Section>
      <Container className="max-w-lg">
        <ChangePasswordForm />
      </Container>
    </Section>
  )
}
