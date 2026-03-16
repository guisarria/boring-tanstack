import { createFileRoute } from "@tanstack/react-router"
import { MailWarningIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { ThemeSelect } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Container, Section } from "@/components/ui/design-system"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { authClient } from "@/modules/auth/auth-client"
import { ChangePasswordForm } from "@/modules/auth/components/forms/change-password-form"

export const Route = createFileRoute("/_auth/settings/")({
  component: RouteComponent,
})

function RouteComponent() {
  const [emailVerificationPending, setEmailVerificationPending] =
    useState(false)

  const session = Route.useRouteContext()
  if (!session.user) {
    return null
  }

  const user = session.user

  return (
    <Section>
      <Container className="flex max-w-lg flex-col gap-y-6">
        <h2 className="text-2xl">Profile</h2>
        {!user.emailVerified && (
          <Item variant="warning">
            <ItemMedia variant="icon">
              <MailWarningIcon />
            </ItemMedia>

            <ItemContent>
              <ItemTitle>Verify Your Email Address</ItemTitle>

              <ItemDescription>
                Please verify your email address. Check your inbox for the
                verification email. If you haven't received the email, click the
                button below to resend.
              </ItemDescription>

              <ItemActions className="mt-1 ml-auto">
                <Button
                  disabled={emailVerificationPending}
                  variant="outline"
                  className="bg-warning-border/80 border-warning-text/40 hover:text-warning-text hover:bg-warning-bg/80"
                  onClick={async () => {
                    await authClient.sendVerificationEmail(
                      {
                        email: user.email,
                      },
                      {
                        onRequest() {
                          setEmailVerificationPending(true)
                        },
                        onError(context) {
                          toast.error(context.error.message)
                          setEmailVerificationPending(false)
                        },
                        onSuccess() {
                          toast.success("Verification email sent successfully")
                          setEmailVerificationPending(false)
                        },
                      },
                    )
                  }}
                >
                  <LoadingSwap isLoading={emailVerificationPending}>
                    Resend Verification Email
                  </LoadingSwap>
                </Button>
              </ItemActions>
            </ItemContent>
          </Item>
        )}

        <ChangePasswordForm />

        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Change Theme</ItemTitle>
            <ItemDescription>
              Select your interface color scheme.
            </ItemDescription>
          </ItemContent>

          <ItemActions>
            <ThemeSelect richColors />
          </ItemActions>
        </Item>
      </Container>
    </Section>
  )
}
