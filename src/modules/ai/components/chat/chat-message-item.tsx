import type { UIMessage } from "ai"

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
  reasoningDuration,
}: {
  part: UIMessage["parts"][number]
  role: UIMessage["role"]
  isStreaming: boolean
  reasoningDuration?: number
}) {
  switch (part.type) {
    case "reasoning":
      return (
        <Reasoning isStreaming={isStreaming} duration={reasoningDuration}>
          <ReasoningTrigger />
          <ReasoningContent>{part.text}</ReasoningContent>
        </Reasoning>
      )
    case "text":
      return role === "assistant" ? (
        <MessageResponse isAnimating={isStreaming}>{part.text}</MessageResponse>
      ) : (
        <p className="whitespace-pre-wrap">{part.text}</p>
      )
    default:
      return null
  }
}

export function ChatMessageItem({
  message,
  isStreaming,
  showAvatar,
  reasoningDuration,
}: {
  message: UIMessage
  isStreaming: boolean
  showAvatar: boolean
  reasoningDuration?: number
}) {
  const isUser = message.role === "user"

  const renderableParts = message.parts.filter(
    (
      part,
    ): part is typeof part & { type: "text" | "reasoning"; text: string } =>
      (part.type === "text" || part.type === "reasoning") && "text" in part,
  )

  const parts = renderableParts.map((part) => (
    <MessagePartView
      key={`${message.id}-${part.type}-${part.text.slice(0, 20)}`}
      part={part}
      role={message.role}
      isStreaming={isStreaming}
      reasoningDuration={
        part.type === "reasoning" ? reasoningDuration : undefined
      }
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
            <MessageContent className="max-w-xl">{parts}</MessageContent>
          </>
        )}
      </div>
    </Message>
  )
}
