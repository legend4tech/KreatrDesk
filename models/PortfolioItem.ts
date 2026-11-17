import mongoose, { Schema, type Document } from "mongoose"

export interface IPortfolioItem extends Document {
  sampleId: string
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
  credibility: {
    creativeAbility: number
    audienceInfluence: number
    communityActivation: number
    deliveryReliability: number
    campaignPerformance: number
  }
  createdAt: Date
  updatedAt: Date
}

const PortfolioItemSchema = new Schema<IPortfolioItem>(
  {
    sampleId: { type: String, required: true, unique: true, index: true },
    creatorId: { type: String, required: true, index: true },
    creatorName: { type: String, required: true },
    creatorHandle: { type: String, required: true },
    creatorAvatar: { type: String, required: true },
    creatorLocation: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    mediaType: { type: String, enum: ["video", "image"], default: "video" },
    mediaUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    category: { type: String, required: true },
    skills: [{ type: String }],
    brandTag: { type: String },
    turnaroundDays: { type: Number, default: 3 },
    rateNgn: { type: Number, required: true },
    credibility: {
      creativeAbility: { type: Number, default: 90 },
      audienceInfluence: { type: Number, default: 70 },
      communityActivation: { type: Number, default: 85 },
      deliveryReliability: { type: Number, default: 95 },
      campaignPerformance: { type: Number, default: 90 },
    },
  },
  { timestamps: true }
)

export default (mongoose.models.PortfolioItem as mongoose.Model<IPortfolioItem>) ||
  mongoose.model<IPortfolioItem>("PortfolioItem", PortfolioItemSchema)
