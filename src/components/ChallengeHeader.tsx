import React from 'react';
import { ArrowLeft, Play, Send, CheckCircle2, Loader2 } from '@/components/ui/GoogleIcon';
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
    <div className="border-b border-white/[0.08] bg-[#05070a] px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Breadcrumb & Dominant Title */}
        <div className="space-y-1.5">
          {/* Small breadcrumb */}
          <div className="flex items-center space-x-2 text-xs font-sans text-[#8b949e]">
            <button
              onClick={onBack}
              className="flex items-center space-x-1.5 hover:text-emerald-400 transition-colors text-[#8b949e] font-medium group active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Challenges</span>
            </button>
            <span className="text-white/20">/</span>
            <span className="text-[#c9d1d9] font-medium">{challenge.title}</span>
          </div>

          {/* Large Title & Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-0.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
              {challenge.title}
            </h1>
            <DifficultyBadge difficulty={challenge.difficulty} />
            <span className="text-xs font-sans font-medium text-[#94a3b8] bg-white/[0.04] px-2.5 py-0.5 rounded-lg border border-white/[0.08]">
              {challenge.category}
            </span>
            {isSolved && (
              <span className="inline-flex items-center space-x-1 font-sans text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-0.5 rounded-lg font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
            className="flex items-center space-x-2 rounded-xl bg-white/[0.03] border border-white/[0.08] px-3.5 py-2 text-xs cursor-pointer hover:border-emerald-500/30 transition-all active:scale-95"
            title="Click to configure target server URL"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#8b949e] font-medium">Target:</span>
            <span className="text-white font-mono text-xs">{serverUrl}</span>
          </div>

          {/* Secondary Action: Run Tests */}
          <button
            disabled={isRunning || isSubmitting}
            onClick={onRunTests}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold transition-all disabled:opacity-50 active:scale-[0.97]"
          >
            {isRunning ? (
              <Loader2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
            )}
            <span>{isRunning ? 'Executing...' : 'Run Tests'}</span>
          </button>

          {/* Primary Action: Submit Solution */}
          <button
            disabled={isRunning || isSubmitting}
            onClick={onSubmitSolution}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all disabled:opacity-50 active:scale-[0.97] shadow-md"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 text-black" />
            ) : (
              <Send className="w-3.5 h-3.5 text-black" />
            )}
            <span>{isSubmitting ? 'Submitting...' : 'Submit Solution'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
