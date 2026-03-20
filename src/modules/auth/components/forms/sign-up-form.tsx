import { useNavigate } from "@tanstack/react-router"
import { useTransition } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { PasswordFieldsGroup } from "@/components/forms/fields/password-fields-group"
import { useAppForm } from "@/components/forms/form-context"
import { ButtonLink } from "@/components/ui/button-link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field"
import { authClient } from "@/modules/auth/auth-client"
import { passwordField, confirmPasswordField } from "@/modules/auth/validation"

import { SocialAuthButtons } from "../social-auth-buttons"

const signUpFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(50, { message: "Name must be less than 50 characters" }),
    email: z.email({ message: "Invalid email address" }),
    password: passwordField,
    confirmPassword: confirmPasswordField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type SignUpForm = z.infer<typeof signUpFormSchema>

const defaultValues: SignUpForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
}

export function SignUpForm() {
  const [isPending, startTransition] = useTransition()
  const navigate = useNavigate()

  const signUp = (name: string, email: string, password: string) => {
    return authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/dashboard",
      fetchOptions: {
        onSuccess: async () => {
          toast.success("Account created successfully")
          await navigate({
            to: "/dashboard",
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
      onSubmit: signUpFormSchema,
    },
    onSubmit: ({ value: { name, email, password } }) => {
      startTransition(async () => {
        await signUp(name, email, password)
      })
    },
  })

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
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
              void form.handleSubmit()
            }}
          >
            <FieldGroup>
              <SocialAuthButtons />
              <FieldSeparator />
              <form.AppField
                name="name"
                validators={{
                  onBlur: signUpFormSchema.shape.name,
                }}
              >
                {(field) => (
                  <field.InputField
                    autoComplete="name"
                    label="Name"
                    placeholder="Jane Doe"
                  />
                )}
              </form.AppField>
              <form.AppField
                name="email"
                validators={{
                  onBlur: signUpFormSchema.shape.email,
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
        <div className="flex w-full items-center justify-center gap-x-1 text-center text-sm text-muted-foreground">
          <p>Already have an account?</p>
          <ButtonLink variant="link" className="px-0 text-sm" to="/sign-in">
            Sign in
          </ButtonLink>
        </div>
      </CardFooter>
    </Card>
  )
}
