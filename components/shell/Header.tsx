"use client"

import * as React from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import {
  AlertCircleIcon,
  Building2Icon,
  MenuIcon,
  MoonIcon,
  RefreshCwIcon,
  SparklesIcon,
  SunIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

import { Sidebar } from "@/components/shell/Sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { useActiveRole } from "@/hooks/useKreatrData"
import { useRoqquRates } from "@/hooks/useRoqquRates"
import { formatNgn } from "@/lib/format"

export function Header() {
  const { data, isLoading, isError, refetch, isFetching } = useRoqquRates()
  const { role, setRole } = useActiveRole()
  const { resolvedTheme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-2.5">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                className="lg:hidden"
                aria-label="Open navigation menu"
              />
            }
          >
            <MenuIcon className="size-4" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 sm:w-80 bg-sidebar border-r border-border">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                Navigate across KreatrDesk modules
              </SheetDescription>
            </SheetHeader>
            <Sidebar
              className="w-full border-r-0"
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {isLoading ? (
          <Skeleton className="h-8 w-44 rounded-full" />
        ) : isError || !data ? (
          <div className="flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs text-destructive">
            <AlertCircleIcon className="size-3.5 shrink-0" />
            <span>Rate feed offline</span>
            <Button
              variant="ghost"
              size="xs"
              onClick={async () => {
                const toastId = toast.loading("Refreshing exchange rates...")
                try {
                  await refetch()
                  toast.success("Roqqu exchange rates refreshed", { id: toastId })
                } catch {
                  toast.error("Failed to refresh live exchange rates", { id: toastId })
                }
              }}
              disabled={isFetching}
            >
              <RefreshCwIcon className="size-3" />
              Retry
            </Button>
          </div>
        ) : (
          <div className="glass-panel flex items-center gap-2 rounded-full px-3.5 py-1 text-xs">
            <TrendingUpIcon className="size-3.5 text-accent-warm" />
            <span className="font-mono font-medium tabular-nums text-foreground">
              1 USDC = {formatNgn(data.ngnPerUsd)}
            </span>
            <Badge variant="secondary" className="hidden font-mono text-[10px] sm:inline-flex">
              {data.source === "ras-live"
                ? `Roqqu ${data.mode}`
                : data.source === "roqqu-public"
                  ? "Roqqu Live"
                  : "Escrow FX"}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const nextRole = role === "business" ? "creator" : "business"
            setRole(nextRole)
            toast.info(`Switched perspective to ${nextRole === "business" ? "Business" : "Creator Studio"}`)
          }}
          className="hidden gap-1.5 rounded-full text-xs sm:inline-flex"
        >
          {role === "business" ? (
            <>
              <Building2Icon className="size-3.5 text-primary" />
              <span>View: Business (Switch to Creator)</span>
            </>
          ) : (
            <>
              <SparklesIcon className="size-3.5 text-primary" />
              <span>View: Creator (Switch to Business)</span>
            </>
          )}
        </Button>

        {mounted && (
          <Button
            variant="outline"
            size="icon-sm"
            className="rounded-full"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle color theme"
          >
            {resolvedTheme === "dark" ? (
              <SunIcon className="size-4" />
            ) : (
              <MoonIcon className="size-4" />
            )}
          </Button>
        )}

        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted: walletMounted,
          }) => {
            const ready = walletMounted
            const connected = ready && account && chain

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button
                        size="sm"
                        onClick={openConnectModal}
                        className="gap-1.5 rounded-full text-xs font-semibold"
                      >
                        <WalletIcon className="size-3.5" />
                        Connect Base Wallet
                      </Button>
                    )
                  }

                  if (chain.unsupported) {
                    return (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={openChainModal}
                        className="rounded-full text-xs"
                      >
                        Switch to Base Sepolia
                      </Button>
                    )
                  }

                  return (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={openAccountModal}
                      className="gap-1.5 rounded-full px-2.5 font-mono text-xs sm:gap-2 sm:px-3"
                    >
                      <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="max-w-[72px] truncate sm:max-w-none">
                        {account.displayName}
                      </span>
                    </Button>
                  )
                })()}
              </div>
            )
          }}
        </ConnectButton.Custom>
      </div>
    </header>
  )
}
