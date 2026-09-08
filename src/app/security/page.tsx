import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Terminal, CheckCircle2, Server, Cpu } from 'lucide-react';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Security & Disclosure — APIRun',
  description: 'APIRun security architecture, sandbox isolation guarantees, and responsible disclosure policy.',
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#050708] text-slate-100 font-sans selection:bg-[#00f2a9] selection:text-black flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full px-6 py-5 flex items-center justify-between border-b border-white/[0.08] bg-[#070a10]/80 backdrop-blur-xl sticky top-0 z-40">
        <Link 
          href="/"
          className="flex items-center space-x-2 transition-transform hover:scale-105"
        >
          <span className="font-mono text-base font-extrabold text-[#00f2a9]">&#123;&bull;&gt;&#125;</span>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-white">API</span>
            <span className="text-[#00f2a9]">Run</span>
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            href="/challenges"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#00f2a9]" />
            <span>Back to Challenges</span>
          </Link>
        </div>
      </header>

      {/* Main Document Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Header Hero */}
        <div className="space-y-4 border-b border-white/[0.08] pb-8">
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
            INFRASTRUCTURE & DISCLOSURE
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Security Architecture & Practices
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
            How APIRun ensures safe code execution, rigorous container sandboxing, and zero data leakage across local and cloud environments.
          </p>
          <div className="text-xs font-mono text-slate-500 pt-1">
            Security Contact: <span className="text-[#00f2a9]">security@apirun.dev</span> &bull; PGP Fingerprint Available
          </div>
        </div>

        {/* Technical Architecture Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#090d14] border border-white/[0.08] space-y-2">
            <div className="flex items-center space-x-2 text-[#00f2a9]">
              <Server className="w-4 h-4" />
              <span className="font-bold text-xs text-white">Ephemeral Sandbox Isolation</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every code run and test execution is provisioned inside an ephemeral, non-root in-memory sandbox. Containers are destroyed immediately upon test completion.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090d14] border border-white/[0.08] space-y-2">
            <div className="flex items-center space-x-2 text-sky-400">
              <Lock className="w-4 h-4" />
              <span className="font-bold text-xs text-white">Egress Network Restriction</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sandboxes operate under strict egress filtering. Outbound network requests to external public IP addresses or non-whitelisted domains are dropped at the packet filter level.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090d14] border border-white/[0.08] space-y-2">
            <div className="flex items-center space-x-2 text-amber-400">
              <Cpu className="w-4 h-4" />
              <span className="font-bold text-xs text-white">Strict Resource Limits</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              CPU limits (max 1 vCPU per run), strict memory caps (128MB), and execution timeouts (max 15s) prevent infinite loops, memory leaks, and compute exhaustion attacks.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090d14] border border-white/[0.08] space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-bold text-xs text-white">Zero Local Target Telemetry</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              When verifying endpoints running on your localhost, test requests remain strictly client-side. Your internal response payloads are never relayed to our database servers.
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-sm text-slate-300 leading-relaxed pt-4 border-t border-white/[0.08]">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span className="text-[#00f2a9] font-mono">01.</span>
              <span>Authentication & Session Security</span>
            </h2>
            <p className="text-slate-400">
              Authentication is handled via Clerk Enterprise with asymmetric RS256 token signing, rotating refresh keys, rate-limited login endpoints, and brute-force protection. Passwords are never stored or logged in plain text.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span className="text-[#00f2a9] font-mono">02.</span>
              <span>Adversarial Test Suite Bounds</span>
            </h2>
            <p className="text-slate-400">
              Our automated fuzzers simulate RFC boundary attacks (e.g., malformed payloads, timestamp manipulation, idempotency replays, and concurrent bursts). These tests are strictly calibrated to adhere to RFC-9110 specification compliance and do not execute exploits against underlying operating system kernels.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span className="text-[#00f2a9] font-mono">03.</span>
              <span>Responsible Vulnerability Disclosure</span>
            </h2>
            <p className="text-slate-400">
              We welcome reports from security researchers and developers. If you discover a potential vulnerability in APIRun infrastructure or sandbox isolation:
            </p>
            <div className="p-4 rounded-xl bg-[#090d14] border border-white/[0.08] space-y-2 text-xs">
              <div className="text-white font-semibold">Disclosure Protocol:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                <li>Email details directly to <span className="text-[#00f2a9] font-mono">security@apirun.dev</span>.</li>
                <li>Please include reproducible steps, target endpoints, and proof-of-concept payloads.</li>
                <li>Allow our engineering team 48 hours to assess the report before public disclosure.</li>
                <li>Do NOT access, modify, or exfiltrate other users&apos; accounts or submissions during testing.</li>
              </ul>
            </div>
          </section>

          {/* Safe Harbor */}
          <div className="p-5 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-2">
            <h3 className="font-bold text-white text-sm">Security Safe Harbor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              If you conduct vulnerability research in good faith and in compliance with this policy, we consider your actions authorized and will not initiate legal action against you.
            </p>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
