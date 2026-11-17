"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  LockIcon,
  PlayCircleIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  UserPlusIcon,
} from "lucide-react"

import { FundProjectEscrowModal } from "@/components/kreatr/FundProjectEscrowModal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useKreatrOverview, useKreatrSession } from "@/hooks/useKreatrData"
import { useRoqquRates } from "@/hooks/useRoqquRates"
import { formatNgn } from "@/lib/format"

export default function BusinessDashboardPage() {
  const { user } = useKreatrSession("business")
  const { data } = useKreatrOverview()
  const { data: ratesData } = useRoqquRates()

  const ngnPerUsd = ratesData?.ngnPerUsd ?? 1375
  const projects = data?.projects ?? []
  const campaigns = data?.campaigns ?? []
  const applications = data?.applications ?? []

  const pendingApps = applications.filter((a) => a.status === "PENDING")
  const awaitingFundingProjects = projects.filter(
    (p) => p.status === "AWAITING_FUNDING"
  )
  const readyForReviewProjects = projects.filter(
    (p) => p.status === "AI_EVALUATED" || p.status === "DELIVERABLE_SUBMITTED"
  )

  const totalEscrowLockedNgn = projects
    .filter((p) => p.status !== "AWAITING_FUNDING" && p.status !== "APPROVED_AND_RELEASED")
    .reduce((acc, p) => acc + p.agreedBudgetNgn, 0)

  const totalRevenueNgn = projects.reduce(
    (acc, p) => acc + p.attribution.revenueGeneratedNgn,
    0
  )
  const totalConversions = projects.reduce(
    (acc, p) => acc + p.attribution.confirmedConversions,
    0
  )
  const totalClicks = projects.reduce((acc, p) => acc + p.attribution.clicks, 0)

  return (
    <div className="space-y-8 pb-12">
      {/* Friendly Welcome Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Badge
            variant="outline"
            className="mb-2 border-primary/35 bg-primary/10 text-xs text-primary"
          >
            Business Home &amp; Step-by-Step Guide
          </Badge>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Welcome, {user.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hire skilled local creators to make promotional videos for your products, pay them safely with escrow, and see how many customer sales they bring in.
          </p>
        </div>

        <Link href="/business/campaigns">
          <Button size="sm" className="gap-2 rounded-full px-5 font-semibold">
            <PlusCircleIcon className="size-4" />
            Post a New Campaign
          </Button>
        </Link>
      </div>

      {/* SECTION 1: Visual 4-Step Guide (How KreatrDesk Works) */}
      <Card className="rounded-3xl border-primary/30 bg-primary/5 p-6">
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-lg font-extrabold">
              How KreatrDesk Works in 4 Simple Steps
            </h2>
            <p className="text-xs text-muted-foreground">
              Click any step below to jump straight to that part of your workflow.
            </p>
          </div>
          <Link href="/business/discover">
            <Button variant="outline" size="xs" className="rounded-full text-xs">
              Or Browse Creator Videos First →
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Step 1 */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-mono text-xs font-bold text-primary">
                  STEP 1
                </span>
                <PlusCircleIcon className="size-4 text-primary" />
              </div>
              <h3 className="font-display text-sm font-bold">
                1. Post a Campaign
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Describe the video you need, the instructions creators must follow, and how much you will pay per creator.
              </p>
            </div>
            <Link href="/business/campaigns" className="mt-4 block">
              <Button variant="secondary" size="xs" className="w-full justify-between rounded-xl text-xs font-semibold">
                <span>{campaigns.length} Active Campaigns</span>
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </Link>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-mono text-xs font-bold text-primary">
                  STEP 2
                </span>
                <LockIcon className="size-4 text-primary" />
              </div>
              <h3 className="font-display text-sm font-bold">
                2. Hire &amp; Lock Payment
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Pick an applicant and deposit their payment into safe escrow. The creator sees the money is ready before filming.
              </p>
            </div>
            <Link href="/business/campaigns" className="mt-4 block">
              <Button variant="secondary" size="xs" className="w-full justify-between rounded-xl text-xs font-semibold">
                <span>{pendingApps.length} Creators Applied</span>
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </Link>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-mono text-xs font-bold text-primary">
                  STEP 3
                </span>
                <PlayCircleIcon className="size-4 text-primary" />
              </div>
              <h3 className="font-display text-sm font-bold">
                3. Review Video &amp; Pay
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Our AI checks if the creator&apos;s video followed your instructions. You watch it and click Approve to pay them.
              </p>
            </div>
            <Link href="/business/projects" className="mt-4 block">
              <Button variant="secondary" size="xs" className="w-full justify-between rounded-xl text-xs font-semibold">
                <span>{readyForReviewProjects.length} Video Ready to Review</span>
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </Link>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-mono text-xs font-bold text-primary">
                  STEP 4
                </span>
                <ShoppingBagIcon className="size-4 text-emerald-500" />
              </div>
              <h3 className="font-display text-sm font-bold">
                4. Track Customer Sales
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Every hired creator gets a special promo link. Track how many customers clicked, asked questions, and bought.
              </p>
            </div>
            <Link href="/business/attribution" className="mt-4 block">
              <Button variant="secondary" size="xs" className="w-full justify-between rounded-xl text-xs font-semibold">
                <span>{totalConversions} Confirmed Sales</span>
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* SECTION 2: Plain-English Action Items Waiting on You Right Now */}
      <div className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-bold">
            What Needs Your Attention Right Now
          </h2>
          <p className="text-xs text-muted-foreground">
            Simple next steps for your active creator jobs.
          </p>
        </div>

        <div className="grid gap-4">
          {readyForReviewProjects.map((proj) => (
            <Card
              key={proj.id}
              className="rounded-3xl border-primary/40 bg-card p-5 shadow-xs"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      Step 3: Video Ready for Your Approval
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-500">
                      ✓ AI Check Passed ({proj.submission?.aiEvaluation?.overallScore}/100)
                    </span>
                    {proj.escrowFunding && (
                      <a
                        href={`https://sepolia.basescan.org/tx/${proj.escrowFunding.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition hover:text-primary"
                        title="Verify escrow deposit on BaseScan"
                      >
                        <span>Escrow on BaseScan</span>
                        <ExternalLinkIcon className="size-3" />
                      </a>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-bold">
                    {proj.creatorName} uploaded her finished video for &ldquo;{proj.campaignTitle}&rdquo;
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Our AI checked all {proj.briefRequirements.length} of your instructions and confirmed they were followed. Watch the video and release her {formatNgn(proj.agreedBudgetNgn)} payment.
                  </p>
                </div>

                <Link href="/business/projects" className="shrink-0">
                  <Button size="sm" className="gap-2 rounded-full px-5 font-semibold">
                    <PlayCircleIcon className="size-4" />
                    Watch Video &amp; Release {formatNgn(proj.agreedBudgetNgn)}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}

          {awaitingFundingProjects.map((proj) => (
            <Card
              key={proj.id}
              className="rounded-3xl border-amber-500/40 bg-card p-5 shadow-xs"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-1.5">
                  <Badge
                    variant="outline"
                    className="border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs"
                  >
                    Step 2: Waiting for Payment Deposit
                  </Badge>
                  <h3 className="font-display text-lg font-bold">
                    Lock {formatNgn(proj.agreedBudgetNgn)} in Safe Escrow so {proj.creatorName} can start filming
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    You hired {proj.creatorName} for &ldquo;{proj.campaignTitle}&rdquo;. Deposit the payment into safe escrow (via Naira Bank Transfer or USDC) — the money is only paid after you approve the video.
                  </p>
                </div>

                <div className="shrink-0">
                  <FundProjectEscrowModal project={proj} ngnPerUsd={ngnPerUsd} />
                </div>
              </div>
            </Card>
          ))}

          {pendingApps.length > 0 && (
            <Card className="rounded-3xl border-border/70 bg-card p-5 shadow-xs">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-1">
                  <Badge variant="secondary" className="text-xs">
                    New Creator Applicants
                  </Badge>
                  <h3 className="font-display text-base font-bold">
                    {pendingApps.length} creators applied to your campaigns and are waiting to be hired
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    See their sample videos, skill ratings, and pitches to pick who you want to hire.
                  </p>
                </div>

                <Link href="/business/campaigns" className="shrink-0">
                  <Button variant="outline" size="sm" className="gap-2 rounded-full px-5 font-semibold">
                    <UserPlusIcon className="size-4 text-primary" />
                    Review {pendingApps.length} Applicants
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* SECTION 3: 3 Simple Summary Numbers */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="rounded-3xl border-border/60 bg-card/80">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Money Safely Held in Escrow</span>
              <ShieldCheckIcon className="size-4 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl font-black tabular-nums">
              {formatNgn(totalEscrowLockedNgn)}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Protected until you approve the creators&apos; videos</span>
            <Link
              href="/business/projects"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              Verify on BaseScan <ExternalLinkIcon className="size-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card/80">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Sales From Creator Promo Links</span>
              <ShoppingBagIcon className="size-4 text-emerald-500" />
            </div>
            <CardTitle className="font-display text-2xl font-black text-emerald-500 tabular-nums">
              {formatNgn(totalRevenueNgn)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {totalConversions} customer orders from {totalClicks} link clicks
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card/80">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Active Creator Jobs</span>
              <CheckCircle2Icon className="size-4 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl font-black">
              {projects.length} Hired Creators
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Across {campaigns.length} active campaigns
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
