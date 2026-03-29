

# Mirror View Editor + Encrypted Sharing

## Database Schema

### `projects` table
Stores each user's briefs and generated specs.

```sql
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Brief',
  brief TEXT DEFAULT '',
  spec TEXT DEFAULT '',
  confidence INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
-- RLS: users only see/edit/delete their own projects
```

### `shared_specs` table
Tracks share links with encrypted tokens.

```sql
CREATE TABLE public.shared_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  share_token TEXT UNIQUE NOT NULL,  -- crypto-random token
  encrypted_spec TEXT NOT NULL,      -- AES-GCM encrypted spec content
  encryption_iv TEXT NOT NULL,       -- IV for decryption (passed via URL fragment)
  expires_at TIMESTAMPTZ,            -- optional expiry
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
-- RLS: only the creator can manage their shares
-- Public SELECT allowed via share_token (for the viewer)
```

### RLS Policies
- `projects`: Full CRUD restricted to `user_id = auth.uid()`
- `shared_specs`: INSERT/DELETE/UPDATE restricted to `shared_by = auth.uid()`. SELECT allowed for authenticated + anon users (viewer needs to read by token)

## Encryption Approach

Specs are encrypted **client-side** using the Web Crypto API (AES-GCM) before being stored in the database. The encryption key is never sent to the server.

```text
Share flow:
1. User clicks "Share" → generate random AES-256 key + IV
2. Encrypt spec text with key → store ciphertext + IV in shared_specs
3. Generate URL: /shared/{share_token}#{base64_key}
   └─ The key is in the URL fragment (hash) — never sent to the server
4. Recipient opens link → frontend reads key from hash → fetches ciphertext by token → decrypts client-side
```

This means:
- The server never sees the plaintext of shared specs
- Without the full URL (including the `#` fragment), the spec cannot be decrypted
- Revoking a share just deletes the row

## Frontend Changes

### Updated `ProjectMirror.tsx`
- Load project from database on mount (by `id` param)
- Auto-save brief/spec on change (debounced 1s)
- "Generate Mirror" still uses mock for now (AI integration is a separate task)
- Add **Share** button in the top bar → opens share dialog
- Show project title (editable inline)

### New `ShareDialog.tsx` component
- Glass-styled dialog matching the design system
- "Create share link" button → runs encryption + inserts into `shared_specs`
- Shows the generated URL with a copy button
- Lists existing share links with ability to revoke (delete)
- Optional expiry selector (1h, 24h, 7d, never)

### New `/shared/:token` route (`SharedSpec.tsx`)
- Public page (no auth required, no `ProtectedRoute` wrapper)
- Reads `share_token` from URL params, encryption key from `window.location.hash`
- Fetches encrypted spec from database by token
- Decrypts client-side and renders as read-only markdown-styled view
- If token invalid or expired → show "Link expired or not found"
- If key missing from URL → show "Invalid share link"

### Updated `Dashboard.tsx`
- Replace mock projects with real data from `projects` table
- "New Brief" button creates a new project row and navigates to it

### Updated `App.tsx`
- Add route: `/shared/:token` → `<SharedSpec />`

## Files Changed

| File | Action |
|---|---|
| Migration SQL | Create `projects` + `shared_specs` tables with RLS |
| `src/pages/ProjectMirror.tsx` | Wire to DB, add share button, auto-save |
| `src/components/ShareDialog.tsx` | New — share link creation/management |
| `src/pages/SharedSpec.tsx` | New — public encrypted spec viewer |
| `src/pages/Dashboard.tsx` | Wire to real projects data |
| `src/App.tsx` | Add `/shared/:token` route |
| `src/lib/crypto.ts` | New — AES-GCM encrypt/decrypt helpers |

