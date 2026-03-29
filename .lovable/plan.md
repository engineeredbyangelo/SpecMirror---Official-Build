

# Authentication Implementation Plan

## Database (Migration)

### `profiles` table
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### RLS Policies — strict user-only access
```sql
-- Users can only read their own profile
CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can only update their own profile
CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can insert their own profile (for trigger fallback)
CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
```

### Auto-create trigger
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## Frontend — Auth Provider

### `src/contexts/AuthContext.tsx`
- React context wrapping the app with `user`, `session`, `loading`, `signOut`
- Uses `supabase.auth.onAuthStateChange` listener (set up BEFORE `getSession()`)
- No secrets or API logic exposed — only calls `supabase.auth.signInWithPassword`, `signUp`, `resetPasswordForEmail`, `updateUser`

### `src/components/ProtectedRoute.tsx`
- Wraps `/dashboard` and `/project/:id`
- If no session + not loading → redirect to `/login`
- Shows skeleton while loading

## Auth Pages — Wiring

### Login (`src/pages/Login.tsx`)
- Form state with `useState` for email/password
- Calls `supabase.auth.signInWithPassword({ email, password })`
- On success → navigate to `/dashboard`
- Error display below form

### Signup (`src/pages/Signup.tsx`)
- Form state for name, email, password
- Calls `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`
- Email confirmation required (no auto-confirm)
- On success → show "Check your email" message

### Reset Password (`src/pages/ResetPassword.tsx`)
- Two modes: (1) request reset link, (2) set new password
- Mode 1: `supabase.auth.resetPasswordForEmail(email, { redirectTo: origin + '/reset-password' })`
- Mode 2: Detects `type=recovery` in URL hash, shows new password form, calls `supabase.auth.updateUser({ password })`

### Dashboard — Logout
- Log out button calls `supabase.auth.signOut()` → redirect to `/`

## Edge Cases & Validation

All handled client-side on the forms (no secrets exposed):

| Edge case | Handling |
|---|---|
| Empty fields | Disable submit, inline "Required" error |
| Invalid email format | Regex check before submit |
| Password too short | Minimum 8 chars, show strength hint |
| Duplicate email signup | Display backend error ("User already registered") |
| Wrong credentials login | Display "Invalid email or password" |
| Network failure | Generic "Something went wrong, try again" toast |
| Already logged in visiting /login | Redirect to /dashboard |
| Session expired | AuthProvider detects, redirects to /login |

## Rate Limiting

Client-side throttle on auth forms (no API keys exposed):
- Track failed attempts in component state
- After 5 failed attempts within 60 seconds → disable form for 30 seconds with countdown
- Show "Too many attempts. Try again in X seconds."
- Reset counter on success or after cooldown
- Server-side rate limiting handled automatically by Lovable Cloud's built-in auth rate limits

## Security Principles

- All Supabase calls use the publishable anon key only (already in client.ts)
- No service role key, no API secrets in frontend code
- RLS ensures users can only access their own data — even if someone crafts a direct API call
- `SECURITY DEFINER` on the trigger function with `SET search_path = public` to prevent search path injection
- Password reset uses Lovable Cloud's built-in email (no third-party keys needed for now)

## Files Changed

| File | Action |
|---|---|
| Migration SQL | Create profiles table, RLS, trigger |
| `src/contexts/AuthContext.tsx` | New — auth state provider |
| `src/components/ProtectedRoute.tsx` | New — route guard |
| `src/pages/Login.tsx` | Wire to Supabase auth |
| `src/pages/Signup.tsx` | Wire to Supabase auth |
| `src/pages/ResetPassword.tsx` | Wire to Supabase auth (dual mode) |
| `src/pages/Dashboard.tsx` | Add logout, use auth context |
| `src/App.tsx` | Wrap with AuthProvider, protect routes |

