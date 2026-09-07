import React from 'react';
import { ArrowLeft, Play, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Challenge } from '../types';
import { DifficultyBadge } from './DifficultyBadge';

interface Props {
  challenge: Challenge;
  onBack: () => void;
  onRunTests: () => void;
  onSubmitSolution: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  serverUrl: string;
  onOpenServerSettings?: () => void;
}

export const ChallengeHeader: React.FC<Props> = ({
  challenge,
  onBack,
  onRunTests,
  onSubmitSolution,
  isRunning,
  isSubmitting,
  serverUrl,
  onOpenServerSettings
}) => {
  const isSolved = challenge.status === 'SOLVED';

  return (
    <div className="border-b border-[#21262d] bg-[#080a0e] px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Breadcrumb & Dominant Title */}
        <div className="space-y-1.5">
          {/* Small breadcrumb */}
          <div className="flex items-center space-x-2 text-xs font-sans text-[#8b949e]">
            <button
              onClick={onBack}
              className="flex items-center space-x-1.5 hover:text-emerald-400 transition-colors text-[#8b949e] font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Challenges</span>
            </button>
            <span className="text-[#484f58]">/</span>
            <span className="text-[#c9d1d9] font-medium">{challenge.title}</span>
          </div>

          {/* Large Title & Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-0.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#e6edf3] font-sans">
              {challenge.title}
            </h1>
            <DifficultyBadge difficulty={challenge.difficulty} />
            <span className="text-xs font-sans font-medium text-[#8b949e] bg-[#12161f] px-2.5 py-0.5 rounded-md border border-[#262d3a]">
              {challenge.category}
            </span>
            {isSolved && (
              <span className="inline-flex items-center space-x-1 font-mono text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/70 px-2 py-0.5 rounded-md font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>SOLVED</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Target & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 font-sans">
          {/* Target Endpoint Indicator */}
          <div 
            onClick={onOpenServerSettings}
            className="flex items-center space-x-2 rounded-md bg-[#12161f] border border-[#262d3a] px-3 py-1.5 text-xs cursor-pointer hover:border-[#374151] transition-colors"
            title="Click to configure target server URL"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[#8b949e] font-medium">Target:</span>
            <span className="text-[#e6edf3] font-mono text-xs">{serverUrl}</span>
          </div>

          {/* Secondary Action: Run Tests */}
          <button
            disabled={isRunning || isSubmitting}
            onClick={onRunTests}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-[#171c26] text-[#e6edf3] hover:text-white border border-[#262d3a] hover:border-[#374151] text-xs font-medium transition-colors disabled:opacity-50 active:scale-[0.98]"
          >
            {isRunning ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>{isRunning ? 'Executing...' : 'Run Tests'}</span>
          </button>

          {/* Primary Action: Submit Solution */}
          <button
            disabled={isRunning || isSubmitting}
            onClick={onSubmitSolution}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{isSubmitting ? 'Submitting...' : 'Submit Solution'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
