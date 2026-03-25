import { z } from "zod"

export const SCHEDULE_EVENT_COLORS = [
  "sky",
  "amber",
  "violet",
  "rose",
  "emerald",
  "orange",
] as const

export const scheduleEventColorSchema = z.enum(SCHEDULE_EVENT_COLORS)

function optionalTrimmedString(maxLength: number) {
  return z
    .union([z.string(), z.null(), z.undefined()])
    .transform((value) => {
      if (typeof value !== "string") return undefined

      const normalized = value.trim()
      return normalized.length > 0 ? normalized : undefined
    })
    .pipe(z.string().max(maxLength).optional())
}

const scheduleEventPayloadSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    description: optionalTrimmedString(4000),
    location: optionalTrimmedString(240),
    color: scheduleEventColorSchema.default("sky"),
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
    allDay: z.boolean().default(false),
  })
  .refine((value) => value.endAt > value.startAt, {
    message: "End time must be after start time",
    path: ["endAt"],
  })

export const scheduleEventSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  color: scheduleEventColorSchema,
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  allDay: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const scheduleEventsResponseSchema = z.object({
  events: z.array(scheduleEventSchema),
})

export const createScheduleEventSchema = scheduleEventPayloadSchema

export const updateScheduleEventSchema = scheduleEventPayloadSchema.extend({
  id: z.uuid(),
})

export const deleteScheduleEventSchema = z.object({
  id: z.uuid(),
})

export const calendarEventFormSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(120),
    description: z.string(),
    location: z.string(),
    allDay: z.boolean(),
    startAt: z.date(),
    endAt: z.date(),
  })
  .refine((value) => value.endAt > value.startAt, {
    message: "End time must be after start time",
    path: ["endAt"],
  })

export type CalendarEventFormValues = z.infer<typeof calendarEventFormSchema>

export type ScheduleEventDto = z.infer<typeof scheduleEventSchema>
export type ScheduleEventsResponse = z.infer<
  typeof scheduleEventsResponseSchema
>
export type CreateScheduleEventInput = z.infer<typeof createScheduleEventSchema>
export type UpdateScheduleEventInput = z.infer<typeof updateScheduleEventSchema>
export type DeleteScheduleEventInput = z.infer<typeof deleteScheduleEventSchema>
export type CreateScheduleEventPayload = z.input<
  typeof createScheduleEventSchema
>
export type UpdateScheduleEventPayload = z.input<
  typeof updateScheduleEventSchema
>
export type DeleteScheduleEventPayload = z.input<
  typeof deleteScheduleEventSchema
>
