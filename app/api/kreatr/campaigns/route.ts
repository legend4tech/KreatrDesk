import { NextResponse } from "next/server"
import { requireApiRole } from "@/lib/auth"
import { ensureKreatrDatabaseSeeded } from "@/lib/kreatrService"
import KreatrCampaign from "@/models/KreatrCampaign"
import KreatrUser from "@/models/KreatrUser"

export async function POST(request: Request) {
  try {
    const auth = requireApiRole(request, ["business"])
    if (auth.errorResponse) return auth.errorResponse

    const body = (await request.json()) as {
      businessId?: string
      businessName?: string
      businessCategory?: string
      businessLocation?: string
      title: string
      summary: string
      briefRequirements: string[]
      deliverables: string[]
      budgetPerCreatorNgn: number
      ngnPerUsd?: number
      creatorsNeeded: number
      deadline: string
      locations: string[]
      requiredSkills: string[]
      minCreativeScore?: number
      minReliabilityScore?: number
    }

    if (!body.title || !body.summary || !body.budgetPerCreatorNgn) {
      return NextResponse.json(
        { message: "Campaign title, summary, and budget are required." },
        { status: 400 }
      )
    }

    const connected = await ensureKreatrDatabaseSeeded()
    if (!connected) {
      return NextResponse.json({ message: "Database unavailable." }, { status: 503 })
    }

    const dbBusiness = await KreatrUser.findOne({ userId: auth.session.userId }).lean()

    const ngnPerUsd = Number(body.ngnPerUsd) || 1375
    const budgetNgn = Number(body.budgetPerCreatorNgn)
    const creatorsNeeded = Math.max(1, Number(body.creatorsNeeded) || 2)
    const budgetUsdc = Math.round((budgetNgn / ngnPerUsd) * 100) / 100
    const vaultCount = await KreatrCampaign.countDocuments()

    const created = await KreatrCampaign.create({
      campaignId: `camp-${Date.now()}`,
      businessId: dbBusiness?.userId || auth.session.userId,
      businessName: body.businessName?.trim() || dbBusiness?.name || auth.session.name,
      businessCategory:
        body.businessCategory?.trim() || dbBusiness?.companyCategory || "Food & Beverage",
      businessLocation: body.businessLocation?.trim() || dbBusiness?.location || "Lagos, Nigeria",
      businessVerified: true,
      title: body.title.trim(),
      summary: body.summary.trim(),
      briefRequirements:
        body.briefRequirements?.filter(Boolean).length > 0
          ? body.briefRequirements.filter(Boolean)
          : [
              "Show product clearly in the first 3 seconds",
              "Demonstrate real-world product usage in natural lighting",
              "Call out unique referral code in audio and captions",
            ],
      deliverables:
        body.deliverables?.filter(Boolean).length > 0
          ? body.deliverables.filter(Boolean)
          : ["1x 45-60s Vertical UGC Video (9:16 MP4)", "Share tracking link in bio/community"],
      budgetPerCreatorNgn: budgetNgn,
      budgetPerCreatorUsdc: budgetUsdc,
      totalBudgetNgn: budgetNgn * creatorsNeeded,
      deadline: body.deadline || "2026-12-10",
      status: "OPEN",
      eligibility: {
        locations: body.locations?.length ? body.locations : ["Lagos (Yaba / Lekki)"],
        requiredSkills: body.requiredSkills?.length
          ? body.requiredSkills
          : ["UGC Video Production", "Direct-Response Hooks"],
        minCreativeScore: Number(body.minCreativeScore) || 80,
        minReliabilityScore: Number(body.minReliabilityScore) || 85,
        creatorsNeeded,
        creatorTypes: ["UGC Producer", "Community Ambassador"],
      },
      applicantsCount: 0,
      selectedCreatorsCount: 0,
      onChainVaultId: (vaultCount % 2) + 1,
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create campaign" },
      { status: 500 }
    )
  }
}
