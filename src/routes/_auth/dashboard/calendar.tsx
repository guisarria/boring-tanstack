import {
  type QueryClient,
  type QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { addDays, addHours, format, parse, startOfDay } from "date-fns"
import { LoaderCircle, Trash2 } from "lucide-react"
import { useEffect, useMemo, useOptimistic, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { useAppForm } from "@/components/forms/form-context"
import { Button } from "@/components/ui/button"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  type CalendarEvent,
  EventCalendar,
  EventCalendarContent,
  EventCalendarCreateTrigger,
  EventCalendarHeader,
  EventCalendarNavigation,
  EventCalendarTitle,
  EventCalendarTodayTrigger,
  EventCalendarViewSwitcher,
  type EventColor,
} from "@/components/ui/event-calendar"
import { Separator } from "@/components/ui/separator"
import {
  createScheduleEvent,
  deleteScheduleEvent,
  scheduleEventsQueryOptions,
  scheduleQueryKeys,
  type ScheduleEventDto,
  type ScheduleEventsResponse,
  updateScheduleEvent,
} from "@/modules/schedule"
import {
  type CalendarEventFormValues,
  calendarEventFormSchema,
} from "@/modules/schedule/validation"

const calendarSearchSchema = z.object({
  date: z.string().optional(),
  view: z.enum(["month", "week", "day", "schedule", "year"]).optional(),
})

export const Route = createFileRoute("/_auth/dashboard/calendar")({
  validateSearch: (search) => calendarSearchSchema.parse(search),
  beforeLoad: async ({ context }) => {
    await context.queryClient.fetchQuery(scheduleEventsQueryOptions())
  },
  component: RouteComponent,
})

type EditorState =
  | {
      mode: "create"
      values: CalendarEventFormValues
    }
  | {
      mode: "edit"
      eventId: string
      values: CalendarEventFormValues
    }

type CreateScheduleMutationInput = {
  title: string
  description: string | undefined
  location: string | undefined
  color: EventColor
  allDay: boolean
  startAt: Date
  endAt: Date
}

type UpdateScheduleMutationInput = CreateScheduleMutationInput & {
  id: string
}

function RouteComponent() {
  const { date: dateParam, view: viewParam } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const date = useMemo(() => {
    if (!dateParam) return new Date()
    try {
      return parse(dateParam, "yyyy-MM-dd", new Date())
    } catch {
      return new Date()
    }
  }, [dateParam])

  const view = viewParam ?? "month"

  const queryClient = useQueryClient()
  const queryOptions = useMemo(() => scheduleEventsQueryOptions(), [])
  const calendarQuery = useQuery(queryOptions)
  const events = calendarQuery.data?.events ?? []

  const [optimisticEvents, addOptimisticEvent] = useOptimistic(
    events,
    (state: ScheduleEventDto[], updatedEvent: ScheduleEventDto) => {
      return sortEvents(
        state.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event,
        ),
      )
    },
  )

  const [editor, setEditor] = useState<EditorState | null>(null)

  const selectedEvent =
    editor?.mode === "edit"
      ? (events.find((event) => event.id === editor.eventId) ?? null)
      : null
  const isDialogOpen = editor !== null

  useEffect(() => {
    if (editor?.mode === "create") {
      return
    }

    if (events.length === 0) {
      if (editor !== null) {
        setEditor(null)
      }
      return
    }

    if (editor?.mode === "edit" && !selectedEvent) {
      setEditor(null)
    }
  }, [editor, selectedEvent, events.length])

  const createMutation = useMutation({
    mutationFn: async (input: CreateScheduleMutationInput) =>
      createScheduleEvent({ data: input }),
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create event",
      )
    },
    onSuccess: ({ event }) => {
      queryClient.setQueryData<ScheduleEventsResponse>(
        queryOptions.queryKey,
        (current) => ({
          events: sortEvents([...(current?.events ?? []), event]),
        }),
      )

      setEditor(null)
      toast.success("Event created")
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (input: UpdateScheduleMutationInput) =>
      updateScheduleEvent({ data: input }),
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update event",
      )
    },
    onSuccess: ({ event }) => {
      upsertScheduleEventInCache(queryClient, queryOptions.queryKey, event)
      setEditor(null)
      toast.success("Event saved")
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all })
    },
  })

  const moveMutation = useMutation({
    mutationFn: async (input: UpdateScheduleMutationInput) =>
      updateScheduleEvent({ data: input }),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: scheduleQueryKeys.all })

      const previousEvents = queryClient.getQueryData<ScheduleEventsResponse>(
        queryOptions.queryKey,
      )

      if (previousEvents) {
        queryClient.setQueryData<ScheduleEventsResponse>(
          queryOptions.queryKey,
          (current) => {
            if (!current) return current
            return {
              events: sortEvents(
                current.events.map((event) =>
                  event.id === data.id
                    ? {
                        ...event,
                        allDay: data.allDay,
                        color: data.color,
                        description: data.description,
                        endAt: data.endAt,
                        location: data.location,
                        startAt: data.startAt,
                        title: data.title,
                        updatedAt: new Date(),
                      }
                    : event,
                ),
              ),
            }
          },
        )
      }

      if (editor?.mode === "edit" && editor.eventId === data.id) {
        setEditor({
          mode: "edit",
          eventId: data.id,
          values: toEditorValues({
            ...selectedEvent!,
            allDay: data.allDay,
            color: data.color,
            description: data.description,
            endAt: data.endAt,
            location: data.location,
            startAt: data.startAt,
            title: data.title,
            updatedAt: new Date(),
          }),
        })
      }

      return { previousEvents }
    },
    onError: (error, _data, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(queryOptions.queryKey, context.previousEvents)
      }
      toast.error(
        error instanceof Error ? error.message : "Failed to move event",
      )
    },
    onSuccess: ({ event }) => {
      upsertScheduleEventInCache(queryClient, queryOptions.queryKey, event)
      if (editor?.mode === "edit" && editor.eventId === event.id) {
        setEditor({
          mode: "edit",
          eventId: event.id,
          values: toEditorValues(event),
        })
      }
      toast.success(
        `"${event.title}" moved to ${format(event.startAt, "MMM d, yyyy")} at ${format(event.startAt, "h:mm a")}`,
      )
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (input: { id: string }) =>
      deleteScheduleEvent({ data: input }),
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete event",
      )
    },
    onSuccess: ({ deletedId }) => {
      queryClient.setQueryData<ScheduleEventsResponse>(
        queryOptions.queryKey,
        (current) => {
          if (!current) return current

          return {
            events: current.events.filter((event) => event.id !== deletedId),
          }
        },
      )

      setEditor(null)
      toast.success("Event deleted")
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all })
    },
  })

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    moveMutation.isPending ||
    deleteMutation.isPending

  function beginCreate(startTime?: Date) {
    setEditor({
      mode: "create",
      values: createDraftValues(startTime),
    })
  }

  function selectEvent(event: ScheduleEventDto) {
    setEditor({
      mode: "edit",
      eventId: event.id,
      values: toEditorValues(event),
    })
  }

  function closeDialog() {
    setEditor(null)
  }

  function handleCreateEvent(values: CalendarEventFormValues) {
    createMutation.mutate(toMutationPayload(values, events))
  }

  function handleUpdateEvent(eventId: string, values: CalendarEventFormValues) {
    updateMutation.mutate({
      id: eventId,
      ...toMutationPayload(values, events, eventId),
    })
  }

  function handleDeleteEvent(eventId: string) {
    deleteMutation.mutate({ id: eventId })
  }

  function handleEventDrop(item: ScheduleEventDto, nextEvent: CalendarEvent) {
    const optimisticEvent: ScheduleEventDto = {
      ...item,
      startAt: nextEvent.start,
      endAt: nextEvent.end,
      allDay: nextEvent.allDay ?? false,
      updatedAt: new Date(),
    }

    addOptimisticEvent(optimisticEvent)
    moveMutation.mutate({
      id: item.id,
      title: item.title,
      description: item.description,
      location: item.location,
      color: item.color,
      startAt: nextEvent.start,
      endAt: nextEvent.end,
      allDay: nextEvent.allDay ?? false,
    })
  }

  if (!calendarQuery.data && calendarQuery.isLoading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" />
          Loading calendar...
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 xl:flex-row">
      <EventCalendar
        className="min-h-0 flex-1 overflow-hidden bg-background"
        date={date}
        getItemAllDay={(item) => item.allDay}
        getItemColor={(item) => item.color as EventColor}
        getItemDescription={(item) => item.description}
        getItemEnd={(item) => item.endAt}
        getItemId={(item) => item.id}
        getItemLocation={(item) => item.location}
        getItemStart={(item) => item.startAt}
        getItemTitle={(item) => item.title}
        items={optimisticEvents}
        onCreateRequest={beginCreate}
        onDateChange={(newDate) => {
          void navigate({
            search: (prev) => ({
              ...prev,
              date: format(newDate, "yyyy-MM-dd"),
            }),
            replace: true,
          })
        }}
        onItemDrop={handleEventDrop}
        onItemSelect={selectEvent}
        onViewChange={(newView) => {
          void navigate({
            search: (prev) => ({
              ...prev,
              view: newView,
            }),
            replace: true,
          })
        }}
        view={view}
      >
        <EventCalendarHeader className="gap-3 border-b border-border/70 px-4 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <EventCalendarNavigation />
            <div className="min-w-0">
              <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                Team calendar
              </p>
              <EventCalendarTitle className="truncate" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <EventCalendarTodayTrigger />
            <EventCalendarViewSwitcher />
            <EventCalendarCreateTrigger />
          </div>
        </EventCalendarHeader>

        <EventCalendarContent className="min-h-0 overflow-auto" />
      </EventCalendar>

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            closeDialog()
          }
        }}
        open={isDialogOpen}
      >
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto p-0">
          <DialogHeader className="border-b border-border/70 px-6 py-5">
            <DialogTitle>
              {editor?.mode === "create" ? "New event" : "Edit event"}
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-5">
            {editor ? (
              <EventEditorForm
                key={
                  editor.mode === "edit" ? `edit-${editor.eventId}` : "create"
                }
                editor={editor}
                isSaving={isSaving}
                onCancel={closeDialog}
                onCreate={handleCreateEvent}
                onDelete={handleDeleteEvent}
                onUpdate={handleUpdateEvent}
                selectedEvent={selectedEvent}
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

type EventEditorFormProps = {
  editor: EditorState
  isSaving: boolean
  onCancel: () => void
  onCreate: (values: CalendarEventFormValues) => void
  onDelete: (eventId: string) => void
  onUpdate: (eventId: string, values: CalendarEventFormValues) => void
  selectedEvent: ScheduleEventDto | null
}

function EventEditorForm({
  editor,
  isSaving,
  onCancel,
  onCreate,
  onDelete,
  onUpdate,
  selectedEvent,
}: EventEditorFormProps) {
  const form = useAppForm({
    defaultValues: editor.values,
    validators: {
      onSubmit: calendarEventFormSchema,
    },
    onSubmit: ({ value }) => {
      if (editor.mode === "create") {
        onCreate(value)
      } else {
        onUpdate(editor.eventId, value)
      }
    },
  })

  return (
    <form.AppForm>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        <form.AppField
          name="title"
          validators={{
            onBlur: calendarEventFormSchema.shape.title,
          }}
        >
          {(field) => (
            <field.InputField label="Title" placeholder="Design critique" />
          )}
        </form.AppField>

        <form.AppField name="description">
          {(field) => (
            <field.TextareaField
              label="Description"
              placeholder="Add context, links, or talking points."
            />
          )}
        </form.AppField>

        <form.AppField name="location">
          {(field) => (
            <field.InputField label="Location" placeholder="Zoom or Studio A" />
          )}
        </form.AppField>

        <form.AppField name="allDay">
          {(field) => (
            <field.SwitchField
              description="Toggle between date-only and time-based scheduling."
              label="All-day event"
            />
          )}
        </form.AppField>

        <form.Subscribe
          selector={(state) => ({
            allDay: state.values.allDay,
            startAt: state.values.startAt,
            endAt: state.values.endAt,
          })}
        >
          {({ allDay, startAt, endAt }) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <DateTimePicker
                id="calendar-editor-start"
                label={allDay ? "Starts on" : "Starts at"}
                value={formatEditorDate(startAt, allDay)}
                allDay={allDay}
                onChange={(value) =>
                  form.setFieldValue("startAt", parseEditorDate(value, allDay))
                }
              />

              <DateTimePicker
                id="calendar-editor-end"
                label={allDay ? "Ends on" : "Ends at"}
                value={formatEditorDate(endAt, allDay)}
                allDay={allDay}
                onChange={(value) =>
                  form.setFieldValue("endAt", parseEditorDate(value, allDay))
                }
              />
            </div>
          )}
        </form.Subscribe>

        {editor.mode === "edit" && selectedEvent ? (
          <>
            <Separator />
            <dl className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-2">
              <div className="space-y-1">
                <dt className="font-medium text-foreground">Created</dt>
                <dd>{format(selectedEvent.createdAt, "MMM d, yyyy h:mm a")}</dd>
              </div>
              <div className="space-y-1">
                <dt className="font-medium text-foreground">Updated</dt>
                <dd>{format(selectedEvent.updatedAt, "MMM d, yyyy h:mm a")}</dd>
              </div>
            </dl>
          </>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <form.Subscribe
            selector={(state) => ({
              isSubmitting: state.isSubmitting,
            })}
          >
            {({ isSubmitting }) => (
              <>
                <Button disabled={isSubmitting || isSaving} type="submit">
                  {isSubmitting || isSaving ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : editor.mode === "create" ? (
                    "Create event"
                  ) : (
                    "Save changes"
                  )}
                </Button>

                <Button
                  disabled={isSubmitting || isSaving}
                  onClick={onCancel}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>

                {editor.mode === "edit" ? (
                  <Button
                    className="ms-auto"
                    disabled={isSubmitting || isSaving}
                    onClick={() => onDelete(editor.eventId)}
                    type="button"
                    variant="destructive-outline"
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                ) : null}
              </>
            )}
          </form.Subscribe>
        </div>
      </form>
    </form.AppForm>
  )
}

function toEditorValues(event: ScheduleEventDto): CalendarEventFormValues {
  return {
    title: event.title,
    description: event.description ?? "",
    location: event.location ?? "",
    allDay: event.allDay,
    startAt: event.startAt,
    endAt: event.allDay ? addDays(event.endAt, -1) : event.endAt,
  }
}

function createDraftValues(startTime?: Date): CalendarEventFormValues {
  const start = startTime
    ? new Date(startTime)
    : addHours(startOfDay(new Date()), 9)
  const end = addHours(start, 1)

  return {
    title: "",
    description: "",
    location: "",
    allDay: false,
    startAt: start,
    endAt: end,
  }
}

function toMutationPayload(
  values: CalendarEventFormValues,
  existingEvents: ScheduleEventDto[],
  currentEventId?: string,
) {
  const endAt = values.allDay ? addDays(values.endAt, 1) : values.endAt

  const color = calculateDayColor(
    values.startAt,
    existingEvents,
    currentEventId,
  )

  return {
    title: values.title,
    description: values.description.trim() || undefined,
    location: values.location.trim() || undefined,
    color,
    allDay: values.allDay,
    startAt: values.startAt,
    endAt,
  }
}

function formatEditorDate(date: Date, allDay: boolean): string {
  return allDay
    ? format(date, "yyyy-MM-dd")
    : format(date, "yyyy-MM-dd'T'HH:mm")
}

function parseEditorDate(value: string, allDay: boolean): Date {
  if (allDay) {
    return new Date(`${value}T00:00:00`)
  }
  return new Date(value)
}

function calculateDayColor(
  startAt: Date,
  existingEvents: ScheduleEventDto[],
  currentEventId?: string,
): EventColor {
  const colors: EventColor[] = [
    "sky",
    "amber",
    "violet",
    "rose",
    "emerald",
    "orange",
  ]
  const dayStart = startOfDay(startAt)
  const dayEnd = addDays(dayStart, 1)

  const dayEvents = existingEvents
    .filter(
      (event) =>
        event.id !== currentEventId &&
        event.startAt >= dayStart &&
        event.startAt < dayEnd,
    )
    .sort((a, b) => a.startAt.getTime() - b.startAt.getTime())

  const position = dayEvents.length
  return colors[position % colors.length]
}

function upsertScheduleEventInCache(
  queryClient: QueryClient,
  queryKey: QueryKey,
  event: ScheduleEventDto,
) {
  queryClient.setQueryData<ScheduleEventsResponse>(queryKey, (current) => {
    const previousEvents = current?.events ?? []
    const existingIndex = previousEvents.findIndex(
      (previousEvent) => previousEvent.id === event.id,
    )

    if (existingIndex === -1) {
      return {
        events: sortEvents([...previousEvents, event]),
      }
    }

    const nextEvents = [...previousEvents]
    nextEvents[existingIndex] = event

    return {
      events: sortEvents(nextEvents),
    }
  })
}

function sortEvents(events: ScheduleEventDto[]) {
  return [...events].sort((a, b) => {
    const startDelta = a.startAt.getTime() - b.startAt.getTime()

    if (startDelta !== 0) {
      return startDelta
    }

    return a.endAt.getTime() - b.endAt.getTime()
  })
}
