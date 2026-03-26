import { useRouteContext } from "@tanstack/react-router"

import { AiBotAvatar } from "@/modules/ai/components/ui/ai-avatar"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/modules/ai/components/ui/conversation"
import { useStickToBottom } from "@/modules/ai/hooks/use-stick-to-bottom"

import { ChatMessageItem } from "./chat-message-item"
import { useChatController } from "./chat-provider"

export function ChatMessageList() {
  const { displayMessages, streamingMessageId } = useChatController()
  const { user } = useRouteContext({ from: "__root__" })
  const { scrollRef, bottomRef, isAtBottom, scrollToBottom } =
    useStickToBottom()

  const lastAssistantId = [...displayMessages]
    .reverse()
    .find((m) => m.role === "assistant")?.id

  return (
    <Conversation scrollRef={scrollRef}>
      <ConversationContent bottomRef={bottomRef} className="mx-auto space-y-4">
        {displayMessages.length === 0 && (
          <ConversationEmptyState>
            <AiBotAvatar className="size-40" />
            <p className="text-2xl">How can I help, {user?.name}?</p>
          </ConversationEmptyState>
        )}

        {displayMessages.map((message) => {
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
