import { createFileRoute } from "@tanstack/react-router"

import { handleChatGet, handleChatPost } from "@/modules/ai/chat-api.server"

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      GET: async ({ request }) => handleChatGet(request),
      POST: async ({ request }) => handleChatPost(request),
    },
  },
})
