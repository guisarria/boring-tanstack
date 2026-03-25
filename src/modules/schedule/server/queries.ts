import { and, eq } from "drizzle-orm"

import { db } from "@/db/index"
import { AppError } from "@/lib/errors"

import { scheduleEvents } from "../schema"
import type {
  CreateScheduleEventInput,
  UpdateScheduleEventInput,
} from "../validation"

function normalizeOptionalValue(value: string | undefined) {
  return value ?? null
}

export async function listScheduleEventsByUserId({
  userId,
}: {
  userId: string
}) {
  try {
    return await db.query.scheduleEvents.findMany({
      where: (scheduleEvents, { eq }) => eq(scheduleEvents.userId, userId),
      orderBy: (scheduleEvents, { asc }) => [
        asc(scheduleEvents.startAt),
        asc(scheduleEvents.createdAt),
      ],
    })
  } catch {
    throw new AppError(
      "internal_error:database",
      "Failed to list schedule events",
    )
  }
}

export async function createScheduleEvent({
  userId,
  input,
}: {
  userId: string
  input: CreateScheduleEventInput
}) {
  try {
    const [created] = await db
      .insert(scheduleEvents)
      .values({
        userId,
        title: input.title,
        description: normalizeOptionalValue(input.description),
        location: normalizeOptionalValue(input.location),
        color: input.color,
        startAt: input.startAt,
        endAt: input.endAt,
        allDay: input.allDay,
        updatedAt: new Date(),
      })
      .returning()

    return created ?? null
  } catch {
    throw new AppError(
      "internal_error:database",
      "Failed to create schedule event",
    )
  }
}

export async function updateScheduleEvent({
  userId,
  input,
}: {
  userId: string
  input: UpdateScheduleEventInput
}) {
  try {
    const [updated] = await db
      .update(scheduleEvents)
      .set({
        title: input.title,
        description: normalizeOptionalValue(input.description),
        location: normalizeOptionalValue(input.location),
        color: input.color,
        startAt: input.startAt,
        endAt: input.endAt,
        allDay: input.allDay,
        updatedAt: new Date(),
      })
      .where(
        and(eq(scheduleEvents.id, input.id), eq(scheduleEvents.userId, userId)),
      )
      .returning()

    return updated ?? null
  } catch {
    throw new AppError(
      "internal_error:database",
      "Failed to update schedule event",
    )
  }
}

export async function deleteScheduleEventById({
  id,
  userId,
}: {
  id: string
  userId: string
}) {
  try {
    const [deleted] = await db
      .delete(scheduleEvents)
      .where(and(eq(scheduleEvents.id, id), eq(scheduleEvents.userId, userId)))
      .returning({ id: scheduleEvents.id })

    return deleted ?? null
  } catch {
    throw new AppError(
      "internal_error:database",
      "Failed to delete schedule event",
    )
  }
}
