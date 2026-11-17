import { NextResponse } from "next/server"
import {
  attachSessionCookie,
  clearSessionCookie,
  getSessionFromRequest,
  hashPassword,
  signSessionToken,
  verifyPassword,
} from "@/lib/auth"
import { ensureKreatrDatabaseSeeded } from "@/lib/kreatrService"
import KreatrUser from "@/models/KreatrUser"

export async function GET(request: Request) {
  const session = getSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
  return NextResponse.json({ user: session })
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      mode: "login" | "register" | "logout"
      role?: "business" | "creator"
      email?: string
      password?: string
      name?: string
      handle?: string
      location?: string
      companyCategory?: string
      skills?: string[]
      startingRateNgn?: number
      walletAddress?: string
      bankName?: string
    }

    if (body.mode === "logout") {
      const res = NextResponse.json({ status: "logged_out" })
      return clearSessionCookie(res)
    }

    const connected = await ensureKreatrDatabaseSeeded()
    if (!connected) {
      return NextResponse.json(
        { message: "Database connection unavailable. Check MONGODB_URI in .env.local." },
        { status: 503 }
      )
    }

    const cleanEmail = (body.email || "").trim().toLowerCase()
    if (!cleanEmail) {
      return NextResponse.json(
        { message: "Email address is required." },
        { status: 400 }
      )
    }

    if (body.mode === "login") {
      const user = await KreatrUser.findOne({ email: cleanEmail })

      if (!user) {
        return NextResponse.json(
          { message: "No account found with that email address." },
          { status: 401 }
        )
      }

      if (body.role && user.role !== body.role) {
        return NextResponse.json(
          {
            message: `This email belongs to a ${user.role.toUpperCase()} account. Please switch the tab above to sign in.`,
          },
          { status: 403 }
        )
      }

      if (!body.password || !verifyPassword(body.password, user.passwordHash)) {
        return NextResponse.json(
          { message: "Incorrect password. Please try again." },
          { status: 401 }
        )
      }

      // Transparently upgrade any legacy un-hashed password to scrypt hash in MongoDB
      if (!user.passwordHash.startsWith("scrypt:")) {
        user.passwordHash = hashPassword(body.password)
        await user.save()
      }

      const sessionUser = {
        userId: user.userId,
        role: user.role,
        name: user.name,
        handle: user.handle,
        email: user.email,
        location: user.location,
        avatar: user.avatar,
      }

      const token = signSessionToken(sessionUser)
      const res = NextResponse.json({ user: sessionUser, token })
      return attachSessionCookie(res, token)
    }

    // Registration mode — saves strictly to MongoDB Atlas with salted scrypt hash
    if (!body.password || body.password.length < 4) {
      return NextResponse.json(
        { message: "Password must be at least 4 characters." },
        { status: 400 }
      )
    }

    const existing = await KreatrUser.findOne({ email: cleanEmail }).lean()
    if (existing) {
      return NextResponse.json(
        { message: "An account with this email already exists. Please sign in." },
        { status: 409 }
      )
    }

    const targetRole = body.role === "business" ? "business" : "creator"
    const userId = `${targetRole === "business" ? "biz" : "cr"}-${Date.now()}`
    const name = body.name?.trim()
    if (!name) {
      return NextResponse.json(
        { message: "Name is required." },
        { status: 400 }
      )
    }

    const rawHandle =
      body.handle?.trim() ||
      `@${name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12)}`
    const handle = rawHandle.startsWith("@") ? rawHandle : `@${rawHandle}`

    const created = await KreatrUser.create({
      userId,
      role: targetRole,
      name,
      handle,
      email: cleanEmail,
      passwordHash: hashPassword(body.password),
      avatar:
        targetRole === "business"
          ? "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio:
        targetRole === "business"
          ? `${name} — Verified Local Business on KreatrDesk`
          : `Local UGC Creator & Community Ambassador in ${body.location || "Lagos"}`,
      location: body.location || "Lagos (Yaba / Lekki)",
      companyCategory: body.companyCategory || "Food & Beverage",
      verified: true,
      languages: ["English", "Nigerian Pidgin"],
      categories: [body.companyCategory || "Food & Beverage"],
      skills: body.skills?.length
        ? body.skills
        : ["UGC Video Production", "Direct-Response Hooks"],
      services: ["60s Vertical UGC Video"],
      startingRateNgn: Number(body.startingRateNgn) || 80000,
      walletAddress:
        body.walletAddress || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      bankName: body.bankName || "GTBank (via Roqqu Settle)",
      completedProjectsCount: 0,
      totalEarnedNgn: 0,
      credibility: {
        creativeAbility: 90,
        audienceInfluence: 72,
        communityActivation: 86,
        deliveryReliability: 96,
        campaignPerformance: 90,
      },
    })

    const sessionUser = {
      userId: created.userId,
      role: created.role,
      name: created.name,
      handle: created.handle,
      email: created.email,
      location: created.location,
      avatar: created.avatar,
    }

    const token = signSessionToken(sessionUser)
    const res = NextResponse.json({ user: sessionUser, token }, { status: 201 })
    return attachSessionCookie(res, token)
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Authentication failed" },
      { status: 500 }
    )
  }
}
