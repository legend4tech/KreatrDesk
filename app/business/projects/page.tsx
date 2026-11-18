"use client"

import * as React from "react"
import Link from "next/link"
import {
  AlertCircleIcon,
  BotIcon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  FileVideoIcon,
  Loader2Icon,
  RotateCcwIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react"
import { toast } from "sonner"

import { FundProjectEscrowModal } from "@/components/kreatr/FundProjectEscrowModal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useInvalidateKreatr, useKreatrOverview } from "@/hooks/useKreatrData"
import { useRoqquRates } from "@/hooks/useRoqquRates"
import { formatNgn } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { CreatorProject } from "@/types"

function getStepNumber(status: CreatorProject["status"]): number {
  if (status === "AWAITING_FUNDING") return 1
  if (status === "ESCROW_FUNDED" || status === "REVISION_REQUESTED") return 2
  if (status === "DELIVERABLE_SUBMITTED" || status === "AI_EVALUATED") return 3
  return 4
}

export default function BusinessProjectsAndEscrowPage() {
  const { data } = useKreatrOverview()
  const { data: ratesData } = useRoqquRates()
  const invalidate = useInvalidateKreatr()

  const ngnPerUsd = ratesData?.ngnPerUsd ?? 1375
  const projects = data?.projects ?? []
  const [releasingId, setReleasingId] = React.useState<string | null>(null)

  const handleApproveAndRelease = async (project: CreatorProject) => {
    setReleasingId(project.id)
    const toastId = toast.loading(`Approving video and releasing ${formatNgn(project.agreedBudgetNgn)}...`)
    try {
      const res = await fetch("/api/kreatr/projects/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          action: "approve_release",
          settlementRail: "Instant Bank Settlement + Escrow Proof",
        }),
      })
      const payload = (await res.json().catch(() => ({}))) as {
        message?: string
        receiptId?: string
      }
      if (!res.ok) throw new Error(payload.message || "Payment release failed")
      invalidate()
      toast.success("Video Approved & Payment Released!", {
        id: toastId,
        description: `${formatNgn(project.agreedBudgetNgn)} has been disbursed to ${project.creatorName}. Escrow completed.`,
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Release failed", { id: toastId })
    } finally {
      setReleasingId(null)
    }
  }

  const handleRequestRevision = async (project: CreatorProject) => {
    setReleasingId(project.id)
    const toastId = toast.loading("Sending revision request...")
    try {
      const res = await fetch("/api/kreatr/projects/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          action: "request_revision",
          feedback: "Please hold the promo code on screen 2 seconds longer at the end.",
        }),
      })
      const payload = (await res.json().catch(() => ({}))) as { message?: string }
      if (!res.ok) throw new Error(payload.message || "Revision request failed")
      invalidate()
      toast.info(`Revision requested from ${project.creatorName}`, {
        id: toastId,
        description: "Your funds remain protected in escrow while the creator resubmits.",
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not request revision", { id: toastId })
    } finally {
      setReleasingId(null)
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          Active Creator Jobs &amp; Video Review
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Each job follows 4 clear steps: <strong>1. Lock Payment</strong> → <strong>2. Creator Films Video</strong> → <strong>3. Watch Video &amp; AI Check</strong> → <strong>4. Release Payment</strong>.
        </p>
      </div>

      <div className="space-y-8">
        {projects.map((proj) => {
          const currentStep = getStepNumber(proj.status)
          const ai = proj.submission?.aiEvaluation

          return (
            <Card
              key={proj.id}
              className="overflow-hidden rounded-3xl border-border/60 bg-card/85 p-6 shadow-xs"
            >
              {/* Top Creator & Campaign Info */}
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Campaign: {proj.campaignTitle}
                  </span>
                  <h2 className="mt-0.5 font-display text-xl font-extrabold">
                    Creator: {proj.creatorName} ({proj.creatorHandle})
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-2 text-right">
                    <div className="text-[10px] text-muted-foreground">Agreed Creator Pay</div>
                    <div className="font-display text-base font-black tabular-nums">
                      {formatNgn(proj.agreedBudgetNgn)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual 4-Step Checkpoint Bar */}
              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {[
                  { step: 1, title: "1. Deposit Payment", desc: "Lock money safely" },
                  { step: 2, title: "2. Creator Filming", desc: "Money held in escrow" },
                  { step: 3, title: "3. Review Video", desc: "AI checks instructions" },
                  { step: 4, title: "4. Creator Paid", desc: "Payment released" },
                ].map((item) => {
                  const isDone = currentStep > item.step || proj.status === "APPROVED_AND_RELEASED"
                  const isCurrent =
                    currentStep === item.step && proj.status !== "APPROVED_AND_RELEASED"

                  return (
                    <div
                      key={item.step}
                      className={cn(
                        "rounded-2xl border p-3 text-xs transition-all",
                        isDone
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : isCurrent
                            ? "border-primary bg-primary/10 font-semibold text-foreground ring-2 ring-primary/20"
                            : "border-border/50 bg-background/40 text-muted-foreground"
                      )}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{item.title}</span>
                        {isDone && <CheckCircle2Icon className="size-4 shrink-0 text-emerald-500" />}
                      </div>
                      <div className="mt-0.5 text-[11px] opacity-85">{item.desc}</div>
                    </div>
                  )
                })}
              </div>

              {/* STEP 1 VIEW: Deposit Payment to Start */}
              {proj.status === "AWAITING_FUNDING" && (
                <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-5 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-foreground">
                      Next Step: Lock {formatNgn(proj.agreedBudgetNgn)} in Safe Escrow so {proj.creatorName} can start filming
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Pay by Naira Bank Transfer or USDC. Your money stays safely locked until you watch and approve the finished video.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <FundProjectEscrowModal project={proj} ngnPerUsd={ngnPerUsd} />
                  </div>
                </div>
              )}

              {/* STEP 2 VIEW: Payment Locked, Waiting for Creator Video */}
              {proj.status === "ESCROW_FUNDED" && !proj.submission && (
                <div className="mt-5 flex flex-col justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:flex-row sm:items-center">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <ShieldCheckIcon className="size-4 text-emerald-500" />
                      <span>
                        {formatNgn(proj.agreedBudgetNgn)} is safely locked in escrow!
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {proj.creatorName} has been notified that the payment is secured and is currently filming your video.
                    </p>
                  </div>
                  {proj.escrowFunding && (
                    <a
                      href={`https://sepolia.basescan.org/tx/${proj.escrowFunding.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      View Escrow Receipt <ExternalLinkIcon className="size-3" />
                    </a>
                  )}
                </div>
              )}

              {/* STEP 3 & 4 VIEW: Video Submitted + Plain-English AI Review */}
              {proj.submission && (
                <div className="mt-6 grid gap-6 rounded-3xl border border-primary/30 bg-primary/5 p-5 lg:grid-cols-12">
                  {/* Left: Video Player */}
                  <div className="space-y-3 lg:col-span-5">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <FileVideoIcon className="size-4 text-primary" />
                      <span>1. Watch {proj.creatorName}&apos;s Submitted Video</span>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-border bg-black">
                      <video
                        src={proj.submission.mediaUrl}
                        controls
                        className="h-60 w-full object-cover"
                      />
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-card p-3.5 text-xs">
                      <div className="font-semibold">Creator&apos;s Notes:</div>
                      <p className="mt-1 text-muted-foreground">{proj.submission.captionNotes}</p>
                    </div>
                  </div>

                  {/* Right: Plain-English AI Assistant Checklist & Approve Button */}
                  <div className="flex flex-col justify-between space-y-4 lg:col-span-7">
                    {ai && (
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                              <BotIcon className="size-4" />
                            </div>
                            <div>
                              <h3 className="font-display text-sm font-bold">
                                2. AI Quality Check: Did the Video Follow Your Instructions?
                              </h3>
                              <p className="text-[11px] text-muted-foreground">
                                Our AI watched the video and checked your campaign rules for you
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
                            AI Rating: {ai.overallScore}/100 (Passed)
                          </Badge>
                        </div>

                        <p className="rounded-2xl border border-border/60 bg-card p-3.5 text-xs leading-relaxed">
                          {ai.summary}
                        </p>

                        {/* Plain-English Instruction Checklist */}
                        <div className="space-y-2 rounded-2xl border border-border/60 bg-card p-4 text-xs">
                          <div className="font-bold">
                            Your Campaign Instructions (Checked Automatically):
                          </div>
                          {ai.checklistResults.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2.5 border-t border-border/40 pt-2 first:border-t-0 first:pt-0"
                            >
                              {item.passed ? (
                                <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                              ) : (
                                <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-amber-500" />
                              )}
                              <div>
                                <div className="font-semibold text-foreground">
                                  {item.requirement}
                                </div>
                                <div className="text-[11px] text-muted-foreground">
                                  {item.note}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Final Decision Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-4">
                      {proj.status === "APPROVED_AND_RELEASED" ? (
                        <div className="flex w-full items-center justify-between rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-600 dark:text-emerald-400">
                          <span className="font-bold">
                            ✓ Completed! You approved this video and paid {formatNgn(proj.agreedBudgetNgn)} to {proj.creatorName}.
                          </span>
                          <Link
                            href="/business/attribution"
                            className="font-bold underline"
                          >
                            See Sales From {proj.creatorName}&apos;s Link →
                          </Link>
                        </div>
                      ) : (
                        <>
                          <span className="text-xs text-muted-foreground">
                            Happy with the video? Click Approve to release{" "}
                            <strong>{formatNgn(proj.agreedBudgetNgn)}</strong> from escrow:
                          </span>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={releasingId === proj.id}
                              onClick={() => void handleRequestRevision(proj)}
                              className="gap-1.5 rounded-full text-xs"
                            >
                              <RotateCcwIcon className="size-3.5" />
                              Ask for Changes
                            </Button>
                            <Button
                              size="sm"
                              disabled={releasingId === proj.id}
                              onClick={() => void handleApproveAndRelease(proj)}
                              className="gap-1.5 rounded-full px-5 text-xs font-semibold shadow-sm"
                            >
                              {releasingId === proj.id ? (
                                <Loader2Icon className="size-3.5 animate-spin" />
                              ) : (
                                <SparklesIcon className="size-3.5" />
                              )}
                              Approve Video &amp; Pay {formatNgn(proj.agreedBudgetNgn)}
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
