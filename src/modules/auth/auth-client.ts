import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { env } from "@/config/env/client"
import type { auth } from "./auth"

export const authClient = createAuthClient({
  baseURL: env.VITE_BASE_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
})
