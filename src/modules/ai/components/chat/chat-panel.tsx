import { useChat } from "@ai-sdk/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { DefaultChatTransport, type UIMessage } from "ai"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import { Container } from "@/components/ui/design-system"
import {
  chatHistoryQueryOptions,
  chatQueryKeys,
} from "@/modules/ai/query-options"

import { ChatComposer } from "./chat-composer"
import { ChatMessageList } from "./chat-message-list"

const chatTransport = new DefaultChatTransport({
  api: "/api/chat",
  prepareSendMessagesRequest: ({ messages, id }) => ({
    body: { messages, data: { conversationId: id } },
  }),
})

type HistoryMessage = {
  id: string
  role: string
  parts: Array<{ type: string; text?: string; duration?: number }>
  createdAt: Date
}

function getReasoningDuration(metadata: unknown): number | undefined {
  if (
    metadata != null &&
    typeof metadata === "object" &&
    "reasoningDuration" in metadata &&
    typeof (metadata as Record<string, unknown>).reasoningDuration === "number"
  ) {
    return (metadata as Record<string, unknown>).reasoningDuration as number
  }
  return undefined
}

function historyToUIMessages(history: HistoryMessage[]): UIMessage[] {
  return history.map((m) => {
    let reasoningDuration: number | undefined
    for (const part of m.parts) {
      if (part.type === "reasoning" && typeof part.duration === "number") {
        reasoningDuration = part.duration
      }
    }

    return {
      id: m.id,
      role: m.role as UIMessage["role"],
      parts: m.parts as UIMessage["parts"],
      metadata: {
        createdAt: m.createdAt.toISOString(),
        ...(reasoningDuration != null && { reasoningDuration }),
      },
    }
  })
}

export function ChatPanel({
  forcedConversationId,
}: {
  forcedConversationId?: string | null
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const generatedIdRef = useRef<string | null>(null)
  const chatHistoryQuery = useQuery(
    chatHistoryQueryOptions(forcedConversationId ?? null),
  )

  const history = chatHistoryQuery.data ?? {
    chatId: forcedConversationId ?? null,
    messages: [],
  }

  const conversationId =
    forcedConversationId ??
    history.chatId ??
    (() => {
      if (!generatedIdRef.current) {
        generatedIdRef.current = crypto.randomUUID()
      }
      return generatedIdRef.current
    })()

  const initialMessages = useMemo(
    () => historyToUIMessages(history.messages),
    [history.messages],
  )

  const { messages, sendMessage, status } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport: chatTransport,
    onFinish: () => {
      void queryClient.invalidateQueries({ queryKey: chatQueryKeys.all })
    },
  })

  useEffect(() => {
    if (forcedConversationId || chatHistoryQuery.isPending) return

    void navigate({
      to: "/chat",
      search: { conversationId },
      replace: true,
    })
  }, [
    chatHistoryQuery.isPending,
    forcedConversationId,
    conversationId,
    navigate,
  ])

  const [draft, setDraft] = useState("")

  const isLoading = status === "submitted" || status === "streaming"

  const lastMessage = messages.at(-1)
  const showThinkingPlaceholder = isLoading && lastMessage?.role === "user"

  const streamingMessageId = showThinkingPlaceholder
    ? "__pending__"
    : isLoading && lastMessage?.role === "assistant"
      ? lastMessage.id
      : null

  const pendingAssistant: UIMessage = {
    id: "__pending__",
    role: "assistant",
    parts: [{ type: "reasoning", text: "Thinking…", state: "streaming" }],
  }

  const displayMessages: UIMessage[] = showThinkingPlaceholder
    ? [...messages, pendingAssistant]
    : messages

  async function submit() {
    const text = draft.trim()
    if (!text || isLoading) return

    setDraft("")
    try {
      await sendMessage({ text })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong"
      toast.error(message, { position: "top-right" })
    }
  }

  return (
    <Container className="flex h-full max-w-5xl flex-col justify-between overflow-auto">
      <ChatMessageList
        messages={displayMessages}
        streamingMessageId={streamingMessageId}
        getReasoningDuration={getReasoningDuration}
      />
      <ChatComposer
        value={draft}
        onChange={setDraft}
        onSubmit={submit}
        disabled={isLoading}
      />
    </Container>
  )
}
