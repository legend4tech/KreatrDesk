export type RoqquDataSource = "ras-live" | "roqqu-public" | "demo-fallback"

export interface RoqquFiatRate {
  symbol: string
  title: string
  rate: number
  icon: string
  minTradeable: number
  maxTradeable: number
  minWithdraw: number
  maxWithdraw: number
}

export interface RoqquTokenQuote {
  symbol: string
  usdPrice: number
  ngnPrice: number
  change24h: number
}

export interface RoqquTreasuryBalances {
  email?: string
  usdt: number
  btc: number
  eth: number
  trx: number
  sol: number
  bnb: number
  xrp: number
  totalEstimatedUsd: number
  totalEstimatedNgn: number
}

export interface RoqquRatesSnapshot {
  ngnPerUsd: number
  fiatRates: Record<string, RoqquFiatRate>
  prices: Record<string, RoqquTokenQuote>
  treasury: RoqquTreasuryBalances
  mode: "staging" | "live"
  source: RoqquDataSource
  cached: boolean
  updatedAt: string
}

export interface RoqquSupportedNetwork {
  network: string
  currency: string
}

export interface RoqquPaymentLinkResult {
  paymentReference: string
  checkoutUrl: string
  amountNgn: number
  wallets?: Record<string, unknown>
  raw: Record<string, unknown>
}

export interface RoqquCheckoutResult {
  rail: "payment_link" | "crypto_wallet"
  paymentReference: string
  communityId: number
  projectId?: string
  contributorName: string
  amountNgn: number
  estimatedUsdc: number
  ngnPerUsd: number
  checkoutUrl?: string
  depositAddress?: string
  depositNetwork?: string
  source: "ras-live" | "demo-simulated"
}

export interface RoqquWebhookResult {
  status: "credited" | "duplicate"
  paymentReference: string
  communityId: number
  projectId?: string
  usdcCredited: number
  contributorTag: string
  relayerTxHash: `0x${string}`
  relayerMode: "onchain" | "simulated"
  autoConvertedToken?: string
}

export interface SettlementReceipt {
  receiptId: string
  payoutId: number
  communityId: number
  amountUsdc: number
  amountNgn: number
  ngnPerUsd: number
  settlementRail: string
  recipient: string
  onchainTxHash: `0x${string}`
  txVerifiedOnchain: boolean
  roqquStatus: "settled-ras" | "settled-simulated"
  settledAt: string
}

export interface ContributionItem {
  sender: `0x${string}`
  amount: bigint
  timestamp: bigint
  contributorTag: string
}

export interface CommunitySummary {
  id: bigint
  name: string
  creator: `0x${string}`
  signers: readonly `0x${string}`[]
  threshold: bigint
  balance: bigint
  totalContributed: bigint
  totalDisbursed: bigint
  createdAt: bigint
  exists: boolean
  category?: string
  description?: string
  targetAmountNgn?: number
}

export interface PayoutProposal {
  id: bigint
  communityId: bigint
  proposer: `0x${string}`
  recipient: `0x${string}`
  amount: bigint
  reason: string
  settlementRail: string
  approvalCount: bigint
  executed: boolean
  createdAt: bigint
  exists: boolean
}

export interface DripVaultSummary {
  id: bigint
  depositor: `0x${string}`
  beneficiary: `0x${string}`
  guardian: `0x${string}`
  totalAmount: bigint
  remainingAmount: bigint
  installmentAmount: bigint
  intervalSeconds: bigint
  nextReleaseAt: bigint
  earlyExitRequested: boolean
  active: boolean
  exists: boolean
}

// ============================================================================
// KreatrDesk Core Domain Types
// ============================================================================

export type UserRole = "business" | "creator"

export interface CredibilityMetrics {
  creativeAbility: number // 0-100: Video editing, lighting, storytelling, UGC craft
  audienceInfluence: number // 0-100: Organic reach & engagement
  communityActivation: number // 0-100: Ability to drive grassroots clicks/enquiries
  deliveryReliability: number // 0-100: On-time submission & brief adherence
  campaignPerformance: number // 0-100: Verified referral redemptions & ROI
}

export interface PortfolioSample {
  id: string
  creatorId: string
  creatorName: string
  creatorHandle: string
  creatorAvatar: string
  creatorLocation: string
  title: string
  description: string
  mediaType: "video" | "image"
  mediaUrl: string
  thumbnailUrl: string
  category: string
  skills: string[]
  brandTag?: string
  turnaroundDays: number
  rateNgn: number
  credibility: CredibilityMetrics
  createdAt: string
}

export interface CreatorProfile {
  id: string
  name: string
  handle: string
  email: string
  avatar: string
  bio: string
  location: string
  languages: string[]
  categories: string[]
  skills: string[]
  services: string[]
  startingRateNgn: number
  walletAddress: `0x${string}`
  bankName?: string
  bankAccountLast4?: string
  completedProjectsCount: number
  totalEarnedNgn: number
  credibility: CredibilityMetrics
  portfolio: PortfolioSample[]
}

export interface CampaignEligibility {
  locations: string[]
  requiredSkills: string[]
  minCreativeScore: number
  minReliabilityScore: number
  creatorsNeeded: number
  creatorTypes: ("UGC Producer" | "Community Ambassador" | "Local Influencer")[]
}

export interface Campaign {
  id: string
  businessId: string
  businessName: string
  businessCategory: string
  businessLocation: string
  businessVerified: boolean
  title: string
  summary: string
  briefRequirements: string[]
  deliverables: string[]
  budgetPerCreatorNgn: number
  budgetPerCreatorUsdc: number
  totalBudgetNgn: number
  deadline: string
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED"
  eligibility: CampaignEligibility
  applicantsCount: number
  selectedCreatorsCount: number
  onChainVaultId: number
  createdAt: string
}

export interface CampaignApplication {
  id: string
  campaignId: string
  campaignTitle: string
  creatorId: string
  creatorName: string
  creatorHandle: string
  creatorLocation: string
  creatorSkills: string[]
  creatorCredibility: CredibilityMetrics
  pitch: string
  samplePortfolioId: string
  sampleTitle: string
  proposedRateNgn: number
  matchScore: number // Calculated from campaign eligibility vs creator 5-pillar credibility
  status: "PENDING" | "SELECTED" | "DECLINED"
  appliedAt: string
}

export interface AIEvaluationBreakdown {
  overallScore: number
  recommendation: "APPROVE" | "REVISION_RECOMMENDED" | "REJECT"
  summary: string
  briefComplianceScore: number
  contentQualityScore: number
  creativityScore: number
  productVisibilityScore: number
  audioVisualScore: number
  brandAlignmentScore: number
  checklistResults: {
    requirement: string
    passed: boolean
    note: string
  }[]
  strengths: string[]
  improvements: string[]
  evaluatedAt: string
  modelUsed: string
}

export type ProjectEscrowStatus =
  | "AWAITING_FUNDING"
  | "ESCROW_FUNDED"
  | "DELIVERABLE_SUBMITTED"
  | "AI_EVALUATED"
  | "REVISION_REQUESTED"
  | "APPROVED_AND_RELEASED"
  | "DISPUTED"

export interface ProjectSubmission {
  id: string
  mediaType: "video" | "image"
  mediaUrl: string
  captionNotes: string
  keyTimestamps: string
  submittedAt: string
  aiEvaluation?: AIEvaluationBreakdown
  businessFeedback?: string
}

export interface ReferralAttribution {
  referralCode: string
  referralLink: string
  clicks: number
  enquiries: number
  redemptions: number
  confirmedConversions: number
  revenueGeneratedNgn: number
  recentEvents: {
    id: string
    type: "CLICK" | "ENQUIRY" | "REDEMPTION" | "CONVERSION"
    customerLabel: string
    location: string
    amountNgn?: number
    timestamp: string
  }[]
}

export interface CreatorProject {
  id: string
  campaignId: string
  campaignTitle: string
  businessId: string
  businessName: string
  creatorId: string
  creatorName: string
  creatorHandle: string
  creatorWallet: `0x${string}`
  agreedBudgetNgn: number
  agreedBudgetUsdc: number
  deliverables: string[]
  briefRequirements: string[]
  deadline: string
  status: ProjectEscrowStatus
  onChainVaultId: number
  escrowFunding?: {
    rail: "roqqu_fiat" | "web3_direct"
    paymentReference: string
    txHash: `0x${string}`
    fundedAt: string
    verifiedByBackend: boolean
  }
  escrowRelease?: {
    txHash: `0x${string}`
    releasedAt: string
    settlementRail: string
    receiptId: string
  }
  submission?: ProjectSubmission
  attribution: ReferralAttribution
  activityLog: {
    id: string
    actor: string
    action: string
    timestamp: string
    txHash?: `0x${string}`
  }[]
  createdAt: string
}
