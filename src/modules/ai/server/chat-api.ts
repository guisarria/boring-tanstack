import {
  createAgentUIStreamResponse,
  generateText,
  Output,
  type UIMessage,
} from "ai"
import { z } from "zod"

import { env } from "@/config/env/server"
import { AppError, toErrorResponse } from "@/lib/errors"
import { unwrapOrThrow } from "@/lib/server-utils"
import {
  type PublicUser,
  requireAuthenticatedUser,
} from "@/modules/auth/server/auth-service"

import {
  chatStreamRequestSchema,
  DEFAULT_MODEL_ID,
  isAllowedModelId,
} from "../validation"
import { getChatAgent, getChatModel } from "./chat-agent"
import {
  getChatHistory,
  parseOptionalConversationId,
  persistAssistantTurn,
  prepareUserTurn,
} from "./chat-service"
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

function resolveConversationId(
  body: z.infer<typeof chatStreamRequestSchema>,
): string | null {
  const raw = body.data?.conversationId ?? body.id ?? null
  return typeof raw === "string" ? parseOptionalConversationId(raw) : null
}

function resolveSelectedModel(
  body: z.infer<typeof chatStreamRequestSchema>,
): string {
  const raw =
    body.data?.selectedChatModel ?? body.data?.model ?? body.model ?? null
  return typeof raw === "string" ? raw : DEFAULT_MODEL_ID
}

function getClientIp(headers: Headers): string | undefined {
  return headers.get("x-forwarded-for") || headers.get("x-real-ip") || undefined
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
    const user = unwrapOrThrow(
      await requireAuthenticatedUser(request.headers, "unauthorized:chat"),
    )
    return Response.json(await getChatHistory(user.id, conversationId))
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function handleChatPost(request: Request): Promise<Response> {
  const headers = request.headers

  let user: PublicUser
  try {
    user = unwrapOrThrow(
      await requireAuthenticatedUser(headers, "unauthorized:chat"),
    )
  } catch (error) {
    return toErrorResponse(error)
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

  const conversationUuid = resolveConversationId(body)
  const selectedChatModel = resolveSelectedModel(body)

  if (!isAllowedModelId(selectedChatModel)) {
    return new AppError("bad_request:api", "Invalid model").toResponse()
  }

  if (checkBotId(headers).isBot) {
    return new AppError("unauthorized:auth").toResponse()
  }

  try {
    await checkIpRateLimit(getClientIp(headers))
    await checkRateLimit({ userId: user.id, userRole: user.role })
  } catch (error) {
    return toErrorResponse(error)
  }

  const messages = body.messages as UIMessage[]

  let titleContext: Awaited<
    ReturnType<typeof prepareUserTurn>
  >["titleContext"] = null
  let titlePromise: Promise<string> | null = null

  if (conversationUuid) {
    try {
      const turn = await prepareUserTurn({
        conversationId: conversationUuid,
        userId: user.id,
        messages,
      })
      titleContext = turn.titleContext

      if (titleContext) {
        titlePromise = generateChatTitle(titleContext.userText)
      }
    } catch (error) {
      return toErrorResponse(error)
    }
  }

  const agent = getChatAgent(selectedChatModel)

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
    abortSignal: request.signal,
    sendReasoning: true,
    onFinish: async ({ responseMessage }) => {
      if (!conversationUuid) return

      try {
        await persistAssistantTurn({
          conversationId: conversationUuid,
          message: responseMessage,
        })

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
