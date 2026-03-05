import { Link, useNavigate } from "@tanstack/react-router"
import { useTransition } from "react"
import { toast } from "sonner"
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
import { type SignIn, signInSchema } from "../validations/sign-in"
import { SocialAuthButtons } from "./social-auth-buttons"

export function SignInForm() {
  const [isPending, startTransition] = useTransition()
  const navigate = useNavigate()

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    } satisfies SignIn,
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        await authClient.signIn.email({
          email: value.email,
          password: value.password,
          fetchOptions: {
            onSuccess: () => {
              toast.success("Logged in successfully")
              navigate({
                to: "/dashboard",
              })
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
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to sign in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form
            id="sign-in"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldSet>
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
              <form.AppField name="password">
                {(field) => (
                  <field.PasswordField
                    label="Password"
                    placeholder="••••••••"
                  />
                )}
              </form.AppField>
              <form.SubmitButton isPending={isPending}>
                Continue with Email
              </form.SubmitButton>
              <FieldSeparator />
              <SocialAuthButtons />
            </FieldSet>
          </form>
        </form.AppForm>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-center gap-x-1 text-center text-xs sm:text-sm">
          <p>Don&apos; t have an account?</p>
          <Link
            className={cn(
              buttonVariants({ variant: "link", size: "xs" }),
              "px-0"
            )}
            to="/sign-up"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
