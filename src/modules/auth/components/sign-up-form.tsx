import { Link, useNavigate } from "@tanstack/react-router"
import { useTransition } from "react"
import { toast } from "sonner"
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
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { authClient } from "../auth-client"
import { type SignUp, signUpSchema } from "../validations/sign-up"
import { SocialAuthButtons } from "./social-auth-buttons"

export function SignUpForm() {
  const [isPending, startTransition] = useTransition()
  const navigate = useNavigate()

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
    <Card className="w-full max-w-md">
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
            <FieldGroup>
              <SocialAuthButtons />
              <FieldSeparator />
              <form.AppField
                name="name"
                validators={{
                  onBlur: signUpSchema.shape.name,
                }}
              >
                {(field) => (
                  <field.InputField label="Name" placeholder="Jane Doe" />
                )}
              </form.AppField>
              <form.AppField
                name="email"
                validators={{
                  onBlur: signUpSchema.shape.email,
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
              <PasswordFieldsGroup
                fields={{
                  password: "password",
                  confirmPassword: "confirmPassword",
                }}
                form={form}
              />
              <Field>
                <form.SubmitButton isPending={isPending}>
                  Continue with Email
                </form.SubmitButton>
              </Field>
            </FieldGroup>
          </form>
        </form.AppForm>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-center justify-center gap-x-1 text-center text-muted-foreground text-sm">
          <p>Already have an account?</p>
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
