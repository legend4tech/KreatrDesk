import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const session = verifySessionToken(token)

  const isBusinessRoute = pathname.startsWith("/business")
  const isCreatorRoute = pathname.startsWith("/creator")
  const isAuthPage = pathname === "/login" || pathname === "/register"

  // 1. Block unauthenticated access to /business/* and /creator/*
  if ((isBusinessRoute || isCreatorRoute) && !session) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Enforce strict role isolation between /business/* and /creator/*
  if (isBusinessRoute && session && session.role !== "business") {
    return NextResponse.redirect(new URL("/creator/dashboard", request.url))
  }

  if (isCreatorRoute && session && session.role !== "creator") {
    return NextResponse.redirect(new URL("/business/dashboard", request.url))
  }

  // 3. Redirect already-authenticated users away from /login or /register
  if (isAuthPage && session) {
    const dest =
      session.role === "business" ? "/business/dashboard" : "/creator/dashboard"
    return NextResponse.redirect(new URL(dest, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/business/:path*", "/creator/:path*", "/login", "/register"],
}
