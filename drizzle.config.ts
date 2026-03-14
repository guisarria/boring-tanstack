import { defineConfig } from "drizzle-kit"

import { env } from "@/config/env/server"

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/modules/**/*schema*.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
