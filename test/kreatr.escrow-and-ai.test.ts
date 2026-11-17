import assert from "node:assert/strict"
import test from "node:test"
import mongoose from "mongoose"

import { POST as attributionPost } from "@/app/api/kreatr/attribution/route"
import { POST as fundPost } from "@/app/api/kreatr/projects/fund/route"
import { POST as releasePost } from "@/app/api/kreatr/projects/release/route"
import { POST as submitPost } from "@/app/api/kreatr/projects/submit/route"
import { signSessionToken } from "@/lib/auth"
import { ensureKreatrDatabaseSeeded } from "@/lib/kreatrService"
import KreatrProject from "@/models/KreatrProject"

const businessToken = signSessionToken({
  userId: "biz-zobocraft",
  role: "business",
  name: "ZoboCraft Beverages Ltd",
  handle: "@zobocraft.ng",
  email: "business@kreatrdesk.app",
  location: "Lagos, Nigeria",
})

const creatorToken = signSessionToken({
  userId: "cr-adaobi",
  role: "creator",
  name: "Adaobi Nnamdi",
  handle: "@adaobi.ugc",
  email: "creator@kreatrdesk.app",
  location: "Lagos (Yaba / Lekki)",
})

test("Full Escrow Guard -> Lock Payment -> AI Video Evaluation -> Release Payment -> Customer Sales Attribution Flow", async () => {
  const testProjectId = `proj-test-${Date.now()}`
  const testCode = `TESTCODE${Math.floor(100 + Math.random() * 899)}`

  try {
    await ensureKreatrDatabaseSeeded()

    await KreatrProject.create({
      projectId: testProjectId,
      campaignId: "camp-zobo-launch",
      campaignTitle: "Sparkling Hibiscus Can — Lagos UGC Drive",
      businessId: "biz-zobocraft",
      businessName: "ZoboCraft Beverages Ltd",
      creatorId: "cr-adaobi",
      creatorName: "Adaobi Nnamdi",
      creatorHandle: "@adaobi.ugc",
      creatorWallet: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      agreedBudgetNgn: 110000,
      agreedBudgetUsdc: 80,
      deliverables: ["1x 60s Vertical UGC Video"],
      briefRequirements: [
        "Show the chilled ZoboCraft can clearly within the first 3 seconds",
        "Capture pouring over ice in natural lighting",
        "Mention Zero Added Sugar clearly in audio and captions",
      ],
      deadline: "2026-12-15",
      status: "AWAITING_FUNDING",
      onChainVaultId: 1,
      attribution: {
        referralCode: testCode,
        referralLink: `/r/${testCode}`,
        clicks: 0,
        enquiries: 0,
        redemptions: 0,
        confirmedConversions: 0,
        revenueGeneratedNgn: 0,
        recentEvents: [],
      },
      activityLog: [],
      createdAtIso: new Date().toISOString(),
    })

    // 1. INVARIANT: Creator CANNOT submit video before Business locks payment in escrow
    const prematureSubmit = await submitPost(
      new Request("http://localhost:3000/api/kreatr/projects/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${creatorToken}`,
        },
        body: JSON.stringify({
          projectId: testProjectId,
          mediaType: "video",
          mediaUrl:
            "https://res.cloudinary.com/dyuyvwets/video/upload/v1794835027/kreatrdesk/kreatr_ugc_sample_1.mp4",
          captionNotes: "Trying to submit before escrow lock",
          keyTimestamps: "0:01 Hook",
        }),
      })
    )
    assert.equal(prematureSubmit.status, 400)

    // 2. Business locks payment in Escrow
    const fundRes = await fundPost(
      new Request("http://localhost:3000/api/kreatr/projects/fund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${businessToken}`,
        },
        body: JSON.stringify({
          projectId: testProjectId,
          rail: "roqqu_fiat",
          paymentReference: `TEST-REF-${Date.now()}`,
          txHash: "0x65eb23d2ae125a90b7cf976565e616d397031dd5df39d04edb758a7dc47f8b3d",
          amountUsdc: 80,
        }),
      })
    )
    assert.equal(fundRes.status, 200)

    // 3. Creator submits video -> AI Content Evaluator grades it against the brief
    const submitRes = await submitPost(
      new Request("http://localhost:3000/api/kreatr/projects/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${creatorToken}`,
        },
        body: JSON.stringify({
          projectId: testProjectId,
          mediaType: "video",
          mediaUrl:
            "https://res.cloudinary.com/dyuyvwets/video/upload/v1794835027/kreatrdesk/kreatr_ugc_sample_1.mp4",
          captionNotes:
            "Showed chilled ZoboCraft can at 0:01 hook, poured over ice in natural lighting at 0:05, and called out Zero Added Sugar in captions.",
          keyTimestamps: "0:01 Can Hook · 0:05 Ice Pour · 0:15 Zero Sugar",
        }),
      })
    )
    assert.equal(submitRes.status, 200)

    // 4. Business approves video and releases escrow payment
    const releaseRes = await releasePost(
      new Request("http://localhost:3000/api/kreatr/projects/release", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${businessToken}`,
        },
        body: JSON.stringify({
          projectId: testProjectId,
          action: "approve_release",
        }),
      })
    )
    assert.equal(releaseRes.status, 200)

    // 5. INVARIANT: Double-release replay attack is blocked with HTTP 409 Conflict
    const replayReleaseRes = await releasePost(
      new Request("http://localhost:3000/api/kreatr/projects/release", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${businessToken}`,
        },
        body: JSON.stringify({
          projectId: testProjectId,
          action: "approve_release",
        }),
      })
    )
    assert.equal(replayReleaseRes.status, 409, "Must reject double-release replay with 409")

    // 6. Smart Link Attribution
    await attributionPost(
      new Request("http://localhost:3000/api/kreatr/attribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralCode: testCode,
          eventType: "ENQUIRY",
          customerLabel: "Test Customer WhatsApp Question",
        }),
      })
    )

    const convRes = await attributionPost(
      new Request("http://localhost:3000/api/kreatr/attribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralCode: testCode,
          eventType: "CONVERSION",
          customerLabel: "Test Customer Paid Order",
          amountNgn: 24000,
        }),
      })
    )
    assert.equal(convRes.status, 200)

    const finalInDb = await KreatrProject.findOne({ projectId: testProjectId }).lean()
    assert.equal(finalInDb?.attribution.clicks, 2)
    assert.equal(finalInDb?.attribution.enquiries, 1)
    assert.equal(finalInDb?.attribution.redemptions, 1)
    assert.equal(finalInDb?.attribution.confirmedConversions, 1)
    assert.equal(finalInDb?.attribution.revenueGeneratedNgn, 24000)
  } finally {
    await KreatrProject.deleteOne({ projectId: testProjectId })
  }
})

test.after(async () => {
  await mongoose.disconnect()
})
