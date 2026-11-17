"use client"

import * as React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type {
  Campaign,
  CampaignApplication,
  CreatorProfile,
  CreatorProject,
  PortfolioSample,
  UserRole,
} from "@/types"

export interface KreatrOverviewData {
  creators: CreatorProfile[]
  portfolioSamples: PortfolioSample[]
  campaigns: Campaign[]
  applications: CampaignApplication[]
  projects: CreatorProject[]
}

export interface KreatrSessionUser {
  userId: string
  role: UserRole
  name: string
  handle: string
  email: string
  location: string
  avatar?: string
}

const SESSION_STORAGE_KEY = "kreatrdesk_session_user"
const ROLE_STORAGE_KEY = "kreatrdesk_active_role"
const SESSION_EVENT = "kreatrdesk-session-change"

export const DEFAULT_BUSINESS_SESSION: KreatrSessionUser = {
  userId: "biz-zobocraft",
  role: "business",
  name: "ZoboCraft Beverages Ltd",
  handle: "@zobocraft.ng",
  email: "business@kreatrdesk.app",
  location: "Lagos, Nigeria",
}

export const DEFAULT_CREATOR_SESSION: KreatrSessionUser = {
  userId: "cr-adaobi",
  role: "creator",
  name: "Adaobi Nnamdi",
  handle: "@adaobi.ugc",
  email: "creator@kreatrdesk.app",
  location: "Lagos (Yaba / Lekki)",
}

export function useKreatrSession(defaultRole: UserRole = "business") {
  const [user, setUserState] = React.useState<KreatrSessionUser>(
    defaultRole === "business" ? DEFAULT_BUSINESS_SESSION : DEFAULT_CREATOR_SESSION
  )

  React.useEffect(() => {
    // 1. Check server HttpOnly session cookie first
    void fetch("/api/kreatr/auth", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { user?: KreatrSessionUser } | null) => {
        if (data?.user) {
          setUserState(data.user)
          window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user))
        }
      })
      .catch(() => null)

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<KreatrSessionUser>).detail
      if (detail) setUserState(detail)
    }
    window.addEventListener(SESSION_EVENT, handler)
    return () => window.removeEventListener(SESSION_EVENT, handler)
  }, [])

  const saveSession = React.useCallback((nextUser: KreatrSessionUser) => {
    setUserState(nextUser)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextUser))
      window.localStorage.setItem(ROLE_STORAGE_KEY, nextUser.role)
      window.dispatchEvent(new CustomEvent(SESSION_EVENT, { detail: nextUser }))
    }
  }, [])

  const clearSession = React.useCallback(async () => {
    await fetch("/api/kreatr/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "logout" }),
    }).catch(() => null)
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(SESSION_STORAGE_KEY)
      window.localStorage.removeItem(ROLE_STORAGE_KEY)
    }
  }, [])

  return { user, saveSession, clearSession }
}

export function useActiveRole() {
  const { user, saveSession } = useKreatrSession()
  const setRole = React.useCallback(
    (nextRole: UserRole) => {
      saveSession(
        nextRole === "business" ? DEFAULT_BUSINESS_SESSION : DEFAULT_CREATOR_SESSION
      )
    },
    [saveSession]
  )
  return { role: user.role, setRole, user }
}

export function useKreatrOverview() {
  return useQuery<KreatrOverviewData>({
    queryKey: ["kreatr-overview"],
    queryFn: async () => {
      const res = await fetch("/api/kreatr/overview", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load KreatrDesk workspace")
      return (await res.json()) as KreatrOverviewData
    },
    staleTime: 4_000,
  })
}

export function useInvalidateKreatr() {
  const queryClient = useQueryClient()
  return React.useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["kreatr-overview"] })
  }, [queryClient])
}
