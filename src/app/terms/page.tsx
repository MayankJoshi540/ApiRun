'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Scale, Code2, Shield, Lock } from '@/components/ui/GoogleIcon';
import { BackendRankNavbar } from '@/components/BackendRankNavbar';
import { Footer } from '@/components/Footer';

export default function TermsPage() {
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-20 space-y-8 relative z-10 flex-grow w-full">
        
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-wider font-mono">
            <Scale className="w-3.5 h-3.5" />
            <span>TERMS &amp; AGREEMENTS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Terms of Service
          </h1>

          <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Please review these terms before practicing on APIRun, deploying code into our ephemeral sandboxes, or executing automated test suites.
          </p>

          <div className="text-xs font-mono text-zinc-500 pt-1">
            Last Updated: September 2026 &bull; Effective Immediately
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div className="p-4 rounded-xl bg-[#0a0f16] border border-white/[0.08] space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>100% Code Ownership</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              You retain full intellectual property rights to all code, APIs, and algorithms you write.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0f16] border border-white/[0.08] space-y-1.5">
            <div className="flex items-center space-x-2 text-sky-400 font-bold">
              <Shield className="w-4 h-4 text-sky-400" />
              <span>Fair Sandbox Use</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Execution environments are provided for educational evaluation and system verification.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0f16] border border-white/[0.08] space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Adversarial Bounds</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Automated tests adhere strictly to RFC-9110 HTTP specifications without OS-level exploits.
            </p>
          </div>
        </div>

        {/* Policy Document Card */}
        <div className="rounded-2xl bg-[#0a0f16] border border-white/[0.08] p-6 sm:p-9 space-y-7 leading-relaxed text-sm text-zinc-300">
          
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-white font-display flex items-center space-x-2">
              <span className="text-emerald-400 font-mono">01.</span>
              <span>Acceptance of Terms</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              By accessing or using APIRun, creating a developer account, or triggering automated test executions against local or remote endpoints, you agree to comply with and be bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-white font-display flex items-center space-x-2">
              <span className="text-emerald-400 font-mono">02.</span>
              <span>Acceptable Sandbox &amp; Execution Use</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              APIRun provides ephemeral in-memory sandboxes and automated attack harnesses for educational and engineering evaluation purposes. You agree NOT to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-xs sm:text-sm pl-2">
              <li>Use the testing engine to initiate denial-of-service (DDoS) attacks against third-party endpoints.</li>
              <li>Inject malware, cryptominers, or unauthorized egress probes into execution sandboxes.</li>
              <li>Attempt to circumvent memory quotas or exploit host operating systems.</li>
            </ul>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-white font-display flex items-center space-x-2">
              <span className="text-emerald-400 font-mono">03.</span>
              <span>Intellectual Property</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              <strong className="text-white">Your code is yours.</strong> You retain 100% copyright to any solutions and microservice implementations you write. APIRun retains all rights to the platform interface, test harnesses, and problem descriptions.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-white font-display flex items-center space-x-2">
              <span className="text-emerald-400 font-mono">04.</span>
              <span>Contact Legal</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              If you have questions regarding these terms or enterprise licensing agreements, please reach out to{' '}
              <a href="mailto:legal@apirun.dev" className="text-emerald-400 underline hover:text-emerald-300">
                legal@apirun.dev
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
