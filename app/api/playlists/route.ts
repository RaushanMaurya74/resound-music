import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SEED_PLAYLISTS } from '@/lib/seedData';

const createPlaylistSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(300).optional(),
  isPublic: z.boolean().default(true),
});

export async function GET() {
  return NextResponse.json({ playlists: SEED_PLAYLISTS }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = createPlaylistSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid playlist data', details: result.error.format() },
        { status: 400 }
      );
    }

    const { title, description, isPublic } = result.data;

    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      title,
      description: description || '',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      createdBy: 'You',
      isPublic,
      tracks: [],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ playlist: newPlaylist }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
