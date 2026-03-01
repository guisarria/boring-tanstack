import { betterAuth } from "better-auth"
import { tanstackStartCookies } from "better-auth/tanstack-start"

export const auth = betterAuth({
  appName: "Boring Template",
  baseURL: env.BETTER_AUTH_URL,
  experimental: { joins: true },
  trustedOrigins: [clientEnv.NEXT_PUBLIC_SERVER_URL],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
})
