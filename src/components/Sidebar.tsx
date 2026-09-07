import React from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';

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
        <div className="p-2 rounded-xl bg-[#090d14] border border-white/[0.08] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] px-2.5 py-1 font-semibold">
            NAVIGATION
          </div>
          <button
            onClick={() => onSelectTab('challenges')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
              activeTab === 'challenges' || activeTab === 'dashboard'
                ? 'bg-white/[0.08] text-white font-semibold'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Challenges</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-[#8b949e]">
              {challengesCount}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('progress')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
              activeTab === 'progress'
                ? 'bg-white/[0.08] text-white font-semibold'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Progress</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 font-semibold">
              {solvedCount}/{challengesCount}
            </span>
          </button>
        </div>

        {/* 2. Progress Overview */}
        <div className="p-3.5 rounded-xl bg-[#090d14] border border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94a3b8] font-medium">Completion</span>
            <span className="font-mono text-emerald-400 font-bold">{completionRate}%</span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div 
              className="h-full bg-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(completionRate, 2)}%` }}
            />
          </div>
        </div>

        {/* 3. Difficulty Tiers */}
        <div className="p-3 rounded-xl bg-[#090d14] border border-white/[0.08] space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] px-2 py-0.5 font-semibold">
            DIFFICULTY
          </div>
          <div className="space-y-0.5">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => onSelectDifficulty(diff)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-white/[0.08] text-white font-semibold'
                    : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{diff === 'ALL' ? 'All Difficulties' : diff.charAt(0) + diff.slice(1).toLowerCase()}</span>
                <span className="font-mono text-[10px] text-[#64748b]">
                  {diff === 'ALL' ? challengesCount : diff === 'BEGINNER' ? 3 : diff === 'INTERMEDIATE' ? 4 : 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Core Concepts */}
        <div className="p-3 rounded-xl bg-[#090d14] border border-white/[0.08] space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] px-2 py-0.5 font-semibold">
            CONCEPTS
          </div>
          <div className="flex flex-wrap gap-1 px-1">
            <button
              onClick={() => onSelectConcept('ALL')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors border ${
                selectedConcept === 'ALL'
                  ? 'bg-white/[0.1] border-white/[0.2] text-white font-semibold'
                  : 'bg-[#050708] border-white/[0.06] text-[#94a3b8] hover:text-white'
              }`}
            >
              ALL
            </button>
            {allConcepts.map((concept) => (
              <button
                key={concept}
                onClick={() => onSelectConcept(concept)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors border ${
                  selectedConcept === concept
                    ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400 font-semibold'
                    : 'bg-[#050708] border-white/[0.06] text-[#94a3b8] hover:text-white'
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
