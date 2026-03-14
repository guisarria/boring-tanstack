import z from "zod"

import { withFieldGroup } from "../form-context"

type PasswordFields = {
  password: string
  confirmPassword: string
}

const defaultValues: PasswordFields = {
  password: "",
  confirmPassword: "",
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/

export const PasswordFieldsGroup = withFieldGroup({
  defaultValues,
  render({ group }) {
    return (
      <>
        <group.AppField
          name="password"
          validators={{
            onBlur: z
              .string()
              .min(8, {
                message: "Password must be at least 8 characters long",
              })
              .max(50)
              .regex(PASSWORD_REGEX, {
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, and one number",
              }),
          }}
        >
          {(field) => (
            <field.PasswordField
              autoComplete="new-password"
              label="Password"
              placeholder="••••••••"
            />
          )}
        </group.AppField>
        <group.AppField
          name="confirmPassword"
          validators={{
            onChangeListenTo: ["password"],
            onChange: z
              .string()
              .refine((value) => value === group.getFieldValue("password"), {
                error: "Passwords don't match",
                path: ["confirmPassword"],
              }),
          }}
        >
          {(field) => (
            <field.PasswordField
              autoComplete="new-password"
              label="Confirm Password"
              placeholder="••••••••"
            />
          )}
        </group.AppField>
      </>
    )
  },
})
