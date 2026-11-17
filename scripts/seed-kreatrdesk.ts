import { ensureKreatrDatabaseSeeded, fetchOverviewFromDb } from "../lib/kreatrService"

async function run() {
  const seeded = await ensureKreatrDatabaseSeeded()
  const overview = await fetchOverviewFromDb()
  console.log("[Seed Verification] Connected to MongoDB Atlas:", seeded)
  console.log("[Seed Verification] Creators in DB:", overview.creators.length)
  console.log("[Seed Verification] Portfolio Samples in DB:", overview.portfolioSamples.length)
  console.log("[Seed Verification] Campaigns in DB:", overview.campaigns.length)
  console.log("[Seed Verification] Applications in DB:", overview.applications.length)
  console.log("[Seed Verification] Projects in DB:", overview.projects.length)
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
