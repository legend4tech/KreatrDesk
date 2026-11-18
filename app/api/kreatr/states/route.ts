import { NextResponse } from "next/server"
import { NIGERIAN_STATES, GEOPOLITICAL_ZONES, type NigerianState } from "@/lib/nigerianStates"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const zoneQuery = url.searchParams.get("zone")?.trim().toLowerCase()
    const searchQuery = url.searchParams.get("search")?.trim().toLowerCase()

    let states: NigerianState[] = [...NIGERIAN_STATES]

    if (zoneQuery) {
      states = states.filter((s) => s.zone.toLowerCase() === zoneQuery)
    }

    if (searchQuery) {
      states = states.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery) ||
          s.capital.toLowerCase().includes(searchQuery) ||
          s.majorHubs.some((h) => h.toLowerCase().includes(searchQuery))
      )
    }

    return NextResponse.json({
      country: "Nigeria",
      totalStates: 36,
      territories: 1, // FCT
      count: states.length,
      zones: GEOPOLITICAL_ZONES,
      states,
    })
  } catch (err) {
    return NextResponse.json(
      {
        message: err instanceof Error ? err.message : "Failed to load states",
        states: NIGERIAN_STATES,
      },
      { status: 500 }
    )
  }
}

