'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { TrackRow } from '@/components/ui/TrackRow';
import { PlayButton } from '@/components/ui/PlayButton';
import { useAudio } from '@/context/AudioContext';
import { SEED_ALBUMS, SEED_TRACKS } from '@/lib/seedData';
import { Clock, Heart, MoreHorizontal } from 'lucide-react';

interface AlbumViewProps {
  id: string;
}

export function AlbumView({ id }: AlbumViewProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const album = SEED_ALBUMS.find((a) => a.id === id);

  if (!album) {
    return notFound();
  }

  const tracks = SEED_TRACKS.filter((t) => t.albumId === album.id);

  const isAlbumPlaying = Boolean(
    tracks.length > 0 &&
    currentTrack &&
    tracks.some((t) => t.id === currentTrack.id) &&
    isPlaying
  );

  const totalDurationMs = tracks.reduce((acc, t) => acc + t.durationMs, 0);
  const totalMinutes = Math.floor(totalDurationMs / 60000);

  const handlePlayAll = () => {
    if (tracks.length === 0) return;
    if (currentTrack && tracks.some((t) => t.id === currentTrack.id)) {
      togglePlay();
    } else {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header />

      {/* Hero Header */}
      <div className="relative px-8 pt-6 pb-8 bg-gradient-to-b from-[#2d4059] via-[#1b263b] to-[var(--color-surface)] flex flex-col md:flex-row items-start md:items-end gap-6 shadow-inner">
        <img
          src={album.coverUrl}
          alt={album.title}
          className="w-48 h-48 sm:w-56 sm:h-56 rounded-md object-cover shadow-2xl shrink-0"
        />

        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs uppercase font-extrabold text-white tracking-wider">
            Album
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight my-2 drop-shadow-md">
            {album.title}
          </h1>

          <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
            <Link
              href={`/artist/${album.artistId}`}
              className="font-bold hover:underline"
            >
              {album.artistName}
            </Link>
            <span>•</span>
            <span>{album.releaseYear}</span>
            <span>•</span>
            <span>
              {tracks.length} {tracks.length === 1 ? 'song' : 'songs'}
            </span>
            {tracks.length > 0 && (
              <>
                <span>•</span>
                <span className="text-[var(--color-text-muted)]">about {totalMinutes} min</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="px-8 py-6 flex items-center gap-6 select-none">
        {tracks.length > 0 && (
          <PlayButton
            size="lg"
            isPlaying={isAlbumPlaying}
            onClick={handlePlayAll}
            ariaLabel={`Play ${album.title}`}
          />
        )}
        <button
          type="button"
          aria-label="Save to Your Library"
          className="text-[var(--color-text-muted)] hover:text-white transition-colors"
        >
          <Heart size={32} />
        </button>
        <button
          type="button"
          aria-label="More options"
          className="text-[var(--color-text-muted)] hover:text-white transition-colors"
        >
          <MoreHorizontal size={28} />
        </button>
      </div>

      {/* Track List */}
      <div className="px-8">
        <div className="grid grid-cols-[auto_1fr_auto] items-center px-4 py-2 border-b border-white/10 text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider mb-2">
          <span className="w-8 text-center">#</span>
          <span className="pl-4">Title</span>
          <div className="flex justify-end pr-8">
            <Clock size={16} />
          </div>
        </div>

        <div className="space-y-0.5">
          {tracks.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              playlistContext={tracks}
              showAlbum={false}
              showCover={false}
            />
          ))}
        </div>

        {/* Release & Copyright Footer */}
        <div className="mt-8 text-xs text-[var(--color-text-subtle)] space-y-1">
          <p>© {album.releaseYear} {album.artistName} Records</p>
          <p>℗ {album.releaseYear} Distributed by Universal Music Group</p>
        </div>
      </div>
    </div>
  );
}
