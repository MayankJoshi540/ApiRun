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
        {/* 1. Main Navigation */}
        <div className="p-2.5 rounded-2xl bg-[#111622] border border-slate-800/80 space-y-1.5 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1.5 font-bold">
            Navigation
          </div>
          <button
            onClick={() => onSelectTab('challenges')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 active:scale-[0.98] ${
              activeTab === 'challenges' || activeTab === 'dashboard'
                ? 'bg-slate-800 text-slate-100 font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Layers className="w-4 h-4 text-emerald-400/90" />
              <span>Challenges</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-800 text-slate-400 font-semibold">
              {challengesCount}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('progress')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 active:scale-[0.98] ${
              activeTab === 'progress'
                ? 'bg-slate-800 text-slate-100 font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400/90" />
              <span>Progress</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-400 font-bold border border-emerald-800/40">
              {solvedCount}/{challengesCount}
            </span>
          </button>
        </div>

        {/* 2. Progress Overview */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#111622] border border-slate-800/80 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 font-medium">Completion</span>
            <span className="font-mono text-emerald-400 font-bold text-base">{completionRate}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
            <div 
              className="h-full bg-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(completionRate, 2)}%` }}
            />
          </div>
        </div>

        {/* 3. Difficulty Tiers */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#111622] border border-slate-800/80 space-y-2.5 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1 font-bold">
            Difficulty
          </div>
          <div className="space-y-1.5">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => onSelectDifficulty(diff)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm transition-all duration-150 active:scale-[0.98] ${
                  selectedDifficulty === diff
                    ? 'bg-slate-800 text-slate-100 font-semibold border border-slate-700/60 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
                }`}
              >
                <span>{diff === 'ALL' ? 'All Difficulties' : diff.charAt(0) + diff.slice(1).toLowerCase()}</span>
                <span className="font-mono text-xs text-slate-500 font-semibold">
                  {diff === 'ALL' ? challengesCount : diff === 'BEGINNER' ? 3 : diff === 'INTERMEDIATE' ? 4 : 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Core Concepts */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#111622] border border-slate-800/80 space-y-2.5 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1 font-bold">
            Concepts
          </div>
          <div className="flex flex-wrap gap-2 px-1">
            <button
              onClick={() => onSelectConcept('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 active:scale-[0.96] border ${
                selectedConcept === 'ALL'
                  ? 'bg-slate-800 border-slate-700 text-slate-100 font-semibold shadow-xs'
                  : 'bg-[#0e131d] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              ALL
            </button>
            {allConcepts.map((concept) => (
              <button
                key={concept}
                onClick={() => onSelectConcept(concept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 active:scale-[0.96] border ${
                  selectedConcept === concept
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400 font-semibold shadow-xs'
                    : 'bg-[#0e131d] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
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
