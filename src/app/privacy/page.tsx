import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy — APIRun',
  description: 'APIRun privacy policy, data practices, sandbox isolation, and telemetry transparency.',
};

export default function PrivacyPage() {
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
            LEGAL & TRANSPARENCY
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
            This policy outlines how APIRun collects, protects, and handles developer data, local testing instances, and challenge telemetry.
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
              <span>Information We Collect</span>
            </h2>
            <p className="text-slate-400">
              When you interact with the APIRun platform, we collect minimal information necessary to deliver automated challenge evaluation and track skill progression:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
              <li><strong className="text-slate-200">Account Data:</strong> Email address, developer handle, and authentication identifiers provided through our identity provider (Clerk).</li>
              <li><strong className="text-slate-200">Challenge Submissions:</strong> Code snippets, test execution assertions, latency benchmarks, and challenge completion status.</li>
              <li><strong className="text-slate-200">Local Testing Targets:</strong> URLs specified for local runner testing (e.g., <code className="font-mono text-xs text-emerald-400">http://localhost:8000</code>). We evaluate assertions against these endpoints purely ephemerally.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span className="text-[#00f2a9] font-mono">02.</span>
              <span>Local Runner & Endpoint Privacy</span>
            </h2>
            <p className="text-slate-400">
              When you use the APIRun CLI (<code className="font-mono text-xs text-[#00f2a9]">npx apirun test</code>) or browser-to-local dispatch:
            </p>
            <div className="p-4 rounded-xl bg-[#090d14] border border-white/[0.08] space-y-2 font-mono text-xs text-slate-400">
              <div className="text-emerald-400 font-semibold">// Zero Payload Leakage Guarantee</div>
              <p>
                All HTTP test verification payloads sent to your local target are generated locally or in ephemeral browser execution sandboxes. We never record or store internal database rows, proprietary business logic, or environment secrets returned by your local server.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span className="text-[#00f2a9] font-mono">03.</span>
              <span>How We Use Your Data</span>
            </h2>
            <p className="text-slate-400">
              Collected information is strictly used for the following platform functions:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
              <li>Calculating solve rates, streak progression, and global backend rank leaderboards.</li>
              <li>Providing detailed execution reports and p99 latency breakdowns for your submissions.</li>
              <li>Preventing platform abuse, automated DDoS against public sandboxes, or race condition exploits.</li>
              <li>Authenticating your session and persisting completed challenges across devices.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span className="text-[#00f2a9] font-mono">04.</span>
              <span>Third-Party Services</span>
            </h2>
            <p className="text-slate-400">
              We partner with trusted infrastructure and security vendors to host and operate the platform:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
              <li><strong className="text-slate-200">Clerk:</strong> Secure authentication, password hashing, and OAuth session management.</li>
              <li><strong className="text-slate-200">Vercel:</strong> Edge network hosting, serverless compute functions, and static assets.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span className="text-[#00f2a9] font-mono">05.</span>
              <span>Data Retention & Developer Rights</span>
            </h2>
            <p className="text-slate-400">
              You maintain complete control over your account. You may request full deletion of your submission history, challenge metrics, and profile at any time by contacting our engineering team.
            </p>
          </section>

          {/* Contact */}
          <div className="p-5 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-2">
            <h3 className="font-bold text-white text-sm">Have Questions Regarding Your Data?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              If you have inquiries regarding privacy practices or wish to request data export under GDPR/CCPA, email us at{' '}
              <a href="mailto:privacy@apirun.dev" className="text-[#00f2a9] hover:underline">
                privacy@apirun.dev
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
