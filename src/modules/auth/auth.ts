import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { betterAuth } from "better-auth/minimal"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import { env } from "@/config/env/server"
import { db } from "@/db"
import { schema } from "@/db/index"

export const auth = betterAuth({
  appName: "Boring Tanstack",
  baseURL: env.BASE_URL,
  experimental: { joins: true },
  trustedOrigins: [env.BASE_URL],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema,
  }),
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwe",
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github", "google"],
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
})
