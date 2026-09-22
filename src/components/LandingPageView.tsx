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
  // Hero Interactive API Tester Mock State
  const [activeDemoTab, setActiveDemoTab] = useState<'user' | 'rateLimit' | 'webhook' | 'concurrency'>('user');
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoProgress, setDemoProgress] = useState(6);
  const [copiedCli, setCopiedCli] = useState(false);
  const [selectedCliLang, setSelectedCliLang] = useState<'nodejs' | 'go' | 'python'>('nodejs');

  const demoData = {
    user: {
      method: 'POST',
      path: '/api/v1/users',
      status: 201,
      statusText: 'CREATED',
      latency: '12.4ms',
      attackScenario: 'RFC-5322 Email Boundary & In-Memory Lock Collision',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Request-Id': 'req_7f901c82e',
        'X-Runtime-Ms': '12.4'
      },
      requestBody: JSON.stringify({
        email: 'mayank@backendrank.io',
        role: 'staff_engineer',
        tier: 'production'
      }, null, 2),
      responseBody: JSON.stringify({
        id: 'usr_8f319a',
        email: 'mayank@backendrank.io',
        role: 'staff_engineer',
        tier: 'production',
        created_at: '2026-09-07T10:00:00Z',
        status: 'active'
      }, null, 2),
      tests: [
        { name: 'Schema & payload type contract validation', time: '1.8ms', status: 'PASSED' },
        { name: 'Status code RFC-9110 (201 Created)', time: '1.2ms', status: 'PASSED' },
        { name: 'Unique constraint collision -> 409 Conflict', time: '2.9ms', status: 'PASSED' },
        { name: 'Malformed email boundary -> 422 Unprocessable [Hidden]', time: '2.1ms', status: 'PASSED' },
        { name: 'High concurrency lock on simultaneous registration [Hidden]', time: '6.8ms', status: 'PASSED' },
        { name: 'Response headers compliance (Content-Type: application/json)', time: '0.9ms', status: 'PASSED' }
      ]
    },
    rateLimit: {
      method: 'GET',
      path: '/api/v1/resource',
      status: 429,
      statusText: 'TOO MANY REQUESTS',
      latency: '3.8ms',
      attackScenario: 'Redis Sliding-Window 61st Burst Injection',
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': '60',
        'X-RateLimit-Remaining': '0',
        'Retry-After': '18'
      },
      requestBody: null,
      responseBody: JSON.stringify({
        error: 'rate_limit_exceeded',
        message: 'Quota exceeded. Maximum 60 requests per minute.',
        retry_after_seconds: 18
      }, null, 2),
      tests: [
        { name: 'Permits requests within 60 req/min window', time: '1.4ms', status: 'PASSED' },
        { name: 'HTTP 429 returned when window quota breached', time: '1.9ms', status: 'PASSED' },
        { name: 'Header compliance: X-RateLimit-Limit & Reset', time: '1.1ms', status: 'PASSED' },
        { name: 'Header compliance: Retry-After integer format', time: '0.8ms', status: 'PASSED' },
        { name: 'Atomic Redis ZSET Lua evaluation under 100 concurrent bursts [Hidden]', time: '7.4ms', status: 'PASSED' },
        { name: 'Sliding timestamp cleanup memory purge [Hidden]', time: '3.2ms', status: 'PASSED' }
      ]
    },
    webhook: {
      method: 'POST',
      path: '/webhooks/stripe',
      status: 200,
      statusText: 'OK',
      latency: '9.4ms',
      attackScenario: 'HMAC-SHA256 & Duplicate Event Deduplication Window',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Status': 'PROCESSED_ONCE',
        'X-Signature-Verified': 'true'
      },
      requestBody: JSON.stringify({
        id: 'evt_3MjjkwLkdIwHu7ix',
        type: 'payment_intent.succeeded',
        data: { amount: 8900, currency: 'usd' }
      }, null, 2),
      responseBody: JSON.stringify({
        received: true,
        idempotency_key: 'evt_3MjjkwLkdIwHu7ix',
        action: 'account_credited',
        status: 'processed'
      }, null, 2),
      tests: [
        { name: 'HMAC-SHA256 signature verification in Stripe-Signature', time: '2.4ms', status: 'PASSED' },
        { name: 'Invalid signature dispatch rejected with 401 Unauthorized', time: '1.7ms', status: 'PASSED' },
        { name: 'First arrival credits user balance atomically', time: '3.9ms', status: 'PASSED' },
        { name: 'Duplicate event_id replay returns 200 without double-crediting [Hidden]', time: '2.6ms', status: 'PASSED' },
        { name: 'Parallel webhook delivery race condition lock [Hidden]', time: '7.1ms', status: 'PASSED' },
        { name: 'Acknowledges within 200ms latency envelope', time: '9.2ms', status: 'PASSED' }
      ]
    },
    concurrency: {
      method: 'POST',
      path: '/api/v1/orders/checkout',
      status: 409,
      statusText: 'CONFLICT',
      latency: '15.1ms',
      attackScenario: 'Simultaneous 50-Thread Inventory Mutex Contention',
      headers: {
        'Content-Type': 'application/json',
        'X-Mutex-Acquired': 'false',
        'X-Lock-Strategy': 'Distributed Redis Redlock'
      },
      requestBody: JSON.stringify({
        sku: 'item_gpu_rtx4090',
        quantity: 1,
        user_id: 'usr_772a'
      }, null, 2),
      responseBody: JSON.stringify({
        error: 'inventory_exhausted',
        message: 'Item reserved by concurrent transaction.',
        retryable: false
      }, null, 2),
      tests: [
        { name: 'Acquires distributed lock before database transaction', time: '4.2ms', status: 'PASSED' },
        { name: 'Rejects overlapping concurrent checkout with 409', time: '3.1ms', status: 'PASSED' },
        { name: 'Releases lock on unexpected transaction error', time: '2.8ms', status: 'PASSED' },
        { name: 'Zero phantom inventory deductions across 50 threads [Hidden]', time: '8.6ms', status: 'PASSED' },
        { name: 'Deadlock timeout prevention threshold (<500ms)', time: '1.4ms', status: 'PASSED' },
        { name: 'State consistency verified across replica nodes', time: '5.0ms', status: 'PASSED' }
      ]
    }
  };

  const currentDemo = demoData[activeDemoTab];

  const handleRerunDemo = () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    setDemoProgress(0);

    const interval = setInterval(() => {
      setDemoProgress(prev => {
        if (prev >= 6) {
          clearInterval(interval);
          setIsDemoRunning(false);
          return 6;
        }
        return prev + 1;
      });
    }, 220);
  };

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
      feature: 'Problem Definition',
      traditional: 'Invert a binary tree, synthetic array index manipulation, Two Sum',
      apirun: 'Implement real HTTP/1.1 REST endpoints, JSON schemas, headers & route mutations',
      highlight: true
    },
    {
      feature: 'Edge Case Verification',
      traditional: 'Null array inputs, large string lengths, Time Limit Exceeded',
      apirun: '50-thread concurrent race conditions, Redis rate limit bursts, idempotency replays',
      highlight: true
    },
    {
      feature: 'Protocol Semantics',
      traditional: 'Single stdout string match (`"true" == "true"`)',
      apirun: 'Strict RFC-9110 status codes (201, 400, 404, 409, 422, 429) & Content-Type validation',
      highlight: false
    },
    {
      feature: 'Infrastructure Integration',
      traditional: 'None (monolithic scratchpad in browser)',
      apirun: 'Real Redis keys, distributed locks, database transactions, background worker queues',
      highlight: true
    },
    {
      feature: 'Development Workflow',
      traditional: 'Coding exclusively in a constrained browser text box',
      apirun: 'In-browser Monaco Editor or your real local IDE via CLI (`npx apirun test`)',
      highlight: false
    },
    {
      feature: 'Production Relevance',
      traditional: 'Rarely encountered in day-to-day backend microservices',
      apirun: 'Directly mirrors real-world backend engineering and system design interviews',
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
      {/* Scroll Progress Indicator Bar */}
      <ScrollProgress />

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
        {/* GSAP ANIMATED METRICS COUNTER STRIP */}
        {/* ========================================================= */}
        <section className="pt-10 pb-6 px-4 sm:px-6 max-w-5xl mx-auto">
          <ScrollReveal variant="fade-up" duration={600}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-[#090d14]/90 border border-white/[0.08] backdrop-blur-xl">
              <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-xl sm:text-2xl font-black font-mono text-white flex items-center justify-center">
                  <GsapCounter value={50000} duration={2} prefix="" suffix="+" />
                </div>
                <div className="text-[11px] font-sans font-medium text-[#94a3b8] uppercase tracking-wider mt-1">
                  Adversarial Tests Run
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 flex items-center justify-center">
                  <GsapCounter value={99.9} decimals={1} duration={1.8} prefix="" suffix="%" />
                </div>
                <div className="text-[11px] font-sans font-medium text-[#94a3b8] uppercase tracking-wider mt-1">
                  RFC Test Precision
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-xl sm:text-2xl font-black font-mono text-white flex items-center justify-center">
                  <GsapCounter value={100} duration={1.6} prefix="" suffix="+" />
                </div>
                <div className="text-[11px] font-sans font-medium text-[#94a3b8] uppercase tracking-wider mt-1">
                  Production Scenarios
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-xl sm:text-2xl font-black font-mono text-sky-400 flex items-center justify-center">
                  &lt;<GsapCounter value={15} duration={1.5} prefix="" suffix="ms" />
                </div>
                <div className="text-[11px] font-sans font-medium text-[#94a3b8] uppercase tracking-wider mt-1">
                  Harness Feedback
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================= */}
        {/* HERO VISUAL: LIVE INTERACTIVE TEST RUNNER & ATTACK MATRIX */}
        {/* ========================================================= */}
        <section className="pt-4 pb-20 px-4 sm:px-6 max-w-5xl mx-auto relative z-10">
          <ScrollReveal variant="scale" duration={600} threshold={0.08}>
            <div className="rounded-2xl border border-white/[0.15] bg-[#0c1017]/90 shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden text-xs backdrop-blur-2xl font-sans">
              {/* Terminal Window Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-3.5 bg-white/[0.04] border-b border-white/[0.1] gap-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-sans text-[#94a3b8] text-xs font-semibold tracking-wider uppercase">
                      ADVERSARIAL ATTACK HARNESS
                    </span>
                    <span className="hidden md:inline text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      HTTP/1.1 RFC-9110
                    </span>
                  </div>
                </div>

              {/* Attack Vector Tabs */}
              <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.1] font-sans overflow-x-auto">
                <button
                  onClick={() => { setActiveDemoTab('user'); setDemoProgress(6); }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    activeDemoTab === 'user' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  POST /users
                </button>
                <button
                  onClick={() => { setActiveDemoTab('rateLimit'); setDemoProgress(6); }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    activeDemoTab === 'rateLimit' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  GET /resource (429)
                </button>
                <button
                  onClick={() => { setActiveDemoTab('webhook'); setDemoProgress(6); }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    activeDemoTab === 'webhook' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  POST /webhooks (Idempotent)
                </button>
                <button
                  onClick={() => { setActiveDemoTab('concurrency'); setDemoProgress(6); }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    activeDemoTab === 'concurrency' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  POST /checkout (Mutex)
                </button>
              </div>

              {/* Action Trigger */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRerunDemo}
                  disabled={isDemoRunning}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-sans text-xs transition-all disabled:opacity-50 active:scale-[0.97]"
                >
                  {isDemoRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Flame className="w-3.5 h-3.5 fill-current" />}
                  <span>{isDemoRunning ? 'Fuzzing...' : 'Inject Chaos'}</span>
                </button>
              </div>
            </div>

            {/* Split Screen Execution Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.1]">
              {/* Left Side: Attack Scenario & Payloads */}
              <div className="lg:col-span-6 p-5 space-y-4">
                {/* Method & Scenario Banner */}
                <div className="flex items-center justify-between bg-black/40 border border-white/[0.1] px-3.5 py-2.5 rounded-xl font-mono">
                  <div className="flex items-center space-x-2.5">
                    <span className={`font-black px-2 py-0.5 rounded text-[11px] ${
                      currentDemo.method === 'POST' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    }`}>
                      {currentDemo.method}
                    </span>
                    <span className="text-white font-semibold text-xs">{currentDemo.path}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                    currentDemo.status === 201 || currentDemo.status === 200
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    HTTP {currentDemo.status} {currentDemo.statusText}
                  </span>
                </div>

                <div className="text-[11px] font-sans text-emerald-400/90 bg-emerald-950/20 border border-emerald-800/40 px-3 py-1.5 rounded-lg flex items-center space-x-2 font-medium">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Target Vector: <strong className="text-white">{currentDemo.attackScenario}</strong></span>
                </div>

                {/* Inbound Payload */}
                {currentDemo.requestBody && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-sans text-[10px] text-[#94a3b8] font-medium">
                      <span>INBOUND ATTACK PAYLOAD</span>
                      <span className="font-mono">application/json</span>
                    </div>
                    <pre className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08] text-[#e2e8f0] font-mono text-[11px] overflow-x-auto leading-relaxed">
                      {currentDemo.requestBody}
                    </pre>
                  </div>
                )}

                {/* Response Payload */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-sans text-[10px] text-[#94a3b8] font-medium">
                    <span>DEFENSIVE RESPONSE BODY</span>
                    <span className="text-emerald-400 font-semibold font-mono">{currentDemo.latency}</span>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08] text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
                    {currentDemo.responseBody}
                  </pre>
                </div>
              </div>

              {/* Right Side: Automated Test Assertions */}
              <div className="lg:col-span-6 p-5 space-y-4 bg-white/[0.02]">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.1]">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white text-xs tracking-wide">AUTOMATED ASSERTION SUITE</span>
                  </div>
                  <span className="font-sans text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
                    {demoProgress}/6 ASSERTIONS PASSED
                  </span>
                </div>

                {/* Test items */}
                <div className="space-y-2.5">
                  {currentDemo.tests.map((test, idx) => {
                    const isPassed = idx < demoProgress;
                    const isRunningCurrent = idx === demoProgress && isDemoRunning;

                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          isPassed
                            ? 'bg-white/[0.04] border-white/[0.1]'
                            : isRunningCurrent
                            ? 'bg-emerald-500/10 border-emerald-500/50 animate-pulse'
                            : 'bg-black/20 border-white/[0.05] opacity-40'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          {isPassed ? (
                            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                          ) : isRunningCurrent ? (
                            <RefreshCw className="w-4 h-4 text-sky-400 animate-spin" />
                          ) : (
                            <Clock className="w-4 h-4 text-[#64748b]" />
                          )}
                          <span className={`text-xs font-medium ${isPassed ? 'text-white' : 'text-[#94a3b8]'}`}>
                            {test.name}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-[#94a3b8] font-semibold">{test.time}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Telemetry Summary */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-[#94a3b8] border-t border-white/[0.1]">
                  <span className="flex items-center space-x-1.5 font-medium">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Avg Execution: <strong className="font-mono text-white">12.4ms</strong></span>
                  </span>
                  <span>Compliance: <strong className="font-mono text-emerald-400">RFC-9110 STRICT</strong></span>
                </div>
              </div>
            </div>
          </div>
          </ScrollReveal>
        </section>

        {/* ========================================================= */}
        {/* THE LEETCODE VS APIRUN COMPARISON MATRIX */}
        {/* ========================================================= */}
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-10 font-sans">
          <ScrollReveal variant="fade-up" duration={600}>
            <div className="text-center space-y-3">
              <div className="text-xs font-sans text-emerald-400 uppercase font-bold tracking-wider">
                PARADIGM SHIFT
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Why LeetCode doesn't prepare you for real backend outages
              </h2>
              <p className="text-sm sm:text-base text-[#94a3b8] max-w-3xl mx-auto font-normal leading-relaxed">
                Algorithms test whether you memorized dynamic programming. APIRun tests whether your API can survive 50 concurrent double-spend requests, Redis rate limits, and database rollback locks.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={150} duration={650}>
            <div className="rounded-2xl border border-white/[0.12] bg-[#0c1017]/90 backdrop-blur-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.1] bg-white/[0.03]">
                      <th className="p-4 sm:p-5 font-bold text-[#8b949e] w-1/4">Engineering Vector</th>
                      <th className="p-4 sm:p-5 font-bold text-[#94a3b8] w-3/8">
                        <span className="flex items-center space-x-2">
                          <XCircle className="w-4 h-4 text-red-400/80" />
                          <span>Traditional DSA Platforms</span>
                        </span>
                      </th>
                      <th className="p-4 sm:p-5 font-bold text-emerald-400 w-3/8 bg-emerald-500/[0.06]">
                        <span className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>APIRun Backend Arena</span>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.08]">
                    {comparisonRows.map((row, idx) => (
                      <tr 
                        key={idx} 
                        className={`hover:bg-white/[0.02] transition-colors ${row.highlight ? 'bg-white/[0.01]' : ''}`}
                      >
                        <td className="p-4 sm:p-5 font-semibold text-white">
                          {row.feature}
                        </td>
                        <td className="p-4 sm:p-5 text-[#94a3b8] leading-relaxed">
                          {row.traditional}
                        </td>
                        <td className="p-4 sm:p-5 text-[#e2e8f0] font-medium bg-emerald-500/[0.04] leading-relaxed">
                          <span className="text-emerald-400 font-semibold mr-1.5">✓</span>
                          {row.apirun}
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
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#080d14] to-slate-900/40 border border-emerald-500/30 p-6 sm:p-8 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <div className="flex items-start sm:items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                  <MessageSquarePlus className="w-6 h-6" />
                </div>
                <div className="space-y-1 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-500/30">
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

        {/* ========================================================= */}
        {/* FINAL CALL TO ACTION */}
        {/* ========================================================= */}
        <section className="py-24 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-8 font-sans">
          <ScrollReveal variant="scale" duration={650}>
            <div className="p-10 rounded-3xl bg-white/[0.04] border border-white/[0.15] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] space-y-6">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Ready to master production backend engineering?
              </h2>
              <p className="text-sm sm:text-base text-[#94a3b8] max-w-xl mx-auto leading-relaxed">
                Join thousands of backend engineers practicing distributed locking, rate limiting, and RFC-strict APIs.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <GsapMagnetic strength={0.25}>
                  <button
                    onClick={() => onSelectChallenge(challenges[0] || challenges[1])}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Start Free Challenge
                  </button>
                </GsapMagnetic>
                <GsapMagnetic strength={0.2}>
                  <button
                    onClick={onExploreChallenges}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/[0.15] font-semibold text-sm transition-all cursor-pointer"
                  >
                    Explore Problem Sets
                  </button>
                </GsapMagnetic>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Global Footer */}
        <Footer 
          onExploreChallenges={onExploreChallenges}
          onNavigateProgress={onNavigateProgress}
        />
      </div>
    </div>
  );
};