

# Approve Spec Flow

## What it does
When a user clicks "Approve" on a spec, it marks the project as approved. On the Dashboard, approved projects display an **"Approved Spec Brief"** label in emerald green, and each project row gets a Share button so users can create encrypted links and distribute specs directly from the dashboard.

## Database change
Add an `approved` boolean column (default `false`) to the `projects` table via migration. No new RLS policies needed — existing ones cover it.

## Code changes

### 1. `src/pages/ProjectMirror.tsx`
- Wire the **Approve** button's `onClick` to set `approved = true` in the database and update local state
- Show a toast on success ("Spec approved")
- Visually indicate approved state (button turns green with checkmark, disabled after approval)

### 2. `src/pages/Dashboard.tsx`
- Fetch `approved` field alongside existing columns
- For approved projects, show an **"Approved Spec Brief"** badge in emerald green (`text-emerald-400`) next to the project title
- Add a **Share** button on each approved project row that opens the ShareDialog
- Fetch spec content on-demand when share is triggered (since dashboard currently only loads id/title/confidence/updated_at)

### 3. `src/components/ShareDialog.tsx`
- No changes needed — it already accepts `projectId` and `specContent` as props and handles everything internally

## Technical details

```text
Dashboard row (approved):
┌──────────────────────────────────────────────────────────┐
│ 📄 My Product Brief                                     │
│    Approved Spec Brief  (emerald-400)   Updated 2h ago  │
│                                    [Share] [🗑]  85% ██ │
└──────────────────────────────────────────────────────────┘
```

- Migration SQL: `ALTER TABLE projects ADD COLUMN approved boolean NOT NULL DEFAULT false;`
- Approve handler saves `approved: true` and shows confirmation toast
- Dashboard fetches `approved` and conditionally renders the green label + share button
- Share button fetches the project's `spec` field before opening the dialog

