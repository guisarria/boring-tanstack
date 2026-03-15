import { chat, toServerSentEventsResponse } from "@tanstack/ai"
import { openRouterText } from "@tanstack/ai-openrouter"
import { createFileRoute } from "@tanstack/react-router"

import { requireSessionResult } from "@/modules/auth/auth-service.server"

const jsonError = (status: number, error: string) =>
  Response.json({ error }, { status })

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authResult = await requireSessionResult(request.headers)

        if (authResult.isErr()) {
          return jsonError(401, "Unauthorized")
        }

        if (!process.env.OPENROUTER_API_KEY) {
          return jsonError(500, "OPENROUTER_API_KEY not configured")
        }

        const { messages, conversationId } = await request.json()

        return toServerSentEventsResponse(
          chat({
            //@ts-ignore
            adapter: openRouterText("nvidia/nemotron-3-super-120b-a12b:free"),
            messages,
            conversationId,
          }),
        )
      },
    },
  },
})
