import { sql, type InferSelectModel } from "drizzle-orm"
import {
  boolean,
  check,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

import { users } from "../auth/schema"
import { SCHEDULE_EVENT_COLORS } from "./validation"

export const scheduleEventColorEnum = pgEnum(
  "schedule_event_color",
  SCHEDULE_EVENT_COLORS,
)

export const scheduleEvents = pgTable(
  "schedule_event",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    location: text("location"),
    color: scheduleEventColorEnum("color").notNull().default("sky"),
    startAt: timestamp("start_at").notNull(),
    endAt: timestamp("end_at").notNull(),
    allDay: boolean("all_day").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("schedule_event_userId_startAt_idx").on(table.userId, table.startAt),
    index("schedule_event_userId_endAt_idx").on(table.userId, table.endAt),
    check(
      "schedule_event_end_after_start",
      sql`${table.endAt} > ${table.startAt}`,
    ),
  ],
)

export type ScheduleEvent = InferSelectModel<typeof scheduleEvents>
