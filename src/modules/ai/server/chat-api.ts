import {
  createAgentUIStreamResponse,
  generateText,
  Output,
  type UIMessage,
} from "ai"
import { z } from "zod"

import { env } from "@/config/env/server"
import { AppError } from "@/lib/errors"

import { DEFAULT_MODEL_ID, isAllowedModelId } from "../constants"
import { chatStreamRequestSchema } from "../validation"
import { getChatAgent, getChatModel } from "./chat-agent"
import {
  loadChatHistory,
  parseOptionalConversationId,
  requireUser,
} from "./chat-history"
import { persistAssistantMessage, prepareChatTurn } from "./chat-session"
import { updateChatTitle } from "./queries"
import { checkBotId, checkIpRateLimit, checkRateLimit } from "./rate-limit"

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
      model: getChatModel(DEFAULT_MODEL_ID),
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
    await checkRateLimit({ userId: user.id, userRole: user.role })
  } catch (error) {
    if (error instanceof Response) return error
    return new AppError("rate_limit:api").toResponse()
  }

  const messages = body.messages as UIMessage[]

  let titleContext: Awaited<
    ReturnType<typeof prepareChatTurn>
  >["titleContext"] = null
  let titlePromise: Promise<string> | null = null

  if (conversationUuid) {
    try {
      const turn = await prepareChatTurn({
        conversationId: conversationUuid,
        userId: user.id,
        messages,
      })
      titleContext = turn.titleContext

      if (titleContext) {
        titlePromise = generateChatTitle(titleContext.userText)
      }
    } catch (error) {
      if (error instanceof Error && error.message === "forbidden") {
        return new AppError("forbidden:chat").toResponse()
      }
      throw error
    }
  }

  const agent = getChatAgent(selectedChatModel)

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
    abortSignal: request.signal,
    sendReasoning: true,
    onFinish: async ({ responseMessage }) => {
      console.log(
        "[onFinish] called with responseMessage:",
        responseMessage.id,
        responseMessage.role,
      )
      if (!conversationUuid) {
        console.log("[onFinish] no conversationUuid, returning early")
        return
      }

      try {
        console.log(
          "[onFinish] persisting assistant message:",
          responseMessage.id,
        )
        await persistAssistantMessage({
          conversationId: conversationUuid,
          message: responseMessage,
        })
        console.log("[onFinish] assistant message persisted successfully")

        if (titleContext && titlePromise) {
          try {
            const title = await titlePromise
            await updateChatTitle({
              id: titleContext.conversationId,
              userId: titleContext.userId,
              title,
            })
          } catch (e) {
            console.error("Failed to update title:", e)
          }
        }
      } catch (e) {
        console.error("Failed to persist assistant message:", e)
      }
    },
  })
}
