import { Field, FieldGroup } from "@/components/ui/field"
import { authClient } from "../auth-client"
import { OAUTH_PROVIDERS } from "../o-auth-providers"
import { AuthActionButton } from "./auth-action-button"

export function SocialAuthButtons() {
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
