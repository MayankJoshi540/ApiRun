import React, { useState } from 'react';
import { 
  ArrowRight, 
  Terminal, 
  CheckCircle2, 
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
  Sparkles,
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
  AlertTriangle
} from 'lucide-react';
import { Challenge } from '../types';
import { DifficultyBadge } from './DifficultyBadge';
import { ConceptBadge } from './ConceptBadge';
import { ApiNeuralBackground } from './ApiNeuralBackground';

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
      attackScenario: 'Boundary RFC-5322 & In-Memory Persistence',
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
        { name: 'Schema & payload type contract', time: '1.8ms', status: 'PASSED' },
        { name: 'Status code RFC-9110 (201 Created)', time: '1.2ms', status: 'PASSED' },
        { name: 'Unique constraint collision -> 409 Conflict', time: '2.9ms', status: 'PASSED' },
        { name: 'Malformed email boundary -> 422 Unprocessable [Hidden]', time: '2.1ms', status: 'PASSED' },
        { name: 'High concurrency lock on email registration [Hidden]', time: '6.8ms', status: 'PASSED' },
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
      attackScenario: 'HMAC-SHA256 & Duplicate Event Deduplication',
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
      attackScenario: 'Simultaneous Inventory Mutex Contention',
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
        { name: 'Deadlock timeout prevention threshold', time: '1.4ms', status: 'PASSED' },
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
    }, 240);
  };

  const handleCopyCli = () => {
    navigator.clipboard.writeText('npx apirun start create-user-api');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const previewChallenges = challenges.slice(0, 4);

  const conceptTags = [
    'HTTP/REST', 'REDIS CACHING', 'CONCURRENCY LOCKS', 'RATE LIMITING', 'IDEMPOTENCY', 'JWT AUTH', 'JOB WORKERS', 'WEBHOOKS'
  ];

  const recentActivity = [
    { user: 'alex_v', action: 'passed', challenge: 'Sliding Window Rate Limiter', lang: 'Go', time: '2m ago', latency: '4.2ms' },
    { user: 'sophia_k', action: 'passed', challenge: 'Idempotent Payment Webhook', lang: 'Node.js', time: '5m ago', latency: '9.8ms' },
    { user: 'dev_raj', action: 'solved', challenge: 'Distributed Job Queue Worker', lang: 'Python', time: '8m ago', latency: '12.1ms' },
    { user: 'elena_m', action: 'passed', challenge: 'JWT Authentication & Refresh', lang: 'Rust', time: '12m ago', latency: '2.4ms' }
  ];

  return (
    <div className="min-h-screen bg-transparent text-[#f8fafc] font-sans selection:bg-emerald-400 selection:text-black relative">
      {/* High-Contrast Technical Neural Background */}
      <ApiNeuralBackground />

      <div className="relative z-10">
        {/* ========================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================= */}
        <section className="pt-14 sm:pt-16 pb-12 px-4 sm:px-6 max-w-6xl mx-auto text-center space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.12] text-xs text-[#94a3b8] backdrop-blur-xl shadow-sm hover:border-emerald-400/40 transition-all cursor-default">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="font-sans text-emerald-400 font-bold tracking-wider uppercase text-[11px]">
              THE LEETCODE FOR BACKEND ENGINEERS
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[#f1f5f9] font-medium text-xs">Hands-on API Practice Arena</span>
          </div>

          {/* Main Hero Headings */}
          <div className="space-y-1 sm:space-y-1.5 max-w-4xl mx-auto">
            <h1 className="text-[clamp(42px,5.6vw,84px)] font-extrabold tracking-tight text-white leading-[0.98]">
              Build APIs.
            </h1>
            <h1 className="text-[clamp(42px,5.6vw,84px)] font-extrabold tracking-tight text-[#cbd5e1] leading-[0.98]">
              Break Edge Cases.
            </h1>
            <h1 className="text-[clamp(42px,5.6vw,84px)] font-extrabold tracking-tight text-[#00f2a9] leading-[0.98]">
              Ship With Proof.
            </h1>
          </div>

          {/* Product Identity Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-[#94a3b8] max-w-2xl mx-auto font-normal leading-relaxed">
            The hands-on practice platform for backend engineers. Stop solving abstract array puzzles — build real REST endpoints, Redis rate limiters, idempotency keys, and survive automated attack test suites.
          </p>

          {/* Primary CTA Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => onSelectChallenge(challenges[0] || challenges[1])}
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-7 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-sm transition-all active:scale-[0.98]"
            >
              <span>Start Coding Free</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={onExploreChallenges}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-[#f8fafc] border border-white/[0.15] hover:border-white/[0.25] font-semibold text-sm transition-all backdrop-blur-xl active:scale-[0.98]"
            >
              <span>Explore 8 Challenges</span>
              <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
            </button>
          </div>

          {/* Tech Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto font-sans text-xs">
            {conceptTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.1] text-[#cbd5e1] hover:text-[#00f2a9] hover:border-emerald-400/40 transition-colors cursor-default font-medium backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* LIVE EVALUATION TICKER (REAL-TIME ACTIVITY PROOF) */}
        {/* ========================================================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
          <div className="flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl overflow-x-auto text-xs font-sans scrollbar-none">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE EVALUATION:</span>
            </div>
            <div className="flex items-center space-x-6 text-[#94a3b8] shrink-0">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <span className="text-white font-semibold">{act.user}</span>
                  <span className="text-emerald-400 font-medium">✓ {act.challenge}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-[#cbd5e1] font-medium">{act.lang}</span>
                  <span className="text-[11px] font-mono text-[#64748b]">({act.latency})</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* HERO VISUAL: LIVE INTERACTIVE TEST RUNNER & ATTACK MATRIX */}
        {/* ========================================================= */}
        <section className="px-4 sm:px-6 max-w-5xl mx-auto pb-20">
          <div className="rounded-2xl border border-white/[0.15] bg-[#0c1017]/90 shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden text-xs backdrop-blur-2xl font-sans">
            {/* Terminal Window Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-3.5 bg-white/[0.04] border-b border-white/[0.1] gap-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="font-sans text-[#94a3b8] text-xs font-semibold tracking-wider uppercase">
                  ATTACK INJECTOR // LIVE HARNESS
                </span>
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
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-sans text-xs transition-all disabled:opacity-50 active:scale-[0.97]"
                >
                  {isDemoRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Flame className="w-3.5 h-3.5 fill-current" />}
                  <span>{isDemoRunning ? 'Fuzzing...' : 'Inject Attack'}</span>
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
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    currentDemo.status === 201 || currentDemo.status === 200
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    HTTP {currentDemo.status} {currentDemo.statusText}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-emerald-400/90 bg-emerald-950/20 border border-emerald-800/40 px-3 py-1.5 rounded-lg flex items-center space-x-2">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Target Vector: <strong>{currentDemo.attackScenario}</strong></span>
                </div>

                {/* Inbound Payload */}
                {currentDemo.requestBody && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px] text-[#94a3b8]">
                      <span>INBOUND ATTACK PAYLOAD</span>
                      <span>application/json</span>
                    </div>
                    <pre className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08] text-[#e2e8f0] font-mono text-[11px] overflow-x-auto leading-relaxed">
                      {currentDemo.requestBody}
                    </pre>
                  </div>
                )}

                {/* Response Payload */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-[10px] text-[#94a3b8]">
                    <span>DEFENSIVE RESPONSE BODY</span>
                    <span className="text-[#00f2a9] font-semibold">{currentDemo.latency}</span>
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
                  <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
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
        </section>

        {/* ========================================================= */}
        {/* HOW WE EVALUATE (PRODUCTION TEST PIPELINE) */}
        {/* ========================================================= */}
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-12 font-sans">
          <div className="text-center space-y-3">
            <div className="text-xs font-sans text-emerald-400 uppercase font-bold tracking-wider">
              HOW APIRUN EVALUATES
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Production evaluation, zero mock fluff
            </h2>
            <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl mx-auto font-normal leading-relaxed">
              Every submission goes through our automated adversarial test engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.18] transition-all space-y-3 backdrop-blur-xl">
              <div className="font-sans text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md w-fit">
                PHASE 01
              </div>
              <h3 className="text-sm font-bold text-white">Ephemeral Sandbox</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Spins an isolated in-memory container running your Node.js, Go, or Python service in under 50ms.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.18] transition-all space-y-3 backdrop-blur-xl">
              <div className="font-sans text-xs font-bold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-md w-fit">
                PHASE 02
              </div>
              <h3 className="text-sm font-bold text-white">RFC Contract Verify</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Validates exact HTTP status semantics (201 Created, 400, 404, 409, 422, 429) and content-type headers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.18] transition-all space-y-3 backdrop-blur-xl">
              <div className="font-sans text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-md w-fit">
                PHASE 03
              </div>
              <h3 className="text-sm font-bold text-white">Concurrency Fuzzing</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Injects parallel concurrent requests to uncover race conditions, double charges, and deadlock bugs.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.18] transition-all space-y-3 backdrop-blur-xl">
              <div className="font-sans text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md w-fit">
                PHASE 04
              </div>
              <h3 className="text-sm font-bold text-white">Microsecond Profiling</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Generates a detailed execution scorecard with latency p99 distributions and assertion diffs.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* CLI QUICK-START TERMINAL WIDGET */}
        {/* ========================================================= */}
        <section className="px-4 sm:px-6 max-w-4xl mx-auto pb-20 font-sans">
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
        </section>

        {/* ========================================================= */}
        {/* POPULAR CHALLENGES SHOWCASE */}
        {/* ========================================================= */}
        <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-10 font-sans">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {previewChallenges.map((challenge) => (
              <div
                key={challenge.id}
                onClick={() => onSelectChallenge(challenge)}
                className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.1] hover:border-emerald-400/50 transition-all cursor-pointer space-y-4 backdrop-blur-xl group hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
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
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* FINAL CALL TO ACTION */}
        {/* ========================================================= */}
        <section className="py-24 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-8">
          <div className="p-10 rounded-3xl bg-white/[0.04] border border-white/[0.15] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to level up your backend skills?
            </h2>
            <p className="text-sm sm:text-base text-[#94a3b8] max-w-xl mx-auto">
              Join thousands of developers mastering real-world REST APIs, microservices, and distributed architecture.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onSelectChallenge(challenges[0] || challenges[1])}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-sm transition-all active:scale-[0.98]"
              >
                Start Free Challenge
              </button>
              <button
                onClick={onExploreChallenges}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/[0.15] font-semibold text-sm transition-all"
              >
                Explore Problem Sets
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};