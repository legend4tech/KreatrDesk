import mongoose, { Schema, type Document } from "mongoose"

export interface IKreatrApplication extends Document {
  applicationId: string
  campaignId: string
  campaignTitle: string
  creatorId: string
  creatorName: string
  creatorHandle: string
  creatorLocation: string
  creatorSkills: string[]
  creatorCredibility: {
    creativeAbility: number
    audienceInfluence: number
    communityActivation: number
    deliveryReliability: number
    campaignPerformance: number
  }
  pitch: string
  samplePortfolioId: string
  sampleTitle: string
  proposedRateNgn: number
  matchScore: number
  status: "PENDING" | "SELECTED" | "DECLINED"
  appliedAt: string
}

const KreatrApplicationSchema = new Schema<IKreatrApplication>(
  {
    applicationId: { type: String, required: true, unique: true, index: true },
    campaignId: { type: String, required: true, index: true },
    campaignTitle: { type: String, required: true },
    creatorId: { type: String, required: true, index: true },
    creatorName: { type: String, required: true },
    creatorHandle: { type: String, required: true },
    creatorLocation: { type: String, required: true },
    creatorSkills: [{ type: String }],
    creatorCredibility: {
      creativeAbility: { type: Number, default: 90 },
      audienceInfluence: { type: Number, default: 70 },
      communityActivation: { type: Number, default: 85 },
      deliveryReliability: { type: Number, default: 95 },
      campaignPerformance: { type: Number, default: 90 },
    },
    pitch: { type: String, required: true },
    samplePortfolioId: { type: String, required: true },
    sampleTitle: { type: String, required: true },
    proposedRateNgn: { type: Number, required: true },
    matchScore: { type: Number, required: true },
    status: { type: String, enum: ["PENDING", "SELECTED", "DECLINED"], default: "PENDING" },
    appliedAt: { type: String, required: true },
  },
  { timestamps: true }
)

export default (mongoose.models.KreatrApplication as mongoose.Model<IKreatrApplication>) ||
  mongoose.model<IKreatrApplication>("KreatrApplication", KreatrApplicationSchema)
