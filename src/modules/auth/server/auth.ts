import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { betterAuth } from "better-auth/minimal"
import { admin } from "better-auth/plugins/admin"
import { tanstackStartCookies } from "better-auth/tanstack-start"

import { env } from "@/config/env/server"
import { db } from "@/db"
import { schema } from "@/db/index"

import PasswordResetEmail from "../emails/password-reset-email"
import { resend } from "../emails/resend"
import VerificationEmail from "../emails/verification-email"

export const auth = betterAuth({
  appName: "Boring Tanstack",
  baseURL: env.BASE_URL,
  trustedOrigins: [env.BASE_URL],
  secret: env.BETTER_AUTH_SECRET,
  experimental: { joins: true },
  telemetry: {
    enabled: false,
  },
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
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user: { email, name }, url }) => {
      await resend.emails.send({
        from: `Boring Tanstack <${env.RESEND_EMAIL}>`,
        to: [email],
        subject: "Verify your email address",
        react: VerificationEmail({ name, url }),
      })
    },
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user: { email, name }, url }) => {
      await resend.emails.send({
        from: `Boring Tanstack <${env.RESEND_EMAIL}>`,
        to: [email],
        subject: "Reset your password",
        react: PasswordResetEmail({ name, url }),
      })
    },
  },
  // tanstackStartCookies() must always be the last plugin in the array
  plugins: [admin(), tanstackStartCookies()],
})
