import type { ComponentProps, ElementType } from "react"
import { GitHubIcon, GoogleIcon } from "@/components/ui/icons"

type OAuthProviderConfig = {
  id: string
  name: string
  Icon: ElementType<ComponentProps<"svg">>
}

export const OAUTH_PROVIDERS = [
  {
    id: "github",
    name: "GitHub",
    Icon: GitHubIcon,
  },
  {
    id: "google",
    name: "Google",
    Icon: GoogleIcon,
  },
] as const satisfies readonly OAuthProviderConfig[]

export type SupportedOAuthProvider = (typeof OAUTH_PROVIDERS)[number]["id"]
