"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import {
  BarChart3Icon,
  BriefcaseIcon,
  Building2Icon,
  CompassIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  LinkIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  TrendingUpIcon,
  VideoIcon,
  WalletIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

import { BrandLogo } from "@/components/shared/BrandLogo"
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
import {
  DEFAULT_BUSINESS_SESSION,
  DEFAULT_CREATOR_SESSION,
  useKreatrSession,
} from "@/hooks/useKreatrData"
import { useRoqquRates } from "@/hooks/useRoqquRates"
import { formatNgn } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types"

const BUSINESS_NAV = [
  { href: "/business/dashboard", label: "1. Home & Guide", icon: LayoutDashboardIcon },
  { href: "/business/discover", label: "2. Browse Creators", icon: CompassIcon },
  { href: "/business/campaigns", label: "3. Campaigns & Hiring", icon: BriefcaseIcon },
  { href: "/business/projects", label: "4. Active Jobs & Videos", icon: FolderKanbanIcon },
  { href: "/business/attribution", label: "5. Customer Sales", icon: BarChart3Icon },
]

const CREATOR_NAV = [
  { href: "/creator/dashboard", label: "1. Creator Home & Guide", icon: LayoutDashboardIcon },
  { href: "/creator/portfolio", label: "2. My Sample Videos", icon: VideoIcon },
  { href: "/creator/campaigns", label: "3. Find Brand Jobs", icon: BriefcaseIcon },
  { href: "/creator/projects", label: "4. Submit Videos & Pay", icon: FolderKanbanIcon },
  { href: "/creator/referrals", label: "5. My Promo Links", icon: LinkIcon },
]

export function PortalShell({
  portalRole,
  children,
}: {
  portalRole: UserRole
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, clearSession } = useKreatrSession(portalRole)
  const { data: rates } = useRoqquRates()
  const { resolvedTheme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = portalRole === "business" ? BUSINESS_NAV : CREATOR_NAV
  const activeIdentity =
    user.role === portalRole
      ? user
      : portalRole === "business"
        ? DEFAULT_BUSINESS_SESSION
        : DEFAULT_CREATOR_SESSION

  const handleSignOut = async () => {
    const toastId = toast.loading("Signing out...", { id: "portal-signout" })
    try {
      await clearSession()
      toast.success("Signed out successfully. See you soon!", {
        id: toastId,
        description: "Your session has ended. Redirecting to login...",
      })
      router.push("/login")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to sign out. Please try again.", {
        id: toastId,
      })
    }
  }

  const renderSidebarContent = (onNavigate?: () => void, customClass?: string) => (
    <aside className={cn("flex h-full w-64 flex-col justify-between border-r border-border bg-sidebar px-4 py-6 text-sidebar-foreground", customClass)}>
      <div className="space-y-6">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-2"
        >
          <BrandLogo
            size={36}
            showWordmark
            subtitle={portalRole === "business" ? "Business Account" : "Creator Studio"}
          />
        </Link>

        {/* Signed-In User Box */}
        <div className="rounded-2xl border border-border/70 bg-card/80 p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              {portalRole === "business" ? (
                <Building2Icon className="size-4" />
              ) : (
                <VideoIcon className="size-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-bold text-foreground">
                {activeIdentity.name}
              </div>
              <div className="truncate font-mono text-[11px] text-muted-foreground">
                {activeIdentity.email}
              </div>
            </div>
          </div>
        </div>

        {/* Simple 5-Step Navigation */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 text-[11px] text-muted-foreground">
          <div className="mb-1 flex items-center gap-1.5 font-semibold text-foreground">
            <ShieldCheckIcon className="size-3.5 text-primary" />
            <span>Safe Payment Protection</span>
          </div>
          <p className="leading-relaxed">
            Payments are held safely in escrow and only released after video approval.
          </p>
        </div>

        <button type="button" onClick={() => void handleSignOut()} className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/70 bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"><LogOutIcon className="size-3.5" /><span>Sign Out</span></button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="hidden lg:sticky lg:top-0 lg:block lg:h-screen">
        {renderSidebarContent()}
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-2 border-b border-border bg-background/85 px-3 backdrop-blur-xl sm:gap-3 sm:px-6 md:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="shrink-0 lg:hidden"
                    aria-label="Open navigation menu"
                  />
                }
              >
                <MenuIcon className="size-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 sm:w-80 bg-sidebar border-r border-border">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                  <SheetDescription>Navigate KreatrDesk</SheetDescription>
                </SheetHeader>
                {renderSidebarContent(() => setMobileOpen(false), "w-full border-r-0")}
              </SheetContent>
            </Sheet>

            <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3 py-1 text-xs shrink-0 sm:flex sm:px-3.5">
              <TrendingUpIcon className="size-3.5 text-primary" />
              <span className="font-mono font-medium tabular-nums">
                1 USD = {formatNgn(rates?.ngnPerUsd ?? 1375)}
              </span>
              <Badge variant="secondary" className="hidden text-[10px] md:inline-flex">
                Live Rate
              </Badge>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleSignOut()}
              className="gap-1.5 rounded-full px-2.5 text-xs font-semibold sm:px-3"
              title="Sign Out / Switch Role"
            >
              {portalRole === "business" ? (
                <VideoIcon className="size-3.5 text-primary shrink-0" />
              ) : (
                <Building2Icon className="size-3.5 text-primary shrink-0" />
              )}
              <span className="hidden md:inline">Sign Out / Switch Role</span>
              <span className="hidden sm:inline md:hidden">Sign Out</span>
            </Button>

            {mounted && (
              <Button
                variant="outline"
                size="icon-sm"
                className="shrink-0 rounded-full"
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
                    className="shrink-0"
                    {...(!ready && {
                      "aria-hidden": true,
                      style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
                    })}
                  >
                    {!connected ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={openConnectModal}
                        className="gap-1.5 rounded-full px-2.5 text-xs sm:px-3"
                      >
                        <WalletIcon className="size-3.5 shrink-0" />
                        <span className="hidden sm:inline">Optional Crypto Wallet</span>
                        <span className="sm:hidden">Wallet</span>
                      </Button>
                    ) : chain.unsupported ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={openChainModal}
                        className="rounded-full text-xs"
                      >
                        Switch Network
                      </Button>
                    ) : (
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
                    )}
                  </div>
                )
              }}
            </ConnectButton.Custom>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
