import { RectangleEllipsis } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { useAppForm } from "@/components/forms/form-context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Loader } from "@/components/ui/loader"
import { authClient } from "../auth-client"
import { changePasswordSchema } from "../validations/change-password"

function ChangePassword() {
  const [open, setOpen] = useState<boolean>(false)

  const form = useAppForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      revokeOtherSessions: false as boolean,
    },
    validators: {
      onSubmit: changePasswordSchema,
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
          setOpen(false)
        }
      } catch {
        toast.error("Failed to change password")
      }
    },
  })

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button className="z-10 gap-2" size="sm" variant="outline">
            <RectangleEllipsis />
            Change Password
          </Button>
        }
      />
      <DialogContent className="w-11/12 sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Change your password</DialogDescription>
        </DialogHeader>
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
            <DialogFooter className="mt-4">
              <form.Subscribe
                selector={(state) => ({
                  canSubmit: state.canSubmit,
                  isSubmitting: state.isSubmitting,
                })}
              >
                {({ canSubmit, isSubmitting }) => (
                  <Button
                    className="w-full"
                    disabled={!canSubmit || isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? <Loader /> : "Change Password"}
                  </Button>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  )
}

export { ChangePassword }
