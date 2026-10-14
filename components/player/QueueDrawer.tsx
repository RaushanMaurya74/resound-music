'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { X, Trash2, Play, Music } from 'lucide-react';

export const QueueDrawer: React.FC = () => {
  const {
    isQueueOpen,
    toggleQueuePanel,
    currentTrack,
    queue,
    playTrack,
    removeFromQueue
  } = useAudio();

  if (!isQueueOpen) return null;

  return (
    <aside className="fixed top-0 right-0 bottom-[88px] w-[360px] max-w-[90vw] bg-[var(--color-surface)] border-l border-[var(--color-border)] z-40 flex flex-col shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]">
        <h2 className="text-base font-bold text-white tracking-tight">Queue</h2>
        <button
          type="button"
          aria-label="Close queue"
          onClick={toggleQueuePanel}
          className="text-[var(--color-text-muted)] hover:text-white p-1 rounded-full hover:bg-[var(--color-surface-elevated)] transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {/* Now Playing */}
        {currentTrack && (
          <div>
            <span className="text-xs uppercase font-bold text-[var(--color-text-subtle)] tracking-wider block mb-3">
              Now Playing
            </span>
            <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-12 h-12 rounded object-cover shadow"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-semibold text-[var(--color-accent)] truncate">
                  {currentTrack.title}
                </span>
                <span className="text-xs text-[var(--color-text-muted)] truncate">
                  {currentTrack.artistName}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Up Next */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-bold text-[var(--color-text-subtle)] tracking-wider">
              Next Up
            </span>
            {queue.length > 0 && (
              <span className="text-xs text-[var(--color-text-muted)]">
                {queue.length} {queue.length === 1 ? 'song' : 'songs'}
              </span>
            )}
          </div>

          {queue.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-lg bg-[var(--color-surface-elevated)] border border-dashed border-[var(--color-border)]">
              <Music size={32} className="mx-auto text-[var(--color-text-muted)] mb-2" />
              <p className="text-sm text-white font-medium">Your queue is empty</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Add tracks from any playlist, album, or search result to line them up.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {queue.map((track, idx) => (
                <div
                  key={`${track.id}-${idx}`}
                  className="group flex items-center justify-between p-2 rounded-md hover:bg-[var(--color-surface-elevated)] transition-colors cursor-pointer"
                  onClick={() => playTrack(track)}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-10 h-10 rounded object-cover shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-white truncate group-hover:text-[var(--color-accent)]">
                        {track.title}
                      </span>
                      <span className="text-[11px] text-[var(--color-text-muted)] truncate">
                        {track.artistName}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Remove from queue"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromQueue(idx);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-white p-1.5 transition-opacity"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
