"use client"

import * as React from "react"
import {
  CheckCircle2Icon,
  Loader2Icon,
  MapPinIcon,
  PlayIcon,
  PlusIcon,
  UploadCloudIcon,
  VideoIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  useInvalidateKreatr,
  useKreatrOverview,
  useKreatrSession,
} from "@/hooks/useKreatrData"
import { formatNgn } from "@/lib/format"
import type { PortfolioSample } from "@/types"

export default function CreatorPortfolioPage() {
  const { user } = useKreatrSession("creator")
  const { data } = useKreatrOverview()
  const invalidate = useInvalidateKreatr()

  const samples = data?.portfolioSamples ?? []

  const [publishOpen, setPublishOpen] = React.useState(false)
  const [publishing, setPublishing] = React.useState(false)
  const [uploadingFile, setUploadingFile] = React.useState(false)
  const [playingSample, setPlayingSample] = React.useState<PortfolioSample | null>(null)

  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [category, setCategory] = React.useState("Skincare & Beauty")
  const [mediaUrl, setMediaUrl] = React.useState(
    "https://res.cloudinary.com/dyuyvwets/video/upload/v1794835027/kreatrdesk/kreatr_ugc_sample_1.mp4"
  )
  const [thumbnailUrl, setThumbnailUrl] = React.useState("")
  const [skillsInput, setSkillsInput] = React.useState(
    "UGC Video Production, Direct-Response Hooks, Pidgin Voiceover"
  )
  const [rateNgn, setRateNgn] = React.useState("85000")

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingFile(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/kreatr/upload", {
        method: "POST",
        body: formData,
      })
      const payload = (await res.json()) as {
        url?: string
        thumbnailUrl?: string
        message?: string
      }
      if (!res.ok || !payload.url) {
        throw new Error(payload.message || "Cloudinary upload failed")
      }
      setMediaUrl(payload.url)
      if (payload.thumbnailUrl) setThumbnailUrl(payload.thumbnailUrl)
      toast.success("Video uploaded to Cloudinary CDN!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploadingFile(false)
    }
  }

  const handlePublishSample = async (e: React.FormEvent) => {
    e.preventDefault()
    setPublishing(true)
    try {
      const res = await fetch("/api/kreatr/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: user.userId || "cr-adaobi",
          title,
          description,
          category,
          mediaType: "video",
          mediaUrl,
          thumbnailUrl: thumbnailUrl || undefined,
          skills: skillsInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          rateNgn: Number(rateNgn) || 85000,
        }),
      })
      if (!res.ok) throw new Error("Failed to publish sample")
      invalidate()
      toast.success("Sample video saved to MongoDB Atlas!")
      setTitle("")
      setDescription("")
      setPublishOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not publish")
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            My Sample Videos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload your best product videos to Cloudinary so businesses can watch your work and hire you.
          </p>
        </div>

        <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-1.5 rounded-full px-5 font-semibold">
                <PlusIcon className="size-4" />
                Upload New Sample Video
              </Button>
            }
          />
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-lg">
                Upload Sample Video to Cloudinary
              </DialogTitle>
              <DialogDescription>
                Choose a video file from your computer/phone (uploaded to Cloudinary CDN) and save it to MongoDB Atlas.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => void handlePublishSample(e)} className="space-y-3.5">
              <div className="space-y-1">
                <Label htmlFor="p-title">Video Title</Label>
                <Input
                  id="p-title"
                  placeholder="e.g. 3-Second Hook: Vitamin C Serum Texture Test"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="p-cat">Category</Label>
                  <select
                    id="p-cat"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card px-3 py-2 text-xs"
                  >
                    <option value="Skincare & Beauty">Skincare &amp; Beauty</option>
                    <option value="Food & Beverage">Food &amp; Beverage</option>
                    <option value="Fintech & Apps">Fintech &amp; Apps</option>
                    <option value="Hospitality & Dining">Hospitality &amp; Dining</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="p-rate">Your Starting Rate (NGN)</Label>
                  <Input
                    id="p-rate"
                    type="number"
                    value={rateNgn}
                    onChange={(e) => setRateNgn(e.target.value)}
                    className="font-mono"
                    required
                  />
                </div>
              </div>

              {/* Real Cloudinary File Upload Input */}
              <div className="space-y-1.5 rounded-2xl border border-primary/30 bg-primary/5 p-3.5">
                <Label htmlFor="p-file" className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <UploadCloudIcon className="size-4" />
                  <span>Select Video File from Device (Uploads to Cloudinary CDN)</span>
                </Label>
                <Input
                  id="p-file"
                  type="file"
                  accept="video/*,image/*"
                  disabled={uploadingFile}
                  onChange={(e) => void handleFileUpload(e)}
                  className="bg-card text-xs"
                />
                {uploadingFile && (
                  <div className="flex items-center gap-1.5 text-xs text-primary">
                    <Loader2Icon className="size-3.5 animate-spin" />
                    <span>Uploading video to Cloudinary CDN...</span>
                  </div>
                )}
                {mediaUrl.includes("res.cloudinary.com") && !uploadingFile && (
                  <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2Icon className="size-3.5 shrink-0" />
                    <span className="min-w-0 truncate">Cloudinary CDN Ready: {mediaUrl}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="p-skills">Skills Shown</Label>
                <Input
                  id="p-skills"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="p-desc">Short Description</Label>
                <Input
                  id="p-desc"
                  placeholder="Explain how you shot the video..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={publishing || uploadingFile}
                className="w-full rounded-full"
              >
                {publishing && <Loader2Icon className="size-4 animate-spin" />}
                Save &amp; Publish Video
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {samples.map((s) => (
          <Card
            key={s.id}
            className="overflow-hidden rounded-3xl border-border/60 bg-card/80 shadow-xs"
          >
            <div
              onClick={() => setPlayingSample(s)}
              className="group relative h-56 w-full cursor-pointer bg-muted"
            >
              <img src={s.thumbnailUrl} alt={s.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-black/70 text-white text-xs">
                  <VideoIcon className="mr-1.5 size-3.5 text-primary" />
                  {s.category}
                </Badge>
              </div>
              <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between text-white">
                <div>
                  <span className="inline-flex items-center gap-1 text-xs text-white/80">
                    <MapPinIcon className="size-3.5 text-primary" />
                    {s.creatorLocation}
                  </span>
                  <h3 className="mt-0.5 font-display text-base font-bold">{s.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPlayingSample(s)
                  }}
                  className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-110"
                >
                  <PlayIcon className="size-4 fill-current" />
                </button>
              </div>
            </div>

            <div className="space-y-3 p-5">
              <p className="text-xs text-muted-foreground">{s.description}</p>
              <div className="flex items-center justify-between border-t border-border/50 pt-3">
                <div className="flex flex-wrap gap-1.5">
                  {s.skills.slice(0, 2).map((sk) => (
                    <Badge key={sk} variant="secondary" className="text-[10px]">
                      {sk}
                    </Badge>
                  ))}
                </div>
                <span className="font-mono text-xs font-bold text-primary">
                  Rate: {formatNgn(s.rateNgn)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* IN-APP VIDEO PLAYER MODAL */}
      <Dialog
        open={Boolean(playingSample)}
        onOpenChange={(val) => {
          if (!val) setPlayingSample(null)
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          {playingSample && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-lg">
                  {playingSample.title}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {playingSample.creatorName} ({playingSample.creatorHandle})
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-hidden rounded-2xl border border-border bg-black">
                <video
                  key={playingSample.mediaUrl}
                  src={playingSample.mediaUrl}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="max-h-[420px] w-full object-contain"
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
