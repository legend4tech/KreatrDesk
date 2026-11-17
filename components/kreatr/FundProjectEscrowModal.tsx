"use client"

import * as React from "react"
import {
  CheckCircle2Icon,
  LinkIcon,
  Loader2Icon,
  LockIcon,
  ShieldCheckIcon,
  WalletIcon,
} from "lucide-react"
import { toast } from "sonner"

import { RoqquCheckoutCard } from "@/components/community/RoqquCheckoutCard"
import { Button } from "@/components/ui/button"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCommunityPots } from "@/hooks/useCommunityPots"
import { useInvalidateKreatr } from "@/hooks/useKreatrData"
import { formatNgn } from "@/lib/format"
import type { CreatorProject, RoqquCheckoutResult, RoqquWebhookResult } from "@/types"

interface FundProjectEscrowModalProps {
  project: CreatorProject
  ngnPerUsd: number
}

export function FundProjectEscrowModal({
  project,
  ngnPerUsd,
}: FundProjectEscrowModalProps) {
  const { contributeUsdc, applyRoqquWebhookCredit } = useCommunityPots()
  const invalidateKreatr = useInvalidateKreatr()
  const [open, setOpen] = React.useState(false)

  const [rail, setRail] = React.useState<"payment_link" | "crypto_wallet">("payment_link")
  const [network, setNetwork] = React.useState("trc20")
  const [ngnAmount, setNgnAmount] = React.useState(project.agreedBudgetNgn.toString())
  const [usdcAmount, setUsdcAmount] = React.useState(project.agreedBudgetUsdc.toFixed(2))
  const [businessName, setBusinessName] = React.useState(project.businessName)
  const [businessEmail, setBusinessEmail] = React.useState("business@kreatrdesk.app")
  const [creatingCheckout, setCreatingCheckout] = React.useState(false)
  const [simulatingWebhook, setSimulatingWebhook] = React.useState(false)
  const [submittingWeb3, setSubmittingWeb3] = React.useState(false)
  const [checkout, setCheckout] = React.useState<RoqquCheckoutResult | null>(null)

  const parsedNgn = Math.max(Number(ngnAmount) || 0, 0)
  const parsedUsdc = Math.max(Number(usdcAmount) || 0, 0)
  const estimatedUsdcFromNgn =
    ngnPerUsd > 0 ? Math.round((parsedNgn / ngnPerUsd) * 100) / 100 : project.agreedBudgetUsdc

  const handleRoqquCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (parsedNgn <= 0) {
      toast.error("Enter a valid Naira amount.")
      return
    }
    setCreatingCheckout(true)
    try {
      const res = await fetch("/api/roqqu/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communityId: project.onChainVaultId,
          rail,
          amountNgn: parsedNgn,
          network,
          contributorName: businessName,
          contributorEmail: businessEmail,
        }),
      })
      const payload = (await res.json()) as RoqquCheckoutResult & { message?: string }
      if (!res.ok) throw new Error(payload.message || "Failed to generate payment link.")
      setCheckout(payload)
      toast.success("Naira Bank Transfer Link Ready!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment link failed.")
    } finally {
      setCreatingCheckout(false)
    }
  }

  const handleSimulateWebhook = async () => {
    if (!checkout) return
    setSimulatingWebhook(true)
    try {
      const isBtc = checkout.rail === "crypto_wallet" && network === "bitcoin"
      const res = await fetch("/api/roqqu/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          demoSimulate: true,
          paymentReference: checkout.paymentReference,
          communityId: checkout.communityId,
          amountNgn: checkout.amountNgn,
          contributorName: checkout.contributorName,
          depositedToken: isBtc ? "btc" : "ngn",
          depositedTokenAmount: isBtc ? 0.002 : 0,
        }),
      })
      const result = (await res.json()) as RoqquWebhookResult & { message?: string }
      if (!res.ok) throw new Error(result.message || "Payment verification failed.")

      await applyRoqquWebhookCredit({
        communityId: result.communityId,
        usdcCredited: result.usdcCredited,
        contributorTag: `${project.businessName} -> ${project.creatorHandle}`,
      })

      const fundRes = await fetch("/api/kreatr/projects/fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          rail: "roqqu_fiat",
          paymentReference: result.paymentReference,
          txHash: result.relayerTxHash,
          amountUsdc: result.usdcCredited,
        }),
      })
      if (!fundRes.ok) throw new Error("Escrow state verification failed.")

      invalidateKreatr()
      toast.success(
        `Payment Locked Safely! ${project.creatorName} has been notified to start filming.`
      )
      setCheckout(null)
      setOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to confirm deposit.")
    } finally {
      setSimulatingWebhook(false)
    }
  }

  const handleWeb3EscrowSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (parsedUsdc <= 0) {
      toast.error("Enter a valid USDC amount.")
      return
    }
    setSubmittingWeb3(true)
    try {
      const txHash = await contributeUsdc({
        communityId: project.onChainVaultId,
        amountUsdc: parsedUsdc.toFixed(2),
        contributorTag: `${project.businessName} Escrow -> ${project.creatorHandle}`,
      })

      const ref = txHash
        ? `W3-${txHash.slice(0, 14)}`
        : `W3-${Date.now().toString(36).toUpperCase()}`

      const fundRes = await fetch("/api/kreatr/projects/fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          rail: "web3_direct",
          paymentReference: ref,
          txHash: txHash ?? undefined,
          amountUsdc: parsedUsdc,
        }),
      })
      if (!fundRes.ok) throw new Error("Backend escrow verification failed.")

      invalidateKreatr()
      toast.success(
        `Payment Locked Safely! ${project.creatorName} can now start filming.`
      )
      setOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Crypto deposit failed.")
    } finally {
      setSubmittingWeb3(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (!val) setCheckout(null)
      }}
    >
      <DialogTrigger
        render={
          <Button size="sm" className="gap-2 rounded-full font-semibold shadow-sm">
            <LockIcon className="size-3.5" />
            Lock Payment Safely ({formatNgn(project.agreedBudgetNgn)})
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Lock Payment in Safe Escrow for {project.creatorName}
          </DialogTitle>
          <DialogDescription>
            Your money is held safely by KreatrDesk and is <strong>only paid to the creator after you watch and approve their finished video</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between rounded-xl border border-primary/25 bg-primary/5 px-3.5 py-2.5 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="size-4 text-primary" />
            <span className="text-muted-foreground">Agreed Creator Payment:</span>
          </div>
          <span className="font-mono font-bold text-primary">
            {formatNgn(project.agreedBudgetNgn)} (≈ ${project.agreedBudgetUsdc.toFixed(2)} USD)
          </span>
        </div>

        <Tabs defaultValue="roqqu" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="roqqu">
              <LinkIcon className="size-3.5" />
              Pay in Naira (Bank Transfer)
            </TabsTrigger>
            <TabsTrigger value="web3">
              <WalletIcon className="size-3.5" />
              Pay with Crypto (USDC)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roqqu" className="mt-4 space-y-4">
            {!checkout ? (
              <form onSubmit={(e) => void handleRoqquCheckout(e)} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-2">
                  {(["payment_link", "crypto_wallet"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRail(r)}
                      className={`rounded-xl border p-2.5 text-left text-xs transition-colors ${
                        rail === r
                          ? "border-primary bg-primary/10 font-medium text-foreground"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {r === "payment_link" ? "Naira Bank Transfer" : "Other Crypto Networks"}
                    </button>
                  ))}
                </div>

                {rail === "crypto_wallet" && (
                  <div className="space-y-1">
                    <Label htmlFor="escrow-net">Select Network</Label>
                    <select
                      id="escrow-net"
                      value={network}
                      onChange={(e) => setNetwork(e.target.value)}
                      className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs"
                    >
                      <option value="trc20">TRON (USDT TRC-20)</option>
                      <option value="bitcoin">Bitcoin (BTC)</option>
                      <option value="bep20">BNB Smart Chain (BEP-20)</option>
                      <option value="base">Base Network</option>
                    </select>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="escrow-biz">Your Business Name</Label>
                    <Input
                      id="escrow-biz"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="escrow-email">Receipt Email</Label>
                    <Input
                      id="escrow-email"
                      type="email"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="escrow-ngn">Amount to Lock (Naira)</Label>
                    <span className="font-mono text-xs text-primary tabular-nums">
                      Protected as ${estimatedUsdcFromNgn.toFixed(2)} USD
                    </span>
                  </div>
                  <Input
                    id="escrow-ngn"
                    type="number"
                    min={1000}
                    value={ngnAmount}
                    onChange={(e) => setNgnAmount(e.target.value)}
                    className="font-mono tabular-nums"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={creatingCheckout}
                  className="w-full rounded-full"
                >
                  {creatingCheckout && <Loader2Icon className="size-4 animate-spin" />}
                  Continue to Naira Payment
                </Button>
              </form>
            ) : (
              <RoqquCheckoutCard
                checkout={checkout}
                simulatingWebhook={simulatingWebhook}
                onSimulateWebhook={() => void handleSimulateWebhook()}
              />
            )}
          </TabsContent>

          <TabsContent value="web3" className="mt-4">
            <form onSubmit={(e) => void handleWeb3EscrowSubmit(e)} className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="escrow-usdc">Amount (USDC)</Label>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    ≈ {formatNgn(parsedUsdc * ngnPerUsd)}
                  </span>
                </div>
                <Input
                  id="escrow-usdc"
                  type="number"
                  min={1}
                  step="0.01"
                  value={usdcAmount}
                  onChange={(e) => setUsdcAmount(e.target.value)}
                  className="font-mono tabular-nums"
                  required
                />
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
                Money is locked in escrow and only released to{" "}
                <strong>{project.creatorName}</strong> after you approve their video.
              </div>

              <Button
                type="submit"
                disabled={submittingWeb3}
                className="w-full rounded-full"
              >
                {submittingWeb3 ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <CheckCircle2Icon className="size-4" />
                )}
                Lock USDC Payment Now
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
