import type { UIMessage } from "@tanstack/ai-react"
import { fetchServerSentEvents, useChat } from "@tanstack/ai-react"
import { useState } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"

import { ChatComposer } from "./chat-composer"
import { ChatMessageList } from "./chat-message-list"

const chatConnection = fetchServerSentEvents("/api/chat")

const PENDING_ASSISTANT: UIMessage = {
  id: "__pending__",
  role: "assistant",
  parts: [{ type: "thinking", content: "Thinking…" }],
  createdAt: new Date(),
}

export function ChatPanel() {
  const { messages, sendMessage, isLoading, error } = useChat({
    connection: chatConnection,
  })

  const [draft, setDraft] = useState("")

  const lastMessage = messages.at(-1)
  const streamingMessageId =
    isLoading && lastMessage?.role === "assistant" ? lastMessage.id : null

  const showThinkingPlaceholder = isLoading && lastMessage?.role === "user"

  const displayMessages = showThinkingPlaceholder
    ? [...messages, PENDING_ASSISTANT]
    : messages

  function submit() {
    const text = draft.trim()
    if (!text || isLoading) return

    setDraft("")
    void sendMessage(text)
  }

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="max-h-[calc(100vh-9rem)]" scrollFade>
        <ChatMessageList
          messages={displayMessages}
          streamingMessageId={streamingMessageId}
        />
      </ScrollArea>
      <ChatComposer
        value={draft}
        onChange={setDraft}
        onSubmit={submit}
        disabled={isLoading}
      />
      {error && (
        <p className="text-destructive px-4 pb-2 text-sm">{error.message}</p>
      )}
    </div>
  )
}
