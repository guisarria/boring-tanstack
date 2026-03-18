import { sql, type InferSelectModel } from "drizzle-orm"
import {
  check,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { z } from "zod"

import { users } from "../auth/schema"
import type { ChatMessagePart } from "./contracts"

export const chatRoleEnum = pgEnum("chat_role", ["system", "user", "assistant"])

export const chats = pgTable(
  "chat",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    title: text("title").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    index("chat_userId_createdAt_idx").on(table.userId, table.createdAt),
  ],
)

export type Chat = InferSelectModel<typeof chats>

export const messages = pgTable(
  "message",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    chatId: uuid("chatId")
      .notNull()
      .references(() => chats.id),
    role: chatRoleEnum("role").notNull(),
    parts: jsonb("parts").$type<Array<ChatMessagePart>>().notNull(),
    attachments: jsonb("attachments")
      .$type<Array<unknown>>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => [
    index("message_chatId_createdAt_idx").on(table.chatId, table.createdAt),
    index("message_chatId_role_createdAt_idx").on(
      table.chatId,
      table.role,
      table.createdAt,
    ),
    check(
      "message_parts_is_array",
      sql`jsonb_typeof(${table.parts}) = 'array'`,
    ),
    check(
      "message_attachments_is_array",
      sql`jsonb_typeof(${table.attachments}) = 'array'`,
    ),
  ],
)

export type DBMessage = InferSelectModel<typeof messages>

export const renameChatSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1).max(80),
})

export type RenameChatInput = z.infer<typeof renameChatSchema>

export const deleteChatSchema = z.object({
  id: z.uuid(),
})

export type DeleteChatInput = z.infer<typeof deleteChatSchema>
