import { createFileRoute } from "@tanstack/react-router"

import { ChatPanel } from "@/modules/ai/components/chat/chat-panel"

export const Route = createFileRoute("/_auth/dashboard/chat")({
  component: RouteComponent,
})

function RouteComponent() {
  return <ChatPanel />
}
