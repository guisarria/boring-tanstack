"use client"

import { Link } from "@tanstack/react-router"
import { useTransition } from "react"
import { toast } from "sonner"
import { PasswordFieldGroup } from "@/components/forms/fields/password-field-group"
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
import { FieldSeparator, FieldSet } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { authClient } from "../auth-client"
import { type SignUp, signUpSchema } from "../validations/sign-up"
import { SocialAuthButtons } from "./social-auth-buttons"

export function SignUpForm() {
  const [isPending, startTransition] = useTransition()

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    } satisfies SignUp,
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        await authClient.signUp.email({
          name: value.name,
          email: value.email,
          password: value.password,
          callbackURL: "/dashboard",
          fetchOptions: {
            onSuccess: () => {
              toast.success("Sign up successfully")
            },
            onError: ({ error }) => {
              toast.error(error.message)
            },
          },
        })
      })
    },
  })

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Let's create your account</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form.AppForm>
          <form
            id="sign-up"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldSet>
              <SocialAuthButtons />
              <FieldSeparator />
              <form.AppField name="name">
                {(field) => (
                  <field.InputField label="Name" placeholder="Jane Doe" />
                )}
              </form.AppField>
              <form.AppField name="email">
                {(field) => (
                  <field.InputField
                    autoComplete="email"
                    label="Email address"
                    placeholder="you@example.com"
                    type="email"
                  />
                )}
              </form.AppField>
              <PasswordFieldGroup
                fields={{
                  password: "password",
                  confirmPassword: "confirmPassword",
                }}
                form={form}
              />
              <form.SubmitButton isPending={isPending}>
                Continue with Email
              </form.SubmitButton>
            </FieldSet>
          </form>
        </form.AppForm>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-center justify-center gap-x-1 text-center text-xs sm:text-sm">
          <p>Already have an account?</p>
          <Link
            className={cn(
              buttonVariants({ variant: "link", size: "xs" }),
              "px-0"
            )}
            to="/sign-in"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
