# KreatrDesk 🚀

> **The Decentralized UGC Commerce Engine for African Brands & Creators.**
> Replacing vanity follower metrics with zero-trust smart contract escrows on Base, multimodal AI quality assurance, and direct WhatsApp sales attribution.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Base Sepolia](https://img.shields.io/badge/Base_Sepolia-84532-blue?style=flat&logo=coinbase)](https://sepolia.basescan.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=flat&logo=solidity)](https://soliditylang.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 📌 Problem

In emerging markets across Sub-Saharan Africa, over **$1.2 Billion** is spent annually on influencer and social media marketing with virtually zero ROI tracking:

1. **Vanity Views ≠ Cash Flow:** Local businesses pay ₦200,000–₦500,000 upfront to influencers with 100k+ followers, only to receive 2,000 likes and zero actual customer sales.
2. **Upfront Payment Scams & Non-Payment:** Brands get ghosted after paying deposits; creators get ghosted after delivering finished video files.
3. **The Follower Count Penalty:** High-skill UGC videographers who make Hollywood-level product videos are locked out because social algorithms favor vanity follower counts over craft.
4. **Zero Attribution:** Brands cannot track whether a social video drove real WhatsApp inquiries or paid store checkouts.

---

## 💡 Solution: The 4-Pillar Performance Loop

KreatrDesk builds an end-to-end, zero-trust loop connecting verified businesses with skilled creators:

```
[ Brand Posts Campaign ]
         │
         ▼
[ Dual-Rail Escrow on Base ] (Naira Bank Transfer or Base Sepolia USDC)
         │
         ▼
[ Creator Films & Delivers Video ] (Uploaded to Cloudinary CDN)
         │
         ▼
[ Multimodal Gemini AI QA ] (Evaluates brief compliance & generates 0–100 score)
         │
         ▼
[ Brand Approves & Releases Vault ] (Cryptographic proof on BaseScan)
         │
         ▼
[ Smart Promo Link Attribution ] (Unique /r/[code] tracks Clicks ➜ WhatsApp ➜ Sales)
```

1. **5-Pillar Creator Credibility:** Replaces follower counts with verified scores across:
   - *Creative Ability & Video Quality*
   - *Community Activation & Conversions*
   - *Delivery Reliability & Deadlines*
   - *Campaign Performance*
   - *Audience Influence*
2. **Zero-Trust Smart Contract Escrows (Base Sepolia):**
   - **Rail 1 (Fiat / Naira):** Bank transfer checkout powered by Roqqu liquidity router + instant webhook simulation for demos.
   - **Rail 2 (Web3 / USDC):** Direct wallet deposits (Wagmi / Viem) on Base Sepolia.
   - Creators verify locked funds on BaseScan *before* filming. Money is only released upon brand video approval.
3. **Multimodal AI Content Evaluator:**
   - Powered by Gemini models to watch and evaluate video deliverables against campaign brief requirements (product visibility within 3s, audio clarity, hook timing, CTA).
   - Generates an instant **0–100 compliance scorecard** for the business owner.
4. **End-to-End Sales Attribution:**
   - Every hired creator gets an automated Smart Link (`/r/[code]`).
   - Clicks route buyers directly to the merchant's **WhatsApp** or online store with pre-filled discount codes.
   - Real-time attribution dashboard tracks exact **Clicks → Inquiries → Paid Orders**.

---

## 💰 Monetization Engine (How We Make Money)

| Stream | Description | Margin |
| :--- | :--- | :---: |
| **1. Escrow Release Fee** | **10% take rate** deducted automatically when the brand approves a video deliverable and releases escrow from the Base vault. | ~95% |
| **2. Attribution Commission** | **3%–5% performance affiliate slice** on Gross Merchandise Value (GMV) generated through creator Smart Promo Links. | ~90% |
| **3. Dual-Rail FX Spread** | **1.2% treasury margin** on automated fiat-to-stablecoin conversions via Roqqu liquidity routing. | ~98% |
| **4. Pro Brand SaaS** | **$30–$99/month** enterprise subscription for consumer brands wanting automated AI brief generators and priority creator matching. | ~92% |

---

## 🛠️ Tech Stack

- **Frontend & Fullstack API:** [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + Lucide Icons (Electric Violet Brand Theme)
- **Blockchain Escrow:** [Solidity 0.8.24](https://soliditylang.org/) (`KreatrDeskEscrowVault.sol` / `MockUSDC.sol`) deployed on **Base Sepolia (Chain ID: 84532)**
- **Web3 Connectivity:** [Wagmi 2](https://wagmi.sh/) + [Viem](https://viem.sh/) + [RainbowKit](https://www.rainbowkit.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/) via [Mongoose 9](https://mongoosejs.com/)
- **AI Deliverable Evaluation:** [Gemini Multimodal Models](https://deepmind.google/technologies/gemini/) via OpenRouter
- **Media CDN & Video Storage:** [Cloudinary](https://cloudinary.com/) (H.264 streaming)
- **Fiat On-Ramp:** [Roqqu API Services (RAS)](https://roqqu.com/)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `20.x` or `22.x`
- `pnpm` (v10+)
- MongoDB connection URI (local or Atlas)

### 2. Clone and Install
```bash
git clone https://github.com/legend4tech/KreatrDesk.git
cd KreatrDesk
pnpm install
```

### 3. Environment Setup
Copy the template and configure your environment variables:
```bash
cp .env.example .env.local
```

Required variables in `.env.local`:
```env
# Database
MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/"
MONGODB_DB=kreatrdesk

# Base Sepolia Smart Contracts
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_MOCK_USDC_ADDRESS=0xE9557485Ccd568c3984451f04f4ceF6E5b63809a
NEXT_PUBLIC_KREATR_ESCROW_ADDRESS=0xdd3f4312a0f8a22ca0a5e31fb7dad7afc8916aaa
NEXT_PUBLIC_UMUNNA_POT_ADDRESS=0xdd3f4312a0f8a22ca0a5e31fb7dad7afc8916aaa

# Fiat & AI (Optional for local demo)
ROQQU_SECRET_KEY=RASPRIV_...
ROQQU_PUBLIC_KEY=RASPUB_...
OPENROUTER_API_KEY=sk-or-v1-...

# Media Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the full automated test suite (authentication, campaigns, escrow guards, Cloudinary streaming, and role route guards):

```bash
# Run 16/16 automated test suites
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint
```

---

## 📜 Smart Contract Deployments (Base Sepolia)

| Contract | Network | Address | Explorer |
| :--- | :--- | :--- | :--- |
| **KreatrDesk Escrow Vault** | Base Sepolia | `0xdd3f4312a0f8a22ca0a5e31fb7dad7afc8916aaa` | [View on BaseScan](https://sepolia.basescan.org/address/0xdd3f4312a0f8a22ca0a5e31fb7dad7afc8916aaa) |
| **MockUSDC (mUSDC)** | Base Sepolia | `0xE9557485Ccd568c3984451f04f4ceF6E5b63809a` | [View on BaseScan](https://sepolia.basescan.org/address/0xE9557485Ccd568c3984451f04f4ceF6E5b63809a) |

---

## ⚖️ License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.

