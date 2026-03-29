import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"

import { AppError } from "@/lib/errors"
import { unwrapOrThrow } from "@/lib/server-utils"

import { requireAuthenticatedUser } from "../auth/server/auth-service"
import {
  createScheduleEvent as createScheduleEventRecord,
  deleteScheduleEventById,
  listScheduleEventsByUserId,
  updateScheduleEvent as updateScheduleEventRecord,
} from "./server/queries"
import {
  createScheduleEventSchema,
  deleteScheduleEventSchema,
  SCHEDULE_EVENT_COLORS,
  scheduleEventSchema,
  updateScheduleEventSchema,
} from "./validation"

async function authenticatedUserId(): Promise<string> {
  const headers = getRequestHeaders()
  return unwrapOrThrow(
    await requireAuthenticatedUser(headers, "unauthorized:schedule"),
  ).id
}

function toScheduleEventDto(event: {
  id: string
  title: string
  description: string | null
  location: string | null
  color: string
  startAt: Date
  endAt: Date
  allDay: boolean
  createdAt: Date
  updatedAt: Date
}) {
  return scheduleEventSchema.parse({
    id: event.id,
    title: event.title,
    description: event.description ?? undefined,
    location: event.location ?? undefined,
    color: event.color,
    startAt: event.startAt,
    endAt: event.endAt,
    allDay: event.allDay,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  })
}

export const listScheduleEvents = createServerFn({ method: "GET" }).handler(
  async () => {
    const userId = await authenticatedUserId()
    const events = await listScheduleEventsByUserId({ userId })

    return {
      events: events.map((event, index) =>
        scheduleEventSchema.parse({
          ...toScheduleEventDto(event),
          color: SCHEDULE_EVENT_COLORS[index % SCHEDULE_EVENT_COLORS.length],
        }),
      ),
    }
  },
)

export const createScheduleEvent = createServerFn({ method: "POST" })
  .inputValidator(createScheduleEventSchema)
  .handler(async ({ data }) => {
    const userId = await authenticatedUserId()
    const created = await createScheduleEventRecord({ input: data, userId })

    if (!created) {
      throw new AppError("internal_error:database").toResponse()
    }

    return {
      event: toScheduleEventDto(created),
    }
  })

export const updateScheduleEvent = createServerFn({ method: "POST" })
  .inputValidator(updateScheduleEventSchema)
  .handler(async ({ data }) => {
    const userId = await authenticatedUserId()
    const updated = await updateScheduleEventRecord({ input: data, userId })

    if (!updated) {
      throw new AppError("not_found:schedule").toResponse()
    }

    return {
      event: toScheduleEventDto(updated),
    }
  })

export const deleteScheduleEvent = createServerFn({ method: "POST" })
  .inputValidator(deleteScheduleEventSchema)
  .handler(async ({ data }) => {
    const userId = await authenticatedUserId()
    const deleted = await deleteScheduleEventById({ id: data.id, userId })

    if (!deleted) {
      throw new AppError("not_found:schedule").toResponse()
    }

    return { success: true, deletedId: deleted.id }
  })
