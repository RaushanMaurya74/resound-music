'use client';

import React, { useState } from 'react';
import { Track } from '@/types/music';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, Heart, MoreHorizontal, Check, Plus } from 'lucide-react';

interface TrackRowProps {
  track: Track;
  index: number;
  playlistContext?: Track[];
  showAlbum?: boolean;
  showCover?: boolean;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  track,
  index,
  playlistContext,
  showAlbum = true,
  showCover = true,
}) => {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    isLiked,
    toggleLike,
    addToQueue,
    userPlaylists,
    addTrackToPlaylist
  } = useAudio();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isCurrent = currentTrack?.id === track.id;
  const isPlayingThis = isCurrent && isPlaying;
  const liked = isLiked(track.id);

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, playlistContext);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group relative flex items-center h-14 px-4 rounded-md transition-colors duration-150 cursor-pointer select-none ${
        isCurrent ? 'bg-[var(--color-surface-highlight)]' : 'hover:bg-[var(--color-surface-highlight)]'
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-2 right-4 z-50 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-white text-xs px-3 py-1.5 rounded-md shadow-lg flex items-center gap-1.5 pointer-events-none">
          <Check size={14} className="text-[var(--color-accent)]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Track Index / Play Trigger */}
      <div className="w-8 flex items-center justify-center text-sm text-[var(--color-text-subtle)] shrink-0">
        {isPlayingThis ? (
          <div className="flex items-end gap-[2px] h-3.5">
            <span className="w-[3px] bg-[var(--color-accent)] animate-wave-1 rounded-full" />
            <span className="w-[3px] bg-[var(--color-accent)] animate-wave-2 rounded-full" />
            <span className="w-[3px] bg-[var(--color-accent)] animate-wave-3 rounded-full" />
            <span className="w-[3px] bg-[var(--color-accent)] animate-wave-4 rounded-full" />
          </div>
        ) : (
          <>
            <span className="group-hover:hidden font-medium">
              {isCurrent ? <span className="text-[var(--color-accent)]">{index + 1}</span> : index + 1}
            </span>
            <button
              type="button"
              aria-label={`Play ${track.title}`}
              className="hidden group-hover:flex items-center justify-center text-white"
            >
              <Play size={16} fill="currentColor" strokeWidth={0} />
            </button>
          </>
        )}
      </div>

      {/* Title & Artist & Thumbnail */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
        {showCover && (
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-10 h-10 rounded object-cover shrink-0 shadow-sm"
          />
        )}
        <div className="flex flex-col min-w-0 truncate">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium truncate ${
                isCurrent ? 'text-[var(--color-accent)]' : 'text-white'
              }`}
            >
              {track.title}
            </span>
            {track.explicit && (
              <span className="text-[9px] uppercase font-bold bg-[#535353] text-[#121212] px-1 py-0.5 rounded-[2px] shrink-0">
                E
              </span>
            )}
          </div>
          <span className="text-xs text-[var(--color-text-muted)] truncate hover:underline hover:text-white transition-colors">
            {track.artistName}
          </span>
        </div>
      </div>

      {/* Album Name (Desktop) */}
      {showAlbum && (
        <div className="hidden md:block flex-1 min-w-0 pr-4">
          <span className="text-xs text-[var(--color-text-muted)] truncate hover:underline hover:text-white transition-colors block">
            {track.albumTitle}
          </span>
        </div>
      )}

      {/* Like Heart & Duration & Context Menu */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          type="button"
          aria-label={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track.id);
            showToast(liked ? 'Removed from Liked Songs' : 'Added to Liked Songs');
          }}
          className={`focus:outline-none transition-colors ${
            liked
              ? 'text-[var(--color-accent)] opacity-100'
              : 'text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 hover:text-white'
          }`}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
        </button>

        <span className="text-xs text-[var(--color-text-subtle)] w-10 text-right tabular-nums">
          {formatDuration(track.durationMs)}
        </span>

        {/* More Options Menu */}
        <div className="relative">
          <button
            type="button"
            aria-label="More options"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 hover:text-white transition-opacity p-1 focus:outline-none"
          >
            <MoreHorizontal size={16} />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                }}
              />
              <div className="absolute right-0 top-8 z-50 w-52 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md shadow-2xl py-1 text-xs text-white">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToQueue(track);
                    setIsMenuOpen(false);
                    showToast('Added to queue');
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-[var(--color-surface-highlight)] flex items-center gap-2.5 transition-colors"
                >
                  <Plus size={14} />
                  <span>Add to Queue</span>
                </button>
                <div className="h-[1px] bg-[var(--color-border)] my-1" />
                <div className="px-3.5 py-1 text-[10px] text-[var(--color-text-subtle)] uppercase tracking-wider font-semibold">
                  Add to Playlist
                </div>
                {userPlaylists.map((pl) => (
                  <button
                    key={pl.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addTrackToPlaylist(pl.id, track);
                      setIsMenuOpen(false);
                      showToast(`Added to ${pl.title}`);
                    }}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-[var(--color-surface-highlight)] truncate transition-colors text-[var(--color-text-muted)] hover:text-white"
                  >
                    {pl.title}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
