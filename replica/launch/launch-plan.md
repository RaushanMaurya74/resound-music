# Launch Plan: Resound

Positioned on the core fix: **Pure Music & True Shuffle** (solving Spotify's biased 20-song shuffle loop and podcast clutter).

---

## 1. Pre-Launch Beta & Waitlist

- **Waitlist Infrastructure:** Hosted at `resoundmusic.app` with simple email capture powered by Supabase.
- **Beta Cohort Size:** 150 music purists recruited from Reddit and community threads.
- **Telemetry & Monitoring:**
  - Vercel Analytics / PostHog for zero-cookie event tracking (measuring `play_started`, `shuffle_toggled`, `lyrics_opened`, `session_duration`).
  - Sentry for client-side JavaScript audio playback error reporting and stream dropped-frame alerts.
- **Preflight Gate:**
  - Zero open S1/S2 audio playback bugs
  - 100% WCAG AA contrast compliance verified
  - Clean brand sweep passed with zero trademark remnants
  - 15/15 automated API integration test cases passing

---

## 2. Target Communities (Where Unhappy Users Gather)

Directly address the communities where users have repeatedly voiced frustration with algorithmic loops and UI clutter:

| Community | Relevant Thread / Topic | Engagement Strategy |
| --- | --- | --- |
| **r/spotify** (1.5M members) | *"Why does shuffle play the same 20 songs?"* | Share open breakdown of Fisher-Yates array permutation vs. algorithmic clustering. |
| **r/truespotify** (60k members) | *"Stop pushing podcasts on my home screen"* | Demo the 100% music-only clean feed and sub-100MB RAM performance. |
| **r/audiophile** (2.1M members) | Web player equalizer & high-bitrate streaming | Announce lossless audio tiers and graphic EQ without browser extensions. |
| **Hacker News** | Engineering & Open Web | Show HN focused on building a snappy Next.js 16 Web Audio client. |
| **Product Hunt** | Music & Productivity tools | Launch day feature post highlighting "Pure Music. True Shuffle." |

---

## 3. Launch Posts

### A. Hacker News: Show HN Post

**Title:**  
`Show HN: Resound – A lightweight web player with unbiased Fisher-Yates true shuffle`

**Body:**
> Hey HN,  
>  
> Like many of you, I've used Spotify for years with playlists containing thousands of songs, only to hear the exact same 20 popular tracks every time I hit shuffle. Because streaming giants use clustered algorithmic pseudo-randomization, 90% of large playlists never get played. On top of that, the desktop web client routinely consumes over 1GB of RAM while pushing podcasts and video feeds.  
>  
> I built **Resound** ([https://resoundmusic.app](https://resoundmusic.app)): a fast, distraction-free web music player dedicated 100% to music.  
>  
> **What makes it different:**  
> 1. **True Random Shuffle:** Uses a mathematically unbiased Fisher-Yates array permutation in Web Audio. Every song plays exactly once before any repeats.  
> 2. **Pure Music Only:** Zero podcasts, zero audiobooks, zero algorithmic video teasers.  
> 3. **Uncapped Synced Lyrics:** Real-time karaoke lyrics on all tracks with zero paywalls.  
> 4. **Lightweight:** Built on Next.js 16 App Router and Turbopack; runs comfortably under 100MB of RAM.  
>  
> You can open the player and start listening immediately without creating an account.  
>  
> Would love your feedback on the audio playback engine and UI responsiveness!

---

### B. Product Hunt Post

- **Tagline:** Pure music streaming with mathematically unbiased true shuffle.
- **Short Description:** Say goodbye to podcast ads, cluttered feeds, and the 20-song shuffle loop. Resound gives you true random shuffle, free synced lyrics, and instant music streaming in under 100MB RAM.
- **Makers' First Comment:** Lead with the pain point: why streaming algorithms broke shuffle, and how our lightweight Web Audio engine fixes it.
- **Category:** Audio, Productivity, Web Apps.

---

## 4. The First 10 Users to Talk to by Hand

Recruit 10 specific user personas for 1-on-1 feedback sessions:

1. **The 2,000+ Song Playlist Curator (Reddit user from `r/spotify` shuffle thread):** Test whether Fisher-Yates uncovers forgotten tracks in their archive.
2. **The University Student / Focus Worker:** Evaluate battery life and RAM consumption over 6-hour study sessions.
3. **The Web Developer / Power User:** Assess keyboard shortcuts (`Space` for play/pause, `J`/`K` for track skip, `S` for true shuffle).
4. **The Karaoke / Language Learner:** Evaluate accuracy and readability of the synchronized lyrics drawer.
5. **The Audiophile:** Test sound quality perception on the 320kbps studio stream vs. standard 160kbps AAC.
6. **The Gym / Commute Listener:** Test queue management and quick playlist switching.
7. **The Indie Band Musician:** Review artist profile presentation and track credits.
8. **The Minimalist Designer:** Solicit feedback on the Electric Violet and Midnight Obsidian design system.
9. **The Accessible Web User:** Review screen-reader navigation and keyboard accessibility across track tables.
10. **The Ex-Spotify Subscriber:** Walk through the onboarding flow and compare search latency.

---

## 5. Post-Launch Metrics & Milestones

- **Day 1 Goal:** 500 active listening sessions; 0 fatal streaming interruptions.
- **Week 1 Goal:** 2,500 playlist tracks shuffled; 50 registered user accounts.
- **Month 1 Goal:** 20 paying Resound Premium subscribers ($9.99/mo); 99.9% audio playback uptime.
