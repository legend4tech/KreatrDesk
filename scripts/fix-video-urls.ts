import { dbConnect } from "../lib/db"
import PortfolioItem from "../models/PortfolioItem"
import KreatrProject from "../models/KreatrProject"

const VIDEO_MAP: Record<string, string> = {
  "pf-1": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "pf-2": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "pf-3": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "pf-4": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4",
  "pf-5": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
}

async function run() {
  await dbConnect()

  for (const [sampleId, url] of Object.entries(VIDEO_MAP)) {
    await PortfolioItem.updateOne(
      { sampleId },
      { $set: { mediaType: "video", mediaUrl: url } }
    )
  }

  // Also replace any remaining mixkit URLs in custom portfolio items
  await PortfolioItem.updateMany(
    { mediaUrl: { $regex: "mixkit.co" } },
    {
      $set: {
        mediaType: "video",
        mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      },
    }
  )

  const projects = await KreatrProject.find({})
  for (const proj of projects) {
    if (proj.submission && proj.submission.mediaUrl?.includes("mixkit.co")) {
      proj.submission = {
        ...proj.submission,
        mediaUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      }
      proj.markModified("submission")
      await proj.save()
    }
  }

  console.log("[Video Fix] Updated all video URLs in MongoDB Atlas (kreatrdesk)!")
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
