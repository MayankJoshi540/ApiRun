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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* Scoped Keyframe Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes modalSuccessPop {
          0% { transform: scale(0.94); opacity: 0; }
          60% { transform: scale(1.018); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes modalShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(7px); }
          45% { transform: translateX(-5px); }
          60% { transform: translateX(4px); }
          75% { transform: translateX(-2px); }
          90% { transform: translateX(1px); }
        }

        @keyframes iconCheckSpring {
          0% { transform: scale(0.4) rotate(-15deg); opacity: 0; }
          65% { transform: scale(1.22) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        @keyframes iconRejectSpring {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes statCardFade {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .anim-modal-success {
          animation: modalSuccessPop 380ms cubic-bezier(0.23, 1, 0.32, 1) both;
        }

        .anim-modal-shake {
          animation: modalShake 460ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        .anim-icon-check {
          animation: iconCheckSpring 450ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .anim-icon-reject {
          animation: iconRejectSpring 420ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .anim-stat-card {
          animation: statCardFade 320ms cubic-bezier(0.23, 1, 0.32, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-modal-success,
          .anim-modal-shake,
          .anim-icon-check,
          .anim-icon-reject,
          .anim-stat-card {
            animation: none !important;
            transform: none !important;
          }
        }
      `}} />

      <div 
        className={`w-full max-w-[600px] bg-[#1c1c1e]/95 backdrop-blur-3xl border border-white/[0.12] border-t-white/[0.22] rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.7)] overflow-hidden font-sans select-none text-[#f5f5f7] relative ${
          !isSubmitting ? (allPassed ? 'anim-modal-success' : 'anim-modal-shake') : 'animate-in zoom-in-95 duration-200'
        }`}
      >
        {/* Ambient Top Glow Layer */}
        {!isSubmitting && (
          <div 
            className={`absolute top-0 inset-x-0 h-28 pointer-events-none rounded-t-3xl transition-opacity duration-300 ${
              allPassed 
                ? 'bg-gradient-to-b from-[#30d158]/12 via-[#30d158]/3 to-transparent' 
                : 'bg-gradient-to-b from-[#ff453a]/12 via-[#ff453a]/3 to-transparent'
            }`} 
          />
        )}

        {/* Floating Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:scale-90 text-[#86868b] hover:text-white flex items-center justify-center transition-all cursor-pointer"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-5 relative z-10">
          {isSubmitting ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#30d158]/15 animate-ping" />
                <Loader2 className="w-8 h-8 animate-spin text-[#30d158]" />
              </div>
              <div className="text-center space-y-1">
                <div className="text-sm font-semibold text-white tracking-tight">Evaluating Backend Solution...</div>
                <div className="text-xs text-[#86868b] max-w-xs leading-relaxed">
                  Executing contract assertions, hidden edge cases, and measuring response latency.
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Outcome Status Banner */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-4 shadow-sm relative overflow-hidden">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${
                  allPassed 
                    ? 'bg-[#30d158]/15 border-[#30d158]/30 text-[#30d158] anim-icon-check shadow-[0_0_16px_rgba(48,209,88,0.25)]' 
                    : 'bg-[#ff453a]/15 border-[#ff453a]/30 text-[#ff453a] anim-icon-reject shadow-[0_0_16px_rgba(255,69,58,0.25)]'
                }`}>
                  {allPassed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1 flex-1 min-w-0 pr-6">
                  <h3 className="text-base font-semibold text-white tracking-tight">
                    {allPassed ? 'Challenge Completed' : 'Tests Incomplete'}
                  </h3>
                  <p className="text-[13px] text-[#a1a1a6] leading-relaxed">
                    {allPassed 
                      ? (!user 
                          ? 'All test assertions and edge cases passed. Sign in to record your completion and maintain your streak.'
                          : 'Your backend passed all public contracts and hidden edge cases. Progress has been saved.')
                      : `${summary.failed} test case${summary.failed === 1 ? '' : 's'} failed assertions. Review the expected vs. actual status diffs in the terminal dock.`}
                  </p>
                </div>
              </div>

              {/* 3 Metric Cards with Perfect Baseline Alignment & Fluid Widths */}
              <div className="grid grid-cols-3 gap-3 sm:gap-3.5">
                {/* Metric 1: Score */}
                <div 
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between anim-stat-card shadow-xs"
                  style={{ animationDelay: '60ms' }}
                >
                  <div className="text-xs text-[#86868b] font-medium tracking-tight">Score</div>
                  <div className={`text-2xl sm:text-[26px] font-semibold tabular-nums tracking-tight mt-1.5 ${
                    allPassed ? 'text-[#30d158]' : 'text-[#ff453a]'
                  }`}>
                    {summary.scorePercent}%
                  </div>
                  <div className="text-[11px] text-[#86868b] tabular-nums mt-1 truncate">
                    {summary.passed} of {summary.total} passed
                  </div>
                </div>

                {/* Metric 2: Edge Cases (Aligned baseline) */}
                <div 
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between anim-stat-card shadow-xs"
                  style={{ animationDelay: '120ms' }}
                >
                  <div className="text-xs text-[#86868b] font-medium tracking-tight">Edge Cases</div>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-2xl sm:text-[26px] font-semibold text-white tabular-nums tracking-tight">
                      {hiddenPassed}
                    </span>
                    <span className="text-xs font-medium text-[#86868b]">
                      / {hiddenTests.length}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#86868b] mt-1 truncate">
                    Hidden checks
                  </div>
                </div>

                {/* Metric 3: Latency (Fitted label) */}
                <div 
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between anim-stat-card shadow-xs"
                  style={{ animationDelay: '180ms' }}
                >
                  <div className="text-xs text-[#86868b] font-medium tracking-tight">Avg Latency</div>
                  <div className="text-2xl sm:text-[26px] font-semibold text-white tabular-nums tracking-tight mt-1.5">
                    {summary.durationMs}ms
                  </div>
                  <div className="text-[11px] text-[#86868b] mt-1 truncate">
                    Total runtime
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 sm:px-7 py-4 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-end space-x-3 relative z-10">
          <button
            onClick={onClose}
            className="h-10 px-4.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] active:scale-[0.97] border border-white/[0.08] text-xs font-semibold text-[#d1d1d6] hover:text-white transition-all cursor-pointer shadow-xs"
          >
            Close
          </button>

          {allPassed ? (
            !user ? (
              <button
                onClick={() => {
                  onClose();
                  router.push('/sign-in?redirect=/challenges');
                }}
                className="h-10 px-5 rounded-xl bg-[#30d158] hover:bg-[#34c759] active:scale-[0.97] text-black font-semibold text-xs transition-all shadow-[0_2px_14px_rgba(48,209,88,0.3)] flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-black" />
                <span>Sign In to Save Progress</span>
                <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
              </button>
            ) : (
              <button
                onClick={onFeedbackProgress}
                className="h-10 px-5 rounded-xl bg-[#30d158] hover:bg-[#34c759] active:scale-[0.97] text-black font-semibold text-xs transition-all shadow-[0_2px_14px_rgba(48,209,88,0.3)] flex items-center gap-2 cursor-pointer"
              >
                <span>View Progress</span>
                <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
              </button>
            )
          ) : (
            <button
              onClick={onClose}
              className="h-10 px-4.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] active:scale-[0.97] border border-white/[0.1] text-xs font-semibold text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Inspect Diff</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
