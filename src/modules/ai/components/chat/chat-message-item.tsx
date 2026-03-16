import type { UIMessage } from "@tanstack/ai-react"

import { AiBotAvatar } from "@/modules/ai/components/ui/ai-avatar"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/modules/ai/components/ui/message"
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/modules/ai/components/ui/reasoning"
import { UserAvatar } from "@/modules/auth/components/user-avatar"

function MessagePartView({
  part,
  role,
  isStreaming,
}: {
  part: UIMessage["parts"][number]
  role: UIMessage["role"]
  isStreaming: boolean
}) {
  switch (part.type) {
    case "thinking":
      return (
        <Reasoning isStreaming={isStreaming}>
          <ReasoningTrigger />
          <ReasoningContent>{part.content}</ReasoningContent>
        </Reasoning>
      )
    case "text":
      return role === "assistant" ? (
        <MessageResponse isAnimating={isStreaming}>
          {part.content}
        </MessageResponse>
      ) : (
        <p className="whitespace-pre-wrap">{part.content}</p>
      )
    default:
      return null
  }
}

export function ChatMessageItem({
  message,
  isStreaming,
  showAvatar,
}: {
  message: UIMessage
  isStreaming: boolean
  showAvatar: boolean
}) {
  const isUser = message.role === "user"

  return (
    <Message from={message.role}>
      <div className="flex gap-3">
        <div className="w-9 shrink-0">
          {isUser ? (
            <UserAvatar size={36} />
          ) : showAvatar ? (
            <AiBotAvatar isStreaming={isStreaming} />
          ) : (
            <div className="w-9" />
          )}
        </div>
        <MessageContent>
          {message.parts.map((part, idx) => (
            <MessagePartView
              key={`${message.id}:${part.type}:${idx}`}
              part={part}
              role={message.role}
              isStreaming={isStreaming}
            />
          ))}
        </MessageContent>
      </div>
    </Message>
  )
}
