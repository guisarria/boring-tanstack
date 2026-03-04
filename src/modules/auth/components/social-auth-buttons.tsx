import { createAuthClient } from "better-auth/react"
import { useMemo } from "react"
import { OAUTH_PROVIDERS } from "../o-auth-providers"
import { AuthActionButton } from "./auth-action-button"

export function SocialAuthButtons() {
  const authClient = useMemo(() => createAuthClient(), [])

  return (
    <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
      {OAUTH_PROVIDERS.map(({ id, name, Icon }) => (
        <AuthActionButton
          action={() =>
            authClient.signIn.social({
              provider: id,
              callbackURL: "/dashboard",
            })
          }
          className="w-full sm:w-auto sm:flex-1"
          key={id}
        >
          <Icon />
          Continue with {name}
        </AuthActionButton>
      ))}
    </div>
  )
}
