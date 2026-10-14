# Architecture: Spotify Web Player Clone (Rebuild of Spotify Core Features)

## Stack

| layer | choice | why |
| --- | --- | --- |
| web | Next.js (App Router) + React 19 + TypeScript | File-based layout nesting keeps persistent audio player mounted while page content routes dynamically without audio interruption. |
| state management | Zustand / React Context | Lightweight, subscription-based reactive state for continuous audio playback, queue ordering, and volume level. |
| styling | Tailwind CSS + Spotify Encore Design Tokens | Exact Spotify `#1DB954` green, `#121212` canvas dark palette, `#181818` card surfaces, and circular button radius. |
| audio engine | Native HTML5 Audio API + MediaSession API | Universal cross-browser audio playback, OS media key integration (lock screen, keyboard shortcuts), and accurate buffering. |
| database | PostgreSQL on Supabase (or Neon) | Battle-tested relational data store with built-in Row Level Security (RLS) and real-time client subscriptions. |
| ORM | Drizzle ORM | Zero-cost TypeScript-native query builder with exact SQL parity and instant migration generation. |
| auth | Supabase Auth (SSR Cookie Auth) | Seamless JWT authentication with row-level security tokens for user playlists and liked songs. |
| storage / cdn | Supabase Storage / Cloudflare R2 | High-throughput CDN hosting for high-resolution album artwork, artist banners, and audio preview clips. |
| hosting | Vercel | Instant global edge CDN distribution with zero server configuration for Next.js App Router. |

## Schema

Tables: 9 (`users`, `artists`, `albums`, `tracks`, `track_artists`, `playlists`, `playlist_tracks`, `liked_tracks`, `play_history`).  
Access rules: PostgreSQL Row Level Security (RLS) enabled on all tables (see [replica/schema.sql](file:///e:/PROJECTS/music/replica/schema.sql)).

```sql
-- Schema summary (see replica/schema.sql for complete DDL & RLS policies)
-- users (id, email, display_name, avatar_url, product, created_at, updated_at)
-- artists (id, name, bio, image_url, banner_url, verified, monthly_listeners)
-- albums (id, title, artist_id, release_year, cover_url, genre, total_tracks)
-- tracks (id, title, album_id, duration_ms, audio_url, cover_url, track_number, explicit, play_count)
-- track_artists (track_id, artist_id, is_primary)
-- playlists (id, owner_id, title, description, cover_url, is_public, created_at, updated_at)
-- playlist_tracks (id, playlist_id, track_id, position, added_by, added_at)
-- liked_tracks (user_id, track_id, created_at)
-- play_history (id, user_id, track_id, played_at, completed)
```

## API

| method path | does | who | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `GET /api/feed` | Returns greeting, recent 6 items, and featured shelf collections | Public / User | `?limit=6` | `{ greeting, recents, shelves }` | F01 |
| `GET /api/search` | Full-text live search across tracks, artists, albums, and playlists | Public | `?q=...&type=...` | `{ topResult, tracks, artists, albums, playlists }` | F02 |
| `GET /api/tracks/:id` | Returns single track details, artists, audio stream URL | Public | `id` in path | `Track` object with artist info | F01, F02 |
| `GET /api/albums/:id` | Returns album metadata and ordered track list | Public | `id` in path | `Album` with tracks array | F01 |
| `GET /api/artists/:id` | Returns artist profile, top 5 popular tracks, and discography | Public | `id` in path | `Artist` with topTracks and albums | F02 |
| `GET /api/playlists` | Returns user's created and followed playlists | Authenticated User | Session cookie | Array of `Playlist` cards | F03 |
| `GET /api/playlists/:id` | Returns playlist header, owner, and ordered track items | Public / Owner | `id` in path | `Playlist` with ordered `tracks` | F03 |
| `POST /api/playlists` | Creates a new empty playlist | Authenticated User | `{ title, description }` | Created `Playlist` object | F03 |
| `POST /api/playlists/:id/tracks` | Adds a track to the end of a playlist | Playlist Owner | `{ trackId }` | Updated `playlist_tracks` entry | F03 |
| `DELETE /api/playlists/:id/tracks/:trackId` | Removes a track from a playlist | Playlist Owner | `trackId` in path | `{ success: true }` | F03 |
| `GET /api/me/likes` | Returns all tracks liked by current user | Authenticated User | Session cookie | Array of `Track` objects | F06 |
| `POST /api/me/likes/:trackId` | Adds track to Liked Songs | Authenticated User | `trackId` in path | `{ liked: true }` | F06 |
| `DELETE /api/me/likes/:trackId` | Removes track from Liked Songs | Authenticated User | `trackId` in path | `{ liked: false }` | F06 |
| `POST /api/tracks/:id/play` | Increments play count and logs to play history | Public / User | `id` in path | `{ success: true }` | F01, F04 |

Webhooks in: None (no third-party external payment webhooks required for core slice).  
Jobs: Daily listener count aggregation and play history cleanup.

## The parts that bite

- **Persistent audio engine across route navigation:** In Next.js App Router, placing the `<AudioPlayer />` provider inside the root `layout.tsx` outside of the page `{children}` prevents the HTML5 `<audio>` element from re-mounting on route changes, ensuring uninterrupted sound playback.
- **Scrubber scrubbing & seek lag:** Rapid dragging of the seek slider can cause jitter if audio `currentTime` is updated synchronously on every pixel movement. Solution: decouple UI scrubber progress state from actual `<audio>` seek until `onPointerUp` or throttled at 60ms.
- **Race conditions in Queue and Next/Prev:** Rapid clicking on Next/Previous track buttons can trigger out-of-order audio fetch responses. Solution: maintain an active playback task abort controller to cancel stale audio loads before starting a new track.
- **Optimistic UI for Like toggles:** Heart icon clicks must update immediately in local state with an optimistic toggle, then sync with `/api/me/likes/:id` in the background, reverting with a notification toast if the network request fails.
- **Dominant Color Extraction:** Dynamic header backdrops must extract dominant colors from album art via an off-screen HTML Canvas or precomputed color palette without blocking the main rendering thread.

## Build order

### Milestone 1: Vertical Slice (The Core Loop)
- **Goal:** Launch the core loop end-to-end: render the app shell, load sample tracks into the persistent bottom player, and achieve continuous audio playback with play/pause and scrubber.
- **Screens:** S08 (Persistent Audio Player), S01 (Mini Home Feed with quick play cards).
- **Tables:** `tracks`, `artists`, `albums`.
- **Routes:** `GET /api/feed`, `GET /api/tracks/:id`.

### Milestone 2: Must-Haves (Search, Playlists, Library, Likes)
- **Goal:** Enable music discovery, full-text search, custom playlist curation, and favorite song collection.
- **Screens:** S02 (Search & Explore with genre tiles), S03 (Playlist View with track table), S06 (Liked Songs), S07 (Library Sidebar).
- **Tables:** `playlists`, `playlist_tracks`, `liked_tracks`, `users`.
- **Routes:** `GET /api/search`, `GET /api/playlists/:id`, `POST /api/playlists`, `POST /api/playlists/:id/tracks`, `GET /api/me/likes`, `POST /api/me/likes/:id`.

### Milestone 3: Should-Haves (Albums, Artist Profiles, Queue Management)
- **Goal:** Rich album detail pages, verified artist discography, and active queue inspection/reordering.
- **Screens:** S04 (Album View), S05 (Artist Profile with top 5 and banner), S09 (Queue Drawer).
- **Tables:** `track_artists`, `play_history`.
- **Routes:** `GET /api/albums/:id`, `GET /api/artists/:id`.

### Milestone 4: Polish & Fixes (Lyrics, Shortcuts, Aesthetics)
- **Goal:** Dynamic artwork-derived gradient headers, synchronized lyrics panel (S10), keyboard media controls, responsive mobile navigation bar, and volume mute state management.
