export interface ExampleBrief {
  id: string;
  emoji: string;
  title: string;
  tagline: string;
  brief: string;
}

export const EXAMPLE_BRIEFS: ExampleBrief[] = [
  {
    id: "fitness",
    emoji: "📱",
    title: "Mobile fitness tracker app",
    tagline: "Cross-platform mobile app for runners and gym-goers.",
    brief: `I want to build a mobile fitness tracker called PulseRun.

Target users: amateur runners and casual gym-goers (ages 22-40) who want a simple way to log workouts and see progress over time without the bloat of pro athlete apps.

Core features:
- Quick workout logging (run, lift, cycle, yoga) with duration, distance, and notes
- GPS-based route tracking for outdoor activities with auto-pause when stationary
- Weekly and monthly progress charts (distance, calories, streaks)
- Personal records (PRs) automatically detected and celebrated
- Optional integration with Apple Health / Google Fit for heart rate and steps
- Friend feed where you can follow 3-5 people max and react to their workouts

Constraints:
- Must work fully offline; sync when back online
- Privacy-first: routes never shared publicly by default
- iOS first, Android shortly after

Keep the UX minimal — no gamification overload.`,
  },
  {
    id: "ar-home",
    emoji: "🧪",
    title: "AR-powered home interior previewer",
    tagline: "Conceptual tech: place real furniture in your room with AR.",
    brief: `I want to build an AR app called RoomMirror that lets shoppers preview furniture in their actual living space before buying.

Target users: people redecorating apartments who can't visualize how a piece will fit or look.

Core features:
- Scan a room with the phone camera to detect floor, walls, and lighting
- Browse a catalog of furniture (from partnered retailers) and drag pieces into the AR scene
- Resize, rotate, and reposition items with real-world dimensions
- Save room "moodboards" as snapshots and share them with friends/designers
- Buy directly through the app (deep link to retailer checkout)
- Lighting estimation so the rendered furniture matches room shadows

Conceptual challenges to address:
- Accurate scale and occlusion (furniture should hide behind real objects)
- Catalog ingestion pipeline for 3D models from multiple retailers
- Offline mode for browsing saved rooms without re-scanning

Platform: iOS (ARKit) first, then Android (ARCore). Designed for phones, not headsets.`,
  },
  {
    id: "marketplace",
    emoji: "🛒",
    title: "Multi-vendor marketplace platform",
    tagline: "A two-sided marketplace for independent makers.",
    brief: `I want to build a multi-vendor marketplace called MakerMarket where independent artisans can sell handmade goods.

Target users:
- Sellers: solo makers and small studios (jewelry, ceramics, leather, prints)
- Buyers: gift shoppers and design-conscious consumers looking for unique items

Core features:
- Vendor onboarding with KYC, payout setup (Stripe Connect), and storefront customization
- Product listings with multiple photos, variants (size/color), inventory tracking
- Unified cart that can contain items from multiple vendors in one checkout
- Split payments at checkout with platform commission (5%) deducted automatically
- Order management for vendors: accept, mark as shipped, add tracking
- Buyer-side: search, filters by category/price/maker location, wishlists, reviews
- Messaging between buyers and vendors for custom requests

Constraints:
- Web first (responsive), mobile app later
- Multi-currency support (USD, EUR, GBP at launch)
- Must comply with EU VAT and US sales tax (use a tax service like Stripe Tax or TaxJar)

Keep vendor onboarding under 10 minutes — that's a key conversion point.`,
  },
];