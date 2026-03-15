import type { UIMessage } from "@tanstack/ai-react"

import { useStickToBottom } from "@/hooks/use-stick-to-bottom"
import { AiBotAvatar } from "@/routes/_auth/dashboard/-components/chat/ai-avatar"

import { ChatMessageItem } from "./chat-message-item"

export function ChatMessageList({
  messages,
  streamingMessageId,
}: {
  messages: Array<UIMessage>
  streamingMessageId: string | null
}) {
  const { scrollRef, bottomRef } = useStickToBottom()

  const lastAssistantId = [...messages]
    .reverse()
    .find((m) => m.role === "assistant")?.id

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
      <div role="log" aria-live="polite" className="mx-auto space-y-4 p-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-20">
            <AiBotAvatar className="size-40" />
          </div>
        )}

        {messages.map((message) => {
          const isStreaming = message.id === streamingMessageId
          const showAvatar =
            message.role === "assistant" && message.id === lastAssistantId

          return (
            <ChatMessageItem
              key={message.id}
              message={message}
              isStreaming={isStreaming}
              showAvatar={showAvatar}
            />
          )
        })}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
