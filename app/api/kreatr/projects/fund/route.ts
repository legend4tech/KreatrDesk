import { NextResponse } from "next/server"
import { requireApiRole } from "@/lib/auth"
import { ensureKreatrDatabaseSeeded } from "@/lib/kreatrService"
import { creditPotFromRoqqu } from "@/lib/relayer"
import KreatrProject from "@/models/KreatrProject"

export async function POST(request: Request) {
  try {
    const auth = requireApiRole(request, ["business"])
    if (auth.errorResponse) return auth.errorResponse

    const body = (await request.json()) as {
      projectId: string
      rail: "roqqu_fiat" | "web3_direct"
      paymentReference?: string
      txHash?: `0x${string}`
      amountUsdc?: number
    }

    const connected = await ensureKreatrDatabaseSeeded()
    if (!connected) {
      return NextResponse.json({ message: "Database unavailable." }, { status: 503 })
    }

    const dbProj = await KreatrProject.findOne({ projectId: body.projectId })
    if (!dbProj) {
      return NextResponse.json({ message: "Project not found in DB." }, { status: 404 })
    }

    if (dbProj.status !== "AWAITING_FUNDING") {
      return NextResponse.json(
        { message: "Escrow is already funded for this project." },
        { status: 409 }
      )
    }

    const paymentReference =
      body.paymentReference?.trim() ||
      `KD-${body.rail === "roqqu_fiat" ? "ROQ" : "W3"}-${Date.now().toString(36).toUpperCase()}`

    let finalTxHash: `0x${string}` = body.txHash || ("0x" as `0x${string}`)

    if (!body.txHash || body.txHash.length < 10) {
      const relayed = await creditPotFromRoqqu({
        paymentReference,
        communityId: dbProj.onChainVaultId,
        amountUsdc: body.amountUsdc || dbProj.agreedBudgetUsdc,
        contributorTag: `${dbProj.businessName} -> ${dbProj.creatorHandle} Escrow`,
      })
      finalTxHash = relayed.txHash
    }

    const fundingObj = {
      rail: body.rail,
      paymentReference,
      txHash: finalTxHash,
      fundedAt: new Date().toISOString(),
      verifiedByBackend: true,
    }

    const logEntry = {
      id: `act-${Date.now()}`,
      actor:
        body.rail === "roqqu_fiat"
          ? `${dbProj.businessName} (via Roqqu NGN Fiat Rail)`
          : `${dbProj.businessName} (via Base Sepolia USDC Wallet)`,
      action: `Locked ₦${dbProj.agreedBudgetNgn.toLocaleString()} (${dbProj.agreedBudgetUsdc.toFixed(2)} USDC) in KreatrDesk Escrow Vault #${dbProj.onChainVaultId}`,
      timestamp: new Date().toISOString(),
      txHash: finalTxHash,
    }

    dbProj.status = "ESCROW_FUNDED"
    dbProj.escrowFunding = fundingObj
    dbProj.activityLog = [logEntry, ...(dbProj.activityLog || [])]
    dbProj.markModified("escrowFunding")
    dbProj.markModified("activityLog")
    await dbProj.save()

    return NextResponse.json({
      txHash: finalTxHash,
      paymentReference,
    })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Escrow funding verification failed" },
      { status: 500 }
    )
  }
}
