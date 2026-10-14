import React from 'react';
import { PlaylistView } from '@/components/views/PlaylistView';
import { SEED_PLAYLISTS } from '@/lib/seedData';

interface PlaylistPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return SEED_PLAYLISTS.map((pl) => ({ id: pl.id }));
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const { id } = await params;
  return <PlaylistView id={id} />;
}
