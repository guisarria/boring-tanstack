import { Collapsible } from "@base-ui/react/collapsible"
import { cjk } from "@streamdown/cjk"
import { code } from "@streamdown/code"
import { math } from "@streamdown/math"
import { mermaid } from "@streamdown/mermaid"
import { ChevronDownIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Streamdown } from "streamdown"

import { cn } from "@/lib/utils"

import { Shimmer } from "./shimmer"

interface ReasoningContextValue {
  isStreaming: boolean
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  duration: number | undefined
}

const ReasoningContext = createContext<ReasoningContextValue | null>(null)

export const useReasoning = () => {
  const context = useContext(ReasoningContext)
  if (!context) {
    throw new Error("Reasoning components must be used within Reasoning")
  }
  return context
}

export type ReasoningProps = ComponentProps<typeof Collapsible.Root> & {
  isStreaming?: boolean
  duration?: number
}

const AUTO_CLOSE_DELAY = 1000
const MS_IN_S = 1000

export const Reasoning = memo(
  ({
    className,
    isStreaming = false,
    open: openProp,
    defaultOpen,
    onOpenChange,
    duration: durationProp,
    children,
    ...props
  }: ReasoningProps) => {
    const [openState, setOpenState] = useState(defaultOpen ?? isStreaming)
    const isControlled = openProp !== undefined
    const isOpen = isControlled ? openProp : openState

    const onOpenChangeRef = useRef(onOpenChange)
    onOpenChangeRef.current = onOpenChange

    const setIsOpen = useCallback(
      (nextOpen: boolean) => {
        if (!isControlled) {
          setOpenState(nextOpen)
        }
        onOpenChangeRef.current?.(nextOpen, { source: "programmatic" } as any)
      },
      [isControlled],
    )

    const [internalDuration, setInternalDuration] = useState<
      number | undefined
    >(undefined)
    const duration =
      durationProp !== undefined ? durationProp : internalDuration

    const hasEverStreamedRef = useRef(isStreaming)
    const [hasAutoClosed, setHasAutoClosed] = useState(false)
    const startTimeRef = useRef<number | null>(null)

    useEffect(() => {
      if (isStreaming) {
        hasEverStreamedRef.current = true
        if (startTimeRef.current === null) startTimeRef.current = Date.now()
      } else if (startTimeRef.current !== null) {
        setInternalDuration(
          Math.ceil((Date.now() - startTimeRef.current) / MS_IN_S),
        )
        startTimeRef.current = null
      }
    }, [isStreaming])

    useEffect(() => {
      const isExplicitlyClosed = defaultOpen === false
      if (isStreaming && !isOpen && !isExplicitlyClosed) {
        setIsOpen(true)
      }
    }, [isStreaming, isOpen, setIsOpen, defaultOpen])

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
    }, [isStreaming, isOpen, setIsOpen, hasAutoClosed])

    const contextValue = useMemo(
      () => ({ duration, isOpen, isStreaming, setIsOpen }),
      [duration, isOpen, isStreaming, setIsOpen],
    )

    return (
      <ReasoningContext.Provider value={contextValue}>
        <Collapsible.Root
          open={isOpen}
          onOpenChange={setIsOpen}
          className={cn("not-prose mb-4", className)}
          {...props}
        >
          {children}
        </Collapsible.Root>
      </ReasoningContext.Provider>
    )
  },
)

export type ReasoningTriggerProps = ComponentProps<
  typeof Collapsible.Trigger
> & {
  getThinkingMessage?: (isStreaming: boolean, duration?: number) => ReactNode
}
const defaultGetThinkingMessage = (isStreaming: boolean, duration?: number) => {
  if (isStreaming || duration === 0) {
    return <Shimmer duration={1}>Thinking...</Shimmer>
  }
  if (duration === undefined) {
    return <Shimmer duration={1}>Thinking...</Shimmer>
  }

  if (duration > 1) {
    return <p>Thought for {duration} seconds</p>
  }
}

export const ReasoningTrigger = memo(
  ({
    className,
    children,
    getThinkingMessage = defaultGetThinkingMessage,
    ...props
  }: ReasoningTriggerProps) => {
    const { isStreaming, isOpen, duration } = useReasoning()

    return (
      <Collapsible.Trigger
        className={cn(
          "flex w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground",
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
  },
)

export type ReasoningContentProps = ComponentProps<typeof Collapsible.Panel> & {
  children: string
}

const streamdownPlugins = { cjk, code, math, mermaid }

export const ReasoningContent = memo(
  ({ className, children, ...props }: ReasoningContentProps) => (
    <Collapsible.Panel
      className={cn(
        "mt-4 text-sm overflow-hidden",
        "data-[state=closed]:animate-out data-[state=open]:animate-in text-muted-foreground outline-none",
        className,
      )}
      {...props}
    >
      <Streamdown plugins={streamdownPlugins}>{children}</Streamdown>
    </Collapsible.Panel>
  ),
)

Reasoning.displayName = "Reasoning"
ReasoningTrigger.displayName = "ReasoningTrigger"
ReasoningContent.displayName = "ReasoningContent"
