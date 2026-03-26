import { addDays, addHours, startOfDay, startOfWeek } from "date-fns"
import { ArrowDownIcon, SendIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Container, Section } from "@/components/ui/design-system"
import {
  EventCalendar,
  EventCalendarContent,
  EventCalendarCreateTrigger,
  EventCalendarHeader,
  EventCalendarNavigation,
  EventCalendarTitle,
  EventCalendarTodayTrigger,
  EventCalendarViewSwitcher,
  type CalendarEvent,
  type CalendarView,
} from "@/components/ui/event-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { AiBotAvatar } from "@/modules/ai/components/ui/ai-avatar"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/modules/ai/components/ui/conversation"

type MockEvent = CalendarEvent & { id: string }

const today = new Date()

function buildSampleEvents(): MockEvent[] {
  const weekStart = startOfWeek(today, { weekStartsOn: 0 })
  const dayStart = startOfDay(today)

  return [
    {
      id: "1",
      title: "Team standup",
      start: (() => {
        const d = addHours(dayStart, 9)
        d.setMinutes(0)
        return d
      })(),
      end: (() => {
        const d = addHours(dayStart, 9)
        d.setMinutes(30)
        return d
      })(),
      color: "sky",
      location: "Zoom",
    },
    {
      id: "2",
      title: "Design review",
      start: (() => {
        const d = addHours(dayStart, 11)
        d.setMinutes(0)
        return d
      })(),
      end: (() => {
        const d = addHours(dayStart, 12)
        d.setMinutes(0)
        return d
      })(),
      color: "violet",
    },
    {
      id: "3",
      title: "Lunch with Alex",
      start: (() => {
        const d = addHours(dayStart, 12)
        d.setMinutes(30)
        return d
      })(),
      end: (() => {
        const d = addHours(dayStart, 13)
        d.setMinutes(30)
        return d
      })(),
      color: "emerald",
      location: "Downtown Cafe",
    },
    {
      id: "4",
      title: "Sprint planning",
      start: (() => {
        const d = addHours(dayStart, 14)
        d.setMinutes(0)
        return d
      })(),
      end: (() => {
        const d = addHours(dayStart, 15)
        d.setMinutes(30)
        return d
      })(),
      color: "amber",
    },
    {
      id: "5",
      title: "1:1 with manager",
      start: (() => {
        const d = addHours(startOfDay(addDays(today, 1)), 10)
        return d
      })(),
      end: (() => {
        const d = addHours(startOfDay(addDays(today, 1)), 10)
        d.setMinutes(45)
        return d
      })(),
      color: "sky",
    },
    {
      id: "6",
      title: "API architecture discussion",
      start: (() => {
        const d = addHours(startOfDay(addDays(today, 1)), 14)
        return d
      })(),
      end: (() => {
        const d = addHours(startOfDay(addDays(today, 1)), 15)
        return d
      })(),
      color: "orange",
      description: "Review new endpoint design with backend team",
    },
    {
      id: "7",
      title: "Deploy v2.4",
      start: (() => {
        const d = addHours(startOfDay(addDays(today, 2)), 9)
        return d
      })(),
      end: (() => {
        const d = addHours(startOfDay(addDays(today, 2)), 10)
        d.setMinutes(30)
        return d
      })(),
      color: "rose",
      location: "CI/CD Pipeline",
    },
    {
      id: "8",
      title: "Client demo",
      start: (() => {
        const d = addHours(startOfDay(addDays(today, 2)), 15)
        return d
      })(),
      end: (() => {
        const d = addHours(startOfDay(addDays(today, 2)), 16)
        return d
      })(),
      color: "violet",
    },
    {
      id: "9",
      title: "Workshop: Testing patterns",
      start: (() => {
        const d = addHours(startOfDay(addDays(weekStart, 1)), 13)
        return d
      })(),
      end: (() => {
        const d = addHours(startOfDay(addDays(weekStart, 1)), 15)
        return d
      })(),
      color: "amber",
      description: "Unit and integration testing best practices",
    },
    {
      id: "10",
      title: "Code review",
      start: (() => {
        const d = addHours(startOfDay(addDays(today, 3)), 10)
        return d
      })(),
      end: (() => {
        const d = addHours(startOfDay(addDays(today, 3)), 11)
        return d
      })(),
      color: "emerald",
    },
    {
      id: "11",
      title: "Release notes draft",
      start: (() => {
        const d = addHours(startOfDay(addDays(today, 4)), 9)
        return d
      })(),
      end: (() => {
        const d = addHours(startOfDay(addDays(today, 4)), 10)
        d.setMinutes(30)
        return d
      })(),
      color: "sky",
    },
    {
      id: "12",
      title: "Conference",
      start: startOfDay(addDays(today, 5)),
      end: startOfDay(addDays(today, 7)),
      allDay: true,
      color: "orange",
      location: "Convention Center",
    },
    {
      id: "13",
      title: "Company offsite",
      start: startOfDay(addDays(today, -1)),
      end: (() => {
        const d = startOfDay(addDays(today, 1))
        d.setHours(23, 59, 59)
        return d
      })(),
      allDay: true,
      color: "rose",
    },
  ]
}

function FeaturesSection() {
  const [view, setView] = React.useState<CalendarView>("month")
  const [events, setEvents] = React.useState<MockEvent[]>(buildSampleEvents)

  const handleItemDrop = React.useCallback(
    (item: MockEvent, nextEvent: CalendarEvent) => {
      setEvents((previous) =>
        previous.map((e) =>
          e.id === item.id
            ? { ...e, start: nextEvent.start, end: nextEvent.end }
            : e,
        ),
      )
    },
    [],
  )

  const scrollRef = React.useRef<HTMLDivElement>(null)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  return (
    <Section>
      <Container className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-2">
          <h2 className="font-pixel text-4xl tracking-tight lg:text-5xl">
            Features
          </h2>
          <p className="text-lg text-muted-foreground">
            A composable calendar and AI chat out of the box.
          </p>
        </div>

        <Tabs defaultValue="calendar">
          <TabsList>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="chat">AI Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="relative">
            <span className="absolute -top-8 right-12 flex gap-x-1 text-base text-muted-foreground">
              Check the views <ArrowDownIcon className="mt-4 text-primary" />
            </span>
            <EventCalendar
              className="h-220 max-h-220"
              defaultView="month"
              getItemAllDay={(e) => e.allDay}
              getItemColor={(e) => e.color}
              getItemDescription={(e) => e.description}
              getItemEnd={(e) => e.end}
              getItemId={(e) => e.id}
              getItemLocation={(e) => e.location}
              getItemStart={(e) => e.start}
              getItemTitle={(e) => e.title}
              items={events}
              keyboardShortcuts={false}
              onItemDrop={handleItemDrop}
              onItemSelect={() => {}}
              view={view}
              onViewChange={setView}
            >
              <EventCalendarHeader>
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
          </TabsContent>

          <TabsContent value="chat">
            <div className="flex h-220 max-h-220 flex-col overflow-hidden rounded-lg border">
              <Conversation scrollRef={scrollRef}>
                <ConversationContent bottomRef={bottomRef} className="mx-auto">
                  <ConversationEmptyState>
                    <AiBotAvatar className="size-40" />
                    <p className="text-2xl">How can I help?</p>
                  </ConversationEmptyState>
                </ConversationContent>
              </Conversation>

              <div className="border-t px-4 py-2">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="mx-auto flex max-w-2xl items-center gap-x-2"
                >
                  <Textarea
                    value=""
                    readOnly
                    placeholder="Type a message... (Enter to send)"
                    className="max-h-32 min-h-9 resize-none overflow-hidden rounded-sm"
                  />
                  <Button
                    type="submit"
                    size="icon-lg"
                    className="rounded-sm bg-foreground p-4.5 text-background"
                    disabled
                  >
                    <SendIcon />
                  </Button>
                </form>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </Section>
  )
}

export { FeaturesSection }
