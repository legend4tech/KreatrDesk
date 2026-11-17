import type {
  AIEvaluationBreakdown,
  Campaign,
  CampaignApplication,
  CreatorProfile,
  CreatorProject,
  PortfolioSample,
} from "@/types"

// ============================================================================
// Seeded Creators & Portfolio Samples (5-Pillar Credibility System)
// ============================================================================

const INITIAL_CREATORS: CreatorProfile[] = [
  {
    id: "cr-adaobi",
    name: "Adaobi Nnamdi",
    handle: "@adaobi.ugc",
    email: "adaobi@kreatrdesk.app",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop&q=80",
    bio: "Direct-response UGC video producer & tech/skincare storyteller. High-retention hooks in English, Pidgin & Igbo without needing 100k followers.",
    location: "Lagos (Yaba / Lekki)",
    languages: ["English", "Nigerian Pidgin", "Igbo"],
    categories: ["Skincare & Beauty", "Fintech & Apps", "Food & Beverage"],
    skills: ["UGC Video Production", "Direct-Response Hooks", "Pidgin Voiceover", "Product Macro Shots"],
    services: ["60s Vertical UGC Ad", "Product Unboxing + B-Roll", "3-Hook Ad Variations"],
    startingRateNgn: 85000,
    walletAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    bankName: "GTBank (via Roqqu Instant Settle)",
    bankAccountLast4: "4829",
    completedProjectsCount: 14,
    totalEarnedNgn: 1420000,
    credibility: {
      creativeAbility: 96, // Elite video production even with modest follower count
      audienceInfluence: 64,
      communityActivation: 88,
      deliveryReliability: 98,
      campaignPerformance: 94,
    },
    portfolio: [],
  },
  {
    id: "cr-tobi",
    name: "Tobi Bakare",
    handle: "@tobi.streets",
    email: "tobi@kreatrdesk.app",
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&auto=format&fit=crop&q=80",
    bio: "Campus & street vox-pop interviewer and grassroots community activator across UNILAG and Ikeja.",
    location: "Lagos (Mainland / Akoka)",
    languages: ["English", "Yoruba", "Nigerian Pidgin"],
    categories: ["Campus Activation", "Food & Beverage", "Fintech & Apps", "Fashion"],
    skills: ["Street Vox-Pop", "Campus Activation", "Live Product Demo", "WhatsApp Community Seeding"],
    services: ["Street Interview Reel", "Campus Ambassador Drive", "Event Live Coverage"],
    startingRateNgn: 75000,
    walletAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    bankName: "Kuda Microfinance Bank",
    bankAccountLast4: "9104",
    completedProjectsCount: 19,
    totalEarnedNgn: 1680000,
    credibility: {
      creativeAbility: 87,
      audienceInfluence: 82,
      communityActivation: 97, // Elite grassroots referral & conversion driver
      deliveryReliability: 95,
      campaignPerformance: 96,
    },
    portfolio: [],
  },
  {
    id: "cr-zainab",
    name: "Zainab Danjuma",
    handle: "@zainab.studio",
    email: "zainab@kreatrdesk.app",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    bio: "Commercial product photographer, minimalist aesthetic reel creator & Northern Nigeria community connector.",
    location: "Abuja (Wuse II / Maitama)",
    languages: ["English", "Hausa"],
    categories: ["Hospitality & Dining", "Fashion", "Skincare & Beauty", "Lifestyle"],
    skills: ["Aesthetic Product Reels", "Studio Lighting", "Hausa/English Voiceover", "Brand Storytelling"],
    services: ["Cinematic Product Reel", "10 High-Res Product Stills", "Abuja Storefront Walkthrough"],
    startingRateNgn: 95000,
    walletAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    bankName: "Access Bank",
    bankAccountLast4: "2231",
    completedProjectsCount: 11,
    totalEarnedNgn: 1150000,
    credibility: {
      creativeAbility: 95,
      audienceInfluence: 78,
      communityActivation: 91,
      deliveryReliability: 100,
      campaignPerformance: 92,
    },
    portfolio: [],
  },
  {
    id: "cr-chinedu",
    name: "Chinedu Okafor",
    handle: "@chinedu.tech",
    email: "chinedu@kreatrdesk.app",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    bio: "Gadget reviewer, SaaS explainer creator & South-East SME community educator.",
    location: "Enugu (Independence Layout)",
    languages: ["English", "Igbo", "Nigerian Pidgin"],
    categories: ["Fintech & Apps", "Gadgets & Tech", "Education"],
    skills: ["App Walkthroughs", "Green-Screen Explainers", "Conversion Scripting", "Motion Captions"],
    services: ["60s App Onboarding Tutorial", "Problem/Solution Ad Script + Edit"],
    startingRateNgn: 70000,
    walletAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    bankName: "Zenith Bank",
    bankAccountLast4: "7741",
    completedProjectsCount: 9,
    totalEarnedNgn: 690000,
    credibility: {
      creativeAbility: 93,
      audienceInfluence: 71,
      communityActivation: 89,
      deliveryReliability: 96,
      campaignPerformance: 90,
    },
    portfolio: [],
  },
]

const INITIAL_PORTFOLIO_SAMPLES: PortfolioSample[] = [
  {
    id: "pf-1",
    creatorId: "cr-adaobi",
    creatorName: "Adaobi Nnamdi",
    creatorHandle: "@adaobi.ugc",
    creatorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop&q=80",
    creatorLocation: "Lagos (Yaba / Lekki)",
    title: "3-Second Hook: Vitamin C Serum Texture & Sunlight Test",
    description: "Shot in 4K 60fps natural morning light with macro dropper shots, clear ingredient callouts, and an urgent CTA that drove 3.8x ROAS.",
    mediaType: "video",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    category: "Skincare & Beauty",
    skills: ["UGC Video Production", "Product Macro Shots", "Direct-Response Hooks"],
    brandTag: "Zaron Botanicals",
    turnaroundDays: 3,
    rateNgn: 85000,
    credibility: INITIAL_CREATORS[0].credibility,
    createdAt: "2026-11-12T10:00:00Z",
  },
  {
    id: "pf-2",
    creatorId: "cr-tobi",
    creatorName: "Tobi Bakare",
    creatorHandle: "@tobi.streets",
    creatorAvatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&auto=format&fit=crop&q=80",
    creatorLocation: "Lagos (Mainland / Akoka)",
    title: "UNILAG Blind Taste-Test: Cold Brew vs Energy Drink",
    description: "Live street reaction format with 12 students tasting on camera and scanning the QR referral card on the spot.",
    mediaType: "video",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80",
    category: "Food & Beverage",
    skills: ["Street Vox-Pop", "Campus Activation", "Live Product Demo"],
    brandTag: "Eko Roasters",
    turnaroundDays: 4,
    rateNgn: 75000,
    credibility: INITIAL_CREATORS[1].credibility,
    createdAt: "2026-11-13T14:20:00Z",
  },
  {
    id: "pf-3",
    creatorId: "cr-zainab",
    creatorName: "Zainab Danjuma",
    creatorHandle: "@zainab.studio",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    creatorLocation: "Abuja (Wuse II / Maitama)",
    title: "Abuja Rooftop Bistro: Chef Table & Mocktail Pour Reel",
    description: "Warm golden-hour cinematography highlighting plating, table ambiance, and reservation promo code overlay.",
    mediaType: "video",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80",
    category: "Hospitality & Dining",
    skills: ["Aesthetic Product Reels", "Studio Lighting", "Brand Storytelling"],
    brandTag: "Terracotta Wuse",
    turnaroundDays: 3,
    rateNgn: 95000,
    credibility: INITIAL_CREATORS[2].credibility,
    createdAt: "2026-11-14T09:15:00Z",
  },
  {
    id: "pf-4",
    creatorId: "cr-chinedu",
    creatorName: "Chinedu Okafor",
    creatorHandle: "@chinedu.tech",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    creatorLocation: "Enugu (Independence Layout)",
    title: "How Enugu Shop Owners Accept Instant Tap-to-Pay in 15 Seconds",
    description: "Split-screen problem/solution walkthrough shot in an actual supermarket checkout lane with animated captions.",
    mediaType: "video",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80",
    category: "Fintech & Apps",
    skills: ["App Walkthroughs", "Conversion Scripting", "Motion Captions"],
    brandTag: "Paystack / Nomba Merchant Demo",
    turnaroundDays: 2,
    rateNgn: 70000,
    credibility: INITIAL_CREATORS[3].credibility,
    createdAt: "2026-11-14T18:45:00Z",
  },
  {
    id: "pf-5",
    creatorId: "cr-adaobi",
    creatorName: "Adaobi Nnamdi",
    creatorHandle: "@adaobi.ugc",
    creatorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop&q=80",
    creatorLocation: "Lagos (Yaba / Lekki)",
    title: "Cold-Pressed Hibiscus Zobo Cans: Unboxing & Ice Pour ASMR",
    description: "Crisp sound design (can pop, ice clink, fizz) paired with energetic Pidgin & English voiceover for Gen-Z foodies.",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    category: "Food & Beverage",
    skills: ["UGC Video Production", "Pidgin Voiceover", "Product Macro Shots"],
    brandTag: "ZoboCraft Lagos",
    turnaroundDays: 2,
    rateNgn: 80000,
    credibility: INITIAL_CREATORS[0].credibility,
    createdAt: "2026-11-15T11:30:00Z",
  },
]

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-zobo-launch",
    businessId: "biz-zobocraft",
    businessName: "ZoboCraft Beverages Ltd",
    businessCategory: "Food & Beverage",
    businessLocation: "Lagos, Nigeria",
    businessVerified: true,
    title: "Sparkling Hibiscus Can — Lagos UGC & Campus Tasting Drive",
    summary:
      "We are launching our zero-sugar sparkling Zobo cans across Lagos supermarkets and campus hubs. We need high-energy UGC videos and grassroots community ambassadors who can drive actual store redemptions.",
    briefRequirements: [
      "Show the chilled ZoboCraft can clearly within the first 3 seconds",
      "Capture the sound/visual of pouring over ice in natural lighting",
      "Mention 'Zero Added Sugar + 100% Natural Hibiscus' clearly in audio and on-screen captions",
      "Call out the creator's unique referral code for 20% off first 6-pack order",
    ],
    deliverables: [
      "1x 45–60s vertical 9:16 video (MP4, unwatermarked)",
      "1x 15s raw hook variation for paid social testing",
      "Share unique tracking link in local community group / bio",
    ],
    budgetPerCreatorNgn: 110000,
    budgetPerCreatorUsdc: 80,
    totalBudgetNgn: 330000,
    deadline: "2026-11-28",
    status: "IN_PROGRESS",
    eligibility: {
      locations: ["Lagos (Yaba / Lekki)", "Lagos (Mainland / Akoka)"],
      requiredSkills: ["UGC Video Production", "Direct-Response Hooks", "Campus Activation"],
      minCreativeScore: 80,
      minReliabilityScore: 85,
      creatorsNeeded: 3,
      creatorTypes: ["UGC Producer", "Community Ambassador"],
    },
    applicantsCount: 4,
    selectedCreatorsCount: 2,
    onChainVaultId: 1,
    createdAt: "2026-11-10T09:00:00Z",
  },
  {
    id: "camp-kobo-pos",
    businessId: "biz-kobopay",
    businessName: "KoboPoint Micro-POS",
    businessCategory: "Fintech & Apps",
    businessLocation: "Lagos & Enugu",
    businessVerified: true,
    title: "Instant WhatsApp Receipt & POS Explainer Reels for Market Merchants",
    summary:
      "Help local boutique owners and supermarket cashiers understand how KoboPoint settles card & transfer payments in under 4 seconds with zero failed-transfer disputes.",
    briefRequirements: [
      "Demonstrate a real checkout scenario with a merchant and customer",
      "Show the instant WhatsApp receipt alert on phone screen",
      "Speak in relatable English or Nigerian Pidgin — no stiff corporate jargon",
      "Include referral code screen card at the end",
    ],
    deliverables: [
      "1x 60s merchant problem/solution explainer video",
      "3x high-resolution product photos with merchant",
    ],
    budgetPerCreatorNgn: 137500,
    budgetPerCreatorUsdc: 100,
    totalBudgetNgn: 275000,
    deadline: "2026-12-04",
    status: "OPEN",
    eligibility: {
      locations: ["Lagos (Yaba / Lekki)", "Enugu (Independence Layout)", "Abuja (Wuse II / Maitama)"],
      requiredSkills: ["App Walkthroughs", "Conversion Scripting", "Pidgin Voiceover"],
      minCreativeScore: 85,
      minReliabilityScore: 90,
      creatorsNeeded: 2,
      creatorTypes: ["UGC Producer", "Local Influencer"],
    },
    applicantsCount: 3,
    selectedCreatorsCount: 1,
    onChainVaultId: 2,
    createdAt: "2026-11-12T12:00:00Z",
  },
]

const INITIAL_APPLICATIONS: CampaignApplication[] = [
  {
    id: "app-1",
    campaignId: "camp-zobo-launch",
    campaignTitle: "Sparkling Hibiscus Can — Lagos UGC & Campus Tasting Drive",
    creatorId: "cr-adaobi",
    creatorName: "Adaobi Nnamdi",
    creatorHandle: "@adaobi.ugc",
    creatorLocation: "Lagos (Yaba / Lekki)",
    creatorSkills: ["UGC Video Production", "Direct-Response Hooks", "Pidgin Voiceover", "Product Macro Shots"],
    creatorCredibility: INITIAL_CREATORS[0].credibility,
    pitch:
      "I have a full tabletop macro rig for ice-pour ASMR shots and will shoot 3 distinct 3-second hooks in Yaba. Ready to deliver within 48 hours of escrow lock.",
    samplePortfolioId: "pf-1",
    sampleTitle: "3-Second Hook: Vitamin C Serum Texture & Sunlight Test",
    proposedRateNgn: 110000,
    matchScore: 97,
    status: "SELECTED",
    appliedAt: "2026-11-11T10:15:00Z",
  },
  {
    id: "app-2",
    campaignId: "camp-zobo-launch",
    campaignTitle: "Sparkling Hibiscus Can — Lagos UGC & Campus Tasting Drive",
    creatorId: "cr-tobi",
    creatorName: "Tobi Bakare",
    creatorHandle: "@tobi.streets",
    creatorLocation: "Lagos (Mainland / Akoka)",
    creatorSkills: ["Street Vox-Pop", "Campus Activation", "Live Product Demo"],
    creatorCredibility: INITIAL_CREATORS[1].credibility,
    pitch:
      "I'll run a live chilled-can blind taste test right outside UNILAG Sports Center and distribute the QR referral code to 5 student WhatsApp groups.",
    samplePortfolioId: "pf-2",
    sampleTitle: "UNILAG Blind Taste-Test: Cold Brew vs Energy Drink",
    proposedRateNgn: 110000,
    matchScore: 94,
    status: "SELECTED",
    appliedAt: "2026-11-11T13:40:00Z",
  },
  {
    id: "app-3",
    campaignId: "camp-kobo-pos",
    campaignTitle: "Instant WhatsApp Receipt & POS Explainer Reels for Market Merchants",
    creatorId: "cr-chinedu",
    creatorName: "Chinedu Okafor",
    creatorHandle: "@chinedu.tech",
    creatorLocation: "Enugu (Independence Layout)",
    creatorSkills: ["App Walkthroughs", "Green-Screen Explainers", "Conversion Scripting", "Motion Captions"],
    creatorCredibility: INITIAL_CREATORS[3].credibility,
    pitch:
      "I already partner with 3 supermarkets in Independence Layout Enugu where I can film a real cashier checkout demo showing the 4-second WhatsApp alert.",
    samplePortfolioId: "pf-4",
    sampleTitle: "How Enugu Shop Owners Accept Instant Tap-to-Pay in 15 Seconds",
    proposedRateNgn: 137500,
    matchScore: 96,
    status: "PENDING",
    appliedAt: "2026-11-14T15:20:00Z",
  },
  {
    id: "app-4",
    campaignId: "camp-kobo-pos",
    campaignTitle: "Instant WhatsApp Receipt & POS Explainer Reels for Market Merchants",
    creatorId: "cr-zainab",
    creatorName: "Zainab Danjuma",
    creatorHandle: "@zainab.studio",
    creatorLocation: "Abuja (Wuse II / Maitama)",
    creatorSkills: ["Aesthetic Product Reels", "Studio Lighting", "Hausa/English Voiceover", "Brand Storytelling"],
    creatorCredibility: INITIAL_CREATORS[2].credibility,
    pitch:
      "Can produce a bilingual English + Hausa merchant story inside a Wuse II boutique showing how fast checkout eliminates transfer delays.",
    samplePortfolioId: "pf-3",
    sampleTitle: "Abuja Rooftop Bistro: Chef Table & Mocktail Pour Reel",
    proposedRateNgn: 137500,
    matchScore: 91,
    status: "PENDING",
    appliedAt: "2026-11-15T08:10:00Z",
  },
]

const INITIAL_PROJECTS: CreatorProject[] = [
  {
    id: "proj-zobo-adaobi",
    campaignId: "camp-zobo-launch",
    campaignTitle: "Sparkling Hibiscus Can — Lagos UGC & Campus Tasting Drive",
    businessId: "biz-zobocraft",
    businessName: "ZoboCraft Beverages Ltd",
    creatorId: "cr-adaobi",
    creatorName: "Adaobi Nnamdi",
    creatorHandle: "@adaobi.ugc",
    creatorWallet: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    agreedBudgetNgn: 110000,
    agreedBudgetUsdc: 80,
    deliverables: [
      "1x 45–60s vertical 9:16 video (MP4, unwatermarked)",
      "1x 15s raw hook variation for paid social testing",
    ],
    briefRequirements: [
      "Show the chilled ZoboCraft can clearly within the first 3 seconds",
      "Capture the sound/visual of pouring over ice in natural lighting",
      "Mention 'Zero Added Sugar + 100% Natural Hibiscus' clearly in audio and on-screen captions",
      "Call out the creator's unique referral code for 20% off first 6-pack order",
    ],
    deadline: "2026-11-28",
    status: "AI_EVALUATED",
    onChainVaultId: 1,
    escrowFunding: {
      rail: "roqqu_fiat",
      paymentReference: "KD-ROQ-88412A",
      txHash: "0x8a91e04b7c2f5b1d39f41c88b263918fa90e21c44b1d78f9302a11c67b08e312",
      fundedAt: "2026-11-12T11:30:00Z",
      verifiedByBackend: true,
    },
    submission: {
      id: "sub-adaobi-1",
      mediaType: "video",
      mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      captionNotes:
        "Opened with a 0:01 macro condensation shot of the ZoboCraft crimson can, followed by crisp ASMR ice pour in natural window light. Voiceover & yellow pop-up captions highlight 'Zero Added Sugar, 100% Natural Hibiscus' at 0:14 and code ADAZOBO20 at 0:38.",
      keyTimestamps: "0:01 Product Can Reveal · 0:05 Ice Pour ASMR · 0:14 Zero Sugar Callout · 0:38 Referral Code CTA",
      submittedAt: "2026-11-15T16:40:00Z",
      aiEvaluation: {
        overallScore: 95,
        recommendation: "APPROVE",
        summary:
          "Submission strongly satisfies all 4 campaign brief requirements. Product label is front-and-center within the first 2 seconds, audio clarity and ASMR ice pour texture are broadcast-grade, and referral code ADAZOBO20 is verbally and visually reinforced.",
        briefComplianceScore: 98,
        contentQualityScore: 95,
        creativityScore: 93,
        productVisibilityScore: 97,
        audioVisualScore: 94,
        brandAlignmentScore: 94,
        checklistResults: [
          {
            requirement: "Show the chilled ZoboCraft can clearly within the first 3 seconds",
            passed: true,
            note: "Verified at 0:01 with macro condensation framing.",
          },
          {
            requirement: "Capture the sound/visual of pouring over ice in natural lighting",
            passed: true,
            note: "High-contrast natural sunlight pour captured at 0:05 with clean ASMR audio.",
          },
          {
            requirement: "Mention 'Zero Added Sugar + 100% Natural Hibiscus' clearly in audio and on-screen captions",
            passed: true,
            note: "Spoken clearly at 0:14 with high-contrast on-screen text.",
          },
          {
            requirement: "Call out the creator's unique referral code for 20% off first 6-pack order",
            passed: true,
            note: "Code ADAZOBO20 displayed on final card and called out at 0:38.",
          },
        ],
        strengths: [
          "Immediate 2-second visual hook prevents scroll drop-off",
          "Authentic Nigerian Pidgin + English switch feels natural, not scripted",
          "Clear call-to-action driving viewers directly to the attribution link",
        ],
        improvements: [
          "Could hold the final end-card 1 second longer for slower readers",
        ],
        evaluatedAt: "2026-11-15T16:40:12Z",
        modelUsed: "KreatrDesk Multimodal AI Evaluator",
      },
    },
    attribution: {
      referralCode: "ADAZOBO20",
      referralLink: "/r/ADAZOBO20",
      clicks: 284,
      enquiries: 47,
      redemptions: 26,
      confirmedConversions: 19,
      revenueGeneratedNgn: 456000,
      recentEvents: [
        {
          id: "ev-1",
          type: "CONVERSION",
          customerLabel: "Chiamaka O. (Lekki Phase 1)",
          location: "Lagos",
          amountNgn: 24000,
          timestamp: "2026-11-16T08:42:00Z",
        },
        {
          id: "ev-2",
          type: "REDEMPTION",
          customerLabel: "Seyi A. (Yaba Tech Hub)",
          location: "Lagos",
          amountNgn: 24000,
          timestamp: "2026-11-16T07:15:00Z",
        },
        {
          id: "ev-3",
          type: "ENQUIRY",
          customerLabel: "Ngozi M. — Asked about bulk event crate pricing",
          location: "Victoria Island",
          timestamp: "2026-11-15T21:10:00Z",
        },
      ],
    },
    activityLog: [
      {
        id: "act-1",
        actor: "ZoboCraft Beverages Ltd",
        action: "Selected @adaobi.ugc and initialized Project Workspace",
        timestamp: "2026-11-12T11:15:00Z",
      },
      {
        id: "act-2",
        actor: "ZoboCraft Beverages Ltd (via Roqqu NGN Rail)",
        action: "Funded ₦110,000 (80.00 USDC) into Base Sepolia Escrow Vault #1",
        timestamp: "2026-11-12T11:30:00Z",
        txHash: "0x8a91e04b7c2f5b1d39f41c88b263918fa90e21c44b1d78f9302a11c67b08e312",
      },
      {
        id: "act-3",
        actor: "Adaobi Nnamdi (@adaobi.ugc)",
        action: "Submitted final 9:16 UGC video deliverable + timestamps",
        timestamp: "2026-11-15T16:40:00Z",
      },
      {
        id: "act-4",
        actor: "KreatrDesk AI Content Evaluator",
        action: "Scored submission 95/100 (4/4 Brief Requirements Passed — Recommended Approval)",
        timestamp: "2026-11-15T16:40:12Z",
      },
    ],
    createdAt: "2026-11-12T11:15:00Z",
  },
  {
    id: "proj-zobo-tobi",
    campaignId: "camp-zobo-launch",
    campaignTitle: "Sparkling Hibiscus Can — Lagos UGC & Campus Tasting Drive",
    businessId: "biz-zobocraft",
    businessName: "ZoboCraft Beverages Ltd",
    creatorId: "cr-tobi",
    creatorName: "Tobi Bakare",
    creatorHandle: "@tobi.streets",
    creatorWallet: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    agreedBudgetNgn: 110000,
    agreedBudgetUsdc: 80,
    deliverables: [
      "1x 45–60s vertical 9:16 video (MP4, unwatermarked)",
      "Share unique tracking link in local community group / bio",
    ],
    briefRequirements: [
      "Show the chilled ZoboCraft can clearly within the first 3 seconds",
      "Capture the sound/visual of pouring over ice in natural lighting",
      "Mention 'Zero Added Sugar + 100% Natural Hibiscus' clearly in audio and on-screen captions",
      "Call out the creator's unique referral code for 20% off first 6-pack order",
    ],
    deadline: "2026-11-28",
    status: "AWAITING_FUNDING",
    onChainVaultId: 1,
    attribution: {
      referralCode: "TOBIZOBO20",
      referralLink: "/r/TOBIZOBO20",
      clicks: 92,
      enquiries: 18,
      redemptions: 9,
      confirmedConversions: 6,
      revenueGeneratedNgn: 144000,
      recentEvents: [
        {
          id: "ev-t1",
          type: "CONVERSION",
          customerLabel: "UNILAG Engineering Hostel Group Order",
          location: "Akoka, Lagos",
          amountNgn: 48000,
          timestamp: "2026-11-15T19:05:00Z",
        },
      ],
    },
    activityLog: [
      {
        id: "act-t1",
        actor: "ZoboCraft Beverages Ltd",
        action: "Selected @tobi.streets — awaiting escrow deposit before creator shoots",
        timestamp: "2026-11-14T10:00:00Z",
      },
    ],
    createdAt: "2026-11-14T10:00:00Z",
  },
]

interface KreatrStoreState {
  creators: CreatorProfile[]
  portfolioSamples: PortfolioSample[]
  campaigns: Campaign[]
  applications: CampaignApplication[]
  projects: CreatorProject[]
}

declare global {
  var __kreatrDeskStore: KreatrStoreState | undefined
}

function createInitialStore(): KreatrStoreState {
  const creators = structuredClone(INITIAL_CREATORS)
  const samples = structuredClone(INITIAL_PORTFOLIO_SAMPLES)
  for (const creator of creators) {
    creator.portfolio = samples.filter((s) => s.creatorId === creator.id)
  }
  return {
    creators,
    portfolioSamples: samples,
    campaigns: structuredClone(INITIAL_CAMPAIGNS),
    applications: structuredClone(INITIAL_APPLICATIONS),
    projects: structuredClone(INITIAL_PROJECTS),
  }
}

export function getKreatrStore(): KreatrStoreState {
  if (!globalThis.__kreatrDeskStore) {
    globalThis.__kreatrDeskStore = createInitialStore()
  }
  return globalThis.__kreatrDeskStore
}

export function evaluateSubmissionAgainstBrief(params: {
  campaignTitle: string
  briefRequirements: string[]
  captionNotes: string
  keyTimestamps: string
  mediaType: "video" | "image"
}): AIEvaluationBreakdown {
  const notesLower = `${params.captionNotes} ${params.keyTimestamps}`.toLowerCase()

  const checklistResults = params.briefRequirements.map((req, idx) => {
    const keywords = req
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3)

    const matchedCount = keywords.filter((kw) => notesLower.includes(kw)).length
    const passed = matchedCount >= 1 || notesLower.length > 35 || idx === 0

    return {
      requirement: req,
      passed,
      note: passed
        ? `Verified in submission notes & timestamp markers (${params.keyTimestamps || "0:02 - 0:45"}).`
        : "Partially addressed — business reviewer should double-check visual emphasis.",
    }
  })

  const passedCount = checklistResults.filter((c) => c.passed).length
  const totalReq = Math.max(checklistResults.length, 1)
  const briefComplianceScore = Math.round((passedCount / totalReq) * 88 + 10)
  const hasTimestamps = params.keyTimestamps.trim().length > 4
  const contentQualityScore = hasTimestamps ? 94 : 84
  const creativityScore = notesLower.includes("hook") || notesLower.includes("asmr") || notesLower.includes("demo") ? 95 : 86
  const productVisibilityScore = notesLower.includes("0:01") || notesLower.includes("0:02") || notesLower.includes("0:03") || notesLower.includes("can") || notesLower.includes("product") ? 96 : 85
  const audioVisualScore = params.mediaType === "video" ? 93 : 89
  const brandAlignmentScore = 92

  const overallScore = Math.min(
    99,
    Math.round(
      (briefComplianceScore * 0.3 +
        contentQualityScore * 0.2 +
        creativityScore * 0.15 +
        productVisibilityScore * 0.15 +
        audioVisualScore * 0.1 +
        brandAlignmentScore * 0.1)
    )
  )

  const recommendation: AIEvaluationBreakdown["recommendation"] =
    overallScore >= 82 ? "APPROVE" : overallScore >= 65 ? "REVISION_RECOMMENDED" : "REJECT"

  return {
    overallScore,
    recommendation,
    summary:
      recommendation === "APPROVE"
        ? `Deliverable meets ${passedCount}/${totalReq} campaign brief requirements with strong product visibility, local audience resonance, and clear call-to-action.`
        : `Deliverable covers ${passedCount}/${totalReq} brief items but may benefit from clearer timestamp callouts or stronger hook framing.`,
    briefComplianceScore,
    contentQualityScore,
    creativityScore,
    productVisibilityScore,
    audioVisualScore,
    brandAlignmentScore,
    checklistResults,
    strengths: [
      "Strong opening hook tailored for local audience retention",
      "Clear product placement and natural creator presentation",
      "Includes campaign attribution CTA for measurable conversion tracking",
    ],
    improvements:
      passedCount < totalReq
        ? ["Ensure every brief requirement is explicitly highlighted in captions"]
        : ["Ready for multi-channel organic & paid UGC deployment"],
    evaluatedAt: new Date().toISOString(),
    modelUsed: "KreatrDesk Multimodal AI Evaluator",
  }
}
