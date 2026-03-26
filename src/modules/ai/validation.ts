import { z } from "zod"

export const CHAT_ROLES = ["system", "user", "assistant"] as const

export const chatRoleSchema = z.enum(CHAT_ROLES)

const uiTextPartSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
})

const uiReasoningPartSchema = z.object({
  type: z.literal("reasoning"),
  text: z.string(),
})

const uiStepStartPartSchema = z.object({
  type: z.literal("step-start"),
})

export const uiMessagePartSchema = z.union([
  uiTextPartSchema,
  uiReasoningPartSchema,
  uiStepStartPartSchema,
  z
    .object({
      type: z.string(),
    })
    .passthrough(),
])

export const uiMessageSchema = z.object({
  id: z.string(),
  role: chatRoleSchema,
  parts: z.array(uiMessagePartSchema),
  createdAt: z.coerce.date().optional(),
})

const chatStreamRequestDataSchema = z
  .object({
    conversationId: z.string().optional(),
    selectedChatModel: z.string().optional(),
    model: z.string().optional(),
  })
  .optional()

export const chatStreamRequestSchema = z
  .object({
    id: z.string().optional(),
    model: z.string().optional(),
    messages: z.array(uiMessageSchema),
    data: chatStreamRequestDataSchema,
  })
  .passthrough()

export type ChatStreamRequest = z.infer<typeof chatStreamRequestSchema>
export type ChatStreamRequestMessage = z.infer<typeof uiMessageSchema>

export type UITextPart = z.infer<typeof uiTextPartSchema>
export type UIReasoningPart = z.infer<typeof uiReasoningPartSchema>

export const persistedChatMessagePartSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("reasoning"),
    text: z.string(),
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

export const renameChatSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1).max(80),
})

export type RenameChatInput = z.infer<typeof renameChatSchema>

export const deleteChatSchema = z.object({
  id: z.uuid(),
})

export type DeleteChatInput = z.infer<typeof deleteChatSchema>

export const deleteAllChatsSchema = z.object({})

export type DeleteAllChatsInput = z.infer<typeof deleteAllChatsSchema>
