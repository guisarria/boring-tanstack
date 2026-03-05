import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import { env } from "@/config/env/server"
import { db } from "@/db"
import * as schema from "./schema"

export const auth = betterAuth({
  appName: "Boring Template",
  baseURL: env.VITE_BASE_URL,
  experimental: { joins: true },
  trustedOrigins: [env.VITE_BASE_URL],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema,
  }),
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
