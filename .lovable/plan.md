

## Post-auth redirect + Basic upgrade checkout wiring

Two small fixes.

### 1. Redirect to /dashboard after login/signup (incl. Google OAuth)

Currently after Google OAuth, `redirect_uri` is set to `window.location.origin` — which lands users on `/` (Landing). Fix in three places:

- **`src/pages/Login.tsx`** — change OAuth `redirect_uri` to `${window.location.origin}/dashboard`.
- **`src/pages/Signup.tsx`** — same change for the Google button + ensure email/password signup navigates to `/dashboard` on success (not `/`).
- **`src/contexts/AuthContext.tsx`** — no behavior change needed; the `useEffect` in `Login.tsx` already pushes to `/dashboard` when a session exists, so email/password login is already correct. The fix is purely OAuth + signup.

Result: every auth path (email login, email signup, Google login, Google signup) lands on `/dashboard`, where the `OnboardingDialog` then runs for first-time users.

### 2. Wire all "Upgrade to Basic" CTAs to Stripe checkout

Audit every place an upgrade prompt currently exists and ensure it calls `create-checkout` with the correct `priceId`:

- **`src/pages/Dashboard.tsx`** — Slack/Notion gating cards: replace any link/toast with a handler that invokes `create-checkout` using the **Basic** `priceId` from `STRIPE_TIERS.basic` in `AuthContext`. Open returned URL in a new tab.
- **`src/pages/ProjectMirror.tsx`** — 429 upgrade toast: add a toast action button "Upgrade to Basic" → same `create-checkout` invoke. Pro users hitting the limit get an "Upgrade to Pro" action instead.
- **`src/components/VersionsPanel.tsx`** — Free-tier lock screen: the existing "Upgrade" button should call `create-checkout` with the Basic `priceId` (currently a static CTA).
- **`src/components/OnboardingDialog.tsx`** — if any upgrade hint exists, same treatment.

### 3. Basic checkout page also offers Pro

Stripe's hosted Checkout doesn't natively show "and here's a more expensive plan too" UI. The cleanest pattern: keep Stripe Checkout single-line-item (Basic), but **before** redirecting to Stripe, show a small confirmation step. Two options — I'll go with B unless you say otherwise:

- **A.** Inline mini-modal "You're upgrading to Basic ($12/mo). Want Pro instead ($24/mo, stronger AI + PDF/Notion export)?" with two buttons → routes to the matching `create-checkout` call.
- **B.** (Chosen) Direct to Basic checkout immediately, but inject a small banner above every "Upgrade to Basic" CTA: *"Need more? See Pro →"* that scrolls to `/#pricing`. Less friction, keeps Stripe flow clean.

If you'd rather have option A (the upsell modal), say so before I build.

### Files touched

- `src/pages/Login.tsx` — OAuth redirect
- `src/pages/Signup.tsx` — OAuth redirect + post-signup nav
- `src/pages/Dashboard.tsx` — wire Slack/Notion upgrade buttons
- `src/pages/ProjectMirror.tsx` — toast action for 429
- `src/components/VersionsPanel.tsx` — wire Free lock CTA
- `src/components/OnboardingDialog.tsx` — wire any upgrade hint
- (No backend or migration changes.)

