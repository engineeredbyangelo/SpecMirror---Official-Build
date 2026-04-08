

## Smooth Mobile UI: Move Selector & Generate to Bottom Bar

### Current Problem

On mobile (390px), the top bar crams too many controls into a wrapping flex layout — the spec-type selector, generate button, copy, share, and approve all compete for space. This makes the UI feel cluttered and hard to use with one hand.

### Plan

**File: `src/pages/ProjectMirror.tsx`**

1. **On mobile only**, remove the `Select` (spec type) and "Generate" button from the top bar
2. **Keep** in the top bar for mobile: back arrow, title, saving indicator, confidence meter, Copy, Share, Approve
3. **Add a fixed bottom bar** (only rendered when `isMobile`) containing:
   - The spec-type `Select` dropdown (full width or ~60% width)
   - The "Generate" button (prominent, primary style)
   - Styled with `fixed bottom-0` and a top border, matching the dark theme
4. **Add bottom padding** to the main content area on mobile so the bottom bar doesn't overlap the textarea

### Layout (mobile)

```text
┌──────────────────────────┐
│ ← Title        Copy Share Approve │  <- top bar
├──────────────────────────┤
│ Brief | Mirror  (tabs)            │
├──────────────────────────┤
│                                   │
│   textarea content                │
│                                   │
│                                   │
├──────────────────────────┤
│ [Select Type ▼]  [✨ Generate]   │  <- fixed bottom bar
└──────────────────────────┘
```

### Technical Details

- Wrap the Select and Generate button in a `div` with `fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background px-3 py-2.5 flex items-center gap-2`
- The Select gets `flex-1` so it fills available space; Generate button stays fixed width
- Add `pb-16` to the mobile content wrapper so text isn't hidden behind the bar
- Desktop layout is completely unchanged — all changes are gated behind `isMobile`
- The top bar's flex-wrap items on mobile will be cleaner with two fewer controls

