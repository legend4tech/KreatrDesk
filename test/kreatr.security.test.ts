import assert from "node:assert/strict"
import test from "node:test"
import { NextRequest } from "next/server"

import { POST as campaignsPost } from "@/app/api/kreatr/campaigns/route"
import { POST as releasePost } from "@/app/api/kreatr/projects/release/route"
import { POST as portfolioPost } from "@/app/api/kreatr/portfolio/route"
import {
  hashPassword,
  SESSION_COOKIE_NAME,
  signSessionToken,
  verifyPassword,
  verifySessionToken,
} from "@/lib/auth"
import { proxy } from "@/proxy"

const creatorToken = signSessionToken({
  userId: "cr-adaobi",
  role: "creator",
  name: "Adaobi Nnamdi",
  handle: "@adaobi.ugc",
  email: "creator@kreatrdesk.app",
  location: "Lagos (Yaba / Lekki)",
})

const businessToken = signSessionToken({
  userId: "biz-zobocraft",
  role: "business",
  name: "ZoboCraft Beverages Ltd",
  handle: "@zobocraft.ng",
  email: "business@kreatrdesk.app",
  location: "Lagos, Nigeria",
})

test("1. Route Guard (proxy.ts) blocks unauthenticated browser access to /business/dashboard and redirects to /login", () => {
  const req = new NextRequest("http://localhost:3000/business/dashboard")
  const res = proxy(req)
  assert.equal(res.status, 307)
  assert.ok(res.headers.get("location")?.includes("/login"))
})

test("2. Route Guard (proxy.ts) blocks unauthenticated browser access to /creator/dashboard and redirects to /login", () => {
  const req = new NextRequest("http://localhost:3000/creator/dashboard")
  const res = proxy(req)
  assert.equal(res.status, 307)
  assert.ok(res.headers.get("location")?.includes("/login"))
})

test("3. Route Guard (proxy.ts) blocks Creator from accessing /business/* and redirects to /creator/dashboard", () => {
  const req = new NextRequest("http://localhost:3000/business/dashboard", {
    headers: {
      cookie: `${SESSION_COOKIE_NAME}=${creatorToken}`,
    },
  })
  const res = proxy(req)
  assert.equal(res.status, 307)
  assert.ok(res.headers.get("location")?.includes("/creator/dashboard"))
})

test("4. Unauthenticated API call to create campaign or release escrow is rejected with HTTP 401", async () => {
  const unauthCamp = await campaignsPost(
    new Request("http://localhost:3000/api/kreatr/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Hack", summary: "Hack", budgetPerCreatorNgn: 1000 }),
    })
  )
  assert.equal(unauthCamp.status, 401)

  const unauthRelease = await releasePost(
    new Request("http://localhost:3000/api/kreatr/projects/release", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: "proj-zobo-adaobi", action: "approve_release" }),
    })
  )
  assert.equal(unauthRelease.status, 401)
})

test("5. Cross-role privilege escalation (Creator trying to release escrow or create campaign) is blocked with HTTP 403", async () => {
  const forbiddenRelease = await releasePost(
    new Request("http://localhost:3000/api/kreatr/projects/release", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${creatorToken}`,
      },
      body: JSON.stringify({ projectId: "proj-zobo-adaobi", action: "approve_release" }),
    })
  )
  assert.equal(forbiddenRelease.status, 403)

  const forbiddenPortfolioByBiz = await portfolioPost(
    new Request("http://localhost:3000/api/kreatr/portfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${businessToken}`,
      },
      body: JSON.stringify({ title: "Fake", mediaUrl: "https://res.cloudinary.com/test.mp4" }),
    })
  )
  assert.equal(forbiddenPortfolioByBiz.status, 403)
})

test("6. Salted scrypt password hashing and HMAC session signature tamper resistance", () => {
  const hash = hashPassword("superSecret99!")
  assert.ok(hash.startsWith("scrypt:"))
  assert.equal(verifyPassword("superSecret99!", hash), true)
  assert.equal(verifyPassword("wrongPassword", hash), false)

  // Tamper with session token payload
  const tamperedToken = `${creatorToken.split(".")[0]}a.${creatorToken.split(".")[1]}`
  assert.equal(verifySessionToken(tamperedToken), null)
})
