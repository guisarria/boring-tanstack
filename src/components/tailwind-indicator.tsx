import { useSyncExternalStore, useState, useEffect } from "react"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

const BREAKPOINTS = [
  { name: "xs", min: 0, max: 639 },
  { name: "sm", min: 640, max: 767 },
  { name: "md", min: 768, max: 1023 },
  { name: "lg", min: 1024, max: 1279 },
  { name: "xl", min: 1280, max: 1535 },
  { name: "2xl", min: 1536, max: Infinity },
] as const

const POSITIONS = [
  { label: "Bottom left", value: "bl", classes: "bottom-3 left-3" },
  { label: "Bottom right", value: "br", classes: "bottom-3 right-3" },
  { label: "Top right", value: "tr", classes: "top-3 right-3" },
  { label: "Top left", value: "tl", classes: "top-3 left-3" },
] as const

type PositionValue = (typeof POSITIONS)[number]["value"]

const STORAGE_KEY = "tw-indicator-pos"

const SERVER_WINDOW_SIZE = { width: 0, height: 0 }
let cachedWindowSize = SERVER_WINDOW_SIZE

function isValidPosition(value: string | null): value is PositionValue {
  return POSITIONS.some((p) => p.value === value)
}

function subscribeToResize(callback: () => void) {
  window.addEventListener("resize", callback)
  return () => window.removeEventListener("resize", callback)
}

function getWindowSize() {
  const { innerWidth: width, innerHeight: height } = window
  if (cachedWindowSize.width === width && cachedWindowSize.height === height) {
    return cachedWindowSize
  }
  cachedWindowSize = { width, height }
  return cachedWindowSize
}

function getServerWindowSize() {
  return SERVER_WINDOW_SIZE
}

function getBreakpoint(width: number) {
  return (
    BREAKPOINTS.find((bp) => width >= bp.min && width <= bp.max) ??
    BREAKPOINTS[0]
  )
}

function getSavedPosition(): PositionValue {
  const saved = localStorage.getItem(STORAGE_KEY)
  return isValidPosition(saved) ? saved : "bl"
}

interface TailwindIndicatorProps {
  enabled?: boolean
}

export function TailwindIndicator({ enabled = true }: TailwindIndicatorProps) {
  const windowSize = useSyncExternalStore(
    subscribeToResize,
    getWindowSize,
    getServerWindowSize,
  )
  const [position, setPosition] = useState<PositionValue>("bl")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (!enabled) return
    setPosition(getSavedPosition())
  }, [enabled])

  if (!enabled || windowSize.width === 0) return null

  const breakpoint = getBreakpoint(windowSize.width)
  const breakpointRange =
    breakpoint.max === Infinity
      ? `${breakpoint.min}px+`
      : `${breakpoint.min} - ${breakpoint.max}px`
  const activePosition = POSITIONS.find((p) => p.value === position)!

  const handlePositionChange = (value: string) => {
    if (!isValidPosition(value)) return
    setDropdownOpen(false)
    setPosition(value)
    localStorage.setItem(STORAGE_KEY, value)
  }

  return (
    <div
      className={`fixed ${activePosition.classes} z-50 flex items-center gap-2 rounded-sm border border-border bg-card px-2.5 py-1.5 font-mono text-[11px] text-card-foreground tabular-nums shadow-xs`}
    >
      <span className="rounded-xs bg-primary/10 px-1.5 py-0.5 text-primary">
        {breakpoint.name}
      </span>
      <span className="text-[10px] text-muted-foreground">
        {windowSize.width} x {windowSize.height}px
      </span>
      <span className="border-l border-border pl-2 text-[10px] text-muted-foreground/60">
        {breakpointRange}
      </span>

      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger
          aria-label="Change indicator position"
          className="cursor-pointer border-l border-border pl-2 text-[10px] text-muted-foreground/60 uppercase transition-colors outline-none hover:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
        >
          {position}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={"data-closed:duration-0"}
          side="top"
          align="end"
          sideOffset={8}
        >
          <DropdownMenuRadioGroup
            value={position}
            onValueChange={handlePositionChange}
          >
            {POSITIONS.map((p) => (
              <DropdownMenuRadioItem key={p.value} value={p.value}>
                {p.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
