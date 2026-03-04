import { useTransition } from "react"
import { toast } from "sonner"
import z from "zod"
import { useAppForm } from "@/components/forms/form-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldSeparator, FieldSet } from "@/components/ui/field"
import { authClient } from "../auth-client"

const signUpSchema = z.object({
  name: z.string().min(1, "Password is required."),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
})
type SignUp = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const [isPending, startTransition] = useTransition()

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    } satisfies SignUp,
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        await authClient.signUp.email(
          {
            name: value.name,
            email: value.email,
            password: value.password,
          },
          {
            onSuccess() {
              toast.success("Successfully signed in")
            },
            onError(context) {
              toast.error(context.error.message)
            },
          }
        )
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
              <form.AppField name="name">
                {(field) => (
                  <field.InputField
                    autoComplete="email"
                    label="Email address"
                    placeholder="you@example.com"
                  />
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
            </FieldSet>
          </form>
        </form.AppForm>
      </CardContent>
    </Card>
  )
}
