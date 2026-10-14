-- =====================================================================
-- Spotify Web Player Clone - Production PostgreSQL Schema
-- Database: PostgreSQL 15+ (Compatible with Supabase / Neon)
-- Access Model: Row Level Security (RLS) enabled
-- =====================================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- 1. Users Table (Core account profile)
-- ---------------------------------------------------------------------
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  display_name text not null,
  avatar_url text,
  product text not null default 'free' check (product in ('free', 'premium')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2. Artists Table
-- ---------------------------------------------------------------------
create table if not exists artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text,
  image_url text,
  banner_url text,
  verified boolean not null default false,
  monthly_listeners bigint not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_artists_name on artists using gin (to_tsvector('english', name));

-- ---------------------------------------------------------------------
-- 3. Albums Table
-- ---------------------------------------------------------------------
create table if not exists albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist_id uuid not null references artists(id) on delete cascade,
  release_year integer not null check (release_year >= 1900 and release_year <= 2100),
  cover_url text not null,
  genre text,
  total_tracks integer not null default 0 check (total_tracks >= 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_albums_artist_id on albums(artist_id);
create index if not exists idx_albums_title on albums using gin (to_tsvector('english', title));

-- ---------------------------------------------------------------------
-- 4. Tracks Table
-- ---------------------------------------------------------------------
create table if not exists tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  album_id uuid not null references albums(id) on delete cascade,
  duration_ms integer not null check (duration_ms > 0),
  audio_url text not null,
  cover_url text not null,
  track_number integer not null default 1 check (track_number >= 1),
  explicit boolean not null default false,
  play_count bigint not null default 0 check (play_count >= 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_tracks_album_id on tracks(album_id);
create index if not exists idx_tracks_title on tracks using gin (to_tsvector('english', title));

-- ---------------------------------------------------------------------
-- 5. Track Artists (M-to-N join for multi-artist credits & features)
-- ---------------------------------------------------------------------
create table if not exists track_artists (
  track_id uuid not null references tracks(id) on delete cascade,
  artist_id uuid not null references artists(id) on delete cascade,
  is_primary boolean not null default true,
  primary key (track_id, artist_id)
);

create index if not exists idx_track_artists_artist on track_artists(artist_id);

-- ---------------------------------------------------------------------
-- 6. Playlists Table (User-created and curated playlists)
-- ---------------------------------------------------------------------
create table if not exists playlists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  title text not null,
  description text,
  cover_url text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_playlists_owner on playlists(owner_id);
create index if not exists idx_playlists_title on playlists using gin (to_tsvector('english', title));

-- ---------------------------------------------------------------------
-- 7. Playlist Tracks (Ordered track relationship)
-- ---------------------------------------------------------------------
create table if not exists playlist_tracks (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid not null references playlists(id) on delete cascade,
  track_id uuid not null references tracks(id) on delete cascade,
  position integer not null check (position >= 0),
  added_by uuid not null references users(id) on delete cascade,
  added_at timestamptz not null default now(),
  constraint uq_playlist_track_pos unique (playlist_id, position)
);

create index if not exists idx_playlist_tracks_playlist on playlist_tracks(playlist_id, position);
create index if not exists idx_playlist_tracks_track on playlist_tracks(track_id);

-- ---------------------------------------------------------------------
-- 8. Liked Tracks (User favorite songs)
-- ---------------------------------------------------------------------
create table if not exists liked_tracks (
  user_id uuid not null references users(id) on delete cascade,
  track_id uuid not null references tracks(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, track_id)
);

create index if not exists idx_liked_tracks_user on liked_tracks(user_id, created_at desc);

-- ---------------------------------------------------------------------
-- 9. Play History (Recents feed & user listening statistics)
-- ---------------------------------------------------------------------
create table if not exists play_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  track_id uuid not null references tracks(id) on delete cascade,
  played_at timestamptz not null default now(),
  completed boolean not null default false
);

create index if not exists idx_play_history_user on play_history(user_id, played_at desc);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

alter table users enable row level security;
alter table artists enable row level security;
alter table albums enable row level security;
alter table tracks enable row level security;
alter table track_artists enable row level security;
alter table playlists enable row level security;
alter table playlist_tracks enable row level security;
alter table liked_tracks enable row level security;
alter table play_history enable row level security;

-- Public Catalog Read Access (Everyone can read artists, albums, tracks)
create policy "Artists are viewable by everyone" on artists for select using (true);
create policy "Albums are viewable by everyone" on albums for select using (true);
create policy "Tracks are viewable by everyone" on tracks for select using (true);
create policy "Track artists are viewable by everyone" on track_artists for select using (true);

-- User Profiles
create policy "Users can view all public profiles" on users for select using (true);
create policy "Users can update own profile" on users for update using (auth.uid() = id);

-- Playlists: Public ones are readable by anyone; private only by owner
create policy "Public playlists viewable by all" on playlists for select using (is_public or auth.uid() = owner_id);
create policy "Users can create playlists" on playlists for insert with check (auth.uid() = owner_id);
create policy "Users can update own playlists" on playlists for update using (auth.uid() = owner_id);
create policy "Users can delete own playlists" on playlists for delete using (auth.uid() = owner_id);

-- Playlist Tracks: Can view if parent playlist is viewable; modify if owner of playlist
create policy "Playlist tracks viewable if playlist viewable" on playlist_tracks for select using (
  exists (select 1 from playlists p where p.id = playlist_id and (p.is_public or p.owner_id = auth.uid()))
);
create policy "Playlist owner can manage playlist tracks" on playlist_tracks for all using (
  exists (select 1 from playlists p where p.id = playlist_id and p.owner_id = auth.uid())
);

-- Liked Tracks: Users can only view, insert, and delete their own liked tracks
create policy "Users view own likes" on liked_tracks for select using (auth.uid() = user_id);
create policy "Users add own likes" on liked_tracks for insert with check (auth.uid() = user_id);
create policy "Users remove own likes" on liked_tracks for delete using (auth.uid() = user_id);

-- Play History: Users view and record their own plays
create policy "Users view own history" on play_history for select using (auth.uid() = user_id);
create policy "Users record own history" on play_history for insert with check (auth.uid() = user_id);
