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
    'API DESIGN', 'DISTRIBUTED LOCKS', 'RATE LIMITING', 
    'IDEMPOTENCY', 'JWT AUTH', 'BACKGROUND JOBS', 'WEBHOOK SECURITY'
  ];

  const comparisonRows = [
    {
      feature: 'Core Challenge Type',
      traditional: 'Inverting binary trees, synthetic array tricks, and abstract recursion problems.',
      apirun: 'Building real API endpoints, input validation, database updates, and authentication.',
      highlight: true
    },
    {
      feature: 'Edge Case Verification',
      traditional: 'Array boundary index checks and artificial CPU time limits.',
      apirun: 'High-concurrency traffic, race condition prevention, and duplicate request handling.',
      highlight: true
    },
    {
      feature: 'API Standards',
      traditional: 'Single text print output (e.g. System.out.println("true")).',
      apirun: 'Real HTTP status codes (200, 201, 400, 404, 409, 429) and structured JSON responses.',
      highlight: false
    },
    {
      feature: 'State & Databases',
      traditional: 'None. Ephemeral memory resets on every run.',
      apirun: 'Real Redis keys, distributed locks, database transactions, and automatic rollbacks.',
      highlight: true
    },
    {
      feature: 'Developer Workflow',
      traditional: 'Locked inside a basic browser text box with hidden mock drivers.',
      apirun: 'Code in the browser editor or test your actual local backend server using our CLI.',
      highlight: false
    },
    {
      feature: 'Real-World Relevance',
      traditional: 'Rarely encountered in day-to-day backend development or production systems.',
      apirun: 'Directly mirrors real production backend engineering and system design interviews.',
      highlight: true
    }
  ];

  const engineeringTracks = [
    {
      number: '01',
      title: 'Concurrency & Distributed Locks',
      badge: 'High Concurrency',
      description: 'Defend against race conditions and double-spending bugs under heavy traffic using distributed locks and atomic transactions.',
      skills: ['Race Conditions', 'Distributed Locks', 'Transactions', 'Deadlock Prevention']
    },
    {
      number: '02',
      title: 'Traffic & Rate Limiting',
      badge: 'Traffic Management',
      description: 'Implement sliding-window counters and token bucket rate limiters to protect your APIs from traffic spikes and abuse.',
      skills: ['Rate Limiting', 'Redis Counters', '429 Handling', 'Token Bucket']
    },
    {
      number: '03',
      title: 'Payment Safety & Webhooks',
      badge: 'Reliability',
      description: 'Safely handle payment webhooks with cryptographic signature checks and duplicate request prevention.',
      skills: ['Signature Checks', 'Idempotency Keys', 'Duplicate Prevention', 'Webhook Security']
    },
    {
      number: '04',
      title: 'API Design & Status Codes',
      badge: 'API Standards',
      description: 'Design clean REST endpoints with proper HTTP status codes, structured error handling, and request validation.',
      skills: ['REST Endpoints', 'Input Validation', 'Status Codes', 'Error Handling']
    },
    {
      number: '05',
      title: 'Background Queues & Workers',
      badge: 'Async Processing',
      description: 'Build reliable background job workers with automatic retries, failed job queues, and task scheduling.',
      skills: ['Task Queues', 'Retry Logic', 'Failed Job Queues', 'Task Scheduling']
    },
    {
      number: '06',
      title: 'Auth, Tokens & Session Security',
      badge: 'Authentication',
      description: 'Implement secure token authentication, refresh token rotation, password hashing, and user role permissions.',
      skills: ['JWT Tokens', 'Token Refresh', 'Session Security', 'Role-Based Access']
    }
  ];

  return (
    <div className="min-h-screen bg-[#050708] text-[#f8fafc] font-sans selection:bg-emerald-500/30 selection:text-white relative overflow-x-hidden">
      {/* 1. Global Page Technical Background Atmosphere (Luminous technical grid) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Continuous Technical Dot Matrix with micro-luminescence */}
        <div 
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(rgba(52, 211, 153, 0.4) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Faint Coordinate Grid */}
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(52, 211, 153, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(52, 211, 153, 0.3) 1px, transparent 1px)
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-2xl bg-[#090d14]/90 border border-white/[0.08] backdrop-blur-xl">
              <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-lg sm:text-2xl font-black font-sans text-white flex items-center justify-center">
                  <GsapCounter value={50000} duration={2} prefix="" suffix="+" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-sans font-semibold text-[#94a3b8] uppercase tracking-wider mt-1">
                  Automated Tests Run
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-lg sm:text-2xl font-black font-sans text-emerald-400 flex items-center justify-center">
                  <GsapCounter value={99.9} decimals={1} duration={1.8} prefix="" suffix="%" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-sans font-semibold text-[#94a3b8] uppercase tracking-wider mt-1">
                  Spec Compliance
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-lg sm:text-2xl font-black font-sans text-white flex items-center justify-center">
                  <GsapCounter value={100} duration={1.6} prefix="" suffix="+" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-sans font-semibold text-[#94a3b8] uppercase tracking-wider mt-1">
                  Backend Scenarios
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-lg sm:text-2xl font-black font-sans text-sky-400 flex items-center justify-center">
                  &lt;<GsapCounter value={15} duration={1.5} prefix="" suffix="ms" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-sans font-semibold text-[#94a3b8] uppercase tracking-wider mt-1">
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
            <div className="sm:hidden text-right text-[11px] text-slate-400 pb-2 px-1">
              &larr; Swipe table to compare &rarr;
            </div>
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
                TESTING PIPELINE
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Automated testing, real-world verification
              </h2>
              <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl mx-auto font-normal leading-relaxed">
                Every submission runs in a secure sandbox tested against real traffic spikes, edge cases, and API error states.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-4" staggerDelay={90}>
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-200 space-y-3 backdrop-blur-xl group shadow-sm">
              <div className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md w-fit">
                01 &bull; Sandbox Isolation
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">Fast Environment</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Spins up an isolated sandbox running your Node.js, Go, or Python service in under 50ms.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-sky-500/30 hover:-translate-y-1 transition-all duration-200 space-y-3 backdrop-blur-xl group shadow-sm">
              <div className="font-mono text-[11px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-md w-fit">
                02 &bull; API Contracts
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">Response Validation</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Validates proper HTTP status codes (200, 201, 400, 404, 409, 429) and structured JSON responses.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-200 space-y-3 backdrop-blur-xl group shadow-sm">
              <div className="font-mono text-[11px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-md w-fit">
                03 &bull; Traffic &amp; Concurrency
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">Race Condition Checks</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Sends parallel requests to verify thread safety, prevent double charges, and test locks.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-200 space-y-3 backdrop-blur-xl group shadow-sm">
              <div className="font-mono text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md w-fit">
                04 &bull; Detailed Scorecard
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">Speed &amp; Diagnostics</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Instant breakdown of passed test assertions, execution latency, and error traces.
              </p>
            </div>
          </StaggerContainer>
        </section>

        {/* ========================================================= */}
        {/* CLI QUICK-START TERMINAL WIDGET */}
        {/* ========================================================= */}
        <section className="px-4 sm:px-6 max-w-4xl mx-auto pb-20 font-sans">
          <ScrollReveal variant="fade-up" duration={600}>
            <div className="relative overflow-hidden p-5 sm:p-8 rounded-3xl bg-[#080d16] border border-white/[0.12] space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
              {/* Top ambient glow */}
              <div 
                className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-40 pointer-events-none opacity-40"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.25), transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />

              {/* Header: Title + Language Switcher */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5 text-xs text-white font-bold">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 shadow-sm">
                    <TerminalSquare className="w-4 h-4" />
                  </div>
                  <span className="tracking-wide">LOCAL RUNNER &amp; CLI</span>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>IN ACTIVE BUILD</span>
                  </div>
                </div>

                {/* Language Switcher Tabs */}
                <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-xl border border-white/[0.08] text-xs self-start sm:self-auto">
                  {(['nodejs', 'go', 'python'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setSelectedCliLang(lang)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedCliLang === lang 
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm' 
                          : 'text-slate-400 hover:text-white border border-transparent'
                      }`}
                    >
                      {lang === 'nodejs' ? 'TypeScript / Node' : lang === 'go' ? 'Go' : 'Python'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-xl">
                  Prefer your local IDE? Test your live Express, FastAPI, or Go server directly against our automated test suites:
                </p>
                <div className="text-[11px] font-mono text-zinc-400 flex items-center space-x-1.5 shrink-0">
                  <span className="text-emerald-400">⚡</span>
                  <span>Release: <strong className="text-white">v0.2.0 Early Access</strong></span>
                </div>
              </div>

              {/* Terminal Frame */}
              <div className="relative z-10 rounded-2xl bg-[#04060a] border border-white/[0.1] overflow-hidden shadow-2xl">
                {/* Window Header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.06]">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                    <span className="text-[11px] font-mono text-zinc-400 pl-2">apirun-cli &bull; port 8000 &bull; local test suite</span>
                  </div>

                  <button
                    onClick={() => {
                      const cmd = selectedCliLang === 'go'
                        ? 'go run apirun.dev/cli@latest test --target http://localhost:8080 --challenge create-user-api'
                        : selectedCliLang === 'python'
                        ? 'python -m apirun test --target http://localhost:8000 --challenge create-user-api'
                        : 'npx apirun test --target http://localhost:8000 --challenge create-user-api';
                      navigator.clipboard.writeText(cmd);
                      setCopiedCli(true);
                      setTimeout(() => setCopiedCli(false), 2000);
                    }}
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white text-[11px] font-bold transition-all active:scale-95"
                    aria-label="Copy CLI command"
                  >
                    {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                    <span>{copiedCli ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Command & Output Content */}
                <div className="p-4 sm:p-5 space-y-3 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed">
                  <div className="flex items-start space-x-2 text-emerald-400 font-bold select-all">
                    <span className="text-zinc-500 shrink-0 select-none">$</span>
                    <span className="break-all sm:break-normal">
                      {selectedCliLang === 'go' 
                        ? 'go run apirun.dev/cli@latest test --target http://localhost:8080 --challenge create-user-api'
                        : selectedCliLang === 'python'
                        ? 'python -m apirun test --target http://localhost:8000 --challenge create-user-api'
                        : 'npx apirun test --target http://localhost:8000 --challenge create-user-api'}
                    </span>
                  </div>

                  <div className="space-y-1 text-zinc-400 text-xs pt-1 border-t border-white/[0.05]">
                    <div className="text-zinc-300 flex items-center space-x-2">
                      <span className="text-sky-400">[1/3]</span>
                      <span>Connected to local server on http://localhost:{selectedCliLang === 'go' ? '8080' : '8000'}</span>
                    </div>
                    <div className="text-zinc-300 flex items-center space-x-2">
                      <span className="text-sky-400">[2/3]</span>
                      <span>Verified HTTP status codes and response formats</span>
                    </div>
                    <div className="text-zinc-300 flex items-center space-x-2">
                      <span className="text-sky-400">[3/3]</span>
                      <span>Tested concurrency and race condition edge cases</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-white/[0.05] text-[11px]">
                    <div className="text-emerald-400 font-bold flex items-center space-x-1.5">
                      <span>✔</span>
                      <span>12/12 test assertions passed (0.038s) &bull; All edge cases covered</span>
                    </div>
                    <span className="text-zinc-500 hidden sm:inline font-mono">exit code 0</span>
                  </div>
                </div>
              </div>

              {/* Bottom Pipeline Status Strip */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px] font-mono">
                <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center space-x-2 text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-zinc-400">Sandboxes:</span>
                  <span className="text-white font-semibold">Fast &amp; Isolated</span>
                </div>
                <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center space-x-2 text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-zinc-400">API Tests:</span>
                  <span className="text-white font-semibold">Edge Cases Covered</span>
                </div>
                <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center space-x-2 text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-zinc-400">CLI Tool:</span>
                  <span className="text-amber-300 font-semibold">Building v0.2.0</span>
                </div>
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
                  className="group shrink-0 w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all duration-200 border border-emerald-400/30 hover:border-emerald-300/60 shadow-[0_4px_16px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_22px_rgba(16,185,129,0.4)] active:scale-[0.98]"
                >
                  <span>Share Feedback</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
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