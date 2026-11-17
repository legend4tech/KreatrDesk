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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useKreatrSession, type KreatrSessionUser } from "@/hooks/useKreatrData"
import type { UserRole } from "@/types"

export default function KreatrRegisterPage() {
  const router = useRouter()
  const { saveSession } = useKreatrSession()

  const [role, setRole] = React.useState<UserRole>("creator")
  const [name, setName] = React.useState("")
  const [handle, setHandle] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [location, setLocation] = React.useState("Lagos (Yaba / Lekki)")
  const [companyCategory, setCompanyCategory] = React.useState("Food & Beverage")
  const [skillsInput, setSkillsInput] = React.useState(
    "UGC Video Production, Direct-Response Hooks, Pidgin Voiceover"
  )
  const [startingRateNgn, setStartingRateNgn] = React.useState("80000")
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/kreatr/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "register",
          role,
          name,
          handle,
          email,
          password,
          location,
          companyCategory,
          skills: skillsInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          startingRateNgn: Number(startingRateNgn) || 80000,
        }),
      })

      const payload = (await res.json()) as {
        user?: KreatrSessionUser
        message?: string
      }
      if (!res.ok || !payload.user) {
        throw new Error(payload.message || "Registration failed")
      }

      saveSession(payload.user)
      toast.success(`Account created in MongoDB Atlas! Welcome, ${payload.user.name}`, { id: "auth-toast" })
      router.push(role === "business" ? "/business/dashboard" : "/creator/dashboard")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-4 py-12 text-foreground">
      <div className="mx-auto w-full max-w-lg space-y-6">
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
            Create Account
          </Badge>
          <h1 className="mt-3 font-display text-2xl font-extrabold">
            Join KreatrDesk
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Register as a Business to launch campaigns, or as a Creator to build your 5-pillar portfolio.
          </p>
        </div>

        <Card className="rounded-3xl border-border/70 bg-card/85 shadow-lg">
          <CardHeader className="pb-2">
            <Tabs
              value={role}
              onValueChange={(v) => setRole(v === "business" ? "business" : "creator")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="creator" className="gap-1.5 text-xs font-semibold">
                  <VideoIcon className="size-3.5" />
                  I am a Creator
                </TabsTrigger>
                <TabsTrigger value="business" className="gap-1.5 text-xs font-semibold">
                  <Building2Icon className="size-3.5" />
                  I am a Business
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <CardTitle className="mt-4 font-display text-base">
              {role === "creator"
                ? "Set Up Your Creator Studio Profile"
                : "Set Up Your Business Brand Account"}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-2">
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3.5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="reg-name">
                    {role === "business" ? "Company / Brand Name" : "Full Name"}
                  </Label>
                  <Input
                    id="reg-name"
                    placeholder={role === "business" ? "e.g. Eko Roasters Ltd" : "e.g. Kemi Adeleke"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reg-handle">
                    {role === "business" ? "Brand Handle" : "Creator Handle"}
                  </Label>
                  <Input
                    id="reg-handle"
                    placeholder={role === "business" ? "@ekoroasters" : "@kemi.ugc"}
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="reg-email">Email Address</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reg-pass">Password</Label>
                  <Input
                    id="reg-pass"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="reg-loc">Primary City / Hub</Label>
                  <select
                    id="reg-loc"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card px-3 py-2 text-xs"
                  >
                    <option value="Lagos (Yaba / Lekki)">Lagos (Yaba / Lekki)</option>
                    <option value="Lagos (Mainland / Akoka)">Lagos (Mainland / Akoka)</option>
                    <option value="Abuja (Wuse II / Maitama)">Abuja (Wuse II / Maitama)</option>
                    <option value="Enugu (Independence Layout)">Enugu (Independence Layout)</option>
                  </select>
                </div>

                {role === "business" ? (
                  <div className="space-y-1">
                    <Label htmlFor="reg-cat">Industry Category</Label>
                    <select
                      id="reg-cat"
                      value={companyCategory}
                      onChange={(e) => setCompanyCategory(e.target.value)}
                      className="w-full rounded-xl border border-input bg-card px-3 py-2 text-xs"
                    >
                      <option value="Food & Beverage">Food &amp; Beverage</option>
                      <option value="Skincare & Beauty">Skincare &amp; Beauty</option>
                      <option value="Fintech & Apps">Fintech &amp; Apps</option>
                      <option value="Hospitality & Dining">Hospitality &amp; Dining</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Label htmlFor="reg-rate">Starting UGC Rate (NGN)</Label>
                    <Input
                      id="reg-rate"
                      type="number"
                      value={startingRateNgn}
                      onChange={(e) => setStartingRateNgn(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                )}
              </div>

              {role === "creator" && (
                <div className="space-y-1">
                  <Label htmlFor="reg-skills">Primary Skills (comma-separated)</Label>
                  <Input
                    id="reg-skills"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                  />
                </div>
              )}

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
                  ? "Create Business Account"
                  : "Create Creator Studio Account"}
              </Button>

              <div className="text-center text-xs text-muted-foreground">
                Already registered?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Sign in here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
