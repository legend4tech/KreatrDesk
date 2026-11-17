import { NextResponse } from "next/server"
import { requireApiRole } from "@/lib/auth"
import { ensureKreatrDatabaseSeeded } from "@/lib/kreatrService"
import KreatrUser from "@/models/KreatrUser"
import PortfolioItem from "@/models/PortfolioItem"
import type { PortfolioSample } from "@/types"

export async function POST(request: Request) {
  try {
    const auth = requireApiRole(request, ["creator"])
    if (auth.errorResponse) return auth.errorResponse

    const body = (await request.json()) as {
      creatorId?: string
      title: string
      description: string
      mediaType: "video" | "image"
      mediaUrl: string
      thumbnailUrl?: string
      category: string
      skills: string[]
      brandTag?: string
      turnaroundDays?: number
      rateNgn: number
    }

    if (!body.title || !body.mediaUrl) {
      return NextResponse.json(
        { message: "Title and media URL are required." },
        { status: 400 }
      )
    }

    const connected = await ensureKreatrDatabaseSeeded()
    if (!connected) {
      return NextResponse.json({ message: "Database unavailable." }, { status: 503 })
    }

    const dbCreator =
      (await KreatrUser.findOne({ userId: auth.session.userId }).lean()) ||
      (await KreatrUser.findOne({ userId: body.creatorId }).lean())

    if (!dbCreator) {
      return NextResponse.json({ message: "Creator account not found in DB." }, { status: 404 })
    }

    const sampleId = `pf-${Date.now()}`
    const createdDoc = await PortfolioItem.create({
      sampleId,
      creatorId: dbCreator.userId,
      creatorName: dbCreator.name,
      creatorHandle: dbCreator.handle,
      creatorAvatar: dbCreator.avatar,
      creatorLocation: dbCreator.location,
      title: body.title.trim(),
      description:
        body.description?.trim() || "High-converting local UGC production sample.",
      mediaType: body.mediaType || "video",
      mediaUrl: body.mediaUrl.trim(),
      thumbnailUrl:
        body.thumbnailUrl?.trim() ||
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
      category: body.category || "Skincare & Beauty",
      skills: body.skills?.length
        ? body.skills
        : ["UGC Video Production", "Direct-Response Hooks"],
      brandTag: body.brandTag?.trim() || "Brand Sample",
      turnaroundDays: Number(body.turnaroundDays) || 3,
      rateNgn: Number(body.rateNgn) || 85000,
      credibility: dbCreator.credibility,
    })

    const sample: PortfolioSample = {
      id: createdDoc.sampleId,
      creatorId: createdDoc.creatorId,
      creatorName: createdDoc.creatorName,
      creatorHandle: createdDoc.creatorHandle,
      creatorAvatar: createdDoc.creatorAvatar,
      creatorLocation: createdDoc.creatorLocation,
      title: createdDoc.title,
      description: createdDoc.description,
      mediaType: createdDoc.mediaType,
      mediaUrl: createdDoc.mediaUrl,
      thumbnailUrl: createdDoc.thumbnailUrl,
      category: createdDoc.category,
      skills: createdDoc.skills,
      brandTag: createdDoc.brandTag,
      turnaroundDays: createdDoc.turnaroundDays,
      rateNgn: createdDoc.rateNgn,
      credibility: createdDoc.credibility,
      createdAt: createdDoc.createdAt.toISOString(),
    }

    return NextResponse.json(sample, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to publish portfolio sample" },
      { status: 500 }
    )
  }
}
