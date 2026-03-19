// Client
export {
  chatQueryKeys,
  chatHistoryQueryOptions,
  chatListQueryOptions,
} from "./query-options"
export { ChatPanel } from "./components/chat/chat-panel"

// Validation & Types
export {
  chatRoleSchema,
  uiMessageSchema,
  chatStreamRequestSchema,
  persistedChatMessagePartSchema,
  persistedChatMessageSchema,
  chatHistoryResponseSchema,
  normalizePersistedMessageParts,
  getThinkingDuration,
  renameChatSchema,
  deleteChatSchema,
  CHAT_ROLES,
} from "./validation"

export type {
  ChatStreamRequest,
  ChatStreamRequestMessage,
  PersistedChatMessage,
  ChatMessagePart,
  ChatMessage,
  RenameChatInput,
  DeleteChatInput,
} from "./validation"

// Server Functions
export { listChats, getChatHistory, renameChat, deleteChat } from "./functions"

// Constants
export {
  ALLOWED_MODEL_IDS,
  DEFAULT_MODEL_ID,
  ENTITLEMENTS_BY_USER_TYPE,
  isAllowedModelId,
  getUserType,
} from "./constants"

export type { AllowedModelId, UserType } from "./constants"

// Errors
export { AppError, getErrorMessage } from "@/lib/errors"
export type {
  ErrorType,
  Surface,
  ErrorCode,
  ErrorVisibility,
} from "@/lib/errors"

// Schema
export { chats, messages, ipRateLimits, chatRoleEnum } from "./schema"
export type { Chat, DBMessage } from "./schema"
