import React, { useState, useEffect } from 'react';
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
  ArrowUpRight
} from 'lucide-react';
import { Challenge } from '../types';
import { DifficultyBadge } from './DifficultyBadge';
import { ConceptBadge } from './ConceptBadge';

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
  const [activeDemoTab, setActiveDemoTab] = useState<'user' | 'rateLimit' | 'webhook'>('user');
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoProgress, setDemoProgress] = useState(6);

  const demoData = {
    user: {
      method: 'POST',
      path: '/api/v1/users',
      status: 201,
      statusText: 'CREATED',
      latency: '14ms',
      requestBody: JSON.stringify({
        email: 'dev@backendrank.io',
        role: 'engineer',
        tier: 'production'
      }, null, 2),
      responseBody: JSON.stringify({
        id: 'usr_8f319a',
        email: 'dev@backendrank.io',
        role: 'engineer',
        tier: 'production',
        created_at: '2026-09-02T14:30:00Z',
        status: 'active'
      }, null, 2),
      tests: [
        { name: 'Schema & payload type contract', time: '2.1ms', status: 'PASSED' },
        { name: 'Status code RFC-9110 (201 Created)', time: '1.4ms', status: 'PASSED' },
        { name: 'Unique constraint collision -> 409 Conflict', time: '3.6ms', status: 'PASSED' },
        { name: 'Malformed email boundary -> 422 Unprocessable [Hidden]', time: '2.8ms', status: 'PASSED' },
        { name: 'High concurrency lock on email registration [Hidden]', time: '8.4ms', status: 'PASSED' },
        { name: 'Response headers compliance (Content-Type: application/json)', time: '1.1ms', status: 'PASSED' }
      ]
    },
    rateLimit: {
      method: 'GET',
      path: '/api/v1/resource',
      status: 429,
      statusText: 'TOO MANY REQUESTS',
      latency: '4ms',
      requestBody: null,
      responseBody: JSON.stringify({
        error: 'rate_limit_exceeded',
        message: 'Quota exceeded. Maximum 60 requests per minute.',
        retry_after_seconds: 18
      }, null, 2),
      tests: [
        { name: 'Permits requests within 60 req/min window', time: '1.9ms', status: 'PASSED' },
        { name: 'HTTP 429 returned when window quota breached', time: '2.2ms', status: 'PASSED' },
        { name: 'Header compliance: X-RateLimit-Limit & Reset', time: '1.2ms', status: 'PASSED' },
        { name: 'Header compliance: Retry-After integer format', time: '0.9ms', status: 'PASSED' },
        { name: 'Atomic Redis ZSET Lua evaluation under 100 concurrent bursts [Hidden]', time: '9.8ms', status: 'PASSED' },
        { name: 'Sliding timestamp cleanup memory purge [Hidden]', time: '4.1ms', status: 'PASSED' }
      ]
    },
    webhook: {
      method: 'POST',
      path: '/webhooks/stripe',
      status: 200,
      statusText: 'OK',
      latency: '11ms',
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
        { name: 'HMAC-SHA256 signature verification in Stripe-Signature', time: '3.1ms', status: 'PASSED' },
        { name: 'Invalid signature dispatch rejected with 401 Unauthorized', time: '2.0ms', status: 'PASSED' },
        { name: 'First arrival credits user balance atomically', time: '4.8ms', status: 'PASSED' },
        { name: 'Duplicate event_id replay returns 200 without double-crediting [Hidden]', time: '3.2ms', status: 'PASSED' },
        { name: 'Parallel webhook delivery race condition lock [Hidden]', time: '8.9ms', status: 'PASSED' },
        { name: 'Acknowledges within 200ms latency envelope', time: '11.0ms', status: 'PASSED' }
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
    }, 280);
  };

  // Preview Challenges (First 4 realistic problems)
  const previewChallenges = challenges.slice(0, 4);

  const conceptTags = [
    'HTTP', 'REST', 'DATABASE', 'REDIS', 'AUTH', 'CACHE', 'CONCURRENCY', 'QUEUES', 'WEBHOOKS', 'IDEMPOTENCY'
  ];

  return (
    <div className="min-h-screen bg-[#050608] text-[#e6edf3] font-sans selection:bg-emerald-500 selection:text-black">
      {/* Background Technical Grid Effect */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="pt-16 pb-14 px-4 sm:px-6 max-w-6xl mx-auto text-center space-y-8">
          {/* Technical Eyebrow Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#12161f] border border-[#262d3a] text-xs text-[#8b949e]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-400 font-semibold tracking-wider uppercase text-[11px]">
              BACKEND ENGINEERING PRACTICE
            </span>
            <span className="text-[#484f58]">|</span>
            <span className="text-[#c9d1d9] font-sans text-xs">Automated Contract & Edge Testing</span>
          </div>

          {/* Main Hero Headings */}
          <div className="space-y-1.5 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#e6edf3] leading-[1.08]">
              Build Backends.
            </h1>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#e6edf3] leading-[1.08]">
              Break Them.
            </h1>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-emerald-400 leading-[1.08]">
              Get Better.
            </h1>
          </div>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg md:text-xl text-[#94a3b8] max-w-2xl mx-auto font-normal leading-relaxed">
            Build real backend APIs and prove they work against automated tests, hidden edge cases, and production-style requirements.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => onSelectChallenge(challenges[0] || challenges[1])}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] active:scale-[0.98]"
            >
              <span>Start a Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreChallenges}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded bg-[#12161f] hover:bg-[#171c26] text-[#e6edf3] hover:text-white border border-[#262d3a] hover:border-[#374151] font-medium text-sm transition-all active:scale-[0.98]"
            >
              <span>Explore Challenges</span>
              <ChevronRight className="w-4 h-4 text-[#8b949e]" />
            </button>
          </div>

          {/* Under-CTA Technical Metadata Chips */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto font-mono text-[11px]">
            {conceptTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded bg-[#0d0f14] border border-[#262d3a] text-[#8b949e] hover:text-emerald-400 hover:border-emerald-800/60 transition-colors cursor-default font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* HERO VISUAL: DEVELOPER-ORIENTED API TESTER PANEL */}
        <section className="px-4 sm:px-6 max-w-5xl mx-auto pb-16">
          <div className="rounded-lg border border-[#262d3a] bg-[#090b0e] shadow-2xl overflow-hidden text-xs glow-emerald">
            {/* Panel Top Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-[#0d0f14] border-b border-[#262d3a] gap-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-[#8b949e] text-[11px] hidden sm:inline">// APIRUN CONTRACT RUNNER v0.9.4</span>
              </div>

              {/* Route Tabs Selector */}
              <div className="flex items-center space-x-1 bg-[#050608] p-1 rounded border border-[#262d3a] font-mono">
                <button
                  onClick={() => { setActiveDemoTab('user'); setDemoProgress(6); }}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                    activeDemoTab === 'user' ? 'bg-[#171c26] text-emerald-400 border border-[#374151]' : 'text-[#8b949e] hover:text-[#e6edf3]'
                  }`}
                >
                  POST /users
                </button>
                <button
                  onClick={() => { setActiveDemoTab('rateLimit'); setDemoProgress(6); }}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                    activeDemoTab === 'rateLimit' ? 'bg-[#171c26] text-emerald-400 border border-[#374151]' : 'text-[#8b949e] hover:text-[#e6edf3]'
                  }`}
                >
                  GET /resource
                </button>
                <button
                  onClick={() => { setActiveDemoTab('webhook'); setDemoProgress(6); }}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                    activeDemoTab === 'webhook' ? 'bg-[#171c26] text-emerald-400 border border-[#374151]' : 'text-[#8b949e] hover:text-[#e6edf3]'
                  }`}
                >
                  POST /webhooks
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRerunDemo}
                  disabled={isDemoRunning}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/70 text-emerald-400 font-medium font-sans text-xs transition-colors disabled:opacity-50"
                  title="Run interactive contract test suite"
                >
                  {isDemoRunning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                  <span>{isDemoRunning ? 'Testing...' : 'Rerun Suite'}</span>
                </button>
              </div>
            </div>

            {/* Panel Body: Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#262d3a]">
              {/* Left Column: Request & Live Response Payload */}
              <div className="lg:col-span-6 p-4 space-y-4">
                {/* Method & URL */}
                <div className="flex items-center justify-between bg-[#12161f] border border-[#262d3a] px-3 py-2 rounded font-mono">
                  <div className="flex items-center space-x-2.5">
                    <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      currentDemo.method === 'POST' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'bg-sky-950 text-sky-400 border border-sky-800/60'
                    }`}>
                      {currentDemo.method}
                    </span>
                    <span className="text-[#e6edf3] font-medium">{currentDemo.path}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    currentDemo.status === 201 || currentDemo.status === 200
                      ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800/70'
                      : 'bg-amber-950/70 text-amber-400 border-amber-800/70'
                  }`}>
                    HTTP {currentDemo.status} {currentDemo.statusText}
                  </span>
                </div>

                {/* Request Payload (if any) */}
                {currentDemo.requestBody && (
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[10px] text-[#8b949e]">
                      <span>REQUEST PAYLOAD</span>
                      <span>application/json</span>
                    </div>
                    <pre className="p-3 rounded bg-[#050608] border border-[#262d3a] text-[#c9d1d9] font-mono text-[11px] overflow-x-auto leading-relaxed">
                      {currentDemo.requestBody}
                    </pre>
                  </div>
                )}

                {/* Response Payload */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px] text-[#8b949e]">
                    <span>RESPONSE BODY</span>
                    <span className="text-emerald-400">{currentDemo.latency}</span>
                  </div>
                  <pre className="p-3 rounded bg-[#050608] border border-[#262d3a] text-emerald-300/90 font-mono text-[11px] overflow-x-auto leading-relaxed">
                    {currentDemo.responseBody}
                  </pre>
                </div>
              </div>

              {/* Right Column: Automated Test Suite Runner */}
              <div className="lg:col-span-6 p-4 space-y-3.5 bg-[#08090c]/50">
                <div className="flex items-center justify-between pb-1 border-b border-[#262d3a]/60">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-[#e6edf3] text-xs">AUTOMATED ASSERTION SUITE</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                    {demoProgress}/6 TESTS PASSED
                  </span>
                </div>

                {/* Test items */}
                <div className="space-y-2">
                  {currentDemo.tests.map((test, idx) => {
                    const isPassed = idx < demoProgress;
                    const isRunningCurrent = idx === demoProgress && isDemoRunning;

                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2.5 rounded border transition-all ${
                          isPassed
                            ? 'bg-[#12161f] border-[#262d3a]'
                            : isRunningCurrent
                            ? 'bg-[#171c26] border-emerald-700/80 animate-pulse'
                            : 'bg-[#0d0f14]/60 border-[#1c212c] opacity-40'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          {isPassed ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400 flex-no-shrink" />
                          ) : isRunningCurrent ? (
                            <RefreshCw className="w-3.5 h-3.5 text-sky-400 animate-spin flex-no-shrink" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-[#6e7681] flex-no-shrink" />
                          )}
                          <span className={`text-[11px] font-sans ${isPassed ? 'text-[#e6edf3]' : 'text-[#8b949e]'}`}>
                            {test.name}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-[#8b949e]">{test.time}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Telemetry Summary Bar */}
                <div className="pt-2 flex items-center justify-between text-[10px] text-[#8b949e] border-t border-[#262d3a]/60">
                  <span className="flex items-center space-x-1 font-sans">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    <span>Avg Latency: <strong className="font-mono text-[#e6edf3]">14.2ms</strong></span>
                  </span>
                  <span className="font-sans">Compliance: <strong className="font-mono text-emerald-400">100% RFC-9110</strong></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className="border-y border-[#262d3a] bg-[#0a0c10] py-10 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="font-bold text-3xl sm:text-4xl text-[#e6edf3] font-mono">08</div>
              <div className="text-[11px] sm:text-xs text-[#8b949e] uppercase tracking-wider font-medium font-sans">
                API Challenges
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-3xl sm:text-4xl text-emerald-400 font-mono">40+</div>
              <div className="text-[11px] sm:text-xs text-[#8b949e] uppercase tracking-wider font-medium font-sans">
                Automated Tests
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-3xl sm:text-4xl text-[#e6edf3] font-mono">12+</div>
              <div className="text-[11px] sm:text-xs text-[#8b949e] uppercase tracking-wider font-medium font-sans">
                Backend Concepts
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-3xl sm:text-4xl text-emerald-400 font-mono">20+</div>
              <div className="text-[11px] sm:text-xs text-[#8b949e] uppercase tracking-wider font-medium font-sans">
                Hidden Edge Cases
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold font-sans">
              WORKFLOW
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e6edf3] tracking-tight">
              From idea → working API
            </h2>
            <p className="text-xs sm:text-sm text-[#8b949e] max-w-xl mx-auto font-normal leading-relaxed">
              A streamlined engineering cycle designed around precision contracts and strict assertion testing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded bg-[#12161f] border border-[#262d3a] hover:border-[#374151] transition-all space-y-3 relative group">
              <div className="font-mono text-2xl font-bold text-emerald-400/70 group-hover:text-emerald-400 transition-colors">
                01
              </div>
              <div className="text-base font-semibold text-[#e6edf3]">BUILD</div>
              <p className="text-xs text-[#8b949e] leading-relaxed font-normal">
                Implement the API according to the challenge specification using your language of choice (Node.js, Go, Python, Java, Rust).
              </p>
              <div className="pt-2 text-[11px] text-[#6e7681]">
                Specification checklist & starter code included
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded bg-[#12161f] border border-[#262d3a] hover:border-[#374151] transition-all space-y-3 relative group">
              <div className="font-mono text-2xl font-bold text-emerald-400/70 group-hover:text-emerald-400 transition-colors">
                02
              </div>
              <div className="text-base font-semibold text-[#e6edf3]">TEST</div>
              <p className="text-xs text-[#8b949e] leading-relaxed font-normal">
                Run your implementation against automated contract suites and hidden stress tests that evaluate RFC status codes, latency, and race conditions.
              </p>
              <div className="pt-2 text-[11px] text-[#6e7681]">
                Live terminal wire logs & diff inspection
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded bg-[#12161f] border border-[#262d3a] hover:border-[#374151] transition-all space-y-3 relative group">
              <div className="font-mono text-2xl font-bold text-emerald-400/70 group-hover:text-emerald-400 transition-colors">
                03
              </div>
              <div className="text-base font-semibold text-[#e6edf3]">IMPROVE</div>
              <p className="text-xs text-[#8b949e] leading-relaxed font-normal">
                Understand failures, patch subtle edge cases, optimize throughput, and gain certified mastery in core backend infrastructure.
              </p>
              <div className="pt-2 text-[11px] text-[#6e7681]">
                Skill telemetry & concept progression tracking
              </div>
            </div>
          </div>
        </section>

        {/* CHALLENGE PREVIEW SECTION */}
        <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[#262d3a] pb-4">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                CURATED CHALLENGES
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#e6edf3] tracking-tight">
                Real backend problems. Not toy questions.
              </h2>
              <p className="text-xs sm:text-sm text-[#8b949e] font-normal">
                Practical backend architectures, middleware, caching layers, and distributed workers.
              </p>
            </div>

            <button
              onClick={onExploreChallenges}
              className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <span>View all 8 challenges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previewChallenges.map((challenge) => (
              <div
                key={challenge.id}
                onClick={() => onSelectChallenge(challenge)}
                className="group p-5 rounded bg-[#12161f] border border-[#262d3a] hover:border-[#374151] transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#8b949e] bg-[#171c26] px-2 py-0.5 rounded border border-[#272e3a]">
                      {challenge.category}
                    </span>
                    <DifficultyBadge difficulty={challenge.difficulty} />
                  </div>

                  <h3 className="text-base font-semibold text-[#e6edf3] group-hover:text-emerald-400 transition-colors">
                    {challenge.title}
                  </h3>

                  <p className="text-xs text-[#8b949e] line-clamp-2 leading-relaxed font-normal">
                    {challenge.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#262d3a]/60 flex items-center justify-between text-xs">
                  <div className="flex flex-wrap gap-1.5 font-mono">
                    {challenge.concepts.slice(0, 3).map((c) => (
                      <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-[#090b0e] text-[#8b949e]">
                        {c}
                      </span>
                    ))}
                  </div>

                  <span className="text-emerald-400 font-medium flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform text-xs">
                    <span>Start</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={onExploreChallenges}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded bg-[#12161f] border border-[#262d3a] text-xs font-medium text-[#e6edf3] hover:text-white hover:border-[#374151] transition-colors"
            >
              <span>Explore All Challenges</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </section>

        {/* DEVELOPER-FOCUSED EVALUATION SECTION */}
        <section className="py-20 px-4 sm:px-6 border-t border-[#262d3a] bg-[#07080b]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                DEEP TEST COVERAGE
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e6edf3] tracking-tight">
                Because working code isn't enough.
              </h2>
              <p className="text-sm text-[#8b949e] leading-relaxed font-normal">
                API Run evaluates how your API behaves — including the cases your happy-path request never sees.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded bg-[#12161f] border border-[#262d3a] space-y-2.5">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Server className="w-4 h-4" />
                  <span className="text-sm font-semibold text-[#e6edf3]">HTTP Semantics & RFC</span>
                </div>
                <p className="text-xs text-[#8b949e] leading-relaxed font-normal">
                  Accurate status code compliance (201, 200, 400, 404, 409, 422, 429), strict header parsing, and standard error envelopes.
                </p>
                <div className="text-[10px] font-mono text-emerald-400">#HTTP #REST #RFC_9110</div>
              </div>

              <div className="p-5 rounded bg-[#12161f] border border-[#262d3a] space-y-2.5">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-semibold text-[#e6edf3]">Validation & Boundaries</span>
                </div>
                <p className="text-xs text-[#8b949e] leading-relaxed font-normal">
                  Malformed payloads, missing fields, type boundary limits, and unexpected Unicode inputs tested rigorously.
                </p>
                <div className="text-[10px] font-mono text-emerald-400">#Validation #Schema #422</div>
              </div>

              <div className="p-5 rounded bg-[#12161f] border border-[#262d3a] space-y-2.5">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-semibold text-[#e6edf3]">Auth & Security</span>
                </div>
                <p className="text-xs text-[#8b949e] leading-relaxed font-normal">
                  JWT validation, bearer authentication headers, sliding refresh token rotation, and family reuse revocation.
                </p>
                <div className="text-[10px] font-mono text-emerald-400">#JWT #Auth #Rotation</div>
              </div>

              <div className="p-5 rounded bg-[#12161f] border border-[#262d3a] space-y-2.5">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Database className="w-4 h-4" />
                  <span className="text-sm font-semibold text-[#e6edf3]">Redis & Memory Stores</span>
                </div>
                <p className="text-xs text-[#8b949e] leading-relaxed font-normal">
                  ZSET sliding windows, millisecond TTL expirations, passive and active memory sweep evictions.
                </p>
                <div className="text-[10px] font-mono text-emerald-400">#Redis #ZSET #TTL</div>
              </div>

              <div className="p-5 rounded bg-[#12161f] border border-[#262d3a] space-y-2.5">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Cpu className="w-4 h-4" />
                  <span className="text-sm font-semibold text-[#e6edf3]">Concurrency & Race Conditions</span>
                </div>
                <p className="text-xs text-[#8b949e] leading-relaxed font-normal">
                  Multi-threaded parallel bursts to test double-spending, registration collisions, and atomic locking.
                </p>
                <div className="text-[10px] font-mono text-emerald-400">#Concurrency #Locks #ACID</div>
              </div>

              <div className="p-5 rounded bg-[#12161f] border border-[#262d3a] space-y-2.5">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-semibold text-[#e6edf3]">Webhooks & Idempotency</span>
                </div>
                <p className="text-xs text-[#8b949e] leading-relaxed font-normal">
                  HMAC-SHA256 signature verification, event deduplication, and exactly-once processing on network retries.
                </p>
                <div className="text-[10px] font-mono text-emerald-400">#Webhooks #HMAC #Idempotency</div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-24 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-6">
          <div className="p-10 sm:p-14 rounded-xl bg-gradient-to-b from-[#12161f] to-[#090b0e] border border-[#262d3a] space-y-6 glow-emerald">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#e6edf3] tracking-tight">
              Ready to build better backends?
            </h2>
            <p className="text-sm sm:text-base text-[#8b949e] max-w-xl mx-auto font-normal leading-relaxed">
              Pick a challenge. Ship an API. Find the edge cases.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onSelectChallenge(challenges[0] || challenges[1])}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm transition-all hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-[0.98]"
              >
                <span>Start Your First Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#262d3a] bg-[#050608] py-12 px-4 sm:px-6 text-xs">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <img src="/logo.png" alt="API Run" className="h-5 w-5 object-contain rounded" />
                <span className="font-semibold text-[#e6edf3]">API Run</span>
                <span className="text-[10px] font-mono text-[#6e7681]">v0.9.4</span>
              </div>
              <div className="text-[#8b949e] font-normal">Build. Test. Improve.</div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-[#8b949e] font-medium">
              <button
                onClick={onExploreChallenges}
                className="hover:text-emerald-400 transition-colors"
              >
                Challenges
              </button>
              <button
                onClick={onNavigateProgress}
                className="hover:text-emerald-400 transition-colors"
              >
                Progress
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center space-x-1"
              >
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <span className="text-[#484f58]">|</span>
              <span className="text-emerald-400/80 font-mono text-[11px]">API Contract Engine Online</span>
            </div>
          </div>
          <div className="max-w-6xl mx-auto pt-6 text-center text-[#484f58] text-[11px] font-normal">
            © {new Date().getFullYear()} API Run. Developer platform for backend engineering.
          </div>
        </footer>
      </div>
    </div>
  );
};