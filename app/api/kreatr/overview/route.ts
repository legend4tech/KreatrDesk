import { NextResponse } from "next/server"
import { fetchOverviewFromDb } from "@/lib/kreatrService"

export const dynamic = "force-dynamic"

export async function GET() {
  const data = await fetchOverviewFromDb()
  return NextResponse.json(data)
}
