import React from 'react';
import { CheckCircle2, ArrowRight, Terminal, Clock } from 'lucide-react';
import { Challenge } from '../types';
import { DifficultyBadge } from './DifficultyBadge';
import { ConceptBadge } from './ConceptBadge';

interface Props {
  challenge: Challenge;
  onSelect: (challenge: Challenge) => void;
  onClickConcept?: (concept: string) => void;
}

export const ChallengeCard: React.FC<Props> = ({
  challenge,
  onSelect,
  onClickConcept
}) => {
  const isSolved = challenge.status === 'SOLVED';
  const isInProgress = challenge.status === 'IN_PROGRESS';

  return (
    <div 
      onClick={() => onSelect(challenge)}
      className={`group relative rounded border bg-[#12161f] border-[#262d3a] hover:border-[#374151] transition-all p-5 mb-3 cursor-pointer ${
        isSolved ? 'border-l-2 border-l-emerald-500' : isInProgress ? 'border-l-2 border-l-amber-500' : 'border-l-2 border-l-transparent'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Info */}
        <div className="flex-1 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-base font-semibold text-[#e6edf3] group-hover:text-emerald-400 transition-colors flex items-center">
              {challenge.title}
            </h3>
            <span className="text-[11px] font-mono text-[#8b949e] py-0.5 px-2 rounded bg-[#171c26] border border-[#272e3a]">
              {challenge.category}
            </span>
            <DifficultyBadge difficulty={challenge.difficulty} />
            
            {isSolved && (
              <span className="inline-flex items-center space-x-1 font-mono text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/70 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3" />
                <span>PASSED</span>
              </span>
            )}
            {isInProgress && (
              <span className="inline-flex items-center font-mono text-[11px] text-amber-400 bg-amber-950/60 border border-amber-800/70 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5" />
                IN_PROGRESS
              </span>
            )}
          </div>

          <p className="text-sm text-[#8b949e] line-clamp-2 max-w-3xl font-normal">
            {challenge.summary}
          </p>

          {/* Routes Preview & Concepts */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center rounded bg-[#090b0e] border border-[#262d3a] px-2 py-0.5 font-mono text-[11px]">
              <span className={`font-bold mr-1.5 ${
                challenge.endpoints[0]?.method === 'POST' ? 'text-emerald-400' :
                challenge.endpoints[0]?.method === 'GET' ? 'text-sky-400' :
                challenge.endpoints[0]?.method === 'DELETE' ? 'text-red-400' : 'text-amber-400'
              }`}>
                {challenge.endpoints[0]?.method}
              </span>
              <span className="text-[#e6edf3]">{challenge.endpoints[0]?.path}</span>
              {challenge.endpoints.length > 1 && (
                <span className="text-[#8b949e] ml-1.5">+{challenge.endpoints.length - 1} more</span>
              )}
            </div>

            <div className="h-3.5 bg-[#262d3a] w-px" />

            {/* Concept Pills */}
            {challenge.concepts.map((c) => (
              <ConceptBadge 
                key={c} 
                concept={c} 
                onClick={onClickConcept ? () => onClickConcept(c) : undefined}
              />
            ))}
          </div>
        </div>

        {/* Right Actions & Test Metrics */}
        <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 font-mono">
          <div className="flex items-center space-x-3 text-xs text-[#8b949e]">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{challenge.estimatedMinutes}m</span>
            </span>
            <span className="flex items-center space-x-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>{challenge.testCases.length} tests</span>
            </span>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onSelect(challenge); }}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-xs font-medium font-mono transition-colors ${
              isSolved
                ? 'bg-[#171c26] text-emerald-400 border border-emerald-800/60 hover:bg-emerald-500/10'
                : 'bg-emerald-500 text-black font-semibold hover:bg-emerald-400'
            }`}
          >
            <span>{isSolved ? 'View Solution' : isInProgress ? 'Continue' : 'Start Challenge'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
