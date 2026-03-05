import { createAuthClient } from "better-auth/react"
import { useMemo } from "react"
import { Field, FieldGroup } from "@/components/ui/field"
import { OAUTH_PROVIDERS } from "../o-auth-providers"
import { AuthActionButton } from "./auth-action-button"

export function SocialAuthButtons() {
  const authClient = useMemo(() => createAuthClient(), [])

  return (
    <FieldGroup className="flex flex-col items-center justify-center gap-2 sm:flex-row">
      {OAUTH_PROVIDERS.map(({ id, name, Icon }) => (
        <Field key={id}>
          <AuthActionButton
            action={() =>
              authClient.signIn.social({
                provider: id,
                callbackURL: "/dashboard",
              })
            }
          >
            <Icon />
            Continue with {name}
          </AuthActionButton>
        </Field>
      ))}
    </FieldGroup>
  )
}
