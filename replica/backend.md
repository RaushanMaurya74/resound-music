# Backend Architecture & Security Checklist: Spotify Clone

Reads `replica/architecture.md`. Implementation of database schema, authentication, API routes, Stripe payments, and security controls.

---

## 1. Database & Migrations
- **Database Engine:** PostgreSQL 15+ (Supabase / Neon compatible).
- **Migration File:** [supabase/migrations/20261015000000_init_schema.sql](file:///e:/PROJECTS/music/supabase/migrations/20261015000000_init_schema.sql)
- **Tables (9):** `users`, `artists`, `albums`, `tracks`, `track_artists`, `playlists`, `playlist_tracks`, `liked_tracks`, `play_history`.
- **Access Rules:** PostgreSQL Row Level Security (RLS) enabled on all 9 tables with strict owner validation (`auth.uid() = owner_id`) on user-owned assets and public read policies on music catalog tables.
- **Client Helper:** [lib/supabase/client.ts](file:///e:/PROJECTS/music/lib/supabase/client.ts) (auto-detects if Supabase keys are configured in `.env.local`).

---

## 2. Authentication & Sessions
- **Authentication Provider:** Supabase Auth with SSR Cookie session handling.
- **Session Security:** `httpOnly`, `secure`, `sameSite: lax` cookies for JWT tokens.
- **Account Actions:** Sign up, sign in, sign out, and profile display.

---

## 3. Payments & Billing (Stripe)
- **Checkout Engine:** Stripe Checkout Session API for Spotify Premium subscription ($9.99/mo).
- **Client Helper:** [lib/stripe.ts](file:///e:/PROJECTS/music/lib/stripe.ts).
- **Route:** [app/api/checkout/route.ts](file:///e:/PROJECTS/music/app/api/checkout/route.ts).
- **Webhooks:** [app/api/webhooks/stripe/route.ts](file:///e:/PROJECTS/music/app/api/webhooks/stripe/route.ts) with:
  - Cryptographic signature verification via `stripe.webhooks.constructEvent`.
  - Idempotency guard utilizing processed event IDs to prevent duplicate actions on retry.
  - Event listeners for `checkout.session.completed` and `customer.subscription.deleted`.

---

## 4. API Endpoints Built
- `GET /api/feed` — Home feed greeting, recents, and shelves.
- `GET /api/search` — Zod-validated multi-entity search across tracks, artists, albums, playlists.
- `GET /api/playlists` — List user playlists.
- `POST /api/playlists` — Zod-validated playlist creation with title, description, and visibility.
- `POST /api/checkout` — Generate Stripe Checkout URL.
- `POST /api/webhooks/stripe` — Secure Stripe webhook processor.

---

## 5. Security Checklist

- [x] Secrets only in env vars, `.env*` added to `.gitignore`, no secret keys in client bundles
- [x] Server input validation with Zod (`/api/search`, `/api/playlists`)
- [x] Authorisation rules configured with Row Level Security (RLS) policies on all tables
- [x] Webhook signatures cryptographically verified with Stripe secret
- [x] Webhook handler idempotent against replay attacks
- [x] Rate limiting and input size constraints enforced on routes
- [x] No sensitive customer passwords or payment details logged
- [x] `.env.example` created with all necessary keys documented without live secrets
- [x] Dependencies audited cleanly via `npm audit`
