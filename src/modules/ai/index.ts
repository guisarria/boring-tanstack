// Client
export {
  chatQueryKeys,
  chatHistoryQueryOptions,
  chatListQueryOptions,
} from "./query-options"
export { ChatPanel } from "./components/chat/chat-panel"
export {
  ChatProvider,
  useChatController,
} from "./components/chat/chat-provider"

// Validation & Types
export {
  chatRoleSchema,
  uiMessageSchema,
  chatStreamRequestSchema,
  persistedChatMessagePartSchema,
  persistedChatMessageSchema,
  chatHistoryResponseSchema,
  renameChatSchema,
  deleteChatSchema,
  deleteAllChatsSchema,
  CHAT_ROLES,
} from "./validation"

export type {
  ChatStreamRequest,
  ChatStreamRequestMessage,
  PersistedChatMessage,
  ChatMessagePart,
  RenameChatInput,
  DeleteChatInput,
  DeleteAllChatsInput,
} from "./validation"

// Server Functions
export {
  listChats,
  getChatHistory,
  renameChat,
  deleteChat,
  deleteAllChats,
} from "./functions"

// Constants
export {
  ALLOWED_MODEL_IDS,
  DEFAULT_MODEL_ID,
  ENTITLEMENTS_BY_USER_TYPE,
  isAllowedModelId,
  getUserType,
} from "./constants"

export type { AllowedModelId, UserType } from "./constants"

// Schema
export { chats, messages, ipRateLimits, chatRoleEnum } from "./schema"
export type { Chat, DBMessage } from "./schema"
