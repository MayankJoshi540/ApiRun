'use client';

import React, { useState, useMemo } from 'react';
import { Challenge, UserStats } from '../types';
import { ChallengeCard } from './ChallengeCard';
import { Search, X } from '@/components/ui/GoogleIcon';

interface Props {
  challenges: Challenge[];
  onSelectChallenge: (challenge: Challenge) => void;
  selectedDifficulty: string;
  onSelectDifficulty: (diff: string) => void;
  selectedConcept: string;
  onSelectConcept: (concept: string) => void;
  userStats: UserStats;
}

export const DashboardView: React.FC<Props> = ({
  challenges,
  onSelectChallenge,
  selectedDifficulty,
  onSelectDifficulty,
  selectedConcept,
  onSelectConcept,
  userStats
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SOLVED' | 'UNSOLVED'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    return ['ALL', ...Array.from(new Set(challenges.map(c => c.category)))];
  }, [challenges]);

  const solvedCount = challenges.filter(c => c.status === 'SOLVED').length;
  const completionPercentage = Math.round((solvedCount / (challenges.length || 1)) * 100);

  const filteredChallenges = useMemo(() => {
    return challenges.filter(c => {
      // Category filter
      if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;
      // Difficulty filter
      if (selectedDifficulty !== 'ALL' && c.difficulty !== selectedDifficulty) return false;
      // Concept filter
      if (selectedConcept !== 'ALL' && !c.concepts.includes(selectedConcept as any)) return false;
      // Status filter
      if (statusFilter === 'SOLVED' && c.status !== 'SOLVED') return false;
      if (statusFilter === 'UNSOLVED' && c.status === 'SOLVED') return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchSummary = c.summary.toLowerCase().includes(q);
        const matchConcept = c.concepts.some(con => con.toLowerCase().includes(q));
        const matchEndpoint = c.endpoints.some(e => e.path.toLowerCase().includes(q) || e.method.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchConcept && !matchEndpoint) return false;
      }
      return true;
    });
  }, [challenges, selectedCategory, selectedDifficulty, selectedConcept, statusFilter, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setSelectedCategory('ALL');
    onSelectDifficulty('ALL');
    onSelectConcept('ALL');
  };

  const hasActiveFilters = selectedDifficulty !== 'ALL' || selectedConcept !== 'ALL' || selectedCategory !== 'ALL' || statusFilter !== 'ALL' || searchQuery.trim() !== '';

  return (
    <div className="flex-1 space-y-6 font-sans">
      
      {/* 1. Header Banner - Apple Pro Plate */}
      <div className="rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.08] border-t-white/[0.14] shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)] p-6 sm:p-7 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Title and Intro */}
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-white">
              Backend Challenges
            </h1>
            <p className="text-xs sm:text-[13px] text-[#86868b] leading-relaxed">
              Real-world API labs covering authentication, rate limiting, atomic database locks, idempotency, and distributed systems.
            </p>
          </div>

          {/* Quick Stats Strip */}
          <div className="flex items-center space-x-2.5 shrink-0 text-xs font-mono">
            <div className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <span className="text-[#86868b]">CURRICULUM: </span>
              <span className="text-white font-semibold tabular-nums">{challenges.length} APIs</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <span className="text-[#86868b]">SOLVED: </span>
              <span className="text-[#30d158] font-semibold tabular-nums">{solvedCount}</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <span className="text-[#86868b]">MASTERY: </span>
              <span className="text-white font-semibold tabular-nums">{completionPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="pt-4 border-t border-white/[0.06] flex items-center space-x-3">
          <div className="flex-1 h-1.5 rounded-full bg-[#2c2c2e] overflow-hidden">
            <div 
              className="h-full bg-[#30d158] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(completionPercentage, 2)}%` }}
            />
          </div>
          <span className="text-xs font-medium text-[#86868b] tabular-nums shrink-0">
            {solvedCount} of {challenges.length} completed
          </span>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Spotlight Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#86868b]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges, routes (e.g. POST /users), Redis locks..."
              className="w-full pl-10 pr-9 py-2.5 bg-[#1c1c1e]/70 border border-white/[0.1] rounded-xl text-sm text-white placeholder-[#636366] focus:outline-none focus:ring-2 focus:ring-[#30d158]/40 focus:border-[#30d158] font-sans transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-[#86868b] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Apple Segmented Status Toggle */}
          <div className="flex items-center rounded-full bg-[#1c1c1e] border border-white/[0.08] p-1 text-xs w-full sm:w-auto">
            {(['ALL', 'SOLVED', 'UNSOLVED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-full font-medium transition-all duration-100 active:scale-[0.97] flex-1 sm:flex-none cursor-pointer ${
                  statusFilter === status 
                    ? 'bg-white/[0.12] text-white font-semibold border border-white/10 shadow-xs' 
                    : 'text-[#86868b] hover:text-white'
                }`}
              >
                {status === 'ALL' ? 'All' : status === 'SOLVED' ? 'Solved' : 'Unsolved'}
              </button>
            ))}
          </div>
        </div>

        {/* Category & Difficulty Quick Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          {/* Track Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-[#86868b] mr-1 hidden sm:inline">Track:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs transition-all duration-100 active:scale-[0.96] border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white/[0.12] border-white/20 text-white font-semibold'
                    : 'bg-white/[0.03] border-white/[0.06] text-[#86868b] hover:text-white hover:border-white/10 font-medium'
                }`}
              >
                {cat === 'ALL' ? 'All' : cat}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#86868b] mr-1 hidden sm:inline">Tier:</span>
            {(['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => onSelectDifficulty(diff)}
                className={`px-3 py-1 rounded-full text-xs transition-all duration-100 active:scale-[0.96] border cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-white/[0.12] border-white/20 text-white font-semibold'
                    : 'bg-white/[0.03] border-white/[0.06] text-[#86868b] hover:text-white hover:border-white/10 font-medium'
                }`}
              >
                {diff === 'ALL' ? 'All' : diff.charAt(0) + diff.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[#86868b] text-[11px]">Active:</span>
              
              {selectedCategory !== 'ALL' && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-white text-[11px]">
                  <span>track: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('ALL')} className="hover:text-white"><X className="w-3 h-3 ml-1" /></button>
                </span>
              )}

              {selectedDifficulty !== 'ALL' && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-white text-[11px]">
                  <span>tier: {selectedDifficulty}</span>
                  <button onClick={() => onSelectDifficulty('ALL')} className="hover:text-white"><X className="w-3 h-3 ml-1" /></button>
                </span>
              )}

              {selectedConcept !== 'ALL' && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#30d158]/15 border border-[#30d158]/30 text-[#30d158] text-[11px]">
                  <span>concept: {selectedConcept}</span>
                  <button onClick={() => onSelectConcept('ALL')} className="hover:text-white"><X className="w-3 h-3 ml-1" /></button>
                </span>
              )}

              {statusFilter !== 'ALL' && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-white text-[11px]">
                  <span>status: {statusFilter.toLowerCase()}</span>
                  <button onClick={() => setStatusFilter('ALL')} className="hover:text-white"><X className="w-3 h-3 ml-1" /></button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-white text-[11px]">
                  <span>query: "{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-white"><X className="w-3 h-3 ml-1" /></button>
                </span>
              )}
            </div>

            <button
              onClick={handleResetFilters}
              className="text-[11px] text-[#30d158] hover:text-[#34c759] font-medium active:scale-95 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 3. Challenges Cards List */}
      <div className="space-y-3">
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge) => (
            <div key={challenge.id}>
              <ChallengeCard
                challenge={challenge}
                onSelect={onSelectChallenge}
                onClickConcept={onSelectConcept}
              />
            </div>
          ))
        ) : (
          /* Empty Search State */
          <div className="rounded-2xl border border-white/[0.08] bg-[#1c1c1e]/60 p-12 text-center space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mx-auto text-[#86868b]">
              <Search className="w-4 h-4" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-sm font-semibold text-white">No matching challenges</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Try clearing active filters or searching for another API route.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-full bg-[#30d158] hover:bg-[#34c759] text-black text-xs font-semibold active:scale-95 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
