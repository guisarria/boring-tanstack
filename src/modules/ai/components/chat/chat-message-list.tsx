import { useRouteContext } from "@tanstack/react-router"
import type { UIMessage } from "ai"

import { AiBotAvatar } from "@/modules/ai/components/ui/ai-avatar"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/modules/ai/components/ui/conversation"
import { useStickToBottom } from "@/modules/ai/hooks/use-stick-to-bottom"

import { ChatMessageItem } from "./chat-message-item"

export function ChatMessageList({
  messages,
  streamingMessageId,
  getReasoningDuration,
}: {
  messages: UIMessage[]
  streamingMessageId: string | null
  getReasoningDuration: (metadata: unknown) => number | undefined
}) {
  const { user } = useRouteContext({ from: "__root__" })
  const { scrollRef, bottomRef, isAtBottom, scrollToBottom } =
    useStickToBottom()

  const lastAssistantId = [...messages]
    .reverse()
    .find((m) => m.role === "assistant")?.id

  return (
    <Conversation scrollRef={scrollRef}>
      <ConversationContent bottomRef={bottomRef} className="mx-auto space-y-4">
        {messages.length === 0 && (
          <ConversationEmptyState>
            <AiBotAvatar className="size-40" />
            <p className="text-2xl">How can I help, {user?.name}?</p>
          </ConversationEmptyState>
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
              reasoningDuration={getReasoningDuration(message.metadata)}
            />
          )
        })}
      </ConversationContent>

      <ConversationScrollButton
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
    </Conversation>
  )
}
