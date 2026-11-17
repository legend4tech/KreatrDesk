"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle2Icon,
  ClipboardCheckIcon,
  Loader2Icon,
  MapPinIcon,
  PlusIcon,
  UserCheckIcon,
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useInvalidateKreatr, useKreatrOverview } from "@/hooks/useKreatrData"
import { useRoqquRates } from "@/hooks/useRoqquRates"
import { formatNgn } from "@/lib/format"

export default function BusinessCampaignsPage() {
  const router = useRouter()
  const { data } = useKreatrOverview()
  const { data: ratesData } = useRoqquRates()
  const invalidate = useInvalidateKreatr()

  const ngnPerUsd = ratesData?.ngnPerUsd ?? 1375
  const campaigns = data?.campaigns ?? []
  const applications = data?.applications ?? []

  const [createOpen, setCreateOpen] = React.useState(false)
  const [creating, setCreating] = React.useState(false)
  const [selectingAppId, setSelectingAppId] = React.useState<string | null>(null)

  const [title, setTitle] = React.useState("")
  const [summary, setSummary] = React.useState("")
  const [budgetNgn, setBudgetNgn] = React.useState("120000")
  const [creatorsNeeded, setCreatorsNeeded] = React.useState("2")
  const [deadline, setDeadline] = React.useState("2026-12-12")
  const [briefText, setBriefText] = React.useState(
    "Show product label clearly within first 3 seconds\nDemonstrate authentic usage in natural daylight\nMention unique referral promo code verbally and on screen"
  )
  const [skillsText, setSkillsText] = React.useState(
    "UGC Video Production, Direct-Response Hooks, Pidgin Voiceover"
  )
  const [locationsText, setLocationsText] = React.useState(
    "Lagos (Yaba / Lekki), Abuja (Wuse II / Maitama)"
  )

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch("/api/kreatr/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          budgetPerCreatorNgn: Number(budgetNgn) || 120000,
          ngnPerUsd,
          creatorsNeeded: Number(creatorsNeeded) || 2,
          deadline,
          briefRequirements: briefText
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          requiredSkills: skillsText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          locations: locationsText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      })
      if (!res.ok) throw new Error("Failed to create campaign")
      invalidate()
      toast.success("Campaign saved to MongoDB Atlas!")
      setTitle("")
      setSummary("")
      setCreateOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed")
    } finally {
      setCreating(false)
    }
  }

  const handleSelectCreator = async (applicationId: string) => {
    setSelectingAppId(applicationId)
    try {
      const res = await fetch("/api/kreatr/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "select",
          applicationId,
          ngnPerUsd,
        }),
      })
      if (!res.ok) throw new Error("Failed to select creator")
      invalidate()
      toast.success("Creator selected! Project Workspace & Referral Code created.")
      router.push("/business/projects")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Selection failed")
    } finally {
      setSelectingAppId(null)
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            My Campaigns &amp; Qualified Applicants
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create campaigns with structured eligibility rules and select top-matched creators to initialize escrow projects.
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-1.5 rounded-full px-5 font-semibold">
                <PlusIcon className="size-4" />
                Create New Campaign
              </Button>
            }
          />
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-lg">
                Create UGC &amp; Community Campaign
              </DialogTitle>
              <DialogDescription>
                Saved directly to MongoDB Atlas (`kreatrdesk`) and paired with a Base Sepolia Escrow Vault.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => void handleCreateCampaign(e)} className="space-y-3.5">
              <div className="space-y-1">
                <Label htmlFor="c-title">Campaign Title</Label>
                <Input
                  id="c-title"
                  placeholder="e.g. Lagos Cold-Brew Tasting & 60s UGC Reels"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="c-sum">Campaign Summary</Label>
                <Input
                  id="c-sum"
                  placeholder="What is the product and campaign goal?"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <Label htmlFor="c-bud">Budget / Creator (NGN)</Label>
                  <Input
                    id="c-bud"
                    type="number"
                    value={budgetNgn}
                    onChange={(e) => setBudgetNgn(e.target.value)}
                    className="font-mono"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="c-cnt">Creators Needed</Label>
                  <Input
                    id="c-cnt"
                    type="number"
                    min={1}
                    value={creatorsNeeded}
                    onChange={(e) => setCreatorsNeeded(e.target.value)}
                    className="font-mono"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="c-dl">Deadline</Label>
                  <Input
                    id="c-dl"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="c-brief">AI Evaluation Brief Checklist (one per line)</Label>
                <textarea
                  id="c-brief"
                  rows={3}
                  value={briefText}
                  onChange={(e) => setBriefText(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card p-3 text-xs"
                  required
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="c-sk">Required Skills</Label>
                  <Input
                    id="c-sk"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="c-loc">Target Locations</Label>
                  <Input
                    id="c-loc"
                    value={locationsText}
                    onChange={(e) => setLocationsText(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" disabled={creating} className="w-full rounded-full">
                {creating && <Loader2Icon className="size-4 animate-spin" />}
                Publish Campaign
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaigns List */}
      <div className="space-y-6">
        {campaigns.map((camp) => {
          const campApps = applications.filter((a) => a.campaignId === camp.id)

          return (
            <Card
              key={camp.id}
              className="rounded-3xl border-border/60 bg-card/80 p-6 shadow-xs"
            >
              <div className="flex flex-col justify-between gap-4 border-b border-border/50 pb-5 lg:flex-row lg:items-center">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {camp.businessCategory}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPinIcon className="size-3.5 text-primary" />
                      {camp.businessLocation}
                    </span>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      Escrow Vault #{camp.onChainVaultId}
                    </Badge>
                  </div>
                  <h2 className="font-display text-xl font-extrabold">{camp.title}</h2>
                  <p className="max-w-3xl text-xs text-muted-foreground">{camp.summary}</p>
                </div>

                <div className="rounded-2xl border border-primary/25 bg-primary/5 px-5 py-3 text-right">
                  <div className="text-[11px] text-muted-foreground">Budget Per Creator</div>
                  <div className="font-display text-xl font-black">
                    {formatNgn(camp.budgetPerCreatorNgn)}
                  </div>
                  <div className="font-mono text-xs text-primary">
                    ≈ ${camp.budgetPerCreatorUsdc.toFixed(2)} USDC · {camp.eligibility.creatorsNeeded} Slots
                  </div>
                </div>
              </div>

              {/* Brief Checklist Summary */}
              <div className="mt-4 rounded-2xl border border-border/50 bg-background/60 p-4">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-bold">
                  <ClipboardCheckIcon className="size-4 text-primary" />
                  <span>Campaign Brief Requirements (Checked by AI Evaluator)</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {camp.briefRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2Icon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applicants Section */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold">
                    Creator Applications ({campApps.length})
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Auto-ranked by 5-Pillar Skill &amp; Location Eligibility
                  </span>
                </div>

                {campApps.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/60 p-5 text-center text-xs text-muted-foreground">
                    No applications yet. Switch to Creator Studio to apply!
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {campApps.map((app) => (
                      <div
                        key={app.id}
                        className="flex flex-col justify-between rounded-2xl border border-border/60 bg-background/80 p-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-display text-sm font-bold">
                                {app.creatorName}
                              </span>{" "}
                              <span className="font-mono text-xs text-muted-foreground">
                                {app.creatorHandle}
                              </span>
                              <div className="text-[11px] text-muted-foreground">
                                {app.creatorLocation}
                              </div>
                            </div>
                            <Badge className="bg-emerald-500/15 font-mono text-xs text-emerald-500">
                              {app.matchScore}% Match
                            </Badge>
                          </div>

                          <p className="text-xs text-muted-foreground">&ldquo;{app.pitch}&rdquo;</p>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                          <span className="font-mono text-xs font-bold text-primary">
                            {formatNgn(app.proposedRateNgn)}
                          </span>

                          {app.status === "SELECTED" ? (
                            <Badge
                              variant="outline"
                              className="border-emerald-500/40 bg-emerald-500/10 text-emerald-500 text-[10px]"
                            >
                              <CheckCircle2Icon className="mr-1 size-3" />
                              Selected · Project Active
                            </Badge>
                          ) : (
                            <Button
                              size="xs"
                              disabled={selectingAppId === app.id}
                              onClick={() => void handleSelectCreator(app.id)}
                              className="gap-1.5 rounded-full text-xs font-semibold"
                            >
                              {selectingAppId === app.id ? (
                                <Loader2Icon className="size-3 animate-spin" />
                              ) : (
                                <UserCheckIcon className="size-3.5" />
                              )}
                              Accept &amp; Initialize Escrow
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
