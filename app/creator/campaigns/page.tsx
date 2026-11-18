"use client"

import * as React from "react"
import {
  CheckCircle2Icon,
  ClipboardCheckIcon,
  Loader2Icon,
  MapPinIcon,
  SparklesIcon,
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
import { Label } from "@/components/ui/label"
import {
  useInvalidateKreatr,
  useKreatrOverview,
  useKreatrSession,
} from "@/hooks/useKreatrData"
import { formatNgn } from "@/lib/format"
import type { Campaign } from "@/types"

export default function CreatorFindCampaignsPage() {
  const { user } = useKreatrSession("creator")
  const { data } = useKreatrOverview()
  const invalidate = useInvalidateKreatr()

  const campaigns = data?.campaigns ?? []
  const applications = data?.applications ?? []

  const [applyingCampaign, setApplyingCampaign] = React.useState<Campaign | null>(null)
  const [pitch, setPitch] = React.useState(
    "I have a full 4K lighting & macro setup and can deliver 3 high-retention hooks + share my attribution code across local community groups within 48 hours of escrow lock."
  )
  const [submitting, setSubmitting] = React.useState(false)

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!applyingCampaign) return
    if (!pitch.trim()) {
      toast.error("Please provide a brief pitch for your application.")
      return
    }
    setSubmitting(true)
    const toastId = toast.loading("Submitting application to brand...")
    try {
      const res = await fetch("/api/kreatr/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "apply",
          campaignId: applyingCampaign.id,
          creatorId: user.userId || "cr-adaobi",
          pitch: pitch.trim(),
          proposedRateNgn: applyingCampaign.budgetPerCreatorNgn,
        }),
      })
      const payload = (await res.json().catch(() => ({}))) as { message?: string }
      if (!res.ok) throw new Error(payload.message || "Application failed")
      invalidate()
      toast.success("Application Submitted Successfully!", {
        id: toastId,
        description: `Applied to "${applyingCampaign.title}". The business has been notified to review your credibility score.`,
      })
      setApplyingCampaign(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to apply", { id: toastId })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          Find Verified Brand Campaigns
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Apply to campaigns backed by Base Sepolia Escrow Vaults. Your 5-pillar credibility profile automatically qualifies you.
        </p>
      </div>

      <div className="space-y-6">
        {campaigns.map((camp) => {
          const myApp = applications.find(
            (a) => a.campaignId === camp.id && a.creatorId === (user.userId || "cr-adaobi")
          )

          return (
            <Card
              key={camp.id}
              className="rounded-3xl border-border/60 bg-card/80 p-6 shadow-xs"
            >
              <div className="flex flex-col justify-between gap-4 border-b border-border/50 pb-5 lg:flex-row lg:items-center">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-primary/15 text-primary text-[10px]">
                      {camp.businessName}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {camp.businessCategory}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPinIcon className="size-3.5 text-primary" />
                      {camp.businessLocation}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-extrabold">{camp.title}</h2>
                  <p className="max-w-3xl text-xs text-muted-foreground">{camp.summary}</p>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-2 rounded-2xl border border-primary/25 bg-primary/5 p-4 lg:items-end">
                  <div className="text-[11px] text-muted-foreground">Guaranteed Escrow Payout</div>
                  <div className="font-display text-2xl font-black">
                    {formatNgn(camp.budgetPerCreatorNgn)}
                  </div>
                  <div className="font-mono text-xs text-primary">
                    ≈ ${camp.budgetPerCreatorUsdc.toFixed(2)} USDC · Vault #{camp.onChainVaultId}
                  </div>

                  {myApp ? (
                    <Badge className="mt-1 bg-emerald-500/15 text-emerald-500 text-xs">
                      <CheckCircle2Icon className="mr-1 size-3.5" />
                      Applied ({myApp.status} · {myApp.matchScore}% Match)
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setApplyingCampaign(camp)}
                      className="mt-1 gap-1.5 rounded-full text-xs font-semibold"
                    >
                      <SparklesIcon className="size-3.5" />
                      Apply with Pitch
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border/50 bg-background/60 p-4">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-bold">
                    <ClipboardCheckIcon className="size-4 text-primary" />
                    <span>Deliverable Brief Requirements</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {camp.briefRequirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2Icon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-border/50 bg-background/60 p-4 text-xs">
                  <div className="mb-2 font-bold">Required Skills &amp; Cities</div>
                  <p className="text-muted-foreground">
                    Cities: <strong className="text-foreground">{camp.eligibility.locations.join(" · ")}</strong>
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {camp.eligibility.requiredSkills.map((sk) => (
                      <Badge key={sk} variant="secondary" className="text-[10px]">
                        {sk}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Dialog
        open={Boolean(applyingCampaign)}
        onOpenChange={(val) => {
          if (!val) setApplyingCampaign(null)
        }}
      >
        <DialogContent className="sm:max-w-lg">
          {applyingCampaign && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-lg">
                  Apply to {applyingCampaign.title}
                </DialogTitle>
                <DialogDescription>
                  Your 5-Pillar Credibility profile will be matched automatically for {applyingCampaign.businessName}.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={(e) => void handleApply(e)} className="space-y-3.5">
                <div className="space-y-1">
                  <Label htmlFor="c-pitch">Your Creative Pitch &amp; Turnaround Plan</Label>
                  <textarea
                    id="c-pitch"
                    rows={4}
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card p-3 text-xs"
                    required
                  />
                </div>

                <Button type="submit" disabled={submitting} className="w-full rounded-full">
                  {submitting && <Loader2Icon className="size-4 animate-spin" />}
                  Submit Application
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
