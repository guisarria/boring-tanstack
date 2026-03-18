import { fetchServerSentEvents, useChat } from "@tanstack/ai-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import { Container } from "@/components/ui/design-system"
import {
  chatHistoryQueryOptions,
  chatQueryKeys,
} from "@/modules/ai/query-options"
import {
  chatHistoryResponseSchema,
  normalizePersistedMessageParts,
  type ChatMessage,
  type PersistedChatMessage,
} from "@/modules/ai/validation"

import { ChatComposer } from "./chat-composer"
import { ChatMessageList } from "./chat-message-list"

const chatConnection = fetchServerSentEvents("/api/chat")

const PENDING_ASSISTANT: ChatMessage = {
  id: "__pending__",
  role: "assistant",
  parts: [{ type: "thinking", content: "Thinking…" }],
  createdAt: new Date(),
}

function dbMessagesToUiMessages(
  dbMessages: Array<PersistedChatMessage>,
): Array<ChatMessage> {
  return dbMessages.map((m) => ({
    id: m.id,
    role: m.role,
    parts: normalizePersistedMessageParts(m.parts),
    createdAt: m.createdAt,
  }))
}

function uiMessagesToChatMessages(
  messages: Array<{
    id: string
    role: ChatMessage["role"]
    parts: unknown
    createdAt?: Date
  }>,
): Array<ChatMessage> {
  return messages.map((message) => ({
    id: message.id,
    role: message.role,
    parts: normalizePersistedMessageParts(message.parts),
    createdAt: message.createdAt,
  }))
}

export function ChatPanel({
  forcedConversationId,
}: {
  forcedConversationId?: string | null
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pendingConversationIdRef = useRef<string | null>(null)
  const chatHistoryQuery = useQuery(
    chatHistoryQueryOptions(forcedConversationId ?? null),
  )

  const history = useMemo(
    () =>
      chatHistoryResponseSchema.parse(
        chatHistoryQuery.data ?? {
          chatId: forcedConversationId ?? null,
          messages: [],
        },
      ),
    [chatHistoryQuery.data, forcedConversationId],
  )

  const initialMessages = useMemo(
    () => dbMessagesToUiMessages(history.messages),
    [history.messages],
  )

  const chatId = forcedConversationId ?? history.chatId ?? undefined

  const { messages, sendMessage, isLoading } = useChat({
    connection: chatConnection,
    id: chatId,
    body: chatId ? { conversationId: chatId } : undefined,
    initialMessages,
    onFinish: () => {
      void queryClient.invalidateQueries({
        queryKey: chatQueryKeys.all,
      })
    },
  })

  useEffect(() => {
    if (forcedConversationId || chatHistoryQuery.isPending) {
      return
    }

    const nextConversationId =
      history.chatId ??
      pendingConversationIdRef.current ??
      (typeof window === "undefined" ? null : crypto.randomUUID())

    if (!nextConversationId) {
      return
    }

    pendingConversationIdRef.current = nextConversationId

    void navigate({
      to: "/chat",
      search: { conversationId: nextConversationId },
      replace: true,
    })
  }, [
    chatHistoryQuery.isPending,
    forcedConversationId,
    history.chatId,
    navigate,
  ])

  const [draft, setDraft] = useState("")
  const normalizedMessages = useMemo(
    () => uiMessagesToChatMessages(messages),
    [messages],
  )

  const lastMessage = normalizedMessages.at(-1)
  const showThinkingPlaceholder = isLoading && lastMessage?.role === "user"
  const streamingMessageId = showThinkingPlaceholder
    ? PENDING_ASSISTANT.id
    : isLoading && lastMessage?.role === "assistant"
      ? lastMessage.id
      : null

  const displayMessages: Array<ChatMessage> = showThinkingPlaceholder
    ? [...normalizedMessages, PENDING_ASSISTANT]
    : normalizedMessages

  async function submit() {
    const text = draft.trim()
    if (!text || isLoading) return
    if (!chatId) return

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
    <Container className="h-full max-w-5xl overflow-auto items-stretch justify-between flex flex-col">
      <ChatMessageList
        messages={displayMessages}
        streamingMessageId={streamingMessageId}
      />
      <ChatComposer
        value={draft}
        onChange={setDraft}
        onSubmit={submit}
        disabled={isLoading || !chatId}
      />
    </Container>
  )
}
