import fs from "node:fs"
import path from "node:path"
import { createPublicClient, createWalletClient, formatEther, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { baseSepolia } from "viem/chains"

async function main() {
  const rawKey = process.env.RELAYER_PRIVATE_KEY?.trim() || ""
  if (!/^0x[a-fA-F0-9]{64}$/.test(rawKey)) {
    throw new Error("Missing or invalid RELAYER_PRIVATE_KEY in .env.local")
  }

  const rpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL?.trim() || "https://sepolia.base.org"
  const account = privateKeyToAccount(rawKey as `0x${string}`)

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpcUrl),
  })

  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(rpcUrl),
  })

  const balance = await publicClient.getBalance({ address: account.address })
  console.log("[Deploy] Relayer Address:", account.address)
  console.log("[Deploy] Base Sepolia ETH Balance:", formatEther(balance), "ETH")

  if (balance === BigInt(0)) {
    console.warn("[Deploy] Zero ETH balance on relayer; keeping existing Base Sepolia contract.")
    return
  }

  const mockUsdcAddress = (process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS?.trim() ||
    "0xE9557485Ccd568c3984451f04f4ceF6E5b63809a") as `0x${string}`

  const artifactPath = path.join(
    "/home/legend4tech/Documents/kreatrdesk",
    "contracts/out/UmunnaPot.sol/UmunnaPot.json"
  )
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8")) as {
    abi: unknown[]
    bytecode: { object: string }
  }

  const bytecode = (
    artifact.bytecode.object.startsWith("0x")
      ? artifact.bytecode.object
      : `0x${artifact.bytecode.object}`
  ) as `0x${string}`

  console.log("[Deploy] Deploying dedicated KreatrDesk Escrow Vault contract to Base Sepolia...")
  const deployHash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode,
    args: [mockUsdcAddress],
  })

  console.log("[Deploy] Deployment Tx Hash:", deployHash)
  const receipt = await publicClient.waitForTransactionReceipt({ hash: deployHash })
  console.log("[Deploy] Deployed KreatrDesk Escrow Contract at:", receipt.contractAddress)

  if (receipt.contractAddress) {
    // Initialize Vault #1 (ZoboCraft Launch Escrow) and Vault #2 (KoboPoint POS Campaign Escrow)
    const createHash1 = await walletClient.writeContract({
      address: receipt.contractAddress,
      abi: artifact.abi as any,
      functionName: "createCommunity",
      args: [
        "KreatrDesk Escrow Vault #1: ZoboCraft Sparkling Can Campaign",
        [
          account.address,
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        ],
        1,
      ],
    })
    await publicClient.waitForTransactionReceipt({ hash: createHash1 })
    console.log("[Deploy] Initialized Escrow Vault #1 Tx:", createHash1)

    const createHash2 = await walletClient.writeContract({
      address: receipt.contractAddress,
      abi: artifact.abi as any,
      functionName: "createCommunity",
      args: [
        "KreatrDesk Escrow Vault #2: KoboPoint Micro-POS Explainer",
        [
          account.address,
          "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
        ],
        1,
      ],
    })
    await publicClient.waitForTransactionReceipt({ hash: createHash2 })
    console.log("[Deploy] Initialized Escrow Vault #2 Tx:", createHash2)

    // Update .env.local with the new KreatrDesk Escrow contract address
    const envPath = path.join("/home/legend4tech/Documents/kreatrdesk", ".env.local")
    let envContent = fs.readFileSync(envPath, "utf8")
    envContent = envContent.replace(
      /NEXT_PUBLIC_UMUNNA_POT_ADDRESS=.*/,
      `NEXT_PUBLIC_UMUNNA_POT_ADDRESS=${receipt.contractAddress}`
    )
    if (!envContent.includes("NEXT_PUBLIC_KREATR_ESCROW_ADDRESS=")) {
      envContent += `\nNEXT_PUBLIC_KREATR_ESCROW_ADDRESS=${receipt.contractAddress}\n`
    }
    fs.writeFileSync(envPath, envContent, "utf8")
    console.log("[Deploy] Updated .env.local with new contract address:", receipt.contractAddress)
  }
}

main().catch((err) => {
  console.error("[Deploy Error]:", err)
  process.exit(1)
})
