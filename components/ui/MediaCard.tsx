'use client';

import React from 'react';
import Link from 'next/link';
import { PlayButton } from './PlayButton';
import { useAudio } from '@/context/AudioContext';
import { Track } from '@/types/music';

interface MediaCardProps {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
  type?: 'playlist' | 'album' | 'artist';
  tracks?: Track[];
}

export const MediaCard: React.FC<MediaCardProps> = ({
  id,
  title,
  subtitle,
  imageUrl,
  href,
  type = 'playlist',
  tracks = [],
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const isCurrentCardPlaying = Boolean(
    tracks.length > 0 && currentTrack && tracks.some((t) => t.id === currentTrack.id) && isPlaying
  );

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (tracks.length === 0) return;

    if (currentTrack && tracks.some(t => t.id === currentTrack.id)) {
      togglePlay();
    } else {
      playTrack(tracks[0], tracks);
    }
  };

  const isCircle = type === 'artist';

  return (
    <Link
      href={href}
      className="group relative flex flex-col p-4 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)] transition-all duration-300 shadow-[var(--shadow-card)] cursor-pointer select-none"
    >
      {/* Artwork Container */}
      <div className="relative aspect-square w-full mb-4 shadow-md overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 ${
            isCircle ? 'rounded-full' : 'rounded-md'
          }`}
        />

        {/* Floating Play Button */}
        {tracks.length > 0 && (
          <div
            className={`absolute right-2 bottom-2 transition-all duration-200 transform ${
              isCurrentCardPlaying
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
            }`}
          >
            <PlayButton
              size="md"
              isPlaying={isCurrentCardPlaying}
              onClick={handlePlayClick}
              ariaLabel={`Play ${title}`}
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-bold text-white truncate group-hover:underline">
          {title}
        </span>
        <span className="text-xs text-[var(--color-text-muted)] line-clamp-2 mt-1">
          {subtitle}
        </span>
      </div>
    </Link>
  );
};
