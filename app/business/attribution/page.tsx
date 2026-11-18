"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckCircle2Icon,
  CopyIcon,
  LinkIcon,
  MessageSquareIcon,
  MousePointerClickIcon,
  ShoppingBagIcon,
  TicketPercentIcon,
  TrendingUpIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useKreatrOverview } from "@/hooks/useKreatrData"
import { formatNgn } from "@/lib/format"

export default function BusinessCustomerSalesPage() {
  const { data } = useKreatrOverview()
  const projects = data?.projects ?? []

  const totalSpendNgn = projects.reduce((acc, p) => acc + p.agreedBudgetNgn, 0)
  const totalRevenueNgn = projects.reduce(
    (acc, p) => acc + p.attribution.revenueGeneratedNgn,
    0
  )
  const netProfitNgn = totalRevenueNgn - totalSpendNgn
  const totalConversions = projects.reduce(
    (acc, p) => acc + p.attribution.confirmedConversions,
    0
  )
  const totalClicks = projects.reduce((acc, p) => acc + p.attribution.clicks, 0)

  const copySmartLink = (code: string) => {
    const url = `${window.location.origin}/r/${code}`
    void navigator.clipboard.writeText(url)
    toast.success("Creator Smart Link Copied!", {
      description: `${url} (Directs customers to WhatsApp/Store with promo code ${code}).`,
    })
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <Badge
          variant="outline"
          className="mb-2 border-primary/35 bg-primary/10 text-xs text-primary"
        >
          Customer Sales &amp; Smart Promo Links
        </Badge>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          Did Your CreatorsActually Bring You Customers?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Instead of counting useless video views or likes, KreatrDesk gives every hired creator a <strong>Smart Promo Link</strong> that tracks how many real customers clicked, messaged your WhatsApp/Store, and bought from you.
        </p>
      </div>

      {/* SECTION 1: How the Smart Link Works (3 Plain Steps) */}
      <Card className="rounded-3xl border-primary/30 bg-primary/5 p-6">
        <h2 className="font-display text-base font-extrabold">
          Where Does the Tracking Link Come From &amp; How Does It Work?
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-card p-4 text-xs">
            <div className="flex items-center justify-between font-bold text-primary">
              <span>1. Auto-Generated When You Hire</span>
              <LinkIcon className="size-4" />
            </div>
            <p className="mt-1.5 leading-relaxed text-muted-foreground">
              The moment you hire a creator (like Adaobi), KreatrDesk automatically creates a unique <strong>Smart Link &amp; Coupon Code</strong> for her (e.g. <code className="font-mono text-foreground">/r/ADAZOBO20</code>).
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-4 text-xs">
            <div className="flex items-center justify-between font-bold text-primary">
              <span>2. Creator Puts Link in Video Bio</span>
              <MessageSquareIcon className="size-4" />
            </div>
            <p className="mt-1.5 leading-relaxed text-muted-foreground">
              Customers watching her video click the link. KreatrDesk counts the click and routes the customer to your <strong>Business WhatsApp (+234 803...) or Store</strong> with her coupon code attached.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-4 text-xs">
            <div className="flex items-center justify-between font-bold text-emerald-500">
              <span>3. Every Sale Is Recorded Below</span>
              <ShoppingBagIcon className="size-4" />
            </div>
            <p className="mt-1.5 leading-relaxed text-muted-foreground">
              When that customer orders, you see exactly which creator brought them in — so you know which creators make you money!
            </p>
          </div>
        </div>
      </Card>

      {/* SECTION 2: 3 Bottom-Line Numbers (Money Spent vs. Money Made) */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="rounded-3xl border-border/60 bg-card/80">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total Paid to Creators</span>
              <TicketPercentIcon className="size-4 text-muted-foreground" />
            </div>
            <CardTitle className="font-display text-2xl font-black tabular-nums">
              {formatNgn(totalSpendNgn)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Across {projects.length} hired creators
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card/80">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total Sales From Creator Links</span>
              <ShoppingBagIcon className="size-4 text-emerald-500" />
            </div>
            <CardTitle className="font-display text-2xl font-black text-emerald-500 tabular-nums">
              {formatNgn(totalRevenueNgn)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            From {totalConversions} paying customers ({totalClicks} link clicks)
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-primary/35 bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-xs font-semibold text-primary">
              <span>Your Net Profit from Campaigns</span>
              <TrendingUpIcon className="size-4" />
            </div>
            <CardTitle className="font-display text-2xl font-black tabular-nums">
              +{formatNgn(Math.max(0, netProfitNgn))}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs font-medium text-primary">
            Sales made minus creator fees
          </CardContent>
        </Card>
      </div>

      {/* SECTION 3: Creator-by-Creator Sales Results */}
      <div className="space-y-5">
        <h2 className="font-display text-xl font-bold">
          Results Per Hired Creator
        </h2>

        {projects.map((proj) => {
          const attr = proj.attribution
          const profitNgn = attr.revenueGeneratedNgn - proj.agreedBudgetNgn

          return (
            <Card
              key={proj.id}
              className="rounded-3xl border-border/60 bg-card/85 p-6 shadow-xs"
            >
              {/* Top Row: Creator Info + Destination Route + Test Customer Link */}
              <div className="flex flex-col justify-between gap-4 border-b border-border/50 pb-5 lg:flex-row lg:items-center">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-extrabold">
                      {proj.creatorName} ({proj.creatorHandle})
                    </h3>
                    <Badge className="bg-primary/15 font-mono text-xs text-primary">
                      Promo Code: {attr.referralCode}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>Smart Link: <code className="font-mono text-foreground">/r/{attr.referralCode}</code></span>
                    <ArrowRightIcon className="size-3.5 text-primary" />
                    <span>
                      Routes Customers to:{" "}
                      <strong className="text-foreground">
                        {proj.businessName} WhatsApp (+234 803 000 1234) &amp; Store Checkout
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copySmartLink(attr.referralCode)}
                    className="gap-1.5 rounded-full text-xs"
                  >
                    <CopyIcon className="size-3.5" />
                    Copy Smart Link
                  </Button>
                  <Link href={`/r/${attr.referralCode}`}>
                    <Button size="sm" className="gap-1.5 rounded-full text-xs font-semibold">
                      Preview What Customers See (/r/{attr.referralCode})
                      <ArrowUpRightIcon className="size-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Middle Row: 4 Clean Customer Journey Numbers + Profit Comparison */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>1. Link Clicks</span>
                    <MousePointerClickIcon className="size-3.5 text-primary" />
                  </div>
                  <div className="mt-1 font-display text-2xl font-black tabular-nums">
                    {attr.clicks}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    Watched video &amp; clicked link
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>2. WhatsApp Enquiries</span>
                    <MessageSquareIcon className="size-3.5 text-primary" />
                  </div>
                  <div className="mt-1 font-display text-2xl font-black tabular-nums">
                    {attr.enquiries}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    Asked a product question
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>3. Discount Claims</span>
                    <TicketPercentIcon className="size-3.5 text-primary" />
                  </div>
                  <div className="mt-1 font-display text-2xl font-black tabular-nums">
                    {attr.redemptions}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    Used code {attr.referralCode}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>4. Confirmed Sales</span>
                    <ShoppingBagIcon className="size-3.5 text-emerald-500" />
                  </div>
                  <div className="mt-1 font-display text-2xl font-black text-emerald-500 tabular-nums">
                    {attr.confirmedConversions}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    Completed payment
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-4">
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Sales vs. Creator Cost
                  </div>
                  <div className="mt-1 font-display text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatNgn(attr.revenueGeneratedNgn)}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    Paid {formatNgn(proj.agreedBudgetNgn)} ({profitNgn >= 0 ? `+${formatNgn(profitNgn)} profit` : formatNgn(profitNgn)})
                  </div>
                </div>
              </div>

              {/* Bottom Row: Latest Real Customer Activity */}
              <div className="mt-5 space-y-2">
                <div className="text-xs font-bold text-muted-foreground">
                  Latest Customers From {proj.creatorName}&apos;s Link:
                </div>
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {attr.recentEvents.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-start justify-between gap-2 rounded-xl border border-border/50 bg-background/50 p-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2Icon className="size-3.5 text-primary" />
                          <span className="font-semibold text-foreground">
                            {ev.type === "CONVERSION"
                              ? "Customer Bought"
                              : ev.type === "ENQUIRY"
                                ? "WhatsApp Question"
                                : ev.type === "REDEMPTION"
                                  ? "Claimed Discount"
                                  : "Clicked Link"}
                          </span>
                        </div>
                        <div className="text-muted-foreground">{ev.customerLabel}</div>
                      </div>
                      {ev.amountNgn && (
                        <span className="font-mono font-bold text-emerald-500">
                          +{formatNgn(ev.amountNgn)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
