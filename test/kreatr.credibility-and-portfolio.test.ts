import assert from "node:assert/strict"
import test from "node:test"
import mongoose from "mongoose"

import { POST as portfolioPost } from "@/app/api/kreatr/portfolio/route"
import { signSessionToken } from "@/lib/auth"
import { fetchOverviewFromDb } from "@/lib/kreatrService"
import PortfolioItem from "@/models/PortfolioItem"

const creatorToken = signSessionToken({
  userId: "cr-adaobi",
  role: "creator",
  name: "Adaobi Nnamdi",
  handle: "@adaobi.ugc",
  email: "creator@kreatrdesk.app",
  location: "Lagos (Yaba / Lekki)",
})

test("1. All creators in MongoDB have valid 5-Pillar Credibility scores (0-100)", async () => {
  const overview = await fetchOverviewFromDb()
  assert.ok(overview.creators.length >= 4, "Should have at least 4 seeded creators")

  for (const creator of overview.creators) {
    const c = creator.credibility
    assert.ok(c.creativeAbility >= 0 && c.creativeAbility <= 100)
    assert.ok(c.audienceInfluence >= 0 && c.audienceInfluence <= 100)
    assert.ok(c.communityActivation >= 0 && c.communityActivation <= 100)
    assert.ok(c.deliveryReliability >= 0 && c.deliveryReliability <= 100)
    assert.ok(c.campaignPerformance >= 0 && c.campaignPerformance <= 100)
  }
})

test("2. All portfolio samples stream from Cloudinary HTTPS URLs", async () => {
  const overview = await fetchOverviewFromDb()
  assert.ok(overview.portfolioSamples.length >= 5)

  for (const sample of overview.portfolioSamples) {
    assert.ok(
      sample.mediaUrl.startsWith("https://res.cloudinary.com/"),
      `Expected Cloudinary URL, got ${sample.mediaUrl}`
    )
  }
})

test("3. Authenticated Creator can publish a new portfolio video sample to MongoDB", async () => {
  let createdSampleId = ""
  try {
    const req = new Request("http://localhost:3000/api/kreatr/portfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${creatorToken}`,
      },
      body: JSON.stringify({
        creatorId: "cr-adaobi",
        title: "Unit Test UGC Sample Reel",
        description: "Testing portfolio persistence in MongoDB Atlas.",
        mediaType: "video",
        mediaUrl:
          "https://res.cloudinary.com/dyuyvwets/video/upload/v1794835027/kreatrdesk/kreatr_ugc_sample_1.mp4",
        category: "Food & Beverage",
        skills: ["UGC Video Production", "Pidgin Voiceover"],
        rateNgn: 90000,
      }),
    })

    const res = await portfolioPost(req)
    assert.equal(res.status, 201)
    const sample = (await res.json()) as { id: string; title: string; rateNgn: number }
    createdSampleId = sample.id
    assert.equal(sample.title, "Unit Test UGC Sample Reel")
    assert.equal(sample.rateNgn, 90000)

    const inDb = await PortfolioItem.findOne({ sampleId: createdSampleId }).lean()
    assert.ok(inDb, "Portfolio item must be persisted in MongoDB Atlas")
  } finally {
    if (createdSampleId) {
      await PortfolioItem.deleteOne({ sampleId: createdSampleId })
    }
  }
})

test.after(async () => {
  await mongoose.disconnect()
})
