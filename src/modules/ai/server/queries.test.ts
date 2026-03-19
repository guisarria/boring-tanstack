import { beforeEach, describe, expect, it, vi } from "vite-plus/test"

const { findFirst, batch, deleteFn } = vi.hoisted(() => ({
  findFirst: vi.fn(),
  batch: vi.fn(),
  deleteFn: vi.fn(),
}))

vi.mock("@/db/index", () => ({
  db: {
    query: {
      chats: {
        findFirst,
      },
    },
    batch,
    delete: deleteFn,
  },
}))

import { deleteChatById } from "./queries"

describe("deleteChatById", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns null without issuing deletes when the chat is missing", async () => {
    findFirst.mockResolvedValueOnce(null)

    const deleted = await deleteChatById({
      id: "11111111-1111-1111-1111-111111111111",
      userId: "user-1",
    })

    expect(deleted).toBeNull()
    expect(deleteFn).not.toHaveBeenCalled()
    expect(batch).not.toHaveBeenCalled()
  })

  it("deletes messages and the chat in a single batch", async () => {
    const deleteMessagesQuery = { sql: "delete from message" }
    const deleteChatQuery = { sql: "delete from chat" }
    const deleteMessagesWhere = vi.fn().mockReturnValue(deleteMessagesQuery)
    const deleteChatReturning = vi.fn().mockReturnValue(deleteChatQuery)
    const deleteChatWhere = vi.fn().mockReturnValue({
      returning: deleteChatReturning,
    })

    findFirst.mockResolvedValueOnce({ id: "chat-1" })
    deleteFn
      .mockReturnValueOnce({ where: deleteMessagesWhere })
      .mockReturnValueOnce({ where: deleteChatWhere })
    batch.mockResolvedValueOnce([{}, [{ id: "chat-1" }]])

    const deleted = await deleteChatById({
      id: "11111111-1111-1111-1111-111111111111",
      userId: "user-1",
    })

    expect(deleteFn).toHaveBeenCalledTimes(2)
    expect(deleteMessagesWhere).toHaveBeenCalledTimes(1)
    expect(deleteChatWhere).toHaveBeenCalledTimes(1)
    expect(deleteChatReturning).toHaveBeenCalledWith({ id: expect.anything() })
    expect(batch).toHaveBeenCalledWith([deleteMessagesQuery, deleteChatQuery])
    expect(deleted).toEqual({ id: "chat-1" })
  })
})
