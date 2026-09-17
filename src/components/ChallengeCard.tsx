import React from 'react';
import { CheckCircle2, ArrowRight, Clock, ShieldCheck } from '@/components/ui/GoogleIcon';
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
      className={`group relative rounded-xl bg-[#090d14] hover:bg-[#0e131d] border transition-colors duration-200 p-5 mb-3 cursor-pointer select-none ${
        isSolved 
          ? 'border-emerald-500/30' 
          : isInProgress 
          ? 'border-amber-500/30' 
          : 'border-white/[0.08] hover:border-white/[0.18]'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Column: Title, Category, Summary, Endpoints & Concepts */}
        <div className="flex-1 space-y-2.5">
          {/* Header Row: Title & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-white group-hover:text-[#10b981] transition-colors flex items-center tracking-tight">
              {challenge.title}
            </h3>

            <span className="text-[11px] font-mono text-[#94a3b8] py-0.5 px-2 rounded bg-white/[0.04] border border-white/[0.06]">
              {challenge.category}
            </span>

            <DifficultyBadge difficulty={challenge.difficulty} />
            
            {isSolved && (
              <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>SOLVED</span>
              </span>
            )}

            {isInProgress && (
              <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-amber-400 bg-amber-950/40 border border-amber-800/50 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1" />
                <span>IN PROGRESS</span>
              </span>
            )}
          </div>

          {/* Challenge Summary */}
          <p className="text-xs sm:text-sm text-[#94a3b8] line-clamp-2 max-w-3xl font-normal leading-relaxed">
            {challenge.summary}
          </p>

          {/* Endpoint Route Pill & Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {/* Main Endpoint Pill */}
            <div className="flex items-center rounded bg-black/40 border border-white/[0.08] px-2 py-0.5 text-xs">
              <span className={`font-mono font-bold mr-1.5 text-[11px] ${
                challenge.endpoints[0]?.method === 'POST' ? 'text-emerald-400' :
                challenge.endpoints[0]?.method === 'GET' ? 'text-sky-400' :
                challenge.endpoints[0]?.method === 'DELETE' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {challenge.endpoints[0]?.method}
              </span>
              <span className="font-mono text-[#e2e8f0] text-[11px]">{challenge.endpoints[0]?.path}</span>
              {challenge.endpoints.length > 1 && (
                <span className="text-[#64748b] ml-1.5 text-[10px] font-mono">+{challenge.endpoints.length - 1} routes</span>
              )}
            </div>

            <div className="hidden sm:block h-3.5 bg-white/[0.08] w-px" />

            {/* Concept Pills */}
            <div className="flex flex-wrap gap-1.5">
              {challenge.concepts.map((c) => (
                <ConceptBadge 
                  key={c} 
                  concept={c} 
                  onClick={onClickConcept ? () => onClickConcept(c) : undefined}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Metadata & CTA Button */}
        <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 pt-2 lg:pt-0 shrink-0 border-t lg:border-t-0 border-white/[0.06]">
          {/* Estimated Time & Test Count */}
          <div className="flex items-center space-x-3 text-xs text-[#8b949e] font-mono">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span>{challenge.estimatedMinutes}m</span>
            </span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span>{challenge.testCases.length} tests</span>
            </span>
          </div>

          {/* Action CTA Button */}
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(challenge); }}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-colors active:scale-98 ${
              isSolved
                ? 'bg-white/[0.05] text-emerald-400 border border-emerald-500/30 hover:bg-white/[0.08]'
                : 'bg-[#10b981] text-black hover:bg-[#059669] shadow-sm'
            }`}
          >
            <span>{isSolved ? 'View Solution' : isInProgress ? 'Resume Lab' : 'Start Challenge'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
