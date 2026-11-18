"use client"

import * as React from "react"
import { NIGERIAN_STATES, type NigerianState } from "@/lib/nigerianStates"

export function useNigerianStates() {
  const [states, setStates] = React.useState<NigerianState[]>(NIGERIAN_STATES)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    async function loadStates() {
      try {
        setLoading(true)
        const res = await fetch("/api/kreatr/states")
        if (!res.ok) return
        const data = (await res.json()) as { states: NigerianState[] }
        if (!cancelled && data.states?.length) {
          setStates(data.states)
        }
      } catch {
        // Fallback already preloaded
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void loadStates()
    return () => {
      cancelled = true
    }
  }, [])

  return { states, loading }
}

