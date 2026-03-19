import { createFileRoute } from "@tanstack/react-router"

import { handleChatGet, handleChatPost } from "@/modules/ai/server/chat-api"

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      GET: async ({ request }) => handleChatGet(request),
      POST: async ({ request }) => handleChatPost(request),
    },
  },
})
