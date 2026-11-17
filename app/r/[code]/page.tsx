"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  Loader2Icon,
  MessageSquareIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TicketPercentIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useInvalidateKreatr, useKreatrOverview } from "@/hooks/useKreatrData"
import { formatNgn } from "@/lib/format"

export default function PublicCreatorReferralLandingPage() {
  const params = useParams<{ code: string }>()
  const code = (params?.code || "ADAZOBO20").toUpperCase()
  const { data } = useKreatrOverview()
  const invalidate = useInvalidateKreatr()

  const project =
    data?.projects.find(
      (p) => p.attribution.referralCode.toUpperCase() === code
    ) ?? data?.projects[0]

  const [customerName, setCustomerName] = React.useState("Chiamaka Obi (Lekki)")
  const [enquiryText, setEnquiryText] = React.useState(
    "Hi! I watched the video and want to order 2 packs to Lekki Phase 1 using code " + code
  )
  const [submittingAction, setSubmittingAction] = React.useState<string | null>(null)
  const [completedOrder, setCompletedOrder] = React.useState(false)

  // Automatically record +1 CLICK in MongoDB when a customer opens this link
  React.useEffect(() => {
    void fetch("/api/kreatr/attribution", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        referralCode: code,
        eventType: "CLICK",
        customerLabel: "Customer clicked link from creator video",
        location: "Lagos, Nigeria",
      }),
    }).then(() => invalidate())
  }, [code, invalidate])

  const triggerEvent = async (
    eventType: "ENQUIRY" | "REDEMPTION" | "CONVERSION",
    customLabel: string
  ) => {
    setSubmittingAction(eventType)
    try {
      const res = await fetch("/api/kreatr/attribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralCode: code,
          eventType,
          customerLabel: customLabel,
          location: "Lagos, Nigeria",
          amountNgn: 24000,
        }),
      })
      if (!res.ok) throw new Error("Could not record customer action")
      invalidate()
      if (eventType === "CONVERSION") {
        setCompletedOrder(true)
      }
      toast.success(
        eventType === "CONVERSION"
          ? `Order Completed! ₦24,000 sale recorded under ${project?.creatorName || code}`
          : eventType === "ENQUIRY"
            ? `WhatsApp enquiry recorded under ${project?.creatorName || code}!`
            : `20% Discount Code (${code}) applied!`
      )
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed")
    } finally {
      setSubmittingAction(null)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/business/attribution">
            <Button variant="ghost" size="sm" className="gap-1.5 rounded-full text-xs">
              <ArrowLeftIcon className="size-3.5" />
              Back to Business Sales Report
            </Button>
          </Link>
          <Badge variant="outline" className="border-primary/40 bg-primary/10 font-mono text-xs text-primary">
            Creator Promo Code: {code}
          </Badge>
        </div>

        <Card className="overflow-hidden rounded-3xl border-primary/30 bg-card/90 shadow-lg">
          <div className="bg-primary/10 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <SparklesIcon className="size-4" />
                <span>Customer Offer Page (What Customers See When They Click the Creator&apos;s Link)</span>
              </div>
            </div>
            <h1 className="mt-2 font-display text-2xl font-black">
              {project?.businessName || "ZoboCraft Beverages Ltd"} — 20% Off Starter Pack
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Special discount shared by <strong>{project?.creatorName || "Adaobi Nnamdi"} ({project?.creatorHandle || "@adaobi.ugc"})</strong>. Whether you message the business on WhatsApp or buy directly below, your order is automatically credited to {project?.creatorName || "the creator"}.
            </p>
          </div>

          <CardContent className="space-y-6 p-6">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="cust-name">Your Name &amp; Delivery Area</Label>
                <Input
                  id="cust-name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="cust-enq">
                  Option 1: Order or Ask a Question on WhatsApp (Counts as a WhatsApp Enquiry)
                </Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    id="cust-enq"
                    value={enquiryText}
                    onChange={(e) => setEnquiryText(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={submittingAction === "ENQUIRY"}
                    onClick={() =>
                      void triggerEvent("ENQUIRY", `${customerName}: "${enquiryText}"`)
                    }
                    className="shrink-0 gap-1.5 rounded-xl text-xs font-semibold"
                  >
                    {submittingAction === "ENQUIRY" ? (
                      <Loader2Icon className="size-3.5 animate-spin" />
                    ) : (
                      <MessageSquareIcon className="size-3.5 text-emerald-500" />
                    )}
                    Message on WhatsApp
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/30 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="secondary" className="mb-1 text-[10px]">
                    Option 2: Instant Store Checkout
                  </Badge>
                  <div className="font-display text-base font-bold">
                    Sparkling Hibiscus 12-Can Party Case
                  </div>
                  <div className="text-xs text-muted-foreground">
                    20% Creator Discount Code Applied (<code className="font-mono text-primary">{code}</code>)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground line-through">₦30,000</div>
                  <div className="font-display text-xl font-black text-primary">
                    {formatNgn(24000)}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={submittingAction === "REDEMPTION"}
                  onClick={() =>
                    void triggerEvent(
                      "REDEMPTION",
                      `${customerName} claimed 20% discount code ${code}`
                    )
                  }
                  className="gap-1.5 rounded-full text-xs font-semibold"
                >
                  {submittingAction === "REDEMPTION" ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <TicketPercentIcon className="size-4" />
                  )}
                  Claim 20% Discount Code
                </Button>

                <Button
                  type="button"
                  disabled={submittingAction === "CONVERSION"}
                  onClick={() =>
                    void triggerEvent(
                      "CONVERSION",
                      `${customerName} bought 12-Can Case (₦24,000)`
                    )
                  }
                  className="gap-1.5 rounded-full text-xs font-semibold shadow-sm"
                >
                  {submittingAction === "CONVERSION" ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <ShoppingBagIcon className="size-4" />
                  )}
                  Buy Now ({formatNgn(24000)})
                </Button>
              </div>
            </div>

            {completedOrder && (
              <div className="flex items-center justify-between rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs text-emerald-600 dark:text-emerald-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="size-4 shrink-0" />
                  <span>
                    <strong>Sale Recorded in MongoDB!</strong> ₦24,000 has been added to{" "}
                    <strong>{project?.creatorName}</strong>&apos;s sales report.
                  </span>
                </div>
                <Link href="/business/attribution" className="font-bold underline">
                  See Business Report →
                </Link>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheckIcon className="size-3.5 text-primary" />
              <span>KreatrDesk Smart Link — Tracks Clicks, WhatsApp Enquiries &amp; Paid Orders</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
