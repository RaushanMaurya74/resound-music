import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - Resound',
  description: 'Resound Terms of Service and Subscription Agreement.',
};

export default function TermsPage() {
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
          <FileText className="w-5 h-5" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      </div>

      <p className="text-sm text-slate-400 mb-8">
        Last updated: October 15, 2026. Please read these terms carefully before using Resound.
      </p>

      <div className="space-y-8 text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-8">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Service Agreement</h2>
          <p className="text-slate-400">
            Resound provides a distraction-free audio streaming platform featuring mathematical True Shuffle and synchronized lyrics. By accessing or using Resound, you agree to comply with these terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Acceptable Use</h2>
          <p className="mb-2 text-slate-400">You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Attempt to scrape, reverse-engineer, or rip proprietary audio streams.</li>
            <li>Resell or redistribute Resound audio streams without authorization.</li>
            <li>Use automated scripts or bots to manipulate play counts.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Subscriptions & One-Click Cancellation</h2>
          <p className="text-slate-400 mb-2">
            Resound Premium subscriptions are billed on a recurring monthly ($9.99/mo) or annual ($99.00/yr) basis via Stripe.
          </p>
          <p className="text-slate-400">
            <strong>Cancellation Guarantee:</strong> You may cancel your subscription at any time with a single click in your account settings. Cancellation takes effect at the end of the current billing period with zero cancellation fees. Annual subscribers receive an email reminder 7 days prior to renewal.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Intellectual Property</h2>
          <p className="text-slate-400">
            Resound, the sound-wave logo, and related brand assets are proprietary trademarks of Resound. All music tracks and artist audio metadata are property of their respective creators and licensors.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Disclaimer & Limitation of Liability</h2>
          <p className="text-slate-400">
            The service is provided &ldquo;as is&rdquo; without warranties of any kind. Resound shall not be liable for indirect, incidental, or consequential damages resulting from audio playback interruptions or service downtime.
          </p>
        </section>
      </div>
    </div>
  );
}
