import React, { useState, useMemo } from 'react';
import { Challenge, UserStats } from '../types';
import { ChallengeCard } from './ChallengeCard';
import { Search, Terminal, X } from 'lucide-react';

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

  const filteredChallenges = useMemo(() => {
    return challenges.filter(c => {
      // difficulty
      if (selectedDifficulty !== 'ALL' && c.difficulty !== selectedDifficulty) return false;
      // concept
      if (selectedConcept !== 'ALL' && !c.concepts.includes(selectedConcept as any)) return false;
      // status
      if (statusFilter === 'SOLVED' && c.status !== 'SOLVED') return false;
      if (statusFilter === 'UNSOLVED' && c.status === 'SOLVED') return false;
      // search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchSummary = c.summary.toLowerCase().includes(q);
        const matchConcept = c.concepts.some(con => con.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchConcept) return false;
      }
      return true;
    });
  }, [challenges, selectedDifficulty, selectedConcept, statusFilter, searchQuery]);

  return (
    <div className="flex-1 space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#262d3a] pb-5">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
              BACKEND API CHALLENGES
            </div>
            <h1 className="text-2xl font-bold text-[#e6edf3]">
              Backend Challenges
            </h1>
            <p className="text-sm text-[#8b949e]">
              Practice building real backend APIs. Tested against automated specs and hidden edge cases.
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="px-2.5 py-1 rounded-md bg-[#12161f] border border-[#262d3a]">
              <span className="text-[#8b949e]">ALLOTTED: </span>
              <span className="text-[#e6edf3] font-semibold">{challenges.length} APIs</span>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-[#12161f] border border-[#262d3a]">
              <span className="text-[#8b949e]">AVG LATENCY: </span> 
              <span className="text-emerald-400 font-semibold">{userStats.averageLatencyMs}ms</span>
            </div>
          </div>
        </div>

        {/* Search & Quick Filters Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8b949e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges, HTTP concepts, routes..."
              className="w-full pl-9 pr-8 py-2 bg-[#12161f] border border-[#262d3a] rounded-lg text-xs text-[#e6edf3] placeholder:text-[#6e7681] focus:outline-none focus:border-emerald-500 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[#8b949e] hover:text-[#e6edf3]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Toggles */}
          <div className="flex items-center rounded bg-[#12161f] border border-[#262d3a] p-0.5 text-xs w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded transition-colors flex-1 sm:flex-none ${
                statusFilter === 'ALL' ? 'bg-[#171c26] text-[#e6edf3] font-semibold' : 'text-[#8b949e] hover:text-[#e6edf3]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('SOLVED')}
              className={`px-2.5 py-1 rounded transition-colors flex-1 sm:flex-none ${
                statusFilter === 'SOLVED' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-semibold' : 'text-[#8b949e] hover:text-[#e6edf3]'
              }`}
            >
              Solved
            </button>
            <button
              onClick={() => setStatusFilter('UNSOLVED')}
              className={`px-2.5 py-1 rounded transition-colors flex-1 sm:flex-none ${
                statusFilter === 'UNSOLVED' ? 'bg-[#171c26] text-[#e6edf3] font-semibold' : 'text-[#8b949e] hover:text-[#e6edf3]'
              }`}
            >
              Unsolved
            </button>
          </div>
        </div>

        {/* Active Filter Badges */}
        {(selectedDifficulty !== 'ALL' || selectedConcept !== 'ALL' || searchQuery) && (
          <div className="mt-3 flex items-center flex-wrap gap-2 text-[11px]">
            <span className="text-[#8b949e]">Active Filters:</span>
            {selectedDifficulty !== 'ALL' && (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-[#171c26] border border-[#272e3a] text-emerald-400">
                <span>difficulty: {selectedDifficulty}</span>
                <button onClick={() => onSelectDifficulty('ALL')}><X className="w-3 h-3 ml-1" /></button>
              </span>
            )}
            {selectedConcept !== 'ALL' && (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-[#171c26] border border-[#272e3a] text-emerald-400">
                <span>concept: {selectedConcept}</span>
                <button onClick={() => onSelectConcept('ALL')}><X className="w-3 h-3 ml-1" /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Challenges Card List */}
      <div className="space-y-3">
        {filteredChallenges.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#262d3a] rounded-xl bg-[#12161f]/40 font-sans">
            <Terminal className="w-8 h-8 mx-auto text-[#8b949e] mb-2" />
            <div className="text-sm text-[#e6edf3] font-semibold">No matching backend challenges found</div>
            <div className="text-xs text-[#8b949e] mt-1">Try resetting your filters or search term</div>
            <button
              onClick={() => { setSearchQuery(''); onSelectDifficulty('ALL'); onSelectConcept('ALL'); }}
              className="mt-4 px-3.5 py-1.5 rounded-lg bg-[#171c26] border border-[#262d3a] text-xs font-medium text-emerald-400 hover:text-emerald-300"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onSelect={onSelectChallenge}
              onClickConcept={onSelectConcept}
            />
          ))
        )}
      </div>
    </div>
  );
};
