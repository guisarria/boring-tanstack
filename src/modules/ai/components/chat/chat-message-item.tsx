import type { UIMessage } from "ai"
import { CheckIcon, CopyIcon } from "lucide-react"
import { toast } from "sonner"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { AiBotAvatar } from "@/modules/ai/components/ui/ai-avatar"
import {
  Message,
  MessageAction,
  MessageActions,
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
    case "reasoning":
      return (
        <Reasoning isStreaming={isStreaming}>
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

function AssistantActions({
  message,
  isStreaming,
}: {
  message: UIMessage
  isStreaming: boolean
}) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  const text = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n\n")
    .trim()

  if (isStreaming || !text) return null

  return (
    <MessageActions className="ml-12 opacity-0 transition-opacity group-hover:opacity-100">
      <MessageAction
        tooltip={isCopied ? "Copied!" : "Copy"}
        onClick={() => {
          copyToClipboard(text)
          toast.success("Copied to clipboard")
        }}
      >
        {isCopied ? (
          <CheckIcon className="size-3.5" />
        ) : (
          <CopyIcon className="size-3.5" />
        )}
      </MessageAction>
    </MessageActions>
  )
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

  const parts = message.parts.map((part, index) => {
    switch (part.type) {
      case "text":
      case "reasoning":
        return (
          <MessagePartView
            key={`${message.id}-${index}`}
            part={part}
            role={message.role}
            isStreaming={isStreaming}
          />
        )
      default:
        return null
    }
  })

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
      {!isUser && (
        <AssistantActions message={message} isStreaming={isStreaming} />
      )}
    </Message>
  )
}
