"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  AwardIcon,
  BriefcaseIcon,
  CheckCircle2Icon,
  FolderKanbanIcon,
  LinkIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  UploadCloudIcon,
  VideoIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useKreatrOverview, useKreatrSession } from "@/hooks/useKreatrData"
import { formatNgn } from "@/lib/format"

export default function CreatorDashboardPage() {
  const { user } = useKreatrSession("creator")
  const { data } = useKreatrOverview()

  const creators = data?.creators ?? []
  const myProfile =
    creators.find((c) => c.id === user.userId) ?? creators[0]

  const myProjects = (data?.projects ?? []).filter(
    (p) => !myProfile || p.creatorId === myProfile.id
  )
  const openCampaigns = data?.campaigns ?? []

  const lockedForMeNgn = myProjects
    .filter((p) => p.status !== "AWAITING_FUNDING" && p.status !== "APPROVED_AND_RELEASED")
    .reduce((acc, p) => acc + p.agreedBudgetNgn, 0)

  const mySalesCount = myProjects.reduce(
    (acc, p) => acc + p.attribution.confirmedConversions,
    0
  )

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Badge
            variant="outline"
            className="mb-2 border-primary/35 bg-primary/10 text-xs text-primary"
          >
            Creator Studio &amp; Step-by-Step Guide
          </Badge>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Welcome, {myProfile?.name || user.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Get hired based on your video quality (not follower count), see that your pay is locked in safe escrow before filming, and earn more from your promo links.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/creator/portfolio">
            <Button variant="outline" size="sm" className="gap-1.5 rounded-full text-xs">
              <VideoIcon className="size-3.5" />
              Add Sample Video
            </Button>
          </Link>
          <Link href="/creator/campaigns">
            <Button size="sm" className="gap-1.5 rounded-full px-5 text-xs font-semibold">
              <BriefcaseIcon className="size-3.5" />
              Find Brand Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* SECTION 1: Creator 4-Step Guide */}
      <Card className="rounded-3xl border-primary/30 bg-primary/5 p-6">
        <div className="mb-4">
          <h2 className="font-display text-lg font-extrabold">
            How You Earn on KreatrDesk in 4 Simple Steps
          </h2>
          <p className="text-xs text-muted-foreground">
            You never have to worry about brands ghosting you after you deliver a video.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-mono text-xs font-bold text-primary">
                  STEP 1
                </span>
                <VideoIcon className="size-4 text-primary" />
              </div>
              <h3 className="font-display text-sm font-bold">
                1. Show Your Sample Videos
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Upload sample videos so brands see your video quality and reliability instead of judging your follower count.
              </p>
            </div>
            <Link href="/creator/portfolio" className="mt-4 block">
              <Button variant="secondary" size="xs" className="w-full justify-between rounded-xl text-xs font-semibold">
                <span>My Sample Videos</span>
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-mono text-xs font-bold text-primary">
                  STEP 2
                </span>
                <BriefcaseIcon className="size-4 text-primary" />
              </div>
              <h3 className="font-display text-sm font-bold">
                2. Apply to Brand Jobs
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Browse open campaigns from verified businesses and send a quick pitch on how you will shoot their video.
              </p>
            </div>
            <Link href="/creator/campaigns" className="mt-4 block">
              <Button variant="secondary" size="xs" className="w-full justify-between rounded-xl text-xs font-semibold">
                <span>{openCampaigns.length} Open Brand Jobs</span>
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-mono text-xs font-bold text-primary">
                  STEP 3
                </span>
                <UploadCloudIcon className="size-4 text-primary" />
              </div>
              <h3 className="font-display text-sm font-bold">
                3. Submit Video &amp; Get Paid
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Once the brand locks your pay in escrow, film the video, let our AI check it, and receive your payout on approval.
              </p>
            </div>
            <Link href="/creator/projects" className="mt-4 block">
              <Button variant="secondary" size="xs" className="w-full justify-between rounded-xl text-xs font-semibold">
                <span>{myProjects.length} Active Jobs</span>
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-mono text-xs font-bold text-primary">
                  STEP 4
                </span>
                <LinkIcon className="size-4 text-emerald-500" />
              </div>
              <h3 className="font-display text-sm font-bold">
                4. Share Your Promo Link
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Share your unique promo code with your community to prove how many real sales you generated for the brand.
              </p>
            </div>
            <Link href="/creator/referrals" className="mt-4 block">
              <Button variant="secondary" size="xs" className="w-full justify-between rounded-xl text-xs font-semibold">
                <span>{mySalesCount} Sales Tracked</span>
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* SECTION 2: 3 Simple Summary Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="rounded-3xl border-border/60 bg-card/80">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total Money Earned</span>
              <TrendingUpIcon className="size-4 text-emerald-500" />
            </div>
            <CardTitle className="font-display text-2xl font-black tabular-nums">
              {formatNgn(myProfile?.totalEarnedNgn ?? 1420000)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Across {myProfile?.completedProjectsCount ?? 14} completed brand videos
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card/80">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Money Locked in Escrow for Me</span>
              <ShieldCheckIcon className="size-4 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl font-black text-primary tabular-nums">
              {formatNgn(lockedForMeNgn)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Guaranteed &amp; waiting for your video approval
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card/80">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>My Video Quality Rating</span>
              <AwardIcon className="size-4 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl font-black">
              {myProfile?.credibility.creativeAbility ?? 96} / 100
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-emerald-500">
            High-Skill Verified Creator
          </CardContent>
        </Card>
      </div>

      {/* SECTION 3: My Skill Ratings + My Current Brand Jobs */}
      <div className="grid gap-6 lg:grid-cols-12">
        {myProfile && (
          <Card className="rounded-3xl border-border/60 bg-card/80 p-6 shadow-xs lg:col-span-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={myProfile.avatar}
                  alt={myProfile.name}
                  className="size-12 rounded-2xl object-cover"
                />
                <div>
                  <h2 className="font-display text-base font-bold">{myProfile.name}</h2>
                  <p className="text-xs text-muted-foreground">{myProfile.location}</p>
                </div>
              </div>
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-xs text-primary">
                Skill Ratings
              </Badge>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { label: "1. Video Quality & Editing", val: myProfile.credibility.creativeAbility },
                { label: "2. Community Referrals", val: myProfile.credibility.communityActivation },
                { label: "3. On-Time Delivery", val: myProfile.credibility.deliveryReliability },
                { label: "4. Sales Generated for Brands", val: myProfile.credibility.campaignPerformance },
                { label: "5. Social Reach", val: myProfile.credibility.audienceInfluence },
              ].map((p) => (
                <div key={p.label} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{p.label}</span>
                    <span className="font-mono font-bold">{p.val}/100</span>
                  </div>
                  <Progress value={p.val} className="h-1.5" />
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="space-y-4 lg:col-span-7">
          <h2 className="font-display text-lg font-bold">
            My Current Brand Jobs
          </h2>

          {myProjects.map((proj) => (
            <Card
              key={proj.id}
              className="rounded-3xl border-border/60 bg-card/80 p-5 shadow-xs"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-primary/40 bg-primary/10 text-xs text-primary"
                    >
                      {proj.status === "AWAITING_FUNDING"
                        ? "Waiting for Brand to Lock Payment"
                        : proj.status === "ESCROW_FUNDED"
                          ? "Payment Locked — Ready to Upload Video"
                          : proj.status === "AI_EVALUATED"
                            ? "Video Submitted (AI Checked ✓)"
                            : "Completed & Paid ✓"}
                    </Badge>
                  </div>
                  <h3 className="font-display text-base font-bold">{proj.campaignTitle}</h3>
                  <p className="text-xs text-muted-foreground">
                    Brand: {proj.businessName} · Your Pay:{" "}
                    <strong className="text-foreground">{formatNgn(proj.agreedBudgetNgn)}</strong>
                  </p>
                </div>

                <Link href="/creator/projects">
                  <Button size="sm" className="gap-1.5 rounded-full text-xs font-semibold">
                    <FolderKanbanIcon className="size-3.5" />
                    Open Job
                  </Button>
                </Link>
              </div>
            </Card>
          ))}

          <Card className="rounded-3xl border-primary/25 bg-primary/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <CheckCircle2Icon className="size-4" />
                  <span>{openCampaigns.length} Brand Campaigns Are Hiring Creators Right Now</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Apply in 1 click — brands see your video quality rating immediately.
                </p>
              </div>
              <Link href="/creator/campaigns">
                <Button size="sm" variant="outline" className="rounded-full text-xs font-semibold">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
