import type { UIMessage } from "@tanstack/ai-react"
import { useRouteContext } from "@tanstack/react-router"

import { useStickToBottom } from "@/hooks/use-stick-to-bottom"
import { AiBotAvatar } from "@/modules/ai/components/ui/ai-avatar"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/modules/ai/components/ui/conversation"

import { ChatMessageItem } from "./chat-message-item"

export function ChatMessageList({
  messages,
  streamingMessageId,
}: {
  messages: Array<UIMessage>
  streamingMessageId: string | null
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
