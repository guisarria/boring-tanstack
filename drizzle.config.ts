import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"
import { env } from "@/config/env/server"

config({ path: [".env.local", ".env"] })

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
