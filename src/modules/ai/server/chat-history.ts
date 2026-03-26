import { z } from "zod"

import { AppError } from "@/lib/errors"
import { requireSessionResult } from "@/modules/auth/server/auth-service"

import type { ChatMessagePart } from "../validation"
import {
  getChatById,
  getLatestChatByUserId,
  getMessagesByChatId,
} from "./queries"

export async function requireUser(headers: Headers) {
  const sessionResult = await requireSessionResult(headers)

  if (sessionResult.isErr() || !sessionResult.value.user) {
    throw new AppError("unauthorized:chat").toResponse()
  }

  return sessionResult.value.user
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
    attachments:
      message.attachments as ChatHistoryPayload["messages"][number]["attachments"],
    createdAt: message.createdAt.toISOString(),
  }))
}

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

export async function loadChatHistory(
  headers: Headers,
  conversationId: string | null,
): Promise<ChatHistoryPayload> {
  const user = await requireUser(headers)

  if (conversationId) {
    const chat = await getChatById({ id: conversationId })

    if (!chat) {
      return { chatId: conversationId, messages: [] }
    }

    if (chat.userId !== user.id) {
      throw new AppError("forbidden:chat").toResponse()
    }

    const messages = await getMessagesByChatId({ id: conversationId })
    return {
      chatId: conversationId,
      messages: serializePersistedMessages(messages),
    }
  }

  const latestChat = await getLatestChatByUserId({ userId: user.id })

  if (!latestChat) {
    return { chatId: null, messages: [] }
  }

  const messages = await getMessagesByChatId({ id: latestChat.id })

  return {
    chatId: latestChat.id,
    messages: serializePersistedMessages(messages),
  }
}
