import { getChatHistory, listChats } from "./functions"

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
    staleTime: 30_000,
  }
}

export function chatListQueryOptions() {
  return {
    queryKey: chatQueryKeys.list(),
    queryFn: ({ signal }: { signal: AbortSignal }) => listChats({ signal }),
    staleTime: 30_000,
  }
}
