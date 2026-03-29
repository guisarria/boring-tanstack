import { describe, expect, it, vi } from "vite-plus/test"

vi.mock("./auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
      listSessions: vi.fn(),
    },
  },
}))

import type { Session } from "../schema"
import { auth } from "./auth"
import {
  getSession,
  listSessions,
  requireAuthenticatedUser,
} from "./auth-service"

const now = new Date()

function createMockSession(): {
  session: Session["session"]
  user: Session["user"]
} {
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
      role: "user",
      createdAt: now,
      updatedAt: now,
    },
  }
}

describe("getSession", () => {
  it("returns session payload on success", async () => {
    const mockSession = createMockSession()
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession)

    const result = await getSession(new Headers())

    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual({
      user: {
        id: mockSession.user.id,
        name: mockSession.user.name,
        email: mockSession.user.email,
        image: mockSession.user.image,
        role: mockSession.user.role,
        emailVerified: mockSession.user.emailVerified,
      },
    })
  })

  it("returns null user when provider returns null", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)

    const result = await getSession(new Headers())

    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual({ user: null })
  })

  it("returns internal_error:auth when provider throws", async () => {
    vi.mocked(auth.api.getSession).mockRejectedValue(new Error("network"))

    const result = await getSession(new Headers())

    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toMatchObject({
      code: "internal_error:auth",
      message: "Auth provider request failed",
    })
  })
})

describe("requireAuthenticatedUser", () => {
  it("returns public user when authenticated", async () => {
    const mockSession = createMockSession()
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession)

    const result = await requireAuthenticatedUser(new Headers())

    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual({
      id: mockSession.user.id,
      name: mockSession.user.name,
      email: mockSession.user.email,
      image: mockSession.user.image,
      role: mockSession.user.role,
      emailVerified: mockSession.user.emailVerified,
    })
  })

  it("returns unauthorized:auth when session is null", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)

    const result = await requireAuthenticatedUser(new Headers())

    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toMatchObject({
      code: "unauthorized:auth",
      message: "Unauthorized",
    })
  })

  it("uses custom error code when provided", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)

    const result = await requireAuthenticatedUser(
      new Headers(),
      "unauthorized:chat",
    )

    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr().code).toBe("unauthorized:chat")
  })

  it("returns internal_error:auth when provider throws", async () => {
    vi.mocked(auth.api.getSession).mockRejectedValue(new Error("network"))

    const result = await requireAuthenticatedUser(new Headers())

    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr().code).toBe("internal_error:auth")
  })
})

describe("listSessions", () => {
  it("returns sessions and extracts sessionId from token", async () => {
    vi.mocked(auth.api.listSessions).mockResolvedValue([])

    const result = await listSessions(new Headers(), "abc123.signature")

    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual({
      sessions: [],
      sessionId: "abc123",
    })
  })

  it("returns the full token as sessionId when no dot is present", async () => {
    vi.mocked(auth.api.listSessions).mockResolvedValue([])

    const result = await listSessions(new Headers(), "nodottoken")

    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap().sessionId).toBe("nodottoken")
  })

  it("returns internal_error:auth when provider throws", async () => {
    vi.mocked(auth.api.listSessions).mockRejectedValue(new Error("network"))

    const result = await listSessions(new Headers(), "abc123.signature")

    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toMatchObject({
      code: "internal_error:auth",
      message: "Auth provider request failed",
    })
  })
})
