import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test"

const { getMessageCountByUserId } = vi.hoisted(() => ({
  getMessageCountByUserId: vi.fn(),
}))

vi.mock("../queries", () => ({
  getMessageCountByUserId,
}))

import {
  checkBotId,
  checkIpRateLimit,
  checkRateLimit,
  resetRateLimitStateForTests,
} from "./rate-limit"

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetRateLimitStateForTests()
  })

  it("allows users below the hourly quota", async () => {
    getMessageCountByUserId.mockResolvedValueOnce(3)

    await expect(
      checkRateLimit({
        userId: "user-1",
        userRole: "free",
      }),
    ).resolves.toBeUndefined()
  })

  it("blocks users at the hourly quota", async () => {
    getMessageCountByUserId.mockResolvedValueOnce(10)

    await expect(
      checkRateLimit({
        userId: "user-1",
        userRole: "free",
      }),
    ).rejects.toBeInstanceOf(Response)
  })
})

describe("checkBotId", () => {
  it("flags known automation user agents", () => {
    expect(
      checkBotId(
        new Headers({
          "user-agent": "curl/8.7.1",
        }),
      ),
    ).toEqual({ isBot: true })
  })

  it("allows normal browser user agents", () => {
    expect(
      checkBotId(
        new Headers({
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/123.0.0.0 Safari/537.36",
        }),
      ),
    ).toEqual({ isBot: false })
  })
})

describe("checkIpRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    resetRateLimitStateForTests()
  })

  afterEach(() => {
    vi.useRealTimers()
    resetRateLimitStateForTests()
  })

  it("blocks repeated requests from the same IP inside the time window", async () => {
    for (let index = 0; index < 30; index += 1) {
      await expect(checkIpRateLimit("127.0.0.1")).resolves.toBeUndefined()
    }

    await expect(checkIpRateLimit("127.0.0.1")).rejects.toBeInstanceOf(Response)
  })

  it("resets the bucket after the window expires", async () => {
    for (let index = 0; index < 30; index += 1) {
      await checkIpRateLimit("127.0.0.1")
    }

    vi.advanceTimersByTime(60_000)

    await expect(checkIpRateLimit("127.0.0.1")).resolves.toBeUndefined()
  })
})
