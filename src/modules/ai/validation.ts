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

const models = [
  "google/gemini-2.0-flash-lite",
  "openai/gpt-4o-mini",
  "openai/gpt-oss-120b:free",
] as const

export type AllowedModelId = (typeof models)[number]

export const ALLOWED_MODEL_IDS = new Set<AllowedModelId>(models)

export const DEFAULT_MODEL_ID: AllowedModelId = "openai/gpt-oss-120b:free"

export const ENTITLEMENTS_BY_USER_TYPE = {
  free: { maxMessagesPerHour: 10 },
  pro: { maxMessagesPerHour: 100 },
} as const

export type UserType = keyof typeof ENTITLEMENTS_BY_USER_TYPE

export function isAllowedModelId(value: string): value is AllowedModelId {
  return (ALLOWED_MODEL_IDS as Set<string>).has(value)
}

export function getUserType(role: string | null | undefined): UserType {
  return role === "pro" ? "pro" : "free"
}
