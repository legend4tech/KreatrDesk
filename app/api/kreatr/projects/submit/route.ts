import { NextResponse } from "next/server"
import { requireApiRole } from "@/lib/auth"
import {
  ensureKreatrDatabaseSeeded,
  evaluateSubmissionAgainstBrief,
} from "@/lib/kreatrService"
import KreatrProject from "@/models/KreatrProject"

export async function POST(request: Request) {
  try {
    const auth = requireApiRole(request, ["creator"])
    if (auth.errorResponse) return auth.errorResponse

    const body = (await request.json()) as {
      projectId: string
      mediaType: "video" | "image"
      mediaUrl: string
      captionNotes: string
      keyTimestamps: string
    }

    const connected = await ensureKreatrDatabaseSeeded()
    if (!connected) {
      return NextResponse.json({ message: "Database unavailable." }, { status: 503 })
    }

    const dbProj = await KreatrProject.findOne({ projectId: body.projectId })
    if (!dbProj) {
      return NextResponse.json({ message: "Project not found in DB." }, { status: 404 })
    }

    if (dbProj.status === "AWAITING_FUNDING") {
      return NextResponse.json(
        { message: "Escrow must be funded and backend-verified before submitting deliverables." },
        { status: 400 }
      )
    }

    if (dbProj.status === "APPROVED_AND_RELEASED") {
      return NextResponse.json(
        { message: "This project is already completed and paid." },
        { status: 409 }
      )
    }

    const aiEvaluation = evaluateSubmissionAgainstBrief({
      campaignTitle: dbProj.campaignTitle,
      briefRequirements: dbProj.briefRequirements,
      captionNotes: body.captionNotes || "",
      keyTimestamps: body.keyTimestamps || "0:01 - 0:45",
      mediaType: body.mediaType || "video",
    })

    const submissionObj = {
      id: `sub-${Date.now()}`,
      mediaType: body.mediaType || "video",
      mediaUrl: body.mediaUrl.trim(),
      captionNotes: body.captionNotes.trim(),
      keyTimestamps: body.keyTimestamps.trim(),
      submittedAt: new Date().toISOString(),
      aiEvaluation,
    }

    const logAi = {
      id: `act-ai-${Date.now()}`,
      actor: "KreatrDesk AI Content Evaluator",
      action: `Evaluated submission against brief: ${aiEvaluation.overallScore}/100 (${aiEvaluation.recommendation})`,
      timestamp: new Date().toISOString(),
    }

    const logSub = {
      id: `act-sub-${Date.now() - 1}`,
      actor: `${dbProj.creatorName} (${dbProj.creatorHandle})`,
      action: "Uploaded campaign deliverable for AI & Business review",
      timestamp: new Date().toISOString(),
    }

    dbProj.submission = submissionObj
    dbProj.status = "AI_EVALUATED"
    dbProj.activityLog = [logAi, logSub, ...(dbProj.activityLog || [])]
    dbProj.markModified("submission")
    dbProj.markModified("activityLog")
    await dbProj.save()

    return NextResponse.json({ aiEvaluation })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to submit deliverable" },
      { status: 500 }
    )
  }
}
