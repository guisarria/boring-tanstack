const models = [
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "openai/gpt-4o-mini",
  "anthropic/claude-3.5-sonnet",
] as const

export type AllowedModelId = (typeof models)[number]

export const ALLOWED_MODEL_IDS = new Set<AllowedModelId>(models)

export const DEFAULT_MODEL_ID: AllowedModelId =
  "nvidia/nemotron-3-nano-30b-a3b:free"

export const ENTITLEMENTS_BY_USER_TYPE = {
  free: { maxMessagesPerHour: 10 },
  pro: { maxMessagesPerHour: 100 },
} as const

export type UserType = keyof typeof ENTITLEMENTS_BY_USER_TYPE

export function isAllowedModelId(value: string): value is AllowedModelId {
  return (ALLOWED_MODEL_IDS as Set<string>).has(value)
}

export function getUserType(role: string | null | undefined): UserType {
  return role === "pro" ? "pro" : "free"
}
