// Public API — Client
export {
  chatQueryKeys,
  chatHistoryQueryOptions,
  chatListQueryOptions,
} from "./query-options"
export { ChatPanel } from "./components/chat/chat-panel"

// Public API — Validation & Types
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

// Public API — Server Functions
export { listChats, getChatHistory, renameChat, deleteChat } from "./functions"

// Public API — Constants
export {
  ALLOWED_MODEL_IDS,
  DEFAULT_MODEL_ID,
  ENTITLEMENTS_BY_USER_TYPE,
  isAllowedModelId,
  getUserType,
} from "./constants"

export type { AllowedModelId, UserType } from "./constants"

// Public API — Errors
export { ChatbotError, getMessageByErrorCode } from "./errors"
export type { ErrorType, Surface, ErrorCode, ErrorVisibility } from "./errors"

// Public API — Schema (for Drizzle/DB consumers)
export { chats, messages, ipRateLimits, chatRoleEnum } from "./schema"
export type { Chat, DBMessage } from "./schema"
