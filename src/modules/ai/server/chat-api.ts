import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import {
  convertToModelMessages,
  generateText,
  streamText,
  type LanguageModel,
  type TextStreamPart,
  type UIMessage,
} from "ai"

import { env } from "@/config/env/server"
import { AppError } from "@/lib/errors"

import {
  ALLOWED_MODEL_IDS,
  DEFAULT_MODEL_ID,
  type AllowedModelId,
} from "../constants"
import { chatStreamRequestSchema } from "../validation"
import {
  loadChatHistory,
  parseOptionalConversationId,
  requireUser,
} from "./chat-history"
import { toPersistedChatMessageParts } from "./message-transforms"
import {
  createChat,
  getChatById,
  saveMessage,
  updateChatTitle,
} from "./queries"
import { checkBotId, checkIpRateLimit, checkRateLimit } from "./rate-limit"

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
})

const modelCache = new Map<AllowedModelId, LanguageModel>()

function getModel(modelId: AllowedModelId): LanguageModel {
  let model = modelCache.get(modelId)
  if (!model) {
    model = openrouter.chat(modelId)
    modelCache.set(modelId, model)
  }
  return model
}

function isAllowedModelId(value: string): value is AllowedModelId {
  return (ALLOWED_MODEL_IDS as Set<string>).has(value)
}

async function generateChatTitle(assistantResponse: string): Promise<string> {
  const { text } = await generateText({
    model: getModel(DEFAULT_MODEL_ID),
    messages: [
      {
        role: "user",
        content:
          "Generate a concise title (3-6 words, max 80 chars). Never return empty.\n\n" +
          assistantResponse,
      },
    ],
  })

  const title = text.trim()
  return title
    ? title
        .replace(/^[#*"\s]+/, "")
        .replace(/["]+$/, "")
        .trim()
    : "New chat"
}

export async function handleChatGet(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const conversationId = parseOptionalConversationId(
    url.searchParams.get("conversationId"),
  )

  if (url.searchParams.has("conversationId") && !conversationId) {
    return new AppError("bad_request:chat").toResponse()
  }

  try {
    return Response.json(await loadChatHistory(request.headers, conversationId))
  } catch (error) {
    return error instanceof Response
      ? error
      : new AppError("internal_error:api").toResponse()
  }
}

export async function handleChatPost(request: Request): Promise<Response> {
  const headers = request.headers

  let user: Awaited<ReturnType<typeof requireUser>>
  try {
    user = await requireUser(headers)
  } catch (error) {
    return error instanceof Response
      ? error
      : new AppError("unauthorized:auth").toResponse()
  }

  if (!env.OPENROUTER_API_KEY) {
    return new AppError(
      "internal_error:api",
      "OPENROUTER_API_KEY not configured",
    ).toResponse()
  }

  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return new AppError("bad_request:api", "Invalid JSON body").toResponse()
  }

  const parsed = chatStreamRequestSchema.safeParse(rawBody)
  if (!parsed.success) {
    return new AppError("bad_request:api", "Invalid request body").toResponse()
  }
  const body = parsed.data

  const conversationId = body.data?.conversationId ?? body.id ?? null

  const conversationUuid =
    typeof conversationId === "string"
      ? parseOptionalConversationId(conversationId)
      : null

  const selectedChatModelRaw =
    body.data?.selectedChatModel ?? body.data?.model ?? body.model ?? null

  const selectedChatModel =
    typeof selectedChatModelRaw === "string"
      ? selectedChatModelRaw
      : DEFAULT_MODEL_ID

  if (!isAllowedModelId(selectedChatModel)) {
    return new AppError("bad_request:api", "Invalid model").toResponse()
  }

  const botResult = checkBotId(headers)
  if (botResult.isBot) {
    return new AppError("unauthorized:auth").toResponse()
  }

  const ip = headers.get("x-forwarded-for") || headers.get("x-real-ip")
  try {
    await checkIpRateLimit(ip ?? undefined)
    await checkRateLimit({
      userId: user.id,
      userRole: user.role,
    })
  } catch (error) {
    if (error instanceof Response) return error
    return new AppError("rate_limit:api").toResponse()
  }

  const messages = body.messages as UIMessage[]

  let isNewChat = false
  let titleGenerationContext: {
    conversationUuid: string
    userId: string
  } | null = null

  if (conversationUuid) {
    const existingChat = await getChatById({ id: conversationUuid })
    if (existingChat && existingChat.userId !== user.id) {
      return new AppError("forbidden:chat").toResponse()
    }
    if (!existingChat) {
      isNewChat = true
      await createChat({
        id: conversationUuid,
        userId: user.id,
        title: "New chat",
      })
    }

    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user")

    if (lastUserMessage) {
      const persistedParts = toPersistedChatMessageParts(
        lastUserMessage.parts.filter(
          (p) => p.type === "text" || p.type === "reasoning",
        ),
      )

      if (persistedParts.length > 0) {
        await saveMessage({
          id: crypto.randomUUID(),
          chatId: conversationUuid,
          role: "user",
          parts: persistedParts,
          attachments: [],
          createdAt: new Date(),
        })

        if (isNewChat) {
          titleGenerationContext = { conversationUuid, userId: user.id }
        }
      }
    }
  }

  const modelMessages = await convertToModelMessages(messages)

  let reasoningStartTime: number | null = null
  let reasoningDuration: number | undefined

  const result = streamText({
    model: getModel(selectedChatModel),
    messages: modelMessages,
    onChunk: ({ chunk }) => {
      const type = (chunk as TextStreamPart<{}>).type
      if (type === "reasoning-start") {
        reasoningStartTime = Date.now()
      } else if (type === "reasoning-end" && reasoningStartTime != null) {
        reasoningDuration = Math.ceil((Date.now() - reasoningStartTime) / 1000)
        reasoningStartTime = null
      }
    },
    onFinish: async ({ text, reasoning }) => {
      if (!conversationUuid) return

      const partsToPersist: Array<{
        type: string
        text: string
        duration?: number
      }> = []

      if (reasoning && reasoning.length > 0) {
        for (const part of reasoning) {
          if (part.type === "reasoning" && part.text) {
            partsToPersist.push({
              type: "reasoning",
              text: part.text,
              ...(reasoningDuration != null && { duration: reasoningDuration }),
            })
          }
        }
      }

      partsToPersist.push({ type: "text", text })

      const persistedParts = toPersistedChatMessageParts(
        partsToPersist,
        undefined,
      )

      try {
        await saveMessage({
          id: crypto.randomUUID(),
          chatId: conversationUuid,
          role: "assistant",
          parts: persistedParts,
          attachments: [],
          createdAt: new Date(),
        })

        if (titleGenerationContext) {
          try {
            const title = await generateChatTitle(text)
            await updateChatTitle({
              id: titleGenerationContext.conversationUuid,
              userId: titleGenerationContext.userId,
              title,
            })
          } catch (e) {
            console.error("Failed to generate title:", e)
          }
        }
      } catch (e) {
        console.error("Failed to persist assistant message:", e)
      }
    },
  })

  return result.toUIMessageStreamResponse()
}
