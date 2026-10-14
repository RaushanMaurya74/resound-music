import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SEED_TRACKS, SEED_ARTISTS, SEED_ALBUMS, SEED_PLAYLISTS } from '@/lib/seedData';

const searchSchema = z.object({
  q: z.string().min(1).max(100),
  type: z.enum(['all', 'track', 'artist', 'album', 'playlist']).default('all'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parseResult = searchSchema.safeParse({
      q: searchParams.get('q') || '',
      type: searchParams.get('type') || 'all',
    });

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { q, type } = parseResult.data;
    const cleanQuery = q.toLowerCase().trim();

    const tracks = SEED_TRACKS.filter(
      t =>
        t.title.toLowerCase().includes(cleanQuery) ||
        t.artistName.toLowerCase().includes(cleanQuery)
    );

    const artists = SEED_ARTISTS.filter(a =>
      a.name.toLowerCase().includes(cleanQuery)
    );

    const albums = SEED_ALBUMS.filter(
      a =>
        a.title.toLowerCase().includes(cleanQuery) ||
        a.artistName.toLowerCase().includes(cleanQuery)
    );

    const playlists = SEED_PLAYLISTS.filter(p =>
      p.title.toLowerCase().includes(cleanQuery)
    );

    return NextResponse.json({
      query: q,
      topResult: tracks[0] || artists[0] || null,
      tracks: type === 'all' || type === 'track' ? tracks : [],
      artists: type === 'all' || type === 'artist' ? artists : [],
      albums: type === 'all' || type === 'album' ? albums : [],
      playlists: type === 'all' || type === 'playlist' ? playlists : [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
