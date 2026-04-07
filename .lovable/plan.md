## Upgrade Product Demo Video to ~28 Seconds

The current video is 15 seconds (450 frames at 30fps) with 3 scenes: logo intro, a brief side-by-side mirror, and an approve/share ending. The content in Scene2Mirror uses short placeholder text that doesn't match the actual product output. We need to extend to ~28 seconds (840 frames) and align the video content with the real product experience shown on the landing page.

### New Scene Structure (5 scenes, ~840 frames total)


| Scene            | Frames | Duration | Content                                                                                                                                   |
| ---------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Logo Intro    | 80     | ~2.7s    | SpecMirror branding + tagline (slightly tighter)                                                                                          |
| 2. Brief Input   | 210    | ~7s      | Human-written brief typing in — casual founder language about a fitness app (matches landing page)                                        |
| 3. Generation    | 120    | ~4s      | "Generating..." shimmer + confidence ring animating to 94%                                                                                |
| 4. Spec Reveal   | 270    | ~9s      | Full technical spec appearing section-by-section: Executive Summary, Architecture, Data Model, Auth, Effort Estimate, Acceptance Criteria |
| 5. Approve + CTA | 160    | ~5.3s    | Approve button press, checkmark, encrypted sharing options, closing tagline                                                               |


### Key Changes

**Scene 1 (trim existing):** Reduce from 100 to 80 frames. Same content, just snappier.

**Scene 2 — New "Brief Input" scene:** Full-screen card showing a realistic brief being typed character-by-character. Use the same casual founder language from the landing page demo: "I want to build a fitness tracking app for personal trainers and their clients..." Show 4-5 lines typing in with a blinking cursor. No spec panel visible yet — just the brief input experience.

**Scene 3 — New "Generation" scene:** The mirror interface appears (split-panel layout). Left panel shows the completed brief. Right panel shows skeleton shimmer lines + "Generating technical specification..." label + confidence ring animating from 0% to 94%. This creates anticipation.

**Scene 4 — New "Spec Reveal" scene:** Same split-panel layout. Right panel skeleton fades out and real spec content fades in section-by-section: Architecture (React Native + Expo, Supabase, Stripe Connect), Data Model (trainers, clients, workout plans), Auth (JWT, RLS policies), Effort Estimate (~12 days, 2 engineers), Acceptance Criteria (checkmark items). This mirrors what the actual product generates.

**Scene 5 (update existing Scene4Approve):** Keep the approve button animation, but update the tagline and add the "specmirror.one" branding more prominently to showcase on top of the bento dashboard.

### Files Modified


| File                                    | Change                                                                            |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| `remotion/src/Root.tsx`                 | Update `durationInFrames` to 840                                                  |
| `remotion/src/MainVideo.tsx`            | Wire up 5 scenes with transitions, update frame allocations                       |
| `remotion/src/scenes/Scene1Intro.tsx`   | Minor timing tighten                                                              |
| `remotion/src/scenes/Scene2Brief.tsx`   | Rewrite — full-screen brief typing with realistic founder language                |
| `remotion/src/scenes/Scene3Spec.tsx`    | Rewrite — split-panel generation phase with shimmer + confidence ring             |
| `remotion/src/scenes/Scene2Mirror.tsx`  | Remove (functionality split across Scene2Brief, Scene3Spec, and new Scene4Reveal) |
| `remotion/src/scenes/Scene4Reveal.tsx`  | New — split-panel spec reveal with real technical content                         |
| `remotion/src/scenes/Scene4Approve.tsx` | Rename to Scene5Approve, minor timing updates                                     |
| `remotion/scripts/render-remotion.mjs`  | No changes needed                                                                 |


### After Code Changes

Re-render the video via `cd remotion && node scripts/render-remotion.mjs` and deliver the updated MP4.