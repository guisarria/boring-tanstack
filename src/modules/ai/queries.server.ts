import { and, count, eq, gte } from "drizzle-orm"

import { db } from "@/db/index"

import { ChatbotError } from "./errors"
import { chats, messages } from "./schema"
import type { ChatMessagePart } from "./validation"

export async function createChat({
  id,
  userId,
  title,
}: {
  id: string
  userId: string
  title: string
}) {
  try {
    return await db.insert(chats).values({
      id,
      createdAt: new Date(),
      userId,
      title,
    })
  } catch {
    throw new ChatbotError("bad_request:database", "Failed to create chat")
  }
}
export async function getChatById({ id }: { id: string }) {
  try {
    return await db.query.chats.findFirst({
      where: (chats, { eq }) => eq(chats.id, id),
    })
  } catch {
    throw new ChatbotError("bad_request:database", "Failed to get chat")
  }
}

export async function getLatestChatByUserId({ userId }: { userId: string }) {
  try {
    return await db.query.chats.findFirst({
      where: (chats, { eq }) => eq(chats.userId, userId),
      orderBy: (chats, { desc }) => [desc(chats.createdAt)],
    })
  } catch {
    throw new ChatbotError("bad_request:database", "Failed to get latest chat")
  }
}

export async function getChatsByUserId({
  userId,
  limit = 25,
}: {
  userId: string
  limit?: number
}) {
  try {
    return await db.query.chats.findMany({
      where: (chats, { eq }) => eq(chats.userId, userId),
      orderBy: (chats, { desc }) => [desc(chats.createdAt)],
      limit,
    })
  } catch {
    throw new ChatbotError("bad_request:database", "Failed to get chats")
  }
}

export async function updateChatTitle({
  id,
  userId,
  title,
}: {
  id: string
  userId: string
  title: string
}) {
  try {
    const updated = await db
      .update(chats)
      .set({ title })
      .where(and(eq(chats.id, id), eq(chats.userId, userId)))
      .returning({ id: chats.id })
    return updated.at(0) ?? null
  } catch {
    throw new ChatbotError("bad_request:database", "Failed to update chat")
  }
}

export async function deleteChatById({
  id,
  userId,
}: {
  id: string
  userId: string
}) {
  try {
    const existing = await db.query.chats.findFirst({
      where: (chats, { and, eq }) =>
        and(eq(chats.id, id), eq(chats.userId, userId)),
      columns: { id: true },
    })

    if (!existing) return null

    const [, deleted] = await db.batch([
      db.delete(messages).where(eq(messages.chatId, id)),
      db
        .delete(chats)
        .where(and(eq(chats.id, id), eq(chats.userId, userId)))
        .returning({ id: chats.id }),
    ])

    return deleted.at(0) ?? null
  } catch (error) {
    const cause =
      error instanceof Error ? error.message : "Failed to delete chat"
    throw new ChatbotError("bad_request:database", cause)
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db.query.messages.findMany({
      where: (messages, { eq }) => eq(messages.chatId, id),
      orderBy: (messages, { asc }) => [asc(messages.createdAt)],
    })
  } catch {
    throw new ChatbotError("bad_request:database", "Failed to get messages")
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string
  differenceInHours: number
}) {
  const cutoff = new Date(Date.now() - differenceInHours * 60 * 60 * 1000)

  try {
    const [result] = await db
      .select({ count: count() })
      .from(messages)
      .innerJoin(chats, eq(messages.chatId, chats.id))
      .where(
        and(
          eq(chats.userId, id),
          eq(messages.role, "user"),
          gte(messages.createdAt, cutoff),
        ),
      )

    return Number(result?.count ?? 0)
  } catch {
    throw new ChatbotError(
      "bad_request:database",
      "Failed to count recent messages",
    )
  }
}

export async function generateTitleFromUserMessage({
  message: _message,
}: {
  message: { role: string; content: string }
}) {
  return "New chat"
}

export async function saveMessage(message: {
  id: string
  chatId: string
  role: "system" | "user" | "assistant"
  parts: Array<ChatMessagePart>
  attachments: Array<unknown>
  createdAt: Date
}) {
  try {
    return await db.insert(messages).values({
      id: message.id,
      chatId: message.chatId,
      role: message.role,
      parts: message.parts,
      attachments: message.attachments,
      createdAt: message.createdAt,
    })
  } catch {
    throw new ChatbotError("bad_request:database", "Failed to save message")
  }
}
