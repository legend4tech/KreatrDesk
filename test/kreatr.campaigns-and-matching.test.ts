import assert from "node:assert/strict"
import test from "node:test"
import mongoose from "mongoose"

import { POST as applicationsPost } from "@/app/api/kreatr/applications/route"
import { POST as campaignsPost } from "@/app/api/kreatr/campaigns/route"
import { signSessionToken } from "@/lib/auth"
import KreatrApplication from "@/models/KreatrApplication"
import KreatrCampaign from "@/models/KreatrCampaign"
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

test("Full Campaign -> Creator Application -> Match Score -> Hire & Smart Link Flow", async () => {
  let campaignId = ""
  let applicationId = ""
  let projectId = ""

  try {
    const campReq = new Request("http://localhost:3000/api/kreatr/campaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${businessToken}`,
      },
      body: JSON.stringify({
        businessId: "biz-zobocraft",
        businessName: "ZoboCraft Beverages Ltd",
        title: "Automated Test Campaign: Ginger Shot Launch",
        summary: "Need 60s vertical UGC videos showing morning ginger shot routine.",
        budgetPerCreatorNgn: 137500,
        ngnPerUsd: 1375,
        creatorsNeeded: 2,
        deadline: "2026-12-20",
        briefRequirements: [
          "Show ginger shot bottle in first 3 seconds",
          "Mention 100% Cold-Pressed Ginger",
          "Display unique promo code on screen",
        ],
        requiredSkills: ["UGC Video Production", "Direct-Response Hooks"],
        locations: ["Lagos (Yaba / Lekki)"],
      }),
    })

    const campRes = await campaignsPost(campReq)
    assert.equal(campRes.status, 201)
    const campData = (await campRes.json()) as {
      campaignId: string
      budgetPerCreatorUsdc: number
    }
    campaignId = campData.campaignId
    assert.equal(campData.budgetPerCreatorUsdc, 100)

    const applyReq = new Request("http://localhost:3000/api/kreatr/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${creatorToken}`,
      },
      body: JSON.stringify({
        action: "apply",
        campaignId,
        creatorId: "cr-adaobi",
        pitch: "Ready to film in natural morning light with macro shots.",
        proposedRateNgn: 137500,
      }),
    })

    const applyRes = await applicationsPost(applyReq)
    assert.equal(applyRes.status, 201)
    const appData = (await applyRes.json()) as {
      applicationId: string
      matchScore: number
      status: string
    }
    applicationId = appData.applicationId
    assert.equal(appData.status, "PENDING")
    assert.ok(appData.matchScore >= 85 && appData.matchScore <= 100)

    const selectReq = new Request("http://localhost:3000/api/kreatr/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${businessToken}`,
      },
      body: JSON.stringify({
        action: "select",
        applicationId,
        ngnPerUsd: 1375,
      }),
    })

    const selectRes = await applicationsPost(selectReq)
    assert.equal(selectRes.status, 200)
    const selectData = (await selectRes.json()) as {
      application: { status: string }
      project: {
        projectId: string
        status: string
        attribution: { referralCode: string; referralLink: string }
      }
    }
    projectId = selectData.project.projectId
    assert.equal(selectData.application.status, "SELECTED")
    assert.equal(selectData.project.status, "AWAITING_FUNDING")
    assert.ok(selectData.project.attribution.referralCode.startsWith("ADAOBI"))
    assert.ok(selectData.project.attribution.referralLink.startsWith("/r/ADAOBI"))
  } finally {
    if (projectId) await KreatrProject.deleteOne({ projectId })
    if (applicationId) await KreatrApplication.deleteOne({ applicationId })
    if (campaignId) await KreatrCampaign.deleteOne({ campaignId })
  }
})

test.after(async () => {
  await mongoose.disconnect()
})
