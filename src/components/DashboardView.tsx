'use client';

import React, { useState, useMemo } from 'react';
import { Challenge, UserStats } from '../types';
import { ChallengeCard } from './ChallengeCard';
import { Search, X } from 'lucide-react';

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
      <div className="rounded-2xl bg-[#090d14] border border-white/[0.08] p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Title and Intro */}
          <div className="space-y-1.5 max-w-2xl">
            <div className="text-[11px] font-mono font-medium tracking-wider text-emerald-400 uppercase">
              BACKEND PRACTICE LABS
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Backend Challenges
            </h1>

            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              Build and test real RESTful API endpoints against RFC-9110 HTTP specifications, concurrency locks, and edge cases.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center space-x-2.5 shrink-0 text-xs font-mono">
            <div className="px-3 py-2 rounded-xl bg-black/30 border border-white/[0.06]">
              <span className="text-[#94a3b8]">TOTAL: </span>
              <span className="text-white font-bold">{challenges.length} APIs</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-black/30 border border-white/[0.06]">
              <span className="text-[#94a3b8]">SOLVED: </span>
              <span className="text-emerald-400 font-bold">{solvedCount}</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-black/30 border border-white/[0.06]">
              <span className="text-[#94a3b8]">MASTERY: </span>
              <span className="text-sky-400 font-bold">{completionPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="pt-4 border-t border-white/[0.06] flex items-center space-x-3">
          <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div 
              className="h-full bg-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(completionPercentage, 2)}%` }}
            />
          </div>
          <span className="text-xs font-mono text-[#94a3b8] shrink-0">
            {solvedCount} of {challenges.length} completed
          </span>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#64748b]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges, routes (e.g. POST /users), Redis locks..."
              className="w-full pl-9 pr-8 py-2 bg-[#090d14] border border-white/[0.08] rounded-xl text-xs text-white placeholder:text-[#64748b] focus:outline-none focus:border-white/[0.2] font-sans transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[#64748b] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Toggle */}
          <div className="flex items-center rounded-xl bg-[#090d14] border border-white/[0.08] p-1 text-xs w-full sm:w-auto">
            {(['ALL', 'SOLVED', 'UNSOLVED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors flex-1 sm:flex-none ${
                  statusFilter === status 
                    ? 'bg-white/[0.1] text-white font-semibold' 
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                {status === 'ALL' ? 'All' : status === 'SOLVED' ? 'Solved' : 'Unsolved'}
              </button>
            ))}
          </div>
        </div>

        {/* Category & Difficulty Quick Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
          {/* Track Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-[#64748b] mr-1 hidden sm:inline">Track:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                  selectedCategory === cat
                    ? 'bg-white/[0.1] border-white/[0.2] text-white font-medium'
                    : 'bg-[#090d14] border-white/[0.06] text-[#94a3b8] hover:text-white'
                }`}
              >
                {cat === 'ALL' ? 'All' : cat}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-[#64748b] mr-1 hidden sm:inline">Tier:</span>
            {(['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => onSelectDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                  selectedDifficulty === diff
                    ? 'bg-white/[0.1] border-white/[0.2] text-white font-medium'
                    : 'bg-[#090d14] border-white/[0.06] text-[#94a3b8] hover:text-white'
                }`}
              >
                {diff === 'ALL' ? 'All' : diff.charAt(0) + diff.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#64748b] text-[11px]">Active:</span>
              
              {selectedCategory !== 'ALL' && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-white text-[11px]">
                  <span>track: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('ALL')}><X className="w-3 h-3 ml-1" /></button>
                </span>
              )}

              {selectedDifficulty !== 'ALL' && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-white text-[11px]">
                  <span>tier: {selectedDifficulty}</span>
                  <button onClick={() => onSelectDifficulty('ALL')}><X className="w-3 h-3 ml-1" /></button>
                </span>
              )}

              {selectedConcept !== 'ALL' && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-emerald-400 text-[11px]">
                  <span>concept: {selectedConcept}</span>
                  <button onClick={() => onSelectConcept('ALL')}><X className="w-3 h-3 ml-1" /></button>
                </span>
              )}

              {statusFilter !== 'ALL' && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-white text-[11px]">
                  <span>status: {statusFilter.toLowerCase()}</span>
                  <button onClick={() => setStatusFilter('ALL')}><X className="w-3 h-3 ml-1" /></button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-white text-[11px]">
                  <span>query: "{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')}><X className="w-3 h-3 ml-1" /></button>
                </span>
              )}
            </div>

            <button
              onClick={handleResetFilters}
              className="text-[11px] font-mono text-[#00f2a9] hover:underline"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* 3. Challenges Cards List */}
      <div className="space-y-3">
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onSelect={onSelectChallenge}
              onClickConcept={onSelectConcept}
            />
          ))
        ) : (
          /* Empty Search State */
          <div className="rounded-2xl border border-white/[0.06] bg-[#090d14] p-10 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto text-[#64748b]">
              <Search className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">No matching challenges found</h3>
              <p className="text-xs text-[#94a3b8]">
                Try adjusting your search terms or filters.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-1.5 rounded-lg bg-[#00f2a9] text-black text-xs font-bold transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
