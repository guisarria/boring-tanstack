import { createFileRoute } from "@tanstack/react-router"

import { ChatPanel } from "./-components/chat/chat-panel"

export const Route = createFileRoute("/_auth/dashboard/chat")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      <ChatPanel />
    </div>
  )
}
