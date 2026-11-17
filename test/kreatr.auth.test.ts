import assert from "node:assert/strict"
import test from "node:test"

import { POST as authPost } from "@/app/api/kreatr/auth/route"
import KreatrUser from "@/models/KreatrUser"

function makeJsonRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/kreatr/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

test("1. Business login succeeds with valid email, role, and password", async () => {
  const res = await authPost(
    makeJsonRequest({
      mode: "login",
      role: "business",
      email: "business@kreatrdesk.app",
      password: "demo1234",
    })
  )
  assert.equal(res.status, 200)
  const data = (await res.json()) as { user: { role: string; email: string; name: string } }
  assert.equal(data.user.role, "business")
  assert.equal(data.user.email, "business@kreatrdesk.app")
  assert.ok(data.user.name.includes("ZoboCraft"))
})

test("2. Creator login succeeds with valid email, role, and password", async () => {
  const res = await authPost(
    makeJsonRequest({
      mode: "login",
      role: "creator",
      email: "creator@kreatrdesk.app",
      password: "demo1234",
    })
  )
  assert.equal(res.status, 200)
  const data = (await res.json()) as { user: { role: string; email: string; handle: string } }
  assert.equal(data.user.role, "creator")
  assert.equal(data.user.email, "creator@kreatrdesk.app")
  assert.equal(data.user.handle, "@adaobi.ugc")
})

test("3. Login rejects wrong password with HTTP 401", async () => {
  const res = await authPost(
    makeJsonRequest({
      mode: "login",
      role: "business",
      email: "business@kreatrdesk.app",
      password: "wrong-password-999",
    })
  )
  assert.equal(res.status, 401)
})

test("4. Login rejects role mismatch (Creator email on Business tab) with HTTP 403", async () => {
  const res = await authPost(
    makeJsonRequest({
      mode: "login",
      role: "business",
      email: "creator@kreatrdesk.app",
      password: "demo1234",
    })
  )
  assert.equal(res.status, 403)
})

test("5. Register creates a new Creator in MongoDB and blocks duplicate email with HTTP 409", async () => {
  const testEmail = `test.creator.${Date.now()}@kreatrdesk.app`

  try {
    const res1 = await authPost(
      makeJsonRequest({
        mode: "register",
        role: "creator",
        name: "Test Creator",
        handle: "@test.creator",
        email: testEmail,
        password: "secret123",
        location: "Lagos (Yaba / Lekki)",
      })
    )
    assert.equal(res1.status, 201)

    const resDup = await authPost(
      makeJsonRequest({
        mode: "register",
        role: "creator",
        name: "Test Creator Duplicate",
        email: testEmail,
        password: "secret123",
      })
    )
    assert.equal(resDup.status, 409)
  } finally {
    await KreatrUser.deleteOne({ email: testEmail })
  }
})

import mongoose from "mongoose"
test.after(async () => {
  await mongoose.disconnect()
})
