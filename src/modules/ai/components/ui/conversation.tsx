import { ArrowDownIcon } from "lucide-react"
import type { ComponentProps, RefObject } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Conversation({
  scrollRef,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  scrollRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div
      ref={scrollRef}
      role="log"
      aria-live="polite"
      className={cn("relative min-h-0 flex-1 overflow-y-auto", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function ConversationContent({
  bottomRef,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  bottomRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div className={cn("flex flex-col gap-8 p-4", className)} {...props}>
      {children}
      <div ref={bottomRef} />
    </div>
  )
}

export function ConversationEmptyState({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex size-full flex-col items-center justify-center gap-3 p-8 text-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function ConversationScrollButton({
  isAtBottom,
  scrollToBottom,
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "onClick"> & {
  isAtBottom: boolean
  scrollToBottom: () => void
}) {
  if (isAtBottom) return null

  return (
    <Button
      className={cn(
        "absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full",
        className,
      )}
      onClick={scrollToBottom}
      size="icon"
      type="button"
      variant="outline"
      {...props}
    >
      <ArrowDownIcon className="size-4" />
    </Button>
  )
}
