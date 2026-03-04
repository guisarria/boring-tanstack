import { withFieldGroup } from "../form-context"

type PasswordFields = {
  password: string
  confirmPassword: string
}

const defaultValues: PasswordFields = {
  password: "",
  confirmPassword: "",
}

export const PasswordFieldGroup = withFieldGroup({
  defaultValues,
  render({ group }) {
    return (
      <>
        <group.AppField name="password">
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
            onChange: ({ value }) => {
              if (value !== group.getFieldValue("password")) {
                return "Passwords do not match"
              }
              return undefined
            },
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
