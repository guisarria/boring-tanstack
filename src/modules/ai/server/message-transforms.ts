import type { ChatMessagePart } from "../validation"

export function toPersistedChatMessageParts(
  parts: Array<{ type: string; text?: unknown }>,
): Array<ChatMessagePart> {
  const persistedParts: Array<ChatMessagePart> = []

  for (const part of parts) {
    if (part.type === "text" && typeof part.text === "string") {
      persistedParts.push({ type: "text", text: part.text })
      continue
    }

    if (part.type === "reasoning" && typeof part.text === "string") {
      persistedParts.push({ type: "reasoning", text: part.text })
    }
  }

  return persistedParts
}
