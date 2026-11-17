"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3Icon,
  BriefcaseIcon,
  CompassIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserCheckIcon,
} from "lucide-react"

import { BrandLogo } from "@/components/shared/BrandLogo"
import { Badge } from "@/components/ui/badge"
import { useActiveRole } from "@/hooks/useKreatrData"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
  onNavigate?: () => void
}

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Command Center",
    icon: LayoutDashboardIcon,
    badge: "Live",
  },
  {
    href: "/discovery",
    label: "Creator Discovery",
    icon: CompassIcon,
    badge: "5-Pillar",
  },
  {
    href: "/campaigns",
    label: "Campaigns & Match",
    icon: BriefcaseIcon,
  },
  {
    href: "/projects",
    label: "Projects & AI Escrow",
    icon: FolderKanbanIcon,
    badge: "AI + Vault",
  },
  {
    href: "/attribution",
    label: "ROI Attribution",
    icon: BarChart3Icon,
  },
]

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const { role, setRole } = useActiveRole()

  return (
    <aside
      className={cn(
        "flex h-full w-68 flex-col justify-between border-r border-border bg-sidebar px-4 py-6 text-sidebar-foreground",
        className
      )}
    >
      <div className="space-y-6">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-2"
        >
          <BrandLogo size={38} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg font-extrabold tracking-tight">
                KreatrDesk
              </span>
              <Badge variant="outline" className="border-primary/40 bg-primary/10 px-1.5 py-0 text-[10px] text-primary">
                v1.0
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              UGC · Escrow · Attribution
            </p>
          </div>
        </Link>

        {/* Active Perspective Switcher */}
        <div className="rounded-2xl border border-border/70 bg-card/80 p-2.5 shadow-xs">
          <div className="mb-1.5 flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Active Workspace Mode</span>
            <UserCheckIcon className="size-3 text-primary" />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setRole("business")}
              className={cn(
                "rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all",
                role === "business"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              Business
            </button>
            <button
              type="button"
              onClick={() => setRole("creator")}
              className={cn(
                "rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all",
                role === "creator"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              Creator
            </button>
          </div>
          <p className="mt-2 px-1 text-[11px] text-muted-foreground">
            {role === "business"
              ? "Logged in: ZoboCraft Beverages Ltd"
              : "Logged in: Adaobi Nnamdi (@adaobi.ugc)"}
          </p>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {item.badge && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      active
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="space-y-3 rounded-2xl border border-primary/25 bg-primary/5 p-3.5 text-xs">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <ShieldCheckIcon className="size-4 text-primary" />
          <span>On-Chain Escrow Protected</span>
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Funds deposited via NGN (Roqqu Rail) or Base Sepolia USDC are locked in smart contract vaults until deliverable approval.
        </p>
      </div>
    </aside>
  )
}
