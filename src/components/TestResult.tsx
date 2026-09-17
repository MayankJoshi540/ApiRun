import React, { useState } from 'react';
import { CheckCircle2, XCircle, Loader2, Clock, ChevronDown, ChevronRight } from '@/components/ui/GoogleIcon';
import { TestResultItem } from '../types';

interface Props {
  testResult: TestResultItem;
  index: number;
}

export const TestResult: React.FC<Props> = ({
  testResult,
  index
}) => {
  const [isExpanded, setIsExpanded] = useState(testResult.status === 'FAILED');

  const getStatusBadge = () => {
    switch (testResult.status) {
      case 'PASSED':
        return (
          <div className="flex items-center space-x-1.5 text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded text-[11px] font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PASSED</span>
          </div>
        );
      case 'FAILED':
        return (
          <div className="flex items-center space-x-1.5 text-red-400 bg-red-950/50 border border-red-800/60 px-2 py-0.5 rounded text-[11px] font-mono">
            <XCircle className="w-3.5 h-3.5" />
            <span>FAILED</span>
          </div>
        );
      case 'RUNNING':
        return (
          <div className="flex items-center space-x-1.5 text-sky-400 bg-sky-950/50 border border-sky-800/60 px-2 py-0.5 rounded text-[11px] font-mono">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>RUNNING</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-1.5 text-[#8b949e] bg-[#12161f] border border-[#262d3a] px-2 py-0.5 rounded text-[11px] font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>PENDING</span>
          </div>
        );
    }
  };

  return (
    <div className={`rounded-md border ${
      testResult.status === 'FAILED'
        ? 'bg-[#130f10] border-red-900/60'
        : testResult.status === 'PASSED'
        ? 'bg-[#12161f] border-[#262d3a]'
        : 'bg-[#12161f]/50 border-[#1b202a]'
    } overflow-hidden font-sans transition-all`}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#171c26]/40 transition-colors select-none"
      >
        <div className="flex items-center space-x-3">
          <button className="text-[#8b949e]">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-[#6e7681] text-xs font-mono">#{index + 1}</span>
              <span className="font-semibold text-xs text-[#e6edf3]">
                {testResult.name}
              </span>
              {testResult.isHidden && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
                  HIDDEN
                </span>
              )}
            </div>
            <div className="text-xs text-[#8b949e] flex items-center space-x-2 font-mono">
              <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                testResult.method === 'POST' ? 'text-sky-400 bg-sky-950/60 border border-sky-900/50' :
                testResult.method === 'GET' ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-900/50' : 'text-amber-400 bg-amber-950/60 border border-amber-900/50'
              }`}>{testResult.method}</span>
              <span className="text-[#c9d1d9]">{testResult.endpoint}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {testResult.durationMs > 0 && (
            <span className="text-xs font-mono text-[#8b949e]">{testResult.durationMs}ms</span>
          )}
          {getStatusBadge()}
        </div>
      </div>

      {isExpanded && (
        <div className="p-3.5 bg-[#090b0e] border-t border-[#262d3a] space-y-3 text-xs font-sans">
          {testResult.failureReason && (
            <div className="p-2.5 rounded-md bg-red-950/20 border border-red-900/50 text-red-300">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-red-400">Failure Reason</div>
              <div className="text-xs text-red-200 mt-0.5 leading-relaxed">{testResult.failureReason}</div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">Expected Response</div>
              <div className="p-2.5 rounded-md bg-[#12161f] border border-[#262d3a] text-xs font-mono text-emerald-300">
                <div>HTTP <span className="font-bold">{testResult.expectedStatus}</span></div>
                {testResult.expectedResponse && (
                  <pre className="mt-1.5 overflow-x-auto text-[11px] text-[#c9d1d9] leading-relaxed">{testResult.expectedResponse}</pre>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">Actual Response</div>
              <div className={`p-2.5 rounded-md bg-[#12161f] border ${testResult.status === 'FAILED' ? 'border-red-900/80 text-red-300' : 'border-[#262d3a] text-emerald-300'} text-xs font-mono`}>
                <div>HTTP <span className="font-bold">{testResult.actualStatus || '--'}</span></div>
                {testResult.actualResponse && (
                  <pre className="mt-1.5 overflow-x-auto text-[11px] text-[#c9d1d9] leading-relaxed">{testResult.actualResponse}</pre>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
