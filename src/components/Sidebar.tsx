import React from 'react';
import { Layers, CheckCircle2 } from '@/components/ui/GoogleIcon';

interface Props {
  activeTab: 'challenges' | 'progress' | 'dashboard';
  onSelectTab: (tab: 'challenges' | 'progress' | 'dashboard') => void;
  selectedDifficulty: string;
  onSelectDifficulty: (difficulty: string) => void;
  selectedConcept: string;
  onSelectConcept: (concept: string) => void;
  allConcepts: string[];
  challengesCount: number;
  solvedCount: number;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  selectedDifficulty,
  onSelectDifficulty,
  selectedConcept,
  onSelectConcept,
  allConcepts,
  challengesCount,
  solvedCount
}) => {
  const difficulties = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  const completionRate = Math.round((solvedCount / (challengesCount || 1)) * 100);

  return (
    <aside className="w-72 flex-no-shrink hidden lg:block font-sans select-none">
      <div className="space-y-4 sticky top-24">
        
        {/* 1. Main Navigation - Apple macOS Sidebar Style */}
        <div className="p-2 rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.08] border-t-white/[0.14] shadow-[0_4px_20px_rgba(0,0,0,0.35)] space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.02em] text-[#86868b] px-3 py-1.5">
            Navigation
          </div>
          
          <button
            onClick={() => onSelectTab('challenges')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[13px] transition-all duration-100 active:scale-[0.98] cursor-pointer ${
              activeTab === 'challenges' || activeTab === 'dashboard'
                ? 'bg-white/[0.1] text-white font-semibold border border-white/[0.1] shadow-xs'
                : 'text-[#86868b] hover:text-white hover:bg-white/[0.05] font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Layers className="w-4 h-4 text-[#30d158]" />
              <span>Challenges</span>
            </div>
            <span className="text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.06] text-[#86868b]">
              {challengesCount}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('progress')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[13px] transition-all duration-100 active:scale-[0.98] cursor-pointer ${
              activeTab === 'progress'
                ? 'bg-white/[0.1] text-white font-semibold border border-white/[0.1] shadow-xs'
                : 'text-[#86868b] hover:text-white hover:bg-white/[0.05] font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#30d158]" />
              <span>Progress</span>
            </div>
            <span className="text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-full bg-[#30d158]/15 text-[#30d158] font-semibold border border-[#30d158]/25">
              {solvedCount}/{challengesCount}
            </span>
          </button>
        </div>

        {/* 2. Progress Overview Tile */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.08] border-t-white/[0.14] shadow-[0_4px_20px_rgba(0,0,0,0.35)] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#86868b] font-medium">Curriculum Solved</span>
            <span className="text-white font-semibold tabular-nums text-sm">{completionRate}%</span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-[#2c2c2e] overflow-hidden">
            <div 
              className="h-full bg-[#30d158] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(completionRate, 2)}%` }}
            />
          </div>
        </div>

        {/* 3. Difficulty Tiers */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.08] border-t-white/[0.14] shadow-[0_4px_20px_rgba(0,0,0,0.35)] space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.02em] text-[#86868b] px-2 py-1">
            Difficulty Tier
          </div>
          <div className="space-y-1">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => onSelectDifficulty(diff)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all duration-100 active:scale-[0.98] cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-white/[0.1] text-white font-semibold border border-white/[0.1]'
                    : 'text-[#86868b] hover:text-white hover:bg-white/[0.05] font-medium'
                }`}
              >
                <span>{diff === 'ALL' ? 'All Difficulties' : diff.charAt(0) + diff.slice(1).toLowerCase()}</span>
                <span className="text-[11px] font-mono tabular-nums text-[#636366]">
                  {diff === 'ALL' ? challengesCount : diff === 'BEGINNER' ? 3 : diff === 'INTERMEDIATE' ? 4 : 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Core Concepts */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.08] border-t-white/[0.14] shadow-[0_4px_20px_rgba(0,0,0,0.35)] space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.02em] text-[#86868b] px-2 py-0.5">
            Architecture Concepts
          </div>
          <div className="flex flex-wrap gap-1.5 px-0.5">
            <button
              onClick={() => onSelectConcept('ALL')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all duration-100 active:scale-[0.96] border cursor-pointer ${
                selectedConcept === 'ALL'
                  ? 'bg-white/[0.12] border-white/20 text-white font-semibold'
                  : 'bg-white/[0.03] border-white/[0.06] text-[#86868b] hover:text-white hover:border-white/10'
              }`}
            >
              ALL
            </button>
            {allConcepts.map((concept) => (
              <button
                key={concept}
                onClick={() => onSelectConcept(concept)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all duration-100 active:scale-[0.96] border cursor-pointer ${
                  selectedConcept === concept
                    ? 'bg-[#30d158]/15 border-[#30d158]/30 text-[#30d158] font-semibold'
                    : 'bg-white/[0.03] border-white/[0.06] text-[#86868b] hover:text-white hover:border-white/10'
                }`}
              >
                {concept}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
