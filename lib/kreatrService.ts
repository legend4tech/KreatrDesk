import { dbConnect } from "@/lib/db"
import {
  evaluateSubmissionAgainstBrief,
  getKreatrStore,
} from "@/lib/kreatrStore"
import KreatrApplication from "@/models/KreatrApplication"
import KreatrCampaign from "@/models/KreatrCampaign"
import KreatrProject from "@/models/KreatrProject"
import KreatrUser from "@/models/KreatrUser"
import PortfolioItem from "@/models/PortfolioItem"
import type {
  Campaign,
  CampaignApplication,
  CreatorProfile,
  CreatorProject,
  PortfolioSample,
} from "@/types"

let isSeedingPromise: Promise<void> | null = null

export async function ensureKreatrDatabaseSeeded(): Promise<boolean> {
  const conn = await dbConnect()
  if (!conn) return false

  if (isSeedingPromise) {
    await isSeedingPromise
    return true
  }

  isSeedingPromise = (async () => {
    try {
      const existingUsers = await KreatrUser.countDocuments()
      if (existingUsers > 0) return

      console.log("[KreatrDesk DB] Seeding initial collections into MongoDB Atlas (kreatrdesk)...")
      const seed = getKreatrStore()

      const businessUsers = [
        {
          userId: "biz-zobocraft",
          role: "business" as const,
          name: "ZoboCraft Beverages Ltd",
          handle: "@zobocraft.ng",
          email: "business@kreatrdesk.app",
          passwordHash: "demo1234",
          avatar:
            "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80",
          bio: "Zero-sugar sparkling hibiscus beverages crafted in Lagos.",
          location: "Lagos, Nigeria",
          companyCategory: "Food & Beverage",
          verified: true,
          languages: ["English"],
          categories: ["Food & Beverage"],
          skills: [],
          services: [],
          startingRateNgn: 110000,
          walletAddress: "0x21342ab22B3D68464677CEd76f811b3AE140192b",
          completedProjectsCount: 8,
          totalEarnedNgn: 0,
          credibility: {
            creativeAbility: 95,
            audienceInfluence: 90,
            communityActivation: 92,
            deliveryReliability: 100,
            campaignPerformance: 96,
          },
        },
      ]

      const creatorUsers = seed.creators.map((c) => ({
        userId: c.id,
        role: "creator" as const,
        name: c.name,
        handle: c.handle,
        email: c.id === "cr-adaobi" ? "creator@kreatrdesk.app" : c.email,
        passwordHash: "demo1234",
        avatar: c.avatar,
        bio: c.bio,
        location: c.location,
        verified: true,
        languages: c.languages,
        categories: c.categories,
        skills: c.skills,
        services: c.services,
        startingRateNgn: c.startingRateNgn,
        walletAddress: c.walletAddress,
        bankName: c.bankName,
        bankAccountLast4: c.bankAccountLast4,
        completedProjectsCount: c.completedProjectsCount,
        totalEarnedNgn: c.totalEarnedNgn,
        credibility: c.credibility,
      }))

      await KreatrUser.insertMany([...businessUsers, ...creatorUsers])

      await PortfolioItem.insertMany(
        seed.portfolioSamples.map((s) => ({
          sampleId: s.id,
          creatorId: s.creatorId,
          creatorName: s.creatorName,
          creatorHandle: s.creatorHandle,
          creatorAvatar: s.creatorAvatar,
          creatorLocation: s.creatorLocation,
          title: s.title,
          description: s.description,
          mediaType: s.mediaType,
          mediaUrl: s.mediaUrl,
          thumbnailUrl: s.thumbnailUrl,
          category: s.category,
          skills: s.skills,
          brandTag: s.brandTag,
          turnaroundDays: s.turnaroundDays,
          rateNgn: s.rateNgn,
          credibility: s.credibility,
        }))
      )

      await KreatrCampaign.insertMany(
        seed.campaigns.map((camp) => ({
          campaignId: camp.id,
          businessId: camp.businessId,
          businessName: camp.businessName,
          businessCategory: camp.businessCategory,
          businessLocation: camp.businessLocation,
          businessVerified: camp.businessVerified,
          title: camp.title,
          summary: camp.summary,
          briefRequirements: camp.briefRequirements,
          deliverables: camp.deliverables,
          budgetPerCreatorNgn: camp.budgetPerCreatorNgn,
          budgetPerCreatorUsdc: camp.budgetPerCreatorUsdc,
          totalBudgetNgn: camp.totalBudgetNgn,
          deadline: camp.deadline,
          status: camp.status,
          eligibility: camp.eligibility,
          applicantsCount: camp.applicantsCount,
          selectedCreatorsCount: camp.selectedCreatorsCount,
          onChainVaultId: camp.onChainVaultId,
        }))
      )

      await KreatrApplication.insertMany(
        seed.applications.map((a) => ({
          applicationId: a.id,
          campaignId: a.campaignId,
          campaignTitle: a.campaignTitle,
          creatorId: a.creatorId,
          creatorName: a.creatorName,
          creatorHandle: a.creatorHandle,
          creatorLocation: a.creatorLocation,
          creatorSkills: a.creatorSkills,
          creatorCredibility: a.creatorCredibility,
          pitch: a.pitch,
          samplePortfolioId: a.samplePortfolioId,
          sampleTitle: a.sampleTitle,
          proposedRateNgn: a.proposedRateNgn,
          matchScore: a.matchScore,
          status: a.status,
          appliedAt: a.appliedAt,
        }))
      )

      await KreatrProject.insertMany(
        seed.projects.map((p) => ({
          projectId: p.id,
          campaignId: p.campaignId,
          campaignTitle: p.campaignTitle,
          businessId: p.businessId,
          businessName: p.businessName,
          creatorId: p.creatorId,
          creatorName: p.creatorName,
          creatorHandle: p.creatorHandle,
          creatorWallet: p.creatorWallet,
          agreedBudgetNgn: p.agreedBudgetNgn,
          agreedBudgetUsdc: p.agreedBudgetUsdc,
          deliverables: p.deliverables,
          briefRequirements: p.briefRequirements,
          deadline: p.deadline,
          status: p.status,
          onChainVaultId: p.onChainVaultId,
          escrowFunding: p.escrowFunding,
          escrowRelease: p.escrowRelease,
          submission: p.submission,
          attribution: p.attribution,
          activityLog: p.activityLog,
          createdAtIso: p.createdAt,
        }))
      )

      console.log("[KreatrDesk DB] Successfully seeded MongoDB Atlas (kreatrdesk)!")
    } catch (err) {
      console.error("[KreatrDesk DB] Seeding error:", err)
    }
  })()

  await isSeedingPromise
  return true
}

export async function fetchOverviewFromDb() {
  const connected = await ensureKreatrDatabaseSeeded()
  if (!connected) {
    throw new Error("MongoDB Atlas connection failed. Please verify MONGODB_URI in .env.local.")
  }

  const [rawCreators, rawSamples, rawCampaigns, rawApps, rawProjects] =
    await Promise.all([
      KreatrUser.find({ role: "creator" }).sort({ createdAt: 1 }).lean(),
      PortfolioItem.find({}).sort({ createdAt: -1 }).lean(),
      KreatrCampaign.find({}).sort({ createdAt: -1 }).lean(),
      KreatrApplication.find({}).sort({ createdAt: -1 }).lean(),
      KreatrProject.find({}).sort({ createdAt: -1 }).lean(),
    ])

  const portfolioSamples: PortfolioSample[] = rawSamples.map((s) => ({
    id: s.sampleId,
    creatorId: s.creatorId,
    creatorName: s.creatorName,
    creatorHandle: s.creatorHandle,
    creatorAvatar: s.creatorAvatar,
    creatorLocation: s.creatorLocation,
    title: s.title,
    description: s.description,
    mediaType: s.mediaType,
    mediaUrl: s.mediaUrl,
    thumbnailUrl: s.thumbnailUrl,
    category: s.category,
    skills: s.skills,
    brandTag: s.brandTag,
    turnaroundDays: s.turnaroundDays,
    rateNgn: s.rateNgn,
    credibility: s.credibility,
    createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
  }))

  const creators: CreatorProfile[] = rawCreators.map((c) => ({
    id: c.userId,
    name: c.name,
    handle: c.handle,
    email: c.email,
    avatar: c.avatar,
    bio: c.bio,
    location: c.location,
    languages: c.languages,
    categories: c.categories,
    skills: c.skills,
    services: c.services,
    startingRateNgn: c.startingRateNgn,
    walletAddress: c.walletAddress as `0x${string}`,
    bankName: c.bankName,
    bankAccountLast4: c.bankAccountLast4,
    completedProjectsCount: c.completedProjectsCount,
    totalEarnedNgn: c.totalEarnedNgn,
    credibility: c.credibility,
    portfolio: portfolioSamples.filter((s) => s.creatorId === c.userId),
  }))

  const campaigns: Campaign[] = rawCampaigns.map((camp) => ({
    id: camp.campaignId,
    businessId: camp.businessId,
    businessName: camp.businessName,
    businessCategory: camp.businessCategory,
    businessLocation: camp.businessLocation,
    businessVerified: camp.businessVerified,
    title: camp.title,
    summary: camp.summary,
    briefRequirements: camp.briefRequirements,
    deliverables: camp.deliverables,
    budgetPerCreatorNgn: camp.budgetPerCreatorNgn,
    budgetPerCreatorUsdc: camp.budgetPerCreatorUsdc,
    totalBudgetNgn: camp.totalBudgetNgn,
    deadline: camp.deadline,
    status: camp.status,
    eligibility: camp.eligibility as Campaign["eligibility"],
    applicantsCount: camp.applicantsCount,
    selectedCreatorsCount: camp.selectedCreatorsCount,
    onChainVaultId: camp.onChainVaultId,
    createdAt: camp.createdAt ? new Date(camp.createdAt).toISOString() : new Date().toISOString(),
  }))

  const applications: CampaignApplication[] = rawApps.map((a) => ({
    id: a.applicationId,
    campaignId: a.campaignId,
    campaignTitle: a.campaignTitle,
    creatorId: a.creatorId,
    creatorName: a.creatorName,
    creatorHandle: a.creatorHandle,
    creatorLocation: a.creatorLocation,
    creatorSkills: a.creatorSkills,
    creatorCredibility: a.creatorCredibility,
    pitch: a.pitch,
    samplePortfolioId: a.samplePortfolioId,
    sampleTitle: a.sampleTitle,
    proposedRateNgn: a.proposedRateNgn,
    matchScore: a.matchScore,
    status: a.status,
    appliedAt: a.appliedAt,
  }))

  const projects: CreatorProject[] = rawProjects.map((p) => ({
    id: p.projectId,
    campaignId: p.campaignId,
    campaignTitle: p.campaignTitle,
    businessId: p.businessId,
    businessName: p.businessName,
    creatorId: p.creatorId,
    creatorName: p.creatorName,
    creatorHandle: p.creatorHandle,
    creatorWallet: p.creatorWallet as `0x${string}`,
    agreedBudgetNgn: p.agreedBudgetNgn,
    agreedBudgetUsdc: p.agreedBudgetUsdc,
    deliverables: p.deliverables,
    briefRequirements: p.briefRequirements,
    deadline: p.deadline,
    status: p.status,
    onChainVaultId: p.onChainVaultId,
    escrowFunding: p.escrowFunding,
    escrowRelease: p.escrowRelease,
    submission: p.submission,
    attribution: p.attribution,
    activityLog: p.activityLog || [],
    createdAt: p.createdAtIso,
  }))

  return {
    creators,
    portfolioSamples,
    campaigns,
    applications,
    projects,
  }
}

export { evaluateSubmissionAgainstBrief }
