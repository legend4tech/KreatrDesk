import crypto from "node:crypto"
import fs from "node:fs"
import { dbConnect } from "../lib/db"
import PortfolioItem from "../models/PortfolioItem"
import KreatrProject from "../models/KreatrProject"

const LOCAL_VIDEO_SOURCES = [
  "/home/legend4tech/.config/google-chrome/Default/Extensions/jgjaeacdkonaoafenlfkkkmbaopkbilf/5.5.6_0/static/videos/allInOneChat.mp4",
  "/home/legend4tech/.config/google-chrome/Default/Extensions/jgjaeacdkonaoafenlfkkkmbaopkbilf/5.5.6_0/static/videos/searchAgentNew.mp4",
  "/home/legend4tech/.config/google-chrome/Default/Extensions/jgjaeacdkonaoafenlfkkkmbaopkbilf/5.5.6_0/static/videos/compareAnswer.mp4",
]

async function uploadToCloudinary(filePath: string, publicId: string): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() || "dyuyvwets"
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim() || "131931173211181"
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim() || "zeSwec3nTN9VmqIYrTWOhvwbsYc"

  const timestamp = Math.floor(Date.now() / 1000).toString()
  const folder = "kreatrdesk"
  const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
  const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex")

  const fileBytes = fs.readFileSync(filePath)
  const blob = new Blob([fileBytes], { type: "video/mp4" })

  const form = new FormData()
  form.append("file", blob, `${publicId}.mp4`)
  form.append("api_key", apiKey)
  form.append("timestamp", timestamp)
  form.append("folder", folder)
  form.append("public_id", publicId)
  form.append("signature", signature)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
    method: "POST",
    body: form,
  })
  const data = (await res.json()) as { secure_url?: string; error?: { message?: string } }
  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Cloudinary upload failed")
  }
  return data.secure_url
}

async function run() {
  await dbConnect()

  console.log("[Cloudinary Seed] Uploading real MP4 videos to your Cloudinary CDN (dyuyvwets)...")
  const uploadedUrls: string[] = []

  for (let i = 0; i < LOCAL_VIDEO_SOURCES.length; i++) {
    const src = LOCAL_VIDEO_SOURCES[i]
    if (fs.existsSync(src)) {
      const url = await uploadToCloudinary(src, `kreatr_ugc_sample_${i + 1}`)
      console.log(`[Cloudinary Seed] Uploaded Video #${i + 1}:`, url)
      uploadedUrls.push(url)
    }
  }

  if (uploadedUrls.length > 0) {
    const items = await PortfolioItem.find({})
    for (let i = 0; i < items.length; i++) {
      const targetUrl = uploadedUrls[i % uploadedUrls.length]
      items[i].mediaType = "video"
      items[i].mediaUrl = targetUrl
      await items[i].save()
    }

    const projects = await KreatrProject.find({})
    for (const proj of projects) {
      if (proj.submission) {
        proj.submission = {
          ...proj.submission,
          mediaType: "video",
          mediaUrl: uploadedUrls[0],
        }
        proj.markModified("submission")
        await proj.save()
      }
    }
    console.log("[Cloudinary Seed] Updated all MongoDB Atlas portfolio & project videos with live Cloudinary HTTPS URLs!")
  }

  process.exit(0)
}

run().catch((err) => {
  console.error("[Cloudinary Seed Error]:", err)
  process.exit(1)
})
