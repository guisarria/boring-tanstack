import type { ComponentProps, ElementType } from "react"
import { Icons } from "@/components/ui/icons"

type OAuthProviderConfig = {
  id: string
  name: string
  Icon: ElementType<ComponentProps<"svg">>
}

export const OAUTH_PROVIDERS = [
  {
    id: "github",
    name: "GitHub",
    Icon: Icons.gitHub,
  },
  {
    id: "google",
    name: "Google",
    Icon: Icons.google,
  },
] as const satisfies readonly OAuthProviderConfig[]

export type SupportedOAuthProvider = (typeof OAUTH_PROVIDERS)[number]["id"]
