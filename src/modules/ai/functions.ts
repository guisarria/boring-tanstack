import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { z } from "zod"

import { getSessionResult } from "../auth/server/auth-service"
import { ChatbotError } from "./errors"
import { loadChatHistory } from "./server/chat-history"
import {
  deleteChatById,
  getChatsByUserId,
  updateChatTitle,
} from "./server/queries"
import { deleteChatSchema, renameChatSchema } from "./validation"

const chatHistoryInputSchema = z.object({
  conversationId: z.uuid().nullable().optional(),
})

async function getAuthenticatedUserId(): Promise<string> {
  const headers = getRequestHeaders()
  const sessionResult = await getSessionResult(headers)

  if (sessionResult.isErr() || !sessionResult.value.user) {
    throw new ChatbotError("unauthorized:chat").toResponse()
  }

  return sessionResult.value.user.id
}

export const listChats = createServerFn({ method: "GET" }).handler(async () => {
  const userId = await getAuthenticatedUserId()
  const chats = await getChatsByUserId({ userId })

  return {
    chats: chats.map((chat) => ({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt.toISOString(),
    })),
  }
})

export const getChatHistory = createServerFn({ method: "POST" })
  .inputValidator((input: z.input<typeof chatHistoryInputSchema> | undefined) =>
    chatHistoryInputSchema.parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()

    return loadChatHistory(headers, data.conversationId ?? null)
  })

export const renameChat = createServerFn({ method: "POST" })
  .inputValidator(renameChatSchema)
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId()

    const updated = await updateChatTitle({
      id: data.id,
      userId,
      title: data.title,
    })

    if (!updated) {
      throw new ChatbotError("not_found:chat").toResponse()
    }

    return { success: true }
  })

export const deleteChat = createServerFn({ method: "POST" })
  .inputValidator(deleteChatSchema)
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId()

    const deleted = await deleteChatById({
      id: data.id,
      userId,
    })

    if (!deleted) {
      throw new ChatbotError("not_found:chat").toResponse()
    }

    return { success: true }
  })
