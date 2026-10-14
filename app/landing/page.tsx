'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Shuffle, Music, Mic2, ShieldCheck, Zap, ChevronDown, Check, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What makes True Shuffle different from standard shuffle?",
      a: "Standard streaming apps use clustered pseudo-random algorithms that prioritize recently played songs, algorithmic recommendations, or high-margin tracks. Resound uses the Fisher-Yates array permutation algorithm, treating every track on your playlist with equal mathematical probability. Every song plays exactly once before any repeats."
    },
    {
      q: "Are synchronized lyrics really completely free?",
      a: "Yes. We believe real-time synced lyrics are a fundamental accessibility feature. We do not place usage caps, monthly limits, or paywalls on lyrics."
    },
    {
      q: "Does Resound include podcasts or audiobooks?",
      a: "No. Resound is 100% focused on music. We eliminated podcasts, audiobooks, and vertical video teasers to give you a pure, distraction-free audio experience."
    },
    {
      q: "How does billing and cancellation work?",
      a: "You can cancel your subscription with a single click in your settings at any time. No retention surveys, no hidden charges, and we notify annual subscribers 7 days prior to renewal."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0d14] text-white selection:bg-[#7c3aed] selection:text-white">
      {/* Top Navigation */}
      <nav className="border-b border-white/5 bg-[#0b0d14]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] flex items-center justify-center shadow-lg shadow-[#7c3aed]/25">
            <Music className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Resound</span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="#pricing" 
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold transition-all shadow-md shadow-[#7c3aed]/30 hover:scale-105 active:scale-95"
          >
            Open Player
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-24 max-w-5xl mx-auto text-center overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/30 text-[#a78bfa] text-xs font-semibold uppercase tracking-wider mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          Pure Music. True Shuffle.
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-balance">
          Music streaming with <span className="bg-gradient-to-r from-[#a78bfa] via-[#c084fc] to-[#7c3aed] bg-clip-text text-transparent">zero distractions</span> and true shuffle.
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
          Built for music lovers who are tired of podcast feeds, cluttered interfaces, and broken algorithmic shuffle loops that play the same 20 songs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-base transition-all shadow-xl shadow-[#7c3aed]/40 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Listening Free
          </Link>
          <Link
            href="#pricing"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#131722] hover:bg-[#1c2233] border border-white/10 text-slate-200 font-semibold text-base transition-all hover:scale-105"
          >
            View Pricing
          </Link>
        </div>

        {/* Hero Interactive Mockup Preview */}
        <div className="relative rounded-2xl border border-white/10 bg-[#131722]/80 p-4 shadow-2xl backdrop-blur-xl">
          <div className="rounded-xl overflow-hidden bg-[#0b0d14] border border-white/5 p-6 text-left">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs text-slate-500 ml-2 font-mono">resound-player // true_shuffle_active</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#7c3aed]/20 text-[#a78bfa] text-xs font-mono font-semibold">
                Fisher-Yates 100% Unbiased
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#131722] border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Shuffle className="w-5 h-5 text-[#a78bfa]" />
                  <h2 className="font-semibold text-sm">True Random Shuffle</h2>
                </div>
                <p className="text-xs text-slate-400">
                  Mathematically guaranteed that every song in your 1,000-track playlist plays once before any repeat.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#131722] border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Mic2 className="w-5 h-5 text-[#a78bfa]" />
                  <h2 className="font-semibold text-sm">Live Synced Lyrics</h2>
                </div>
                <p className="text-xs text-slate-400">
                  Synchronized word-by-word karaoke lyrics on every track with zero monthly viewing caps.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#131722] border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-[#a78bfa]" />
                  <h2 className="font-semibold text-sm">Pure Music Feed</h2>
                </div>
                <p className="text-xs text-slate-400">
                  Zero podcasts, zero audiobooks, and zero auto-playing video teasers. Only your music.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="px-6 py-20 bg-[#0e111a] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Mainstream music apps forgot how to be music apps.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              What was once a clean music player has become a bloated, algorithmic advertising machine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-[#131722] border border-red-500/20 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-lg mb-6">
                ✕
              </div>
              <h3 className="text-xl font-bold mb-3">The Algorithmic 20-Song Loop</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                You build a playlist with 1,500 curated songs, hit shuffle, and hear the exact same 25 popular tracks every single day. Pseudo-random algorithms cluster around popular tracks, starving 95% of your library of airtime.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#131722] border border-red-500/20 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-lg mb-6">
                ✕
              </div>
              <h3 className="text-xl font-bold mb-3">Podcast & Video Clutter</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                The home feed is hijacked by podcasts, audiobooks, and auto-playing full-screen video previews designed to keep you scrolling rather than listening. Your music is pushed below the fold.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            How Resound Works
          </h2>
          <p className="text-slate-400">Three clean steps to pure music.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-[#131722]/50 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-[#7c3aed]/20 text-[#a78bfa] font-bold text-lg flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="font-bold text-lg mb-2">Pick Any Track</h3>
            <p className="text-slate-400 text-sm">
              Explore curated albums, playlists, or your own saved favorites with instant zero-lag loading.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-[#131722]/50 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-[#7c3aed]/20 text-[#a78bfa] font-bold text-lg flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="font-bold text-lg mb-2">Toggle True Shuffle</h3>
            <p className="text-slate-400 text-sm">
              The Fisher-Yates engine generates an unbiased random order across your entire playlist.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-[#131722]/50 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-[#7c3aed]/20 text-[#a78bfa] font-bold text-lg flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="font-bold text-lg mb-2">Enjoy The Music</h3>
            <p className="text-slate-400 text-sm">
              Sing along with synchronized lyrics, adjust high-fidelity playback, and listen uninterrupted.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-20 bg-[#0e111a] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Simple, transparent pricing.
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              No hidden traps. 1-click instant cancellation in your settings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl bg-[#131722] border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Everyday Listener</h3>
                <p className="text-slate-400 text-sm mb-6">Full streaming for students and music purists.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold">$0</span>
                  <span className="text-slate-400 text-sm">/ month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited web player streaming</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Fisher-Yates True Shuffle engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Uncapped synchronized karaoke lyrics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>100% music-only feed (no podcasts)</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/"
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-center text-sm transition-all"
              >
                Start Free
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-[#1c2233] to-[#131722] border-2 border-[#7c3aed] flex flex-col justify-between relative shadow-xl shadow-[#7c3aed]/10">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-[#7c3aed] text-white text-xs font-bold uppercase tracking-wider">
                Popular
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Resound Premium</h3>
                <p className="text-slate-400 text-sm mb-6">For audiophiles and heavy curators.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold">$9.99</span>
                  <span className="text-slate-400 text-sm">/ month or $99/year</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#a78bfa] shrink-0" />
                    <span>Everything in Everyday Listener</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#a78bfa] shrink-0" />
                    <span>Lossless studio streaming (320kbps / FLAC)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#a78bfa] shrink-0" />
                    <span>Offline cached listening</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#a78bfa] shrink-0" />
                    <span>10-band studio graphic audio equalizer</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/collection/tracks"
                className="w-full py-3 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-center text-sm transition-all shadow-lg shadow-[#7c3aed]/30 hover:scale-105"
              >
                Get Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400">Straight answers without marketing speak.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="rounded-xl bg-[#131722] border border-white/5 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-base hover:text-[#a78bfa] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${openFaq === index ? 'rotate-180 text-[#a78bfa]' : 'text-slate-400'}`} />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-4 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 bg-gradient-to-t from-[#131722] to-[#0b0d14] border-t border-white/5 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to hear your music the way it was meant to be played?
          </h2>
          <p className="text-slate-400 mb-8">
            No credit card required. No podcast clutter. Just your music and true shuffle.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-base transition-all shadow-xl shadow-[#7c3aed]/40 hover:scale-105"
          >
            Launch Resound Player
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/5 text-center text-xs text-slate-500">
        <p>© 2026 Resound. Pure Music. True Shuffle. All rights reserved.</p>
      </footer>
    </div>
  );
}
