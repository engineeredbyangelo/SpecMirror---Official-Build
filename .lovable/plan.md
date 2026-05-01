## Cleanup + Premium Landing Page Upgrade

Two parts: (1) sweep dead CSS/code, (2) elevate the landing page to a luxury, premium-grade feel with a clearer user flow.

---

### Part 1 — CSS & code cleanup

After auditing, the actual leftover noise comes from earlier iterations (not the deleted Integrations duplicate alone). Confirmed unused:

`**src/index.css**`

- `.confidence-ring` rule — never applied in any component
- `@keyframes confidence-fill` — only referenced by the dead `.confidence-ring`
- `.cyber-line` rule — references `url(#cyber-gradient)` which doesn't exist (Landing uses `#cyber-gradient-left` / `#cyber-gradient-right` inline)

`**src/App.css**` — Vite scaffold leftovers (`#root` max-width 1280px center, `.logo`, `.logo-spin`, `.card`, `.read-the-docs`). The file is not imported anywhere. The `#root { max-width: 1280px }` rule would actually constrain the app if it ever got imported — safer to delete the file entirely.

`**src/pages/Landing.tsx**`

- Stray duplicate comment on line 511 (`{/* Why Not ChatGPT — Competitive Differentiation (Immersive) */}`) sitting above the Integrations section header
- Audit `lucide-react` imports on line 5 and drop any that aren't used after the visual pass (e.g. `Layers`, `Zap`, `GitBranch` if they don't survive the redesign)

No component file deletions needed — `NotionExportDialog`, `SlackPostDialog`, `exportPdf.ts` are still wired into Dashboard.

---

### Part 2 — Premium visual & flow upgrade

Goal: SpecMirror should feel like a $99/mo enterprise tool, not a generic SaaS template. Keep the dark zinc-950 + indigo + emerald palette (per project memory) but push refinement, hierarchy, and pacing.

#### 2.1 Visual refinement (applies across the page)

- **Type scale** — bump hero to a true display size (`text-6xl` → `text-7xl/8xl` desktop) with tighter `tracking-tighter` and `leading-[0.95]`. Reduce body copy size to `text-[15px]` for editorial density. Add `font-feature-settings: 'ss01','cv11'` on body for refined Inter glyphs.
- **Gradient text** — replace flat indigo gradient on hero highlight with a subtle tri-stop (indigo → violet-tinted indigo → emerald) and animate a slow background-position shift on hover/scroll-in for a "liquid metal" feel.
- **Section dividers** — replace abrupt `border-t border-white/[0.06]` with hairline gradient rules (`bg-gradient-to-r from-transparent via-white/[0.08] to-transparent`) so sections feel like chapters in a magazine.
- **Glow orbs** — reduce opacity (`0.05` → `0.035`) and increase blur radius for a more refined ambient lighting; add one large emerald orb behind pricing for warmth on the conversion section.
- **Card treatment** — unify all card surfaces on one premium recipe: `bg-white/[0.025]`, `border-white/[0.06]`, `backdrop-blur-2xl`, `rounded-2xl`, soft outer glow on hover (`box-shadow: 0 0 0 1px hsl(226 70% 55% / 0.15), 0 20px 60px -20px hsl(226 70% 55% / 0.2)`), and a faint inner top-edge highlight (`::before` with `linear-gradient(to bottom, white/[0.06], transparent)`).
- **Buttons** — primary CTA gets a soft inner gloss (`bg-gradient-to-b from-primary to-primary/85`) plus a subtle outer ring on hover; secondary buttons stay ghost.
- **Micro-interactions** — add a `data-magnetic` hover lift (translateY -1px, shadow grow) on every CTA; honor `prefers-reduced-motion`.
- **Cursor / focus polish** — refine focus-visible rings to indigo with low opacity for a calmer feel.

#### 2.2 Flow & narrative restructure

Today's order: Hero → How it works → Features → Integrations → Why-not-ChatGPT → Preview → How it helps → Pricing → FAQ. That's 9 sections and the value prop is buried.

Proposed flow (8 sections, sharper arc):

```text
1. Hero                      WHO + WHAT in 5 seconds
2. Trust strip (NEW)         logos / "trusted by 1,200+ founders" / metric badges
3. How it works              1-2-3-4 visual (kept, tightened)
4. Features                  3-zone immersive grid (kept)
5. Integrations              ship-anywhere PDF/Notion/Slack (kept, repositioned)
6. Why not ChatGPT           differentiation table (kept, condensed)
7. Pricing                   conversion moment, with "Most popular" Pro tier
8. FAQ + Final CTA           merged: FAQ accordion above a final dark CTA card
```

Removed/merged: standalone "Preview" and "How it helps" — their content folds into Features and the final CTA card respectively. This shortens scroll length by ~25% and front-loads the integrations story (a major reason a buyer says yes).

Add at the top of Hero, below the badge:

- **Above-the-fold proof line**: small horizontal strip with 3 metrics (e.g. "10k+ specs generated · 99.2% confidence avg · 4.9★ from beta users"). Builds credibility before scroll.

Add a **sticky mini-nav** that appears after scrolling past the hero — a thin pill bar with section anchors + a primary CTA. Disappears on mobile (use the existing nav instead).

#### 2.3 Hero rework

- Two-column hero on `lg:` breakpoint: copy + CTAs left, animated demo card right (replaces the modal-only `showDemo`). The demo card auto-plays the typing → spec reveal loop already defined in `index.css`. Single column on mobile, demo below copy.
- New tagline structure:
  - Eyebrow: "AI Spec Generator for product teams"
  - H1: "From idea to **production-ready spec.** In 30 seconds."
  - Sub: one sentence, focused on the outcome ("Stop writing PRDs. Start shipping.")
  - CTA pair: primary "Try free — no card" + ghost "Watch 60-sec demo"
  - Below CTA: tiny "Free forever for 5 specs/day · No credit card" reassurance line

#### 2.4 Pricing polish

- Highlight Pro with an indigo→emerald hairline border, a small "Most popular" pill, and a subtle inner glow.
- Add a 4th comparison row that pulls from the integrations story ("Export to PDF/Notion/Slack: ✓ Pro").
- Money-back / cancel-anytime micro-copy under the price.

#### 2.5 Final CTA + FAQ merge

Replace the standalone footer-y FAQ section with a two-part block:

- FAQ accordion (kept as-is)
- Below it, a full-width premium CTA card: dark zinc surface, large indigo orb behind, headline "Ready to ship faster?" + primary CTA + a single trust line.

---

### Technical notes

- Files touched: `src/pages/Landing.tsx` (major), `src/index.css` (cleanup + 2 new utilities for `.section-divider` and `.premium-card`), delete `src/App.css`.
- No new dependencies — `framer-motion` is already installed and used.
- All animations gated by `@media (prefers-reduced-motion: no-preference)`.
- Keep all existing anchor IDs that are referenced from elsewhere (`#pricing`, `#how-it-works`, `#features`, `#integrations`, `#faq`); update nav links if any section is removed.
- No backend, schema, or auth changes.

### Out of scope

- No copywriting overhaul beyond the hero + final CTA (existing feature/integration copy stays).
- No new logos/illustrations sourced — visual polish comes from CSS + existing Lucide icons.
- Dashboard, Login, Signup pages needs to adapt to the same branding changes