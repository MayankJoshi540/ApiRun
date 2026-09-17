import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, ArrowRight } from '@/components/ui/GoogleIcon';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: '404 — Endpoint Not Found | APIRun',
  description: 'The requested route does not exist on this cluster.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050708] text-slate-100 font-sans selection:bg-[#10b981] selection:text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full px-6 py-5 flex items-center justify-between border-b border-white/[0.08] bg-[#070a10]/80 backdrop-blur-xl">
        <Link 
          href="/"
          className="flex items-center space-x-2 transition-transform hover:scale-105"
        >
          <span className="font-mono text-base font-extrabold text-[#10b981]">&#123;&bull;&gt;&#125;</span>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-white">API</span>
            <span className="text-[#10b981]">Run</span>
          </span>
        </Link>

        <Link
          href="/challenges"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
        >
          <Compass className="w-3.5 h-3.5 text-[#10b981]" />
          <span>Explore Challenges</span>
        </Link>
      </header>

      {/* Main 404 Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center text-center space-y-8 my-auto">
        {/* Monospace Code Pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium">
          <span>HTTP 404 NOT FOUND</span>
          <span>&bull;</span>
          <span>RFC-9110 &sect;15.5.5</span>
        </div>

        {/* Big Headline */}
        <div className="space-y-3 max-w-lg">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-mono font-black text-white tracking-tight">
            4<span className="text-[#10b981]">0</span>4
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-200 tracking-tight">
            Endpoint Does Not Exist
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            The target route could not be resolved by our gateway. The resource might have been deprecated, shifted, or was never provisioned.
          </p>
        </div>

        {/* Mock JSON Terminal Response Card */}
        <div className="w-full max-w-md rounded-2xl bg-[#080d14] border border-white/[0.1] p-4 text-left font-mono text-xs shadow-2xl space-y-2 select-none">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[11px] text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]/80" />
              <span className="text-slate-400 font-sans ml-1.5">gateway error dispatch</span>
            </div>
            <span className="text-amber-400">404</span>
          </div>
          <pre className="text-slate-300 overflow-x-auto leading-relaxed pt-1">
{`{
  "status": 404,
  "error": "ROUTE_NOT_FOUND",
  "message": "No matching handler registered for route.",
  "cluster": "apirun-prod-edge-01"
}`}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/challenges"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs transition-all flex items-center justify-center space-x-2 active:scale-95 shadow-md"
          >
            <span>Browse Challenges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white border border-white/[0.1] font-semibold text-xs transition-all flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
