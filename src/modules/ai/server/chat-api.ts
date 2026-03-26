import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import {
  convertToModelMessages,
  generateText,
  Output,
  streamText,
  type LanguageModel,
  type UIMessage,
} from "ai"
import { z } from "zod"

import { env } from "@/config/env/server"
import { AppError } from "@/lib/errors"

import {
  DEFAULT_MODEL_ID,
  isAllowedModelId,
  type AllowedModelId,
} from "../constants"
import { chatStreamRequestSchema } from "../validation"
import {
  loadChatHistory,
  parseOptionalConversationId,
  requireUser,
} from "./chat-history"
import { CHAT_SYSTEM_PROMPT } from "./chat-prompts"
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

const chatTitleSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(80)
    .describe(
      "A concise 3-6 word plain-text conversation title. No quotes or markdown.",
    ),
})

function sanitizeTitle(raw: string): string {
  const cleaned = raw
    .trim()
    .replace(/^["'#*\s]+/, "")
    .replace(/["]+$/, "")
    .trim()
  return cleaned || "New chat"
}

async function generateChatTitle(userMessage: string): Promise<string> {
  try {
    const { output } = await generateText({
      model: getModel(DEFAULT_MODEL_ID),
      system:
        "Generate a short user-visible chat title. Return a concise plain-text title only.",
      prompt: userMessage,
      output: Output.object({ schema: chatTitleSchema }),
    })

    return sanitizeTitle(output.title)
  } catch {
    return "New chat"
  }
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
    userText: string
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
          const userText = persistedParts
            .filter((p) => p.type === "text")
            .map((p) => p.text)
            .join(" ")
          titleGenerationContext = {
            conversationUuid,
            userId: user.id,
            userText,
          }
        }
      }
    }
  }

  const modelMessages = await convertToModelMessages(messages)

  const result = streamText({
    model: getModel(selectedChatModel),
    system: CHAT_SYSTEM_PROMPT,
    messages: modelMessages,
    abortSignal: request.signal,
  })

  result.consumeStream()

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    sendReasoning: true,
    onFinish: async ({ messages: finalMessages }) => {
      if (!conversationUuid) return

      const assistantMessage = finalMessages.at(-1)
      if (!assistantMessage || assistantMessage.role !== "assistant") return

      const persistedParts = toPersistedChatMessageParts(
        assistantMessage.parts.filter(
          (p) => p.type === "text" || p.type === "reasoning",
        ),
      )

      if (persistedParts.length === 0) return

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
            const title = await generateChatTitle(
              titleGenerationContext.userText,
            )
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
}
