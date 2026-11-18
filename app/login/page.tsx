"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
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

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { saveSession } = useKreatrSession()

  const initialRole = searchParams.get("role") === "creator" ? "creator" : "business"
  const [role, setRole] = React.useState<UserRole>(initialRole)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  // Sync role if query param updates
  React.useEffect(() => {
    const r = searchParams.get("role")
    if (r === "creator" || r === "business") {
      setRole(r)
    }
  }, [searchParams])

  const handleTabChange = (val: string) => {
    const nextRole = val === "creator" ? "creator" : "business"
    setRole(nextRole)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      toast.error("Please enter both your email and password.", {
        id: "auth-toast",
        description: "Email and password are required to sign in.",
      })
      return
    }

    setLoading(true)
    const toastId = toast.loading("Verifying credentials and signing in...", { id: "auth-toast" })
    try {
      let res = await fetch("/api/kreatr/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "login",
          role,
          email: email.trim(),
          password,
        }),
      })
      let payload = (await res.json().catch(() => ({}))) as {
        user?: KreatrSessionUser
        message?: string
      }

      // If backend reports a role mismatch (e.g. Creator signed in while Business tab is active)
      if (res.status === 403 && payload.message?.toLowerCase().includes("switch the tab")) {
        const detectedRole: UserRole = payload.message.toLowerCase().includes("creator")
          ? "creator"
          : "business"
        setRole(detectedRole)
        toast.info(
          `Detected ${detectedRole === "creator" ? "Creator Studio" : "Business"} account. Switching role and signing in...`,
          { id: toastId }
        )

        // Automatically re-attempt login with the matching role so user is never blocked!
        res = await fetch("/api/kreatr/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "login",
            role: detectedRole,
            email: email.trim(),
            password,
          }),
        })
        payload = (await res.json().catch(() => ({}))) as {
          user?: KreatrSessionUser
          message?: string
        }
      }

      if (!res.ok || !payload.user) {
        throw new Error(payload.message || "Invalid email or password.")
      }

      saveSession(payload.user)
      toast.success(`Welcome back, ${payload.user.name}!`, {
        id: toastId,
        description: `Successfully signed in to ${payload.user.role === "business" ? "Business Portal" : "Creator Studio"}.`,
      })
      router.push(
        payload.user.role === "business"
          ? "/business/dashboard"
          : "/creator/dashboard"
      )
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed", {
        id: toastId,
        description: "Please verify your email and password, then try again.",
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
              <Link
                href={`/register?role=${role}`}
                className="font-semibold text-primary hover:underline"
              >
                Create a Business or Creator account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function KreatrLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
          <Loader2Icon className="size-6 animate-spin text-primary" />
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  )
}
