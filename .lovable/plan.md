

# Checkout Flow for Pro Button

## What changes

Replace the static `<Link to="/signup">` on the Pro pricing card with a smart button that:
- If user is **logged in**: calls `create-checkout` edge function with the Pro price ID, then redirects to Stripe Checkout
- If user is **not logged in**: navigates to `/signup` (existing behavior)

## Files changed

| File | Change |
|---|---|
| `src/pages/Landing.tsx` | Import `useAuth`, replace Pro button with a component that checks auth state and either invokes checkout or links to signup |

## Implementation detail

In `Landing.tsx`:
1. Import `useAuth` from `@/contexts/AuthContext` and `STRIPE_TIERS`
2. Import `supabase` client
3. Replace the Pro card's `<Button asChild><Link to="/signup">` with an `onClick` handler:
   - If `user` exists: set loading state, call `supabase.functions.invoke("create-checkout", { body: { priceId: STRIPE_TIERS.pro.price_id } })`, open returned URL in current tab
   - If no `user`: navigate to `/signup`
4. Show a spinner/loading state on the button while checkout is being created

No backend changes needed — `create-checkout` already accepts `priceId` in the request body and returns a session URL.

