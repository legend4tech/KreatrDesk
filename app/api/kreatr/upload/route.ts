import crypto from "node:crypto"
import { NextResponse } from "next/server"
import { requireApiRole } from "@/lib/auth"

const ALLOWED_MIMES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "image/jpeg",
  "image/png",
  "image/webp",
])
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024 // 50 MB

export async function POST(request: Request) {
  try {
    const auth = requireApiRole(request, ["creator", "business"])
    if (auth.errorResponse) return auth.errorResponse

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { message: "Cloudinary credentials missing in .env.local" },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { message: "No video or image file provided." },
        { status: 400 }
      )
    }

    if (!ALLOWED_MIMES.has(file.type)) {
      return NextResponse.json(
        { message: `Unsupported file type (${file.type}). Allowed: MP4, WebM, MOV, JPG, PNG, WebP.` },
        { status: 400 }
      )
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { message: "File exceeds maximum allowed size of 50 MB." },
        { status: 400 }
      )
    }

    const timestamp = Math.floor(Date.now() / 1000).toString()
    const folder = "kreatrdesk"
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign)
      .digest("hex")

    const uploadForm = new FormData()
    uploadForm.append("file", file)
    uploadForm.append("api_key", apiKey)
    uploadForm.append("timestamp", timestamp)
    uploadForm.append("folder", folder)
    uploadForm.append("signature", signature)

    const isVideo = file.type.startsWith("video/")
    const resourceType = isVideo ? "video" : "auto"

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: uploadForm,
      }
    )

    const data = (await res.json()) as {
      secure_url?: string
      resource_type?: string
      error?: { message?: string }
    }

    if (!res.ok || !data.secure_url) {
      throw new Error(data.error?.message || "Cloudinary upload failed")
    }

    const thumbnailUrl =
      data.resource_type === "video"
        ? data.secure_url.replace(/\.[a-zA-Z0-9]+$/, ".jpg")
        : data.secure_url

    return NextResponse.json({
      url: data.secure_url,
      thumbnailUrl,
      mediaType: data.resource_type === "video" ? "video" : "image",
    })
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Cloud media upload failed",
      },
      { status: 500 }
    )
  }
}
