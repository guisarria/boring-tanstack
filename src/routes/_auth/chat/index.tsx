import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

import { ChatPanel } from "@/modules/ai/components/chat/chat-panel"
import { chatHistoryQueryOptions } from "@/modules/ai/query-options"

export const Route = createFileRoute("/_auth/chat/")({
  validateSearch: z.object({
    conversationId: z.uuid().optional(),
  }),
  beforeLoad: async ({ context, search }) => {
    await context.queryClient.fetchQuery(
      chatHistoryQueryOptions(search.conversationId ?? null),
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { conversationId } = Route.useSearch()
  return (
    <ChatPanel
      key={conversationId ?? "latest"}
      forcedConversationId={conversationId ?? null}
    />
  )
}
