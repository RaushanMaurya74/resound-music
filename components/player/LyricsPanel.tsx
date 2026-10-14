'use client';

import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { X, Mic } from 'lucide-react';

export const LyricsPanel: React.FC = () => {
  const { isLyricsOpen, toggleLyricsPanel, currentTrack, currentTime, duration } = useAudio();

  if (!isLyricsOpen || !currentTrack) return null;

  const lyrics = currentTrack.lyrics || [];
  const currentLineIndex = lyrics.length > 0 && duration > 0
    ? Math.min(lyrics.length - 1, Math.floor((currentTime / duration) * lyrics.length))
    : -1;

  return (
    <aside className="fixed top-0 right-0 bottom-[88px] w-[420px] max-w-[95vw] bg-gradient-to-b from-[#38184c] to-[#121212] border-l border-[var(--color-border)] z-40 flex flex-col shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Mic size={18} className="text-[var(--color-accent)]" />
          <h2 className="text-base font-bold text-white tracking-tight">Lyrics</h2>
        </div>
        <button
          type="button"
          aria-label="Close lyrics"
          onClick={toggleLyricsPanel}
          className="text-[var(--color-text-muted)] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Lyrics Container */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {lyrics.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Mic size={40} className="text-white/30 mb-3" />
            <p className="text-white font-semibold">Looks like we don't have lyrics for this song yet.</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Enjoy the music!</p>
          </div>
        ) : (
          lyrics.map((line, idx) => {
            const isCurrent = idx === currentLineIndex;
            return (
              <p
                key={idx}
                className={`text-xl font-bold transition-all duration-300 leading-snug select-none ${
                  isCurrent
                    ? 'text-white scale-102 drop-shadow-md'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {line}
              </p>
            );
          })
        )}
      </div>
    </aside>
  );
};
