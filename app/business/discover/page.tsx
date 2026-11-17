"use client"

import * as React from "react"
import Link from "next/link"
import {
  AwardIcon,
  CheckCircle2Icon,
  FilterIcon,
  MapPinIcon,
  PlayIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react"

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
import { Progress } from "@/components/ui/progress"
import { useKreatrOverview } from "@/hooks/useKreatrData"
import { useRoqquRates } from "@/hooks/useRoqquRates"
import { formatNgn } from "@/lib/format"
import type { CreatorProfile, PortfolioSample } from "@/types"

export default function BusinessCreatorDiscoveryPage() {
  const { data } = useKreatrOverview()
  const { data: ratesData } = useRoqquRates()

  const ngnPerUsd = ratesData?.ngnPerUsd ?? 1375
  const samples = data?.portfolioSamples ?? []
  const creators = data?.creators ?? []

  const [search, setSearch] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("ALL")
  const [selectedLocation, setSelectedLocation] = React.useState("ALL")
  const [selectedCreator, setSelectedCreator] = React.useState<CreatorProfile | null>(null)
  const [playingSample, setPlayingSample] = React.useState<PortfolioSample | null>(null)

  const categories = [
    "ALL",
    "Skincare & Beauty",
    "Food & Beverage",
    "Fintech & Apps",
    "Hospitality & Dining",
  ]
  const locations = [
    "ALL",
    "Lagos (Yaba / Lekki)",
    "Lagos (Mainland / Akoka)",
    "Abuja (Wuse II / Maitama)",
    "Enugu (Independence Layout)",
  ]

  const filteredSamples = samples.filter((s) => {
    const matchCategory = selectedCategory === "ALL" || s.category === selectedCategory
    const matchLocation = selectedLocation === "ALL" || s.creatorLocation === selectedLocation
    const q = search.trim().toLowerCase()
    const matchSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.creatorName.toLowerCase().includes(q) ||
      s.skills.some((sk) => sk.toLowerCase().includes(q)) ||
      s.creatorLocation.toLowerCase().includes(q)
    return matchCategory && matchLocation && matchSearch
  })

  return (
    <div className="space-y-8 pb-12">
      {/* Clean Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Browse Local Creators &amp; Sample Videos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Click the green Play button on any card to watch the creator&apos;s sample video right here, and check their skill ratings before hiring.
          </p>
        </div>

        <Link href="/business/campaigns">
          <Button size="sm" className="gap-2 rounded-full px-5 font-semibold">
            <SparklesIcon className="size-4" />
            Post a New Campaign
          </Button>
        </Link>
      </div>

      {/* Clean Search & Filter Bar */}
      <div className="grid gap-3 rounded-2xl border border-border/70 bg-card/70 p-4 md:grid-cols-3">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by skill (Pidgin, Unboxing, Vox-Pop) or creator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <FilterIcon className="size-4 shrink-0 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "ALL" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc === "ALL" ? "All Locations (Lagos, Abuja, Enugu)" : loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Spacious 2-Column Discovery Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredSamples.map((sample) => {
          const creatorObj =
            creators.find((c) => c.id === sample.creatorId) ?? creators[0]
          const usdcEq = Math.round((sample.rateNgn / ngnPerUsd) * 100) / 100

          return (
            <Card
              key={sample.id}
              className="flex flex-col justify-between overflow-hidden rounded-3xl border-border/60 bg-card/80 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div>
                {/* Clickable Video Thumbnail */}
                <div
                  onClick={() => setPlayingSample(sample)}
                  className="group relative h-60 w-full cursor-pointer overflow-hidden bg-muted"
                >
                  <img
                    src={sample.thumbnailUrl}
                    alt={sample.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      {sample.category}
                    </Badge>
                  </div>

                  <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-4 text-white">
                    <div>
                      <span className="inline-flex items-center gap-1 text-xs text-white/80">
                        <MapPinIcon className="size-3.5 text-primary" />
                        {sample.creatorLocation}
                      </span>
                      <h3 className="mt-1 font-display text-base font-bold leading-snug">
                        {sample.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPlayingSample(sample)
                      }}
                      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-110"
                      title="Watch sample video"
                    >
                      <PlayIcon className="size-5 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={sample.creatorAvatar}
                        alt={sample.creatorName}
                        className="size-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-display text-sm font-bold text-foreground">
                          {sample.creatorName}
                        </div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {sample.creatorHandle}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-display text-base font-extrabold text-foreground">
                        {formatNgn(sample.rateNgn)}
                      </div>
                      <div className="font-mono text-xs text-primary">
                        ≈ ${usdcEq} USD
                      </div>
                    </div>
                  </div>

                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {sample.description}
                  </p>

                  {/* 3-Metric Credibility Strip */}
                  <div className="grid grid-cols-3 gap-2.5 rounded-2xl border border-border/60 bg-background/60 p-3 text-center">
                    <div>
                      <div className="font-mono text-sm font-bold text-primary">
                        {sample.credibility.creativeAbility}%
                      </div>
                      <div className="text-[11px] text-muted-foreground">Video Quality</div>
                    </div>
                    <div>
                      <div className="font-mono text-sm font-bold text-foreground">
                        {sample.credibility.communityActivation}%
                      </div>
                      <div className="text-[11px] text-muted-foreground">Customer Reach</div>
                    </div>
                    <div>
                      <div className="font-mono text-sm font-bold text-emerald-500">
                        {sample.credibility.deliveryReliability}%
                      </div>
                      <div className="text-[11px] text-muted-foreground">On-Time Delivery</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between border-t border-border/50 px-6 py-4">
                <div className="flex flex-wrap gap-1.5">
                  {sample.skills.slice(0, 2).map((sk) => (
                    <Badge key={sk} variant="secondary" className="text-[11px]">
                      {sk}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedCreator(creatorObj)}
                    className="rounded-full text-xs"
                  >
                    <AwardIcon className="mr-1.5 size-3.5 text-primary" />
                    Skill Scorecard
                  </Button>
                  <Link href="/business/campaigns">
                    <Button size="sm" className="rounded-full text-xs font-semibold">
                      Hire Creator
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* IN-APP VIDEO PLAYER MODAL */}
      <Dialog
        open={Boolean(playingSample)}
        onOpenChange={(val) => {
          if (!val) setPlayingSample(null)
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          {playingSample && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/15 text-primary text-xs">
                    {playingSample.category}
                  </Badge>
                  <span className="font-mono text-xs font-bold text-primary">
                    Rate: {formatNgn(playingSample.rateNgn)}
                  </span>
                </div>
                <DialogTitle className="mt-1 font-display text-lg">
                  {playingSample.title}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  By {playingSample.creatorName} ({playingSample.creatorHandle}) · {playingSample.creatorLocation}
                </DialogDescription>
              </DialogHeader>

              <div className="overflow-hidden rounded-2xl border border-border bg-black">
                <video
                  key={playingSample.mediaUrl}
                  src={playingSample.mediaUrl}
                  controls autoPlay muted loop playsInline preload="auto"
                  className="max-h-[420px] w-full object-contain"
                />
              </div>

              <div className="flex flex-col justify-between gap-3 pt-2 sm:flex-row sm:items-center">
                <p className="text-xs text-muted-foreground">
                  {playingSample.description}
                </p>
                <Link href="/business/campaigns" className="shrink-0">
                  <Button size="sm" className="rounded-full px-5 text-xs font-semibold">
                    Hire {playingSample.creatorName.split(" ")[0]} for a Campaign
                  </Button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Full 5-Pillar Creator Credibility Modal */}
      <Dialog
        open={Boolean(selectedCreator)}
        onOpenChange={(val) => {
          if (!val) setSelectedCreator(null)
        }}
      >
        <DialogContent className="sm:max-w-xl">
          {selectedCreator && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedCreator.avatar}
                    alt={selectedCreator.name}
                    className="size-14 rounded-2xl object-cover"
                  />
                  <div>
                    <DialogTitle className="font-display text-xl">
                      {selectedCreator.name} ({selectedCreator.handle})
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      {selectedCreator.location} · Speaks {selectedCreator.languages.join(", ")}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {selectedCreator.bio}
                </p>

                <div className="grid grid-cols-3 gap-2.5 rounded-2xl border border-border/60 bg-muted/30 p-3 text-center text-xs">
                  <div>
                    <div className="font-display font-bold text-foreground">
                      {selectedCreator.completedProjectsCount}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Completed Videos</div>
                  </div>
                  <div>
                    <div className="font-display font-bold text-primary">
                      {formatNgn(selectedCreator.startingRateNgn)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Starting Rate</div>
                  </div>
                  <div>
                    <div className="font-display font-bold text-emerald-500">
                      {formatNgn(selectedCreator.totalEarnedNgn)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Total Paid Out</div>
                  </div>
                </div>

                <div className="space-y-2.5 rounded-2xl border border-primary/25 bg-primary/5 p-4">
                  <div className="text-xs font-bold">
                    5-Pillar Creator Skill Breakdown
                  </div>
                  {[
                    {
                      label: "1. Video Quality & Editing Craft",
                      val: selectedCreator.credibility.creativeAbility,
                    },
                    {
                      label: "2. Community Referrals & Customer Reach",
                      val: selectedCreator.credibility.communityActivation,
                    },
                    {
                      label: "3. On-Time Delivery Reliability",
                      val: selectedCreator.credibility.deliveryReliability,
                    },
                    {
                      label: "4. Customer Sales Generated",
                      val: selectedCreator.credibility.campaignPerformance,
                    },
                    {
                      label: "5. Social Reach",
                      val: selectedCreator.credibility.audienceInfluence,
                    },
                  ].map((pillar) => (
                    <div key={pillar.label} className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{pillar.label}</span>
                        <span className="font-mono font-bold text-foreground">{pillar.val}/100</span>
                      </div>
                      <Progress value={pillar.val} className="h-1.5" />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle2Icon className="size-4 text-emerald-500" />
                    Verified for Safe Escrow Payouts
                  </span>
                  <Link href="/business/campaigns">
                    <Button size="sm" className="rounded-full text-xs font-semibold">
                      Hire {selectedCreator.name.split(" ")[0]}
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
