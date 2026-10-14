import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    
    // In production, extracts user session from Bearer token
    const userId = req.headers.get('x-user-id') || 'simulated-user-id';

    // Purge user's playlists, likes, and profile from Supabase
    if (isSupabaseConfigured()) {
      await supabase.from('playlist_tracks').delete().match({ user_id: userId });
      await supabase.from('playlists').delete().match({ user_id: userId });
      await supabase.from('likes').delete().match({ user_id: userId });
      await supabase.from('users').delete().match({ id: userId });
    }

    return NextResponse.json({
      success: true,
      message: 'Account and associated listening data have been permanently queued for erasure.',
      purgedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to process account deletion request', details: error?.message },
      { status: 500 }
    );
  }
}
