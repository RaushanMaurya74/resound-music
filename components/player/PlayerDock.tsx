'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAudio } from '@/context/AudioContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  ListMusic,
  Mic2,
  Maximize2
} from 'lucide-react';

export const PlayerDock: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlay,
    seek,
    setVolumeLevel,
    toggleMute,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
    isLiked,
    toggleLike,
    isQueueOpen,
    toggleQueuePanel,
    isLyricsOpen,
    toggleLyricsPanel
  } = useAudio();

  const [isHoveringSeek, setIsHoveringSeek] = useState(false);
  const [isHoveringVolume, setIsHoveringVolume] = useState(false);
  const [dragProgress, setDragProgress] = useState<number | null>(null);

  if (!currentTrack) return null;

  const liked = isLiked(currentTrack.id);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? ((dragProgress ?? currentTime) / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume * 100;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setDragProgress(val);
  };

  const handleSeekCommit = () => {
    if (dragProgress !== null) {
      seek(dragProgress);
      setDragProgress(null);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolumeLevel(val);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-[88px] bg-[#121212] border-t border-[#282828] px-4 flex items-center justify-between z-50 select-none">
      {/* 1. Left Section: Now Playing Metadata */}
      <div className="flex items-center gap-3.5 w-[30%] min-w-[180px]">
        <Link href={`/album/${currentTrack.albumId}`} className="relative group shrink-0">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-14 h-14 rounded object-cover shadow-md"
          />
        </Link>
        <div className="flex flex-col min-w-0 pr-2">
          <Link
            href={`/album/${currentTrack.albumId}`}
            className="text-sm font-semibold text-white truncate hover:underline"
          >
            {currentTrack.title}
          </Link>
          <Link
            href={`/artist/${currentTrack.artistId}`}
            className="text-xs text-[var(--color-text-muted)] truncate hover:underline hover:text-white transition-colors"
          >
            {currentTrack.artistName}
          </Link>
        </div>
        <button
          type="button"
          aria-label={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
          onClick={() => toggleLike(currentTrack.id)}
          className={`focus:outline-none transition-transform active:scale-85 ${
            liked ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)] hover:text-white'
          }`}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* 2. Center Section: Player Controls & Timeline Scrubber */}
      <div className="flex flex-col items-center max-w-[722px] w-[40%]">
        {/* Button Row */}
        <div className="flex items-center gap-4 mb-1.5">
          {/* Shuffle */}
          <button
            type="button"
            aria-label="Toggle shuffle"
            onClick={toggleShuffle}
            className={`focus:outline-none transition-colors relative ${
              isShuffle ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)] hover:text-white'
            }`}
          >
            <Shuffle size={18} />
            {isShuffle && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--color-accent)] rounded-full" />
            )}
          </button>

          {/* Prev */}
          <button
            type="button"
            aria-label="Previous track"
            onClick={prevTrack}
            className="text-[var(--color-text-muted)] hover:text-white transition-colors focus:outline-none active:scale-95"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>

          {/* Play / Pause Toggle */}
          <button
            type="button"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white hover:scale-105 active:scale-100 flex items-center justify-center text-black shadow-md transition-transform focus:outline-none cursor-pointer"
          >
            {isPlaying ? (
              <Pause size={18} fill="currentColor" strokeWidth={0} />
            ) : (
              <Play size={18} fill="currentColor" strokeWidth={0} className="ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            type="button"
            aria-label="Next track"
            onClick={nextTrack}
            className="text-[var(--color-text-muted)] hover:text-white transition-colors focus:outline-none active:scale-95"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>

          {/* Repeat */}
          <button
            type="button"
            aria-label="Toggle repeat mode"
            onClick={toggleRepeat}
            className={`focus:outline-none transition-colors relative ${
              repeatMode !== 'off'
                ? 'text-[var(--color-accent)]'
                : 'text-[var(--color-text-muted)] hover:text-white'
            }`}
          >
            {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
            {repeatMode !== 'off' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--color-accent)] rounded-full" />
            )}
          </button>
        </div>

        {/* Timeline Scrubber */}
        <div className="flex items-center gap-2.5 w-full">
          <span className="text-[11px] text-[var(--color-text-subtle)] w-9 text-right tabular-nums">
            {formatTime(dragProgress ?? currentTime)}
          </span>

          <div
            className="relative flex items-center flex-1 h-3 group cursor-pointer"
            onMouseEnter={() => setIsHoveringSeek(true)}
            onMouseLeave={() => setIsHoveringSeek(false)}
          >
            {/* Background Track */}
            <div className="absolute left-0 right-0 h-1 rounded-full bg-[#4d4d4d] overflow-hidden">
              {/* Progress Bar Fill */}
              <div
                className={`h-full rounded-full transition-colors ${
                  isHoveringSeek ? 'bg-[var(--color-accent)]' : 'bg-white'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Range Input Overlay */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={dragProgress ?? currentTime}
              onChange={handleSeekChange}
              onMouseUp={handleSeekCommit}
              onTouchEnd={handleSeekCommit}
              className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
              aria-label="Seek audio timeline"
            />

            {/* Draggable Thumb on hover */}
            <div
              className={`absolute w-3 h-3 bg-white rounded-full shadow-md pointer-events-none transition-opacity -translate-x-1/2 ${
                isHoveringSeek ? 'opacity-100 scale-100' : 'opacity-0'
              }`}
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <span className="text-[11px] text-[var(--color-text-subtle)] w-9 text-left tabular-nums">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 3. Right Section: Utility Tools & Volume */}
      <div className="flex items-center justify-end gap-3 w-[30%] min-w-[180px]">
        {/* Lyrics Button */}
        <button
          type="button"
          aria-label="Toggle Lyrics View"
          onClick={toggleLyricsPanel}
          className={`focus:outline-none transition-colors p-1.5 rounded-full ${
            isLyricsOpen ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)] hover:text-white'
          }`}
        >
          <Mic2 size={18} />
        </button>

        {/* Queue Button */}
        <button
          type="button"
          aria-label="Toggle Queue Panel"
          onClick={toggleQueuePanel}
          className={`focus:outline-none transition-colors p-1.5 rounded-full ${
            isQueueOpen ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)] hover:text-white'
          }`}
        >
          <ListMusic size={18} />
        </button>

        {/* Volume Mute & Slider */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            onClick={toggleMute}
            className="text-[var(--color-text-muted)] hover:text-white transition-colors focus:outline-none"
          >
            {getVolumeIcon()}
          </button>

          <div
            className="relative flex items-center w-24 h-3 group cursor-pointer"
            onMouseEnter={() => setIsHoveringVolume(true)}
            onMouseLeave={() => setIsHoveringVolume(false)}
          >
            {/* Background Track */}
            <div className="absolute left-0 right-0 h-1 rounded-full bg-[#4d4d4d] overflow-hidden">
              <div
                className={`h-full rounded-full transition-colors ${
                  isHoveringVolume ? 'bg-[var(--color-accent)]' : 'bg-white'
                }`}
                style={{ width: `${volumePercent}%` }}
              />
            </div>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
              aria-label="Volume controller"
            />

            <div
              className={`absolute w-3 h-3 bg-white rounded-full shadow-md pointer-events-none transition-opacity -translate-x-1/2 ${
                isHoveringVolume ? 'opacity-100 scale-100' : 'opacity-0'
              }`}
              style={{ left: `${volumePercent}%` }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
