'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { TrackRow } from '@/components/ui/TrackRow';
import { MediaCard } from '@/components/ui/MediaCard';
import { PlayButton } from '@/components/ui/PlayButton';
import { useAudio } from '@/context/AudioContext';
import {
  SEED_CATEGORIES,
  SEED_TRACKS,
  SEED_ARTISTS,
  SEED_ALBUMS,
  SEED_PLAYLISTS,
} from '@/lib/seedData';
import { Search as SearchIcon, Music2 } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'songs' | 'artists' | 'albums' | 'playlists'>('all');
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const cleanQuery = query.toLowerCase().trim();

  // Search Filtering
  const matchingTracks = cleanQuery
    ? SEED_TRACKS.filter(
        (t) =>
          t.title.toLowerCase().includes(cleanQuery) ||
          t.artistName.toLowerCase().includes(cleanQuery) ||
          t.albumTitle.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchingArtists = cleanQuery
    ? SEED_ARTISTS.filter((a) => a.name.toLowerCase().includes(cleanQuery))
    : [];

  const matchingAlbums = cleanQuery
    ? SEED_ALBUMS.filter(
        (a) =>
          a.title.toLowerCase().includes(cleanQuery) ||
          a.artistName.toLowerCase().includes(cleanQuery) ||
          a.genre.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchingPlaylists = cleanQuery
    ? SEED_PLAYLISTS.filter(
        (p) =>
          p.title.toLowerCase().includes(cleanQuery) ||
          p.description.toLowerCase().includes(cleanQuery)
      )
    : [];

  const topResult = matchingTracks[0] || null;
  const isTopResultPlaying = topResult && currentTrack?.id === topResult.id && isPlaying;

  return (
    <div className="flex-1 flex flex-col pb-12">
      {/* Header with integrated Search Input */}
      <Header searchQuery={query} onSearchChange={setQuery} />

      <div className="px-6 space-y-6">
        {/* Search State: Empty -> Browse All Categories */}
        {!cleanQuery ? (
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mb-5">
              Browse all
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {SEED_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  style={{ backgroundColor: cat.color }}
                  className="group relative h-48 rounded-lg p-4 overflow-hidden shadow-md hover:scale-102 transition-transform duration-200 cursor-pointer select-none"
                  onClick={() => setQuery(cat.name)}
                >
                  <h3 className="text-xl font-bold text-white tracking-tight leading-snug break-words max-w-[120px]">
                    {cat.name}
                  </h3>

                  {/* Rotated decorative album artwork in bottom right */}
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="absolute -right-4 -bottom-2 w-24 h-24 object-cover shadow-2xl rotate-[25deg] group-hover:rotate-[28deg] transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Search State: Results Populated */
          <div className="space-y-8">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(['all', 'songs', 'artists', 'albums', 'playlists'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setActiveFilter(filterKey)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeFilter === filterKey
                      ? 'bg-white text-black'
                      : 'bg-[var(--color-surface-elevated)] text-white hover:bg-[var(--color-surface-highlight)]'
                  }`}
                >
                  {filterKey}
                </button>
              ))}
            </div>

            {/* No Results Fallback */}
            {matchingTracks.length === 0 &&
              matchingArtists.length === 0 &&
              matchingAlbums.length === 0 &&
              matchingPlaylists.length === 0 && (
                <div className="text-center py-20">
                  <SearchIcon size={48} className="mx-auto text-[var(--color-text-muted)] mb-3" />
                  <h2 className="text-xl font-bold text-white">No results found for "{query}"</h2>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1.5 max-w-sm mx-auto">
                    Please make sure your words are spelled correctly, or try searching for a different song, artist, or album.
                  </p>
                </div>
              )}

            {/* Top Result & Songs Table Grid */}
            {(activeFilter === 'all' || activeFilter === 'songs') && matchingTracks.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Top Result Card (Left 2 cols) */}
                {topResult && (
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-white mb-4">Top result</h2>
                    <div
                      className="group relative flex flex-col p-5 rounded-lg bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-highlight)] transition-colors duration-200 cursor-pointer shadow-md"
                      onClick={() => {
                        if (isTopResultPlaying) togglePlay();
                        else playTrack(topResult, matchingTracks);
                      }}
                    >
                      <img
                        src={topResult.coverUrl}
                        alt={topResult.title}
                        className="w-24 h-24 rounded-md object-cover shadow-lg mb-4"
                      />
                      <h3 className="text-2xl font-extrabold text-white truncate">
                        {topResult.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[var(--color-text-muted)]">
                          Song • {topResult.artistName}
                        </span>
                      </div>

                      {/* Floating Play Button */}
                      <div className="absolute right-5 bottom-5">
                        <PlayButton
                          size="md"
                          isPlaying={isTopResultPlaying}
                          onClick={() => {
                            if (isTopResultPlaying) togglePlay();
                            else playTrack(topResult, matchingTracks);
                          }}
                          ariaLabel={`Play ${topResult.title}`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Matching Songs Table (Right 3 cols) */}
                <div className={topResult ? 'lg:col-span-3' : 'lg:col-span-5'}>
                  <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
                  <div className="space-y-0.5">
                    {matchingTracks.slice(0, 4).map((track, idx) => (
                      <TrackRow
                        key={track.id}
                        track={track}
                        index={idx}
                        playlistContext={matchingTracks}
                        showAlbum={false}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Matching Artists */}
            {(activeFilter === 'all' || activeFilter === 'artists') && matchingArtists.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Artists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {matchingArtists.map((artist) => (
                    <MediaCard
                      key={artist.id}
                      id={artist.id}
                      title={artist.name}
                      subtitle="Artist"
                      imageUrl={artist.imageUrl}
                      href={`/artist/${artist.id}`}
                      type="artist"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Matching Albums */}
            {(activeFilter === 'all' || activeFilter === 'albums') && matchingAlbums.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Albums</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {matchingAlbums.map((album) => (
                    <MediaCard
                      key={album.id}
                      id={album.id}
                      title={album.title}
                      subtitle={`${album.releaseYear} • ${album.artistName}`}
                      imageUrl={album.coverUrl}
                      href={`/album/${album.id}`}
                      type="album"
                      tracks={SEED_TRACKS.filter((t) => t.albumId === album.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Matching Playlists */}
            {(activeFilter === 'all' || activeFilter === 'playlists') && matchingPlaylists.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Playlists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {matchingPlaylists.map((pl) => (
                    <MediaCard
                      key={pl.id}
                      id={pl.id}
                      title={pl.title}
                      subtitle={`By ${pl.createdBy}`}
                      imageUrl={pl.coverUrl}
                      href={`/playlist/${pl.id}`}
                      type="playlist"
                      tracks={pl.tracks}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
