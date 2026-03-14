import { Link, useNavigate, useSearch } from "@tanstack/react-router"
import { useTransition } from "react"
import { toast } from "sonner"
import { z } from "zod"

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
import { FieldGroup, FieldSeparator } from "@/components/ui/field"
import { cn } from "@/lib/utils"

import { authClient } from "../auth-client"
import { SocialAuthButtons } from "./social-auth-buttons"

const signInFormSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password is required." }),
})

type SignInForm = z.infer<typeof signInFormSchema>

const defaultValues: SignInForm = {
  email: "",
  password: "",
}

export function SignInForm() {
  const [isPending, startTransition] = useTransition()
  const navigate = useNavigate()
  const { redirect } = useSearch({ from: "/(marketing)/(auth)/sign-in/" })

  const signIn = (email: string, password: string) => {
    return authClient.signIn.email({
      email,
      password,
      fetchOptions: {
        onSuccess: async () => {
          toast.success("Logged in successfully")
          await navigate({
            to: redirect ?? "/dashboard",
          })
        },
        onError: ({ error }) => {
          toast.error(error.message)
        },
      },
    })
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: signInFormSchema,
    },
    onSubmit: ({ value: { email, password } }) => {
      startTransition(async () => {
        await signIn(email, password)
      })
    },
  })

  return (
    <Card className="w-full max-w-md">
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
              void form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.AppField
                name="email"
                validators={{
                  onBlur: signInFormSchema.shape.email,
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
              <form.AppField
                name="password"
                validators={{
                  onBlur: signInFormSchema.shape.password,
                }}
              >
                {(field) => (
                  <field.PasswordField
                    label="Password"
                    placeholder="••••••••"
                  />
                )}
              </form.AppField>
              <div className="flex justify-end">
                <Link
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "h-auto px-0 text-xs",
                  )}
                  to="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>
              <form.SubmitButton isPending={isPending}>
                Continue with Email
              </form.SubmitButton>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <SocialAuthButtons />
            </FieldGroup>
          </form>
        </form.AppForm>
      </CardContent>
      <CardFooter>
        <span className="text-muted-foreground flex w-full items-center justify-center gap-x-1 text-center text-sm">
          Don&apos; t have an account?
          <Link
            className={cn(buttonVariants({ variant: "link" }), "px-0 text-sm")}
            to="/sign-up"
          >
            Sign up
          </Link>
          or
          <Link
            className={cn(buttonVariants({ variant: "link" }), "px-0 text-sm")}
            to="/"
          >
            Learn more
          </Link>
        </span>
      </CardFooter>
    </Card>
  )
}
