'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { MediaCard } from '@/components/ui/MediaCard';
import { PlayButton } from '@/components/ui/PlayButton';
import { useAudio } from '@/context/AudioContext';
import {
  SEED_PLAYLISTS,
  SEED_ALBUMS,
  SEED_ARTISTS,
  SEED_TRACKS
} from '@/lib/seedData';
import { Heart } from 'lucide-react';

export default function HomePage() {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const [greeting, setGreeting] = React.useState('Good evening');

  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const quickItems = [
    {
      id: 'liked-songs',
      title: 'Liked Songs',
      href: '/collection/tracks',
      gradient: 'from-[#450af5] to-[#8e8ee5]',
      isLikedSongs: true,
      tracks: SEED_TRACKS.slice(0, 4),
    },
    {
      id: SEED_PLAYLISTS[0].id,
      title: SEED_PLAYLISTS[0].title,
      href: `/playlist/${SEED_PLAYLISTS[0].id}`,
      imageUrl: SEED_PLAYLISTS[0].coverUrl,
      tracks: SEED_PLAYLISTS[0].tracks,
    },
    {
      id: SEED_PLAYLISTS[1].id,
      title: SEED_PLAYLISTS[1].title,
      href: `/playlist/${SEED_PLAYLISTS[1].id}`,
      imageUrl: SEED_PLAYLISTS[1].coverUrl,
      tracks: SEED_PLAYLISTS[1].tracks,
    },
    {
      id: SEED_PLAYLISTS[2].id,
      title: SEED_PLAYLISTS[2].title,
      href: `/playlist/${SEED_PLAYLISTS[2].id}`,
      imageUrl: SEED_PLAYLISTS[2].coverUrl,
      tracks: SEED_PLAYLISTS[2].tracks,
    },
    {
      id: SEED_PLAYLISTS[3].id,
      title: SEED_PLAYLISTS[3].title,
      href: `/playlist/${SEED_PLAYLISTS[3].id}`,
      imageUrl: SEED_PLAYLISTS[3].coverUrl,
      tracks: SEED_PLAYLISTS[3].tracks,
    },
    {
      id: SEED_ALBUMS[0].id,
      title: SEED_ALBUMS[0].title,
      href: `/album/${SEED_ALBUMS[0].id}`,
      imageUrl: SEED_ALBUMS[0].coverUrl,
      tracks: [SEED_TRACKS[0], SEED_TRACKS[1], SEED_TRACKS[7]],
    },
  ];

  return (
    <div className="flex-1 flex flex-col pb-12">
      {/* Top Header */}
      <Header />

      <div className="px-6 space-y-8">
        {/* Time-of-day Greeting */}
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-5">
            {greeting}
          </h1>

          {/* Quick Play Grid (6 items) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickItems.map((item) => {
              const isPlayingItem = Boolean(
                item.tracks.length > 0 &&
                currentTrack &&
                item.tracks.some((t) => t.id === currentTrack.id) &&
                isPlaying
              );

              return (
                <div
                  key={item.id}
                  className="group relative flex items-center rounded-md bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-highlight)] transition-colors duration-200 overflow-hidden shadow-sm pr-4 cursor-pointer"
                >
                  <Link href={item.href} className="flex items-center gap-4 flex-1 min-w-0">
                    {item.isLikedSongs ? (
                      <div className="w-16 h-16 shrink-0 bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center text-white shadow">
                        <Heart size={24} fill="currentColor" />
                      </div>
                    ) : (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 shrink-0 object-cover shadow"
                      />
                    )}
                    <span className="font-bold text-sm text-white truncate pr-2">
                      {item.title}
                    </span>
                  </Link>

                  {/* Quick Play Trigger */}
                  <div
                    className={`shrink-0 transition-all duration-200 transform ${
                      isPlayingItem
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
                    }`}
                  >
                    <PlayButton
                      size="sm"
                      isPlaying={isPlayingItem}
                      onClick={() => {
                        if (isPlayingItem) {
                          togglePlay();
                        } else {
                          playTrack(item.tracks[0], item.tracks);
                        }
                      }}
                      ariaLabel={`Play ${item.title}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shelf 1: Made For You */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
              Made For You
            </h2>
            <span className="text-xs font-bold text-[var(--color-text-muted)] hover:underline cursor-pointer">
              Show all
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {SEED_PLAYLISTS.map((pl) => (
              <MediaCard
                key={pl.id}
                id={pl.id}
                title={pl.title}
                subtitle={pl.description}
                imageUrl={pl.coverUrl}
                href={`/playlist/${pl.id}`}
                type="playlist"
                tracks={pl.tracks}
              />
            ))}
          </div>
        </div>

        {/* Shelf 2: Featured Albums */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
              Popular Albums
            </h2>
            <span className="text-xs font-bold text-[var(--color-text-muted)] hover:underline cursor-pointer">
              Show all
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {SEED_ALBUMS.map((album) => {
              const albumTracks = SEED_TRACKS.filter((t) => t.albumId === album.id);
              return (
                <MediaCard
                  key={album.id}
                  id={album.id}
                  title={album.title}
                  subtitle={`${album.releaseYear} • ${album.artistName}`}
                  imageUrl={album.coverUrl}
                  href={`/album/${album.id}`}
                  type="album"
                  tracks={albumTracks}
                />
              );
            })}
          </div>
        </div>

        {/* Shelf 3: Popular Artists */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
              Popular Artists
            </h2>
            <span className="text-xs font-bold text-[var(--color-text-muted)] hover:underline cursor-pointer">
              Show all
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {SEED_ARTISTS.map((artist) => {
              const artistTracks = SEED_TRACKS.filter((t) => t.artistId === artist.id);
              return (
                <MediaCard
                  key={artist.id}
                  id={artist.id}
                  title={artist.name}
                  subtitle="Artist"
                  imageUrl={artist.imageUrl}
                  href={`/artist/${artist.id}`}
                  type="artist"
                  tracks={artistTracks}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
