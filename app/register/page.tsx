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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useKreatrSession, type KreatrSessionUser } from "@/hooks/useKreatrData"
import { useNigerianStates } from "@/hooks/useNigerianStates"
import { GEOPOLITICAL_ZONES } from "@/lib/nigerianStates"
import type { UserRole } from "@/types"

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { saveSession } = useKreatrSession()

  const initialRole = searchParams.get("role") === "business" ? "business" : "creator"
  const [role, setRole] = React.useState<UserRole>(initialRole)
  const [name, setName] = React.useState("")
  const [handle, setHandle] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const { states } = useNigerianStates()
  const [selectedState, setSelectedState] = React.useState("Lagos")
  const [selectedHub, setSelectedHub] = React.useState("Lagos (Yaba / Lekki)")
  const [customArea, setCustomArea] = React.useState("")
  const [companyCategory, setCompanyCategory] = React.useState("Food & Beverage")
  const [skillsInput, setSkillsInput] = React.useState(
    "UGC Video Production, Direct-Response Hooks, Pidgin Voiceover"
  )
  const [startingRateNgn, setStartingRateNgn] = React.useState("80000")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const r = searchParams.get("role")
    if (r === "business" || r === "creator") {
      setRole(r)
    }
  }, [searchParams])

  const currentState = states.find((s) => s.name === selectedState)

  const effectiveLocation = React.useMemo(() => {
    if (selectedState === "Nationwide / Remote") {
      return "Nationwide / Remote (Digital UGC)"
    }
    if (selectedHub === "custom") {
      return customArea.trim()
        ? `${customArea.trim()}, ${selectedState}`
        : `${selectedState}, Nigeria`
    }
    if (selectedHub.includes(selectedState)) {
      return selectedHub
    }
    return `${selectedHub}, ${selectedState}`
  }, [selectedState, selectedHub, customArea])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Please enter your name or company name.", { id: "auth-toast" })
      return
    }
    if (!email.trim() || !password) {
      toast.error("Please provide both email and password.", { id: "auth-toast" })
      return
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.", { id: "auth-toast" })
      return
    }

    setLoading(true)
    const toastId = toast.loading("Creating your account on MongoDB Atlas...", { id: "auth-toast" })
    try {
      const res = await fetch("/api/kreatr/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "register",
          role,
          name: name.trim(),
          handle: handle.trim(),
          email: email.trim(),
          password,
          location: effectiveLocation,
          companyCategory,
          skills: skillsInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          startingRateNgn: Number(startingRateNgn) || 80000,
        }),
      })

      const payload = (await res.json().catch(() => ({}))) as {
        user?: KreatrSessionUser
        message?: string
      }
      if (!res.ok || !payload.user) {
        throw new Error(payload.message || "Registration failed")
      }

      saveSession(payload.user)
      toast.success(`Account created! Welcome, ${payload.user.name}`, {
        id: toastId,
        description: `Registered as ${role === "business" ? "Business" : "Creator"}. Redirecting to dashboard...`,
      })
      router.push(role === "business" ? "/business/dashboard" : "/creator/dashboard")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create account", {
        id: toastId,
        description: "Please check your information and try again.",
      })
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
                    placeholder="At least 4 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={4}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="reg-state">State / Region (All 36 States + FCT)</Label>
                  <select
                    id="reg-state"
                    value={selectedState}
                    onChange={(e) => {
                      const nextState = e.target.value
                      setSelectedState(nextState)
                      if (nextState === "Nationwide / Remote") {
                        setSelectedHub("Nationwide / Remote")
                      } else {
                        const found = states.find((s) => s.name === nextState)
                        setSelectedHub(found?.majorHubs[0] || found?.capital || "custom")
                      }
                    }}
                    className="w-full rounded-xl border border-input bg-card px-3 py-2 text-xs"
                  >
                    <option value="Nationwide / Remote">🌐 Nationwide / Remote (Digital UGC)</option>
                    {GEOPOLITICAL_ZONES.map((zone) => {
                      const zoneStates = states.filter((s) => s.zone === zone)
                      if (!zoneStates.length) return null
                      return (
                        <optgroup key={zone} label={`${zone} (${zoneStates.length} States)`}>
                          {zoneStates.map((s) => (
                            <option key={s.code} value={s.name}>
                              {s.name} ({s.capital})
                            </option>
                          ))}
                        </optgroup>
                      )
                    })}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="reg-hub">
                    {selectedState === "Nationwide / Remote"
                      ? "Coverage Mode"
                      : `City / District in ${selectedState}`}
                  </Label>
                  {selectedState === "Nationwide / Remote" ? (
                    <Input
                      readOnly
                      value="Pan-Nigeria Remote Production"
                      className="bg-card/50 text-xs text-muted-foreground"
                    />
                  ) : (
                    <select
                      id="reg-hub"
                      value={selectedHub}
                      onChange={(e) => setSelectedHub(e.target.value)}
                      className="w-full rounded-xl border border-input bg-card px-3 py-2 text-xs"
                    >
                      <optgroup label={`Popular Cities & Creative Hubs in ${selectedState}`}>
                        {currentState?.majorHubs.map((hub) => (
                          <option key={hub} value={hub}>
                            {hub}
                          </option>
                        ))}
                      </optgroup>
                      {currentState?.lgas && currentState.lgas.length > 0 && (
                        <optgroup label={`All ${selectedState} Local Government Areas (LGAs)`}>
                          {currentState.lgas.map((lga) => (
                            <option key={lga} value={`${lga} (LGA)`}>
                              {lga} LGA
                            </option>
                          ))}
                        </optgroup>
                      )}
                      <option value="custom">✍️ Other / Specific Area or LGA in {selectedState}...</option>
                    </select>
                  )}
                </div>
              </div>

              {selectedState !== "Nationwide / Remote" && selectedHub === "custom" && (
                <div className="space-y-1">
                  <Label htmlFor="reg-custom-area">Specify your City, Town, or LGA in {selectedState}</Label>
                  <Input
                    id="reg-custom-area"
                    placeholder={`e.g. Tanke / GRA, ${selectedState}`}
                    value={customArea}
                    onChange={(e) => setCustomArea(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                {role === "business" ? (
                  <div className="space-y-1 sm:col-span-2">
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
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reg-rate" className="text-xs">
                        Starting UGC Rate (NGN)
                      </Label>
                      <span className="font-mono text-xs font-semibold text-primary">
                        ₦{Number(startingRateNgn || 0).toLocaleString()} / video
                      </span>
                    </div>
                    <Input
                      id="reg-rate"
                      type="number"
                      min="10000"
                      step="5000"
                      value={startingRateNgn}
                      onChange={(e) => setStartingRateNgn(e.target.value)}
                      className="font-mono text-xs"
                    />
                    <p className="text-[11px] leading-snug text-muted-foreground">
                      <strong>UGC (User-Generated Content):</strong> Your base price per 60s video deliverable (e.g. TikTok/Reel with hooks &amp; product demo). Typical vetted creator rates range from ₦50,000 to ₦150,000.
                    </p>
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
                <Link
                  href={`/login?role=${role}`}
                  className="font-semibold text-primary hover:underline"
                >
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

export default function KreatrRegisterPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
          <Loader2Icon className="size-6 animate-spin text-primary" />
        </div>
      }
    >
      <RegisterForm />
    </React.Suspense>
  )
}
