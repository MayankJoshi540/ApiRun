import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service — APIRun',
  description: 'Terms of service, acceptable sandbox usage, and developer guidelines for APIRun.',
};

export default function TermsPage() {
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
            TERMS & AGREEMENTS
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
            Please review these terms before practicing on APIRun, deploying code into our ephemeral sandboxes, or executing automated adversarial test suites.
          </p>
          <div className="text-xs font-mono text-slate-500 pt-1">
            Last Updated: September 2026 &bull; Effective Immediately
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-sm text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span className="text-[#00f2a9] font-mono">01.</span>
              <span>Acceptance of Terms</span>
            </h2>
            <p className="text-slate-400">
              By accessing or using APIRun, creating a developer account, or triggering automated test executions against local or remote endpoints, you agree to comply with and be bound by these Terms of Service.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span className="text-[#00f2a9] font-mono">02.</span>
              <span>Acceptable Sandbox & Execution Use</span>
            </h2>
            <p className="text-slate-400">
              APIRun provides ephemeral in-memory sandboxes and automated attack harnesses for educational and engineering evaluation purposes. You agree NOT to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
              <li>Use the testing engine to initiate denial-of-service (DDoS) attacks against third-party endpoints or infrastructure not owned by you.</li>
              <li>Inject malware, malicious binaries, cryptominers, or unauthorized egress probes into execution sandboxes.</li>
              <li>Attempt to break container boundaries, circumvent memory quotas, or exploit container host operating systems.</li>
              <li>Reverse engineer or scrape APIRun challenge test suites for unauthorized commercial redistribution.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span className="text-[#00f2a9] font-mono">03.</span>
              <span>Intellectual Property & Code Ownership</span>
            </h2>
            <p className="text-slate-400">
              <strong className="text-white">Your code is yours.</strong> You retain 100% ownership, copyright, and intellectual property rights to any solutions, algorithms, and microservice implementations you write or submit to APIRun.
            </p>
            <p className="text-slate-400">
              APIRun retains all rights to the platform interface, test runners, challenge problem descriptions, scoring heuristics, and automated fuzzing test vectors.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span className="text-[#00f2a9] font-mono">04.</span>
              <span>Account Responsibility</span>
            </h2>
            <p className="text-slate-400">
              You are responsible for maintaining the confidentiality of your authentication credentials. We reserve the right to suspend or terminate accounts that repeatedly violate rate-limit policies or initiate automated abusive traffic against our test harnesses.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span className="text-[#00f2a9] font-mono">05.</span>
              <span>Disclaimer of Warranties</span>
            </h2>
            <p className="text-slate-400">
              APIRun is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. While our automated test assertions adhere strictly to RFC-9110 and production backend standards, APIRun does not guarantee that passing our challenges eliminates all potential bugs in your production environment.
            </p>
          </section>

          {/* Section 6 */}
          <div className="p-5 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-2">
            <h3 className="font-bold text-white text-sm">Need Help with Terms?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              If you have questions regarding these terms or enterprise licensing agreements, please reach out to{' '}
              <a href="mailto:legal@apirun.dev" className="text-[#00f2a9] hover:underline">
                legal@apirun.dev
              </a>.
            </p>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
