import mongoose, { Schema, type Document } from "mongoose"

export interface IKreatrUser extends Document {
  userId: string
  role: "business" | "creator"
  name: string
  handle: string
  email: string
  passwordHash: string
  avatar: string
  bio: string
  location: string
  companyCategory?: string
  verified: boolean
  languages: string[]
  categories: string[]
  skills: string[]
  services: string[]
  startingRateNgn: number
  walletAddress: string
  bankName?: string
  bankAccountLast4?: string
  completedProjectsCount: number
  totalEarnedNgn: number
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

const KreatrUserSchema = new Schema<IKreatrUser>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    role: { type: String, enum: ["business", "creator"], required: true, index: true },
    name: { type: String, required: true },
    handle: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    location: { type: String, default: "Lagos, Nigeria" },
    companyCategory: { type: String },
    verified: { type: Boolean, default: true },
    languages: [{ type: String }],
    categories: [{ type: String }],
    skills: [{ type: String }],
    services: [{ type: String }],
    startingRateNgn: { type: Number, default: 75000 },
    walletAddress: {
      type: String,
      default: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    },
    bankName: { type: String },
    bankAccountLast4: { type: String },
    completedProjectsCount: { type: Number, default: 0 },
    totalEarnedNgn: { type: Number, default: 0 },
    credibility: {
      creativeAbility: { type: Number, default: 88 },
      audienceInfluence: { type: Number, default: 70 },
      communityActivation: { type: Number, default: 85 },
      deliveryReliability: { type: Number, default: 95 },
      campaignPerformance: { type: Number, default: 90 },
    },
  },
  { timestamps: true }
)

export default (mongoose.models.KreatrUser as mongoose.Model<IKreatrUser>) ||
  mongoose.model<IKreatrUser>("KreatrUser", KreatrUserSchema)
