

# Landing Page Visual Polish

## What changes

### 1. Black glass background effect
- Add a subtle radial gradient overlay on the root `<div>` — dark center fading to slightly lighter edges — simulating polished black glass
- Add a fine-grain noise texture via CSS (pseudo-element with a tiny SVG noise pattern at very low opacity) for that premium matte-glass feel
- Cards and nav get `backdrop-blur-xl` + semi-transparent backgrounds (`bg-white/[0.03]`) creating a frosted glass layering effect
- Subtle border glow on cards using `border-white/[0.06]` to catch "light" like real glass edges

### 2. Generous spacing
- Increase section padding from `py-20/py-24` to `py-32` / `py-40`
- Hero section gets more vertical breathing room — `min-h-screen` with larger gaps between headline, tagline, and CTAs
- Feature grid and persona cards get `gap-8` instead of `gap-6`
- Mission section gets `py-32` with larger text size

### 3. Card redesign (glassmorphism)
- **Feature cards**: Semi-transparent glass background (`bg-white/[0.03]`), soft `backdrop-blur-md`, `border-white/[0.08]`, larger padding (`p-10`), rounded-2xl. On hover: border brightens to primary glow + subtle scale-up
- **Persona cards**: Redesigned as full glass cards (not just text with a number). Number becomes a large translucent watermark behind the card content. Hover lifts with shadow
- Both card types get smooth `transition-all duration-300`

### 4. Animated mirror demo
Replace the static skeleton wireframe in the "See it in action" section with an animated visual:
- Two side-by-side glass panels (Brief / Spec) with typing animation on the left panel (simulated brief text appearing line by line)
- After a short delay, the right panel "generates" with a shimmer sweep animation — lines appear with a staggered fade-in + green/emerald highlight pulse
- A small animated confidence ring fills from 0% to 94% as the right panel populates
- Uses pure CSS animations + `@keyframes` — no JS libraries needed
- Loops every ~8 seconds with a pause in-between

### 5. Typography refinements
- Hero headline: `text-6xl md:text-8xl` with tighter `tracking-tighter`
- Section headings: `text-4xl md:text-5xl`
- Body text in cards: `text-base` with `leading-relaxed`

## Files changed
- `src/index.css` — Add glass background utilities, noise texture, animation keyframes
- `src/pages/Landing.tsx` — All spacing, card, and animation changes
- `tailwind.config.ts` — Add custom animation keyframes for typing/shimmer/fill

## Technical approach
- All effects are pure CSS (gradients, backdrop-blur, keyframes) — no new dependencies
- Animations use `@keyframes` defined in tailwind config and applied via utility classes
- Glass effect layered: root gradient background → section-level noise overlay → card-level blur + transparency

