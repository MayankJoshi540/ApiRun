'use client';

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
  Server,
  Compass,
  HelpCircle,
  MapPin,
  Calendar,
  CheckCircle,
  Tag,
  ChevronRight
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
  const [selectedSubmissionsTab, setSelectedSubmissionsTab] = useState<'ALL' | 'AC' | 'IN_PROGRESS'>('ALL');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<'ALL' | 'CORE' | 'SECURITY' | 'DISTRIBUTED'>('ALL');
  const [searchHistory, setSearchHistory] = useState('');

  const solvedChallenges = useMemo(() => challenges.filter(c => c.status === 'SOLVED'), [challenges]);
  const inProgressChallenges = useMemo(() => challenges.filter(c => c.status === 'IN_PROGRESS'), [challenges]);
  const totalChallenges = challenges.length;
  const solvedCount = solvedChallenges.length;
  const solvedPercent = totalChallenges > 0 ? Math.round((solvedCount / totalChallenges) * 100) : 0;

  // Breakdown by LeetCode difficulty tiers
  const easyChallenges = useMemo(() => challenges.filter(c => c.difficulty === 'BEGINNER'), [challenges]);
  const mediumChallenges = useMemo(() => challenges.filter(c => c.difficulty === 'INTERMEDIATE'), [challenges]);
  const hardChallenges = useMemo(() => challenges.filter(c => c.difficulty === 'ADVANCED'), [challenges]);

  const easySolved = useMemo(() => solvedChallenges.filter(c => c.difficulty === 'BEGINNER').length, [solvedChallenges]);
  const mediumSolved = useMemo(() => solvedChallenges.filter(c => c.difficulty === 'INTERMEDIATE').length, [solvedChallenges]);
  const hardSolved = useMemo(() => solvedChallenges.filter(c => c.difficulty === 'ADVANCED').length, [solvedChallenges]);

  // Skill Tags (LeetCode style: Advanced, Intermediate, Fundamental)
  const skillTags = [
    { name: 'Input Validation', count: 1, total: 2, level: 'CORE' },
    { name: 'HTTP Protocol & REST', count: 1, total: 3, level: 'CORE' },
    { name: 'Database CRUD & SQL', count: 0, total: 2, level: 'CORE' },
    { name: 'JWT Authentication', count: 0, total: 1, level: 'SECURITY' },
    { name: 'Rate Limiting Algorithms', count: 0, total: 1, level: 'SECURITY' },
    { name: 'Security & CORS Headers', count: 0, total: 1, level: 'SECURITY' },
    { name: 'Redis In-Memory Cache', count: 0, total: 2, level: 'DISTRIBUTED' },
    { name: 'Concurrency & Mutex Locks', count: 0, total: 1, level: 'DISTRIBUTED' },
    { name: 'Idempotency Keys', count: 0, total: 1, level: 'DISTRIBUTED' },
    { name: 'Webhook Event Dispatch', count: 0, total: 1, level: 'DISTRIBUTED' },
    { name: 'Background Message Queues', count: 0, total: 1, level: 'DISTRIBUTED' },
  ];

  const filteredSkills = useMemo(() => {
    if (selectedSkillCategory === 'ALL') return skillTags;
    return skillTags.filter(s => s.level === selectedSkillCategory);
  }, [selectedSkillCategory]);

  // Badges showcase (LeetCode Badges)
  const badges = [
    { id: 'b1', name: 'First AC', desc: 'Solved 1st backend challenge', date: 'Sep 2026', unlocked: true, icon: Zap, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'b2', name: 'Validation Master', desc: 'Passed all input validation suites', date: 'Sep 2026', unlocked: true, icon: CheckCircle2, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    { id: 'b3', name: 'Sub-15ms Latency', desc: 'Average latency under 20ms', date: 'Active', unlocked: true, icon: Cpu, color: 'text-[#00f2a9] bg-[#00f2a9]/10 border-[#00f2a9]/20' },
    { id: 'b4', name: 'Idempotency Key', desc: 'Completed safe retry API', date: 'Locked', unlocked: false, icon: RefreshCw, color: 'text-zinc-500 bg-zinc-900/40 border-zinc-800/80' },
    { id: 'b5', name: 'JWT Auth Sentinel', desc: 'Bearer token crypto verify', date: 'Locked', unlocked: false, icon: Key, color: 'text-zinc-500 bg-zinc-900/40 border-zinc-800/80' },
    { id: 'b6', name: 'Production 50 AC', desc: '50 challenges completed', date: 'Locked', unlocked: false, icon: Award, color: 'text-zinc-500 bg-zinc-900/40 border-zinc-800/80' }
  ];

  // LeetCode Heatmap Weeks Simulation
  const heatmapWeeks = useMemo(() => {
    const weeks: { day: number; count: number; active: boolean }[][] = [];
    for (let w = 0; w < 16; w++) {
      const week: { day: number; count: number; active: boolean }[] = [];
      for (let d = 0; d < 7; d++) {
        const isRecent = w >= 13;
        const count = isRecent && (d === 1 || d === 2 || d === 3 || d === 4 || d === 5) ? (w === 15 ? 4 : (d % 3) + 1) : 0;
        week.push({ day: d, count, active: count > 0 });
      }
      weeks.push(week);
    }
    return weeks;
  }, []);

  // Filtered Submissions List
  const filteredSubmissions = useMemo(() => {
    return challenges.filter(c => {
      if (searchHistory.trim()) {
        const q = searchHistory.toLowerCase();
        if (!c.title.toLowerCase().includes(q) && !c.category.toLowerCase().includes(q)) return false;
      }
      if (selectedSubmissionsTab === 'AC' && c.status !== 'SOLVED') return false;
      if (selectedSubmissionsTab === 'IN_PROGRESS' && c.status !== 'IN_PROGRESS') return false;
      return true;
    });
  }, [challenges, searchHistory, selectedSubmissionsTab]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans select-none text-slate-100 antialiased">
      
      {/* 2-COLUMN LEETCODE DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: USER PROFILE, STATS & LANGUAGE METRICS (LEETCODE PROFILE)   */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Profile Card */}
          <div className="rounded-2xl bg-[#0b0f17] border border-white/[0.08] p-6 sm:p-7 space-y-6 shadow-xl">
            {/* Avatar & Identifiers */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1e293b] border border-white/[0.12] flex items-center justify-center text-xl font-bold text-[#00f2a9] shadow-inner">
                  AP
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#00f2a9] border-2 border-[#0b0f17] flex items-center justify-center">
                  <Check className="w-3 h-3 text-black stroke-[3]" />
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Backend Engineer
                </h1>
                <div className="text-xs text-slate-400">@apirun_developer</div>
                <div className="text-xs text-[#00f2a9] font-medium flex items-center space-x-1.5 pt-0.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Rank: #1,248 · Level 3 Architect</span>
                </div>
              </div>
            </div>

            {/* Quick Profile Summary */}
            <p className="text-sm text-slate-300 leading-relaxed">
              Practicing production-grade backend engineering with Express, Go, and Python. Focused on resilient APIs, clean validation, and sub-20ms SLAs.
            </p>

            {/* Bio Metadata */}
            <div className="space-y-2.5 pt-4 border-t border-white/[0.08] text-xs text-slate-400">
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Code2 className="w-4 h-4 text-slate-500" />
                <span className="text-slate-300 hover:text-white transition-colors cursor-pointer">github.com/apirun-user</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Joined September 2026</span>
              </div>
            </div>

            {/* Community Stats */}
            <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-white/[0.08] text-center">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-lg font-bold text-white">4</div>
                <div className="text-xs text-slate-400 font-medium">Submissions</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-lg font-bold text-[#00f2a9]">100%</div>
                <div className="text-xs text-slate-400 font-medium">Pass Rate</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-lg font-bold text-sky-400">14.8ms</div>
                <div className="text-xs text-slate-400 font-medium">Avg Latency</div>
              </div>
            </div>
          </div>

          {/* Language Breakdown (LeetCode Language Widget) */}
          <div className="rounded-2xl bg-[#0b0f17] border border-white/[0.08] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-[#00f2a9]" />
                <span>Languages Used</span>
              </h2>
              <span className="text-xs text-slate-400">3 Runtimes</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-white font-medium">TypeScript / Node.js</span>
                </div>
                <span className="text-[#00f2a9] font-bold">1 solved <span className="text-slate-500 font-normal">/ 11 tests</span></span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span className="text-slate-300 font-medium">Go 1.22</span>
                </div>
                <span className="text-slate-400">0 solved</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-slate-300 font-medium">Python (FastAPI)</span>
                </div>
                <span className="text-slate-400">0 solved</span>
              </div>
            </div>
          </div>

          {/* Badges Showcase (LeetCode Badges Widget) */}
          <div className="rounded-2xl bg-[#0b0f17] border border-white/[0.08] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Earned Badges</span>
              </h2>
              <span className="text-xs text-[#00f2a9] font-semibold">3 Unlocked</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {badges.map(badge => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1.5 transition-all ${
                      badge.unlocked
                        ? `${badge.color} shadow-sm`
                        : 'bg-white/[0.01] border-white/[0.04] text-zinc-600 opacity-60'
                    }`}
                    title={`${badge.name}: ${badge.desc}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-semibold text-white line-clamp-1">{badge.name}</span>
                    <span className="text-[11px] text-slate-400">{badge.date}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: LEETCODE SOLVED GAUGE, HEATMAP, SKILL TAGS & SUBMISSIONS   */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. FAMOUS LEETCODE CIRCULAR SOLVED PROGRESS WIDGET */}
          <div className="rounded-2xl bg-[#0b0f17] border border-white/[0.08] p-6 sm:p-7 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Circular Gauge Ring */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-2">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  {/* SVG Donut Ring */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#1e293b"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#00f2a9"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * (solvedCount / totalChallenges))}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  
                  {/* Inner text inside circle */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-white tracking-tight">{solvedCount}</span>
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Solved</span>
                    <span className="text-xs text-[#00f2a9] font-semibold mt-0.5">{solvedPercent}% Total</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-2 font-medium">
                  {solvedCount} of {totalChallenges} Challenges Completed
                </div>
              </div>

              {/* Stacked Difficulty Bars (Easy, Medium, Hard) */}
              <div className="md:col-span-7 space-y-3.5">
                {/* Easy / Beginner */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-emerald-400 font-bold text-sm">Easy</span>
                      <span className="text-white font-bold">{easySolved} <span className="text-slate-500 font-normal">/ {easyChallenges.length}</span></span>
                    </div>
                    <span className="text-emerald-400 text-xs font-semibold">Beats 84.2%</span>
                  </div>
                  <div className="w-full bg-white/[0.08] rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                      style={{ width: `${easyChallenges.length > 0 ? (easySolved / easyChallenges.length) * 100 : 0}%` }} 
                    />
                  </div>
                </div>

                {/* Medium / Intermediate */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-sky-400 font-bold text-sm">Medium</span>
                      <span className="text-white font-bold">{mediumSolved} <span className="text-slate-500 font-normal">/ {mediumChallenges.length}</span></span>
                    </div>
                    <span className="text-slate-400 text-xs">Beats 0.0%</span>
                  </div>
                  <div className="w-full bg-white/[0.08] rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-sky-400 rounded-full transition-all duration-500" 
                      style={{ width: `${mediumChallenges.length > 0 ? (mediumSolved / mediumChallenges.length) * 100 : 0}%` }} 
                    />
                  </div>
                </div>

                {/* Hard / Advanced */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-rose-400 font-bold text-sm">Hard</span>
                      <span className="text-white font-bold">{hardSolved} <span className="text-slate-500 font-normal">/ {hardChallenges.length}</span></span>
                    </div>
                    <span className="text-slate-400 text-xs">Beats 0.0%</span>
                  </div>
                  <div className="w-full bg-white/[0.08] rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-rose-400 rounded-full transition-all duration-500" 
                      style={{ width: `${hardChallenges.length > 0 ? (hardSolved / hardChallenges.length) * 100 : 0}%` }} 
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 2. LEETCODE SUBMISSION HEATMAP ACTIVITY CALENDAR */}
          <div className="rounded-2xl bg-[#0b0f17] border border-white/[0.08] p-6 sm:p-7 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">
                  11 Submissions in 2026
                </h2>
              </div>
              <div className="flex items-center space-x-4 text-xs text-slate-300">
                <span>Total Active Days: <strong className="text-white font-bold">5</strong></span>
                <span>•</span>
                <span>Max Streak: <strong className="text-[#00f2a9] font-bold">12 days</strong></span>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto pb-2">
              <div className="inline-flex space-x-1.5 min-w-full">
                {heatmapWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col space-y-1.5">
                    {week.map((cell, dIdx) => (
                      <div
                        key={dIdx}
                        className={`w-3.5 h-3.5 rounded-sm transition-all ${
                          cell.count >= 4
                            ? 'bg-[#00f2a9] shadow-sm shadow-[#00f2a9]/40'
                            : cell.count >= 2
                            ? 'bg-emerald-500'
                            : cell.count === 1
                            ? 'bg-emerald-800/80'
                            : 'bg-white/[0.05] border border-white/[0.04]'
                        }`}
                        title={cell.active ? `${cell.count} submissions` : 'No activity'}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Heatmap Legend */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/[0.06]">
              <span>Current Streak: <strong className="text-[#00f2a9] font-bold">3 days</strong></span>
              <div className="flex items-center space-x-2">
                <span>Less</span>
                <span className="w-3 h-3 rounded-sm bg-white/[0.05]" />
                <span className="w-3 h-3 rounded-sm bg-emerald-800/80" />
                <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span className="w-3 h-3 rounded-sm bg-[#00f2a9]" />
                <span>More</span>
              </div>
            </div>
          </div>

          {/* 3. SKILL TAGS (LEETCODE SKILL TAGS MATRIX) */}
          <div className="rounded-2xl bg-[#0b0f17] border border-white/[0.08] p-6 sm:p-7 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-[#00f2a9]" />
                <h2 className="text-sm font-bold text-white">
                  Skills &amp; Concept Mastery
                </h2>
              </div>

              {/* Tag Categories */}
              <div className="flex items-center space-x-1 bg-white/[0.03] border border-white/[0.08] p-1 rounded-xl text-xs">
                {(['ALL', 'CORE', 'SECURITY', 'DISTRIBUTED'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedSkillCategory(cat)}
                    className={`px-3 py-1 rounded-lg font-medium text-xs transition-colors ${
                      selectedSkillCategory === cat
                        ? 'bg-white/[0.12] text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat === 'ALL' ? 'All' : cat === 'CORE' ? 'Core HTTP' : cat === 'SECURITY' ? 'Security' : 'Distributed'}
                  </button>
                ))}
              </div>
            </div>

            {/* LeetCode Style Pill Tags */}
            <div className="flex flex-wrap gap-2.5 text-xs">
              {filteredSkills.map(skill => {
                const isCompleted = skill.count >= skill.total && skill.total > 0;
                const isInProgress = skill.count > 0;

                return (
                  <div
                    key={skill.name}
                    className={`px-3.5 py-1.5 rounded-xl border flex items-center space-x-2 transition-all ${
                      isCompleted
                        ? 'bg-[#00f2a9]/15 border-[#00f2a9]/40 text-[#00f2a9] font-bold shadow-sm'
                        : isInProgress
                        ? 'bg-sky-500/15 border-sky-500/40 text-sky-400 font-semibold'
                        : 'bg-white/[0.02] border-white/[0.08] text-slate-300'
                    }`}
                  >
                    <span>{skill.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                      isCompleted ? 'bg-[#00f2a9]/20 text-[#00f2a9]' : isInProgress ? 'bg-sky-500/20 text-sky-300' : 'bg-white/[0.06] text-slate-400'
                    }`}>
                      x{skill.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. RECENT SUBMISSIONS / CHALLENGE ACTIVITY (LEETCODE TABLE) */}
          <div className="rounded-2xl bg-[#0b0f17] border border-white/[0.08] overflow-hidden shadow-xl">
            {/* Header with Search and Tab filters */}
            <div className="p-5 bg-white/[0.02] border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-[#00f2a9]" />
                <h2 className="text-sm font-bold text-white">
                  Recent Submissions ({filteredSubmissions.length})
                </h2>
              </div>

              <div className="flex items-center space-x-2.5">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchHistory}
                    onChange={e => setSearchHistory(e.target.value)}
                    placeholder="Search challenges..."
                    className="w-48 pl-8 pr-3 py-1.5 bg-[#080c14] border border-white/[0.1] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00f2a9]/50"
                  />
                </div>

                {/* Status Tabs */}
                <div className="flex items-center space-x-1 bg-[#080c14] border border-white/[0.08] p-1 rounded-xl text-xs">
                  {(['ALL', 'AC', 'IN_PROGRESS'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setSelectedSubmissionsTab(tab)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        selectedSubmissionsTab === tab
                          ? 'bg-white/[0.12] text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab === 'ALL' ? 'All' : tab === 'AC' ? 'Accepted' : 'In Progress'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080c14] border-b border-white/[0.06] text-slate-400 font-semibold text-xs">
                  <tr>
                    <th className="py-3.5 px-5">CHALLENGE</th>
                    <th className="py-3.5 px-5">TIME</th>
                    <th className="py-3.5 px-5">STATUS</th>
                    <th className="py-3.5 px-5">RUNTIME</th>
                    <th className="py-3.5 px-5">LANGUAGE</th>
                    <th className="py-3.5 px-5 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map(c => {
                      const isSolved = c.status === 'SOLVED';
                      const isInProgress = c.status === 'IN_PROGRESS';

                      return (
                        <tr 
                          key={c.id} 
                          className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                          onClick={() => onSelectChallenge(c)}
                        >
                          <td className="py-4 px-5">
                            <div className="font-bold text-white text-sm hover:text-[#00f2a9] transition-colors">
                              {c.title}
                            </div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">
                              {c.endpoints?.[0]?.path || '/api'}
                            </div>
                          </td>

                          <td className="py-4 px-5 text-slate-300">
                            {isSolved ? '2 hours ago' : 'Recently'}
                          </td>

                          <td className="py-4 px-5">
                            {isSolved ? (
                              <span className="text-emerald-400 font-bold flex items-center space-x-1.5">
                                <CheckCircle className="w-4 h-4" />
                                <span>Accepted</span>
                              </span>
                            ) : isInProgress ? (
                              <span className="text-amber-400 font-semibold">In Progress</span>
                            ) : (
                              <span className="text-slate-500">Unsolved</span>
                            )}
                          </td>

                          <td className="py-4 px-5 text-slate-200 font-mono">
                            {isSolved ? '14.8 ms' : '—'}
                          </td>

                          <td className="py-4 px-5 text-slate-300">
                            <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs">
                              TypeScript
                            </span>
                          </td>

                          <td className="py-4 px-5 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectChallenge(c);
                              }}
                              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.06] hover:bg-[#00f2a9] text-white hover:text-black border border-white/[0.1] transition-all"
                            >
                              <span>{isSolved ? 'Review' : 'Solve'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400 text-xs">
                        No submissions matching your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};