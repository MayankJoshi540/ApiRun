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
      {/* 1. Header Banner */}
      <div className="rounded-2xl bg-[#111622] border border-slate-800/80 p-6 sm:p-7 space-y-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Title and Intro */}
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              Backend Challenges
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Explore and solve real-world API challenges covering authentication, rate limiting, distributed caching, and database transactions.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center space-x-3 shrink-0 text-xs sm:text-sm font-mono">
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-inner">
              <span className="text-slate-400">TOTAL: </span>
              <span className="text-slate-200 font-bold">{challenges.length} APIs</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-inner">
              <span className="text-slate-400">SOLVED: </span>
              <span className="text-emerald-400 font-bold">{solvedCount}</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-inner">
              <span className="text-slate-400">MASTERY: </span>
              <span className="text-sky-400 font-bold">{completionPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="pt-4 border-t border-slate-800/70 flex items-center space-x-3">
          <div className="flex-1 h-2 rounded-full bg-slate-800/80 overflow-hidden">
            <div 
              className="h-full bg-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(completionPercentage, 2)}%` }}
            />
          </div>
          <span className="text-xs sm:text-sm font-mono text-slate-400 shrink-0">
            {solvedCount} of {challenges.length} completed
          </span>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges, routes (e.g. POST /users), Redis locks..."
              className="w-full pl-11 pr-10 py-3 bg-[#0e131d] border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 font-sans transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter Toggle */}
          <div className="flex items-center rounded-xl bg-[#111622] border border-slate-800/80 p-1.5 text-xs sm:text-sm w-full sm:w-auto">
            {(['ALL', 'SOLVED', 'UNSOLVED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-150 active:scale-[0.97] flex-1 sm:flex-none ${
                  statusFilter === status 
                    ? 'bg-slate-800 text-slate-100 border border-slate-700/60 shadow-xs' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status === 'ALL' ? 'All' : status === 'SOLVED' ? 'Solved' : 'Unsolved'}
              </button>
            ))}
          </div>
        </div>

        {/* Category & Difficulty Quick Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Track Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-semibold mr-1 hidden sm:inline">Track:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm transition-all duration-150 active:scale-[0.96] border ${
                  selectedCategory === cat
                    ? 'bg-slate-800 border-slate-700 text-slate-100 font-semibold shadow-xs'
                    : 'bg-[#0e131d] border-slate-800/70 text-slate-400 hover:text-slate-200 hover:border-slate-700 font-medium'
                }`}
              >
                {cat === 'ALL' ? 'All' : cat}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-semibold mr-1 hidden sm:inline">Tier:</span>
            {(['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => onSelectDifficulty(diff)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm transition-all duration-150 active:scale-[0.96] border ${
                  selectedDifficulty === diff
                    ? 'bg-slate-800 border-slate-700 text-slate-100 font-semibold shadow-xs'
                    : 'bg-[#0e131d] border-slate-800/70 text-slate-400 hover:text-slate-200 hover:border-slate-700 font-medium'
                }`}
              >
                {diff === 'ALL' ? 'All' : diff.charAt(0) + diff.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 text-[11px] font-mono">Active:</span>
              
              {selectedCategory !== 'ALL' && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-[11px]">
                  <span>track: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('ALL')} className="hover:text-emerald-400"><X className="w-3 h-3 ml-1" /></button>
                </span>
              )}

              {selectedDifficulty !== 'ALL' && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-[11px]">
                  <span>tier: {selectedDifficulty}</span>
                  <button onClick={() => onSelectDifficulty('ALL')} className="hover:text-emerald-400"><X className="w-3 h-3 ml-1" /></button>
                </span>
              )}

              {selectedConcept !== 'ALL' && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-[11px]">
                  <span>concept: {selectedConcept}</span>
                  <button onClick={() => onSelectConcept('ALL')} className="hover:text-white"><X className="w-3 h-3 ml-1" /></button>
                </span>
              )}

              {statusFilter !== 'ALL' && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-[11px]">
                  <span>status: {statusFilter.toLowerCase()}</span>
                  <button onClick={() => setStatusFilter('ALL')} className="hover:text-emerald-400"><X className="w-3 h-3 ml-1" /></button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-[11px]">
                  <span>query: "{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-emerald-400"><X className="w-3 h-3 ml-1" /></button>
                </span>
              )}
            </div>

            <button
              onClick={handleResetFilters}
              className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors font-medium active:scale-95"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* 3. Challenges Cards List */}
      <div className="space-y-3">
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge, index) => (
            <div
              key={challenge.id}
              style={{
                animation: `emilModalIn 240ms var(--ease-out) ${Math.min(index * 40, 240)}ms both`,
              }}
            >
              <ChallengeCard
                challenge={challenge}
                onSelect={onSelectChallenge}
                onClickConcept={onSelectConcept}
              />
            </div>
          ))
        ) : (
          /* Empty Search State */
          <div className="rounded-2xl border border-slate-800/80 bg-[#111622] p-12 text-center space-y-4 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-sm font-bold text-slate-100">No matching challenges found</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Try adjusting your search criteria, tier filter, or concept selection.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all duration-150 active:scale-95 shadow-md shadow-emerald-500/10"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
