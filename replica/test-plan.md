# Test plan: Spotify Web Player Clone

Build: Production Release  Date: 2026-10-15  Env: local, seed data (`http://localhost:3000`)

| case | flow | type | steps | expected | auto | result |
| --- | --- | --- | --- | --- | --- | --- |
| F01-H1 | Home Feed & Discovery | happy | Open `/`, inspect greeting, quick play cards, shelves | 200 OK, full layout shell, time-of-day greeting, player dock idle | e2e | PASS |
| F01-H2 | Audio Playback Trigger | happy | Click green play button on any media card | Audio engine starts, bottom player dock updates with title/cover, scrubber moves | manual/e2e | PASS |
| F01-API | Home Feed Data API | happy | `GET /api/feed` | 200 OK, returns recents and 3 shelves with items | e2e | PASS |
| F02-H1 | Search & Browse Screen | happy | Open `/search` with empty query | 200 OK, renders 10 colorful category tiles | e2e | PASS |
| F02-API | Live Search Query API | happy | `GET /api/search?q=weeknd` | 200 OK, returns top result, tracks, artists, albums, playlists | e2e | PASS |
| F02-N1 | Search Validation Negative | negative | `GET /api/search?q=` (empty query) | 400 Bad Request with Zod validation details | e2e | PASS |
| F03-H1 | Playlist Detail View | happy | Open `/playlist/playlist-top-hits` | 200 OK, hero backdrop, creator, duration, track table | e2e | PASS |
| F03-API | List Playlists API | happy | `GET /api/playlists` | 200 OK, returns array of user playlists | e2e | PASS |
| F03-POST | Create Playlist API | happy | `POST /api/playlists` with title and description | 201 Created with new playlist object and generated ID | e2e | PASS |
| F03-N1 | Playlist Creation Negative | negative | `POST /api/playlists` with empty title | 400 Bad Request with validation error | e2e | PASS |
| F04-H1 | Album Detail View | happy | Open `/album/album-1` | 200 OK, After Hours cover, artist link, tracks, copyright | e2e | PASS |
| F05-H1 | Artist Profile View | happy | Open `/artist/artist-1` | 200 OK, verified badge, monthly listeners, top 5 tracks | e2e | PASS |
| F06-H1 | Liked Songs Collection | happy | Open `/collection/tracks` | 200 OK, violet gradient hero, heart badge, saved tracks | e2e | PASS |
| DESIGN-H1 | Design System Showcase | happy | Open `/design` | 200 OK, token palette, WCAG ratios (0 AA failures), component states | e2e | PASS |
| PAY-H1 | Stripe Checkout Session | happy | `POST /api/checkout` | 200 OK, returns simulated/live Stripe Checkout session URL | e2e | PASS |
| WEBHOOK-H1 | Stripe Webhook Idempotency | happy | `POST /api/webhooks/stripe` with event payload twice | 200 OK on first call, 200 with `duplicate: true` on retry | e2e | PASS |
