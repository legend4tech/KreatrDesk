import mongoose, { Schema, type Document } from "mongoose"

export interface IKreatrCampaign extends Document {
  campaignId: string
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
  eligibility: {
    locations: string[]
    requiredSkills: string[]
    minCreativeScore: number
    minReliabilityScore: number
    creatorsNeeded: number
    creatorTypes: string[]
  }
  applicantsCount: number
  selectedCreatorsCount: number
  onChainVaultId: number
  createdAt: Date
  updatedAt: Date
}

const KreatrCampaignSchema = new Schema<IKreatrCampaign>(
  {
    campaignId: { type: String, required: true, unique: true, index: true },
    businessId: { type: String, required: true, index: true },
    businessName: { type: String, required: true },
    businessCategory: { type: String, required: true },
    businessLocation: { type: String, required: true },
    businessVerified: { type: Boolean, default: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    briefRequirements: [{ type: String }],
    deliverables: [{ type: String }],
    budgetPerCreatorNgn: { type: Number, required: true },
    budgetPerCreatorUsdc: { type: Number, required: true },
    totalBudgetNgn: { type: Number, required: true },
    deadline: { type: String, required: true },
    status: { type: String, enum: ["OPEN", "IN_PROGRESS", "COMPLETED"], default: "OPEN" },
    eligibility: {
      locations: [{ type: String }],
      requiredSkills: [{ type: String }],
      minCreativeScore: { type: Number, default: 80 },
      minReliabilityScore: { type: Number, default: 85 },
      creatorsNeeded: { type: Number, default: 2 },
      creatorTypes: [{ type: String }],
    },
    applicantsCount: { type: Number, default: 0 },
    selectedCreatorsCount: { type: Number, default: 0 },
    onChainVaultId: { type: Number, default: 1 },
  },
  { timestamps: true }
)

export default (mongoose.models.KreatrCampaign as mongoose.Model<IKreatrCampaign>) ||
  mongoose.model<IKreatrCampaign>("KreatrCampaign", KreatrCampaignSchema)
