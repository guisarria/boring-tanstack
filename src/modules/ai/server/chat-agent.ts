import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { ToolLoopAgent, type LanguageModel } from "ai"

import { env } from "@/config/env/server"

import { type AllowedModelId } from "../validation"

const CHAT_SYSTEM_PROMPT = `You are a helpful AI assistant.

Guidelines:
- Give accurate, direct answers.
- Be concise by default; expand when the task needs it.
- Use Markdown lists, tables, and code blocks when they improve clarity.
- If the request is ambiguous, ask one brief clarifying question.
- If you are uncertain, say so clearly instead of guessing.`

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
})

const modelCache = new Map<AllowedModelId, LanguageModel>()

function getModel(modelId: AllowedModelId): LanguageModel {
  let model = modelCache.get(modelId)
  if (!model) {
    model = openrouter.chat(modelId)
    modelCache.set(modelId, model)
  }
  return model
}

const agentCache = new Map<AllowedModelId, ToolLoopAgent>()

export function getChatAgent(modelId: AllowedModelId): ToolLoopAgent {
  let agent = agentCache.get(modelId)
  if (!agent) {
    agent = new ToolLoopAgent({
      model: getModel(modelId),
      instructions: CHAT_SYSTEM_PROMPT,
    })
    agentCache.set(modelId, agent)
  }
  return agent
}

export function getChatModel(modelId: AllowedModelId): LanguageModel {
  return getModel(modelId)
}
