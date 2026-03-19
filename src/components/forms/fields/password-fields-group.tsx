import { confirmPasswordField, passwordField } from "@/modules/auth/validation"

import { withFieldGroup } from "../form-context"

type PasswordFields = {
  password: string
  confirmPassword: string
}

const defaultValues: PasswordFields = {
  password: "",
  confirmPassword: "",
}

export const PasswordFieldsGroup = withFieldGroup({
  defaultValues,
  render({ group }) {
    return (
      <>
        <group.AppField
          name="password"
          validators={{
            onBlur: passwordField,
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
            onChange: confirmPasswordField.refine(
              (value) => value === group.getFieldValue("password"),
              { message: "Passwords don't match" },
            ),
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
