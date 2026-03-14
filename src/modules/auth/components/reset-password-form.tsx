import { Link, useNavigate, useSearch } from "@tanstack/react-router"
import { useTransition } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { PasswordFieldsGroup } from "@/components/forms/fields/password-fields-group"
import { useAppForm } from "@/components/forms/form-context"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import { cn } from "@/lib/utils"

import { authClient } from "../auth-client"

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(50)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, & 1 number",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

const defaultValues: ResetPasswordForm = {
  password: "",
  confirmPassword: "",
}

export function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition()
  const navigate = useNavigate()
  const { token, error } = useSearch({
    from: "/(marketing)/(auth)/reset-password/",
  })

  if (error === "INVALID_TOKEN" || !token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Invalid or Expired Link</CardTitle>
          <CardDescription>
            This password reset link is no longer valid. Request a new one to
            reset your password.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="text-muted-foreground flex w-full items-center justify-center gap-x-1 text-center text-sm">
            <Link
              className={cn(
                buttonVariants({ variant: "link" }),
                "px-0 text-sm",
              )}
              to="/forgot-password"
            >
              Request a New Link
            </Link>
          </div>
        </CardFooter>
      </Card>
    )
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: ({ value: { password } }) => {
      startTransition(async () => {
        const { error } = await authClient.resetPassword({
          newPassword: password,
          token,
        })

        if (error) {
          toast.error(error.message)
          return
        }

        toast.success("Password reset successfully")
        await navigate({ to: "/sign-in" })
      })
    },
  })

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Set a New Password</CardTitle>
        <CardDescription>
          Choose a strong password for your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form
            id="reset-password"
            onSubmit={(e) => {
              e.preventDefault()
              void form.handleSubmit()
            }}
          >
            <FieldGroup>
              <PasswordFieldsGroup
                fields={{
                  password: "password",
                  confirmPassword: "confirmPassword",
                }}
                form={form}
              />
              <Field>
                <form.SubmitButton isPending={isPending}>
                  Reset Password
                </form.SubmitButton>
              </Field>
            </FieldGroup>
          </form>
        </form.AppForm>
      </CardContent>
      <CardFooter>
        <div className="text-muted-foreground flex w-full items-center justify-center gap-x-1 text-center text-sm">
          <p>Remember your password?</p>
          <Link
            className={cn(buttonVariants({ variant: "link" }), "px-0 text-sm")}
            to="/sign-in"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
