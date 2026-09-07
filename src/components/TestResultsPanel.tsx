import React from 'react';
import { Play, Loader2, CheckCircle2, AlertTriangle, Server, Clock } from 'lucide-react';
import { TestResultItem, TestSuiteSummary } from '../types';
import { TestResult } from './TestResult';
import { ProgressIndicator } from './ProgressIndicator';

interface Props {
  testResults: TestResultItem[];
  summary: TestSuiteSummary;
  onRunTests: () => void;
  isRunning: boolean;
  serverUrl: string;
}

export const TestResultsPanel: React.FC<Props> = ({
  testResults,
  summary,
  onRunTests,
  isRunning,
  serverUrl
}) => {
  return (
    <div className="space-y-4 font-sans">
      { /* Summary Bar */ }
      <div className="p-4 rounded-md bg-[#12161f] border border-[#262d3a] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-[#e6edf3]">Test Suite Runner</span>
              <span className="text-xs text-[#8b949e]">
                — Testing <span className="font-mono text-[11px] text-[#c9d1d9]">{serverUrl}</span>
              </span>
            </div>
            <div className="text-xs text-[#8b949e]">
              <span className="font-mono text-emerald-400 font-medium">{summary.passed}</span> passed,{' '}
              <span className="font-mono text-red-400 font-medium">{summary.failed}</span> failed,{' '}
              <span className="font-mono text-[#c9d1d9] font-medium">{summary.total}</span> total
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onRunTests}
              disabled={isRunning}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                isRunning
                  ? 'bg-[#171c26] text-[#8b949e] cursor-not-allowed'
                  : 'bg-emerald-500 text-black font-semibold hover:bg-emerald-400 active:scale-[0.98]'
              }`}
            >
              {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isRunning ? 'Executing...' : 'Run Tests'}</span>
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

      { /* Test Cases List */ }
      <div className="space-y-2">
        {testResults.map((testResult, index) => (
          <TestResult
            key={testResult.testId || index}
            testResult={testResult}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
