'use client';

import React, { useState } from 'react';
import { Header } from '@/components/navigation/Header';
import { PlayButton } from '@/components/ui/PlayButton';
import { TrackRow } from '@/components/ui/TrackRow';
import { MediaCard } from '@/components/ui/MediaCard';
import { SEED_TRACKS } from '@/lib/seedData';
import { Check, ShieldCheck, Heart, Volume2, Shuffle, Repeat } from 'lucide-react';

export default function DesignSystemPage() {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [sliderVal, setSliderVal] = useState(45);

  const tokens = [
    { name: '--color-bg', hex: '#0b0d14', role: 'Midnight Obsidian Canvas' },
    { name: '--color-surface', hex: '#131722', role: 'Default Cards & Panels' },
    { name: '--color-surface-elevated', hex: '#1c2233', role: 'Elevated Cards & Popovers' },
    { name: '--color-surface-highlight', hex: '#242c42', role: 'Track Row Hover Background' },
    { name: '--color-border', hex: '#23293d', role: 'Subtle Dividers' },
    { name: '--color-border-input', hex: '#64748b', role: 'Inputs & Focus Rings (4.08:1 UI)' },
    { name: '--color-text', hex: '#ffffff', role: 'Primary Typography (19.41:1 AAA)' },
    { name: '--color-text-muted', hex: '#94a3b8', role: 'Secondary Metadata (7.57:1 AAA)' },
    { name: '--color-text-subtle', hex: '#8b9cb3', role: 'Timestamps & Indexes (6.94:1 AA)' },
    { name: '--color-accent', hex: '#7c3aed', role: 'Resound Electric Violet (5.70:1 AA)' },
    { name: '--color-on-accent', hex: '#ffffff', role: 'Button Text on Violet Accent (5.70:1 AA)' },
    { name: '--color-danger', hex: '#f43f5e', role: 'Destructive Actions (5.29:1 AA)' },
    { name: '--color-success', hex: '#10b981', role: 'Positive Confirmation (7.65:1 AAA)' },
  ];

  return (
    <div className="flex-1 flex flex-col pb-16">
      <Header />

      <div className="px-8 space-y-12">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2 text-[var(--color-accent)] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={18} />
            <span>Clean-Room Design System Check</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Design Tokens & UI Primitives
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-xl">
            Verified with WCAG 2.2 accessibility standard. 11 color pairs evaluated with 0 AA failures.
          </p>
        </div>

        {/* 1. Color Palette Tokens */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">
            1. Color Tokens (Roles & Values)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tokens.map((tok) => (
              <div
                key={tok.name}
                className="p-3 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded shadow-md shrink-0 border border-white/10"
                  style={{ backgroundColor: tok.hex }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{tok.name}</p>
                  <p className="text-[11px] text-[var(--color-text-subtle)] font-mono">{tok.hex}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)] truncate">{tok.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Interactive Primitives Showcase */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">
            2. Button & Control Primitives
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Play Button Variants */}
            <div className="p-5 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] space-y-4">
              <h3 className="text-sm font-bold text-white">PlayButton (Interactive)</h3>
              <div className="flex items-center gap-5">
                <PlayButton
                  size="sm"
                  isPlaying={isPlayingDemo}
                  onClick={() => setIsPlayingDemo(!isPlayingDemo)}
                />
                <PlayButton
                  size="md"
                  isPlaying={isPlayingDemo}
                  onClick={() => setIsPlayingDemo(!isPlayingDemo)}
                />
                <PlayButton
                  size="lg"
                  isPlaying={isPlayingDemo}
                  onClick={() => setIsPlayingDemo(!isPlayingDemo)}
                />
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                State: {isPlayingDemo ? 'Playing (Pause Icon)' : 'Paused (Play Triangle)'} • Click to toggle
              </p>
            </div>

            {/* Slider & Scrubber Demo */}
            <div className="p-5 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] space-y-4">
              <h3 className="text-sm font-bold text-white">Scrubber & Slider Track</h3>
              <div className="space-y-3">
                <div className="relative flex items-center h-4 group cursor-pointer">
                  <div className="absolute left-0 right-0 h-1.5 rounded-full bg-[#4d4d4d] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--color-accent)]"
                      style={{ width: `${sliderVal}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderVal}
                    onChange={(e) => setSliderVal(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div
                    className="absolute w-3.5 h-3.5 bg-white rounded-full shadow pointer-events-none -translate-x-1/2"
                    style={{ left: `${sliderVal}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[var(--color-text-subtle)] font-mono">
                  <span>Progress: {sliderVal}%</span>
                  <span>Seek Preview Active</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TrackRow Component Preview */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">
            3. TrackRow Component (All States)
          </h2>
          <div className="rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-2">
            <TrackRow
              track={SEED_TRACKS[0]}
              index={0}
              playlistContext={SEED_TRACKS}
              showAlbum={true}
            />
            <TrackRow
              track={SEED_TRACKS[1]}
              index={1}
              playlistContext={SEED_TRACKS}
              showAlbum={true}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
