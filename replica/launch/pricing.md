# Pricing Strategy: Resound

Derived from competitor analysis, user sentiment in `replica/feedback.md`, and the core positioning angle in `replica/fixes.md`.

---

## 1. Competitor Benchmark (Read: October 2026)

| Service | Individual Plan | Family / Multi-user | Free Tier | HiFi / Lossless Status | Source URL |
| --- | --- | --- | --- | --- | --- |
| **Spotify** | $11.99 / mo | $19.99 / mo | Ad-supported, capped shuffle, paywalled lyrics | Promised since 2021, unreleased | [spotify.com/us/premium](https://www.spotify.com/us/premium/) |
| **Apple Music** | $10.99 / mo | $16.99 / mo | None (1-month trial) | Included (ALAC up to 24-bit/192kHz) | [apple.com/apple-music](https://www.apple.com/apple-music/) |
| **Tidal** | $10.99 / mo | $16.99 / mo | None | Included (FLAC / HiRes) | [tidal.com/pricing](https://tidal.com/pricing) |
| **Qobuz** | $12.99 / mo | $21.99 / mo | None | Studio Lossless included | [qobuz.com](https://www.qobuz.com) |

---

## 2. Reviewer Sentiment on Pricing & Billing

From community feedback across Reddit (`r/spotify`, `r/truespotify`) and user review boards:

1. **Unjustified Price Increases (42 complaint threads):** Spotify raised individual prices multiple times (from $9.99 to $10.99 to $11.99/mo) while degrading the core music experience with podcast spam and failing to ship promised HiFi audio.
2. **Feature Stripping & Paywalled Lyrics (28 complaint threads):** Moving lyrics behind a paywall and enforcing listening caps on free users was perceived as anti-consumer and an accessibility regression.
3. **Cancellation Obstacles (19 complaint threads):** Complex multi-step cancellation flows with misleading "Keep listening" dialogs.

---

## 3. Resound Pricing Model & Philosophy

### Core Guarantees:
- **Zero Music Paywalls:** Unbiased Fisher-Yates True Shuffle and real-time synchronized lyrics are **100% free forever** for every listener.
- **One-Click Instant Cancellation:** Cancel immediately inside account settings with zero confirmation loops or dark patterns.
- **Honest Annual Billing:** Annual plan includes 2 months free with an email reminder sent 7 days before auto-renewal.
- **Transparent Rates:** No surprise price jumps.

---

## 4. Plan Tiers (Maximum 3 Tiers)

### Tier 1: Free (The Everyday Listener)
- **Price:** **$0 / month**
- **Target Audience:** Casual listeners, students, and music purists.
- **Features:**
  - Unlimited web player streaming
  - Mathematically unbiased True Shuffle (Fisher-Yates)
  - Real-time karaoke-synced lyrics on all tracks
  - 100% music-only feed (zero podcasts or audiobooks)
  - Standard audio streams (160kbps AAC)
  - Full search, queue drawer, and playlist curation

### Tier 2: Resound Premium (The Audiophile & Dedicated Curator)
- **Price:** **$9.99 / month** or **$99.00 / year** (Save ~17%, 2 months free)
- **Target Audience:** Audiophiles, daily listeners, and playlist curators.
- **Features:**
  - Everything in Free
  - High-bitrate studio audio (320kbps + Lossless FLAC streaming)
  - Unlimited playlist cloud backup and instant import/export
  - Offline cached audio listening
  - Advanced 10-band graphic equalizer with studio acoustic presets
  - Priority track loading and zero promotional callouts

### Tier 3: Resound Studio (Artists & Audio Creators)
- **Price:** **$19.99 / month** or **$199.00 / year**
- **Target Audience:** Independent artists, audio producers, and DJ curators.
- **Features:**
  - Everything in Premium
  - Direct FLAC track upload and catalog hosting
  - Real-time streaming analytics and listener geographic breakdown
  - Direct listener tip-jar integration (0% platform cut on tips)
  - Custom verified artist profile page and release scheduling

---

## 5. Stripe Configuration Reference

To be configured in Stripe Dashboard:

```json
{
  "products": [
    {
      "name": "Resound Premium",
      "id": "prod_resound_premium",
      "description": "High-bitrate studio audio streams, offline playback, and custom equalizer.",
      "prices": [
        {
          "nickname": "Monthly",
          "id": "price_resound_monthly_999",
          "unit_amount": 999,
          "currency": "usd",
          "recurring": { "interval": "month" }
        },
        {
          "nickname": "Annual",
          "id": "price_resound_annual_9900",
          "unit_amount": 9900,
          "currency": "usd",
          "recurring": { "interval": "year" }
        }
      ]
    },
    {
      "name": "Resound Studio",
      "id": "prod_resound_studio",
      "description": "Direct artist track uploads, real-time analytics, and tip jar.",
      "prices": [
        {
          "nickname": "Monthly",
          "id": "price_resound_studio_1999",
          "unit_amount": 1999,
          "currency": "usd",
          "recurring": { "interval": "month" }
        }
      ]
    }
  ]
}
```
