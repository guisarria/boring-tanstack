import { useChat } from "@ai-sdk/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { DefaultChatTransport, type UIMessage } from "ai"
import { createContext, use, useEffect, useRef } from "react"
import { toast } from "sonner"

import {
  chatHistoryQueryOptions,
  chatQueryKeys,
} from "@/modules/ai/query-options"

const chatTransport = new DefaultChatTransport({
  api: "/api/chat",
  prepareSendMessagesRequest: ({ messages, id }) => ({
    body: { messages, data: { conversationId: id } },
  }),
})

const PENDING_ASSISTANT_MESSAGE: UIMessage = {
  id: "__pending__",
  role: "assistant",
  parts: [{ type: "reasoning", text: "", state: "streaming" }],
}

type HistoryMessage = {
  id: string
  role: string
  parts: Array<{ type: string; text?: string }>
  createdAt: Date
}

function historyToUIMessages(history: HistoryMessage[]): UIMessage[] {
  return history.map((m) => ({
    id: m.id,
    role: m.role as UIMessage["role"],
    parts: m.parts as UIMessage["parts"],
    metadata: { createdAt: m.createdAt.toISOString() },
  }))
}

type ChatController = {
  messages: UIMessage[]
  displayMessages: UIMessage[]
  streamingMessageId: string | null
  isLoading: boolean
  sendText: (text: string) => Promise<void>
  stop: () => void
}

const ChatContext = createContext<ChatController | null>(null)

export function useChatController() {
  const value = use(ChatContext)
  if (!value) {
    throw new Error("useChatController must be used within ChatProvider")
  }
  return value
}

export function ChatProvider({
  forcedConversationId,
  children,
}: {
  forcedConversationId?: string | null
  children: React.ReactNode
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

  const initialMessages = historyToUIMessages(history.messages)

  const { messages, sendMessage, status, stop } = useChat({
    id: conversationId,
    messages: initialMessages,
    generateId: () => crypto.randomUUID(),
    transport: chatTransport,
    onFinish: () => {
      void queryClient.invalidateQueries({
        queryKey: chatQueryKeys.history(conversationId),
      })
      void queryClient.invalidateQueries({
        queryKey: chatQueryKeys.list(),
      })
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

  const isLoading = status === "submitted" || status === "streaming"

  const lastMessage = messages.at(-1)
  const showThinkingPlaceholder = isLoading && lastMessage?.role === "user"

  const streamingMessageId = showThinkingPlaceholder
    ? "__pending__"
    : isLoading && lastMessage?.role === "assistant"
      ? lastMessage.id
      : null

  const displayMessages = showThinkingPlaceholder
    ? [...messages, PENDING_ASSISTANT_MESSAGE]
    : messages

  async function sendText(text: string) {
    try {
      await sendMessage({ text })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong"
      toast.error(message, { position: "top-right" })
    }
  }

  const value: ChatController = {
    messages,
    displayMessages,
    streamingMessageId,
    isLoading,
    sendText,
    stop,
  }

  return <ChatContext value={value}>{children}</ChatContext>
}
