import {
  chat,
  convertMessagesToModelMessages,
  StreamProcessor,
  toServerSentEventsResponse,
  type ModelMessage,
  type StreamChunk,
} from "@tanstack/ai"
import { openRouterText } from "@tanstack/ai-openrouter"

import { env } from "@/config/env/server"
import { requireSessionResult } from "@/modules/auth/auth-service.server"

import {
  loadChatHistory,
  parseOptionalConversationId,
} from "./chat-history.server"
import {
  chatStreamRequestSchema,
  type ChatMessagePart,
  type ChatStreamRequestMessage,
} from "./contracts"
import { ChatbotError } from "./errors"
import { DEFAULT_CHAT_MODEL, isAllowedModelId } from "./lib/constants"
import { checkBotId, checkIpRateLimit, checkRateLimit } from "./lib/rate-limit"
import { createChat, getChatById, saveMessage } from "./queries"

function jsonError(status: number, error: string) {
  return Response.json({ error }, { status })
}

function getStringValue(
  record: Record<string, unknown>,
  key: string,
): string | null {
  const value = record[key]
  return typeof value === "string" ? value : null
}

async function requireUser(headers: Headers) {
  const sessionResult = await requireSessionResult(headers)

  if (sessionResult.isErr() || !sessionResult.value.user) {
    throw new ChatbotError("unauthorized:chat").toResponse()
  }

  return sessionResult.value.user
}

function getLastUserMessageParts(messages: Array<ChatStreamRequestMessage>) {
  return (
    [...messages].reverse().find((message) => message.role === "user")?.parts ??
    null
  )
}

type TextOnlyModelMessage = ModelMessage<string | null>

function getTextOnlyContent(content: ModelMessage["content"]): string | null {
  if (typeof content === "string" || content === null) {
    return content
  }

  const textContent = content
    .filter((part) => part.type === "text")
    .map((part) => part.content)
    .join("")

  return textContent || null
}

function toTextOnlyModelMessages(
  messages: Array<ChatStreamRequestMessage>,
): Array<TextOnlyModelMessage> {
  return convertMessagesToModelMessages(messages).map((message) => ({
    ...message,
    content: getTextOnlyContent(message.content),
  }))
}

function toPersistedChatMessageParts(
  parts: Array<{ type: string; content?: unknown }>,
  thinkingDurationSeconds?: number,
): Array<ChatMessagePart> {
  const persistedParts: Array<ChatMessagePart> = []

  for (const part of parts) {
    if (part.type === "text" && typeof part.content === "string") {
      persistedParts.push({
        type: "text",
        content: part.content,
      })
      continue
    }

    if (part.type === "thinking" && typeof part.content === "string") {
      persistedParts.push({
        type: "thinking",
        content: part.content,
        duration: thinkingDurationSeconds,
      })
    }
  }

  return persistedParts
}

function wireAbortSignal(request: Request, abortController: AbortController) {
  if (request.signal.aborted) {
    abortController.abort()
    return
  }

  request.signal.addEventListener(
    "abort",
    () => {
      abortController.abort()
    },
    { once: true },
  )
}

export async function handleChatGet(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const conversationId = parseOptionalConversationId(
    url.searchParams.get("conversationId"),
  )

  if (url.searchParams.has("conversationId") && !conversationId) {
    return jsonError(400, "Invalid conversationId")
  }

  try {
    return Response.json(await loadChatHistory(request.headers, conversationId))
  } catch (error) {
    return error instanceof Response ? error : jsonError(401, "Unauthorized")
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
      : new Response("Unauthorized", { status: 401 })
  }

  if (!env.OPENROUTER_API_KEY) {
    return new Response("OPENROUTER_API_KEY not configured", { status: 500 })
  }

  const body = chatStreamRequestSchema.parse(await request.json())
  const messages = body.messages
  const data = body.data ?? {}

  const conversationId =
    getStringValue(data, "conversationId") ?? body.id ?? null

  const conversationUuid = parseOptionalConversationId(conversationId)

  const selectedChatModelRaw =
    getStringValue(data, "selectedChatModel") ??
    getStringValue(data, "model") ??
    body.model ??
    null

  const selectedChatModelCandidate = selectedChatModelRaw ?? DEFAULT_CHAT_MODEL

  if (!isAllowedModelId(selectedChatModelCandidate)) {
    return new Response("Invalid model", { status: 400 })
  }

  const selectedChatModel = selectedChatModelCandidate

  const botResult = checkBotId(headers)

  if (botResult.isBot) {
    return new Response("Unauthorized", { status: 401 })
  }

  const ip = headers.get("x-forwarded-for") || headers.get("x-real-ip")
  try {
    await checkIpRateLimit(ip ?? undefined)
    await checkRateLimit({
      userId: user.id,
      userRole: user.role,
    })
  } catch (error) {
    if (error instanceof Response) {
      return error
    }

    return new Response("Rate limited", { status: 429 })
  }

  if (conversationUuid) {
    const existingChat = await getChatById({ id: conversationUuid })
    if (existingChat && existingChat.userId !== user.id) {
      return new Response("Forbidden", { status: 403 })
    }
    if (!existingChat) {
      await createChat({
        id: conversationUuid,
        userId: user.id,
        title: "New chat",
      })
    }

    const userParts = getLastUserMessageParts(messages)
    if (userParts) {
      await saveMessage({
        id: crypto.randomUUID(),
        chatId: conversationUuid,
        role: "user",
        parts: userParts,
        attachments: [],
        createdAt: new Date(),
      })
    }
  }

  const abortController = new AbortController()
  wireAbortSignal(request, abortController)

  const modelMessages = toTextOnlyModelMessages(messages)

  const processor = new StreamProcessor()
  const initialAssistantCount = processor
    .getMessages()
    .filter((m) => m.role === "assistant").length
  let thinkingStartAt: number | null = null

  async function persistAssistantMessageBestEffort({
    thinkingDurationSeconds,
  }: {
    thinkingDurationSeconds?: number
  }) {
    if (!conversationUuid) return
    if (abortController.signal.aborted) return

    const assistantMessages = processor
      .getMessages()
      .filter((m) => m.role === "assistant")

    if (assistantMessages.length <= initialAssistantCount) return

    const lastAssistant = assistantMessages.at(-1)
    if (!lastAssistant || lastAssistant.parts.length === 0) return

    const persistedParts = toPersistedChatMessageParts(
      lastAssistant.parts,
      typeof thinkingDurationSeconds === "number" &&
        Number.isFinite(thinkingDurationSeconds)
        ? thinkingDurationSeconds
        : undefined,
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
    } catch (e) {
      const err = e as Error
      console.error("Failed to persist assistant message:", err.message)
    }
  }

  const stream = chat({
    adapter: openRouterText(selectedChatModel),
    messages: modelMessages,
    conversationId: conversationId ?? undefined,
    abortController,
    metadata: data,
  })

  async function* streamWithPersistence(): AsyncIterable<StreamChunk> {
    try {
      for await (const chunk of stream) {
        if (abortController.signal.aborted) break
        thinkingStartAt ??= Date.now()
        processor.processChunk(chunk)
        yield chunk
      }
    } finally {
      processor.finalizeStream()

      const thinkingDurationSeconds =
        thinkingStartAt == null
          ? undefined
          : Math.max(1, Math.ceil((Date.now() - thinkingStartAt) / 1000))

      void persistAssistantMessageBestEffort({ thinkingDurationSeconds })
    }
  }

  return toServerSentEventsResponse(streamWithPersistence(), {
    abortController,
  })
}
