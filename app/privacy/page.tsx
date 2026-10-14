import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - Resound',
  description: 'Resound Privacy Policy and Data Processor Disclosures.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0b0d14] text-white selection:bg-[#7c3aed] selection:text-white px-6 py-12 max-w-4xl mx-auto">
      <Link 
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Player
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/20 text-[#a78bfa] flex items-center justify-center">
          <Shield className="w-5 h-5" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      </div>

      <p className="text-sm text-slate-400 mb-8">
        Last updated: October 15, 2026. Resound is dedicated to music listening privacy. We do not sell your personal data or track your behavior across external websites.
      </p>

      <div className="space-y-8 text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-8">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
          <p className="mb-2">We collect only the minimal data required to deliver audio streaming and account persistence:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong>Account Data:</strong> Email address and encrypted password when you create an account.</li>
            <li><strong>Listening Data:</strong> Saved playlists, liked tracks, and audio playback settings (e.g. True Shuffle state, volume).</li>
            <li><strong>Payment Data:</strong> Billing status and customer identifier handled directly by our payment processor. We never store credit card numbers on our servers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Third-Party Data Processors</h2>
          <p className="mb-3">To provide reliable cloud infrastructure, Resound utilizes the following external processors:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#131722] border border-white/5">
              <span className="font-bold text-white block mb-1">Supabase Inc.</span>
              <span className="text-slate-400 block mb-2">PostgreSQL Database & Auth</span>
              <span className="text-slate-500">United States / GDPR Compliant</span>
            </div>
            <div className="p-4 rounded-xl bg-[#131722] border border-white/5">
              <span className="font-bold text-white block mb-1">Stripe Inc.</span>
              <span className="text-slate-400 block mb-2">Payment Processing & Subscriptions</span>
              <span className="text-slate-500">PCI-DSS Level 1 Certified</span>
            </div>
            <div className="p-4 rounded-xl bg-[#131722] border border-white/5">
              <span className="font-bold text-white block mb-1">Vercel Inc.</span>
              <span className="text-slate-400 block mb-2">Edge Hosting & Static CDN</span>
              <span className="text-slate-500">Global Edge Network</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Cookie & Local Storage Usage</h2>
          <p className="text-slate-400">
            Resound does not use third-party advertising cookies or cross-site behavioral tracking scripts. We utilize standard browser LocalStorage solely to maintain your volume preferences, active queue, and session authentication tokens.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Account Deletion & Right to Erasure (GDPR / CCPA)</h2>
          <p className="text-slate-400 mb-3">
            You maintain full ownership of your data. You may request immediate and permanent deletion of your account, saved playlists, and streaming records at any time by calling our deletion endpoint or emailing support@resoundmusic.app.
          </p>
          <div className="p-4 rounded-xl bg-[#131722] border border-white/5 text-xs text-slate-400">
            Account deletion requests are processed automatically and purge all database rows within 24 hours.
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Contact Information</h2>
          <p className="text-slate-400">
            For privacy inquiries, data export requests, or erasure demands, contact our privacy officer at <span className="text-[#a78bfa]">privacy@resoundmusic.app</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
