import { dbConnect } from "../lib/db"
import { hashPassword } from "../lib/auth"
import KreatrUser from "../models/KreatrUser"

async function run() {
  await dbConnect()
  const users = await KreatrUser.find({})
  let count = 0
  for (const u of users) {
    if (!u.passwordHash.startsWith("scrypt:")) {
      u.passwordHash = hashPassword(u.passwordHash)
      await u.save()
      count++
    }
  }
  console.log(`[Password Security] Upgraded ${count} user passwords to salted scrypt hashes in MongoDB Atlas!`)
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
