import type { UIMessage } from "@tanstack/ai-react"
import { fetchServerSentEvents, useChat } from "@tanstack/ai-react"
import { useState } from "react"
import { toast } from "sonner"

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
  const { messages, sendMessage, isLoading } = useChat({
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

  async function submit() {
    const text = draft.trim()
    if (!text || isLoading) return

    setDraft("")
    try {
      await sendMessage(text)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong"
      toast.error(message, {
        position: "top-right",
      })
    }
  }

  return (
    <div className="relative flex h-full flex-col justify-between overflow-auto">
      <ChatMessageList
        messages={displayMessages}
        streamingMessageId={streamingMessageId}
      />
      <ChatComposer
        value={draft}
        onChange={setDraft}
        onSubmit={submit}
        disabled={isLoading}
      />
    </div>
  )
}
