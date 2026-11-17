"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRightIcon,
  Building2Icon,
  Loader2Icon,
  SparklesIcon,
  VideoIcon,
} from "lucide-react"
import { toast } from "sonner"

import { BrandLogo } from "@/components/shared/BrandLogo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useKreatrSession, type KreatrSessionUser } from "@/hooks/useKreatrData"
import type { UserRole } from "@/types"

export default function KreatrLoginPage() {
  const router = useRouter()
  const { saveSession } = useKreatrSession()

  const [role, setRole] = React.useState<UserRole>("business")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleTabChange = (val: string) => {
    const nextRole = val === "creator" ? "creator" : "business"
    setRole(nextRole)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.", { id: "auth-toast" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/kreatr/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "login",
          role,
          email: email.trim(),
          password,
        }),
      })
      const payload = (await res.json()) as {
        user?: KreatrSessionUser
        message?: string
      }
      if (!res.ok || !payload.user) {
        throw new Error(payload.message || "Invalid email or password.")
      }

      saveSession(payload.user)
      toast.success(`Signed in as ${payload.user.name}`, { id: "auth-toast" })
      router.push(
        payload.user.role === "business"
          ? "/business/dashboard"
          : "/creator/dashboard"
      )
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed", {
        id: "auth-toast",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-4 py-12 text-foreground">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-3 flex items-center gap-2.5">
            <BrandLogo size={44} />
            <span className="font-display text-2xl font-black tracking-tight">
              KreatrDesk
            </span>
          </Link>
          <Badge
            variant="outline"
            className="border-primary/35 bg-primary/10 text-xs text-primary"
          >
            Role-Based Portal Sign In
          </Badge>
          <h1 className="mt-3 font-display text-2xl font-extrabold">
            Sign in to KreatrDesk
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Select your account type and sign in with your registered email and password.
          </p>
        </div>

        <Card className="rounded-3xl border-border/70 bg-card/85 shadow-lg">
          <CardHeader className="pb-2">
            <Tabs value={role} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="business" className="gap-1.5 text-xs font-semibold">
                  <Building2Icon className="size-3.5" />
                  Business Brand
                </TabsTrigger>
                <TabsTrigger value="creator" className="gap-1.5 text-xs font-semibold">
                  <VideoIcon className="size-3.5" />
                  Creator Studio
                </TabsTrigger>
              </TabsList>

              <TabsContent value="business" className="mt-4">
                <CardTitle className="font-display text-base">
                  Business Campaign &amp; Escrow Portal
                </CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Discover vetted UGC creators, lock Naira/USDC escrow vaults, review AI brief evaluations, and monitor sales attribution.
                </p>
              </TabsContent>

              <TabsContent value="creator" className="mt-4">
                <CardTitle className="font-display text-base">
                  Creator Portfolio &amp; Deliverable Studio
                </CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Publish UGC reels, build your 5-pillar credibility score, apply to escrow-backed campaigns, and track referral earnings.
                </p>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <form onSubmit={(e) => void handleLogin(e)} className="space-y-3.5">
              <div className="space-y-1">
                <Label htmlFor="login-email">
                  {role === "business" ? "Business Work Email" : "Creator Email"}
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder={
                    role === "business"
                      ? "e.g. business@kreatrdesk.app"
                      : "e.g. creator@kreatrdesk.app"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gap-2 rounded-full font-semibold"
              >
                {loading ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <ArrowRightIcon className="size-4" />
                )}
                {role === "business"
                  ? "Sign In to Business Portal"
                  : "Sign In to Creator Studio"}
              </Button>
            </form>

            <div className="text-center text-xs text-muted-foreground">
              Don&apos;t have an account yet?{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Create a Business or Creator account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
