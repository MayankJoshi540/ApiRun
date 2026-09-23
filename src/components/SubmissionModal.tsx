import React from 'react';
import { X, CheckCircle2, AlertTriangle, Loader2, Terminal, ArrowRight } from '@/components/ui/GoogleIcon';
import { Challenge, TestSuiteSummary, TestResultItem } from '../types';

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
  if (!isOpen) return null;

  const allPassed = summary.passed === summary.total && summary.total > 0;
  const hiddenTests = results.filter(r => r.isHidden);
  const hiddenPassed = hiddenTests.filter(r => r.status === 'PASSED').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#080d14] border border-white/[0.12] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden font-sans animate-in zoom-in-95 duration-200"
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="flex items-center justify-between p-5 bg-[#05070a] border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Final Submission Evaluation</div>
              <div className="text-[11px] text-[#94a3b8] font-mono">{challenge.title}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-white p-1.5 rounded-xl hover:bg-white/[0.06] transition-colors active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {isSubmitting ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
              <div className="text-center space-y-1.5">
                <div className="text-sm font-bold text-white">Executing Comprehensive Backend Suite...</div>
                <div className="text-xs text-[#94a3b8] leading-relaxed max-w-sm mx-auto">Evaluating contract assertions, hidden edge cases, and latency thresholds.</div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className={`p-4 rounded-2xl border transition-all ${
                allPassed
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/20 border-amber-500/40 text-amber-300'
              }`}>
                <div className="flex items-start space-x-3.5">
                  {allPassed ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white">
                      {allPassed ? 'Success: API Challenge Completed' : 'Test Suite Incomplete'}
                    </div>
                    <div className="text-xs text-[#cbd5e1] leading-relaxed">
                      {allPassed 
                        ? 'Your backend successfully passed all public contracts and hidden edge cases. Progress recorded.'
                        : 'Some test cases failed. Inspect the request/response diffs in the terminal and patch your logic.'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-2xl space-y-1">
                  <div className="text-[10px] font-mono font-semibold text-[#94a3b8] uppercase tracking-wider">Test Score</div>
                  <div className={`text-2xl font-black font-mono ${allPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {summary.scorePercent}%
                  </div>
                  <div className="text-[11px] text-[#94a3b8]">{summary.passed} of {summary.total} passed</div>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-2xl space-y-1">
                  <div className="text-[10px] font-mono font-semibold text-[#94a3b8] uppercase tracking-wider">Hidden Tests</div>
                  <div className="text-2xl font-black font-mono text-white">
                    {hiddenPassed} <span className="text-xs text-[#94a3b8] font-normal">/ {hiddenTests.length}</span>
                  </div>
                  <div className="text-[11px] text-[#94a3b8]">Edge case suite</div>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-2xl space-y-1">
                  <div className="text-[10px] font-mono font-semibold text-[#94a3b8] uppercase tracking-wider">Avg Latency</div>
                  <div className="text-2xl font-black font-mono text-white">
                    {summary.durationMs}ms
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono font-medium">Overhead &lt; 50ms</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-[#05070a] border-t border-white/[0.08] flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all active:scale-95"
          >
            Close
          </button>
          {allPassed && (
            <button
              onClick={onFeedbackProgress}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all shadow-md active:scale-95"
            >
              <span>View Certified Progress</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
