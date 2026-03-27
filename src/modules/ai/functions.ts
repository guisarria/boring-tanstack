import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { z } from "zod"

import { AppError } from "@/lib/errors"

import { getAuthenticatedUserId } from "../auth/server/auth-service"
import { loadChatHistory } from "./server/chat-history"
import {
  deleteAllChatsByUserId,
  deleteChatById,
  getChatsByUserId,
  updateChatTitle,
} from "./server/queries"
import {
  deleteAllChatsSchema,
  deleteChatSchema,
  renameChatSchema,
} from "./validation"

const chatHistoryInputSchema = z.object({
  conversationId: z.uuid().nullable().optional(),
})

async function authenticatedUserId(): Promise<string> {
  const headers = getRequestHeaders()
  const result = await getAuthenticatedUserId(headers, "unauthorized:chat")

  if (result.isErr()) {
    throw new AppError(result.error.code).toResponse()
  }

  return result.value
}

export const listChats = createServerFn({ method: "GET" }).handler(async () => {
  const userId = await authenticatedUserId()
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
    const userId = await authenticatedUserId()

    const updated = await updateChatTitle({
      id: data.id,
      userId,
      title: data.title,
    })

    if (!updated) {
      throw new AppError("not_found:chat").toResponse()
    }

    return { success: true }
  })

export const deleteChat = createServerFn({ method: "POST" })
  .inputValidator(deleteChatSchema)
  .handler(async ({ data }) => {
    const userId = await authenticatedUserId()

    const deleted = await deleteChatById({
      id: data.id,
      userId,
    })

    if (!deleted) {
      throw new AppError("not_found:chat").toResponse()
    }

    return { success: true }
  })

export const deleteAllChats = createServerFn({ method: "POST" })
  .inputValidator(deleteAllChatsSchema)
  .handler(async () => {
    const userId = await authenticatedUserId()

    const deletedIds = await deleteAllChatsByUserId({ userId })

    return { success: true, deletedIds }
  })
