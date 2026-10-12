'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, CheckCircle2, AlertTriangle, Loader2, ArrowRight, Lock } from '@/components/ui/GoogleIcon';
import { Challenge, TestSuiteSummary, TestResultItem } from '../types';
import { useAuth } from '@/context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  challenge: Challenge;
  summary: TestSuiteSummary;
  results: TestResultItem[];
  isSubmitting: boolean;
  onFeedbackProgress: () => void;
}

export const SubmissionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  challenge,
  summary,
  results,
  isSubmitting,
  onFeedbackProgress
}) => {
  const router = useRouter();
  const { user } = useAuth();

  if (!isOpen) return null;

  const allPassed = summary.passed === summary.total && summary.total > 0;
  const hiddenTests = results.filter(r => r.isHidden);
  const hiddenPassed = hiddenTests.filter(r => r.status === 'PASSED').length;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-emil-fade"
      onClick={!isSubmitting ? onClose : undefined}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[620px] max-h-[calc(100dvh-32px)] flex flex-col bg-[#0E1317] border border-white/[0.1] rounded-[22px] shadow-2xl overflow-hidden font-sans select-none text-[#f5f5f7] animate-emil-modal"
      >
        {/* Floating Close Button (Hidden while submitting) */}
        {!isSubmitting && (
          <button
            onClick={onClose}
            className="absolute top-4.5 right-4.5 z-20 w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/[0.08]"
            title="Close dialog (Esc)"
            aria-label="Close dialog"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        )}

        {/* Content Body (Scrollable if viewport is small) */}
        <div className="p-6 sm:p-7 space-y-4 sm:space-y-5 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {isSubmitting ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center animate-emil-fade">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-emerald-400">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-xl font-semibold text-white tracking-tight">Evaluating Backend Solution...</h3>
                <p className="text-[14px] text-zinc-400 leading-relaxed font-normal">
                  Executing contract assertions, concurrency checks, and measuring runtime latency.
                </p>
              </div>
              <div className="relative w-48 h-1 bg-white/[0.08] rounded-full overflow-hidden pt-0.5">
                <div className="animate-apirun-bar" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Outcome Status Banner (Staggered Cascade 1) */}
              <div className={`p-4.5 sm:p-5 rounded-2xl border flex items-start gap-3.5 transition-all animate-cascade-1 ${
                allPassed 
                  ? 'bg-[#0B1E17]/90 border-emerald-500/25' 
                  : 'bg-[#1E1114]/90 border-rose-500/25'
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  allPassed 
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                    : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                }`}>
                  {allPassed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1 flex-1 min-w-0 pr-6">
                  <h3 className="text-[22px] sm:text-[24px] font-semibold text-white tracking-tight leading-snug">
                    {allPassed ? 'Challenge Completed' : 'Tests Incomplete'}
                  </h3>
                  <p className="text-[14px] sm:text-[14.5px] text-zinc-300 leading-relaxed font-normal">
                    {allPassed 
                      ? (!user 
                          ? 'All test assertions and edge cases passed. Sign in to save your completion score and streak.'
                          : 'Your backend passed all public contracts and hidden edge cases. Progress has been saved.')
                      : `${summary.failed} test case${summary.failed === 1 ? '' : 's'} failed assertions. Review the expected vs. actual status diffs in the terminal dock.`}
                  </p>
                </div>
              </div>

              {/* 3 Metric Cards (Staggered Cascade 2) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 animate-cascade-2">
                {/* Metric 1: Score */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] flex flex-col justify-between space-y-1 min-h-[104px]">
                  <div className="text-[12px] sm:text-[12.5px] font-mono text-zinc-400 uppercase tracking-wider font-medium">
                    Score
                  </div>
                  <div className={`text-[32px] sm:text-[34px] font-bold font-mono tabular-nums tracking-tight ${
                    allPassed ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {summary.scorePercent}%
                  </div>
                  <div className="text-[12px] sm:text-[12.5px] text-zinc-400 font-medium truncate">
                    {summary.passed} of {summary.total} passed
                  </div>
                </div>

                {/* Metric 2: Edge Cases */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] flex flex-col justify-between space-y-1 min-h-[104px]">
                  <div className="text-[12px] sm:text-[12.5px] font-mono text-zinc-400 uppercase tracking-wider font-medium">
                    Edge Cases
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[32px] sm:text-[34px] font-bold font-mono text-white tabular-nums tracking-tight">
                      {hiddenPassed}
                    </span>
                    <span className="text-[13px] font-mono text-zinc-400 font-medium">
                      / {hiddenTests.length}
                    </span>
                  </div>
                  <div className="text-[12px] sm:text-[12.5px] text-zinc-400 font-medium truncate">
                    Hidden checks
                  </div>
                </div>

                {/* Metric 3: Latency */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] flex flex-col justify-between space-y-1 min-h-[104px]">
                  <div className="text-[12px] sm:text-[12.5px] font-mono text-zinc-400 uppercase tracking-wider font-medium">
                    Avg Latency
                  </div>
                  <div className="text-[32px] sm:text-[34px] font-bold font-mono text-white tabular-nums tracking-tight">
                    {summary.durationMs}ms
                  </div>
                  <div className="text-[12px] sm:text-[12.5px] text-zinc-400 font-medium truncate">
                    Total runtime
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions (Staggered Cascade 3) */}
        {!isSubmitting && (
          <div className="px-6 py-4 bg-[#090D10] border-t border-white/[0.07] flex items-center justify-end gap-3 shrink-0 animate-cascade-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] h-[44px] px-5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] active:scale-[0.98] border border-white/[0.1] text-[14px] font-medium text-zinc-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
            >
              Close
            </button>

            {allPassed ? (
              !user ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push('/sign-in?redirect=/challenges');
                  }}
                  className="min-h-[44px] h-[44px] px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-black font-semibold text-[14px] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Lock className="w-4 h-4 text-black" />
                  <span>Sign In to Save Progress</span>
                  <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onFeedbackProgress}
                  className="min-h-[44px] h-[44px] px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-black font-semibold text-[14px] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>View Progress</span>
                  <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] h-[44px] px-6 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 active:scale-[0.98] border border-rose-500/30 text-rose-300 hover:text-white text-[14px] font-medium transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>Inspect Test Diff</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
