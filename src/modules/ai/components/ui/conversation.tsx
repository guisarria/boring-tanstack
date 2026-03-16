import type { UIMessage } from "@tanstack/ai-react"
import { ArrowDownIcon, DownloadIcon } from "lucide-react"
import type { ComponentProps, ReactNode, RefObject } from "react"

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

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter(
      (part): part is Extract<UIMessage["parts"][number], { type: "text" }> =>
        part.type === "text",
    )
    .map((part) => part.content)
    .join("")
}

function defaultFormatMessage(message: UIMessage): string {
  const label = message.role.charAt(0).toUpperCase() + message.role.slice(1)
  return `**${label}:** ${getMessageText(message)}`
}

export function messagesToMarkdown(
  messages: UIMessage[],
  formatMessage: (
    message: UIMessage,
    index: number,
  ) => string = defaultFormatMessage,
): string {
  return messages.map((msg, i) => formatMessage(msg, i)).join("\n\n")
}

export function ConversationDownload({
  messages,
  filename = "conversation.md",
  formatMessage = defaultFormatMessage,
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof Button>, "onClick" | "children"> & {
  messages: UIMessage[]
  filename?: string
  formatMessage?: (message: UIMessage, index: number) => string
  children?: ReactNode
}) {
  function handleDownload() {
    const markdown = messagesToMarkdown(messages, formatMessage)
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.append(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      className={cn("absolute top-4 right-4 rounded-full", className)}
      onClick={handleDownload}
      size="icon"
      type="button"
      variant="outline"
      {...props}
    >
      {children ?? <DownloadIcon className="size-4" />}
    </Button>
  )
}
