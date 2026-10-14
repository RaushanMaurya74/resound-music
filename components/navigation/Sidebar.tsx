'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  Music,
  Compass,
  Radio,
  ExternalLink
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { userPlaylists, likedTrackIds, createPlaylist } = useAudio();

  const [filter, setFilter] = useState<'all' | 'playlists' | 'artists'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const pl = createPlaylist(newTitle || 'My Playlist');
    setShowCreateModal(false);
    setNewTitle('');
    router.push(`/playlist/${pl.id}`);
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className="w-[300px] shrink-0 h-[calc(100vh-88px)] p-2 flex flex-col gap-2 select-none">
      {/* 1. Main Navigation Block */}
      <div className="bg-[var(--color-surface)] rounded-lg p-4 flex flex-col gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 px-3 py-1 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
            <Radio size={19} />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-xl tracking-tight leading-none">Resound</span>
            <span className="text-[10px] text-[var(--color-text-subtle)] font-semibold tracking-wider uppercase mt-0.5">Pure Music</span>
          </div>
        </Link>

        {/* Links */}
        <nav className="flex flex-col gap-1">
          <Link
            href="/"
            className={`flex items-center gap-4 px-3 py-2.5 rounded-md font-bold text-sm transition-colors ${
              isActive('/')
                ? 'text-white bg-[var(--color-surface-elevated)]'
                : 'text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-surface-highlight)]'
            }`}
          >
            <Home size={22} className={isActive('/') ? 'text-white' : ''} />
            <span>Home</span>
          </Link>

          <Link
            href="/search"
            className={`flex items-center gap-4 px-3 py-2.5 rounded-md font-bold text-sm transition-colors ${
              isActive('/search')
                ? 'text-white bg-[var(--color-surface-elevated)]'
                : 'text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-surface-highlight)]'
            }`}
          >
            <Search size={22} className={isActive('/search') ? 'text-white' : ''} />
            <span>Search</span>
          </Link>

          <Link
            href="/design"
            className={`flex items-center gap-4 px-3 py-2.5 rounded-md font-bold text-sm transition-colors ${
              isActive('/design')
                ? 'text-white bg-[var(--color-surface-elevated)]'
                : 'text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-surface-highlight)]'
            }`}
          >
            <Compass size={22} className={isActive('/design') ? 'text-white' : ''} />
            <span>Design Tokens</span>
          </Link>
        </nav>
      </div>

      {/* 2. Your Library Block */}
      <div className="flex-1 bg-[var(--color-surface)] rounded-lg p-3 flex flex-col min-h-0 overflow-hidden">
        {/* Header & Add Button */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-white transition-colors cursor-pointer">
            <Library size={22} />
            <span className="font-bold text-sm">Your Library</span>
          </div>

          <button
            type="button"
            aria-label="Create new playlist"
            onClick={() => setShowCreateModal(true)}
            className="text-[var(--color-text-muted)] hover:text-white p-1 rounded-full hover:bg-[var(--color-surface-elevated)] transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-3 py-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-white text-black'
                : 'bg-[var(--color-surface-elevated)] text-white hover:bg-[var(--color-surface-highlight)]'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('playlists')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              filter === 'playlists'
                ? 'bg-white text-black'
                : 'bg-[var(--color-surface-elevated)] text-white hover:bg-[var(--color-surface-highlight)]'
            }`}
          >
            Playlists
          </button>
        </div>

        {/* Scrollable Playlists & Liked Songs */}
        <div className="flex-1 overflow-y-auto mt-2 space-y-1 pr-1">
          {/* Liked Songs Pinned Item */}
          <Link
            href="/collection/tracks"
            className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
              pathname === '/collection/tracks'
                ? 'bg-[var(--color-surface-highlight)]'
                : 'hover:bg-[var(--color-surface-elevated)]'
            }`}
          >
            <div className="w-12 h-12 rounded bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center text-white shrink-0 shadow">
              <Heart size={20} fill="currentColor" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">Liked Songs</span>
              <span className="text-xs text-[var(--color-text-muted)] truncate">
                Playlist • {likedTrackIds.size} {likedTrackIds.size === 1 ? 'song' : 'songs'}
              </span>
            </div>
          </Link>

          {/* User Playlists */}
          {userPlaylists.map((pl) => (
            <Link
              key={pl.id}
              href={`/playlist/${pl.id}`}
              className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                pathname === `/playlist/${pl.id}`
                  ? 'bg-[var(--color-surface-highlight)]'
                  : 'hover:bg-[var(--color-surface-elevated)]'
              }`}
            >
              <img
                src={pl.coverUrl}
                alt={pl.title}
                className="w-12 h-12 rounded object-cover shrink-0 shadow-sm"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">{pl.title}</span>
                <span className="text-xs text-[var(--color-text-muted)] truncate">
                  Playlist • {pl.createdBy}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-sm bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-6 shadow-2xl space-y-4"
          >
            <h3 className="text-lg font-bold text-white">Create New Playlist</h3>
            <div>
              <label htmlFor="playlist-title" className="block text-xs text-[var(--color-text-muted)] mb-1">
                Playlist Title
              </label>
              <input
                id="playlist-title"
                type="text"
                autoFocus
                placeholder="My Awesome Mix"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#121212] border border-[var(--color-border-input)] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full text-xs font-bold bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-black transition-colors"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
};
