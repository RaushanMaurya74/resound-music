# Component Specifications: Spotify Web Player Clone

Clean-room component specifications matching Spotify Encore interaction models, accessible keyboard/screen-reader patterns, and design tokens from `tokens.json`.

---

### 1. Button
- **variants:** `primary` (Spotify green pill), `secondary` (white pill, black text), `ghost` (transparent, white text hover), `danger` (red text/outline)
- **sizes:** `sm` (height 32px, text sm/500, px 16px), `md` (height 40px, text base/700, px 24px), `lg` (height 48px, text base/700, px 32px)
- **states:** default, hover (scale 1.04, brightness 1.08), active (scale 1.00), focus-visible (2px solid #ffffff, 2px offset), disabled (opacity 0.5, cursor not-allowed), loading (spinner with aria-busy)
- **tokens:** bg `accent`, text `on-accent`, radius `pill`, font `base/700`
- **a11y:** Native `<button type="button">`, visible focus ring with `focus-visible`, retains text label for screen readers
- **used on:** S01, S02, S03, S04, S05, S06, S07

---

### 2. PlayButton
- **variants:** `circular-floating` (48px green circle with black play icon, appears on card hover), `header-hero` (56px oversized green circle), `control-bar` (32px white circle in player bar)
- **sizes:** `sm` (32px), `md` (48px), `lg` (56px)
- **states:** default (play triangle icon), hover (scale 1.06, shadow-play), playing (two vertical pause bars), loading (spinner)
- **tokens:** bg `accent`, icon `on-accent`, shadow `play`, radius `pill`, transition `base`
- **a11y:** `aria-label="Play {title}"` or `"Pause {title}"`, accessible keyboard focus trigger via Space / Enter
- **used on:** S01, S02, S03, S04, S05, S06, S08

---

### 3. ScrubberSlider (Seek & Volume)
- **variants:** `seek` (audio timeline with time elapsed and remaining), `volume` (horizontal sound level)
- **sizes:** track height 4px (expands to 6px on hover), thumb diameter 12px circle
- **states:** default (gray bar with white progress fill), hover (green `#1db954` progress fill, white draggable thumb appears), dragging (clamped 0% to 100%, smooth tooltip preview)
- **tokens:** bg `surface-elevated`, progress `accent` (or white in default player state), thumb `text` (#ffffff), radius `pill`
- **a11y:** `role="slider"`, `aria-valuemin="0"`, `aria-valuemax="{duration}"`, `aria-valuenow="{progress}"`, ArrowLeft/ArrowRight steps (5s seek or 5% volume)
- **used on:** S08 (Persistent Player Dock)

---

### 4. TrackRow
- **variants:** `table` (index number, cover thumbnail, title + artist subtitle, album name, date added, duration), `compact` (album view without album column), `queue` (drag handle, cover, title, duration)
- **sizes:** height 56px (table), height 48px (compact)
- **states:** default (transparent bg), hover (bg `surface-highlight`, play icon replaces index number, heart & more icons appear), active/playing (title in `accent` green, animated audio equalizer bars), disabled
- **tokens:** text `text`, subtitle `text-muted`, hover-bg `surface-highlight`, radius `sm`
- **a11y:** `role="row"`, double-click to play, Enter key activates, heart button announces "Add {title} to Liked Songs"
- **used on:** S02, S03, S04, S05, S06, S09

---

### 5. MediaCard
- **variants:** `playlist` (rounded rectangle with cover art), `album` (square artwork with release year), `artist` (circular photo), `category` (colored rectangular tile with rotated cover corner)
- **sizes:** responsive grid columns (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`)
- **states:** default (bg `surface`, padding 16px, subtle radius), hover (bg `surface-elevated`, floating green PlayButton fades in and slides up 8px), focused
- **tokens:** bg `surface`, hover-bg `surface-elevated`, radius `md`, shadow `card`, transition `base`
- **a11y:** `<article>` or accessible link wrapper, `aria-label="{title} by {creator}"`
- **used on:** S01, S02, S05

---

### 6. SidebarNav & Library Rail
- **variants:** `expanded` (width 280px-360px resizable), `collapsed` (width 72px icon-only rail)
- **sizes:** top nav group (Home, Search), library group (Your Library header, "+" create button, scrollable playlists list)
- **states:** item default (text `text-muted`), item hover (text `text`, icon scale), item active (text `text`, bold weight, accent dot)
- **tokens:** bg `bg`, surface `surface`, text `text-muted`, active-text `text`, radius `md`
- **a11y:** `<nav aria-label="Main Navigation">`, `<nav aria-label="Your Library">`, keyboard arrow navigation
- **used on:** Persistent across all routes (S01 - S07)

---

### 7. SearchInput
- **variants:** `pill` (integrated search bar in header)
- **sizes:** height 48px, width 364px (desktop) or full width (mobile)
- **states:** default (bg `surface-elevated`, icon `text-muted`, placeholder `text-muted`), hover (border `border-input`), focused (outline 2px solid `#ffffff`, bg `#2a2a2a`), populated (shows clear `X` icon button)
- **tokens:** bg `surface-elevated`, text `text`, placeholder `text-muted`, radius `pill`, border `border-input`
- **a11y:** `<input type="search" aria-label="What do you want to play?">`, Esc clears query
- **used on:** S02 (Search page)

---

### 8. FilterPill
- **variants:** `category` (All, Music, Podcasts, Playlists, Artists, Albums)
- **sizes:** height 32px, padding horizontal 12px
- **states:** unselected (bg `surface-elevated`, text `text`, hover bg `#2a2a2a`), selected (bg `text` white, text `on-accent` black)
- **tokens:** radius `pill`, font `sm/500`, motion `fast`
- **a11y:** `role="tab"` or `aria-pressed="true|false"`
- **used on:** S02, S07

---

### 9. VolumeControl
- **variants:** `dock` (speaker icon + 96px horizontal slider)
- **sizes:** icon 20px, slider length 96px
- **states:** muted (speaker with slash, volume 0%), low (1-33%), medium (34-66%), high (67-100%), slider hover (thumb appears)
- **tokens:** icon `text-muted` (hover `text`), progress `text` (hover `accent`), track `border`
- **a11y:** Click icon to mute/restore previous volume; `role="slider" aria-label="Volume"`
- **used on:** S08 (Persistent Player Dock)

---

### 10. QueuePanel & LyricsDrawer
- **variants:** `right-dock` (slide-out right side drawer 360px), `full-overlay` (lyrics karaoke screen)
- **states:** closed, open (slides in with `motion-ease`), populated list, empty queue
- **tokens:** bg `surface`, border-left `border`, text `text`, font `base`
- **a11y:** `aria-expanded="true"`, focus trapped inside modal or accessible dismiss via Esc key
- **used on:** S08, S09, S10
