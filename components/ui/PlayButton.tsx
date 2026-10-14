'use client';

import React from 'react';
import { Play, Pause } from 'lucide-react';

interface PlayButtonProps {
  isPlaying?: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
}

export const PlayButton: React.FC<PlayButtonProps> = ({
  isPlaying = false,
  onClick,
  size = 'md',
  className = '',
  ariaLabel = 'Play',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
  }[size];

  const iconSizes = {
    sm: 16,
    md: 22,
    lg: 26,
  }[size];

  return (
    <button
      type="button"
      aria-label={isPlaying ? 'Pause' : ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      className={`rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] hover:scale-106 active:scale-100 flex items-center justify-center text-black shadow-[var(--shadow-play)] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${sizeClasses} ${className}`}
    >
      {isPlaying ? (
        <Pause size={iconSizes} fill="currentColor" strokeWidth={0} />
      ) : (
        <Play size={iconSizes} fill="currentColor" strokeWidth={0} className="ml-0.5" />
      )}
    </button>
  );
};
