import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const todos = pgTable("todos", {
  createdAt: timestamp("created_at").defaultNow(),
  id: serial().primaryKey(),
  title: text().notNull(),
})
