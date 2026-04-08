

## Update Landing Page: How It Works + Features Bento Grid

### 1. How It Works — Add Step for Choosing Document Type

**File: `src/pages/Landing.tsx` (lines 150-232)**

Insert a new step between Step 01 (Write your brief) and the current Step 02 (AI mirrors your intent). Renumber existing steps to 01→01, new→02, old 02→03, old 03→04.

**New Step 02: "Choose what you need"**
- Title: "Choose your output"
- Description: "Pick the document that fits your stage. Need user stories and acceptance criteria? Go with a Product Requirements Doc. Need architecture, APIs, and data models? Choose Technical Specification."
- Visual: Two mini cards side by side — one labeled "PRD" with bullet icons (user stories, priorities), one labeled "Technical Spec" with code/architecture icons. Styled like a selector UI to mirror the actual in-app experience.

**Updated Step 03 (formerly 02): "SpecAI generates your document"**
- Retitle from "AI mirrors your intent" to "SpecAI builds your document"
- Update description: "Trained on thousands of real-world technical documents, SpecAI generates production-grade specs or PRDs — complete with architecture diagrams, API definitions, data models, and a dedicated confidence score that tells you how well your brief was understood."
- Keep the existing shimmer visual but add a small confidence badge (e.g., "94% confidence") in the corner.

### 2. Features Bento Grid — Add PRD vs Technical Spec Card

**File: `src/pages/Landing.tsx` (lines 248-323)**

Replace the current bottom-right small card ("Seamless Collaboration") or add a third small card. Better approach: convert the grid to `md:grid-cols-3 md:grid-rows-3` and add two new small cards, keeping the existing ones.

**New bento card: "PRD or Technical Spec — You Decide"**
- Placed as a new small card in the bento grid
- Icon: `FileText` or a split icon
- Content explains in plain language:
  - **Product Requirements Doc**: "Best for PMs and founders. Generates user stories, feature breakdowns, acceptance criteria, and priority rankings. Perfect for aligning your team on what to build."
  - **Technical Specification**: "Best for engineers and technical leads. Generates system architecture, API contracts, data models, and infrastructure recommendations. Perfect for knowing how to build it."
- Visual: Two mini pill/tab elements showing "PRD" and "Tech Spec" with a brief one-liner under each.

### 3. Summary of Changes

| Change | Location | Lines affected |
|--------|----------|---------------|
| Add Step 02 "Choose your output" | How It Works section | ~30 new lines between current steps 01 and 02 |
| Renumber steps 02→03, 03→04 | How It Works section | Update step numbers and tweak step 03 description |
| Update step 03 description to mention SpecAI + confidence score | How It Works section | ~5 lines |
| Add new bento card explaining PRD vs Tech Spec | Features bento grid | ~40 new lines |
| May need to import additional icon (`ClipboardList` or similar) | Top of file | 1 line |

