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
import { getThinkingDuration, type ChatMessage } from "@/modules/ai/contracts"
import { UserAvatar } from "@/modules/auth/components/user-avatar"

function MessagePartView({
  part,
  role,
  isStreaming,
}: {
  part: ChatMessage["parts"][number]
  role: ChatMessage["role"]
  isStreaming: boolean
}) {
  switch (part.type) {
    case "thinking":
      return (
        <Reasoning
          isStreaming={isStreaming}
          duration={getThinkingDuration(part)}
        >
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
  message: ChatMessage
  isStreaming: boolean
  showAvatar: boolean
}) {
  const isUser = message.role === "user"

  const parts = message.parts.map((part, idx) => (
    <MessagePartView
      key={`${message.id}:${part.type}:${idx}`}
      part={part}
      role={message.role}
      isStreaming={isStreaming}
    />
  ))

  return (
    <Message from={message.role}>
      <div className="flex gap-3">
        {isUser ? (
          <>
            <MessageContent>{parts}</MessageContent>
            <UserAvatar size={36} />
          </>
        ) : (
          <>
            {showAvatar ? (
              <AiBotAvatar className="min-w-9" isStreaming={isStreaming} />
            ) : (
              <div className="w-9" />
            )}
            <MessageContent>{parts}</MessageContent>
          </>
        )}
      </div>
    </Message>
  )
}
