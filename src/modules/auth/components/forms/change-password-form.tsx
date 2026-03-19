import { useTransition } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { PasswordFieldsGroup } from "@/components/forms/fields/password-fields-group"
import { useAppForm } from "@/components/forms/form-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { authClient } from "@/modules/auth/auth-client"

const changePasswordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50),
  revokeOtherSessions: z.boolean(),
})

type ChangePasswordForm = z.infer<typeof changePasswordFormSchema>

const defaultValues: ChangePasswordForm = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
  revokeOtherSessions: false,
}

export function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition()

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: changePasswordFormSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        const { error } = await authClient.changePassword({
          currentPassword: value.currentPassword,
          newPassword: value.password,
          revokeOtherSessions: value.revokeOtherSessions,
        })

        if (error) {
          toast.error(
            error.message ??
              "Unable to change password—try again or check your current password.",
          )
          return
        }

        toast.success("Password changed successfully")
        form.reset()
      })
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Change your password</CardDescription>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form
            id="change-password"
            onSubmit={(e) => {
              e.preventDefault()
              void form.handleSubmit()
            }}
          >
            <FieldGroup>
              <input
                aria-hidden
                autoComplete="username"
                className="hidden"
                tabIndex={-1}
                type="text"
              />
              <form.AppField
                name="currentPassword"
                validators={{
                  onBlur: changePasswordFormSchema.shape.currentPassword,
                }}
              >
                {(field) => (
                  <field.PasswordField
                    autoComplete="current-password"
                    label="Current Password"
                    placeholder="••••••••"
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
              <Field orientation="horizontal">
                <Checkbox
                  checked={form.getFieldValue("revokeOtherSessions")}
                  id="sign-out-devices"
                  onCheckedChange={(checked) =>
                    form.setFieldValue("revokeOtherSessions", !!checked)
                  }
                />
                <Label htmlFor="sign-out-devices">Sign out all devices</Label>
              </Field>
              <Field>
                <form.SubmitButton isPending={isPending}>
                  Change Password
                </form.SubmitButton>
              </Field>
            </FieldGroup>
          </form>
        </form.AppForm>
      </CardContent>
    </Card>
  )
}
