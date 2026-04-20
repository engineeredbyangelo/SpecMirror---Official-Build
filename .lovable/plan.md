## Pro Export (PDF + Notion) + Slack Integration

Two large features. Here's the proposed approach — please confirm before I build.

---

### Feature 1: PDF Export (Pro only)

**Approach:** Client-side PDF rendering using `jspdf` + `jspdf-autotable` (or `html2pdf.js`).

- Pro users get a "Export PDF" option in the Dashboard project card (replaces/augments current "Use" button).
- Renders the approved spec with SpecMirror branding: dark cover page, indigo accent, monospace code blocks for sections, page numbers.
- Free/Basic users see the option grayed out with an "Upgrade to Pro" tooltip → Stripe checkout for Pro.

**Files:**

- `src/lib/exportPdf.ts` — new utility
- `src/pages/Dashboard.tsx` — wire export menu

---

### Feature 2: Notion Export (Pro only)

**Approach:** Use the Notion connector (`standard_connectors--connect notion`).

- Pro users click "Export to Notion" → if not connected, prompts connection. Then a dialog asks which parent page to push to (uses Notion's `search` API to list user's accessible pages).
- New edge function `export-to-notion` — takes `projectId` + `parentPageId`, fetches the spec server-side, calls Notion gateway to create a child page with the spec content as blocks (heading + paragraph + code blocks).
- Free/Basic blocked + Stripe upsell.

**Files:**

- `supabase/functions/export-to-notion/index.ts` — new edge function (uses connector gateway)
- `src/components/NotionExportDialog.tsx` — page picker
- `src/pages/Dashboard.tsx` — wire button

**Requires:** User connects Notion via the connector flow.

---

### Feature 3: Slack OAuth + Post to Channel

**Decision needed:** The Lovable Slack connector authenticates **the workspace owner's account**, not each end-user. Two options - Go with option A. 

- **A. (Recommended) Use the Lovable Slack connector** — simplest. One Slack workspace per Lovable workspace. Good for solo users / single-team accounts. Setup: click "Connect Slack" → goes through Lovable connector flow → channel picker dialog → posts via gateway.
- **B. Per-user Slack OAuth (BYO Slack app)** — each end-user authorizes their own Slack workspace. Requires you to create a Slack app in api.slack.com, store client ID/secret, implement OAuth callback, store per-user tokens in DB. Much more work — ~3 new tables, OAuth callback function, token refresh logic.

**My recommendation: A.** SpecMirror users are likely small teams; the connector covers 90% of cases. If you want B later, we can add it.

**Files (option A):**

- `supabase/functions/post-to-slack/index.ts` — new edge function (uses connector gateway, calls `chat.postMessage`)
- `supabase/functions/list-slack-channels/index.ts` — new edge function (calls `conversations.list`)
- `src/components/SlackPostDialog.tsx` — channel picker + preview
- `src/pages/Dashboard.tsx` — wire "Post to Slack" button

---

### UI placement on Dashboard

Replace the single "Use" button on each approved-project card with a **dropdown menu**:

- Copy spec (existing)
- Export PDF (Pro)
- Export to Notion (Pro)
- Post to Slack (Basic + Pro)
- Share link (existing)

Free users see all gated items disabled with a lock icon → click → Stripe checkout.

---

### Confirm before I build

1. **Slack approach** — Option A (Lovable connector, recommended) or B (per-user OAuth, much more work)? - Option A
2. **PDF library** — `jspdf` (lightweight, good control, what I'd pick) or `react-pdf/renderer` (nicer for complex layouts, larger bundle)?- jspdf
3. **Notion export format** — full spec as one page with structured blocks, OR also create sub-pages per section (Overview / Requirements / etc.)? Recommend: one page, structured blocks. - the recommended option
4. **Build all three at once or sequence?** — Recommend doing PDF first (no external dependencies), then Notion, then Slack. Or build in parallel if you want it all in one pass. Go i nthe order you recommended