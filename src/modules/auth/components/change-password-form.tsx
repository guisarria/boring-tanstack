import { toast } from "sonner"
import { z } from "zod"
import { useAppForm } from "@/components/forms/form-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { authClient } from "../auth-client"

const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(50),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(50),
    revokeOtherSessions: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ChangePasswordForm = z.infer<typeof changePasswordFormSchema>

const defaultValues: ChangePasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  revokeOtherSessions: false,
}

function ChangePasswordForm() {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: changePasswordFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await authClient.changePassword({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
          revokeOtherSessions: value.revokeOtherSessions,
        })

        if (response.error) {
          toast.error(response.error.message ?? "Failed to change password")
        } else {
          toast.success("Password changed successfully")
          form.reset()
        }
      } catch {
        toast.error("Failed to change password")
      }
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
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <div className="grid gap-2">
              <form.AppField name="currentPassword">
                {(field) => (
                  <field.PasswordField
                    autoComplete="current-password"
                    label="Current Password"
                    placeholder="••••••••"
                  />
                )}
              </form.AppField>
              <form.AppField name="newPassword">
                {(field) => (
                  <field.PasswordField
                    autoComplete="new-password"
                    label="New Password"
                    placeholder="••••••••"
                  />
                )}
              </form.AppField>
              <form.AppField name="confirmPassword">
                {(field) => (
                  <field.PasswordField
                    autoComplete="new-password"
                    label="Confirm Password"
                    placeholder="••••••••"
                  />
                )}
              </form.AppField>
              <form.AppField name="revokeOtherSessions">
                {(field) => (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={field.state.value}
                      id="sign-out-devices"
                      onCheckedChange={(checked) =>
                        field.handleChange(!!checked)
                      }
                    />
                    <Label htmlFor="sign-out-devices">
                      Sign out all devices
                    </Label>
                  </div>
                )}
              </form.AppField>
            </div>
            <div className="mt-4 flex justify-end">
              <form.SubmitButton>Change Password</form.SubmitButton>
            </div>
          </form>
        </form.AppForm>
      </CardContent>
    </Card>
  )
}

export { ChangePasswordForm as ChangePassword }
