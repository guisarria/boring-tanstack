import {
  DndContext,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type DraggableAttributes,
  type UniqueIdentifier,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities"
import { CSS } from "@dnd-kit/utilities"
import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addWeeks,
  addYears,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  differenceInDays,
  differenceInMinutes,
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  getHours,
  getMinutes,
  isPast,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns"
import {
  CalendarCheckIcon,
  CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

import { Button } from "./button"
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "./menu"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export type CalendarView = "month" | "week" | "day" | "schedule" | "year"

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  allDay?: boolean
  color?: EventColor
  location?: string
}

export type EventColor =
  | "sky"
  | "amber"
  | "violet"
  | "rose"
  | "emerald"
  | "orange"

const EVENT_HEIGHT_PX = 24
const EVENT_GAP_PX = 4
const TIME_GRID_HOUR_HEIGHT_PX = 64
const SCHEDULE_VIEW_DAY_COUNT = 30
const DAY_START_HOUR = 0
const DAY_END_HOUR = 24
const DEFAULT_EVENT_START_HOUR = 9
const DEFAULT_EVENT_COLOR: EventColor = "sky"

const CALENDAR_SHORTCUTS: Partial<Record<string, CalendarView>> = {
  d: "day",
  m: "month",
  s: "schedule",
  w: "week",
  y: "year",
}

export const CALENDAR_VIEW_OPTIONS: Array<{
  value: CalendarView
  label: string
  shortcut: string
}> = [
  { value: "month", label: "Month", shortcut: "M" },
  { value: "week", label: "Week", shortcut: "W" },
  { value: "day", label: "Day", shortcut: "D" },
  { value: "schedule", label: "Schedule", shortcut: "S" },
  { value: "year", label: "Year", shortcut: "Y" },
]

const CALENDAR_STYLE = {
  "--event-gap": `${EVENT_GAP_PX}px`,
  "--event-height": `${EVENT_HEIGHT_PX}px`,
  "--week-cells-height": `${TIME_GRID_HOUR_HEIGHT_PX}px`,
} as React.CSSProperties

const EVENT_COLOR_CLASSES: Record<EventColor, string> = {
  amber:
    "bg-amber-200/50 hover:bg-amber-200/40 text-amber-950/80 dark:bg-amber-400/25 dark:hover:bg-amber-400/20 dark:text-amber-200 shadow-amber-700/8",
  emerald:
    "bg-emerald-200/50 hover:bg-emerald-200/40 text-emerald-950/80 dark:bg-emerald-400/25 dark:hover:bg-emerald-400/20 dark:text-emerald-200 shadow-emerald-700/8",
  orange:
    "bg-orange-200/50 hover:bg-orange-200/40 text-orange-950/80 dark:bg-orange-400/25 dark:hover:bg-orange-400/20 dark:text-orange-200 shadow-orange-700/8",
  rose: "bg-rose-200/50 hover:bg-rose-200/40 text-rose-950/80 dark:bg-rose-400/25 dark:hover:bg-rose-400/20 dark:text-rose-200 shadow-rose-700/8",
  sky: "bg-sky-200/50 hover:bg-sky-200/40 text-sky-950/80 dark:bg-sky-400/25 dark:hover:bg-sky-400/20 dark:text-sky-200 shadow-sky-700/8",
  violet:
    "bg-violet-200/50 hover:bg-violet-200/40 text-violet-950/80 dark:bg-violet-400/25 dark:hover:bg-violet-400/20 dark:text-violet-200 shadow-violet-700/8",
}

const EVENT_DOT_COLOR_CLASSES: Record<EventColor, string> = {
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  orange: "bg-orange-500",
  rose: "bg-rose-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
}

type SetStateAction<T> = T | ((prevState: T) => T)

type EventCalendarContextValue = {
  calendarEvents: EventCalendarItem<unknown>[]
  canCreateEvents: boolean
  date: Date
  goToNext: () => void
  goToPrevious: () => void
  goToToday: () => void
  requestEventCreate: () => void
  requestEventCreateAt: (startTime: Date) => void
  selectEvent: (event: EventCalendarItem<unknown>) => void
  setDate: (nextValue: SetStateAction<Date>) => void
  setView: (nextValue: SetStateAction<CalendarView>) => void
  title: React.ReactNode
  view: CalendarView
}

type CalendarDndContextType = {
  activeEvent: EventCalendarItem | null
  activeId: UniqueIdentifier | null
  activeView: "month" | "week" | "day" | null
  currentTime: Date | null
  enabled: boolean
  eventHeight: number | null
  isMultiDay: boolean
  multiDayWidth: number | null
  dragHandlePosition: {
    x?: number
    y?: number
    data?: {
      isFirstDay?: boolean
      isLastDay?: boolean
    }
  } | null
}

interface EventVisibilityOptions {
  eventHeight: number
  eventGap: number
}

interface EventVisibilityResult {
  contentRef: React.RefObject<HTMLDivElement | null>
  hasMeasured: boolean
  getVisibleEventCount: (totalEvents: number) => number
}

interface TimedEventPosition {
  event: EventCalendarItem
  top: number
  height: number
  left: number
  width: number
  zIndex: number
}

interface DayEventInterval {
  start: Date
  end: Date
}

interface WeekEventPosition {
  event: EventCalendarItem
  startOffset: number
  spanDays: number
  track: number
  isFirstVisibleDay: boolean
}

interface MonthViewProps {
  currentDate: Date
  events: EventCalendarItem[]
  onEventSelect: (event: EventCalendarItem) => void
  onEventCreate: (startTime: Date) => void
}

interface WeekViewProps {
  currentDate: Date
  events: EventCalendarItem[]
  onEventSelect: (event: EventCalendarItem) => void
  onEventCreate: (startTime: Date) => void
}

interface DayViewProps {
  currentDate: Date
  events: EventCalendarItem[]
  onEventSelect: (event: EventCalendarItem) => void
  onEventCreate: (startTime: Date) => void
}

interface ScheduleViewProps {
  currentDate: Date
  events: EventCalendarItem[]
  onEventSelect: (event: EventCalendarItem) => void
}

interface YearViewProps {
  currentDate: Date
  events: EventCalendarItem[]
  onMonthClick: (date: Date) => void
  onDayClick: (date: Date) => void
}

interface EventWrapperProps {
  event: EventCalendarItem
  isFirstDay?: boolean
  isLastDay?: boolean
  isDragging?: boolean
  onClick?: (e: React.MouseEvent) => void
  className?: string
  children: React.ReactNode
  currentTime?: Date
  dndListeners?: SyntheticListenerMap
  dndAttributes?: DraggableAttributes
  onMouseDown?: (e: React.MouseEvent) => void
  onTouchStart?: (e: React.TouchEvent) => void
}

interface DroppableCellProps {
  id: string
  date: Date
  time?: number
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

interface DraggableEventProps {
  event: EventCalendarItem
  view: "month" | "week" | "day"
  showTime?: boolean
  onClick?: (e: React.MouseEvent) => void
  height?: number
  isMultiDay?: boolean
  multiDayWidth?: number
  isFirstDay?: boolean
  isLastDay?: boolean
  "aria-hidden"?: boolean | "true" | "false"
}

type EventItemProps = {
  event: EventCalendarItem
  view: "month" | "week" | "day" | "schedule"
  isDragging?: boolean
  onClick?: (e: React.MouseEvent) => void
  showTime?: boolean
  currentTime?: Date
  isFirstDay?: boolean
  isLastDay?: boolean
  children?: React.ReactNode
  className?: string
  dndListeners?: SyntheticListenerMap
  dndAttributes?: DraggableAttributes
  onMouseDown?: (e: React.MouseEvent) => void
  onTouchStart?: (e: React.TouchEvent) => void
} & Omit<React.ComponentProps<"button">, "onClick" | "children">

export type EventCalendarItem<TItem = unknown> = CalendarEvent & {
  item: TItem
}

const QUARTER_HOUR_SEGMENTS = [0, 1, 2, 3] as const

const EventCalendarContext =
  React.createContext<EventCalendarContextValue | null>(null)

const CalendarDndContext = React.createContext<CalendarDndContextType>({
  activeEvent: null,
  activeId: null,
  activeView: null,
  currentTime: null,
  enabled: false,
  dragHandlePosition: null,
  eventHeight: null,
  isMultiDay: false,
  multiDayWidth: null,
})

export function useEventCalendar(): EventCalendarContextValue {
  const context = React.useContext(EventCalendarContext)

  if (!context) {
    throw new Error("useEventCalendar must be used within an EventCalendar.")
  }

  return context
}

function useCalendarDnd() {
  return React.useContext(CalendarDndContext)
}

function useControllableState<T>({
  defaultValue,
  onChange,
  value,
}: {
  defaultValue: T
  onChange?: (value: T) => void
  value?: T
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const setValue = React.useCallback(
    (nextValue: SetStateAction<T>) => {
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue as (previousValue: T) => T)(currentValue)
          : nextValue

      if (!isControlled) {
        setInternalValue(resolvedValue)
      }

      onChange?.(resolvedValue)
    },
    [currentValue, isControlled, onChange],
  )

  return [currentValue, setValue] as const
}

function useCurrentTimeIndicator(currentDate: Date, view: "day" | "week") {
  const [currentTimePosition, setCurrentTimePosition] = React.useState(0)
  const [currentTimeVisible, setCurrentTimeVisible] = React.useState(false)
  const updateIndicator = React.useEffectEvent(() => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const totalMinutes = (hours - DAY_START_HOUR) * 60 + minutes
    const dayEndMinutes = (DAY_END_HOUR - DAY_START_HOUR) * 60
    const position = (totalMinutes / dayEndMinutes) * 100
    const isCurrentTimeVisible =
      view === "day"
        ? isSameDay(now, currentDate)
        : isWithinInterval(now, {
            end: endOfWeek(currentDate, { weekStartsOn: 0 }),
            start: startOfWeek(currentDate, { weekStartsOn: 0 }),
          })

    setCurrentTimePosition(position)
    setCurrentTimeVisible(isCurrentTimeVisible)
  })

  React.useEffect(() => {
    updateIndicator()

    const interval = setInterval(() => {
      updateIndicator()
    }, 60000)

    return () => clearInterval(interval)
  }, [currentDate, view])

  return { currentTimePosition, currentTimeVisible }
}

function useEventVisibility({
  eventHeight,
  eventGap,
}: EventVisibilityOptions): EventVisibilityResult {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = React.useState<number | null>(null)
  const updateHeight = React.useEffectEvent(() => {
    setContentHeight(contentRef.current?.clientHeight ?? null)
  })

  React.useLayoutEffect(() => {
    const element = contentRef.current

    if (!element) {
      return
    }

    updateHeight()

    const observer = new ResizeObserver(() => {
      updateHeight()
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const getVisibleEventCount = React.useMemo(() => {
    return (totalEvents: number) => {
      if (!contentHeight) {
        return totalEvents
      }

      const maxEvents = Math.floor(contentHeight / (eventHeight + eventGap))

      if (totalEvents <= maxEvents) {
        return totalEvents
      }

      return maxEvents > 0 ? maxEvents - 1 : 0
    }
  }, [contentHeight, eventGap, eventHeight])

  return {
    contentRef,
    hasMeasured: contentHeight !== null,
    getVisibleEventCount,
  }
}

export interface EventCalendarProps<TItem> extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  children: React.ReactNode
  date?: Date
  defaultDate?: Date
  defaultView?: CalendarView
  getItemAllDay?: (item: TItem) => boolean | undefined
  getItemColor?: (item: TItem) => EventColor | undefined
  getItemDescription?: (item: TItem) => string | undefined
  getItemEnd: (item: TItem) => Date
  getItemId: (item: TItem) => string
  getItemLocation?: (item: TItem) => string | undefined
  getItemStart: (item: TItem) => Date
  getItemTitle: (item: TItem) => string
  items?: TItem[]
  keyboardShortcuts?: boolean
  onCreateRequest?: (startTime?: Date) => void
  onDateChange?: (date: Date) => void
  onItemDrop?: (item: TItem, nextEvent: CalendarEvent) => Promise<void> | void
  onItemSelect?: (item: TItem) => void
  onViewChange?: (view: CalendarView) => void
  view?: CalendarView
}

export function EventCalendar<TItem>({
  children,
  className,
  date,
  defaultDate = new Date(),
  defaultView = "month",
  getItemAllDay,
  getItemColor,
  getItemDescription,
  getItemEnd,
  getItemId,
  getItemLocation,
  getItemStart,
  getItemTitle,
  items = [],
  keyboardShortcuts = true,
  onCreateRequest,
  onDateChange,
  onItemDrop,
  onItemSelect,
  onViewChange,
  style,
  view,
  ...props
}: EventCalendarProps<TItem>): React.ReactElement {
  const [currentDate, setCurrentDate] = useControllableState({
    defaultValue: defaultDate,
    onChange: onDateChange,
    value: date,
  })
  const [currentView, setCurrentView] = useControllableState({
    defaultValue: defaultView,
    onChange: onViewChange,
    value: view,
  })

  const canCreateEvents = Boolean(onCreateRequest)
  const title = React.useMemo(
    () => getCalendarTitle(currentDate, currentView),
    [currentDate, currentView],
  )
  const calendarEvents = React.useMemo<EventCalendarItem<TItem>[]>(() => {
    return items.map((item) => ({
      allDay: getItemAllDay?.(item),
      color: getItemColor?.(item),
      description: getItemDescription?.(item),
      end: new Date(getItemEnd(item)),
      id: getItemId(item),
      item,
      location: getItemLocation?.(item),
      start: new Date(getItemStart(item)),
      title: getItemTitle(item),
    }))
  }, [
    getItemAllDay,
    getItemColor,
    getItemDescription,
    getItemEnd,
    getItemId,
    getItemLocation,
    getItemStart,
    getItemTitle,
    items,
  ])

  const goToNext = React.useCallback(() => {
    setCurrentDate((previousDate) =>
      shiftCalendarDateByView(previousDate, currentView, 1),
    )
  }, [currentView, setCurrentDate])

  const goToPrevious = React.useCallback(() => {
    setCurrentDate((previousDate) =>
      shiftCalendarDateByView(previousDate, currentView, -1),
    )
  }, [currentView, setCurrentDate])

  const goToToday = React.useCallback(() => {
    setCurrentDate(new Date())
  }, [setCurrentDate])

  const requestEventCreate = React.useCallback(() => {
    onCreateRequest?.()
  }, [onCreateRequest])

  const requestEventCreateAt = React.useCallback(
    (startTime: Date) => {
      onCreateRequest?.(startTime)
    },
    [onCreateRequest],
  )

  const selectEvent = React.useCallback(
    (event: EventCalendarItem<unknown>) => {
      onItemSelect?.(event.item as TItem)
    },
    [onItemSelect],
  )

  React.useEffect(() => {
    if (!keyboardShortcuts) {
      return
    }

    function handleKeyboardShortcut(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) {
        return
      }

      const nextView = CALENDAR_SHORTCUTS[event.key.toLowerCase()]

      if (nextView) {
        setCurrentView(nextView)
      }
    }

    window.addEventListener("keydown", handleKeyboardShortcut)

    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcut)
    }
  }, [keyboardShortcuts, setCurrentView])

  const contextValue = React.useMemo<EventCalendarContextValue>(
    () => ({
      calendarEvents,
      canCreateEvents,
      date: currentDate,
      goToNext,
      goToPrevious,
      goToToday,
      requestEventCreate,
      requestEventCreateAt,
      selectEvent,
      setDate: setCurrentDate,
      setView: setCurrentView,
      title,
      view: currentView,
    }),
    [
      calendarEvents,
      canCreateEvents,
      currentDate,
      currentView,
      goToNext,
      goToPrevious,
      goToToday,
      requestEventCreate,
      requestEventCreateAt,
      selectEvent,
      setCurrentDate,
      setCurrentView,
      title,
    ],
  )

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border has-data-[slot=month-view]:flex-1",
        className,
      )}
      data-slot="event-calendar"
      style={{ ...CALENDAR_STYLE, ...style }}
      {...props}
    >
      <EventCalendarContext.Provider value={contextValue}>
        <CalendarDndProvider
          enabled={Boolean(onItemDrop)}
          onEventUpdate={(event) => {
            void onItemDrop?.(event.item as TItem, toCalendarEvent(event))
          }}
        >
          {children}
        </CalendarDndProvider>
      </EventCalendarContext.Provider>
    </div>
  )
}

export function EventCalendarHeader({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn("flex items-center justify-between p-2 sm:p-4", className)}
      data-slot="event-calendar-header"
      {...props}
    />
  )
}

export function EventCalendarNavigation({
  children,
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn("flex items-center sm:gap-2", className)}
      data-slot="event-calendar-navigation"
      {...props}
    >
      {children ?? (
        <>
          <EventCalendarPreviousTrigger />
          <EventCalendarNextTrigger />
        </>
      )}
    </div>
  )
}

export function EventCalendarPreviousTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>): React.ReactElement {
  const { goToPrevious } = useEventCalendar()

  return (
    <Button
      aria-label="Previous"
      className={className}
      data-slot="event-calendar-previous-trigger"
      onClick={(event) => {
        onClick?.(event)
        goToPrevious()
      }}
      size="icon"
      variant="ghost"
      {...props}
    >
      <ChevronLeft aria-hidden="true" size={16} />
    </Button>
  )
}

export function EventCalendarNextTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>): React.ReactElement {
  const { goToNext } = useEventCalendar()

  return (
    <Button
      aria-label="Next"
      className={className}
      data-slot="event-calendar-next-trigger"
      onClick={(event) => {
        onClick?.(event)
        goToNext()
      }}
      size="icon"
      variant="ghost"
      {...props}
    >
      <ChevronRight aria-hidden="true" size={16} />
    </Button>
  )
}

export function EventCalendarTodayTrigger({
  children,
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>): React.ReactElement {
  const { goToToday } = useEventCalendar()
  const label = "Today"

  return (
    <Button
      className={cn("max-[479px]:aspect-square max-[479px]:p-0!", className)}
      data-slot="event-calendar-today-trigger"
      onClick={(event) => {
        onClick?.(event)
        goToToday()
      }}
      variant="outline"
      {...props}
    >
      {children ?? (
        <>
          <CalendarCheckIcon
            aria-hidden="true"
            className="min-[480px]:hidden"
            size={16}
          />
          <span className="sr-only">{label}</span>
          <span aria-hidden="true" className="hidden min-[480px]:inline">
            {label}
          </span>
        </>
      )}
    </Button>
  )
}

export function EventCalendarTitle({
  children,
  className,
  ...props
}: React.ComponentProps<"h2">): React.ReactElement {
  const { title } = useEventCalendar()

  return (
    <h2
      className={cn("text-sm font-semibold sm:text-lg md:text-xl", className)}
      data-slot="event-calendar-title"
      {...props}
    >
      {children ?? title}
    </h2>
  )
}

export function EventCalendarViewSwitcher({
  className,
}: {
  className?: string
}): React.ReactElement {
  const { setView, view } = useEventCalendar()
  const viewLabel = view.charAt(0).toUpperCase() + view.slice(1)
  const abbreviatedViewLabel = viewLabel[0]

  return (
    <Menu>
      <MenuTrigger
        className={cn(
          "inline-flex min-h-7 items-center gap-1.5 rounded-lg border border-input bg-background px-3 text-sm outline-none max-[479px]:h-8",
          className,
        )}
        data-slot="event-calendar-view-switcher"
      >
        <span>
          <span className="sr-only">{viewLabel}</span>
          <span aria-hidden="true" className="min-[480px]:hidden">
            {abbreviatedViewLabel}
          </span>
          <span aria-hidden="true" className="hidden min-[480px]:inline">
            {viewLabel}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="-me-1 opacity-60"
          size={16}
        />
      </MenuTrigger>
      <MenuPopup align="end" className="min-w-32">
        {CALENDAR_VIEW_OPTIONS.map((option) => (
          <MenuItem key={option.value} onClick={() => setView(option.value)}>
            {option.label}
            <kbd className="pointer-events-none ms-auto inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground select-none">
              {option.shortcut}
            </kbd>
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  )
}

export function EventCalendarCreateTrigger({
  children,
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>): React.ReactElement | null {
  const { canCreateEvents, requestEventCreate } = useEventCalendar()

  if (!canCreateEvents) {
    return null
  }

  return (
    <Button
      className={cn("max-[479px]:aspect-square max-[479px]:p-0!", className)}
      data-slot="event-calendar-create-trigger"
      onClick={(event) => {
        onClick?.(event)
        requestEventCreate()
      }}
      size="sm"
      {...props}
    >
      {children ?? (
        <>
          <Plus aria-hidden="true" className="opacity-60 sm:-ms-1" size={16} />
          <span className="max-sm:sr-only">New event</span>
        </>
      )}
    </Button>
  )
}

export function EventCalendarContent({
  children,
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn("flex flex-1 flex-col", className)}
      data-slot="event-calendar-content"
      {...props}
    >
      {children ?? <EventCalendarCurrentView />}
    </div>
  )
}

export function EventCalendarCurrentView(): React.ReactElement {
  const { view } = useEventCalendar()

  switch (view) {
    case "month":
      return <EventCalendarMonthView />
    case "week":
      return <EventCalendarWeekView />
    case "day":
      return <EventCalendarDayView />
    case "schedule":
      return <EventCalendarScheduleView />
    case "year":
      return <EventCalendarYearView />
  }
}

export function EventCalendarMonthView(): React.ReactElement {
  const { calendarEvents, date, requestEventCreateAt, selectEvent } =
    useEventCalendar()

  return (
    <MonthView
      currentDate={date}
      events={calendarEvents}
      onEventCreate={requestEventCreateAt}
      onEventSelect={selectEvent}
    />
  )
}

export function EventCalendarWeekView(): React.ReactElement {
  const { calendarEvents, date, requestEventCreateAt, selectEvent } =
    useEventCalendar()

  return (
    <WeekView
      currentDate={date}
      events={calendarEvents}
      onEventCreate={requestEventCreateAt}
      onEventSelect={selectEvent}
    />
  )
}

export function EventCalendarDayView(): React.ReactElement {
  const { calendarEvents, date, requestEventCreateAt, selectEvent } =
    useEventCalendar()

  return (
    <DayView
      currentDate={date}
      events={calendarEvents}
      onEventCreate={requestEventCreateAt}
      onEventSelect={selectEvent}
    />
  )
}

export function EventCalendarScheduleView(): React.ReactElement {
  const { calendarEvents, date, selectEvent } = useEventCalendar()

  return (
    <ScheduleView
      currentDate={date}
      events={calendarEvents}
      onEventSelect={selectEvent}
    />
  )
}

export function EventCalendarYearView(): React.ReactElement {
  const { calendarEvents, date, setDate, setView } = useEventCalendar()

  return (
    <YearView
      currentDate={date}
      events={calendarEvents}
      onDayClick={(nextDate) => {
        setDate(nextDate)
        setView("day")
      }}
      onMonthClick={(nextDate) => {
        setDate(nextDate)
        setView("month")
      }}
    />
  )
}

function CalendarDndProvider({
  children,
  enabled,
  onEventUpdate,
}: {
  children: React.ReactNode
  enabled: boolean
  onEventUpdate: (event: EventCalendarItem) => void
}) {
  const [activeEvent, setActiveEvent] =
    React.useState<EventCalendarItem | null>(null)
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null)
  const [activeView, setActiveView] = React.useState<
    "month" | "week" | "day" | null
  >(null)
  const [currentTime, setCurrentTime] = React.useState<Date | null>(null)
  const [eventHeight, setEventHeight] = React.useState<number | null>(null)
  const [isMultiDay, setIsMultiDay] = React.useState(false)
  const [multiDayWidth, setMultiDayWidth] = React.useState<number | null>(null)
  const [dragHandlePosition, setDragHandlePosition] = React.useState<{
    x?: number
    y?: number
    data?: {
      isFirstDay?: boolean
      isLastDay?: boolean
    }
  } | null>(null)
  const eventDimensions = React.useRef({ height: 0, width: 0 })
  const initialOverDate = React.useRef<Date | null>(null)
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  )
  const dndContextId = React.useId()

  const resetDragState = () => {
    setActiveEvent(null)
    setActiveId(null)
    setActiveView(null)
    setCurrentTime(null)
    setEventHeight(null)
    setIsMultiDay(false)
    setMultiDayWidth(null)
    setDragHandlePosition(null)
    eventDimensions.current = { height: 0, width: 0 }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event

    if (!active.data.current) {
      console.error("Missing data in drag start event", event)
      return
    }

    const {
      event: calendarEvent,
      view,
      height,
      width,
      isMultiDay: eventIsMultiDay,
      multiDayWidth: eventMultiDayWidth,
      dragHandlePosition: eventDragHandlePosition,
    } = active.data.current as {
      event: EventCalendarItem
      view: "month" | "week" | "day"
      height?: number
      width?: number
      isMultiDay?: boolean
      multiDayWidth?: number
      dragHandlePosition?: {
        x?: number
        y?: number
        data?: {
          isFirstDay?: boolean
          isLastDay?: boolean
        }
      }
    }

    setActiveEvent(calendarEvent)
    setActiveId(active.id)
    setActiveView(view)
    setCurrentTime(new Date(calendarEvent.start))
    setIsMultiDay(eventIsMultiDay || false)
    setMultiDayWidth(eventMultiDayWidth || null)
    setDragHandlePosition(eventDragHandlePosition || null)
    initialOverDate.current = null
    eventDimensions.current = { height: 0, width: 0 }

    if (height) {
      eventDimensions.current.height = height
      setEventHeight(height)
    }

    if (width) {
      eventDimensions.current.width = width
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event

    if (over && activeEvent && over.data.current) {
      const { date, time } = over.data.current as { date: Date; time?: number }

      if (time !== undefined && activeView !== "month") {
        const newTime = setDateTimeFromQuarterHourValue(date, time)

        if (
          !currentTime ||
          newTime.getHours() !== currentTime.getHours() ||
          newTime.getMinutes() !== currentTime.getMinutes() ||
          newTime.getDate() !== currentTime.getDate() ||
          newTime.getMonth() !== currentTime.getMonth() ||
          newTime.getFullYear() !== currentTime.getFullYear()
        ) {
          setCurrentTime(newTime)
        }
      } else if (activeView === "month") {
        if (!initialOverDate.current) {
          initialOverDate.current = date
        }

        const activeEventStart = new Date(activeEvent.start)
        const dayOffset = differenceInCalendarDays(
          date,
          initialOverDate.current,
        )
        const newStart = addDays(activeEventStart, dayOffset)

        if (currentTime) {
          newStart.setHours(
            currentTime.getHours(),
            currentTime.getMinutes(),
            currentTime.getSeconds(),
            currentTime.getMilliseconds(),
          )
        }

        if (
          !currentTime ||
          newStart.getDate() !== currentTime.getDate() ||
          newStart.getMonth() !== currentTime.getMonth() ||
          newStart.getFullYear() !== currentTime.getFullYear()
        ) {
          setCurrentTime(newStart)
        }
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !activeEvent || !currentTime) {
      resetDragState()
      return
    }

    try {
      if (!active.data.current || !over.data.current) {
        throw new Error("Missing data in drag event")
      }

      const activeData = active.data.current as {
        event?: EventCalendarItem
      }
      const overData = over.data.current as { date?: Date; time?: number }

      if (!activeData.event || !overData.date) {
        throw new Error("Missing required event data")
      }

      const calendarEvent = activeData.event
      const newStart =
        overData.time !== undefined
          ? setDateTimeFromQuarterHourValue(overData.date, overData.time)
          : new Date(overData.date)

      if (overData.time === undefined) {
        newStart.setFullYear(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate(),
        )
        newStart.setHours(
          currentTime.getHours(),
          currentTime.getMinutes(),
          currentTime.getSeconds(),
          currentTime.getMilliseconds(),
        )
      }

      const originalStart = new Date(calendarEvent.start)
      const originalEnd = new Date(calendarEvent.end)
      const durationMinutes = differenceInMinutes(originalEnd, originalStart)
      const newEnd = addMinutes(newStart, durationMinutes)

      const hasStartTimeChanged =
        originalStart.getFullYear() !== newStart.getFullYear() ||
        originalStart.getMonth() !== newStart.getMonth() ||
        originalStart.getDate() !== newStart.getDate() ||
        originalStart.getHours() !== newStart.getHours() ||
        originalStart.getMinutes() !== newStart.getMinutes()

      if (hasStartTimeChanged) {
        onEventUpdate({
          ...calendarEvent,
          end: newEnd,
          start: newStart,
        })
      }
    } catch (error) {
      console.error("Error in drag end handler:", error)
    } finally {
      resetDragState()
    }
  }

  return (
    <DndContext
      collisionDetection={pointerWithin}
      id={dndContextId}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <CalendarDndContext.Provider
        value={{
          activeEvent,
          activeId,
          activeView,
          currentTime,
          enabled,
          dragHandlePosition,
          eventHeight,
          isMultiDay,
          multiDayWidth,
        }}
      >
        {children}

        <DragOverlay adjustScale={false} dropAnimation={null}>
          {activeEvent && activeView && (
            <div
              style={{
                height: eventHeight ? `${eventHeight}px` : "auto",
                width:
                  eventDimensions.current.width > 0
                    ? `${eventDimensions.current.width}px`
                    : isMultiDay && multiDayWidth
                      ? `${multiDayWidth}%`
                      : "100%",
              }}
            >
              <EventItem
                currentTime={currentTime || undefined}
                event={activeEvent}
                isDragging={true}
                isFirstDay={dragHandlePosition?.data?.isFirstDay !== false}
                isLastDay={dragHandlePosition?.data?.isLastDay !== false}
                showTime={activeView !== "month"}
                view={activeView}
              />
            </div>
          )}
        </DragOverlay>
      </CalendarDndContext.Provider>
    </DndContext>
  )
}

function EventWrapper({
  event,
  isFirstDay = true,
  isLastDay = true,
  isDragging,
  onClick,
  className,
  children,
  currentTime,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventWrapperProps) {
  const displayEnd = currentTime
    ? new Date(
        new Date(currentTime).getTime() +
          (new Date(event.end).getTime() - new Date(event.start).getTime()),
      )
    : new Date(event.end)

  return (
    <button
      className={cn(
        "flex size-full overflow-hidden px-1 text-left font-medium backdrop-blur-md transition outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-dragging:cursor-grabbing data-dragging:shadow-lg data-past-event:line-through sm:px-2",
        getEventColorClasses(event.color),
        getBorderRadiusClasses(isFirstDay, isLastDay),
        className,
      )}
      data-dragging={isDragging || undefined}
      data-past-event={isPast(displayEnd) || undefined}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      type="button"
      {...dndListeners}
      {...dndAttributes}
    >
      {children}
    </button>
  )
}

function EventItem({
  event,
  view,
  isDragging,
  onClick,
  showTime,
  currentTime,
  isFirstDay = true,
  isLastDay = true,
  children,
  className,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
  ...props
}: EventItemProps) {
  const displayStart = currentTime || new Date(event.start)
  const displayEnd = getDisplayEnd(event, currentTime)
  const durationMinutes = differenceInMinutes(displayEnd, displayStart)
  const eventTime = getEventTimeLabel(
    event,
    displayStart,
    displayEnd,
    durationMinutes,
  )

  if (view === "month") {
    return (
      <EventWrapper
        className={cn(
          "mt-(--event-gap) h-(--event-height) items-center text-[10px] sm:text-xs",
          className,
        )}
        currentTime={currentTime}
        dndAttributes={dndAttributes}
        dndListeners={dndListeners}
        event={event}
        isDragging={isDragging}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {children || (
          <span className="truncate">
            {!event.allDay && (
              <span className="truncate font-normal opacity-70 sm:text-[11px]">
                {formatTimeWithOptionalMinutes(displayStart)}{" "}
              </span>
            )}
            {event.title}
          </span>
        )}
      </EventWrapper>
    )
  }

  if (view === "week" || view === "day") {
    return (
      <EventWrapper
        className={cn(
          "py-1",
          durationMinutes < 45 ? "items-center" : "flex-col",
          view === "week" ? "text-[10px] sm:text-xs" : "text-xs",
          className,
        )}
        currentTime={currentTime}
        dndAttributes={dndAttributes}
        dndListeners={dndListeners}
        event={event}
        isDragging={isDragging}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {durationMinutes < 45 ? (
          <div className="truncate">
            {event.title}{" "}
            {showTime && (
              <span className="opacity-70">
                {formatTimeWithOptionalMinutes(displayStart)}
              </span>
            )}
          </div>
        ) : (
          <>
            <div className="truncate font-medium">{event.title}</div>
            {showTime && (
              <div className="truncate font-normal opacity-70 sm:text-[11px]">
                {eventTime}
              </div>
            )}
          </>
        )}
      </EventWrapper>
    )
  }

  return (
    <button
      className={cn(
        "flex w-full flex-col gap-1 rounded p-2 text-left transition outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-past-event:line-through data-past-event:opacity-90",
        getEventColorClasses(event.color),
        className,
      )}
      data-past-event={isPast(new Date(event.end)) || undefined}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      type="button"
      {...dndListeners}
      {...dndAttributes}
      {...props}
    >
      <div className="text-sm font-medium">{event.title}</div>
      <div className="text-xs opacity-70">
        {event.allDay ? (
          <span>All day</span>
        ) : (
          <span className="uppercase">
            {formatTimeWithOptionalMinutes(displayStart)} -{" "}
            {formatTimeWithOptionalMinutes(displayEnd)}
          </span>
        )}
        {event.location && (
          <>
            <span className="px-1 opacity-35"> · </span>
            <span>{event.location}</span>
          </>
        )}
      </div>
      {event.description && (
        <div className="my-1 text-xs opacity-90">{event.description}</div>
      )}
    </button>
  )
}

function DroppableCell({
  id,
  date,
  time,
  children,
  className,
  onClick,
}: DroppableCellProps) {
  const { activeEvent, currentTime, activeView, enabled } = useCalendarDnd()
  const { setNodeRef, isOver } = useDroppable({
    disabled: !enabled,
    data: { date, time },
    id,
  })
  const isHighlight = activeEvent
    ? activeView === "month" && currentTime
      ? isSameDay(date, currentTime)
      : isOver
    : false

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden px-0.5 py-1 data-dragging:bg-accent sm:px-1",
        className,
      )}
      data-dragging={isHighlight ? true : undefined}
      onClick={onClick}
      ref={setNodeRef}
    >
      {children}
    </div>
  )
}

function DraggableEvent({
  event,
  view,
  showTime,
  onClick,
  height,
  isMultiDay,
  multiDayWidth,
  isFirstDay = true,
  isLastDay = true,
  "aria-hidden": ariaHidden,
}: DraggableEventProps) {
  const { activeId, enabled } = useCalendarDnd()
  const elementRef = React.useRef<HTMLDivElement>(null)
  const [dragHandlePosition, setDragHandlePosition] = React.useState<{
    x: number
    y: number
  } | null>(null)
  const eventStart = new Date(event.start)
  const eventEnd = new Date(event.end)
  const isMultiDayEvent =
    isMultiDay || event.allDay || differenceInDays(eventEnd, eventStart) >= 1

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      data: {
        dragHandlePosition,
        event,
        height: height || elementRef.current?.offsetHeight || null,
        width: elementRef.current?.offsetWidth || null,
        isFirstDay,
        isLastDay,
        isMultiDay: isMultiDayEvent,
        multiDayWidth,
        view,
      },
      disabled: !enabled,
      id: `${event.id}-${view}`,
    })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!elementRef.current) {
      return
    }

    const rect = elementRef.current.getBoundingClientRect()
    setDragHandlePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!elementRef.current) {
      return
    }

    const rect = elementRef.current.getBoundingClientRect()
    const touch = e.touches[0]

    if (touch) {
      setDragHandlePosition({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      })
    }
  }

  if (isDragging || activeId === `${event.id}-${view}`) {
    return (
      <div
        className="opacity-0"
        ref={setNodeRef}
        style={{ height: height || "auto" }}
      />
    )
  }

  const style = transform
    ? {
        height: height || "auto",
        transform: CSS.Translate.toString(transform),
        width:
          isMultiDayEvent && multiDayWidth ? `${multiDayWidth}%` : undefined,
      }
    : {
        height: height || "auto",
        width:
          isMultiDayEvent && multiDayWidth ? `${multiDayWidth}%` : undefined,
      }

  return (
    <div
      className="touch-none"
      ref={(node) => {
        setNodeRef(node)
        if (elementRef) {
          elementRef.current = node
        }
      }}
      style={style}
    >
      <EventItem
        aria-hidden={ariaHidden}
        dndAttributes={attributes}
        dndListeners={listeners}
        event={event}
        isDragging={isDragging}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        onClick={onClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        showTime={showTime}
        view={view}
      />
    </div>
  )
}

function MonthView({
  currentDate,
  events,
  onEventSelect,
  onEventCreate,
}: MonthViewProps) {
  const days = React.useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

    return eachDayOfInterval({ end: calendarEnd, start: calendarStart })
  }, [currentDate])

  const weekdays = React.useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(startOfWeek(new Date()), i)
      return format(date, "EEE")
    })
  }, [])

  const weeks = React.useMemo(() => {
    const result: Date[][] = []
    let week: Date[] = []

    for (let i = 0; i < days.length; i++) {
      week.push(days[i]!)
      if (week.length === 7 || i === days.length - 1) {
        result.push(week)
        week = []
      }
    }

    return result
  }, [days])

  const { contentRef, getVisibleEventCount, hasMeasured } = useEventVisibility({
    eventGap: EVENT_GAP_PX,
    eventHeight: EVENT_HEIGHT_PX,
  })

  const handleEventClick = (event: EventCalendarItem, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventSelect(event)
  }

  return (
    <div className="contents" data-slot="month-view">
      <div className="grid grid-cols-7 border-b border-border/70">
        {weekdays.map((day) => (
          <div
            className="py-2 text-center text-sm text-muted-foreground/70"
            key={day}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid flex-1 auto-rows-fr">
        {weeks.map((week, weekIndex) => (
          <div
            className="relative grid grid-cols-7 [&:last-child>*]:border-b-0"
            key={`week-${weekIndex}`}
          >
            <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-7">
              {getWeekEventPositions(events, week).map((posEvent) => {
                if (!hasMeasured) {
                  return null
                }

                const maxVisible = getVisibleEventCount(100)
                if (maxVisible && posEvent.track >= maxVisible) {
                  return null
                }

                const isFirstDay =
                  posEvent.startOffset === 0 || posEvent.isFirstVisibleDay
                const eventEnd = new Date(posEvent.event.end)
                const actualIsLastDay =
                  isSameDay(
                    eventEnd,
                    week[posEvent.startOffset + posEvent.spanDays - 1]!,
                  ) ||
                  eventEnd <=
                    week[posEvent.startOffset + posEvent.spanDays - 1]!

                return (
                  <div
                    key={`abs-${posEvent.event.id}-${weekIndex}`}
                    className="pointer-events-auto absolute px-1"
                    style={{
                      left: `calc((100% / 7) * ${posEvent.startOffset})`,
                      top: `calc(32px + ${posEvent.track} * (var(--event-height) + var(--event-gap)))`,
                      width: `calc((100% / 7) * ${posEvent.spanDays})`,
                    }}
                  >
                    <DraggableEvent
                      event={posEvent.event}
                      isFirstDay={isFirstDay}
                      isLastDay={actualIsLastDay}
                      onClick={(e) => handleEventClick(posEvent.event, e)}
                      view="month"
                    />
                  </div>
                )
              })}
            </div>

            {week.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(events, day)
              const spanningEvents = getSpanningEventsForDay(events, day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const allDayEvents = [...spanningEvents, ...dayEvents]
              const allEvents = getAllEventsForDay(events, day)
              const isReferenceCell = weekIndex === 0 && dayIndex === 0
              const visibleCount = hasMeasured
                ? getVisibleEventCount(allDayEvents.length)
                : undefined
              const hasMore =
                visibleCount !== undefined && allDayEvents.length > visibleCount
              const remainingCount = hasMore
                ? allDayEvents.length - visibleCount
                : 0

              return (
                <div
                  className="group border-r border-b border-border/70 last:border-r-0 data-outside-cell:bg-muted/25 data-outside-cell:text-muted-foreground/70"
                  data-outside-cell={!isCurrentMonth || undefined}
                  data-today={isToday(day) || undefined}
                  key={day.toString()}
                >
                  <DroppableCell
                    date={day}
                    id={`month-cell-${day.toISOString()}`}
                    onClick={() => {
                      const startTime = new Date(day)
                      startTime.setHours(DEFAULT_EVENT_START_HOUR, 0, 0)
                      onEventCreate(startTime)
                    }}
                  >
                    <div className="mt-1 inline-flex size-6 items-center justify-center rounded-full text-sm group-data-today:bg-primary group-data-today:text-primary-foreground">
                      {format(day, "d")}
                    </div>
                    <div
                      className="min-h-[calc((var(--event-height)+var(--event-gap))*2)] sm:min-h-[calc((var(--event-height)+var(--event-gap))*3)] lg:min-h-[calc((var(--event-height)+var(--event-gap))*4)]"
                      ref={isReferenceCell ? contentRef : null}
                    >
                      {hasMore && (
                        <Popover modal>
                          <PopoverTrigger
                            className="mt-(--event-gap) flex h-(--event-height) w-full items-center overflow-hidden px-1 text-left text-[10px] text-muted-foreground backdrop-blur-md transition outline-none select-none hover:bg-muted/50 hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:px-2 sm:text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>
                              + {remainingCount}{" "}
                              <span className="max-sm:sr-only">more</span>
                            </span>
                          </PopoverTrigger>
                          <PopoverContent
                            align="center"
                            className="max-w-52 p-3"
                            style={
                              {
                                "--event-height": `${EVENT_HEIGHT_PX}px`,
                              } as Record<string, string>
                            }
                          >
                            <div className="space-y-2">
                              <div className="text-sm font-medium">
                                {format(day, "EEE d")}
                              </div>
                              <div className="space-y-1">
                                {sortEvents(allEvents).map((event) => {
                                  const eventStart = new Date(event.start)
                                  const eventEnd = new Date(event.end)

                                  return (
                                    <EventItem
                                      event={event}
                                      isFirstDay={isSameDay(day, eventStart)}
                                      isLastDay={isSameDay(day, eventEnd)}
                                      key={event.id}
                                      onClick={(e) =>
                                        handleEventClick(event, e)
                                      }
                                      view="month"
                                    />
                                  )
                                })}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </DroppableCell>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function WeekView({
  currentDate,
  events,
  onEventSelect,
  onEventCreate,
}: WeekViewProps) {
  const days = React.useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 })

    return eachDayOfInterval({ end: weekEnd, start: weekStart })
  }, [currentDate])

  const hours = React.useMemo(() => {
    const dayStart = startOfDay(currentDate)
    return eachHourOfInterval({
      end: addHours(dayStart, DAY_END_HOUR - 1),
      start: addHours(dayStart, DAY_START_HOUR),
    })
  }, [currentDate])

  const allDayEvents = React.useMemo(() => {
    return getAllDayEventsInRange(events, days)
  }, [days, events])

  const processedDayEvents = React.useMemo(() => {
    return days.map((day) => getTimedEventPositions(events, day))
  }, [days, events])

  const { currentTimePosition, currentTimeVisible } = useCurrentTimeIndicator(
    currentDate,
    "week",
  )

  const positionedAllDayEvents = React.useMemo(() => {
    return allDayEvents.length > 0
      ? getWeekEventPositions(allDayEvents, days)
      : []
  }, [allDayEvents, days])

  const maxAllDayTrack =
    positionedAllDayEvents.length > 0
      ? Math.max(...positionedAllDayEvents.map((e) => e.track))
      : -1
  const allDaySectionHeight = `calc(8px + (var(--event-height) + var(--event-gap)) * ${maxAllDayTrack + 1})`

  const handleEventClick = (event: EventCalendarItem, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventSelect(event)
  }

  return (
    <div className="flex h-full flex-col" data-slot="week-view">
      <div className="sticky top-0 z-30 grid grid-cols-8 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="py-2 text-center text-sm text-muted-foreground/70">
          <span className="max-[479px]:sr-only">{format(new Date(), "O")}</span>
        </div>
        {days.map((day) => (
          <div
            className="py-2 text-center text-sm text-muted-foreground/70 data-today:font-medium data-today:text-foreground"
            data-today={isToday(day) || undefined}
            key={day.toString()}
          >
            <span aria-hidden="true" className="sm:hidden">
              {format(day, "E")[0]} {format(day, "d")}
            </span>
            <span className="max-sm:hidden">{format(day, "EEE dd")}</span>
          </div>
        ))}
      </div>

      {allDayEvents.length > 0 && (
        <div className="border-b border-border/70 bg-muted/50">
          <div className="relative grid grid-cols-8">
            <div
              className="relative border-r border-border/70"
              style={{ minHeight: allDaySectionHeight }}
            >
              <span className="absolute bottom-0 left-0 h-6 w-16 max-w-full pe-2 text-right text-[10px] text-muted-foreground/70 sm:pe-4 sm:text-xs">
                All day
              </span>
            </div>

            {days.map((day) => (
              <div
                className="relative border-r border-border/70 last:border-r-0"
                data-today={isToday(day) || undefined}
                key={day.toString()}
              />
            ))}

            <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-8">
              <div className="relative col-span-7 col-start-2 h-full w-full">
                {positionedAllDayEvents.map((posEvent) => {
                  const isFirstDay =
                    posEvent.startOffset === 0 || posEvent.isFirstVisibleDay
                  const eventEnd = new Date(posEvent.event.end)
                  const actualIsLastDay =
                    isSameDay(
                      eventEnd,
                      days[posEvent.startOffset + posEvent.spanDays - 1]!,
                    ) ||
                    eventEnd <=
                      days[posEvent.startOffset + posEvent.spanDays - 1]!

                  return (
                    <div
                      key={`spanning-${posEvent.event.id}`}
                      className="pointer-events-auto absolute px-1"
                      style={{
                        left: `calc((100% / 7) * ${posEvent.startOffset})`,
                        top: `calc(4px + ${posEvent.track} * (var(--event-height) + var(--event-gap)))`,
                        width: `calc((100% / 7) * ${posEvent.spanDays})`,
                      }}
                    >
                      <EventItem
                        event={posEvent.event}
                        isFirstDay={isFirstDay}
                        isLastDay={actualIsLastDay}
                        onClick={(e) => handleEventClick(posEvent.event, e)}
                        view="month"
                      >
                        <div
                          aria-hidden={!isFirstDay}
                          className={cn("truncate", !isFirstDay && "invisible")}
                        >
                          {posEvent.event.title}
                        </div>
                      </EventItem>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-8">
          <div className="grid auto-cols-fr border-r border-border/70">
            {hours.map((hour, index) => (
              <div
                className="relative min-h-(--week-cells-height) border-b border-border/70 last:border-b-0"
                key={hour.toString()}
              >
                {index > 0 && (
                  <span className="absolute -top-3 left-0 flex h-6 w-16 max-w-full items-center justify-end bg-background pe-2 text-[10px] text-muted-foreground/70 sm:pe-4 sm:text-xs">
                    {format(hour, "h a")}
                  </span>
                )}
              </div>
            ))}
          </div>

          {days.map((day, dayIndex) => (
            <div
              className="relative grid auto-cols-fr border-r border-border/70 last:border-r-0"
              data-today={isToday(day) || undefined}
              key={day.toString()}
            >
              {(processedDayEvents[dayIndex] ?? []).map((positionedEvent) => (
                <div
                  className="absolute z-10 px-0.5"
                  key={positionedEvent.event.id}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    height: `${positionedEvent.height}px`,
                    left: `${positionedEvent.left * 100}%`,
                    top: `${positionedEvent.top}px`,
                    width: `${positionedEvent.width * 100}%`,
                    zIndex: positionedEvent.zIndex,
                  }}
                >
                  <div className="size-full">
                    <DraggableEvent
                      event={positionedEvent.event}
                      height={positionedEvent.height}
                      onClick={(e) =>
                        handleEventClick(positionedEvent.event, e)
                      }
                      showTime
                      view="week"
                    />
                  </div>
                </div>
              ))}

              {currentTimeVisible && isToday(day) && (
                <div
                  className="pointer-events-none absolute left-0 z-20 w-full"
                  style={{ top: `${currentTimePosition}%` }}
                >
                  <div className="relative flex items-center">
                    <div className="absolute -top-1 h-2 w-px bg-primary/60" />
                    <div className="h-px w-full bg-primary/60" />
                  </div>
                </div>
              )}

              {hours.map((hour) => {
                const hourValue = getHours(hour)
                return (
                  <div
                    className="relative min-h-(--week-cells-height) border-b border-border/70 last:border-b-0"
                    key={hour.toString()}
                  >
                    {QUARTER_HOUR_SEGMENTS.map((quarter) => {
                      const quarterHourTime = hourValue + quarter * 0.25

                      return (
                        <DroppableCell
                          className={cn(
                            "absolute h-[calc(var(--week-cells-height)/4)] w-full",
                            quarter === 0 && "top-0",
                            quarter === 1 &&
                              "top-[calc(var(--week-cells-height)/4)]",
                            quarter === 2 &&
                              "top-[calc(var(--week-cells-height)/4*2)]",
                            quarter === 3 &&
                              "top-[calc(var(--week-cells-height)/4*3)]",
                          )}
                          date={day}
                          id={`week-cell-${day.toISOString()}-${quarterHourTime}`}
                          key={`${hour.toString()}-${quarter}`}
                          onClick={() => {
                            onEventCreate(
                              createDateAtQuarterHour(day, hourValue, quarter),
                            )
                          }}
                          time={quarterHourTime}
                        />
                      )
                    })}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DayView({
  currentDate,
  events,
  onEventSelect,
  onEventCreate,
}: DayViewProps) {
  const hours = React.useMemo(() => {
    const dayStart = startOfDay(currentDate)
    return eachHourOfInterval({
      end: addHours(dayStart, DAY_END_HOUR - 1),
      start: addHours(dayStart, DAY_START_HOUR),
    })
  }, [currentDate])

  const dayEvents = React.useMemo(() => {
    return events.filter((event) => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)

      return (
        isSameDay(currentDate, eventStart) ||
        isSameDay(currentDate, eventEnd) ||
        (currentDate > eventStart && currentDate < eventEnd)
      )
    })
  }, [currentDate, events])

  const allDayEvents = React.useMemo(() => {
    return dayEvents.filter(isAllDayCalendarEvent)
  }, [dayEvents])

  const timeEvents = React.useMemo(() => {
    return getTimedEventsOnDay(dayEvents, currentDate)
  }, [currentDate, dayEvents])

  const positionedEvents = React.useMemo(() => {
    return getTimedEventPositions(timeEvents, currentDate)
  }, [currentDate, timeEvents])

  const { currentTimePosition, currentTimeVisible } = useCurrentTimeIndicator(
    currentDate,
    "day",
  )

  const handleEventClick = (event: EventCalendarItem, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventSelect(event)
  }

  return (
    <div className="flex h-full flex-col" data-slot="day-view">
      {allDayEvents.length > 0 && (
        <div className="border-t border-border/70 bg-muted/50">
          <div className="grid grid-cols-[3rem_1fr] sm:grid-cols-[4rem_1fr]">
            <div className="relative">
              <span className="absolute bottom-0 left-0 h-6 w-16 max-w-full pe-2 text-right text-[10px] text-muted-foreground/70 sm:pe-4 sm:text-xs">
                All day
              </span>
            </div>
            <div className="relative border-r border-border/70 p-1 last:border-r-0">
              {allDayEvents.map((event) => {
                const eventStart = new Date(event.start)
                const eventEnd = new Date(event.end)

                return (
                  <EventItem
                    event={event}
                    isFirstDay={isSameDay(currentDate, eventStart)}
                    isLastDay={isSameDay(currentDate, eventEnd)}
                    key={`spanning-${event.id}`}
                    onClick={(e) => handleEventClick(event, e)}
                    view="month"
                  >
                    <div>{event.title}</div>
                  </EventItem>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-[3rem_1fr] overflow-y-auto border-t border-border/70 sm:grid-cols-[4rem_1fr]">
        <div>
          {hours.map((hour, index) => (
            <div
              className="relative h-(--week-cells-height) border-b border-border/70 last:border-b-0"
              key={hour.toString()}
            >
              {index > 0 && (
                <span className="absolute -top-3 left-0 flex h-6 w-16 max-w-full items-center justify-end bg-background pe-2 text-[10px] text-muted-foreground/70 sm:pe-4 sm:text-xs">
                  {format(hour, "h a")}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="relative">
          {positionedEvents.map((positionedEvent) => (
            <div
              className="absolute z-10 px-0.5"
              key={positionedEvent.event.id}
              style={{
                height: `${positionedEvent.height}px`,
                left: `${positionedEvent.left * 100}%`,
                top: `${positionedEvent.top}px`,
                width: `${positionedEvent.width * 100}%`,
                zIndex: positionedEvent.zIndex,
              }}
            >
              <div className="size-full">
                <DraggableEvent
                  event={positionedEvent.event}
                  height={positionedEvent.height}
                  onClick={(e) => handleEventClick(positionedEvent.event, e)}
                  showTime
                  view="day"
                />
              </div>
            </div>
          ))}

          {currentTimeVisible && (
            <div
              className="pointer-events-none absolute right-0 left-0 z-20"
              style={{ top: `${currentTimePosition}%` }}
            >
              <div className="relative flex items-center">
                <div className="absolute -top-1 h-2 w-px bg-primary/60" />
                <div className="h-px w-full bg-primary/60" />
              </div>
            </div>
          )}

          {hours.map((hour) => {
            const hourValue = getHours(hour)
            return (
              <div
                className="relative h-(--week-cells-height) border-b border-border/70 last:border-b-0"
                key={hour.toString()}
              >
                {QUARTER_HOUR_SEGMENTS.map((quarter) => {
                  const quarterHourTime = hourValue + quarter * 0.25

                  return (
                    <DroppableCell
                      className={cn(
                        "absolute h-[calc(var(--week-cells-height)/4)] w-full",
                        quarter === 0 && "top-0",
                        quarter === 1 &&
                          "top-[calc(var(--week-cells-height)/4)]",
                        quarter === 2 &&
                          "top-[calc(var(--week-cells-height)/4*2)]",
                        quarter === 3 &&
                          "top-[calc(var(--week-cells-height)/4*3)]",
                      )}
                      date={currentDate}
                      id={`day-cell-${currentDate.toISOString()}-${quarterHourTime}`}
                      key={`${hour.toString()}-${quarter}`}
                      onClick={() => {
                        onEventCreate(
                          createDateAtQuarterHour(
                            currentDate,
                            hourValue,
                            quarter,
                          ),
                        )
                      }}
                      time={quarterHourTime}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
function ScheduleView({
  currentDate,
  events,
  onEventSelect,
}: ScheduleViewProps) {
  const days = React.useMemo(() => {
    return Array.from({ length: SCHEDULE_VIEW_DAY_COUNT }, (_, i) =>
      addDays(new Date(currentDate), i),
    )
  }, [currentDate])

  const hasEvents = days.some(
    (day) => getScheduleEventsForDay(events, day).length > 0,
  )

  const handleEventClick = (event: EventCalendarItem, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventSelect(event)
  }

  return (
    <div className="border-t border-border/70 px-4">
      {!hasEvents ? (
        <div className="flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
          <CalendarIcon className="mb-2 text-muted-foreground/50" size={32} />
          <h3 className="text-lg font-medium">No events found</h3>
          <p className="text-muted-foreground">
            There are no events scheduled for this time period.
          </p>
        </div>
      ) : (
        days.map((day) => {
          const dayEvents = getScheduleEventsForDay(events, day)

          if (dayEvents.length === 0) {
            return null
          }

          return (
            <div
              className="relative my-12 border-t border-border/70"
              key={day.toString()}
            >
              <span
                className="absolute -top-3 left-0 flex h-6 items-center bg-background pe-4 text-[10px] uppercase data-today:font-medium sm:pe-4 sm:text-xs"
                data-today={isToday(day) || undefined}
              >
                {format(day, "d MMM, EEEE")}
              </span>
              <div className="mt-6 space-y-2">
                {dayEvents.map((event) => (
                  <EventItem
                    event={event}
                    key={event.id}
                    onClick={(e) => handleEventClick(event, e)}
                    view="schedule"
                  />
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

function YearView({
  currentDate,
  events,
  onMonthClick,
  onDayClick,
}: YearViewProps) {
  const months = React.useMemo(() => {
    const yearStart = startOfYear(currentDate)
    const yearEnd = endOfYear(currentDate)
    return eachMonthOfInterval({ start: yearStart, end: yearEnd })
  }, [currentDate])

  const weekdays = React.useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(2024, 0, i)
      return { short: format(date, "EEE")[0], full: format(date, "EEEE") }
    })
  }, [])

  return (
    <div className="contents" data-slot="year-view">
      <div className="grid flex-1 grid-cols-2 gap-4 overflow-auto p-4 sm:grid-cols-3 lg:grid-cols-4">
        {months.map((month) => {
          const monthStart = startOfMonth(month)
          const monthEnd = endOfMonth(month)
          const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
          const padding: (Date | null)[] = Array.from(
            { length: monthStart.getDay() },
            () => null,
          )
          const allCells = [...padding, ...days]

          return (
            <div key={month.toISOString()}>
              <button
                className="mb-2 w-full text-left text-sm font-medium hover:underline"
                onClick={() => onMonthClick(monthStart)}
                type="button"
              >
                {format(month, "MMMM")}
              </button>
              <div className="grid grid-cols-7 gap-px">
                {weekdays.map((day) => (
                  <div
                    className="py-1 text-center text-[10px] text-muted-foreground/70"
                    key={day.full}
                  >
                    {day.short}
                  </div>
                ))}
                {allCells.map((cell, index) => {
                  if (!cell) {
                    return (
                      <div
                        className="size-full min-h-6"
                        key={`empty-${month.toISOString()}-${index}`}
                      />
                    )
                  }

                  const dayEvents = getEventsForDay(events, cell)

                  return (
                    <button
                      className={cn(
                        "relative flex size-full min-h-6 items-center justify-center rounded text-[10px] transition outline-none hover:bg-accent",
                        !isSameMonth(cell, month) && "text-muted-foreground/40",
                        isToday(cell) && "font-medium text-primary",
                      )}
                      key={cell.toISOString()}
                      onClick={() => onDayClick(cell)}
                      type="button"
                    >
                      {format(cell, "d")}
                      {dayEvents.length > 0 && (
                        <div className="absolute bottom-0.5 left-1/2 flex -translate-x-1/2 gap-0.5">
                          {dayEvents.slice(0, 3).map((event) => (
                            <div
                              className={cn(
                                "size-1 rounded-full",
                                getEventDotColorClass(event.color),
                              )}
                              key={event.id}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getDisplayEnd(
  event: CalendarEvent | EventCalendarItem,
  currentTime?: Date,
): Date {
  if (!currentTime) {
    return new Date(event.end)
  }

  return new Date(
    new Date(currentTime).getTime() +
      (new Date(event.end).getTime() - new Date(event.start).getTime()),
  )
}

function getEventTimeLabel(
  event: CalendarEvent | EventCalendarItem,
  displayStart: Date,
  displayEnd: Date,
  durationMinutes: number,
): string {
  if (event.allDay) {
    return "All day"
  }

  if (durationMinutes < 45) {
    return formatTimeWithOptionalMinutes(displayStart)
  }

  return `${formatTimeWithOptionalMinutes(displayStart)} - ${formatTimeWithOptionalMinutes(displayEnd)}`
}

function formatTimeWithOptionalMinutes(date: Date) {
  return format(date, getMinutes(date) === 0 ? "ha" : "h:mma").toLowerCase()
}

function getEventColorClasses(color?: EventColor) {
  return EVENT_COLOR_CLASSES[color ?? DEFAULT_EVENT_COLOR]
}

function getEventDotColorClass(color?: EventColor) {
  return EVENT_DOT_COLOR_CLASSES[color ?? DEFAULT_EVENT_COLOR]
}

function getBorderRadiusClasses(isFirstDay: boolean, isLastDay: boolean) {
  if (isFirstDay && isLastDay) {
    return "rounded"
  }
  if (isFirstDay) {
    return "rounded-l rounded-r-none"
  }
  if (isLastDay) {
    return "rounded-r rounded-l-none"
  }
  return "rounded-none"
}

function isMultiDayEvent(event: CalendarEvent | EventCalendarItem) {
  const eventStart = new Date(event.start)
  const eventEnd = new Date(event.end)
  return event.allDay || !isSameDay(eventStart, eventEnd)
}

function doesEventOccurOnDay(
  event: CalendarEvent | EventCalendarItem,
  day: Date,
) {
  const eventStart = new Date(event.start)
  const eventEnd = new Date(event.end)

  return (
    isSameDay(day, eventStart) ||
    isSameDay(day, eventEnd) ||
    (day > eventStart && day < eventEnd)
  )
}

function getEventsForDay<T extends CalendarEvent>(events: T[], day: Date): T[] {
  return events
    .filter((event) => isSameDay(day, new Date(event.start)))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}

function sortEvents<T extends CalendarEvent>(events: T[]): T[] {
  return [...events].sort((a, b) => {
    const aIsMultiDay = isMultiDayEvent(a)
    const bIsMultiDay = isMultiDayEvent(b)

    if (aIsMultiDay && !bIsMultiDay) {
      return -1
    }
    if (!aIsMultiDay && bIsMultiDay) {
      return 1
    }

    return new Date(a.start).getTime() - new Date(b.start).getTime()
  })
}

function getSpanningEventsForDay<T extends CalendarEvent>(
  events: T[],
  day: Date,
): T[] {
  return events.filter((event) => {
    if (!isMultiDayEvent(event)) {
      return false
    }

    return (
      !isSameDay(day, new Date(event.start)) && doesEventOccurOnDay(event, day)
    )
  })
}

function getAllEventsForDay<T extends CalendarEvent>(
  events: T[],
  day: Date,
): T[] {
  return events.filter((event) => doesEventOccurOnDay(event, day))
}

function getScheduleEventsForDay<T extends CalendarEvent>(
  events: T[],
  day: Date,
): T[] {
  return getAllEventsForDay(events, day).sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  )
}

function getMinutesForQuarterHourValue(time: number) {
  const fractionalHour = time - Math.floor(time)

  if (fractionalHour < 0.125) {
    return 0
  }
  if (fractionalHour < 0.375) {
    return 15
  }
  if (fractionalHour < 0.625) {
    return 30
  }

  return 45
}

function setDateTimeFromQuarterHourValue(date: Date, time: number) {
  const nextDate = new Date(date)
  nextDate.setHours(Math.floor(time), getMinutesForQuarterHourValue(time), 0, 0)
  return nextDate
}

function toCalendarEvent(
  event: CalendarEvent | EventCalendarItem,
): CalendarEvent {
  return {
    allDay: event.allDay,
    color: event.color,
    description: event.description,
    end: event.end,
    id: event.id,
    location: event.location,
    start: event.start,
    title: event.title,
  }
}

function shiftCalendarDateByView(
  date: Date,
  view: CalendarView,
  direction: -1 | 1,
) {
  switch (view) {
    case "month":
      return direction < 0 ? subMonths(date, 1) : addMonths(date, 1)
    case "week":
      return direction < 0 ? subWeeks(date, 1) : addWeeks(date, 1)
    case "day":
      return addDays(date, direction)
    case "schedule":
      return addDays(date, direction * SCHEDULE_VIEW_DAY_COUNT)
    case "year":
      return direction < 0 ? subYears(date, 1) : addYears(date, 1)
  }
}

function getWeekEventPositions<T extends EventCalendarItem>(
  events: T[],
  weekDays: Date[],
): Array<Omit<WeekEventPosition, "event"> & { event: T }> {
  if (weekDays.length === 0) {
    return []
  }

  const weekStart = weekDays[0]!
  const weekEnd = new Date(weekDays[weekDays.length - 1]!)
  weekEnd.setHours(23, 59, 59, 999)

  const weekEvents = events.filter((event) => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)
    return eventStart <= weekEnd && eventEnd >= weekStart
  })

  const sorted = [...weekEvents].sort((a, b) => {
    const aStart = new Date(a.start)
    const bStart = new Date(b.start)
    const aEnd = new Date(a.end)
    const bEnd = new Date(b.end)

    if (aStart.getTime() !== bStart.getTime()) {
      return aStart.getTime() - bStart.getTime()
    }

    return (
      bEnd.getTime() - bStart.getTime() - (aEnd.getTime() - aStart.getTime())
    )
  })

  const positioned: Array<Omit<WeekEventPosition, "event"> & { event: T }> = []
  const tracks: number[] = []

  for (const event of sorted) {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)
    let startOffset = 0
    let isFirstVisibleDay = false

    for (let i = 0; i < 7; i++) {
      if (isSameDay(eventStart, weekDays[i]!) || eventStart < weekDays[0]!) {
        startOffset = eventStart < weekDays[0]! ? 0 : i
        isFirstVisibleDay = eventStart >= weekDays[0]!
        break
      }
    }

    let endOffset = 6
    for (let i = 0; i < 7; i++) {
      if (isSameDay(eventEnd, weekDays[i]!)) {
        endOffset = i
        break
      }
    }

    if (eventEnd > weekDays[6]!) {
      endOffset = 6
    }

    const spanDays = Math.max(1, endOffset - startOffset + 1)
    let track = 0

    while (tracks[track] !== undefined && tracks[track]! >= startOffset) {
      track++
    }

    tracks[track] = endOffset
    positioned.push({
      event,
      isFirstVisibleDay,
      spanDays,
      startOffset,
      track,
    })
  }

  return positioned
}

function isAllDayCalendarEvent(event: CalendarEvent | EventCalendarItem) {
  return event.allDay || isMultiDayEvent(event)
}

function getAllDayEventsInRange<T extends EventCalendarItem>(
  events: T[],
  days: Date[],
): T[] {
  return events.filter(
    (event) =>
      isAllDayCalendarEvent(event) &&
      days.some((day) => doesEventOccurOnDay(event, day)),
  )
}

function getTimedEventsOnDay<T extends EventCalendarItem>(
  events: T[],
  day: Date,
): T[] {
  return events
    .filter(
      (event) =>
        !isAllDayCalendarEvent(event) && doesEventOccurOnDay(event, day),
    )
    .sort(compareTimedEvents)
}

function getTimedEventPositions<T extends EventCalendarItem>(
  events: T[],
  day: Date,
): Array<Omit<TimedEventPosition, "event"> & { event: T }> {
  const columns: DayEventInterval[][] = []

  return getTimedEventsOnDay(events, day).map((event) => {
    const interval = getEventIntervalForDay(event, day)
    let columnIndex = 0

    while (true) {
      const column = columns[columnIndex]

      if (!column) {
        columns[columnIndex] = [interval]
        break
      }

      const overlaps = column.some((existingInterval) =>
        areIntervalsOverlapping(interval, existingInterval),
      )

      if (!overlaps) {
        column.push(interval)
        break
      }

      columnIndex += 1
    }

    const startHour = getHours(interval.start) + getMinutes(interval.start) / 60
    const endHour = getHours(interval.end) + getMinutes(interval.end) / 60

    return {
      event,
      height: (endHour - startHour) * TIME_GRID_HOUR_HEIGHT_PX,
      left: columnIndex === 0 ? 0 : columnIndex * 0.1,
      top: (startHour - DAY_START_HOUR) * TIME_GRID_HOUR_HEIGHT_PX,
      width: columnIndex === 0 ? 1 : 0.9,
      zIndex: 10 + columnIndex,
    } satisfies TimedEventPosition
  })
}

function createDateAtQuarterHour(date: Date, hour: number, quarter: number) {
  const nextDate = new Date(date)
  nextDate.setHours(hour, quarter * 15, 0, 0)
  return nextDate
}

function getEventIntervalForDay(
  event: CalendarEvent | EventCalendarItem,
  day: Date,
) {
  const dayStart = startOfDay(day)
  const eventStart = new Date(event.start)
  const eventEnd = new Date(event.end)

  return {
    end: isSameDay(day, eventEnd) ? eventEnd : addHours(dayStart, 24),
    start: isSameDay(day, eventStart) ? eventStart : dayStart,
  } satisfies DayEventInterval
}

function compareTimedEvents(
  a: CalendarEvent | EventCalendarItem,
  b: CalendarEvent | EventCalendarItem,
) {
  const aStart = new Date(a.start)
  const bStart = new Date(b.start)

  if (aStart.getTime() !== bStart.getTime()) {
    return aStart.getTime() - bStart.getTime()
  }

  return (
    differenceInMinutes(new Date(b.end), bStart) -
    differenceInMinutes(new Date(a.end), aStart)
  )
}

function getCalendarTitle(
  currentDate: Date,
  view: CalendarView,
): React.ReactNode {
  switch (view) {
    case "month":
      return format(currentDate, "MMMM yyyy")
    case "year":
      return format(currentDate, "yyyy")
    case "week":
      return getRangeTitle(
        startOfWeek(currentDate, { weekStartsOn: 0 }),
        endOfWeek(currentDate, { weekStartsOn: 0 }),
      )
    case "day":
      return (
        <>
          <span aria-hidden="true" className="min-[480px]:hidden">
            {format(currentDate, "MMM d, yyyy")}
          </span>
          <span aria-hidden="true" className="max-[479px]:hidden md:hidden">
            {format(currentDate, "MMMM d, yyyy")}
          </span>
          <span className="max-md:hidden">
            {format(currentDate, "EEE MMMM d, yyyy")}
          </span>
        </>
      )
    case "schedule":
      return getRangeTitle(
        currentDate,
        addDays(currentDate, SCHEDULE_VIEW_DAY_COUNT - 1),
      )
  }
}

function getRangeTitle(start: Date, end: Date) {
  if (isSameMonth(start, end)) {
    return format(start, "MMMM yyyy")
  }

  return `${format(start, "MMM")} - ${format(end, "MMM yyyy")}`
}

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  )
}
