import type { UIMessage } from "ai"
import { z } from "zod"

import { AppError } from "@/lib/errors"

import type { ChatMessagePart } from "../validation"
import { toPersistedChatMessageParts } from "./message-transforms"
import {
  createChat,
  getChatById,
  getLatestChatByUserId,
  getMessagesByChatId,
  saveMessage,
} from "./queries"

export type ChatHistoryPayload = {
  chatId: string | null
  messages: Array<{
    id: string
    chatId: string
    role: "system" | "user" | "assistant"
    parts: Array<ChatMessagePart>
    attachments: {}[]
    createdAt: string
  }>
}

const uuidSchema = z.uuid()

export function parseOptionalConversationId(value: unknown): string | null {
  if (typeof value !== "string") return null

  const result = uuidSchema.safeParse(value)
  return result.success ? result.data : null
}

function serializePersistedMessages(
  messages: Awaited<ReturnType<typeof getMessagesByChatId>>,
) {
  return messages.map((message) => ({
    ...message,
    attachments: message.attachments as {}[],
    createdAt: message.createdAt.toISOString(),
  }))
}

export async function getChatHistory(
  userId: string,
  conversationId: string | null,
): Promise<ChatHistoryPayload> {
  if (conversationId) {
    const chat = await getChatById({ id: conversationId })

    if (!chat) {
      return { chatId: conversationId, messages: [] }
    }

    if (chat.userId !== userId) {
      throw new AppError("forbidden:chat")
    }

    const messages = await getMessagesByChatId({ id: conversationId })
    return {
      chatId: conversationId,
      messages: serializePersistedMessages(messages),
    }
  }

  const latestChat = await getLatestChatByUserId({ userId })

  if (!latestChat) {
    return { chatId: null, messages: [] }
  }

  const messages = await getMessagesByChatId({ id: latestChat.id })

  return {
    chatId: latestChat.id,
    messages: serializePersistedMessages(messages),
  }
}

type TitleContext = {
  conversationId: string
  userId: string
  userText: string
}

export type ChatTurnResult = {
  isNewChat: boolean
  titleContext: TitleContext | null
}

export async function prepareUserTurn({
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
    throw new AppError("forbidden:chat")
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

export async function persistAssistantTurn({
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
