## Three Improvements: Faster Model, Better Prompt, and Generation Type Selector

### Problem Analysis

1. **Speed**: `openai/gpt-5` is the slowest model on the gateway. For spec generation, `google/gemini-2.5-flash` or `google/gemini-3-flash-preview` would be significantly faster while still producing high-quality output.
2. **Prompt quality**: The current system prompt is solid but could be tighter to reduce hallucination and stay grounded in the user's actual brief.
3. **Generation types**: Currently locked to "Technical Specification" only. Users may want different outputs depending on their role (PM vs engineer vs founder).

### 1. Switch to a Faster Model

**File: `supabase/functions/generate-spec/index.ts**`

Replace `openai/gpt-5` with `google/gemini-3-flash-preview`. This gives near-equivalent quality with substantially faster streaming (GPT-5 is the slowest option; Gemini 3 flash is top-tier but faster). Generation time should drop from ~40-60s to ~15-25s.

### 2. Tighten the System Prompt

**File: `supabase/functions/generate-spec/index.ts**`

Add anti-hallucination guardrails to the system prompt:

- Instruct the model to only reference technologies and patterns the user mentioned, closely align with the product brief, or explicitly flag assumptions
- Add a rule: "Do not invent features, integrations, or requirements the user did not mention or is not relevant for their project. If you must assume, prefix with **[Assumed-Best Case]**." Allow this to influence confidence score
- Make the prompt adapt based on generation type (see below)

### 3. Add Generation Type Selector

**File: `supabase/functions/generate-spec/index.ts**` — Accept a `specType` parameter and swap the system prompt accordingly.

**File: `src/pages/ProjectMirror.tsx**` — Add a dropdown/select before the Generate button with these options:


| Type                   | Label                     | Output                                                                                                                                                                                                                                                                                                              |
| ---------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `technical-spec`       | Technical Specification   | Current output (architecture, data model, API, etc.)                                                                                                                                                                                                                                                                |
| `prd`                  | Product Requirements Doc  | User stories, acceptance criteria, feature breakdown, prioritization                                                                                                                                                                                                                                                |
| `stack-recommendation` | Tech Stack Recommendation | Framework comparison, infrastructure choices, cost analysis, scalability assessment Tech Stack option may not be needed as the tech stack including framework comparison and infrastructure choices, cost analysis and scalability should already be included in either type of generation. (Let's test this first) |


Each type gets its own tailored system prompt stored in the edge function. The user picks the type, clicks Generate, and gets the appropriate document.

### 4. UI Changes

**File: `src/pages/ProjectMirror.tsx**`

- Add a `Select` component above or next to the Generate button
- Default selection: "Technical Specification"
- Pass `specType` in the request body to the edge function
- Update the mirror panel header to reflect the selected type

### Technical Summary


| Change                                     | File                     | Impact                                  |
| ------------------------------------------ | ------------------------ | --------------------------------------- |
| `google/gemini-3-flash-preview`            | `generate-spec/index.ts` | 1 line — major speed improvement        |
| Add anti-hallucination rules to prompt     | `generate-spec/index.ts` | ~5 lines in system prompt               |
| Add 3 spec type prompts + `specType` param | `generate-spec/index.ts` | ~80 lines (3 prompt variants + routing) |
| Add type selector UI                       | `ProjectMirror.tsx`      | ~20 lines (Select component + state)    |
| Redeploy edge function                     | —                        | Auto                                    |
