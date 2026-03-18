import type { UIMessage } from "@tanstack/ai"
import { z } from "zod"

export const CHAT_ROLES = ["system", "user", "assistant"] as const

export const chatRoleSchema = z.enum(CHAT_ROLES)

const uiMessagePartSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    content: z.string(),
    metadata: z.unknown().optional(),
  }),
  z.object({
    type: z.literal("thinking"),
    content: z.string(),
  }),
])

export const uiMessageSchema = z.object({
  id: z.string(),
  role: chatRoleSchema,
  parts: z.array(uiMessagePartSchema),
  createdAt: z.coerce.date().optional(),
})

export const chatStreamRequestSchema = z
  .object({
    id: z.string().optional(),
    model: z.string().optional(),
    messages: z.array(uiMessageSchema),
    data: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough()

export type ChatStreamRequest = z.infer<typeof chatStreamRequestSchema>
export type ChatStreamRequestMessage = z.infer<typeof uiMessageSchema>

export const persistedChatMessagePartSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    content: z.string(),
  }),
  z.object({
    type: z.literal("thinking"),
    content: z.string(),
    duration: z.number().optional(),
  }),
])

export const persistedChatMessageSchema = z.object({
  id: z.string(),
  role: chatRoleSchema,
  parts: z.array(persistedChatMessagePartSchema),
  createdAt: z.coerce.date(),
})

export const chatHistoryResponseSchema = z.object({
  chatId: z.uuid().nullable(),
  messages: z.array(persistedChatMessageSchema).default([]),
})

export type PersistedChatMessage = z.infer<typeof persistedChatMessageSchema>
export type ChatMessagePart = z.infer<typeof persistedChatMessagePartSchema>

export type ChatMessage = Omit<UIMessage, "parts"> & {
  parts: Array<ChatMessagePart>
}

export function normalizePersistedMessageParts(
  parts: unknown,
): Array<ChatMessagePart> {
  if (!Array.isArray(parts)) return []

  const normalizedParts: Array<ChatMessagePart> = []

  for (const part of parts) {
    const result = persistedChatMessagePartSchema.safeParse(part)

    if (result.success) {
      normalizedParts.push(result.data)
    }
  }

  return normalizedParts
}

export function getThinkingDuration(part: ChatMessagePart): number | undefined {
  if (part.type !== "thinking") return undefined
  return typeof part.duration === "number" ? part.duration : undefined
}

export const renameChatSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1).max(80),
})

export type RenameChatInput = z.infer<typeof renameChatSchema>

export const deleteChatSchema = z.object({
  id: z.uuid(),
})

export type DeleteChatInput = z.infer<typeof deleteChatSchema>
