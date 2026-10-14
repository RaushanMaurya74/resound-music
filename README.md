# Resound (resound-music)

> **Pure Music. True Shuffle. Zero Distractions.**

Resound is a fast, lightweight music streaming web player designed for music purists. Built with Next.js 16 (App Router + Turbopack), TypeScript, and Tailwind CSS.

---

## Key Features

- **Fisher-Yates True Shuffle Engine:** Mathematically unbiased track randomization. Every track in your playlist plays exactly once before repeating.
- **Pure Music Feed:** 100% focused on music. Zero podcasts, zero audiobooks, zero algorithmic clutter.
- **Synchronized Karaoke Lyrics:** Real-time synced lyric drawer with smooth auto-scroll.
- **Persistent Player Dock:** Persistent HTML5 audio stream with keyboard shortcuts (`Space` to toggle, `J`/`K` to skip, `S` for true shuffle).
- **Sub-100MB Memory Footprint:** Lightning-fast page loads and minimal RAM consumption.
- **Full Parity Suite:** Home feed, Search & Browse, Curated Playlists, Album Views, Artist Profiles, and Liked Songs.
- **Supabase & Stripe Ready:** PostgreSQL schema with Row-Level Security and Stripe Checkout subscriptions.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env.local
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing & Quality Gate

Run the automated integration test suite:
```bash
node tests/run-tests.mjs
```

Run the brand sweep audit:
```bash
node replica/brand/sweep.js
```

Check WCAG 2.2 color contrast compliance:
```bash
node replica/design/contrast.js replica/design/tokens.json
```

---

## License
MIT
