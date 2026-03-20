import { useState, useTransition } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { useAppForm } from "@/components/forms/form-context"
import { buttonVariants } from "@/components/ui/button"
import { ButtonLink } from "@/components/ui/button-link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { authClient } from "@/modules/auth/auth-client"

const forgotPasswordSchema = z.object({
  email: z.email({ message: "Enter a valid email address." }),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

const defaultValues: ForgotPasswordForm = {
  email: "",
}

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: ({ value: { email } }) => {
      startTransition(async () => {
        const { error } = await authClient.requestPasswordReset({
          email,
          redirectTo: "/reset-password",
        })

        if (error) {
          toast.error(error.message)
          return
        }

        setIsSubmitted(true)
      })
    },
  })

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            If an account exists with that email, a password reset link has been
            sent. Check your inbox &amp; follow the instructions.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="flex w-full items-center justify-center gap-x-1 text-center text-sm text-muted-foreground">
            <p>Didn&apos;t receive it?</p>
            <button
              className={cn(
                buttonVariants({ variant: "link" }),
                "px-0 text-sm",
              )}
              type="button"
              onClick={() => setIsSubmitted(false)}
            >
              Try again
            </button>
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset Your Password</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form
            id="forgot-password"
            onSubmit={(e) => {
              e.preventDefault()
              void form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.AppField
                name="email"
                validators={{
                  onBlur: forgotPasswordSchema.shape.email,
                }}
              >
                {(field) => (
                  <field.InputField
                    autoComplete="email"
                    label="Email address"
                    placeholder="you@example.com"
                    type="email"
                  />
                )}
              </form.AppField>
              <form.SubmitButton isPending={isPending}>
                Send Reset Link
              </form.SubmitButton>
            </FieldGroup>
          </form>
        </form.AppForm>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-center gap-x-1 text-center text-sm text-muted-foreground">
          <p>Remember your password?</p>
          <ButtonLink variant="link" className="px-0 text-sm" to="/sign-in">
            Sign in
          </ButtonLink>
        </div>
      </CardFooter>
    </Card>
  )
}
