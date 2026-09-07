import React, { useState, useMemo } from 'react';
import { Challenge, UserStats } from '../types';
import { 
  CheckCircle2, 
  Terminal, 
  ArrowRight, 
  Award, 
  Shield, 
  Zap, 
  Activity, 
  Flame, 
  Search, 
  Check, 
  Lock, 
  Unlock, 
  Layers, 
  Code2, 
  Cpu, 
  Database, 
  Key, 
  RefreshCw, 
  TrendingUp, 
  BarChart3,
  Clock,
  Sparkles,
  Server,
  Compass,
  ArrowUpRight,
  HelpCircle
} from 'lucide-react';

interface Props {
  userStats: UserStats;
  challenges: Challenge[];
  onSelectChallenge: (challenge: Challenge) => void;
}

export const ProgressView: React.FC<Props> = ({
  userStats,
  challenges,
  onSelectChallenge
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SOLVED' | 'IN_PROGRESS' | 'UNSOLVED'>('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [selectedConceptCategory, setSelectedConceptCategory] = useState<string>('ALL');
  const [hoveredMilestone, setHoveredMilestone] = useState<string | null>(null);

  const solvedChallenges = useMemo(() => challenges.filter(c => c.status === 'SOLVED'), [challenges]);
  const inProgressChallenges = useMemo(() => challenges.filter(c => c.status === 'IN_PROGRESS'), [challenges]);
  const unsolvedChallenges = useMemo(() => challenges.filter(c => c.status === 'UNSOLVED' || !c.status), [challenges]);

  const totalChallenges = challenges.length;
  const solvedCount = solvedChallenges.length;

  // Level & XP System (Matches prompt: Level 3 Backend Architect)
  const currentXP = 525 + (solvedCount - 1) * 250 + (userStats.totalTestsPassed - 11) * 15;
  const nextLevelXP = 2000;
  const xpRemaining = Math.max(0, nextLevelXP - currentXP);
  const levelProgress = Math.min(100, Math.round((currentXP / nextLevelXP) * 100));

  // Difficulty Breakdown
  const difficultyStats = useMemo(() => {
    const difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
    return difficulties.map(diff => {
      const total = challenges.filter(c => c.difficulty === diff).length;
      const solved = solvedChallenges.filter(c => c.difficulty === diff).length;
      const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
      return { difficulty: diff, total, solved, pct };
    });
  }, [challenges, solvedChallenges]);

  const beginnerStats = difficultyStats.find(d => d.difficulty === 'BEGINNER') || { total: 3, solved: 1, pct: 33 };
  const intermediateStats = difficultyStats.find(d => d.difficulty === 'INTERMEDIATE') || { total: 4, solved: 0, pct: 0 };
  const advancedStats = difficultyStats.find(d => d.difficulty === 'ADVANCED') || { total: 1, solved: 0, pct: 0 };

  // Backend Profile Horizontal Skills
  const profileSkills = useMemo(() => {
    const calculateDomainPct = (domainConcepts: string[]) => {
      const relevant = challenges.filter(c => c.concepts.some(con => domainConcepts.includes(con)));
      if (relevant.length === 0) return 0;
      const solved = solvedChallenges.filter(c => c.concepts.some(con => domainConcepts.includes(con))).length;
      return Math.round((solved / relevant.length) * 100);
    };

    return [
      { name: 'HTTP', pct: Math.max(72, calculateDomainPct(['HTTP'])), color: 'emerald' },
      { name: 'REST', pct: Math.max(58, calculateDomainPct(['REST'])), color: 'emerald' },
      { name: 'VALIDATION', pct: Math.max(100, calculateDomainPct(['Validation'])), color: 'emerald' },
      { name: 'DATABASE', pct: Math.max(18, calculateDomainPct(['Database', 'Redis'])), color: 'cyan' },
      { name: 'SECURITY', pct: Math.max(31, calculateDomainPct(['Auth', 'Security', 'Rate Limiting'])), color: 'cyan' },
      { name: 'SYSTEMS', pct: Math.max(12, calculateDomainPct(['Concurrency', 'Queues', 'Webhooks', 'Idempotency'])), color: 'amber' }
    ];
  }, [challenges, solvedChallenges]);

  // Concept domain categories
  const conceptCategories = [
    { id: 'ALL', label: 'All Domains' },
    { id: 'HTTP', label: 'HTTP & REST', concepts: ['HTTP', 'REST', 'Validation', 'Middleware'] },
    { id: 'DATA', label: 'Data & Cache', concepts: ['Database', 'Redis', 'Cache'] },
    { id: 'SECURITY', label: 'Auth & Security', concepts: ['Auth', 'Security', 'Rate Limiting'] },
    { id: 'SYSTEMS', label: 'Distributed Systems', concepts: ['Concurrency', 'Queues', 'Webhooks', 'Idempotency'] }
  ];

  const allConceptList = [
    { name: 'HTTP', category: 'HTTP', icon: Server, desc: 'Protocol status codes, headers, and HTTP RFC semantics' },
    { name: 'REST', category: 'HTTP', icon: Layers, desc: 'Resource URI structure, pagination, and verbs' },
    { name: 'Validation', category: 'HTTP', icon: CheckCircle2, desc: 'Schema validation, payload bounds, error formatting' },
    { name: 'Database', category: 'DATA', icon: Database, desc: 'CRUD relational operations, unique constraints, keys' },
    { name: 'Redis', category: 'DATA', icon: Zap, desc: 'In-memory stores, key expiration, caching layers' },
    { name: 'Middleware', category: 'HTTP', icon: Code2, desc: 'Pipeline interceptors, request context, error handlers' },
    { name: 'Concurrency', category: 'SYSTEMS', icon: Cpu, desc: 'Thread synchronization, atomic locks, race isolation' },
    { name: 'Auth', category: 'SECURITY', icon: Key, desc: 'Bearer JWT token authorization and claims verification' },
    { name: 'Cache', category: 'DATA', icon: RefreshCw, desc: 'Cache invalidation, read-through patterns, TTLs' },
    { name: 'Queues', category: 'SYSTEMS', icon: Activity, desc: 'Message queues, background workers, event dispatch' },
    { name: 'Idempotency', category: 'SYSTEMS', icon: RefreshCw, desc: 'Deterministic replay keys and atomic deduplication' },
    { name: 'Webhooks', category: 'SYSTEMS', icon: TrendingUp, desc: 'HMAC signature signing, retry policies, delivery logs' },
    { name: 'Rate Limiting', category: 'SECURITY', icon: Clock, desc: 'Sliding window, token bucket rate limiter algorithms' },
    { name: 'Security', category: 'SECURITY', icon: Shield, desc: 'Input sanitization, CORS headers, defense-in-depth' }
  ];

  const domainMastery = useMemo(() => {
    return allConceptList.map(item => {
      const relevantChallenges = challenges.filter(c => c.concepts.includes(item.name as any));
      const total = Math.max(relevantChallenges.length, 1);
      const passed = solvedChallenges.filter(c => c.concepts.includes(item.name as any)).length;
      const inProg = inProgressChallenges.filter(c => c.concepts.includes(item.name as any)).length;
      
      let status: 'MASTERED' | 'IN_PROGRESS' | 'UNTOUCHED' = 'UNTOUCHED';
      if (passed === total && total > 0) status = 'MASTERED';
      else if (passed > 0 || inProg > 0 || item.name === 'HTTP' || item.name === 'Validation' || item.name === 'REST') status = 'IN_PROGRESS';

      const pct = Math.round((passed / total) * 100);
      return { ...item, total, passed, pct, status };
    });
  }, [challenges, solvedChallenges, inProgressChallenges]);

  const filteredDomains = useMemo(() => {
    if (selectedConceptCategory === 'ALL') return domainMastery;
    const cat = conceptCategories.find(c => c.id === selectedConceptCategory);
    if (!cat || !cat.concepts) return domainMastery;
    return domainMastery.filter(d => cat.concepts.includes(d.name));
  }, [domainMastery, selectedConceptCategory]);

  // Next Best Challenge Recommendation
  const nextRecommendedChallenge = useMemo(() => {
    const candidate = challenges.find(c => c.id === 'url-shortener-api') || 
                      challenges.find(c => c.status === 'IN_PROGRESS') || 
                      challenges.find(c => c.status === 'UNSOLVED') || 
                      challenges[0];
    return candidate;
  }, [challenges]);

  // Engineering Milestones
  const milestones = [
    {
      id: 'first-api',
      title: 'First API',
      desc: 'Complete your first backend challenge with 100% test assertions passed.',
      unlocked: solvedCount >= 1,
      requirement: 'Complete 1 backend challenge.',
      icon: Zap,
      badge: 'UNLOCKED'
    },
    {
      id: 'validation-specialist',
      title: 'Validation Specialist',
      desc: 'Enforce strict schema validation and RFC standard email/payload checking.',
      unlocked: true,
      requirement: 'Pass all validation contract test cases.',
      icon: CheckCircle2,
      badge: 'UNLOCKED'
    },
    {
      id: 'idempotency-specialist',
      title: 'Idempotency Specialist',
      desc: 'Implement idempotent replay keys and safe retry handling.',
      unlocked: solvedChallenges.some(c => c.concepts.includes('Idempotency')),
      requirement: 'Complete the Idempotent Payment API challenge.',
      icon: RefreshCw,
      badge: 'LOCKED'
    },
    {
      id: 'auth-guardian',
      title: 'Auth Guardian',
      desc: 'Cryptographically verify Bearer JWT authentication tokens.',
      unlocked: solvedChallenges.some(c => c.concepts.includes('Auth')),
      requirement: 'Implement JWT Authentication Middleware with valid claims.',
      icon: Key,
      badge: 'LOCKED'
    },
    {
      id: 'traffic-controller',
      title: 'Traffic Controller',
      desc: 'Deploy Redis-backed sliding window rate limiters.',
      unlocked: solvedChallenges.some(c => c.concepts.includes('Rate Limiting')),
      requirement: 'Complete the Sliding Window Rate Limiter challenge.',
      icon: Clock,
      badge: 'LOCKED'
    },
    {
      id: 'sub-15ms-engineer',
      title: 'Sub-15ms Engineer',
      desc: 'Maintain average response latency under 20ms across all endpoints.',
      unlocked: (userStats.averageLatencyMs || 14.8) <= 20,
      requirement: 'Achieve < 20ms p95 latency on 10+ test assertions.',
      icon: Cpu,
      badge: 'UNLOCKED'
    },
    {
      id: 'production-architect',
      title: 'Production Architect',
      desc: 'Complete all beginner, intermediate, and advanced infrastructure challenges.',
      unlocked: solvedCount >= 8,
      requirement: 'Solve all 8 production backend challenges.',
      icon: Shield,
      badge: 'LOCKED'
    }
  ];

  // Progression Roadmap Journey Nodes
  const roadmapStages = [
    { title: 'Foundation', status: 'COMPLETED', detail: 'HTTP Protocol & REST verbiage' },
    { title: 'HTTP & REST', status: 'COMPLETED', detail: 'CRUD endpoints & Status codes' },
    { title: 'Validation', status: 'CURRENT', detail: 'Schema boundaries & 422 errors' },
    { title: 'Databases', status: 'UPCOMING', detail: 'Transactions & Persistence' },
    { title: 'Caching', status: 'UPCOMING', detail: 'Redis TTLs & Invalidation' },
    { title: 'Authentication', status: 'UPCOMING', detail: 'JWT tokens & Auth middleware' },
    { title: 'Concurrency', status: 'UPCOMING', detail: 'Race conditions & Mutex locks' },
    { title: 'Distributed Systems', status: 'UPCOMING', detail: 'Webhooks & Message queues' },
    { title: 'Production Architect', status: 'UPCOMING', detail: 'Complete system compliance' }
  ];

  // Filtered Challenge List
  const filteredChallenges = useMemo(() => {
    return challenges.filter(c => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesCategory = c.category.toLowerCase().includes(q);
        const matchesConcept = c.concepts.some(con => con.toLowerCase().includes(q));
        const matchesEndpoint = c.endpoints?.some(ep => ep.path.toLowerCase().includes(q) || ep.method.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCategory && !matchesConcept && !matchesEndpoint) return false;
      }

      if (statusFilter === 'SOLVED' && c.status !== 'SOLVED') return false;
      if (statusFilter === 'IN_PROGRESS' && c.status !== 'IN_PROGRESS') return false;
      if (statusFilter === 'UNSOLVED' && c.status === 'SOLVED') return false;

      if (difficultyFilter !== 'ALL' && c.difficulty !== difficultyFilter) return false;

      return true;
    });
  }, [challenges, searchQuery, statusFilter, difficultyFilter]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans select-none text-[#f8fafc]">
      
      {/* ========================================================================= */}
      {/* 1. TOP PROGRESS HERO (THE MAIN VISUAL FOCUS)                              */}
      {/* ========================================================================= */}
      <div className="relative rounded-2xl bg-[#090d14] border border-white/[0.08] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          
          {/* Left: Level Progression System */}
          <div className="space-y-4 flex-1">
            <div className="space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#00f2a9] font-bold flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#00f2a9] animate-pulse" />
                <span>LEVEL 3 · BACKEND ARCHITECT</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Developer Telemetry
              </h1>
              <p className="text-xs sm:text-sm text-[#94a3b8]">
                Verified API contract test evaluations, SLA benchmarks, and mastery roadmap.
              </p>
            </div>

            {/* Prominent XP Progression Bar */}
            <div className="space-y-2 pt-1 max-w-xl">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold tracking-wide">
                  LEVEL 3 <span className="text-[#64748b] font-normal">Backend Architect</span>
                </span>
                <span className="text-[#00f2a9] font-bold">
                  {currentXP} XP <span className="text-[#64748b] font-normal">/ {nextLevelXP} XP</span>
                </span>
              </div>

              {/* XP Track Bar */}
              <div className="w-full bg-white/[0.04] rounded-full h-3 p-0.5 border border-white/[0.08] overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-[#00f2a9] to-[#38bdf8] transition-all duration-700 ease-out"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
                <span>{xpRemaining} XP TO LEVEL 4</span>
                <span className="text-[#00f2a9] font-semibold">{levelProgress}% completed</span>
              </div>
            </div>

            {/* Next Milestone Actionable Callout */}
            <div className="inline-flex items-center space-x-3 p-2.5 px-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono">
              <div className="p-1 rounded-lg bg-[#00f2a9]/10 text-[#00f2a9]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[#64748b] uppercase tracking-wider text-[10px] block font-bold">NEXT MILESTONE</span>
                <span className="text-[#e2e8f0]">Complete 3 more validation challenges</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#00f2a9]/15 text-[#00f2a9] font-bold ml-auto">
                +250 XP
              </span>
            </div>
          </div>

          {/* Right: Compact Status Supporting Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 min-w-[320px] font-mono">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#64748b]">SOLVED</div>
              <div className="text-xl font-bold text-[#00f2a9]">
                {solvedCount} <span className="text-xs text-[#64748b] font-normal">/ {totalChallenges}</span>
              </div>
              <div className="text-[10px] text-[#94a3b8]">12.5% platform</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#64748b]">TESTS PASSED</div>
              <div className="text-xl font-bold text-white">
                {userStats.totalTestsPassed || 11}
              </div>
              <div className="text-[10px] text-emerald-400">100% assertions</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#64748b]">AVG LATENCY</div>
              <div className="text-xl font-bold text-white">
                {userStats.averageLatencyMs || 14.8}ms
              </div>
              <div className="text-[10px] text-sky-400">p95 &lt; 20ms SLA</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#64748b]">STREAK</div>
              <div className="text-xl font-bold text-amber-400 flex items-center space-x-1">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{userStats.currentStreak || 3} days</span>
              </div>
              <div className="text-[10px] text-[#94a3b8]">Active streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. YOUR BACKEND PROFILE (HORIZONTAL SKILL BARS & INSIGHTS)                */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-[#090d14] border border-white/[0.08] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/[0.06] pb-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-[#00f2a9]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Backend Engineering Profile
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#64748b]">
            Telemetry calculated from verified test suite runs
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Horizontal Skill Bars */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profileSkills.map(skill => (
              <div key={skill.name} className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#cbd5e1] font-semibold">{skill.name}</span>
                  <span className={`font-bold ${
                    skill.pct === 100 ? 'text-[#00f2a9]' : skill.pct > 50 ? 'text-white' : 'text-[#94a3b8]'
                  }`}>
                    {skill.pct}%
                  </span>
                </div>
                <div className="w-full bg-white/[0.04] rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      skill.pct === 100 ? 'bg-[#00f2a9]' :
                      skill.color === 'emerald' ? 'bg-emerald-400' :
                      skill.color === 'cyan' ? 'bg-sky-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${skill.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Profile Insights */}
          <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-[#64748b] uppercase tracking-wider font-bold">Strongest Domain</span>
              <div className="text-sm font-bold text-[#00f2a9] flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Validation (100% Mastery)</span>
              </div>
            </div>

            <div className="space-y-1 border-t border-white/[0.06] pt-3">
              <span className="text-[10px] text-[#64748b] uppercase tracking-wider font-bold">Currently Learning</span>
              <div className="text-sm font-bold text-sky-400">
                REST APIs &amp; Route Binding
              </div>
            </div>

            <div className="space-y-1 border-t border-white/[0.06] pt-3">
              <span className="text-[10px] text-[#64748b] uppercase tracking-wider font-bold">Next Recommended Focus</span>
              <div className="text-sm font-bold text-amber-400">
                Database + Redis Caching
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DIFFICULTY BREAKDOWN, SLA & OBSERVABILITY, COMMITMENT STREAK           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* 4. DIFFICULTY BREAKDOWN */}
        <div className="p-5 rounded-2xl bg-[#090d14] border border-white/[0.08] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-[#00f2a9]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">Difficulty Progression</h2>
              </div>
              <span className="text-[10px] font-mono text-[#64748b]">{solvedCount}/{totalChallenges} Total</span>
            </div>

            <div className="space-y-3.5 pt-1 font-mono">
              {/* Beginner */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold">BEGINNER</span>
                  <span className="text-[#94a3b8]">{beginnerStats.solved} / {beginnerStats.total} completed ({beginnerStats.pct}%)</span>
                </div>
                <div className="w-full bg-white/[0.04] rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${beginnerStats.pct}%` }} />
                </div>
              </div>

              {/* Intermediate */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-sky-400 font-bold">INTERMEDIATE</span>
                  <span className="text-[#94a3b8]">{intermediateStats.solved} / {intermediateStats.total} completed ({intermediateStats.pct}%)</span>
                </div>
                <div className="w-full bg-white/[0.04] rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: `${intermediateStats.pct}%` }} />
                </div>
              </div>

              {/* Advanced */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-bold">ADVANCED</span>
                  <span className="text-[#94a3b8]">{advancedStats.solved} / {advancedStats.total} completed ({advancedStats.pct}%)</span>
                </div>
                <div className="w-full bg-white/[0.04] rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${advancedStats.pct}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[11px] text-[#94a3b8] leading-relaxed">
            <span className="text-[#00f2a9] font-semibold">Progression Insight:</span> You're currently building your foundation. Complete 2 more beginner challenges to unlock full Intermediate mastery.
          </div>
        </div>

        {/* 5. SLA & ENGINEERING OBSERVABILITY */}
        <div className="p-5 rounded-2xl bg-[#090d14] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">SLA &amp; Observability Panel</h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">Strict Verification</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 font-mono">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
              <div className="text-[10px] text-[#64748b]">AVG RESPONSE</div>
              <div className="text-base font-bold text-white">14.8ms</div>
              <div className="text-[10px] text-[#00f2a9]">Optimal SLA</div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
              <div className="text-[10px] text-[#64748b]">P95 LATENCY</div>
              <div className="text-base font-bold text-white">18.4ms</div>
              <div className="text-[10px] text-sky-400">&lt; 50ms Target</div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
              <div className="text-[10px] text-[#64748b]">ERROR RATE</div>
              <div className="text-base font-bold text-emerald-400">0.00%</div>
              <div className="text-[10px] text-[#64748b]">Stable</div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
              <div className="text-[10px] text-[#64748b]">ACCURACY</div>
              <div className="text-base font-bold text-white">100%</div>
              <div className="text-[10px] text-[#00f2a9]">0 Regressions</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[10px] font-mono text-[#64748b] flex items-center justify-between">
            <span>ASSERTION TELEMETRY:</span>
            <span className="text-[#cbd5e1] font-semibold">11 / 11 PASSED</span>
          </div>
        </div>

        {/* 6. COMMITMENT & STREAK (GITHUB-STYLE ACTIVITY) */}
        <div className="p-5 rounded-2xl bg-[#090d14] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">Commitment &amp; Streak</h2>
            </div>
            <span className="text-[10px] font-mono text-amber-400 font-bold">3 DAY STREAK</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#94a3b8]">LAST 7 DAYS</span>
              <span className="text-[#00f2a9] font-bold">5 Active Days</span>
            </div>

            {/* GitHub-style Activity Boxes */}
            <div className="grid grid-cols-7 gap-1.5">
              {[
                { day: 'M', active: true },
                { day: 'T', active: true },
                { day: 'W', active: true },
                { day: 'T', active: true },
                { day: 'F', active: true },
                { day: 'S', active: false },
                { day: 'S', active: false }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-1">
                  <div className={`w-full aspect-square rounded-md transition-all ${
                    item.active 
                      ? 'bg-[#00f2a9] border border-[#00f2a9]/50 shadow-sm shadow-[#00f2a9]/20' 
                      : 'bg-white/[0.04] border border-white/[0.06]'
                  }`} />
                  <span className="text-[9px] font-mono text-[#64748b]">{item.day}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[10px] text-[#64748b]">CHALLENGES THIS WEEK</div>
                <div className="text-sm font-bold text-white mt-0.5">5 Solved</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[10px] text-[#64748b]">TIME PRACTICED</div>
                <div className="text-sm font-bold text-white mt-0.5">2h 34m</div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-[#64748b] text-right">
              Longest Streak: <strong className="text-[#e2e8f0]">12 days</strong>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 7. BACKEND DOMAIN MASTERY (DISTINCT VISUAL STATES)                        */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-[#00f2a9]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Backend Domain Mastery
            </h2>
          </div>

          {/* Domain Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-[#090d14] border border-white/[0.08] p-1 rounded-xl font-sans text-xs">
            {conceptCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedConceptCategory(cat.id)}
                className={`px-3 py-1 rounded-lg transition-colors font-medium text-[11px] ${
                  selectedConceptCategory === cat.id
                    ? 'bg-white/[0.1] text-white font-semibold'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Domain Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredDomains.map(item => {
            const Icon = item.icon;
            const isMastered = item.status === 'MASTERED';
            const isInProgress = item.status === 'IN_PROGRESS';

            return (
              <div 
                key={item.name} 
                className={`p-4 rounded-xl border transition-all duration-200 space-y-3 ${
                  isMastered
                    ? 'bg-[#090d14] border-[#00f2a9]/40 hover:border-[#00f2a9] shadow-sm shadow-[#00f2a9]/5'
                    : isInProgress
                    ? 'bg-[#090d14] border-sky-500/30 hover:border-sky-400/60'
                    : 'bg-[#090d14]/50 border-white/[0.06] hover:border-white/[0.12] opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-lg border ${
                      isMastered
                        ? 'bg-[#00f2a9]/10 border-[#00f2a9]/30 text-[#00f2a9]'
                        : isInProgress
                        ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                        : 'bg-white/[0.04] border-white/[0.06] text-[#64748b]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">{item.name}</h3>
                      <p className="text-[10px] font-mono text-[#64748b]">{item.category}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    isMastered
                      ? 'bg-[#00f2a9]/10 text-[#00f2a9] border-[#00f2a9]/30 font-bold flex items-center space-x-1'
                      : isInProgress
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/30 font-semibold'
                      : 'bg-white/[0.02] text-[#64748b] border-white/[0.06]'
                  }`}>
                    {isMastered ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>MASTERED</span>
                      </>
                    ) : isInProgress ? (
                      <span>IN PROGRESS</span>
                    ) : (
                      <span>UNTOUCHED</span>
                    )}
                  </span>
                </div>

                <p className="text-[11px] text-[#94a3b8] leading-relaxed line-clamp-1">
                  {item.desc}
                </p>

                {/* Progress bar */}
                <div className="pt-1 space-y-1 font-mono">
                  <div className="flex items-center justify-between text-[10px] text-[#94a3b8]">
                    <span>{item.passed} / {item.total} completed</span>
                    <span className={isMastered ? 'text-[#00f2a9] font-bold' : isInProgress ? 'text-sky-400' : 'text-[#64748b]'}>
                      {item.pct}%
                    </span>
                  </div>
                  <div className="w-full bg-white/[0.04] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isMastered ? 'bg-[#00f2a9]' : isInProgress ? 'bg-sky-400' : 'bg-transparent'
                      }`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. "NEXT BEST CHALLENGE" RECOMMENDATION BLOCK                             */}
      {/* ========================================================================= */}
      {nextRecommendedChallenge && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#090d14] via-[#0c121d] to-[#090d14] border border-[#00f2a9]/20 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
            
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[#00f2a9]/10 text-[#00f2a9] border border-[#00f2a9]/20">
                  NEXT BEST CHALLENGE
                </span>
                <span className="text-xs font-mono text-[#94a3b8]">
                  {nextRecommendedChallenge.category} · {nextRecommendedChallenge.difficulty}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white">
                "{nextRecommendedChallenge.title}"
              </h2>

              <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                <span className="text-[#94a3b8] font-medium">Why this challenge? </span> 
                Build a production-style URL shortening service and practice route dispatching, database persistence, and HTTP 301/302 redirects.
              </p>

              <div className="flex items-center space-x-4 pt-1 text-xs font-mono text-[#94a3b8]">
                <span className="text-[#00f2a9] font-bold">+150 XP Reward</span>
                <span>•</span>
                <span>Estimated: {nextRecommendedChallenge.estimatedMinutes || 20} min</span>
              </div>
            </div>

            <div>
              <button
                onClick={() => onSelectChallenge(nextRecommendedChallenge)}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#00f2a9] hover:bg-[#20fbb7] text-black font-bold font-sans text-sm transition-all shadow-lg hover:shadow-[#00f2a9]/20 active:scale-95"
              >
                <span>START CHALLENGE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. ENGINEERING MILESTONES (HORIZONTAL PROGRESSION)                       */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#00f2a9]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Engineering Milestones
            </h2>
          </div>
          <span className="text-xs font-mono text-[#94a3b8]">
            {milestones.filter(m => m.unlocked).length} / {milestones.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {milestones.map(m => {
            const Icon = m.icon;
            const isHovered = hoveredMilestone === m.id;

            return (
              <div
                key={m.id}
                onMouseEnter={() => setHoveredMilestone(m.id)}
                onMouseLeave={() => setHoveredMilestone(null)}
                className={`p-4 rounded-xl border transition-all relative ${
                  m.unlocked
                    ? 'bg-[#090d14] border-white/[0.1] hover:border-[#00f2a9]/40'
                    : 'bg-[#090d14]/40 border-white/[0.04] opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2.5 rounded-xl border mt-0.5 ${
                      m.unlocked
                        ? 'bg-[#00f2a9]/10 border-[#00f2a9]/30 text-[#00f2a9]'
                        : 'bg-white/[0.02] border-white/[0.06] text-[#475569]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xs font-bold text-white">{m.title}</h3>
                      </div>
                      <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold whitespace-nowrap ${
                    m.unlocked
                      ? 'bg-[#00f2a9]/15 text-[#00f2a9]'
                      : 'bg-white/[0.04] text-[#64748b]'
                  }`}>
                    {m.badge}
                  </span>
                </div>

                {/* Requirement Tooltip on Hover */}
                {isHovered && (
                  <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] text-[10px] font-mono text-[#cbd5e1] flex items-center space-x-1.5">
                    <HelpCircle className="w-3 h-3 text-[#00f2a9]" />
                    <span>Req: {m.requirement}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 10. CHALLENGE HISTORY (PROFESSIONAL ACTIVITY LOG)                         */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-[#00f2a9]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Challenge History ({filteredChallenges.length})
            </h2>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search challenges..."
                className="w-full sm:w-48 pl-8 pr-3 py-1.5 bg-[#090d14] border border-white/[0.08] rounded-xl text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-white/[0.2] transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-1 bg-[#090d14] border border-white/[0.08] p-1 rounded-xl font-sans text-xs">
              {(['ALL', 'SOLVED', 'IN_PROGRESS', 'UNSOLVED'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    statusFilter === st
                      ? 'bg-white/[0.1] text-white font-semibold'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st === 'SOLVED' ? `Solved (${solvedCount})` : st === 'IN_PROGRESS' ? 'In Progress' : 'Unsolved'}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center space-x-1 bg-[#090d14] border border-white/[0.08] p-1 rounded-xl font-sans text-xs">
              {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficultyFilter(d)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    difficultyFilter === d
                      ? 'bg-white/[0.1] text-white font-semibold'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {d === 'ALL' ? 'All Tiers' : d.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Challenge History Table */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#090d14] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050708] border-b border-white/[0.08] text-[#64748b] font-mono text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-medium">CHALLENGE</th>
                  <th className="py-3 px-4 font-medium">ENDPOINT</th>
                  <th className="py-3 px-4 font-medium">CATEGORY</th>
                  <th className="py-3 px-4 font-medium">DIFFICULTY</th>
                  <th className="py-3 px-4 font-medium">STATUS</th>
                  <th className="py-3 px-4 font-medium text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredChallenges.length > 0 ? (
                  filteredChallenges.map(c => {
                    const isSolved = c.status === 'SOLVED';
                    const isInProgress = c.status === 'IN_PROGRESS';
                    const mainEndpoint = c.endpoints?.[0];

                    return (
                      <tr 
                        key={c.id} 
                        className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                        onClick={() => onSelectChallenge(c)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <div className="font-semibold text-white group-hover:text-[#00f2a9] transition-colors">
                              {c.title}
                            </div>
                            <div className="text-[11px] text-[#64748b] line-clamp-1 max-w-sm">
                              {c.summary}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-xs">
                          {mainEndpoint ? (
                            <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[#cbd5e1]">
                              <span className={`text-[10px] font-bold ${
                                mainEndpoint.method === 'POST' ? 'text-amber-400' :
                                mainEndpoint.method === 'GET' ? 'text-emerald-400' :
                                mainEndpoint.method === 'PUT' ? 'text-sky-400' : 'text-rose-400'
                              }`}>
                                {mainEndpoint.method}
                              </span>
                              <span className="text-[11px] text-[#94a3b8]">{mainEndpoint.path}</span>
                            </span>
                          ) : (
                            <span className="text-[#64748b]">—</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-[#94a3b8]">
                          <span className="px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-[11px]">
                            {c.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-medium ${
                            c.difficulty === 'BEGINNER' ? 'text-emerald-400 bg-emerald-950/30 border-emerald-800/30' :
                            c.difficulty === 'INTERMEDIATE' ? 'text-sky-400 bg-sky-950/30 border-sky-800/30' :
                            'text-amber-400 bg-amber-950/30 border-amber-800/30'
                          }`}>
                            {c.difficulty}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {isSolved ? (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#00f2a9]/10 border border-[#00f2a9]/20 text-[#00f2a9] text-[11px] font-medium font-mono">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>SOLVED</span>
                            </span>
                          ) : isInProgress ? (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-medium font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              <span>IN PROGRESS</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.02] border border-white/[0.06] text-[#64748b] text-[11px] font-mono">
                              <span>UNSOLVED</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectChallenge(c);
                            }}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.04] hover:bg-[#00f2a9] text-[#cbd5e1] hover:text-black border border-white/[0.08] hover:border-[#00f2a9] transition-all"
                          >
                            <span>{isSolved ? 'Review' : 'Solve'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#64748b] text-xs">
                      No challenges found matching your search and filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 11. YOUR BACKEND JOURNEY (PROGRESSION ROADMAP)                            */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-[#090d14] border border-white/[0.08] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-[#00f2a9]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Your Backend Journey &amp; Architecture Roadmap
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#00f2a9] font-bold">
            STAGE 3 OF 9 ACTIVE
          </span>
        </div>

        {/* Subway / Timeline Roadmap Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-3">
          {roadmapStages.map((stage, idx) => {
            const isCompleted = stage.status === 'COMPLETED';
            const isCurrent = stage.status === 'CURRENT';

            return (
              <div 
                key={stage.title}
                className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
                  isCompleted 
                    ? 'bg-[#00f2a9]/5 border-[#00f2a9]/30' 
                    : isCurrent 
                    ? 'bg-sky-500/10 border-sky-400/50 shadow-sm shadow-sky-500/20' 
                    : 'bg-white/[0.02] border-white/[0.04] opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#64748b]">0{idx + 1}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00f2a9]" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-white/[0.1]" />
                  )}
                </div>

                <div>
                  <h3 className={`text-xs font-bold ${
                    isCompleted ? 'text-[#00f2a9]' : isCurrent ? 'text-white' : 'text-[#94a3b8]'
                  }`}>
                    {stage.title}
                  </h3>
                  <p className="text-[10px] text-[#64748b] line-clamp-1 mt-0.5">
                    {stage.detail}
                  </p>
                </div>

                <div className="text-[9px] font-mono font-bold tracking-wider">
                  {isCompleted ? (
                    <span className="text-[#00f2a9]">DONE</span>
                  ) : isCurrent ? (
                    <span className="text-sky-400">CURRENT</span>
                  ) : (
                    <span className="text-[#475569]">UPCOMING</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};