import type { UIMessage } from "ai"

import { toPersistedChatMessageParts } from "./message-transforms"
import { createChat, getChatById, saveMessage } from "./queries"

type TitleContext = {
  conversationId: string
  userId: string
  userText: string
}

export type ChatTurnResult = {
  isNewChat: boolean
  titleContext: TitleContext | null
}

export async function prepareChatTurn({
  conversationId,
  userId,
  messages,
}: {
  conversationId: string
  userId: string
  messages: UIMessage[]
}): Promise<ChatTurnResult> {
  let isNewChat = false

  const existingChat = await getChatById({ id: conversationId })
  if (existingChat && existingChat.userId !== userId) {
    throw new Error("forbidden")
  }
  if (!existingChat) {
    isNewChat = true
    await createChat({ id: conversationId, userId, title: "New chat" })
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")

  let titleContext: TitleContext | null = null

  if (lastUserMessage) {
    const persistedParts = toPersistedChatMessageParts(
      lastUserMessage.parts.filter(
        (p) => p.type === "text" || p.type === "reasoning",
      ),
    )

    if (persistedParts.length > 0) {
      await saveMessage({
        id: lastUserMessage.id,
        chatId: conversationId,
        role: "user",
        parts: persistedParts,
        attachments: [],
        createdAt: new Date(),
      })

      if (isNewChat) {
        const userText = persistedParts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join(" ")
        titleContext = { conversationId, userId, userText }
      }
    }
  }

  return { isNewChat, titleContext }
}

export async function persistAssistantMessage({
  conversationId,
  message,
}: {
  conversationId: string
  message: UIMessage
}) {
  if (message.role !== "assistant") return

  const persistedParts = toPersistedChatMessageParts(
    message.parts.filter((p) => p.type === "text" || p.type === "reasoning"),
  )

  if (persistedParts.length === 0) return

  const messageId = message.id || crypto.randomUUID()

  await saveMessage({
    id: messageId,
    chatId: conversationId,
    role: "assistant",
    parts: persistedParts,
    attachments: [],
    createdAt: new Date(),
  })
}
