import { NextResponse } from "next/server"
import { requireApiRole } from "@/lib/auth"
import { ensureKreatrDatabaseSeeded } from "@/lib/kreatrService"
import KreatrApplication from "@/models/KreatrApplication"
import KreatrCampaign from "@/models/KreatrCampaign"
import KreatrProject from "@/models/KreatrProject"
import KreatrUser from "@/models/KreatrUser"
import PortfolioItem from "@/models/PortfolioItem"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      action: "apply" | "select"
      campaignId?: string
      creatorId?: string
      pitch?: string
      samplePortfolioId?: string
      proposedRateNgn?: number
      applicationId?: string
      ngnPerUsd?: number
    }

    const connected = await ensureKreatrDatabaseSeeded()
    if (!connected) {
      return NextResponse.json({ message: "Database unavailable." }, { status: 503 })
    }

    if (body.action === "apply") {
      const auth = requireApiRole(request, ["creator"])
      if (auth.errorResponse) return auth.errorResponse

      const dbCamp = await KreatrCampaign.findOne({ campaignId: body.campaignId }).lean()
      if (!dbCamp) {
        return NextResponse.json({ message: "Campaign not found in DB." }, { status: 404 })
      }

      const dbCreator =
        (await KreatrUser.findOne({ userId: auth.session.userId }).lean()) ||
        (await KreatrUser.findOne({ userId: body.creatorId }).lean())

      if (!dbCreator) {
        return NextResponse.json({ message: "Creator not found in DB." }, { status: 404 })
      }

      const dup = await KreatrApplication.findOne({
        campaignId: dbCamp.campaignId,
        creatorId: dbCreator.userId,
      }).lean()

      if (dup) {
        return NextResponse.json(
          { message: "You have already applied to this campaign.", application: dup },
          { status: 200 }
        )
      }

      const dbSample = await PortfolioItem.findOne({ creatorId: dbCreator.userId }).lean()

      const skillMatches = dbCamp.eligibility.requiredSkills.filter((sk: string) =>
        dbCreator.skills.includes(sk)
      ).length
      const skillRatio =
        dbCamp.eligibility.requiredSkills.length > 0
          ? skillMatches / dbCamp.eligibility.requiredSkills.length
          : 1

      const matchScore = Math.min(
        99,
        Math.round(
          dbCreator.credibility.creativeAbility * 0.35 +
            dbCreator.credibility.deliveryReliability * 0.25 +
            dbCreator.credibility.communityActivation * 0.2 +
            skillRatio * 20
        )
      )

      const createdApp = await KreatrApplication.create({
        applicationId: `app-${Date.now()}`,
        campaignId: dbCamp.campaignId,
        campaignTitle: dbCamp.title,
        creatorId: dbCreator.userId,
        creatorName: dbCreator.name,
        creatorHandle: dbCreator.handle,
        creatorLocation: dbCreator.location,
        creatorSkills: dbCreator.skills,
        creatorCredibility: dbCreator.credibility,
        pitch:
          body.pitch?.trim() ||
          "Ready to shoot 4K vertical UGC deliverables and activate local referrals as soon as escrow is locked.",
        samplePortfolioId: dbSample?.sampleId || "pf-1",
        sampleTitle: dbSample?.title || "UGC Portfolio Sample",
        proposedRateNgn: Number(body.proposedRateNgn) || dbCamp.budgetPerCreatorNgn,
        matchScore,
        status: "PENDING",
        appliedAt: new Date().toISOString(),
      })

      await KreatrCampaign.updateOne(
        { campaignId: dbCamp.campaignId },
        { $inc: { applicantsCount: 1 } }
      )

      return NextResponse.json(createdApp, { status: 201 })
    }

    if (body.action === "select") {
      const auth = requireApiRole(request, ["business"])
      if (auth.errorResponse) return auth.errorResponse

      const dbApp = await KreatrApplication.findOneAndUpdate(
        { applicationId: body.applicationId },
        { $set: { status: "SELECTED" } },
        { returnDocument: "after" }
      ).lean()

      if (!dbApp) {
        return NextResponse.json({ message: "Application not found in DB." }, { status: 404 })
      }

      const existingProj = await KreatrProject.findOne({
        campaignId: dbApp.campaignId,
        creatorId: dbApp.creatorId,
      }).lean()

      if (existingProj) {
        return NextResponse.json({ application: dbApp, project: existingProj })
      }

      const dbCamp = await KreatrCampaign.findOneAndUpdate(
        { campaignId: dbApp.campaignId },
        { $inc: { selectedCreatorsCount: 1 }, $set: { status: "IN_PROGRESS" } },
        { returnDocument: "after" }
      ).lean()

      const dbCreator = await KreatrUser.findOne({ userId: dbApp.creatorId }).lean()

      const ngnPerUsd = Number(body.ngnPerUsd) || 1375
      const agreedNgn = dbApp.proposedRateNgn || dbCamp?.budgetPerCreatorNgn || 110000
      const agreedUsdc = Math.round((agreedNgn / ngnPerUsd) * 100) / 100
      const cleanHandle = dbApp.creatorName
        .split(" ")[0]
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
      const referralCode = `${cleanHandle}${Math.floor(10 + Math.random() * 89)}`

      const createdProj = await KreatrProject.create({
        projectId: `proj-${Date.now()}`,
        campaignId: dbApp.campaignId,
        campaignTitle: dbApp.campaignTitle,
        businessId: dbCamp?.businessId || auth.session.userId,
        businessName: dbCamp?.businessName || auth.session.name,
        creatorId: dbApp.creatorId,
        creatorName: dbApp.creatorName,
        creatorHandle: dbApp.creatorHandle,
        creatorWallet:
          dbCreator?.walletAddress || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        agreedBudgetNgn: agreedNgn,
        agreedBudgetUsdc: agreedUsdc,
        deliverables: dbCamp?.deliverables || ["1x 45-60s Vertical UGC Video (9:16 MP4)"],
        briefRequirements: dbCamp?.briefRequirements || [
          "Show product clearly in the first 3 seconds",
          "Include unique referral code in captions and audio",
        ],
        deadline: dbCamp?.deadline || "2026-12-05",
        status: "AWAITING_FUNDING",
        onChainVaultId: dbCamp?.onChainVaultId || 1,
        attribution: {
          referralCode,
          referralLink: `/r/${referralCode}`,
          clicks: 1,
          enquiries: 0,
          redemptions: 0,
          confirmedConversions: 0,
          revenueGeneratedNgn: 0,
          recentEvents: [
            {
              id: `ev-${Date.now()}`,
              type: "CLICK",
              customerLabel: "Attribution link minted in MongoDB",
              location: dbApp.creatorLocation,
              timestamp: new Date().toISOString(),
            },
          ],
        },
        activityLog: [
          {
            id: `act-${Date.now()}`,
            actor: dbCamp?.businessName || auth.session.name,
            action: `Selected ${dbApp.creatorHandle} (Match Score: ${dbApp.matchScore}%) and initialized Project Workspace`,
            timestamp: new Date().toISOString(),
          },
        ],
        createdAtIso: new Date().toISOString(),
      })

      return NextResponse.json({ application: dbApp, project: createdProj })
    }

    return NextResponse.json({ message: "Unsupported action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to process application" },
      { status: 500 }
    )
  }
}
