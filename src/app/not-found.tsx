import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, ArrowRight } from '@/components/ui/GoogleIcon';
import { Footer } from '@/components/Footer';
import { AppBackground } from '@/components/ui/AppBackground';

export const metadata = {
  title: '404 — Endpoint Not Found | APIRun',
  description: 'The requested route does not exist on this cluster.',
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#050708] text-[#F5F7FA] font-sans antialiased selection:bg-emerald-500/30 selection:text-white flex flex-col justify-between overflow-hidden">
      {/* Home Page Background Artwork */}
      <AppBackground />

      {/* Top Header */}
      <header className="relative z-50 w-full pt-4 sm:pt-6 px-4 sm:px-6 font-sans">
        <div className="max-w-5xl mx-auto rounded-full px-5 sm:px-6 h-14 sm:h-16 flex items-center justify-between bg-[#05070a]/80 border border-white/[0.1] shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <Link 
            href="/"
            className="flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95 group"
          >
            <div className="flex items-center font-mono text-base sm:text-lg font-extrabold text-emerald-400 tracking-tighter">
              &#123;&bull;&gt;&#125;
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight font-sans">
              <span className="text-white">API</span>
              <span className="text-emerald-400">Run</span>
            </span>
          </Link>

          <Link
            href="/challenges"
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Explore Challenges</span>
          </Link>
        </div>
      </header>

      {/* Main 404 Area */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center text-center space-y-8 my-auto">
        {/* Monospace Code Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>HTTP 404 NOT FOUND</span>
          <span>&bull;</span>
          <span>Page Not Found</span>
        </div>

        {/* Big Headline */}
        <div className="space-y-3 max-w-lg">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-mono font-black text-white tracking-tight drop-shadow-sm">
            4<span className="text-emerald-400">0</span>4
          </h1>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Page Not Found
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-md mx-auto">
            The page you requested does not exist or may have been moved. Check the URL or browse our challenge catalog.
          </p>
        </div>

        {/* Mock JSON Terminal Response Card */}
        <div className="w-full max-w-md rounded-2xl bg-[#090d14]/90 border border-white/[0.12] p-5 text-left font-mono text-xs shadow-2xl space-y-3 backdrop-blur-xl select-none">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 text-[11px] text-zinc-400">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-zinc-400 font-sans ml-1.5 text-xs">server response</span>
            </div>
            <span className="text-amber-400 font-semibold">404</span>
          </div>
          <pre className="text-emerald-400/90 overflow-x-auto leading-relaxed pt-1 font-mono text-xs">
{`{
  "status": 404,
  "error": "NOT_FOUND",
  "message": "The requested route does not exist."
}`}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full max-w-xs sm:max-w-none">
          <Link
            href="/challenges"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 active:scale-95 shadow-md shadow-emerald-950/40"
          >
            <span>Browse Challenges</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white border border-white/[0.1] font-semibold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
