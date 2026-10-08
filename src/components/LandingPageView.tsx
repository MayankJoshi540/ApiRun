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

import { BackendTechMarquee } from './BackendTechMarquee';
import { ScrollReveal, StaggerContainer } from './ui/ScrollReveal';
import { ScrollProgress } from './ui/ScrollProgress';
import { GsapTilt } from './gsap/GsapTilt';
import { GsapMagnetic } from './gsap/GsapMagnetic';
import { GsapCounter } from './gsap/GsapCounter';
import { gsap } from '@/lib/gsap';
import { GsapParallax } from './gsap/GsapParallax';
import { GsapTextReveal } from './gsap/GsapTextReveal';
import { GsapScreenshotWall } from './gsap/GsapScreenshotWall';

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
      {/* 1. Global Page Technical Background Atmosphere (Clean, Minimal Dark with Subtle Bottom Emerald Glow) */}
      <GsapParallax speed={0.15} className="absolute inset-0 pointer-events-none z-0">
        {/* Continuous Technical Dot Matrix with micro-luminescence */}
        <div 
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(rgba(52, 211, 153, 0.4) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Faint Coordinate Grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(52, 211, 153, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(52, 211, 153, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px'
          }}
        />

        {/* Subtle, Soft Emerald Ambient Glow at Bottom Horizon */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] max-w-full h-[450px] pointer-events-none opacity-25 blur-[120px]"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(16, 185, 129, 0.25) 0%, transparent 75%)',
          }}
        />
      </GsapParallax>

      {/* 2. Hero Section */}
      <Hero
        onLaunchArena={() => onSelectChallenge(challenges[0] || challenges[1])}
        onBrowseTracks={onExploreChallenges}
      />

      {/* 3D Pinned Screenshot Wall Experience */}
      <GsapScreenshotWall />

      <div className="relative z-10">

        {/* ========================================================= */}
        {/* HERO SHOWCASE: SCROLL-TRIGGERED CHALLENGES DASHBOARD PREVIEW */}
        {/* ========================================================= */}

        {/* ========================================================= */}
        {/* INFINITE BACKEND LANGUAGES & RUNTIMES 3D MARQUEE */}
        {/* ========================================================= */}
        <ScrollReveal variant="fade-up" duration={700}>
          <BackendTechMarquee />
        </ScrollReveal>

        {/* ========================================================= */}
        {/* GSAP ANIMATED METRICS COUNTER STRIP */}
        {/* ========================================================= */}
        <section className="pt-2 pb-12 px-4 sm:px-6 max-w-5xl mx-auto relative">
          {/* Subtle Ambient Glow for Counter */}
          <div className="absolute inset-0 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[120px] bg-emerald-500/5 blur-[80px] pointer-events-none rounded-full -z-10 opacity-30" />
          
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
        <section id="compare-matrix" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto space-y-12 font-sans select-none relative">
          {/* Atmospheric Dual-Tone Glow Behind Matrix */}
          <div className="absolute top-1/4 -left-32 w-[600px] h-[500px] bg-blue-500/5 blur-[130px] pointer-events-none rounded-full -z-10 mix-blend-screen opacity-20" />
          <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full -z-10 mix-blend-screen opacity-20" />
          
          <ScrollReveal variant="blur-up" duration={700}>
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <GsapTextReveal
                text="Why LeetCode Doesn't Make You Ready for Real Backend Engineering"
                tag="h2"
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]"
                splitBy="word"
                stagger={0.035}
                duration={0.5}
                highlightWords={['LeetCode']}
                highlightClassName="text-[#FFA116]"
              />
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed pt-1 font-normal">
                Competitive programming tests whether you memorized abstract recursion. APIRun tests whether your service survives 50 concurrent transactions, distributed locks, and strict RFC standards.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="scale" delay={150} duration={700}>
            <div className="sm:hidden text-right text-[11px] text-slate-400 pb-2 px-1">
              &larr; Swipe table to compare &rarr;
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/[0.12] hover:border-emerald-500/30 bg-[#090d15] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.08)] transition-all duration-300">
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
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-12 font-sans relative">
          {/* Center ambient purple glow for variety */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-purple-500/5 blur-[140px] pointer-events-none rounded-[100%] -z-10 mix-blend-screen opacity-20" />
          
          <ScrollReveal variant="blur-up" duration={600}>
            <div className="text-center space-y-3">
              <div className="text-xs font-sans text-emerald-400 uppercase font-bold tracking-wider">
                CURRICULUM & DOMAIN MASTERY
              </div>
              <GsapTextReveal
                text="6 Core Backend Engineering Domains"
                tag="h2"
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
                splitBy="word"
                stagger={0.04}
              />
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
        {/* POPULAR CHALLENGES SHOWCASE */}
        {/* ========================================================= */}
        <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-10 font-sans relative">
          {/* Edge glows to frame the section */}
          <div className="absolute -top-20 -right-40 w-[500px] h-[500px] bg-sky-500/5 blur-[130px] pointer-events-none rounded-full -z-10 mix-blend-screen opacity-20" />
          <div className="absolute -bottom-20 -left-40 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full -z-10 mix-blend-screen opacity-20" />
          
          <ScrollReveal variant="blur-up" duration={600}>
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
        {/* COMMUNITY FEEDBACK & CHALLENGE SUGGESTIONS */}
        {/* ========================================================= */}
        <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto font-sans">
          <ScrollReveal variant="scale" duration={500}>
            <div className="rounded-2xl bg-[#080c14] border border-white/[0.08] hover:border-white/[0.14] transition-colors p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="font-semibold text-slate-300">OPEN FEEDBACK</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-400">EARLY PREVIEW</span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Help us expand the challenge catalog
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Encountered tricky race conditions, idempotency bugs, or token bucket edge cases in production? Share your ideas and help shape upcoming backend challenges.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono text-slate-400">
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">
                    + New Challenge Specs
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">
                    + Framework Requests
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">
                    + Harness Edge Cases
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <Link
                  href="/feedback"
                  className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs transition-colors active:scale-[0.98]"
                >
                  <span>Share Feedback</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="https://github.com/MayankJoshi540/ApiRun/issues"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] font-medium text-xs transition-colors"
                >
                  <span>GitHub Issues</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
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