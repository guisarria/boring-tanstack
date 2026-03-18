import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import { env } from "@/config/env/server"
import { chats, ipRateLimits, messages } from "@/modules/ai/schema"
import {
  accounts,
  accountsRelations,
  sessions,
  sessionsRelations,
  users,
  usersRelations,
  verifications,
} from "@/modules/auth/schema"

export const schema = {
  users,
  usersRelations,
  accounts,
  accountsRelations,
  sessions,
  sessionsRelations,
  verifications,
  chats,
  messages,
  ipRateLimits,
}

const sql = neon(env.DATABASE_URL)

export const db = drizzle({
  client: sql,
  schema,
  casing: "snake_case",
})
