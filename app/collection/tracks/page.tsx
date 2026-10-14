'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { TrackRow } from '@/components/ui/TrackRow';
import { PlayButton } from '@/components/ui/PlayButton';
import { useAudio } from '@/context/AudioContext';
import { SEED_TRACKS } from '@/lib/seedData';
import { Heart, Clock, Music } from 'lucide-react';

export default function LikedSongsPage() {
  const { likedTrackIds, currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const likedTracks = SEED_TRACKS.filter((t) => likedTrackIds.has(t.id));

  const isLikedPlaying = Boolean(
    likedTracks.length > 0 &&
    currentTrack &&
    likedTracks.some((t) => t.id === currentTrack.id) &&
    isPlaying
  );

  const totalDurationMs = likedTracks.reduce((acc, t) => acc + t.durationMs, 0);
  const totalMinutes = Math.floor(totalDurationMs / 60000);

  const handlePlayAll = () => {
    if (likedTracks.length === 0) return;
    if (currentTrack && likedTracks.some((t) => t.id === currentTrack.id)) {
      togglePlay();
    } else {
      playTrack(likedTracks[0], likedTracks);
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header />

      {/* Hero Header: Purple / Violet Gradient */}
      <div className="relative px-8 pt-6 pb-8 bg-gradient-to-b from-[#503b87] via-[#2f2052] to-[var(--color-surface)] flex flex-col md:flex-row items-start md:items-end gap-6 shadow-inner select-none">
        {/* Heart Icon Box */}
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-md bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center text-white shadow-2xl shrink-0">
          <Heart size={88} fill="currentColor" />
        </div>

        {/* Info */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs uppercase font-extrabold text-white tracking-wider">
            Playlist
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white tracking-tight my-2 drop-shadow-md">
            Liked Songs
          </h1>

          <div className="flex items-center gap-2 text-xs font-semibold text-white/90 mt-1">
            <span>You</span>
            <span>•</span>
            <span>
              {likedTracks.length} {likedTracks.length === 1 ? 'song' : 'songs'}
            </span>
            {likedTracks.length > 0 && (
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
        {likedTracks.length > 0 && (
          <PlayButton
            size="lg"
            isPlaying={isLikedPlaying}
            onClick={handlePlayAll}
            ariaLabel="Play all liked songs"
          />
        )}
      </div>

      {/* Track List */}
      <div className="px-8">
        {likedTracks.length > 0 ? (
          <div>
            <div className="grid grid-cols-[auto_1fr_1fr_auto] items-center px-4 py-2 border-b border-white/10 text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider mb-2">
              <span className="w-8 text-center">#</span>
              <span className="pl-4">Title</span>
              <span className="hidden md:block">Album</span>
              <div className="flex justify-end pr-8">
                <Clock size={16} />
              </div>
            </div>

            <div className="space-y-0.5">
              {likedTracks.map((track, idx) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={idx}
                  playlistContext={likedTracks}
                  showAlbum={true}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Empty Liked Songs State */
          <div className="py-20 text-center max-w-md mx-auto">
            <Heart size={56} className="mx-auto text-[var(--color-text-muted)] mb-4" />
            <h2 className="text-2xl font-bold text-white">Songs you like will appear here</h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              Save songs by tapping the heart icon anywhere in the app to listen to your favorites in one place.
            </p>
            <Link
              href="/search"
              className="inline-block mt-6 px-6 py-3 rounded-full bg-white hover:scale-105 text-black font-bold text-xs uppercase tracking-wider transition-transform"
            >
              Find songs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
