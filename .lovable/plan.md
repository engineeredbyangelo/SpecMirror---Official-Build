

## Two Changes: Upgrade AI Model + Add Copy Button

### 1. Upgrade AI Model to GPT-5

**File: `supabase/functions/generate-spec/index.ts`**

The current spec generation uses `google/gemini-3-flash-preview` via the Lovable AI Gateway. No need for OpenRouter — the Lovable AI Gateway already provides access to more powerful models including `openai/gpt-5`, which is the strongest reasoning model available.

- Change the model from `google/gemini-3-flash-preview` to `openai/gpt-5`
- This is a single-line change in the fetch body
- No new API keys or secrets needed — same gateway, same `LOVABLE_API_KEY`
- Redeploy the edge function

### 2. Add Copy Spec Button

**File: `src/pages/ProjectMirror.tsx`**

Add a copy button in the top bar next to the existing Share button (line ~275).

- Import `Copy` and `Check` icons (Check already imported)
- Add a `copiedSpec` state boolean
- Button copies `spec` to clipboard via `navigator.clipboard.writeText(spec)`
- Shows a checkmark for 2 seconds after copying, then reverts to copy icon
- Disabled when no spec content exists
- Placed immediately before the `ShareDialog` component

### Technical Summary

| Change | File | Impact |
|--------|------|--------|
| Swap model to `openai/gpt-5` | `supabase/functions/generate-spec/index.ts` | 1 line |
| Add copy button | `src/pages/ProjectMirror.tsx` | ~15 lines |
| Redeploy edge function | — | Auto |

