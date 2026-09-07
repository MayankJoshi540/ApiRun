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

  return (
    <aside className="w-64 flex-no-shrink hidden lg:block font-sans">
      <div className="space-y-6 sticky top-20">
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider text-[#8b949e] px-2.5 py-1 font-semibold">
            NAVIGATION
          </div>
          <button
            onClick={() => onSelectTab('challenges')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-colors ${
              activeTab === 'challenges'
                ? 'bg-[#12161f] text-emerald-400 border border-[#262d3a] font-semibold'
                : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#12161f]/50 border border-transparent'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Layers className="w-4 h-4" />
              <span>Challenges</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#090b0e] border border-[#262d3a] text-[#8b949e]">
              {challengesCount}
            </span>
          </button>
          <button
            onClick={() => onSelectTab('progress')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-colors ${
              activeTab === 'progress'
                ? 'bg-[#12161f] text-emerald-400 border border-[#262d3a] font-semibold'
                : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#12161f]/50 border border-transparent'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Progress</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
              {solvedCount}/{challengesCount}
            </span>
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider text-[#8b949e] px-2.5 py-1">
            DIFFICULTY
          </div>
          <div className="space-y-1">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => onSelectDifficulty(diff)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-[#12161f] text-[#e6edf3] border border-[#262d3a] font-semibold'
                    : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#12161f]/50 border border-transparent'
                }`}
              >
                <span>{diff === 'ALL' ? 'All Difficulties' : diff}</span>
                <span className="font-mono text-[10px] text-[#6e7681]">
                  {diff === 'ALL' ? challengesCount : diff === 'BEGINNER' ? 3 : diff === 'INTERMEDIATE' ? 4 : 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider text-[#8b949e] px-2.5 py-1">
            BACKEND CONCEPTS
          </div>
          <div className="flex flex-wrap gap-1.5 px-1">
            <button
              onClick={() => onSelectConcept('ALL')}
              className={`px-2 py-1 rounded text-[11px] transition-colors border ${
                selectedConcept === 'ALL'
                  ? 'bg-emerald-950/60 border-emerald-800/70 text-emerald-400'
                  : 'bg-[#12161f] border-[#262d3a] text-[#8b949e] hover:text-[#e6edf3]'
              }`}
            >
              All
            </button>
            {allConcepts.map((concept) => (
              <button
                key={concept}
                onClick={() => onSelectConcept(concept)}
                className={`px-2 py-1 rounded text-[11px] transition-colors border ${
                  selectedConcept === concept
                    ? 'bg-emerald-950/60 border-emerald-800/70 text-emerald-400'
                    : 'bg-[#12161f] border-[#262d3a] text-[#8b949e] hover:text-[#e6edf3]'
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
