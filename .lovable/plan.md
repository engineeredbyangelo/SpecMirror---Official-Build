# Rebuild Demo Video — 60s Marketing Cut

Replace the current 28s walkthrough with a **60-second (1800 frame @ 30fps)** marketing-style video that hooks viewers, shows the product in motion, and lands the value prop: *"Turn your idea into a production-ready spec — in seconds."*

## Creative Direction

**Vibe:** Confident, kinetic, modern SaaS launch trailer — think Linear / Vercel / Arc product reveal energy. Premium but vibrant, not sterile.

**Palette (vibrant, on-brand):**
- Background base: `#08090f` (near-black, brand)
- Primary indigo: `#4a6cf7` (kept)
- Accent emerald: `#34d399` (kept)
- NEW vibrant accents: violet `#a855f7`, cyan `#22d3ee`, amber `#fbbf24` — used sparingly as gradient stops, highlights, and per-scene accent
- Soft gradient washes (indigo→violet, emerald→cyan) for hero moments

**Typography:** Inter (already in use). Display sizes 96–140px for hero beats, 22–32px for body. Tight letter-spacing (-0.03em) on big type.

**Motion system:**
- Default entrance: spring (damping 18, stiffness 160) with 8–14 frame stagger
- Hero entrances: blur-to-sharp (filter blur 20→0) + scale 0.92→1
- Default transition: fade (12f) — except hero beats use a `wipe` or `slide` for punch
- Persistent floating gradient orbs throughout (sinusoidal drift) for cohesion
- Subtle grain overlay for texture

## Storyboard (60s / 1800 frames @ 30fps)

```text
┌─────────────────────────────────────────────────────────────┐
│ Scene 1 — HOOK                          0–120f   (4.0s)     │
│ Cold open. Big type: "You have an idea."                    │
│ Cursor blinks, words morph: "...a vision." "...a product."  │
│ Camera "pushes in." Ends on: "But specs slow you down."     │
├─────────────────────────────────────────────────────────────┤
│ Scene 2 — PROBLEM                       120–270f (5.0s)     │
│ Floating chaotic doc fragments (Notion/PRD snippets)        │
│ swirl on screen. Stamps: "12 hrs", "47 revisions",          │
│ "3 stakeholders". Red tint accent. Resolves to: "There's    │
│ a faster way."                                              │
├─────────────────────────────────────────────────────────────┤
│ Scene 3 — BRAND REVEAL                  270–390f (4.0s)     │
│ Whoosh wipe → SpecMirror logo + wordmark scales in with     │
│ indigo→violet gradient sweep. Tagline:                      │
│ "Brief → Spec in seconds."                                  │
├─────────────────────────────────────────────────────────────┤
│ Scene 4 — STEP 1: WRITE BRIEF           390–630f (8.0s)     │
│ UI mock: terminal-style brief input. Char-typewriter writes │
│ "Fitness app for personal trainers..."  Caption pill:       │
│ "1 — Write a one-paragraph brief"                           │
├─────────────────────────────────────────────────────────────┤
│ Scene 5 — STEP 2: AI GENERATES          630–870f (8.0s)     │
│ Brief shrinks left → arrow with traveling gradient particles│
│ → mirror panel right. Loading shimmer. Caption:             │
│ "2 — AI mirrors it into a spec"                             │
├─────────────────────────────────────────────────────────────┤
│ Scene 6 — STEP 3: SPEC REVEAL           870–1170f (10.0s)   │
│ Spec sections cascade in: User Stories, Tech Stack,         │
│ Data Model, Acceptance Criteria, Edge Cases. Each section   │
│ pings with an emerald check. Caption:                       │
│ "3 — Production-ready in 30 seconds"                        │
├─────────────────────────────────────────────────────────────┤
│ Scene 7 — BENEFITS MONTAGE              1170–1410f (8.0s)   │
│ 3-up bento grid, staggered:                                 │
│   • "Ship 10x faster"  (indigo)                             │
│   • "Zero ambiguity"   (emerald)                            │
│   • "Stakeholder-ready"(violet)                             │
│ Each card has a tiny animated icon.                         │
├─────────────────────────────────────────────────────────────┤
│ Scene 8 — SOCIAL PROOF                  1410–1560f (5.0s)   │
│ Quick cuts of 3 stylized testimonial cards floating in,     │
│ "Saved us a sprint." — PM, fictional logo.                  │
├─────────────────────────────────────────────────────────────┤
│ Scene 9 — CLOSE                         1560–1800f (8.0s)   │
│ Logo locks center on gradient bloom. Headline:              │
│ "Your idea. Specced. Today."                                │
│ Sub: "specmirror.one"                                       │
│ Hold 1.5s, gentle pulse, fade.                              │
└─────────────────────────────────────────────────────────────┘
```

Total: 1800 frames = 60.0s @ 30fps (with ~12f transition overlaps absorbed).

## Files to change

**Replace:**
- `remotion/src/Root.tsx` — bump `durationInFrames` to 1800
- `remotion/src/MainVideo.tsx` — new 9-scene `TransitionSeries` with persistent background (orbs + grain), varied transitions (fade default; wipe/slide for hero beats)

**New scenes (replace existing 5):**
- `remotion/src/scenes/Scene1Hook.tsx`
- `remotion/src/scenes/Scene2Problem.tsx`
- `remotion/src/scenes/Scene3Reveal.tsx`
- `remotion/src/scenes/Scene4Brief.tsx` (refactor of Scene2Brief)
- `remotion/src/scenes/Scene5Generate.tsx`
- `remotion/src/scenes/Scene6Spec.tsx` (refactor of Scene3Spec/Scene4Reveal)
- `remotion/src/scenes/Scene7Benefits.tsx`
- `remotion/src/scenes/Scene8Proof.tsx`
- `remotion/src/scenes/Scene9Close.tsx`

**Delete (no longer used):**
- `remotion/src/scenes/Scene1Intro.tsx`, `Scene2Brief.tsx`, `Scene3Spec.tsx`, `Scene4Approve.tsx`, `Scene4Reveal.tsx`, `Scene5Approve.tsx`

**Keep:** `remotion/scripts/render-remotion.mjs` (output already → `/mnt/documents/specmirror-demo.mp4`)

## Render & QA

1. Spot-check key frames at 60, 330, 510, 900, 1290, 1700 with `bunx remotion still`
2. Full render: `node scripts/render-remotion.mjs` (concurrency 1, ~6–10 min)
3. Verify MP4 size + duration with `ffprobe`
4. Deliver via `<lov-artifact path="specmirror-demo.mp4" mime_type="video/mp4">`

## Out of scope
- Voiceover / music (muted render — can add later if desired)
- Embedding the new video on the landing page (separate request)
- Changes to landing page or other app pages
