'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Terminal, 
  CheckCircle2, 
  XCircle,
  Play, 
  Shield, 
  Database, 
  Cpu, 
  Layers, 
  Check, 
  Zap, 
  Lock, 
  Clock, 
  Server, 
  Activity, 
  ChevronRight, 
  GitBranch, 
  RefreshCw, 
  ArrowUpRight, 
  Code2, 
  Boxes, 
  Gauge, 
  TerminalSquare, 
  Copy, 
  Flame, 
  Radio, 
  FileCode2, 
  Sliders, 
  CheckCheck, 
  AlertTriangle, 
  Network, 
  Binary, 
  Layers2, 
  Share2,
  MessageSquarePlus,
} from '@/components/ui/GoogleIcon';
import { Challenge } from '../types';
import { DifficultyBadge } from './DifficultyBadge';
import { ConceptBadge } from './ConceptBadge';
import { Hero } from './hero/Hero';
import { Footer } from './Footer';
import { ChallengeShowcaseScroll } from './ChallengeShowcaseScroll';
import { BackendTechMarquee } from './BackendTechMarquee';
import { ScrollReveal, StaggerContainer } from './ui/ScrollReveal';
import { ScrollProgress } from './ui/ScrollProgress';
import { GsapTilt } from './gsap/GsapTilt';
import { GsapMagnetic } from './gsap/GsapMagnetic';
import { GsapCounter } from './gsap/GsapCounter';
import { gsap } from '@/lib/gsap';

interface Props {
  challenges: Challenge[];
  onSelectChallenge: (challenge: Challenge) => void;
  onExploreChallenges: () => void;
  onNavigateProgress: () => void;
}

export const LandingPageView: React.FC<Props> = ({
  challenges,
  onSelectChallenge,
  onExploreChallenges,
  onNavigateProgress
}) => {
  const [copiedCli, setCopiedCli] = useState(false);
  const [selectedCliLang, setSelectedCliLang] = useState<'nodejs' | 'go' | 'python'>('nodejs');

  const handleCopyCli = () => {
    navigator.clipboard.writeText('npx apirun test --target http://localhost:8000 --challenge create-user-api');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const previewChallenges = challenges.slice(0, 4);

  const conceptTags = [
    'HTTP/REST RFC-9110', 'REDIS DISTRIBUTED LOCKS', 'SLIDING WINDOW RATE LIMITER', 
    'IDEMPOTENCY KEYS', 'JWT REFRESH ROTATION', 'ASYNCHRONOUS JOB WORKERS', 'STRIPE WEBHOOK HMAC'
  ];

  const comparisonRows = [
    {
      feature: 'Core Challenge Type',
      traditional: 'Inverting binary trees, synthetic array index manipulation, and abstract dynamic programming.',
      apirun: 'Implementing production REST endpoints, JSON payload schemas, route mutations, and auth headers.',
      highlight: true
    },
    {
      feature: 'Edge Case Verification',
      traditional: 'Null array bounds, artificial timeout limits (TLE), and integer overflow limits.',
      apirun: '50-thread concurrent race conditions, Redis rate limiter bursts, and idempotency key replays.',
      highlight: true
    },
    {
      feature: 'Protocol Semantics',
      traditional: 'Single stdout string print match (e.g. System.out.println("true")).',
      apirun: 'Strict RFC-9110 HTTP status codes (200, 201, 400, 404, 409, 422, 429) & Content-Type validation.',
      highlight: false
    },
    {
      feature: 'State & Infrastructure',
      traditional: 'None. In-memory ephemeral scratchpad that resets on every execution.',
      apirun: 'Real Redis keyspaces, distributed mutex locks, ACID database transactions, and rollback isolation.',
      highlight: true
    },
    {
      feature: 'Developer Workflow',
      traditional: 'Constrained browser text box with mock driver code and hidden artificial test harnesses.',
      apirun: 'In-browser Monaco Editor or your actual local IDE via native CLI (npx apirun test).',
      highlight: false
    },
    {
      feature: 'Industry & Job Relevance',
      traditional: 'Rarely encountered in real-world backend microservices or distributed systems.',
      apirun: 'Directly mirrors Senior & Staff backend engineering responsibilities and system design live coding.',
      highlight: true
    }
  ];

  const engineeringTracks = [
    {
      number: '01',
      title: 'Concurrency & Distributed Mutexes',
      badge: 'High Concurrency',
      description: 'Defend against race conditions, phantom reads, and double spend errors using distributed locks, Redis Redlock, and optimistic locking strategies.',
      skills: ['Mutex Locks', 'Redis Redlock', 'Optimistic Locking', 'Deadlock Detection']
    },
    {
      number: '02',
      title: 'Traffic Shaping & Rate Limiting',
      badge: 'Traffic Architecture',
      description: 'Implement atomic sliding-window counters, token buckets, and leaky bucket algorithms tested under 1,000 req/sec burst attacks.',
      skills: ['Sliding Window', 'Redis Lua Scripts', 'HTTP 429 Retry-After', 'Token Bucket']
    },
    {
      number: '03',
      title: 'Financial Idempotency & Webhooks',
      badge: 'Payment Reliability',
      description: 'Handle Stripe and payment webhook replays safely with HMAC-SHA256 signature verification and atomic database deduplication keys.',
      skills: ['HMAC-SHA256', 'Idempotency-Key Header', 'Atomic Deduplication', 'At-Least-Once Delivery']
    },
    {
      number: '04',
      title: 'RFC HTTP & Schema Contract Design',
      badge: 'API Architecture',
      description: 'Master strict RFC-9110 HTTP semantics, status code precision (201 Created vs 200, 422 Unprocessable vs 400), and payload contracts.',
      skills: ['RFC-9110 Semantics', 'JSON Schema Validation', 'Header Negotiation', 'RFC-5322 Boundaries']
    },
    {
      number: '05',
      title: 'Asynchronous Job Queues & Workers',
      badge: 'Distributed Systems',
      description: 'Build reliable background job workers with delayed retry queues, dead-letter exchanges (DLX), and worker heartbeat coordination.',
      skills: ['Dead Letter Queues', 'Exponential Backoff', 'Worker Ack/Nack', 'Job Deduplication']
    },
    {
      number: '06',
      title: 'Auth, JWT & Session Security',
      badge: 'Authentication',
      description: 'Implement dual-token rotating authentication, asymmetric RS256 signing, refresh token rotation, and distributed revocation blacklists.',
      skills: ['RS256 JWT Signing', 'Refresh Token Rotation', 'Token Blacklisting', 'Role-Based Access (RBAC)']
    }
  ];

  return (
    <div className="min-h-screen bg-[#050708] text-[#f8fafc] font-sans selection:bg-emerald-500/30 selection:text-white relative overflow-x-hidden">
      {/* 1. Global Page Technical Background Atmosphere (Extends down the entire page) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Continuous Technical Dot Matrix */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Faint Coordinate Grid */}
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(16, 185, 129, 0.35) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(16, 185, 129, 0.35) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px'
          }}
        />
      </div>

      {/* 2. Hero Section */}
      <Hero
        onLaunchArena={() => onSelectChallenge(challenges[0] || challenges[1])}
        onBrowseTracks={onExploreChallenges}
      />

      <div className="relative z-10">

        {/* ========================================================= */}
        {/* HERO SHOWCASE: SCROLL-TRIGGERED CHALLENGES DASHBOARD PREVIEW */}
        {/* ========================================================= */}
        <ChallengeShowcaseScroll onExploreChallenges={onExploreChallenges} />

        {/* ========================================================= */}
        {/* INFINITE BACKEND LANGUAGES & RUNTIMES 3D MARQUEE */}
        {/* ========================================================= */}
        <ScrollReveal variant="fade-up" duration={700}>
          <BackendTechMarquee />
        </ScrollReveal>

        {/* ========================================================= */}
        {/* GSAP ANIMATED METRICS COUNTER STRIP */}
        {/* ========================================================= */}
        <section className="pt-2 pb-12 px-4 sm:px-6 max-w-5xl mx-auto">
          <ScrollReveal variant="fade-up" duration={600}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-[#090d14]/90 border border-white/[0.08] backdrop-blur-xl">
              <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-xl sm:text-2xl font-black font-mono text-white flex items-center justify-center">
                  <GsapCounter value={50000} duration={2} prefix="" suffix="+" />
                </div>
                <div className="text-[11px] font-sans font-medium text-[#94a3b8] uppercase tracking-wider mt-1">
                  Automated Tests Run
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 flex items-center justify-center">
                  <GsapCounter value={99.9} decimals={1} duration={1.8} prefix="" suffix="%" />
                </div>
                <div className="text-[11px] font-sans font-medium text-[#94a3b8] uppercase tracking-wider mt-1">
                  Spec Compliance
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-xl sm:text-2xl font-black font-mono text-white flex items-center justify-center">
                  <GsapCounter value={100} duration={1.6} prefix="" suffix="+" />
                </div>
                <div className="text-[11px] font-sans font-medium text-[#94a3b8] uppercase tracking-wider mt-1">
                  Backend Scenarios
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-xl sm:text-2xl font-black font-mono text-sky-400 flex items-center justify-center">
                  &lt;<GsapCounter value={15} duration={1.5} prefix="" suffix="ms" />
                </div>
                <div className="text-[11px] font-sans font-medium text-[#94a3b8] uppercase tracking-wider mt-1">
                  Test Feedback
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================= */}
        {/* THE LEETCODE VS APIRUN COMPARISON MATRIX */}
        {/* ========================================================= */}
        <section id="compare-matrix" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto space-y-12 font-sans select-none">
          <ScrollReveal variant="fade-up" duration={600}>
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
                Why <span className="text-white">Leet</span><span className="text-[#FFA116]">Code</span> Doesn&apos;t Make You Ready for Real Backend Engineering
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed pt-1 font-normal">
                Competitive programming tests whether you memorized abstract recursion. APIRun tests whether your service survives 50 concurrent transactions, distributed locks, and strict RFC standards.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={150} duration={650}>
            <div className="overflow-hidden rounded-2xl border border-white/[0.12] bg-[#090d15] shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm sm:text-base border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.1] bg-[#0e1420]">
                      <th className="p-5 sm:p-6 font-bold text-slate-300 w-1/4">
                        Engineering Vector
                      </th>
                      <th className="p-5 sm:p-6 font-bold text-[#FFA116] w-3/8 border-l border-white/[0.08] bg-[#12110c]">
                        <span className="flex items-center space-x-2">
                          <XCircle className="w-5 h-5 text-[#FFA116] shrink-0" />
                          <span>LeetCode &amp; Competitive DSA</span>
                        </span>
                      </th>
                      <th className="p-5 sm:p-6 font-bold text-emerald-400 w-3/8 border-l border-white/[0.08] bg-[#091512]">
                        <span className="flex items-center space-x-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          <span>APIRun Real Backends</span>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.08]">
                    {comparisonRows.map((row, idx) => (
                      <tr 
                        key={idx} 
                        className={`transition-colors ${row.highlight ? 'bg-white/[0.02] hover:bg-white/[0.04]' : 'hover:bg-white/[0.03]'}`}
                      >
                        <td className="p-5 sm:p-6 font-bold text-white align-top">
                          {row.feature}
                        </td>
                        <td className="p-5 sm:p-6 text-slate-400 border-l border-white/[0.08] bg-[#12110c]/50 leading-relaxed align-top">
                          <div className="flex items-start space-x-2.5">
                            <span className="text-[#FFA116] font-bold text-base leading-none mt-0.5 shrink-0">✕</span>
                            <span>{row.traditional}</span>
                          </div>
                        </td>
                        <td className="p-5 sm:p-6 text-slate-100 font-medium border-l border-white/[0.08] bg-[#091512]/60 leading-relaxed align-top">
                          <div className="flex items-start space-x-2.5">
                            <span className="text-emerald-400 font-bold text-base leading-none mt-0.5 shrink-0">✓</span>
                            <span>{row.apirun}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================= */}
        {/* 6 PRODUCTION ENGINEERING TRACKS */}
        {/* ========================================================= */}
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-12 font-sans">
          <ScrollReveal variant="fade-up" duration={600}>
            <div className="text-center space-y-3">
              <div className="text-xs font-sans text-emerald-400 uppercase font-bold tracking-wider">
                CURRICULUM & DOMAIN MASTERY
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                6 Core Backend Engineering Domains
              </h2>
              <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
                Every track simulates real production architecture patterns required at Staff & Senior levels.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={80}>
            {engineeringTracks.map((track, i) => (
              <GsapTilt key={i} maxTilt={6} scale={1.02}>
                <div
                  className="h-full p-6 rounded-2xl bg-[#0b0f17] border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-300 space-y-4 backdrop-blur-xl group hover:shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(16,185,129,0.08)] cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg">
                      TRACK {track.number}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {track.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight">
                      {track.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {track.description}
                    </p>
                  </div>

                  <div className="pt-3 flex flex-wrap gap-1.5 border-t border-white/[0.06]">
                    {track.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.06] font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </GsapTilt>
            ))}
          </StaggerContainer>
        </section>

        {/* ========================================================= */}
        {/* HOW WE EVALUATE (PRODUCTION TEST PIPELINE) */}
        {/* ========================================================= */}
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-12 font-sans">
          <ScrollReveal variant="fade-up" duration={600}>
            <div className="text-center space-y-3">
              <div className="text-xs font-sans text-emerald-400 uppercase font-bold tracking-wider">
                VERIFICATION ENGINE
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Production evaluation, zero mock fluff
              </h2>
              <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl mx-auto font-normal leading-relaxed">
                Every submission runs in an isolated ephemeral execution sandbox tested by our automated adversarial harness.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-4" staggerDelay={90}>
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-200 space-y-3 backdrop-blur-xl group shadow-sm">
              <div className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md w-fit">
                01 &bull; Sandbox Isolation
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">Ephemeral Container</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Spins an isolated in-memory container running your Node.js, Go, or Python service in under 50ms.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-sky-500/30 hover:-translate-y-1 transition-all duration-200 space-y-3 backdrop-blur-xl group shadow-sm">
              <div className="font-mono text-[11px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-md w-fit">
                02 &bull; Contract Checks
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">RFC Specification</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Validates exact HTTP status semantics (201 Created, 400, 404, 409, 422, 429) and content-type headers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-200 space-y-3 backdrop-blur-xl group shadow-sm">
              <div className="font-mono text-[11px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-md w-fit">
                03 &bull; Parallel Fuzzing
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">Concurrency Mutex</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Injects parallel concurrent requests to uncover race conditions, double charges, and deadlock bugs.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-200 space-y-3 backdrop-blur-xl group shadow-sm">
              <div className="font-mono text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md w-fit">
                04 &bull; Scorecard
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">Latency &amp; Traces</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Generates a detailed execution scorecard with latency p99 distributions and assertion diffs.
              </p>
            </div>
          </StaggerContainer>
        </section>

        {/* ========================================================= */}
        {/* CLI QUICK-START TERMINAL WIDGET */}
        {/* ========================================================= */}
        <section className="px-4 sm:px-6 max-w-4xl mx-auto pb-20 font-sans">
          <ScrollReveal variant="fade-up" duration={600}>
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1117] border border-white/[0.12] space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-sans text-xs text-white font-bold">
                  <TerminalSquare className="w-4 h-4 text-emerald-400" />
                  <span>CLI & LOCAL RUNNER COMPATIBLE</span>
                </div>
                <div className="flex items-center space-x-1 bg-black/40 p-0.5 rounded-lg border border-white/[0.08] font-sans text-xs">
                  {(['nodejs', 'go', 'python'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setSelectedCliLang(lang)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        selectedCliLang === lang ? 'bg-white/[0.1] text-emerald-400 font-semibold' : 'text-[#94a3b8]'
                      }`}
                    >
                      {lang === 'nodejs' ? 'TypeScript' : lang === 'go' ? 'Go' : 'Python'}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Prefer your local IDE? Test your local Express, FastAPI, or Gin server against our test suites using your custom endpoint:
              </p>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/60 border border-white/[0.1] font-mono text-xs">
                <span className="text-emerald-400 select-all">
                  $ npx apirun test --target http://localhost:8000 --challenge create-user-api
                </span>
                <button
                  onClick={handleCopyCli}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-sans font-medium transition-colors"
                >
                  {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCli ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================= */}
        {/* POPULAR CHALLENGES SHOWCASE */}
        {/* ========================================================= */}
        <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-10 font-sans">
          <ScrollReveal variant="fade-up" duration={600}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-sans text-emerald-400 uppercase font-bold tracking-wider">CHALLENGE REPOSITORY</div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Popular API Challenges</h2>
              </div>
              <button
                onClick={onExploreChallenges}
                className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>View all challenges</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={100}>
            {previewChallenges.map((challenge) => (
              <GsapTilt key={challenge.id} maxTilt={5} scale={1.02}>
                <div
                  onClick={() => onSelectChallenge(challenge)}
                  className="h-full p-6 rounded-2xl bg-white/[0.04] border border-white/[0.1] hover:border-emerald-400/50 transition-all cursor-pointer space-y-4 backdrop-blur-xl group hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs text-[#94a3b8] uppercase tracking-wider font-semibold">{challenge.category}</span>
                    <DifficultyBadge difficulty={challenge.difficulty} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center space-x-2">
                      <span>{challenge.title}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed line-clamp-2">
                      {challenge.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {challenge.concepts.map((c) => (
                      <ConceptBadge key={c} concept={c} size="sm" />
                    ))}
                  </div>
                </div>
              </GsapTilt>
            ))}
          </StaggerContainer>
        </section>

        {/* ========================================================= */}
        {/* ACTIVE DEVELOPMENT & COMMUNITY FEEDBACK BANNER */}
        {/* ========================================================= */}
        <section className="py-8 px-4 sm:px-6 max-w-5xl mx-auto font-sans">
          <ScrollReveal variant="scale" duration={650}>
            <div className="relative overflow-hidden rounded-3xl bg-[#090d15] border border-emerald-500/30 p-6 sm:p-8 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <div className="flex items-start sm:items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                  <MessageSquarePlus className="w-6 h-6" />
                </div>
                <div className="space-y-1 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30 font-sans">
                      Live Early Preview
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:inline">Actively expanding challenge library</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    We&apos;re in active development &mdash; accepting developer feedback!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                    Have a real-world API scenario, edge-case challenge idea, or runner suggestion? Help shape APIRun for backend engineers worldwide.
                  </p>
                </div>
              </div>

              <GsapMagnetic strength={0.3}>
                <Link
                  href="/feedback"
                  className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-md active:scale-95"
                >
                  <span>Share Feedback</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </GsapMagnetic>
            </div>
          </ScrollReveal>
        </section>

        {/* Global Footer */}
        <ScrollReveal variant="fade" duration={600}>
          <Footer 
            onExploreChallenges={onExploreChallenges}
            onNavigateProgress={onNavigateProgress}
          />
        </ScrollReveal>
      </div>
    </div>
  );
};