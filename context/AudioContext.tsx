'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Track, Playlist } from '@/types/music';
import { SEED_TRACKS, SEED_PLAYLISTS } from '@/lib/seedData';

export type RepeatMode = 'off' | 'all' | 'one';

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  history: Track[];
  likedTrackIds: Set<string>;
  userPlaylists: Playlist[];
  isQueueOpen: boolean;
  isLyricsOpen: boolean;

  playTrack: (track: Track, contextTracks?: Track[]) => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setVolumeLevel: (vol: number) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  createPlaylist: (title: string, description?: string) => Playlist;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  toggleQueuePanel: () => void;
  toggleLyricsPanel: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(SEED_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(SEED_TRACKS[0].durationMs / 1000);
  const [volume, setVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [previousVolume, setPreviousVolume] = useState<number>(0.75);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [queue, setQueue] = useState<Track[]>(SEED_TRACKS.slice(1));
  const [history, setHistory] = useState<Track[]>([]);
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set(['track-1', 'track-3']));
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>(SEED_PLAYLISTS);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);

  // Initialize Audio Element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      handleNextTrack();
    };

    const handleError = (e: Event) => {
      console.warn('Audio playback error, falling back:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  // Update MediaSession API for OS controls & lock screen
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artistName,
        album: currentTrack.albumTitle,
        artwork: [
          { src: currentTrack.coverUrl, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        handlePrevTrack();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        handleNextTrack();
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime && audioRef.current) {
          audioRef.current.currentTime = details.seekTime;
          setCurrentTime(details.seekTime);
        }
      });
    }
  }, [currentTrack]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleNextTrack();
      } else if (e.code === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handlePrevTrack();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTrack, volume, isMuted]);

  // Mathematically unbiased Fisher-Yates shuffle engine ensuring every track plays once
  const fisherYatesShuffle = useCallback(<T,>(arr: T[]): T[] => {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = result[i];
      result[i] = result[j];
      result[j] = temp;
    }
    return result;
  }, []);

  const playTrack = useCallback((track: Track, contextTracks?: Track[]) => {
    if (!audioRef.current) return;

    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      }
      return;
    }

    if (currentTrack) {
      setHistory(prev => [currentTrack, ...prev.slice(0, 20)]);
    }

    setCurrentTrack(track);
    audioRef.current.src = track.audioUrl;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);

    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn('Playback initiation note:', err);
        setIsPlaying(false);
      });

    if (contextTracks && contextTracks.length > 0) {
      const idx = contextTracks.findIndex(t => t.id === track.id);
      if (idx !== -1) {
        const remaining = contextTracks.slice(idx + 1);
        setQueue(isShuffle ? fisherYatesShuffle(remaining) : remaining);
      }
    }
  }, [currentTrack, isPlaying, isShuffle, fisherYatesShuffle]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src || audioRef.current.src === '') {
        audioRef.current.src = currentTrack.audioUrl;
      }
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  }, [isPlaying, currentTrack]);

  const seek = useCallback((seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = seconds;
    setCurrentTime(seconds);
  }, []);

  const setVolumeLevel = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolume(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = previousVolume || 0.75;
      setVolume(previousVolume || 0.75);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      audioRef.current.volume = 0;
      setVolume(0);
      setIsMuted(true);
    }
  }, [isMuted, volume, previousVolume]);

  const handleNextTrack = useCallback(() => {
    if (repeatMode === 'one' && audioRef.current && currentTrack) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      return;
    }

    if (queue.length > 0) {
      const next = queue[0];
      setQueue(prev => prev.slice(1));
      if (currentTrack) {
        setHistory(prev => [currentTrack, ...prev]);
      }
      setCurrentTrack(next);
      if (audioRef.current) {
        audioRef.current.src = next.audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else if (repeatMode === 'all') {
      const allTracks = SEED_TRACKS;
      if (allTracks.length > 0) {
        const next = allTracks[0];
        setQueue(allTracks.slice(1));
        setCurrentTrack(next);
        if (audioRef.current) {
          audioRef.current.src = next.audioUrl;
          audioRef.current.currentTime = 0;
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }
    } else {
      setIsPlaying(false);
    }
  }, [queue, currentTrack, repeatMode]);

  const handlePrevTrack = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (history.length > 0) {
      const prev = history[0];
      setHistory(h => h.slice(1));
      if (currentTrack) {
        setQueue(q => [currentTrack, ...q]);
      }
      setCurrentTrack(prev);
      if (audioRef.current) {
        audioRef.current.src = prev.audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  }, [history, currentTrack]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => {
      const next = !prev;
      if (next && queue.length > 1) {
        setQueue(q => fisherYatesShuffle(q));
      }
      return next;
    });
  }, [queue]);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const toggleLike = useCallback((trackId: string) => {
    setLikedTrackIds(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  }, []);

  const isLiked = useCallback((trackId: string) => {
    return likedTrackIds.has(trackId);
  }, [likedTrackIds]);

  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  }, []);

  const createPlaylist = useCallback((title: string, description = '') => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      title: title.trim() || `My Playlist #${userPlaylists.length + 1}`,
      description,
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      createdBy: 'You',
      isPublic: true,
      tracks: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUserPlaylists(prev => [newPlaylist, ...prev]);
    return newPlaylist;
  }, [userPlaylists]);

  const addTrackToPlaylist = useCallback((playlistId: string, track: Track) => {
    setUserPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        // Prevent duplicate add
        if (pl.tracks.some(t => t.id === track.id)) return pl;
        return {
          ...pl,
          tracks: [...pl.tracks, track],
        };
      }
      return pl;
    }));
  }, []);

  const toggleQueuePanel = useCallback(() => {
    setIsQueueOpen(prev => !prev);
    if (isLyricsOpen) setIsLyricsOpen(false);
  }, [isLyricsOpen]);

  const toggleLyricsPanel = useCallback(() => {
    setIsLyricsOpen(prev => !prev);
    if (isQueueOpen) setIsQueueOpen(false);
  }, [isQueueOpen]);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        history,
        likedTrackIds,
        userPlaylists,
        isQueueOpen,
        isLyricsOpen,
        playTrack,
        togglePlay,
        seek,
        setVolumeLevel,
        toggleMute,
        nextTrack: handleNextTrack,
        prevTrack: handlePrevTrack,
        toggleShuffle,
        toggleRepeat,
        toggleLike,
        isLiked,
        addToQueue,
        removeFromQueue,
        createPlaylist,
        addTrackToPlaylist,
        toggleQueuePanel,
        toggleLyricsPanel,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
