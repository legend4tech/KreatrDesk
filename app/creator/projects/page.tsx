"use client"

import * as React from "react"
import {
  BotIcon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  FileVideoIcon,
  Loader2Icon,
  ShieldCheckIcon,
  UploadCloudIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useInvalidateKreatr, useKreatrOverview } from "@/hooks/useKreatrData"
import { formatNgn } from "@/lib/format"
import type { CreatorProject } from "@/types"

export default function CreatorProjectsPage() {
  const { data } = useKreatrOverview()
  const invalidate = useInvalidateKreatr()

  const projects = data?.projects ?? []

  const [submittingProject, setSubmittingProject] = React.useState<CreatorProject | null>(null)
  const [mediaUrl, setMediaUrl] = React.useState(
    "https://res.cloudinary.com/dyuyvwets/video/upload/v1794835027/kreatrdesk/kreatr_ugc_sample_1.mp4"
  )
  const [uploadingFile, setUploadingFile] = React.useState(false)
  const [captionNotes, setCaptionNotes] = React.useState(
    "Opened with a 0:01 macro condensation shot of the chilled ZoboCraft can, poured over ice in natural morning light at 0:05, highlighted Zero Added Sugar + 100% Natural Hibiscus in audio and captions at 0:15, and closed with referral code CTA at 0:38."
  )
  const [keyTimestamps, setKeyTimestamps] = React.useState(
    "0:01 Chilled Can Hook · 0:05 Ice Pour ASMR · 0:15 Zero Sugar Callout · 0:38 Referral Code CTA"
  )
  const [evaluating, setEvaluating] = React.useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingFile(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/kreatr/upload", {
        method: "POST",
        body: formData,
      })
      const payload = (await res.json()) as {
        url?: string
        message?: string
      }
      if (!res.ok || !payload.url) {
        throw new Error(payload.message || "Cloudinary upload failed")
      }
      setMediaUrl(payload.url)
      toast.success("Deliverable uploaded to Cloudinary CDN!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploadingFile(false)
    }
  }

  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!submittingProject) return
    setEvaluating(true)
    try {
      const res = await fetch("/api/kreatr/projects/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: submittingProject.id,
          mediaType: "video",
          mediaUrl,
          captionNotes,
          keyTimestamps,
        }),
      })
      const payload = (await res.json()) as {
        message?: string
        aiEvaluation?: { overallScore: number; recommendation: string }
      }
      if (!res.ok) throw new Error(payload.message || "Submission failed")
      invalidate()
      toast.success(
        `Video Submitted & Checked by AI! Score: ${payload.aiEvaluation?.overallScore}/100`
      )
      setSubmittingProject(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit")
    } finally {
      setEvaluating(false)
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          Submit Videos &amp; Get Paid
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Check that the brand has locked your payment in escrow before filming, then upload your finished video to Cloudinary for AI verification.
        </p>
      </div>

      <div className="space-y-6">
        {projects.map((proj) => {
          const ai = proj.submission?.aiEvaluation

          return (
            <Card
              key={proj.id}
              className="rounded-3xl border-border/60 bg-card/80 p-6 shadow-xs"
            >
              <div className="flex flex-col justify-between gap-4 border-b border-border/50 pb-5 lg:flex-row lg:items-center">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-semibold">
                      {proj.status === "AWAITING_FUNDING"
                        ? "Step 1: Waiting for Brand to Lock Payment"
                        : proj.status === "ESCROW_FUNDED"
                          ? "Step 2: Payment Locked — Ready to Upload Video"
                          : proj.status === "AI_EVALUATED"
                            ? "Step 3: Video Submitted (AI Checked ✓)"
                            : "Step 4: Completed & Paid ✓"}
                    </Badge>
                  </div>
                  <h2 className="font-display text-xl font-extrabold">{proj.campaignTitle}</h2>
                  <p className="text-xs text-muted-foreground">
                    Brand: <strong>{proj.businessName}</strong> · Deadline: {proj.deadline}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-2 text-right">
                    <div className="text-[10px] text-muted-foreground">Your Payout</div>
                    <div className="font-display text-base font-black">
                      {formatNgn(proj.agreedBudgetNgn)}
                    </div>
                  </div>

                  {proj.status !== "AWAITING_FUNDING" &&
                    proj.status !== "APPROVED_AND_RELEASED" && (
                      <Button
                        size="sm"
                        onClick={() => setSubmittingProject(proj)}
                        className="gap-1.5 rounded-full text-xs font-semibold"
                      >
                        <UploadCloudIcon className="size-3.5" />
                        {proj.submission ? "Upload New Version" : "Upload Finished Video"}
                      </Button>
                    )}
                </div>
              </div>

              {/* Escrow Safety Banner */}
              <div className="mt-5 rounded-2xl border border-border/60 bg-background/60 p-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldCheckIcon className="size-4 text-primary" />
                    <span>
                      {proj.escrowFunding?.verifiedByBackend
                        ? "✓ Your Payment Is Safely Locked in Escrow — Safe to Upload Your Video!"
                        : "⏳ Waiting for Brand to Deposit Payment — Do Not Upload Final Video Yet"}
                    </span>
                  </div>
                  {proj.escrowFunding && (
                    <a
                      href={`https://sepolia.basescan.org/tx/${proj.escrowFunding.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-mono font-semibold text-primary hover:underline"
                    >
                      View Escrow Proof <ExternalLinkIcon className="size-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Uploaded Video & AI Score */}
              {proj.submission && (
                <div className="mt-5 grid gap-5 rounded-2xl border border-primary/25 bg-primary/5 p-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <FileVideoIcon className="size-4 text-primary" />
                      <span>My Uploaded Video (Streaming from Cloudinary)</span>
                    </div>
                    <video
                      key={proj.submission.mediaUrl}
                      src={proj.submission.mediaUrl}
                      controls
                      muted
                      playsInline
                      preload="auto"
                      className="h-52 w-full rounded-xl bg-black object-contain"
                    />
                  </div>

                  {ai && (
                    <div className="flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-bold">
                            <BotIcon className="size-4 text-primary" />
                            AI Instruction Check
                          </span>
                          <Badge className="bg-primary text-primary-foreground font-mono text-xs">
                            {ai.overallScore}/100 (Passed)
                          </Badge>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{ai.summary}</p>
                      </div>

                      {proj.escrowRelease && (
                        <div className="flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
                          <span className="flex items-center gap-1.5 font-bold">
                            <CheckCircle2Icon className="size-4" />
                            Payment Released! ({proj.escrowRelease.receiptId})
                          </span>
                          <a
                            href={`https://sepolia.basescan.org/tx/${proj.escrowRelease.txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                          >
                            View Receipt
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          )
        })}
      </div>

      <Dialog
        open={Boolean(submittingProject)}
        onOpenChange={(val) => {
          if (!val) setSubmittingProject(null)
        }}
      >
        <DialogContent className="sm:max-w-xl">
          {submittingProject && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-lg">
                  Upload Finished Video to Cloudinary &amp; Run AI Check
                </DialogTitle>
                <DialogDescription className="text-xs leading-relaxed">
                  Select your finished video file to upload to Cloudinary CDN, then our AI will verify that it follows all {submittingProject.briefRequirements.length} campaign instructions.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => void handleSubmitDeliverable(e)} className="space-y-4">
                <div className="space-y-2 rounded-2xl border border-primary/30 bg-primary/5 p-4">
                  <Label htmlFor="cr-file" className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <UploadCloudIcon className="size-4 shrink-0" />
                    <span>Select Video File from Device (Uploads to Cloudinary CDN)</span>
                  </Label>
                  <Input
                    id="cr-file"
                    type="file"
                    accept="video/*"
                    disabled={uploadingFile}
                    onChange={(e) => void handleFileUpload(e)}
                    className="bg-card text-xs cursor-pointer"
                  />
                  {uploadingFile && (
                    <div className="flex items-center gap-1.5 text-xs text-primary">
                      <Loader2Icon className="size-3.5 animate-spin shrink-0" />
                      <span>Uploading video to Cloudinary CDN...</span>
                    </div>
                  )}
                  {mediaUrl.includes("res.cloudinary.com") && !uploadingFile && (
                    <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2Icon className="size-3.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold">Cloudinary CDN Ready: </span>
                        <span className="font-mono break-all opacity-85">{mediaUrl}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cr-ts" className="text-xs font-semibold">Key Video Timestamps</Label>
                  <Input
                    id="cr-ts"
                    value={keyTimestamps}
                    onChange={(e) => setKeyTimestamps(e.target.value)}
                    placeholder="e.g. 0:01 Hook · 0:15 Product Reveal · 0:38 Referral Code CTA"
                    className="text-xs"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cr-notes" className="text-xs font-semibold">How You Followed the Instructions</Label>
                  <textarea
                    id="cr-notes"
                    rows={4}
                    value={captionNotes}
                    onChange={(e) => setCaptionNotes(e.target.value)}
                    placeholder="Describe how your video incorporated each campaign requirement..."
                    className="w-full resize-none rounded-xl border border-input bg-card p-3 text-xs leading-relaxed outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="default"
                  disabled={evaluating || uploadingFile}
                  className="w-full gap-2 rounded-full font-semibold"
                >
                  {evaluating ? (
                    <Loader2Icon className="size-4 animate-spin shrink-0" />
                  ) : (
                    <BotIcon className="size-4 shrink-0" />
                  )}
                  Submit Video &amp; Run AI Check
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
