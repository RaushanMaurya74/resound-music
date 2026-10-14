'use client';

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { TrackRow } from '@/components/ui/TrackRow';
import { MediaCard } from '@/components/ui/MediaCard';
import { PlayButton } from '@/components/ui/PlayButton';
import { useAudio } from '@/context/AudioContext';
import { SEED_ARTISTS, SEED_TRACKS, SEED_ALBUMS } from '@/lib/seedData';
import { CheckCircle2, MoreHorizontal } from 'lucide-react';

interface ArtistViewProps {
  id: string;
}

export function ArtistView({ id }: ArtistViewProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const artist = SEED_ARTISTS.find((a) => a.id === id);

  if (!artist) {
    return notFound();
  }

  const artistTracks = SEED_TRACKS.filter((t) => t.artistId === artist.id);
  const artistAlbums = SEED_ALBUMS.filter((a) => a.artistId === artist.id);

  const isArtistPlaying = Boolean(
    artistTracks.length > 0 &&
    currentTrack &&
    artistTracks.some((t) => t.id === currentTrack.id) &&
    isPlaying
  );

  const handlePlayAll = () => {
    if (artistTracks.length === 0) return;
    if (currentTrack && artistTracks.some((t) => t.id === currentTrack.id)) {
      togglePlay();
    } else {
      playTrack(artistTracks[0], artistTracks);
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header />

      {/* Hero Banner with Background Image */}
      <div className="relative h-72 sm:h-80 md:h-96 px-8 pb-8 flex flex-col justify-end overflow-hidden shadow-2xl select-none">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${artist.bannerUrl || artist.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-black/40 to-black/20" />
        </div>

        <div className="relative z-10">
          {artist.verified && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-2">
              <CheckCircle2 size={18} className="text-[#3d91f4] fill-white" />
              <span>Verified Artist</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white tracking-tight drop-shadow-xl my-2">
            {artist.name}
          </h1>

          <p className="text-sm font-semibold text-white/90">
            {artist.monthlyListeners.toLocaleString()} monthly listeners
          </p>
        </div>
      </div>

      {/* Action Row */}
      <div className="px-8 py-6 flex items-center gap-6 select-none">
        {artistTracks.length > 0 && (
          <PlayButton
            size="lg"
            isPlaying={isArtistPlaying}
            onClick={handlePlayAll}
            ariaLabel={`Play ${artist.name}`}
          />
        )}
        <button
          type="button"
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-5 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 ${
            isFollowing
              ? 'border-white bg-white text-black'
              : 'border-[var(--color-border-input)] text-white hover:border-white'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
        <button
          type="button"
          aria-label="More options"
          className="text-[var(--color-text-muted)] hover:text-white transition-colors"
        >
          <MoreHorizontal size={28} />
        </button>
      </div>

      {/* Popular Tracks & About */}
      <div className="px-8 space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Popular</h2>
          <div className="space-y-0.5">
            {artistTracks.slice(0, 5).map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                playlistContext={artistTracks}
                showAlbum={true}
              />
            ))}
          </div>
        </div>

        {artistAlbums.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Discography</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {artistAlbums.map((album) => (
                <MediaCard
                  key={album.id}
                  id={album.id}
                  title={album.title}
                  subtitle={`${album.releaseYear} • Album`}
                  imageUrl={album.coverUrl}
                  href={`/album/${album.id}`}
                  type="album"
                  tracks={SEED_TRACKS.filter((t) => t.albumId === album.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">About</h2>
          <div className="relative max-w-2xl rounded-xl overflow-hidden bg-[var(--color-surface-elevated)] p-6 shadow-lg border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              {artist.bio}
            </p>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {artist.monthlyListeners.toLocaleString()}
                </p>
                <p className="text-xs text-[var(--color-text-subtle)]">Monthly Listeners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
