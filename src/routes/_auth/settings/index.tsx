import { createFileRoute } from "@tanstack/react-router"
import { MailWarningIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { ThemeSelect } from "@/components/theme-toggle"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Container, Section } from "@/components/ui/design-system"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
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
          <Alert variant="warning" className="pb-8">
            <MailWarningIcon className="size-4" />
            <AlertTitle>Verify Your Email Address</AlertTitle>
            <AlertDescription>
              Please verify your email address. Check your inbox for the
              verification email. If you haven't received the email, click the
              button below to resend.
            </AlertDescription>
            <AlertAction className="top-auto bottom-2">
              <Button
                variant="secondary"
                disabled={emailVerificationPending}
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
            </AlertAction>
          </Alert>
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
