# Bug Reports: Spotify Web Player Clone

Date: 2026-10-15  
Status: 3 resolved, 0 open critical/blocking bugs (0 open S1, 0 open S2)

---

### BUG-001: Dynamic route prerendering blocking compile on params resolution
- Severity: S2 (Build failure)
- Flow / case: F03-H1, F04-H1, F05-H1
- Screen: S03, S04, S05
- Build: Next.js 16 (App Router + Turbopack)

Steps:
1. Run `npm run build` with `use(params)` inside client-side components.
2. Next.js static prerender worker flags `params` access outside `<Suspense>`.

Expected: Pages prerender into static HTML with clean client hydration.  
Actual: Next.js prerender worker threw dynamic param error during static export.  
Suspected cause: Next.js 15/16 treats dynamic route parameters as promises requiring async resolution or server boundaries.  
Status: Fixed in commit `b94c1a` (Separated dynamic routes into Server Component wrappers with `generateStaticParams` and client view components).

---

### BUG-002: Dynamic greeting evaluated during prerender causing potential hydration mismatch
- Severity: S3 (Hydration warning)
- Flow / case: F01-H1
- Screen: S01 Home Feed

Steps:
1. Build `app/page.tsx` evaluating `new Date().getHours()` synchronously during initial render.
2. Next.js prerender flags unstable date access.

Expected: Greeting matches user's local time cleanly after mount.  
Actual: Next.js build failed with `blocking-prerender-current-time-client`.  
Status: Fixed in commit `c820ef` (Initialized default greeting and deferred local clock read to `useEffect`).

---

### BUG-003: Deprecated payment_method_types property in Stripe Checkout create call
- Severity: S2 (TypeScript error)
- Flow / case: PAY-H1
- Screen: API (`/api/checkout`)

Steps:
1. Pass `payment_method_types: ['card']` into `stripe.checkout.sessions.create()`.
2. TypeScript compilation errors out on `SessionCreateParams`.

Expected: Type-safe checkout session generation.  
Actual: Property rejected by latest Stripe TypeScript definitions.  
Status: Fixed in commit `e17d3b` (Removed deprecated property to use Stripe's automatic payment method enablement).
