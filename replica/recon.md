# Recon map: Spotify Web Player (Web)

Scope: Core Web Streaming Slice (Home Feed, Search & Explore, Playlists & Albums, Artist Profiles, Liked Songs, Persistent Audio Player & Queue)  
For: Portfolio showcase & interactive web music player using playable preview/open audio streams with Spotify's signature UI/UX patterns  
Date: 2026-10-15  

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | Spotify Web Player | https://open.spotify.com/ | Live web application UX, layout, player dock, and navigation patterns |
| 2 | Spotify Web API Reference | https://developer.spotify.com/documentation/web-api | Public schema for Tracks, Albums, Artists, Playlists, Search, and Player state |
| 3 | Spotify Design (Encore) | https://spotify.design/ | Design language, typography, color semantics, and design tokens |
| 4 | Spotify Help Center | https://support.spotify.com/ | Feature specifications for Playlists, Liked Songs, Queue, and Shuffle/Repeat |

## Core loop

Users discover or search for music, hit play, and enjoy seamless continuous playback via a persistent bottom dock while freely exploring playlists, artists, albums, and their personal library.

## Screens

| ID | screen | route / how to reach | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| S01 | Home / Feed | `/` (nav sidebar Home click) | Personalized gateway with greeting, quick-access recents, and curated shelves | QuickPlayGrid, ShelfCarousel, MediaCard, HeaderBar | loading skeleton, populated, empty recents |
| S02 | Search & Explore | `/search` (nav sidebar Search click) | Category discovery when empty, instant filtered results as user types | SearchInput, CategoryTileGrid, TopResultCard, TrackTable, FilterPills | empty query (browse cards), searching, populated results, no results found |
| S03 | Playlist View | `/playlist/:id` (click any playlist card) | View playlist header details, dominant color backdrop, play entire list, manage tracks | HeroHeader, ActionRow (Play, Like, More), TrackTable, DominantColorGradient | loading, populated with tracks, empty playlist (add songs prompt) |
| S04 | Album View | `/album/:id` (click any album card) | View album metadata, tracklist with track numbering, artist credits | AlbumHeader, TrackTable (compact), ArtistChip | loading, populated |
| S05 | Artist Profile | `/artist/:id` (click artist name/card) | Artist hero with verified badge, monthly listeners, top 5 popular tracks, discography | VerifiedBadge, HeroBanner, TopTracksTable, DiscographyGrid, AboutCard | loading, populated |
| S06 | Liked Songs | `/collection/tracks` (sidebar Liked Songs click) | Dedicated collection of all user-favorited tracks | GradientHeader (Heart), TrackTable with DateAdded column, PlayAllButton | empty (prompt to like songs), populated |
| S07 | Your Library (Sidebar) | Persistent left rail (expandable) | Quick access to saved playlists, followed artists, and custom created playlists | LibraryHeader, FilterPills, SearchLibraryInput, LibraryListItem | expanded, collapsed, empty library |
| S08 | Persistent Audio Player | Fixed bottom viewport dock (all routes) | Continuous audio playback engine, scrubber, controls, and volume slider | TrackThumbnail, TrackInfo, PlayPauseButton, ScrubberSlider, VolumeSlider, ModeToggles | idle/empty, playing, paused, buffering/loading, muted |
| S09 | Queue Drawer / Panel | Click Queue icon in player bar | Inspect current track and upcoming song queue; reorder or skip tracks | NowPlayingCard, UpNextList, QueueItemRow, ClearQueueButton | queue empty, populated queue |
| S10 | Now Playing & Lyrics View | Click lyrics / expand icon in player bar | Immersive side panel or full-bleed backdrop with synchronized scrolling lyrics and artist bio | LyricsContainer, SyncedLine, ArtistMiniBio | lyrics loading, lyrics active, lyrics unavailable fallback |

## Flows

```
F01 Quick Discovery to Audio Playback
    S01 Home -> hover MediaCard -> click green Play button -> S08 Player Bar activates
    happy path clicks: 1
    edge: audio stream fails to load (fallback to preview stream / notify user), previous track pauses seamlessly

F02 Search, Filter, and Play
    S02 Search -> type query in SearchInput -> click Top Result or TrackRow play -> S08 Player Bar plays track
    happy path clicks: 2 (type + click play)
    edge: query has no exact match (suggest nearest genre or popular tracks)

F03 Create and Curate Playlist
    S07 Sidebar -> click "+" (Create Playlist) -> S03 Playlist View (empty) -> click edit title/desc -> search and add track from recommendations
    happy path clicks: 4
    edge: empty playlist title defaults to "My Playlist #N", duplicate track warning

F04 Continuous Playback Control & Scrubbing
    S08 Player Bar -> click pause/resume -> drag ScrubberSlider to 01:45 -> adjust VolumeSlider -> toggle Shuffle & Repeat
    happy path clicks: 1 per control
    edge: rapid scrubbing throttle, volume zero triggers muted icon state

F05 Up-Next Queue Management
    S08 Player Bar -> click Queue icon -> S09 Queue Drawer opens -> click any upcoming track to jump immediately -> remove unwanted track
    happy path clicks: 2
    edge: last track in queue reached (loop back if repeat on, or auto-play related recommendations)

F06 Liking a Track & Library Sync
    S08 Player Bar or S03/S02 TrackRow -> click Heart icon -> track instantly added to S06 Liked Songs -> badge counter increments
    happy path clicks: 1
    edge: unliking removes row with undo toast or optimistic update
```

## Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| Button | primary (Spotify green #1DB954), secondary (white pill), ghost, icon-only | default, hover (scale 1.04), active, disabled, loading | all screens |
| PlayButton | circular green with black triangle, small (card hover), large (header) | default, hover, playing (pause icon), loading spinner | S01, S02, S03, S04, S05, S06, S08 |
| ScrubberSlider | audio seek bar, volume level bar | default (gray bar with white progress), hover (green progress + draggable thumb), dragging | S08 Player Bar |
| TrackRow | standard (index, title+artist, album, duration), compact (album view without album column), queue item | default, hover (play icon replaces index, heart & menu appear), active/playing (green title + animated equalizer), disabled | S02, S03, S04, S05, S06, S09 |
| MediaCard | playlist card, album card, artist card (circular image), category card (tilted image) | default, hover (elevation + floating green play button fade-in) | S01, S02, S05 |
| SidebarNav | desktop left sidebar (collapsed icon mode or full expanded panel) | active tab highlight, hover item, scrollable library container | persistent across S01 - S07 |
| SearchInput | pill input with magnifying glass icon and clear `X` button | empty, typing, focused with white outline | S02 |
| FilterPill | rounded pill filter (All, Music, Podcasts, Artists, Albums, Playlists) | unselected (dark gray), selected (white text/green background) | S02, S07 |
| VolumeControl | mute/unmute speaker icon + horizontal volume slider bar | muted (speaker with slash), low (<33%), medium (<66%), high (>66%) | S08 |
| ContextMenu | dropdown options (Add to queue, Add to playlist, Remove, Copy link) | closed, open, item hover | S02, S03, S04, S06, S09 |

## Inferred data model

```
Track
    id: string
    title: string
    artist_ids: string[]
    album_id: string
    duration_ms: number
    audio_url: string (direct audio stream / 30s preview)
    cover_url: string
    track_number: number
    explicit: boolean
    evidence: Spotify Web API /v1/tracks/{id}, S03 TrackTable, S08 Player Bar
    confidence: high

Album
    id: string
    title: string
    artist_ids: string[]
    release_year: number
    cover_url: string
    total_tracks: number
    genre: string
    evidence: Spotify Web API /v1/albums/{id}, S04 Album View
    confidence: high

Artist
    id: string
    name: string
    bio: string
    image_url: string
    monthly_listeners: number
    verified: boolean
    evidence: Spotify Web API /v1/artists/{id}, S05 Artist Profile
    confidence: high

Playlist
    id: string
    title: string
    description: string
    cover_url: string
    created_by: string
    is_public: boolean
    track_ids: string[]
    created_at: timestamp
    evidence: Spotify Web API /v1/playlists/{id}, S03 Playlist View
    confidence: high

LikedTrack
    user_id: string
    track_id: string
    added_at: timestamp
    evidence: Spotify Web API /v1/me/tracks, S06 Liked Songs
    confidence: high

PlaybackState
    current_track_id: string | null
    is_playing: boolean
    progress_ms: number
    duration_ms: number
    volume: number (0 - 1)
    is_muted: boolean
    is_shuffle: boolean
    repeat_mode: 'off' | 'all' | 'one'
    queue: string[] (track IDs)
    history: string[] (track IDs)
    evidence: Spotify Web API /v1/me/player, S08 Player Dock, S09 Queue Panel
    confidence: high
```

Relationships:
- Artist (1) ────< (N) Album
- Artist (M) ────< (N) Track
- Album (1) ─────< (N) Track
- User (1) ──────< (N) Playlist
- Playlist (M) ──< (N) Track (ordered with position)
- User (1) ──────< (N) LikedTrack (references Track)
- PlaybackState references Track (current) and ordered Track queue

## Feature matrix

See `replica/features.csv`.
- Must: 15
- Should: 8
- Could: 5
- Skip: 4

## Out of scope (cannot or should not be cloned)

- **Spotify DRM Widevine Encrypted Catalog**: Spotify's commercial DRM catalog requires licensed decryption keys; the clone uses open/preview audio streams (Jamendo / Audius / royalty-free stream APIs) while maintaining Spotify's exact player interface and track metadata.
- **Proprietary ML Recommendation Weights**: Spotify's Discover Weekly & algorithmic playlist generation relies on billions of closed listening graphs; the clone uses genre/artist-based similarity matching.
- **Spotify Connect Hardware Protocol**: Proprietary hardware pairing (Sonos, PlayStation, car integrations) requires proprietary Spotify device firmware certificates.
- **Private Spotify Friend Network**: Real-time friend activity requires private Spotify user graphs and presence sockets.

## Size

- Screens: 10
- Flows: 6
- Entities: 6
- Hard parts:
  1. Persistent audio playback engine & state persistence across seamless client-side page routing without audio glitches or reloading.
  2. Sub-millisecond scrubber sync, seek precision, and volume control state machine.
  3. Dynamic backdrop gradient calculation extracting dominant color from current album/playlist artwork.
- Size: **M (Structured vertical-slice build)**
