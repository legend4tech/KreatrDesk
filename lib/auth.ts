import crypto from "node:crypto"
import { NextResponse } from "next/server"
import type { UserRole } from "@/types"

export const SESSION_COOKIE_NAME = "kreatr_session"
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

export interface SessionPayload {
  userId: string
  role: UserRole
  name: string
  handle: string
  email: string
  location: string
  avatar?: string
  exp: number
}

function getAuthSecret(): string {
  return (
    process.env.AUTH_SECRET?.trim() ||
    process.env.RELAYER_PRIVATE_KEY?.trim() ||
    "kreatrdesk-production-hmac-secret-key-2026"
  )
}

/**
 * Hashes a plain-text password using Node's native salted scrypt.
 * Format: "scrypt:<saltHex>:<hashHex>"
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex")
  const derived = crypto.scryptSync(password, salt, 64).toString("hex")
  return `scrypt:${salt}:${derived}`
}

/**
 * Verifies a password against a stored scrypt hash using constant-time comparison.
 * Also supports migrating legacy plain-text seeded passwords transparently.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false

  if (storedHash.startsWith("scrypt:")) {
    const parts = storedHash.split(":")
    if (parts.length !== 3) return false
    const [, salt, hashHex] = parts
    const derived = crypto.scryptSync(password, salt, 64)
    const expected = Buffer.from(hashHex, "hex")
    if (derived.length !== expected.length) return false
    return crypto.timingSafeEqual(derived, expected)
  }

  // Fallback for legacy un-hashed seed string (exact constant-time check)
  const a = Buffer.from(password, "utf8")
  const b = Buffer.from(storedHash, "utf8")
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

/**
 * Signs a session payload with HMAC-SHA256.
 */
export function signSessionToken(
  user: Omit<SessionPayload, "exp">,
  ttlSeconds = SESSION_TTL_SECONDS
): string {
  const payload: SessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  }
  const dataB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url")
  const sigB64 = crypto
    .createHmac("sha256", getAuthSecret())
    .update(dataB64)
    .digest("base64url")
  return `${dataB64}.${sigB64}`
}

/**
 * Verifies a signed HMAC-SHA256 session token and checks expiration.
 */
export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token || !token.includes(".")) return null
  const [dataB64, sigB64] = token.split(".")
  if (!dataB64 || !sigB64) return null

  const expectedSigB64 = crypto
    .createHmac("sha256", getAuthSecret())
    .update(dataB64)
    .digest("base64url")

  const sigBuf = Buffer.from(sigB64, "utf8")
  const expectedBuf = Buffer.from(expectedSigB64, "utf8")
  if (sigBuf.length !== expectedBuf.length) return null
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null

  try {
    const payload = JSON.parse(
      Buffer.from(dataB64, "base64url").toString("utf8")
    ) as SessionPayload
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

/**
 * Extracts and verifies the session from a standard Fetch Request (Cookie or Authorization header).
 */
export function getSessionFromRequest(request: Request): SessionPayload | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim()
    const verified = verifySessionToken(token)
    if (verified) return verified
  }

  const cookieHeader = request.headers.get("cookie") || ""
  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => {
        const idx = c.indexOf("=")
        return idx > -1 ? [c.slice(0, idx), decodeURIComponent(c.slice(idx + 1))] : [c, ""]
      })
  )

  return verifySessionToken(cookies[SESSION_COOKIE_NAME])
}

/**
 * Enforces authentication and optional role authorization on an API route.
 */
export function requireApiRole(
  request: Request,
  allowedRoles?: UserRole[]
): { session: SessionPayload; errorResponse?: never } | { session?: never; errorResponse: NextResponse } {
  const session = getSessionFromRequest(request)
  if (!session) {
    return {
      errorResponse: NextResponse.json(
        { message: "Unauthorized: Please sign in first." },
        { status: 401 }
      ),
    }
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    return {
      errorResponse: NextResponse.json(
        {
          message: `Forbidden: This action requires a ${allowedRoles.join(" or ").toUpperCase()} account.`,
        },
        { status: 403 }
      ),
    }
  }

  return { session }
}

/**
 * Attaches the HttpOnly session cookie to a NextResponse.
 */
export function attachSessionCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
    secure: process.env.NODE_ENV === "production",
  })
  return res
}

/**
 * Clears the HttpOnly session cookie on logout.
 */
export function clearSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  return res
}
