import { convertMessagesToModelMessages, type ModelMessage } from "@tanstack/ai"

import type { ChatMessagePart, ChatStreamRequestMessage } from "../validation"

type TextOnlyModelMessage = ModelMessage<string | null>

function getTextOnlyContent(content: ModelMessage["content"]): string | null {
  if (typeof content === "string" || content === null) {
    return content
  }

  const textContent = content
    .filter((part) => part.type === "text")
    .map((part) => part.content)
    .join("")

  return textContent || null
}

export function toTextOnlyModelMessages(
  messages: Array<ChatStreamRequestMessage>,
): Array<TextOnlyModelMessage> {
  return convertMessagesToModelMessages(messages).map((message) => ({
    ...message,
    content: getTextOnlyContent(message.content),
  }))
}

export function toPersistedChatMessageParts(
  parts: Array<{ type: string; content?: unknown }>,
  thinkingDurationSeconds?: number,
): Array<ChatMessagePart> {
  const persistedParts: Array<ChatMessagePart> = []

  for (const part of parts) {
    if (part.type === "text" && typeof part.content === "string") {
      persistedParts.push({
        type: "text",
        content: part.content,
      })
      continue
    }

    if (part.type === "thinking" && typeof part.content === "string") {
      persistedParts.push({
        type: "thinking",
        content: part.content,
        duration: thinkingDurationSeconds,
      })
    }
  }

  return persistedParts
}

export function getLastUserMessageParts(
  messages: Array<ChatStreamRequestMessage>,
) {
  return (
    [...messages].reverse().find((message) => message.role === "user")?.parts ??
    null
  )
}
