import { and, count, eq, gte, inArray } from "drizzle-orm"

import { db } from "@/db/index"
import { AppError } from "@/lib/errors"

import { chats, messages } from "../schema"
import type { ChatMessagePart } from "../validation"

function withDbError<T>(cause: string, fn: () => Promise<T>): Promise<T> {
  return fn().catch((error) => {
    throw new AppError(
      "internal_error:database",
      error instanceof Error ? error.message : cause,
    )
  })
}

export function createChat({
  id,
  userId,
  title,
}: {
  id: string
  userId: string
  title: string
}) {
  return withDbError("Failed to create chat", () =>
    db.insert(chats).values({ id, createdAt: new Date(), userId, title }),
  )
}

export function getChatById({ id }: { id: string }) {
  return withDbError("Failed to get chat", () =>
    db.query.chats.findFirst({
      where: (chats, { eq }) => eq(chats.id, id),
    }),
  )
}

export function getLatestChatByUserId({ userId }: { userId: string }) {
  return withDbError("Failed to get latest chat", () =>
    db.query.chats.findFirst({
      where: (chats, { eq }) => eq(chats.userId, userId),
      orderBy: (chats, { desc }) => [desc(chats.createdAt)],
    }),
  )
}

export function getChatsByUserId({
  userId,
  limit = 25,
}: {
  userId: string
  limit?: number
}) {
  return withDbError("Failed to get chats", () =>
    db.query.chats.findMany({
      where: (chats, { eq }) => eq(chats.userId, userId),
      orderBy: (chats, { desc }) => [desc(chats.createdAt)],
      limit,
    }),
  )
}

export function updateChatTitle({
  id,
  userId,
  title,
}: {
  id: string
  userId: string
  title: string
}) {
  return withDbError("Failed to update chat", async () => {
    const updated = await db
      .update(chats)
      .set({ title })
      .where(and(eq(chats.id, id), eq(chats.userId, userId)))
      .returning({ id: chats.id })
    return updated.at(0) ?? null
  })
}

export function deleteChatById({ id, userId }: { id: string; userId: string }) {
  return withDbError("Failed to delete chat", async () => {
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
  })
}

export function deleteAllChatsByUserId({ userId }: { userId: string }) {
  return withDbError("Failed to delete all chats", async () => {
    const userChats = await db.query.chats.findMany({
      where: (chats, { eq }) => eq(chats.userId, userId),
      columns: { id: true },
    })

    if (userChats.length === 0) return []

    const chatIds = userChats.map((c) => c.id)

    const [, deleted] = await db.batch([
      db.delete(messages).where(inArray(messages.chatId, chatIds)),
      db
        .delete(chats)
        .where(eq(chats.userId, userId))
        .returning({ id: chats.id }),
    ])

    return deleted.map((d) => d.id)
  })
}

export function getMessagesByChatId({ id }: { id: string }) {
  return withDbError("Failed to get messages", () =>
    db.query.messages.findMany({
      where: (messages, { eq }) => eq(messages.chatId, id),
      orderBy: (messages, { asc }) => [asc(messages.createdAt)],
    }),
  )
}

export function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string
  differenceInHours: number
}) {
  const cutoff = new Date(Date.now() - differenceInHours * 60 * 60 * 1000)

  return withDbError("Failed to count recent messages", async () => {
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
  })
}

export function saveMessage(message: {
  id: string
  chatId: string
  role: "system" | "user" | "assistant"
  parts: Array<ChatMessagePart>
  attachments: Array<unknown>
  createdAt: Date
}) {
  return withDbError("Failed to save message", () =>
    db.insert(messages).values({
      id: message.id,
      chatId: message.chatId,
      role: message.role,
      parts: message.parts,
      attachments: message.attachments,
      createdAt: message.createdAt,
    }),
  )
}
