import { NextResponse } from "next/server"
import { requireApiRole } from "@/lib/auth"
import { ensureKreatrDatabaseSeeded } from "@/lib/kreatrService"
import { deriveDeterministicDemoHash } from "@/lib/relayer"
import KreatrProject from "@/models/KreatrProject"
import KreatrUser from "@/models/KreatrUser"

export async function POST(request: Request) {
  try {
    const auth = requireApiRole(request, ["business"])
    if (auth.errorResponse) return auth.errorResponse

    const body = (await request.json()) as {
      projectId: string
      action: "approve_release" | "request_revision"
      settlementRail?: string
      feedback?: string
      txHash?: `0x${string}`
    }

    const connected = await ensureKreatrDatabaseSeeded()
    if (!connected) {
      return NextResponse.json({ message: "Database unavailable." }, { status: 503 })
    }

    const dbProj = await KreatrProject.findOne({ projectId: body.projectId })
    if (!dbProj) {
      return NextResponse.json({ message: "Project not found in DB." }, { status: 404 })
    }

    // Prevent Double-Release / Replay Vulnerability
    if (dbProj.status === "APPROVED_AND_RELEASED") {
      return NextResponse.json(
        { message: "Conflict: Escrow payment has already been released for this project." },
        { status: 409 }
      )
    }

    if (dbProj.status === "AWAITING_FUNDING") {
      return NextResponse.json(
        { message: "Cannot release payment for an unfunded escrow project." },
        { status: 400 }
      )
    }

    if (body.action === "request_revision") {
      const feedbackMsg =
        body.feedback?.trim() || "Please emphasize the referral code earlier in the video."
      const revLog = {
        id: `act-${Date.now()}`,
        actor: dbProj.businessName,
        action: `Requested deliverable revision: "${feedbackMsg}"`,
        timestamp: new Date().toISOString(),
      }

      dbProj.status = "REVISION_REQUESTED"
      if (dbProj.submission) {
        dbProj.submission = { ...dbProj.submission, businessFeedback: feedbackMsg }
        dbProj.markModified("submission")
      }
      dbProj.activityLog = [revLog, ...(dbProj.activityLog || [])]
      dbProj.markModified("activityLog")
      await dbProj.save()

      return NextResponse.json({ status: "REVISION_REQUESTED" })
    }

    const releaseTxHash: `0x${string}` =
      body.txHash ||
      deriveDeterministicDemoHash(`RELEASE:${dbProj.campaignId}:${Date.now()}`)

    const receiptId = `KDR-${Date.now().toString(36).toUpperCase()}`
    const rail =
      body.settlementRail || "Roqqu Instant NGN Bank Settlement + Base Sepolia Proof"

    const releaseObj = {
      txHash: releaseTxHash,
      releasedAt: new Date().toISOString(),
      settlementRail: rail,
      receiptId,
    }

    const releaseLog = {
      id: `act-${Date.now()}`,
      actor: `${dbProj.businessName} -> KreatrDesk Escrow Vault #${dbProj.onChainVaultId}`,
      action: `Approved deliverables & released ₦${dbProj.agreedBudgetNgn.toLocaleString()} (${dbProj.agreedBudgetUsdc.toFixed(2)} USDC) to ${dbProj.creatorHandle} (${rail})`,
      timestamp: new Date().toISOString(),
      txHash: releaseTxHash,
    }

    dbProj.status = "APPROVED_AND_RELEASED"
    dbProj.escrowRelease = releaseObj
    dbProj.activityLog = [releaseLog, ...(dbProj.activityLog || [])]
    dbProj.markModified("escrowRelease")
    dbProj.markModified("activityLog")
    await dbProj.save()

    await KreatrUser.updateOne(
      { userId: dbProj.creatorId },
      {
        $inc: {
          completedProjectsCount: 1,
          totalEarnedNgn: dbProj.agreedBudgetNgn,
        },
      }
    )

    return NextResponse.json({
      txHash: releaseTxHash,
      receiptId,
    })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to release escrow" },
      { status: 500 }
    )
  }
}
