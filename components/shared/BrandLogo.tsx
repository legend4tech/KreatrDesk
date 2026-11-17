import * as React from "react"
import Image from "next/image"
import { cn } from "cn"

interface BrandLogoProps {
  className?: string
  size?: number
  showWordmark?: boolean
  wordmarkClassName?: string
  subtitle?: string
}

export function BrandLogo({
  className,
  size = 36,
  showWordmark = false,
  wordmarkClassName,
  subtitle,
}: BrandLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <div
        className="relative shrink-0 overflow-hidden rounded-xl border border-primary/20 bg-black shadow-xs ring-1 ring-primary/20 transition-transform duration-200 hover:scale-105"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt="KreatrDesk Logo"
          width={size * 2}
          height={size * 2}
          priority
          className="h-full w-full object-cover"
        />
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-display text-lg font-extrabold tracking-tight text-foreground",
              wordmarkClassName
            )}
          >
            KreatrDesk
          </span>
          {subtitle && (
            <span className="text-[11px] font-medium text-primary">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
