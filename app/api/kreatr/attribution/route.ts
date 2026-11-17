import { NextResponse } from "next/server"
import { ensureKreatrDatabaseSeeded } from "@/lib/kreatrService"
import KreatrProject from "@/models/KreatrProject"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      referralCode: string
      eventType: "CLICK" | "ENQUIRY" | "REDEMPTION" | "CONVERSION"
      customerLabel?: string
      location?: string
      amountNgn?: number
    }

    const connected = await ensureKreatrDatabaseSeeded()
    if (!connected) {
      return NextResponse.json({ message: "Database unavailable." }, { status: 503 })
    }

    const code = (body.referralCode || "").trim().toUpperCase()
    const orderAmount = Number(body.amountNgn) || 24000

    const dbProj = await KreatrProject.findOne({ "attribution.referralCode": code })
    if (!dbProj || !dbProj.attribution) {
      return NextResponse.json({ message: "Referral code not found in DB." }, { status: 404 })
    }

    const newEvent = {
      id: `ev-${Date.now()}`,
      type: body.eventType,
      customerLabel:
        body.customerLabel?.trim() ||
        (body.eventType === "CONVERSION"
          ? "Verified Customer Order (12-Can Case)"
          : body.eventType === "ENQUIRY"
            ? "WhatsApp Product Enquiry via Creator Link"
            : "Customer Redeemed Creator Referral Code"),
      location: body.location?.trim() || "Lagos, Nigeria",
      amountNgn:
        body.eventType === "CONVERSION" || body.eventType === "REDEMPTION"
          ? orderAmount
          : undefined,
      timestamp: new Date().toISOString(),
    }

    const attr = { ...dbProj.attribution }
    if (body.eventType === "CLICK") attr.clicks += 1
    else if (body.eventType === "ENQUIRY") {
      attr.clicks += 1
      attr.enquiries += 1
    } else if (body.eventType === "REDEMPTION") {
      attr.clicks += 1
      attr.redemptions += 1
    } else if (body.eventType === "CONVERSION") {
      attr.clicks += 1
      attr.redemptions += 1
      attr.confirmedConversions += 1
      attr.revenueGeneratedNgn += orderAmount
    }
    attr.recentEvents = [newEvent, ...(attr.recentEvents || [])].slice(0, 12)
    dbProj.attribution = attr
    dbProj.markModified("attribution")
    await dbProj.save()

    return NextResponse.json({ status: "recorded", attribution: attr })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to record attribution event" },
      { status: 500 }
    )
  }
}
