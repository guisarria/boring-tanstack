import type { UIMessage } from "@tanstack/ai-react"

import { cn } from "@/lib/utils"
import { AiBotAvatar } from "@/modules/ai/components/ai-avatar"
import { UserAvatar } from "@/modules/auth/components/user-avatar"

import { AssistantMarkdown } from "./chat-markdown"

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
      return <p className="text-muted-foreground text-xs">{part.content}</p>
    case "text":
      return role === "assistant" ? (
        <AssistantMarkdown isStreaming={isStreaming}>
          {part.content}
        </AssistantMarkdown>
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
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div className="w-9 shrink-0">
        {isUser ? (
          <UserAvatar size={36} />
        ) : showAvatar ? (
          <AiBotAvatar isStreaming={isStreaming} />
        ) : (
          <div className="w-9" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[80%] space-y-1 rounded-lg px-3 py-2 text-sm",
          isUser ? "bg-primary text-primary-foreground" : " text-foreground",
          message.id === "__pending__" && "opacity-70",
        )}
      >
        {message.parts.map((part, idx) => (
          <MessagePartView
            key={`${message.id}:${part.type}:${idx}`}
            part={part}
            role={message.role}
            isStreaming={isStreaming}
          />
        ))}
      </div>
    </div>
  )
}
