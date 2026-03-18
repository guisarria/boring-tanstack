import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { z } from "zod"

import { getSessionResult } from "../auth/auth-service.server"
import { loadChatHistory } from "./chat-history.server"
import { ChatbotError } from "./errors"
import {
  deleteChatById,
  getChatsByUserId,
  updateChatTitle,
} from "./queries.server"
import { deleteChatSchema, renameChatSchema } from "./validation"

const chatHistoryInputSchema = z.object({
  conversationId: z.uuid().nullable().optional(),
})

export const listChats = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders()
  const sessionResult = await getSessionResult(headers)

  if (sessionResult.isErr() || !sessionResult.value.user) {
    throw new ChatbotError("unauthorized:chat").toResponse()
  }

  const chats = await getChatsByUserId({ userId: sessionResult.value.user.id })

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
    const headers = getRequestHeaders()
    const sessionResult = await getSessionResult(headers)

    if (sessionResult.isErr() || !sessionResult.value.user) {
      throw new ChatbotError("unauthorized:chat").toResponse()
    }

    const updated = await updateChatTitle({
      id: data.id,
      userId: sessionResult.value.user.id,
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
    const headers = getRequestHeaders()
    const sessionResult = await getSessionResult(headers)

    if (sessionResult.isErr() || !sessionResult.value.user) {
      throw new ChatbotError("unauthorized:chat").toResponse()
    }

    const deleted = await deleteChatById({
      id: data.id,
      userId: sessionResult.value.user.id,
    })

    if (!deleted) {
      throw new ChatbotError("not_found:chat").toResponse()
    }

    return { success: true }
  })
