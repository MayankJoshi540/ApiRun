'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Server, Cpu } from '@/components/ui/GoogleIcon';
import { BackendRankNavbar } from '@/components/BackendRankNavbar';
import { Footer } from '@/components/Footer';

export default function SecurityPage() {
  const router = useRouter();

  const handleNavigate = (tab: 'landing' | 'challenges' | 'progress' | 'feedback' | 'dashboard') => {
    if (tab === 'landing') router.push('/');
    else if (tab === 'challenges' || tab === 'dashboard') router.push('/challenges');
    else if (tab === 'progress') router.push('/progress');
    else router.push('/feedback');
  };

  return (
    <div className="min-h-screen bg-[#050708] text-[#F5F7FA] font-sans antialiased relative selection:bg-emerald-500/30 selection:text-white flex flex-col justify-between">
      
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
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>INFRASTRUCTURE &amp; DISCLOSURE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Security Architecture
          </h1>

          <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            How APIRun ensures safe code execution, rigorous container sandboxing, and zero data leakage across local and cloud environments.
          </p>

          <div className="text-xs font-mono text-zinc-500 pt-1">
            Security Contact: <span className="text-emerald-400">security@apirun.dev</span> &bull; Responsible Disclosure Policy
          </div>
        </div>

        {/* Technical Architecture Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-5 rounded-2xl bg-[#0a0f16] border border-white/[0.08] space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Server className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs text-emerald-300 uppercase tracking-wider font-mono">Ephemeral Sandboxes</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every code run and test execution is provisioned inside an ephemeral, non-root in-memory sandbox. Containers are destroyed immediately upon test completion.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a0f16] border border-white/[0.08] space-y-1.5">
            <div className="flex items-center space-x-2 text-sky-400">
              <Lock className="w-4 h-4 text-sky-400" />
              <span className="font-bold text-xs text-sky-300 uppercase tracking-wider font-mono">Egress Restriction</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Sandboxes operate under strict egress filtering. Outbound network requests to external public IP addresses are blocked at the socket level.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a0f16] border border-white/[0.08] space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-400">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-xs text-amber-300 uppercase tracking-wider font-mono">Strict Resource Limits</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              CPU limits (max 1 vCPU), strict memory caps (128MB), and execution timeouts (max 15s) prevent infinite loops and compute exhaustion.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a0f16] border border-white/[0.08] space-y-1.5">
            <div className="flex items-center space-x-2 text-teal-400">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span className="font-bold text-xs text-teal-300 uppercase tracking-wider font-mono">Zero Local Target Telemetry</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              When verifying endpoints running on your localhost, test requests remain strictly client-side. Response payloads are never relayed to our servers.
            </p>
          </div>
        </div>

        {/* Security Policy Card */}
        <div className="rounded-2xl bg-[#0a0f16] border border-white/[0.08] p-6 sm:p-9 space-y-7 leading-relaxed text-sm text-zinc-300">
          
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-white font-display flex items-center space-x-2">
              <span className="text-emerald-400 font-mono">01.</span>
              <span>Authentication &amp; Session Security</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Authentication is handled with asymmetric RS256 token signing, rotating refresh keys, rate-limited login endpoints, and brute-force protection. Passwords are never stored or logged in plain text.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-white font-display flex items-center space-x-2">
              <span className="text-emerald-400 font-mono">02.</span>
              <span>Adversarial Test Suite Bounds</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Our automated fuzzers simulate RFC boundary attacks (e.g., malformed payloads, timestamp manipulation, idempotency replays, and concurrent bursts). These tests are strictly calibrated to adhere to RFC-9110 HTTP specification compliance without kernel exploits.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-white font-display flex items-center space-x-2">
              <span className="text-emerald-400 font-mono">03.</span>
              <span>Responsible Vulnerability Disclosure</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              We welcome reports from security researchers and developers. If you discover a potential vulnerability in APIRun infrastructure:
            </p>
            <div className="p-4 rounded-xl bg-[#05070a] border border-white/[0.06] space-y-1.5 text-xs">
              <div className="text-white font-semibold">Disclosure Protocol:</div>
              <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-1">
                <li>Email details directly to <span className="text-emerald-400 font-mono">security@apirun.dev</span>.</li>
                <li>Please include reproducible steps, target endpoints, and proof-of-concept payloads.</li>
                <li>Allow our engineering team 48 hours to assess the report before public disclosure.</li>
              </ul>
            </div>
          </section>

        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
