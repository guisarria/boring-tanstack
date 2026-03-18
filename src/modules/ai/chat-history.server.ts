import { z } from "zod"

import { requireSessionResult } from "@/modules/auth/auth-service.server"

import { ChatbotError } from "./errors"
import {
  getChatById,
  getLatestChatByUserId,
  getMessagesByChatId,
} from "./queries.server"
import type { ChatMessagePart } from "./validation"

const uuidSchema = z.uuid()

function toUnauthorizedResponse(error: unknown) {
  if (error instanceof Response) {
    return error
  }

  return new Response("Unauthorized", { status: 401 })
}

export function parseOptionalConversationId(value: unknown): string | null {
  if (typeof value !== "string") return null

  const result = uuidSchema.safeParse(value)
  return result.success ? result.data : null
}

async function requireUser(headers: Headers) {
  const authResult = await requireSessionResult(headers)

  if (authResult.isErr() || !authResult.value.user) {
    throw new ChatbotError("unauthorized:chat").toResponse()
  }

  return authResult.value.user
}

function serializePersistedMessages(
  messages: Awaited<ReturnType<typeof getMessagesByChatId>>,
) {
  return messages.map((message) => ({
    ...message,
    attachments: message.attachments as Record<string, {}>[],
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
    attachments: Record<string, {}>[]
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
      throw new ChatbotError("forbidden:chat").toResponse()
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

export { toUnauthorizedResponse }
