import Link from "next/link"
import {
  ArrowRightIcon,
  BarChart3Icon,
  BotIcon,
  Building2Icon,
  CheckCircle2Icon,
  CompassIcon,
  LockIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function KreatrDeskLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <SparklesIcon className="size-4" />
            </div>
            <div>
              <span className="font-display text-lg font-extrabold tracking-tight">
                KreatrDesk
              </span>
              <span className="ml-2 hidden rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary sm:inline-block">
                UGC · AI · Base Escrow · Attribution
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-xs font-medium text-muted-foreground md:flex">
            <Link href="/business/discover" className="hover:text-foreground">
              Discover Creators
            </Link>
            <Link href="/business/campaigns" className="hover:text-foreground">
              Campaign Matching
            </Link>
            <Link href="/business/projects" className="hover:text-foreground">
              Escrow &amp; AI Review
            </Link>
            <Link href="/business/attribution" className="hover:text-foreground">
              ROI Attribution
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link href="/login">
              <Button variant="outline" size="sm" className="rounded-full text-xs">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="gap-1.5 rounded-full text-xs font-semibold">
                Get Started
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="mb-4 border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary"
            >
              Local Creator Marketing, UGC Production &amp; Campaign Attribution Platform
            </Badge>
            <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              Hire Creators for{" "}
              <span className="text-primary">Actual Craft &amp; Sales</span>, Not Vanity Follower Counts.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              KreatrDesk connects African businesses with high-skill UGC video producers and local community ambassadors — backed by{" "}
              <strong className="text-foreground">Naira + Base Sepolia USDC Escrow Vaults</strong>,{" "}
              <strong className="text-foreground">Multimodal AI Brief Verification</strong>, and{" "}
              <strong className="text-foreground">End-to-End Referral Attribution</strong>.
            </p>

            {/* Clear Role Portal Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/business/dashboard">
                <Button size="lg" className="gap-2 rounded-full px-6 font-semibold shadow-md">
                  <Building2Icon className="size-4" />
                  Enter Business Portal
                </Button>
              </Link>
              <Link href="/creator/dashboard">
                <Button variant="outline" size="lg" className="gap-2 rounded-full px-6 font-semibold">
                  <VideoIcon className="size-4 text-primary" />
                  Enter Creator Studio
                </Button>
              </Link>
              <Link href="/r/ADAZOBO20">
                <Button variant="secondary" size="lg" className="gap-2 rounded-full px-5 text-xs">
                  Test Customer Referral Link (/r/ADAZOBO20)
                </Button>
              </Link>
            </div>
          </div>

          {/* 4-Pillar Differentiator Cards */}
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-3xl border-border/60 bg-card/70 shadow-xs">
              <CardHeader className="pb-2">
                <div className="mb-2 flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <VideoIcon className="size-5" />
                </div>
                <CardTitle className="font-display text-base font-bold">
                  5-Pillar Creator Credibility
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs leading-relaxed text-muted-foreground">
                Separates <strong>Creative Ability</strong> from <strong>Audience Influence</strong>, <strong>Community Activation</strong>, <strong>Delivery Reliability</strong>, and <strong>Campaign Performance</strong>.
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/60 bg-card/70 shadow-xs">
              <CardHeader className="pb-2">
                <div className="mb-2 flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <LockIcon className="size-5" />
                </div>
                <CardTitle className="font-display text-base font-bold">
                  Naira + Base USDC Escrow
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs leading-relaxed text-muted-foreground">
                Businesses lock campaign funds via <strong>Roqqu NGN Bank Transfer</strong> or <strong>Base Sepolia USDC</strong> (`0xdd3f...6aaa`). Backend-verified on-chain state guarantees zero payment default.
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/60 bg-card/70 shadow-xs">
              <CardHeader className="pb-2">
                <div className="mb-2 flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BotIcon className="size-5" />
                </div>
                <CardTitle className="font-display text-base font-bold">
                  AI Content Evaluation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs leading-relaxed text-muted-foreground">
                Automatically checks submitted videos against every campaign brief requirement — scoring product visibility, audio/visual quality, and brand alignment.
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/60 bg-card/70 shadow-xs">
              <CardHeader className="pb-2">
                <div className="mb-2 flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BarChart3Icon className="size-5" />
                </div>
                <CardTitle className="font-display text-base font-bold">
                  Real Campaign Attribution
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs leading-relaxed text-muted-foreground">
                Every selected creator receives a unique referral link &amp; code tracking <strong>Clicks → Customer Enquiries → Promo Redemptions → Confirmed Sales</strong>.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* End-to-End Workflow Strip */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="rounded-3xl border border-border/70 bg-card/60 p-6 md:p-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                  MongoDB Atlas + Base Sepolia Testnet
                </Badge>
                <h2 className="mt-1 font-display text-2xl font-extrabold">
                  Complete Business-to-Creator Lifecycle
                </h2>
              </div>
              <Link href="/login">
                <Button size="sm" className="rounded-full text-xs">
                  Sign In as Business or Creator
                </Button>
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {[
                {
                  step: "01",
                  title: "Creator Portfolio",
                  desc: "Creators publish UGC reels & 5-pillar credibility profiles.",
                  icon: CompassIcon,
                },
                {
                  step: "02",
                  title: "Campaign & Match",
                  desc: "Businesses set eligibility by skill, location, and budget.",
                  icon: UsersIcon,
                },
                {
                  step: "03",
                  title: "Escrow Vault Lock",
                  desc: "Business funds NGN (Roqqu) or Base Sepolia USDC vault.",
                  icon: ShieldCheckIcon,
                },
                {
                  step: "04",
                  title: "AI Brief Review",
                  desc: "AI evaluates video compliance, hook, and product visibility.",
                  icon: BotIcon,
                },
                {
                  step: "05",
                  title: "Escrow Payout",
                  desc: "Business approves work & releases on-chain settlement.",
                  icon: CheckCircle2Icon,
                },
                {
                  step: "06",
                  title: "ROI Attribution",
                  desc: "Track clicks, enquiries, redemptions & confirmed revenue.",
                  icon: BarChart3Icon,
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.step}
                    className="rounded-2xl border border-border/60 bg-background/60 p-4"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-primary">
                      <span className="font-mono">STEP {item.step}</span>
                      <Icon className="size-4" />
                    </div>
                    <h3 className="mt-2 font-display text-sm font-bold">{item.title}</h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
