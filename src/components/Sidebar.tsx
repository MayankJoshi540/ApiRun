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
    <aside className="w-64 flex-no-shrink hidden lg:block font-sans select-none">
      <div className="space-y-4 sticky top-20">
        {/* 1. Main Navigation */}
        <div className="p-2 rounded-2xl bg-[#0b0f17] border border-white/[0.08] space-y-1 shadow-sm">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2.5 py-1 font-semibold">
            NAVIGATION
          </div>
          <button
            onClick={() => onSelectTab('challenges')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 active:scale-[0.98] ${
              activeTab === 'challenges' || activeTab === 'dashboard'
                ? 'bg-white/[0.1] text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Challenges</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-400">
              {challengesCount}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('progress')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 active:scale-[0.98] ${
              activeTab === 'progress'
                ? 'bg-white/[0.1] text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Progress</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 font-semibold border border-emerald-800/40">
              {solvedCount}/{challengesCount}
            </span>
          </button>
        </div>

        {/* 2. Progress Overview */}
        <div className="p-4 rounded-2xl bg-[#0b0f17] border border-white/[0.08] space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Completion</span>
            <span className="font-mono text-emerald-400 font-bold">{completionRate}%</span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div 
              className="h-full bg-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(completionRate, 2)}%` }}
            />
          </div>
        </div>

        {/* 3. Difficulty Tiers */}
        <div className="p-3.5 rounded-2xl bg-[#0b0f17] border border-white/[0.08] space-y-2 shadow-sm">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-0.5 font-semibold">
            DIFFICULTY
          </div>
          <div className="space-y-1">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => onSelectDifficulty(diff)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all duration-150 active:scale-[0.98] ${
                  selectedDifficulty === diff
                    ? 'bg-white/[0.1] text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{diff === 'ALL' ? 'All Difficulties' : diff.charAt(0) + diff.slice(1).toLowerCase()}</span>
                <span className="font-mono text-[10px] text-slate-500">
                  {diff === 'ALL' ? challengesCount : diff === 'BEGINNER' ? 3 : diff === 'INTERMEDIATE' ? 4 : 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Core Concepts */}
        <div className="p-3.5 rounded-2xl bg-[#0b0f17] border border-white/[0.08] space-y-2 shadow-sm">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-0.5 font-semibold">
            CONCEPTS
          </div>
          <div className="flex flex-wrap gap-1.5 px-1">
            <button
              onClick={() => onSelectConcept('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all duration-150 active:scale-[0.96] border ${
                selectedConcept === 'ALL'
                  ? 'bg-white/[0.12] border-white/[0.25] text-white font-semibold shadow-sm'
                  : 'bg-[#050708] border-white/[0.06] text-slate-400 hover:text-white hover:border-white/[0.12]'
              }`}
            >
              ALL
            </button>
            {allConcepts.map((concept) => (
              <button
                key={concept}
                onClick={() => onSelectConcept(concept)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all duration-150 active:scale-[0.96] border ${
                  selectedConcept === concept
                    ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-400 font-semibold shadow-sm'
                    : 'bg-[#050708] border-white/[0.06] text-slate-400 hover:text-white hover:border-white/[0.12]'
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
