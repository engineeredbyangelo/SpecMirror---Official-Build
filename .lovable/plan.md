

## Redesign Features Section — Linear-Inspired Immersive Layout

### What Changes

Replace the current bento grid features section (lines 308-442) with a premium, Linear-aesthetic immersive section built around three distinct zones.

### Architecture

**File: `src/pages/Landing.tsx` (lines 308-442)**

The entire `<section id="features">` block gets replaced with a new composition:

#### Zone 1: Central Dashboard Hero
- Large glass-morphic container (80%+ width) showing the **Live Mirror** dual-view interface
- Deep gradient background (`bg-gradient-to-b from-primary/[0.04] via-background to-accent/[0.03]`) spanning the full section
- The dashboard mock shows Brief (left) and Spec (right) panes with subtle animated skeleton lines
- Confidence score badge floats in the top-right corner with a soft emerald glow ring
- Monospaced labels (`font-mono text-[10px] uppercase tracking-widest`) for "Brief", "Spec", "Confidence"

#### Zone 2: Floating Feature Nodes
- Two feature cards — "Instant AI Generation" and "Seamless Collaboration" — float beside the dashboard (left and right on desktop, stacked below on mobile)
- Each card: `glass-card` styling with subtle `box-shadow: 0 0 40px hsl(226 70% 55.5% / 0.06)` glow
- **Cyber-line connectors**: SVG `<line>` elements with gradient strokes (`from-primary/40 to-transparent`) connecting each floating card to the central dashboard. Use `position: absolute` SVG overlay. Hidden on mobile.
- Cards have a subtle float animation: `@keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }` with 6s duration

#### Zone 3: PRD vs Tech Spec Toggle
- Positioned directly below the dashboard as a contained module
- Replace the two static side-by-side cards with an **interactive toggle** using `useState`
- Toggle bar: two pill buttons — "Product Requirements" (indigo) and "Technical Spec" (emerald) — with animated active indicator sliding between them
- Below the toggle, a single content panel cross-fades (framer-motion `AnimatePresence`) to show the relevant details:
  - **PRD selected**: Icon + "Best for PMs and founders" + tag pills (User stories, Acceptance criteria, Priorities) + one-liner description
  - **Tech Spec selected**: Icon + "Best for engineers" + tag pills (Architecture, API contracts, Data models) + one-liner description
- The toggle container itself has a faint neon border glow matching the active selection color

### Visual Details

- **Glassmorphism**: `backdrop-blur-xl bg-white/[0.02] border border-white/[0.06]` on all panels
- **Neon glows**: Absolutely positioned blurred circles (`blur-3xl`) in primary and accent colors behind key elements
- **Monospaced labels**: Add `font-mono` to all technical labels (Brief, Spec, PRD, Tech Spec, Confidence)
- **Deep gradient bg**: Section gets its own gradient background, not relying on the global `glass-bg`
- **Zero dead space**: The dashboard is tall and prominent; floating cards hug it closely; the toggle section sits flush beneath

### New CSS (in `src/index.css`)
- Add `@keyframes float` animation
- Add `.cyber-line` utility for the SVG connector glow

### New Tailwind Config
- Add `float` animation to `tailwind.config.ts`

### Summary

| Change | File | What |
|--------|------|------|
| Replace features section | `Landing.tsx` lines 308-442 | New 3-zone layout with dashboard, floating cards, toggle |
| Add float keyframe | `tailwind.config.ts` | `float: "float 6s ease-in-out infinite"` |
| Add cyber-line + float CSS | `src/index.css` | SVG connector glow styles |
| Add `useState` for toggle | `Landing.tsx` | `const [activeDocType, setActiveDocType] = useState<'prd' | 'spec'>('prd')` |

