import { Container } from "@/components/ui/design-system"

import { ChatComposer } from "./chat-composer"
import { ChatMessageList } from "./chat-message-list"
import { ChatProvider } from "./chat-provider"

export function ChatPanel({
  forcedConversationId,
}: {
  forcedConversationId?: string | null
}) {
  return (
    <ChatProvider forcedConversationId={forcedConversationId}>
      <Container className="flex h-full max-w-5xl flex-col justify-between overflow-auto">
        <ChatMessageList />
        <ChatComposer />
      </Container>
    </ChatProvider>
  )
}
