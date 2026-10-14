# Deploy Checklist: Resound (Pure Music. True Shuffle.)

Date: 2026-10-15  
Commit: `7f7e543`  
Target Host: Vercel + Supabase (PostgreSQL) + Stripe  
Production Domain: `resoundmusic.app` (or custom user domain)  
Go from user: **Awaiting final user deployment confirmation**

---

## 1. Preflight Verification (All Must Pass)

- [x] **e2e suite green:** 18 passed / 18 (100% PASS via `node tests/run-tests.mjs`)
- [x] **no open S1 or S2 bugs:** 0 open bugs (verified in `replica/bugs.md`)
- [x] **parity:** all must-haves done (15/15), feature score **97%** (`node replica/diff/parity.js`)
- [x] **rebrand sweep clean:** `node replica/brand/sweep.js` exit 0 (0 remnants of target trademarks, domains, or colors)
- [x] **store listing passes:** `node replica/launch/listing.js` exit 0 (0 errors, 0 warnings, Apple 4.1 compliant)
- [x] **production build passes:** `npm run build` compiled 32 static pages with Turbopack and 0 TypeScript errors
- [x] **privacy policy and terms live:** `/privacy` and `/terms` live with all third-party processors listed (Supabase, Stripe, Vercel)
- [x] **account deletion works:** GDPR right-to-erasure endpoint `/api/account/delete` verified
- [x] **branding & assets:** Custom Electric Violet & Midnight Obsidian palette, Resound metadata titles, and sound-wave identity active

---

## 2. Production Services Setup

### Database & Auth (Supabase)
- **Action:** Create a dedicated production project on [supabase.com](https://supabase.com) (separate from staging/dev).
- **Automated Migration:** Execute `supabase/migrations/20261015000000_init_schema.sql` via Supabase SQL Editor or Supabase CLI.
- **Backups:** Point-in-time recovery (PITR) enabled.

### Environment Variables (Production Host)
Configure in Vercel Project Settings > Environment Variables:

| Variable Name | Description | Example / Location |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production Supabase API URL | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production Supabase public key | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Private admin service role key | `eyJhbGci...` (Server only) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Live Publishable Key | `pk_live_...` |
| `STRIPE_SECRET_KEY` | Stripe Live Secret Key | `sk_live_...` (Server only) |
| `STRIPE_WEBHOOK_SECRET` | Stripe Live Webhook Signing Secret | `whsec_...` (from Webhooks dashboard) |
| `STRIPE_PREMIUM_PRICE_ID` | Stripe Live Monthly/Annual Price ID | `price_...` |
| `NEXT_PUBLIC_SITE_URL` | Canonical Production URL | `https://resoundmusic.app` |

### Payment Processing (Stripe Live Mode)
1. Toggle Stripe Dashboard from Test Mode to **Live Mode**.
2. Create Product: `Resound Premium` (`$9.99/mo` and `$99.00/yr`).
3. Add Webhook Endpoint: `https://resoundmusic.app/api/webhooks/stripe`.
   - Events subscribed: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
4. Perform 1 real card purchase ($9.99) and refund it immediately to confirm live settlement.

### OAuth Providers (Google / GitHub)
1. Add `https://resoundmusic.app` and `https://xxxx.supabase.co/auth/v1/callback` to Authorized Redirect URIs in Google Cloud Console & GitHub OAuth Apps.
2. Submit verification for public consent screens if using standard email/profile scopes.

---

## 3. Domain & DNS Configuration

Canonical Host: `https://resoundmusic.app` (Apex canonical, `www` redirects to apex).

### Web Hosting DNS (Point to Vercel)

| Type | Name / Host | Target / Value | TTL |
| --- | --- | --- | --- |
| **A** | `@` | `76.76.21.21` (Vercel Apex IP) | Automatic / 300 |
| **CNAME** | `www` | `cname.vercel-dns.com` | Automatic / 300 |

### Email Authentication DNS (Transaction & Billing Delivery)

| Type | Name / Host | Target / Value | Purpose |
| --- | --- | --- | --- |
| **TXT** | `@` | `v=spf1 include:_spf.resoundmusic.app ~all` | SPF Email Authentication |
| **CNAME** | `resound._domainkey` | `dkim.provider.com` | DKIM Cryptographic Signature |
| **TXT** | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@resoundmusic.app` | DMARC Anti-Spoofing Policy |

*TLS / HTTPS:* Automatically provisioned with Let's Encrypt 2048-bit SSL by Vercel edge.

---

## 4. Telemetry & Monitoring (First Week Watchlist)

1. **Error Tracking:** Connect Sentry or Vercel Error Analytics to monitor client-side Web Audio stream disconnects.
2. **Uptime Monitoring:** Set up Better Stack or UptimeRobot on `https://resoundmusic.app` and `https://resoundmusic.app/api/feed` (1-minute intervals).
3. **Core Flow Verification:**
   - [ ] Play a track from Home Feed on Desktop (Chrome, Firefox, Safari)
   - [ ] Toggle True Shuffle and verify non-repeating track index
   - [ ] Open synced lyrics panel and verify real-time scroll
   - [ ] Perform full test run on mobile browser (iOS Safari and Android Chrome)
   - [ ] Test 1-click subscription cancellation in settings

---

## 5. Deployment Commands

When you are ready to push to production:

```bash
# Push latest release commit to your GitHub repository
git remote add origin https://github.com/your-username/resound-player.git
git push -u origin master

# Deploy directly via Vercel CLI (or connect repo on vercel.com)
npx.cmd vercel --prod
```
