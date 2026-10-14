import React from 'react';
import { AlbumView } from '@/components/views/AlbumView';
import { SEED_ALBUMS } from '@/lib/seedData';

interface AlbumPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return SEED_ALBUMS.map((album) => ({ id: album.id }));
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { id } = await params;
  return <AlbumView id={id} />;
}
