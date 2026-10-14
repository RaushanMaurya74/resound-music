import { NextResponse } from 'next/server';
import { SEED_PLAYLISTS, SEED_ALBUMS, SEED_ARTISTS, SEED_TRACKS } from '@/lib/seedData';

export async function GET() {
  try {
    const feed = {
      recents: [
        { id: 'liked-songs', title: 'Liked Songs', type: 'collection' },
        ...SEED_PLAYLISTS.slice(0, 3).map(p => ({ id: p.id, title: p.title, type: 'playlist', imageUrl: p.coverUrl })),
        ...SEED_ALBUMS.slice(0, 2).map(a => ({ id: a.id, title: a.title, type: 'album', imageUrl: a.coverUrl })),
      ],
      shelves: [
        {
          id: 'made-for-you',
          title: 'Made For You',
          items: SEED_PLAYLISTS,
        },
        {
          id: 'popular-albums',
          title: 'Popular Albums',
          items: SEED_ALBUMS,
        },
        {
          id: 'popular-artists',
          title: 'Popular Artists',
          items: SEED_ARTISTS,
        },
      ],
    };

    return NextResponse.json(feed, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
