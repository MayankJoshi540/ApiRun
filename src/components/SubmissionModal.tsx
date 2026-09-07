import React from 'react';
import { X, CheckCircle2, AlertTriangle, Loader2, Terminal, ArrowRight } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#0d0f14] border border-[#262d3a] rounded-lg shadow-2xl overflow-hidden font-sans">
        <div className="flex items-center justify-between p-4 bg-[#090b0e] border-b border-[#262d3a]">
          <div className="flex items-center space-x-2.5">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-xs font-semibold text-[#e6edf3]">Final Submission Evaluation</div>
              <div className="text-[11px] text-[#8b949e]">{challenge.title}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8b949e] hover:text-[#e6edf3] p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          {isSubmitting ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
              <div className="text-center space-y-1">
                <div className="text-sm font-semibold text-[#e6edf3]">Executing Comprehensive Backend Suite...</div>
                <div className="text-xs text-[#8b949e] leading-relaxed">Evaluating contract assertions, hidden edge cases, and latency thresholds.</div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className={`p-4 rounded-md border ${
                allPassed
                  ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                  : 'bg-amber-950/30 border-amber-800/50 text-amber-300'
              }`}>
                <div className="flex items-start space-x-3">
                  {allPassed ? (
                    <CheckCircle2 className="w-5 h-5 flex-no-shrink text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 flex-no-shrink text-amber-400 mt-0.5" />
                  )}
                  <div>
                    <div className="text-sm font-semibold">
                      {allPassed ? 'Success: API Challenge Completed' : 'Test Suite Incomplete'}
                    </div>
                    <div className="text-xs text-[#cbd5e1] mt-1 leading-relaxed">
                      {allPassed 
                        ? 'Your backend successfully passed all public contracts and hidden edge cases. Completion has been recorded.'
                        : 'Some test cases failed. Please inspect the request/response diffs and patch your API implementation.'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-[#12161f] border border-[#262d3a] p-3.5 rounded-md">
                  <div className="text-[11px] font-medium text-[#8b949e] uppercase tracking-wider">Test Score</div>
                  <div className={`text-xl font-bold font-mono my-0.5 ${allPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {summary.scorePercent}%
                  </div>
                  <div className="text-xs text-[#8b949e]">{summary.passed} of {summary.total} passed</div>
                </div>

                <div className="bg-[#12161f] border border-[#262d3a] p-3.5 rounded-md">
                  <div className="text-[11px] font-medium text-[#8b949e] uppercase tracking-wider">Hidden Tests</div>
                  <div className="text-xl font-bold font-mono text-[#e6edf3] my-0.5">
                    {hiddenPassed} <span className="text-xs text-[#8b949e]">/ {hiddenTests.length}</span>
                  </div>
                  <div className="text-xs text-[#8b949e]">Edge case suite</div>
                </div>

                <div className="bg-[#12161f] border border-[#262d3a] p-3.5 rounded-md">
                  <div className="text-[11px] font-medium text-[#8b949e] uppercase tracking-wider">Avg Latency</div>
                  <div className="text-xl font-bold font-mono text-[#e6edf3] my-0.5">
                    {summary.durationMs}ms
                  </div>
                  <div className="text-xs text-[#8b949e]">Overhead &lt; 50ms</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-[#090b0e] border-t border-[#262d3a] flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-[#12161f] border border-[#262d3a] text-xs font-medium text-[#8b949e] hover:text-[#e6edf3] transition-colors"
          >
            Close
          </button>
          {allPassed && (
            <button
              onClick={onFeedbackProgress}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-colors"
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
