export interface Artist {
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
  bannerUrl?: string;
  verified: boolean;
  monthlyListeners: number;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  releaseYear: number;
  coverUrl: string;
  genre: string;
  totalTracks: number;
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId: string;
  albumTitle: string;
  durationMs: number;
  audioUrl: string;
  coverUrl: string;
  trackNumber: number;
  explicit?: boolean;
  playCount: number;
  lyrics?: string[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  createdBy: string;
  isPublic: boolean;
  tracks: Track[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  imageUrl: string;
}
