'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { TrackRow } from '@/components/ui/TrackRow';
import { PlayButton } from '@/components/ui/PlayButton';
import { useAudio } from '@/context/AudioContext';
import { SEED_TRACKS } from '@/lib/seedData';
import { Clock, Heart, MoreHorizontal, Music } from 'lucide-react';

interface PlaylistViewProps {
  id: string;
}

export function PlaylistView({ id }: PlaylistViewProps) {
  const { userPlaylists, currentTrack, isPlaying, playTrack, togglePlay, addTrackToPlaylist } = useAudio();

  const playlist = userPlaylists.find((p) => p.id === id);

  if (!playlist) {
    return notFound();
  }

  const isPlaylistPlaying = Boolean(
    playlist.tracks.length > 0 &&
    currentTrack &&
    playlist.tracks.some((t) => t.id === currentTrack.id) &&
    isPlaying
  );

  const totalDurationMs = playlist.tracks.reduce((acc, t) => acc + t.durationMs, 0);
  const totalMinutes = Math.floor(totalDurationMs / 60000);

  const handlePlayAll = () => {
    if (playlist.tracks.length === 0) return;
    if (currentTrack && playlist.tracks.some((t) => t.id === currentTrack.id)) {
      togglePlay();
    } else {
      playTrack(playlist.tracks[0], playlist.tracks);
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header />

      {/* Hero Header with Dynamic Gradient */}
      <div className="relative px-8 pt-6 pb-8 bg-gradient-to-b from-[#503750] via-[#241a24] to-[var(--color-surface)] flex flex-col md:flex-row items-start md:items-end gap-6 shadow-inner">
        {/* Cover Artwork */}
        <img
          src={playlist.coverUrl}
          alt={playlist.title}
          className="w-48 h-48 sm:w-56 sm:h-56 rounded-md object-cover shadow-2xl shrink-0"
        />

        {/* Playlist Info */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs uppercase font-extrabold text-white tracking-wider">
            Playlist
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight my-2 drop-shadow-md break-words">
            {playlist.title}
          </h1>
          {playlist.description && (
            <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-3">
              {playlist.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
            <span className="hover:underline cursor-pointer">{playlist.createdBy}</span>
            <span>•</span>
            <span>
              {playlist.tracks.length} {playlist.tracks.length === 1 ? 'song' : 'songs'}
            </span>
            {playlist.tracks.length > 0 && (
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
        {playlist.tracks.length > 0 && (
          <PlayButton
            size="lg"
            isPlaying={isPlaylistPlaying}
            onClick={handlePlayAll}
            ariaLabel={`Play ${playlist.title}`}
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

      {/* Tracks Table */}
      <div className="px-8">
        {playlist.tracks.length > 0 ? (
          <div>
            {/* Table Header */}
            <div className="grid grid-cols-[auto_1fr_1fr_auto] items-center px-4 py-2 border-b border-white/10 text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider mb-2">
              <span className="w-8 text-center">#</span>
              <span className="pl-4">Title</span>
              <span className="hidden md:block">Album</span>
              <div className="flex justify-end pr-8">
                <Clock size={16} />
              </div>
            </div>

            {/* Rows */}
            <div className="space-y-0.5">
              {playlist.tracks.map((track, idx) => (
                <TrackRow
                  key={`${track.id}-${idx}`}
                  track={track}
                  index={idx}
                  playlistContext={playlist.tracks}
                  showAlbum={true}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Empty Playlist State */
          <div className="py-12 border-t border-white/10">
            <div className="text-center max-w-md mx-auto mb-8">
              <Music size={48} className="mx-auto text-[var(--color-text-muted)] mb-3" />
              <h2 className="text-xl font-bold text-white">Let's find something for your playlist</h2>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Add recommended songs below to get your playlist started.
              </p>
            </div>

            <div className="space-y-1">
              {SEED_TRACKS.slice(0, 4).map((recTrack) => (
                <div
                  key={recTrack.id}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-[var(--color-surface-elevated)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={recTrack.coverUrl}
                      alt={recTrack.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{recTrack.title}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{recTrack.artistName}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => addTrackToPlaylist(playlist.id, recTrack)}
                    className="px-4 py-1.5 rounded-full border border-[var(--color-border-input)] hover:border-white text-xs font-bold text-white hover:scale-105 transition-all"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
