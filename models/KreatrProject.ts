import mongoose, { Schema, type Document } from "mongoose"
import type {
  CreatorProject,
  ProjectEscrowStatus,
  ProjectSubmission,
  ReferralAttribution,
} from "@/types"

export interface IKreatrProject extends Document {
  projectId: string
  campaignId: string
  campaignTitle: string
  businessId: string
  businessName: string
  creatorId: string
  creatorName: string
  creatorHandle: string
  creatorWallet: string
  agreedBudgetNgn: number
  agreedBudgetUsdc: number
  deliverables: string[]
  briefRequirements: string[]
  deadline: string
  status: ProjectEscrowStatus
  onChainVaultId: number
  escrowFunding?: CreatorProject["escrowFunding"]
  escrowRelease?: CreatorProject["escrowRelease"]
  submission?: ProjectSubmission
  attribution: ReferralAttribution
  activityLog: CreatorProject["activityLog"]
  createdAtIso: string
}

const KreatrProjectSchema = new Schema<IKreatrProject>(
  {
    projectId: { type: String, required: true, unique: true, index: true },
    campaignId: { type: String, required: true, index: true },
    campaignTitle: { type: String, required: true },
    businessId: { type: String, required: true, index: true },
    businessName: { type: String, required: true },
    creatorId: { type: String, required: true, index: true },
    creatorName: { type: String, required: true },
    creatorHandle: { type: String, required: true },
    creatorWallet: { type: String, required: true },
    agreedBudgetNgn: { type: Number, required: true },
    agreedBudgetUsdc: { type: Number, required: true },
    deliverables: [{ type: String }],
    briefRequirements: [{ type: String }],
    deadline: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "AWAITING_FUNDING",
        "ESCROW_FUNDED",
        "DELIVERABLE_SUBMITTED",
        "AI_EVALUATED",
        "REVISION_REQUESTED",
        "APPROVED_AND_RELEASED",
        "DISPUTED",
      ],
      default: "AWAITING_FUNDING",
    },
    onChainVaultId: { type: Number, default: 1 },
    escrowFunding: { type: Schema.Types.Mixed },
    escrowRelease: { type: Schema.Types.Mixed },
    submission: { type: Schema.Types.Mixed },
    attribution: { type: Schema.Types.Mixed, required: true },
    activityLog: [{ type: Schema.Types.Mixed }],
    createdAtIso: { type: String, required: true },
  },
  { timestamps: true }
)

export default (mongoose.models.KreatrProject as mongoose.Model<IKreatrProject>) ||
  mongoose.model<IKreatrProject>("KreatrProject", KreatrProjectSchema)
