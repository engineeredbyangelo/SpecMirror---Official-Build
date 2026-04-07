

## Three Changes: Swipe Gestures, Live Preview Rewrite, and Founders Card

### 1. Swipe Gestures on Mobile Mirror Tabs

**File: `src/pages/ProjectMirror.tsx`**

Add touch event handling to the mobile tab container so users can swipe left/right to switch between Brief and Mirror tabs.

- Track `touchStart` and `touchEnd` X coordinates via `onTouchStart` / `onTouchEnd` on the tab content wrapper
- If horizontal swipe distance exceeds 50px threshold, toggle `activeTab`
- Swipe left (Brief → Mirror), swipe right (Mirror → Brief)
- No new dependencies — just native touch events

### 2. Live Preview: Show Real Text Instead of Skeleton Bars

**File: `src/pages/Landing.tsx` — rewrite `MirrorDemo` component**

Replace the current abstract colored bars with actual readable text that types in, showing a real product brief on the left and a real generated spec on the right.

- **Left panel (Product Brief):** Show real plain-English text lines that appear with a typewriter animation, e.g.:
  - "User Authentication Flow" (heading)
  - "Users should be able to sign up with email and password. Support social login via Google and GitHub. Password reset via email link."
  - "Session Management" (heading)
  - "Keep users logged in for 30 days with refresh token rotation."

- **Right panel (Technical Mirror):** After the brief finishes typing (~2.5s), show a skeleton loading shimmer for ~1s, then reveal actual spec text with fade-in:
  - "Architecture" → "JWT with httpOnly cookies, bcrypt password hashing, OAuth2 flow for Google/GitHub"
  - "Effort Estimate" → "~3 sprint points, 2 days implementation"
  - "Acceptance Criteria" → checkmark items like "Email signup with verification flow"

- Use CSS `@keyframes` for the typewriter effect (character-by-character or line-by-line reveal) and the existing `spec-reveal` animation for the right side
- Keep the confidence ring animation as-is — it already works well
- Maintain existing window chrome (dots + URL bar) at the top

### 3. Add "Technical / Non-Tech Founders" Card

**File: `src/pages/Landing.tsx` — "For every team" section (~lines 458-484)**

Insert a new role card between "Product Managers" and "Engineers" in the array:

```
{
  role: "Technical & Non-Tech Founders",
  quote: "Translate your vision into buildable specs from day one — avoid costly technical debt before writing a single line of code.",
  icon: <Layers className="h-5 w-5" />,
  accentColor: "accent",
  stat: "60%",
  statLabel: "Less rework",
}
```

This slots in at index 1 (between PM and Engineers), making 4 cards total. The `Layers` icon is already imported.

### Technical Summary

| Change | Files | New deps |
|--------|-------|----------|
| Swipe gestures | `ProjectMirror.tsx` | None |
| Live preview text | `Landing.tsx` (MirrorDemo) | None |
| Founders card | `Landing.tsx` (team section) | None |

