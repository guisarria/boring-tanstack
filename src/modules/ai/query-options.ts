import { getChatHistory, listChats } from "./functions"

const CHAT_STALE_TIME = 30_000

export const chatQueryKeys = {
  all: ["chat"] as const,
  history: (conversationId: string | null) =>
    ["chat", "history", conversationId ?? "latest"] as const,
  list: () => ["chat", "list"] as const,
}

export function chatHistoryQueryOptions(conversationId: string | null) {
  return {
    queryKey: chatQueryKeys.history(conversationId),
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      getChatHistory({
        data: { conversationId },
        signal,
      }),
    staleTime: CHAT_STALE_TIME,
  }
}

export function chatListQueryOptions() {
  return {
    queryKey: chatQueryKeys.list(),
    queryFn: ({ signal }: { signal: AbortSignal }) => listChats({ signal }),
    staleTime: CHAT_STALE_TIME,
  }
}
