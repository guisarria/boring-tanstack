import { Collapsible } from "@base-ui/react/collapsible"
import { ChevronDownIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { cn } from "@/lib/utils"

import { AssistantMarkdown } from "./assistant-markdown"
import { Shimmer } from "./shimmer"

interface ReasoningContextValue {
  isStreaming: boolean
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  duration: number | undefined
}

const ReasoningContext = createContext<ReasoningContextValue | null>(null)

export const useReasoning = () => {
  const context = use(ReasoningContext)
  if (!context) {
    throw new Error("Reasoning components must be used within Reasoning")
  }
  return context
}

export type ReasoningProps = ComponentProps<typeof Collapsible.Root> & {
  isStreaming?: boolean
  duration?: number
}

type ReasoningOpenChange = NonNullable<ReasoningProps["onOpenChange"]>
type ReasoningOpenChangeDetails = Parameters<ReasoningOpenChange>[1]

const AUTO_CLOSE_DELAY = 1000
const MS_IN_S = 1000

function createProgrammaticChangeDetails(): ReasoningOpenChangeDetails {
  let isCanceled = false
  let isPropagationAllowed = false

  return {
    reason: "none",
    event: new Event("change"),
    trigger: undefined,
    cancel: () => {
      isCanceled = true
    },
    allowPropagation: () => {
      isPropagationAllowed = true
    },
    get isCanceled() {
      return isCanceled
    },
    get isPropagationAllowed() {
      return isPropagationAllowed
    },
  }
}

export function Reasoning({
  className,
  isStreaming = false,
  open: openProp,
  defaultOpen,
  onOpenChange,
  duration: durationProp,
  children,
  ...props
}: ReasoningProps) {
  const [openState, setOpenState] = useState(defaultOpen ?? isStreaming)
  const isControlled = openProp !== undefined
  const isOpen = isControlled ? openProp : openState

  const setIsOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setOpenState(nextOpen)
      }
      onOpenChange?.(nextOpen, createProgrammaticChangeDetails())
    },
    [isControlled, onOpenChange],
  )

  const [internalDuration, setInternalDuration] = useState<number | undefined>(
    undefined,
  )
  const duration = durationProp !== undefined ? durationProp : internalDuration

  const hasEverStreamedRef = useRef(isStreaming)
  const [hasAutoClosed, setHasAutoClosed] = useState(false)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (isStreaming) {
      hasEverStreamedRef.current = true
      startTimeRef.current ??= Date.now()
      return
    }

    const start = startTimeRef.current
    if (start == null) return

    setInternalDuration(Math.ceil((Date.now() - start) / MS_IN_S))
    startTimeRef.current = null
  }, [isStreaming])

  useEffect(() => {
    const isExplicitlyClosed = defaultOpen === false
    if (isStreaming && !isOpen && !isExplicitlyClosed) {
      setIsOpen(true)
    }
  }, [isStreaming, isOpen, defaultOpen, setIsOpen])

  useEffect(() => {
    if (
      hasEverStreamedRef.current &&
      !isStreaming &&
      isOpen &&
      !hasAutoClosed
    ) {
      const timer = setTimeout(() => {
        setIsOpen(false)
        setHasAutoClosed(true)
      }, AUTO_CLOSE_DELAY)
      return () => clearTimeout(timer)
    }
  }, [isStreaming, isOpen, hasAutoClosed, setIsOpen])

  const contextValue = { duration, isOpen, isStreaming, setIsOpen }

  return (
    <ReasoningContext value={contextValue}>
      <Collapsible.Root
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn("not-prose mb-4", className)}
        {...props}
      >
        {children}
      </Collapsible.Root>
    </ReasoningContext>
  )
}

export type ReasoningTriggerProps = ComponentProps<
  typeof Collapsible.Trigger
> & {
  getThinkingMessage?: (isStreaming: boolean, duration?: number) => ReactNode
}

const defaultGetThinkingMessage = (isStreaming: boolean, duration?: number) => {
  if (isStreaming) {
    return <Shimmer duration={1}>Thinking...</Shimmer>
  }

  if (typeof duration === "number") {
    if (duration === 1) {
      return <p>Thought for 1 second</p>
    }

    if (duration > 1) {
      return <p>Thought for {duration} seconds</p>
    }
  }

  return <p>Reasoning</p>
}

export function ReasoningTrigger({
  className,
  children,
  getThinkingMessage = defaultGetThinkingMessage,
  ...props
}: ReasoningTriggerProps) {
  const { isStreaming, isOpen, duration } = useReasoning()

  return (
    <Collapsible.Trigger
      className={cn(
        "text-muted-foreground hover:text-foreground flex w-full items-center gap-2 text-sm transition-colors",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          {getThinkingMessage(isStreaming, duration)}
          <ChevronDownIcon
            className={cn(
              "size-4 transition-transform",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          />
        </>
      )}
    </Collapsible.Trigger>
  )
}

export type ReasoningContentProps = ComponentProps<typeof Collapsible.Panel> & {
  children: string
}

export function ReasoningContent({
  className,
  children,
  ...props
}: ReasoningContentProps) {
  return (
    <Collapsible.Panel
      className={cn(
        "mt-4 overflow-hidden text-sm",
        "data-[state=closed]:animate-out data-[state=open]:animate-in text-muted-foreground outline-none",
        className,
      )}
      {...props}
    >
      <AssistantMarkdown>{children}</AssistantMarkdown>
    </Collapsible.Panel>
  )
}
