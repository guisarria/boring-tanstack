import {
  chat,
  StreamProcessor,
  toServerSentEventsResponse,
  type StreamChunk,
} from "@tanstack/ai"
import { openRouterText } from "@tanstack/ai-openrouter"

import { env } from "@/config/env/server"

import { DEFAULT_MODEL_ID, isAllowedModelId } from "../constants"
import { AppError } from "@/lib/errors"
import { chatStreamRequestSchema } from "../validation"
import { parseOptionalConversationId } from "./chat-history"
import {
  getLastUserMessageParts,
  toPersistedChatMessageParts,
  toTextOnlyModelMessages,
} from "./message-transforms"
import { createChat, getChatById, saveMessage } from "./queries"
import { checkBotId, checkIpRateLimit, checkRateLimit } from "./rate-limit"
import { requireUser } from "./chat-history"

function getStringValue(
  record: Record<string, unknown>,
  key: string,
): string | null {
  const value = record[key]
  return typeof value === "string" ? value : null
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
    return new AppError("bad_request:chat").toResponse()
  }

  try {
    const { loadChatHistory } = await import("./chat-history")
    return Response.json(await loadChatHistory(request.headers, conversationId))
  } catch (error) {
    return error instanceof Response
      ? error
      : new AppError("unauthorized:auth").toResponse()
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

  const selectedChatModel = selectedChatModelRaw ?? DEFAULT_MODEL_ID

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
    if (error instanceof Response) {
      return error
    }

    return new AppError("rate_limit:api").toResponse()
  }

  if (conversationUuid) {
    const existingChat = await getChatById({ id: conversationUuid })
    if (existingChat && existingChat.userId !== user.id) {
      return new AppError("forbidden:chat").toResponse()
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
      const message = e instanceof Error ? e.message : "Unknown error"
      console.error("Failed to persist assistant message:", message)
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
