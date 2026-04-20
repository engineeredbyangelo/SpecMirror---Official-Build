## Pricing Tiers + Onboarding + Feature Gating

Three-tier pricing (Free / Basic / Pro), wire Stripe checkout for both paid tiers, gate gated features by tier, and add a first-login onboarding walkthrough with example briefs.

### 1. Stripe products & pricing

Create two new Stripe products via the Stripe MCP:

- **Basic** — $12/month (recurring) → produces a new `price_id` and `product_id`
- **Pro** — keep existing $19/month (Pro stays as-is)

Free tier requires no Stripe object.

I'll ask you to confirm the Basic price before creating it.

### 2. Tier configuration (single source of truth)

Update `STRIPE_TIERS` in `src/contexts/AuthContext.tsx`:

```
free  → { limit: 6,  model: "google/gemini-3-flash-preview" }
basic → { price_id, product_id, limit: 16, model: "google/gemini-2.5-pro" }
pro   → { price_id, product_id, limit: 30, model: "openai/gpt-5" }
```

Limits are **monthly** (calendar month), not daily. `subscriptionTier` resolves to `"free" | "basic" | "pro"` based on the active Stripe `product_id`.

### 3. Pricing section redesign (`src/pages/Landing.tsx`)

Replace the 2-card grid with a 3-card grid keeping the existing dark/glass aesthetic:


| &nbsp;                     | Free      | Basic                | Pro (Most Popular)     |
| -------------------------- | --------- | -------------------- | ---------------------- |
| Price                      | $0        | $12/mo               | $19/mo                 |
| Generations                | 6 / month | 16 / month           | 30 / month             |
| AI model                   | SpecAI    | SpecAI v2 (stronger) | SpecAI Pro (strongest) |
| Encrypted sharing          | ✓         | ✓                    | ✓                      |
| Version history            | ✓         | ✓                    | ✓                      |
| Team collaboration         | —         | ✓                    | ✓                      |
| Slack integration          | —         | ✓                    | ✓                      |
| Priority support           | —         | ✓                    | ✓                      |
| Custom export (PDF/Notion) | —         | —                    | ✓                      |
| Premium templates library  | —         | —                    | ✓                      |


Pro card keeps the "Most popular" glow badge. Each paid card calls `create-checkout` with its own `priceId`. Free card → `/signup`.

### 4. Backend changes

`**supabase/functions/check-subscription/index.ts**` (also fixes the current build error)

- Replace `npm:@supabase/supabase-js@2.57.2` import with `https://esm.sh/@supabase/supabase-js@2.57.2` (matches other functions and resolves the deno error).
- Map returned `product_id` to tier name; client already handles this.

`**supabase/functions/generate-spec/index.ts**`

- Replace `FREE_DAILY_LIMIT = 5` with monthly limits per tier: `{free: 6, basic: 16, pro: 30}`.
- Determine tier from active Stripe subscription's product_id.
- Count generations from start of current calendar month (not day).
- Pick AI model based on tier (`google/gemini-3-flash-preview`, `google/gemini-2.5-pro`, `openai/gpt-5`).
- Return `{tier, used, limit}` in the rate-limit error so UI can prompt upgrade.

`**supabase/functions/create-checkout/index.ts**`

- Already accepts arbitrary `priceId` — no changes needed. Confirm both Basic and Pro IDs flow through.

### 5. Feature gating in UI

- `**Dashboard.tsx**`: Slack integration card — show "Connect" CTA for Basic/Pro, "Upgrade to Basic" lock for Free. Add a small tier badge near user email ("Free · 4/6 used this month") fed by a new `getUsage()` helper.
- `**ProjectMirror.tsx**`: surface upgrade toast when `429` returns with `tier === "free"` or `"basic"`.
- **Version history** (already implied via `updated_at`) — no change for Free, add a "Versions" panel stub for Basic/Pro on ProjectMirror (lightweight: list past saves from a new `project_versions` table, deferred unless you want it now — I'll just snapshot on each approve).

### 6. Onboarding flow (first login after signup)

New file `src/components/OnboardingDialog.tsx` — full-screen modal walkthrough, 4 steps:

1. **Welcome** — "From idea to deploy-ready spec in seconds."
2. **Pick a starting point** — 3 example cards + "Start blank":
  - 📱 *Mobile fitness tracker app*
  - 🧪 *AR-powered home interior previewer* (conceptual tech)
  - 🛒 *Multi-vendor marketplace platform*
  - ✍️ *Start with my own brief*
3. **How it works** — 3 quick illustrated steps (Brief → Mirror → Approve & Share).
4. **You're ready** — CTA "Create my first brief" → routes to `/project/:id` with the chosen example pre-filled.

**Trigger logic**: add `onboarding_completed boolean default false` column to `profiles`. After login, if `false`, show dialog. Completing step 4 sets it `true`.

Picking an example creates a project with the example brief pre-populated; "Start blank" creates an empty project.

### 7. Database migration

```sql
alter table public.profiles
  add column onboarding_completed boolean not null default false;
```

(Optional — version history table; flag if you want it included now.)

### 8. Files touched

- `src/contexts/AuthContext.tsx` — tier config + tier resolution
- `src/pages/Landing.tsx` — 3-tier pricing UI + checkout handlers
- `src/pages/Dashboard.tsx` — usage badge, Slack gating, onboarding mount
- `src/pages/ProjectMirror.tsx` — tier-aware upgrade messaging
- `src/components/OnboardingDialog.tsx` — new
- `src/lib/exampleBriefs.ts` — new (example brief content)
- `supabase/functions/check-subscription/index.ts` — fix import + tier mapping
- `supabase/functions/generate-spec/index.ts` — tier-based monthly limits + model selection
- 1 migration (profiles column)
- 1 Stripe product/price creation (Basic)

### Confirm before I build

1. **Basic price = $12/month** OK, or different? Pro Pricing $24
2. **Pro extras** — confirmed: custom export (PDF/Notion) + premium templates library. Swap either? Just add the custom export (PDF/Notion) 
3. **Version history table** — add a real `project_versions` snapshot table now, or defer? - Add now