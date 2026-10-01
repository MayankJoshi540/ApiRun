'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Server, Activity } from '@/components/ui/GoogleIcon';
import { BackendRankNavbar } from '@/components/BackendRankNavbar';
import { Footer } from '@/components/Footer';
import { AppBackground } from '@/components/ui/AppBackground';

export default function PrivacyPage() {
  const router = useRouter();

  const handleNavigate = (tab: 'landing' | 'challenges' | 'progress' | 'feedback' | 'dashboard') => {
    if (tab === 'landing') router.push('/');
    else if (tab === 'challenges' || tab === 'dashboard') router.push('/challenges');
    else if (tab === 'progress') router.push('/progress');
    else router.push('/feedback');
  };

  return (
    <div className="min-h-screen bg-[#050708] text-[#F5F7FA] font-sans antialiased relative selection:bg-emerald-500/30 selection:text-white flex flex-col justify-between overflow-hidden">
      {/* Home Page Background Artwork */}
      <AppBackground />
      
      {/* Floating Top Navbar */}
      <BackendRankNavbar
        activeTab="feedback"
        onSelectTab={handleNavigate}
        solvedCount={0}
        totalCount={12}
      />

      {/* Main Document Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20 space-y-8 relative z-10 flex-grow w-full">
        
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-wider font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>TRANSPARENCY &amp; PRIVACY</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            How APIRun collects, protects, and handles developer source code, execution telemetry, and local testing requests.
          </p>

          <div className="text-xs font-mono text-zinc-500 pt-1">
            Effective Date: September 2026 &bull; Strict Zero Code Storage Policy
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div className="p-4 rounded-xl bg-[#0a0f16] border border-white/[0.08] space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Isolated Code Runs</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Code runs in secure temporary sandboxes and is wiped immediately after test completion.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0f16] border border-white/[0.08] space-y-1.5">
            <div className="flex items-center space-x-2 text-sky-400 font-bold">
              <Server className="w-4 h-4 text-sky-400" />
              <span>Private Local Testing</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Localhost tests run directly on your machine. Your internal data stays private and never leaves your computer.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0f16] border border-white/[0.08] space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Minimal Stats</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              We only track challenge completion status and solve times to save your personal progress.
            </p>
          </div>
        </div>

        {/* Policy Document Card */}
        <div className="rounded-2xl bg-[#0a0f16] border border-white/[0.08] p-6 sm:p-9 space-y-7 leading-relaxed text-sm text-zinc-300">
          
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-white font-display flex items-center space-x-2">
              <span className="text-emerald-400 font-mono">01.</span>
              <span>Information We Collect</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              When you sign up or sign in to APIRun, we store basic profile details (your email and name) to save your challenge progress and completion streaks.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-white font-display flex items-center space-x-2">
              <span className="text-emerald-400 font-mono">02.</span>
              <span>Your Code Privacy</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Your solution code belongs exclusively to you. APIRun does not sell or share user code with third parties. Code executed in test runs is discarded as soon as tests finish.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-white font-display flex items-center space-x-2">
              <span className="text-emerald-400 font-mono">03.</span>
              <span>Cookies &amp; Local Storage</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              We use standard browser localStorage to cache your active challenge draft and editor theme preferences so your work is never lost between page reloads, even when offline.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-white font-display flex items-center space-x-2">
              <span className="text-emerald-400 font-mono">04.</span>
              <span>Contact Us</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              If you have any questions or data removal requests regarding this privacy policy, please reach out to us at{' '}
              <a href="mailto:privacy@apirun.dev" className="text-emerald-400 underline hover:text-emerald-300">
                privacy@apirun.dev
              </a>.
            </p>
          </section>

        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
