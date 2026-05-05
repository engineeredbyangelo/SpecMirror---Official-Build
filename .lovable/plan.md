## Goal

Stop the hero `MirrorDemo` from resizing as content streams in (the source of the page-extending "glitch"), and upgrade its visual polish using our highest-quality image model.

## Root cause

In `src/pages/Landing.tsx` (`MirrorDemo`, lines ~1118–1297):

- The **Brief panel** uses `min-h-[180px]` and grows as each `<p>` line is appended → panel expands ~5 times during typing.
- The **Spec panel** swaps between three different DOM trees (`typing` placeholder → `loading` shimmer → `reveal` scrollable list) with only `min-h-[180px]`, then grows up to `max-h-[320px]` as spec lines reveal.
- Because both columns grow independently, the whole hero card (and therefore the page) expands mid-animation, pushing content below — that's the perceived glitch/jank.

## Fix plan

### 1. Lock the demo's dimensions (no layout shift)

In `MirrorDemo`:

- Wrap the two panels in a container with a **fixed height** at each breakpoint (e.g. `h-[420px] md:h-[380px]`) and `overflow-hidden`.
- Replace `min-h-[180px]` on each panel with a fixed `h-full` and make their inner content area `h-full overflow-hidden` so panels never push outward.
- For the **Brief panel**, render lines inside a fixed-height area; old lines stay, blinking caret stays at end. Use a true typewriter: animate **characters** of the current line (not whole-line fade) so the visible block height stays roughly constant. Once all 5 lines fit, stop — content is sized to fit the box (we'll trim copy if needed).
- For the **Spec panel**, keep a **single persistent DOM** across all three phases (no mount/unmount swaps):
  - Always render the scroll container at `h-full overflow-hidden` (no internal scroll on the demo loop).
  - "Waiting…" placeholder, shimmer skeleton, and revealed lines all live in the same fixed-size box, just toggling visibility.
  - Reveal spec lines via translate/fade in place; if total content exceeds the box, fade out the top via a CSS mask gradient instead of growing the box.
- Ensure the outer `MirrorDemo` root has a stable aspect on mobile too (`h-[520px] sm:h-[460px] md:h-[400px]`), so the hero column never reflows.

### 2. Smooth out the cycle

- Slightly slow the typewriter and shorten the spec list so the loop fits the locked viewport without needing to scroll.
- Keep the existing 3-phase state machine but drive only opacity/transform, never height.

### 3. Upgrade the visual (AI image)

The user asked about "ChatGPT image 2". Our gateway doesn't expose that, but we have a top-tier equivalent:

- Use **`google/gemini-3-pro-image-preview`** (Nano Banana Pro, highest quality) via the `lovable_ai` script to generate a premium hero **backdrop** — a subtle, dark, luxury abstract: indigo→emerald glass shards / soft volumetric light, 16:9, transparent-feeling, very low contrast so the demo card stays the focal point.
- Save to `public/hero-backdrop.webp` and place it behind `MirrorDemo` with `opacity-40 mix-blend-screen` and a radial mask so it fades into the page background.
- This gives a "premium grade" feel without touching the live, animated demo (which carries the product story).

If the user prefers, we can instead generate a **static product mock** image (rendered editor screenshot) and replace the animated demo entirely — but the typing animation is on-brand for SpecMirror, so default is: keep animated demo, add AI backdrop.

### 4. Reduced motion

Respect `prefers-reduced-motion`: skip the typewriter, render the final brief + spec immediately inside the locked box.

## Files touched

- `src/pages/Landing.tsx` — refactor `MirrorDemo` (fixed heights, persistent spec DOM, char-level typewriter, backdrop element).
- `src/index.css` — add small utilities: `.demo-mask` (top/bottom fade mask), `.caret` (blink).
- `public/hero-backdrop.webp` — new AI-generated asset (Nano Banana Pro).

## Out of scope

No changes to other landing sections, copy, pricing, or routing.
