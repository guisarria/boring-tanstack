import { describe, expect, it, vi } from "vite-plus/test"

vi.mock("./auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

import { auth } from "./auth"
import { getSessionResult, requireSessionResult } from "./auth-service"

const now = new Date()

function createMockSession() {
  return {
    session: {
      id: "s1",
      createdAt: now,
      updatedAt: now,
      userId: "u1",
      expiresAt: new Date(Date.now() + 86_400_000),
      token: "tok_abc",
      ipAddress: null,
      userAgent: null,
    },
    user: {
      id: "u1",
      name: "Test User",
      email: "test@example.com",
      emailVerified: true,
      banned: null,
      image: null,
      createdAt: now,
      updatedAt: now,
    },
  }
}

describe("getSessionResult", () => {
  it("returns session payload on success", async () => {
    const mockSession = createMockSession()
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession)

    const result = await getSessionResult(new Headers())

    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual({
      user: {
        id: mockSession.user.id,
        name: mockSession.user.name,
        email: mockSession.user.email,
        image: mockSession.user.image,
        role: undefined,
        emailVerified: mockSession.user.emailVerified,
      },
    })
  })

  it("returns null session and user when provider returns null", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)

    const result = await getSessionResult(new Headers())

    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual({
      user: null,
    })
  })

  it("returns auth_provider_failure when provider throws", async () => {
    vi.mocked(auth.api.getSession).mockRejectedValue(new Error("network"))

    const result = await getSessionResult(new Headers())

    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toMatchObject({
      code: "internal_error:auth",
      message: "Auth provider request failed",
    })
  })
})

describe("requireSessionResult", () => {
  it("returns session when authenticated", async () => {
    const mockSession = createMockSession()
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession)

    const result = await requireSessionResult(new Headers())

    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual(mockSession)
  })

  it("returns unauthorized when session is null", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)

    const result = await requireSessionResult(new Headers())

    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toMatchObject({
      code: "unauthorized:auth",
      message: "Unauthorized",
    })
  })

  it("returns auth_provider_failure when provider throws", async () => {
    vi.mocked(auth.api.getSession).mockRejectedValue(new Error("fail"))

    const result = await requireSessionResult(new Headers())

    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr().code).toBe("internal_error:auth")
  })
})
