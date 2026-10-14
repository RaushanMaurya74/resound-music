import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AudioProvider } from '@/context/AudioContext';
import { Sidebar } from '@/components/navigation/Sidebar';
import { PlayerDock } from '@/components/player/PlayerDock';
import { QueueDrawer } from '@/components/player/QueueDrawer';
import { LyricsPanel } from '@/components/player/LyricsPanel';

export const metadata: Metadata = {
  title: 'Resound - Pure Music. True Shuffle.',
  description: 'Fast, clutter-free music streaming with unbiased Fisher-Yates true shuffle and free synced lyrics.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#0b0d14] antialiased">
      <body className="h-full overflow-hidden bg-[#0b0d14] text-white">
        <AudioProvider>
          {/* Main App Grid Shell */}
          <div className="flex h-screen w-screen overflow-hidden pb-[88px]">
            {/* S07 Persistent Left Sidebar */}
            <React.Suspense fallback={<div className="w-[300px] shrink-0 h-[calc(100vh-88px)] p-2" />}>
              <Sidebar />
            </React.Suspense>

            {/* Scrollable Center Content Area */}
            <main className="flex-1 my-2 mr-2 rounded-lg bg-[var(--color-surface)] overflow-y-auto relative flex flex-col">
              <React.Suspense fallback={<div className="flex-1 p-8 text-white">Loading...</div>}>
                {children}
              </React.Suspense>
            </main>

            {/* S09 Queue Panel (Drawer) */}
            <QueueDrawer />

            {/* S10 Lyrics Panel (Drawer) */}
            <LyricsPanel />
          </div>

          {/* S08 Persistent Bottom Audio Player Dock */}
          <PlayerDock />
        </AudioProvider>
      </body>
    </html>
  );
}
