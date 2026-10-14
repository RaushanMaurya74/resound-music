'use client';

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Search, X, User } from 'lucide-react';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery = '', onSearchChange }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isSearchPage = pathname === '/search';

  return (
    <header className="sticky top-0 h-16 px-6 flex items-center justify-between z-30 bg-[#121212]/80 backdrop-blur-md select-none border-b border-transparent transition-colors">
      {/* Left: History Navigation & Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Go forward"
            onClick={() => router.forward()}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Integrated Search Input for Search Page */}
        {isSearchPage && onSearchChange && (
          <div className="relative flex items-center w-full max-w-md">
            <Search size={18} className="absolute left-3.5 text-[var(--color-text-muted)] pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="What do you want to play?"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-11 pl-10 pr-10 rounded-full bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-highlight)] focus:bg-[#282828] text-white text-sm placeholder-[var(--color-text-muted)] border border-transparent focus:border-white focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 text-[var(--color-text-muted)] hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right: User Profile Avatar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 p-1 pl-1.5 pr-3 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer transition-colors shadow">
          <div className="w-7 h-7 rounded-full bg-[#535353] flex items-center justify-center text-white text-xs font-bold">
            <User size={16} />
          </div>
          <span className="text-xs font-bold tracking-tight">Music Lover</span>
        </div>
      </div>
    </header>
  );
};
