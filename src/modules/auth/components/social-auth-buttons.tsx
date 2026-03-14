import { Field, FieldGroup } from "@/components/ui/field"
import { cn } from "@/lib/utils"

import { authClient } from "../auth-client"
import { OAUTH_PROVIDERS, type OAuthProvider } from "../o-auth-providers"
import { AuthActionButton } from "./auth-action-button"

function handleSocialLogin(provider: OAuthProvider) {
  return () =>
    authClient.signIn.social({
      provider,
      callbackURL: "/dashboard",
    })
}

export function SocialAuthButtons({ className }: { className?: string }) {
  return (
    <FieldGroup
      className={cn(
        "flex flex-col items-center justify-center gap-2 sm:flex-row",
        className,
      )}
    >
      {OAUTH_PROVIDERS.map(({ id, name, Icon }) => (
        <Field key={id}>
          <AuthActionButton action={handleSocialLogin(id)}>
            <Icon />
            Continue with {name}
          </AuthActionButton>
        </Field>
      ))}
    </FieldGroup>
  )
}
