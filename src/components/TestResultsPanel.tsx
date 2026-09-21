import React from 'react';
import { Play, Loader2, CheckCircle2, AlertTriangle, Clock } from '@/components/ui/GoogleIcon';
import { TestResultItem, TestSuiteSummary } from '../types';
import { TestResult } from './TestResult';
import { ProgressIndicator } from './ProgressIndicator';

interface Props {
  results?: TestResultItem[];
  testResults?: TestResultItem[];
  summary: TestSuiteSummary;
  onRunTests?: () => void;
  onRerun?: () => void;
  isRunning: boolean;
  serverUrl?: string;
}

export const TestResultsPanel: React.FC<Props> = ({
  results,
  testResults,
  summary,
  onRunTests,
  onRerun,
  isRunning,
  serverUrl = 'In-Browser Engine'
}) => {
  const items = results || testResults || [];
  const handleRun = onRunTests || onRerun || (() => {});

  return (
    <div className="space-y-4 font-sans select-none">
      {/* Summary Bar */}
      <div className="p-4 rounded-xl bg-[#090d14] border border-white/[0.08] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white">Test Suite Evaluation</span>
              <span className="text-xs text-[#8b949e]">
                — <span className="font-mono text-[11px] text-[#10b981]">{serverUrl}</span>
              </span>
            </div>
            <div className="text-xs text-[#8b949e] font-mono">
              <span className="text-emerald-400 font-bold">{summary.passed}</span> passed,{' '}
              <span className="text-rose-400 font-bold">{summary.failed}</span> failed,{' '}
              <span className="text-white font-bold">{summary.total}</span> total
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isRunning
                  ? 'bg-white/[0.06] text-[#8b949e] cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 shadow-md shadow-emerald-950/40'
              }`}
            >
              {isRunning ? <Loader2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Evaluating...' : 'Run Test Suite'}</span>
            </button>
          </div>
        </div>

        <div className="pt-1">
          <ProgressIndicator
            passed={summary.passed}
            total={summary.total}
            isRunning={isRunning}
            showLabel={true}
          />
        </div>
      </div>

      {/* Test Cases List */}
      <div className="space-y-2">
        {items.length > 0 ? (
          items.map((testResult, index) => (
            <TestResult
              key={testResult.testId || index}
              testResult={testResult}
              index={index}
            />
          ))
        ) : (
          <div className="p-8 rounded-xl border border-white/[0.06] bg-[#090d14] text-center text-xs text-[#8b949e]">
            No tests executed yet. Click "Run Test Suite" to evaluate your implementation.
          </div>
        )}
      </div>
    </div>
  );
};
