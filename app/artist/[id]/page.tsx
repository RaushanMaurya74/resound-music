import React from 'react';
import { ArtistView } from '@/components/views/ArtistView';
import { SEED_ARTISTS } from '@/lib/seedData';

interface ArtistPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return SEED_ARTISTS.map((artist) => ({ id: artist.id }));
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { id } = await params;
  return <ArtistView id={id} />;
}
