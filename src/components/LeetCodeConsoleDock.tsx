'use client';

import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Clock
} from '@/components/ui/GoogleIcon';
import { TestCase, TestResultItem, TestSuiteSummary } from '../types';

interface Props {
  testCases: TestCase[];
  testResults: TestResultItem[];
  summary: TestSuiteSummary;
  isRunning: boolean;
  activeConsoleTab: 'testcase' | 'result';
  onSelectTab: (tab: 'testcase' | 'result') => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const LeetCodeConsoleDock: React.FC<Props> = ({
  testCases,
  testResults,
  summary,
  isRunning,
  activeConsoleTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse
}) => {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  const activeTestCase = testCases[selectedCaseIdx] || testCases[0];
  const activeTestResult = testResults[selectedCaseIdx] || testResults[0];

  const hasRun = summary.status === 'COMPLETED' || testResults.some(r => r.status === 'PASSED' || r.status === 'FAILED');
  const allPassed = summary.passed === summary.total && summary.total > 0;

  return (
    <div className="h-full w-full rounded-xl bg-[#111622] border border-slate-800/80 flex flex-col overflow-hidden shadow-lg">
      {/* ── Console Header (Tabs + Toggle) ── */}
      <div className="h-10 px-3.5 bg-[#141a27] border-b border-slate-800/80 flex items-center justify-between shrink-0 select-none text-xs">
        {/* Tabs: ☑ Testcase | >_ Test Result */}
        <div className="flex items-center gap-1.5 font-medium">
          <button
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              onSelectTab('testcase');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition cursor-pointer ${
              activeConsoleTab === 'testcase' && !isCollapsed
                ? 'bg-slate-800 text-slate-100 font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <span className="text-emerald-400 font-bold">☑</span>
            <span>Testcase</span>
          </button>

          <button
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              onSelectTab('result');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition cursor-pointer ${
              activeConsoleTab === 'result' && !isCollapsed
                ? 'bg-slate-800 text-slate-100 font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Test Result</span>
            {hasRun && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold border ${
                allPassed 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {summary.passed}/{summary.total}
              </span>
            )}
          </button>
        </div>

        {/* Right: Collapse / Expand Button */}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          title={isCollapsed ? 'Expand Console' : 'Collapse Console'}
        >
          {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Console Body (When Not Collapsed) ── */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4 bg-[#111622] text-xs font-sans text-slate-300">
          {/* TAB 1: TESTCASE SPECIFICATION */}
          {activeConsoleTab === 'testcase' && (
            <div className="space-y-3.5">
              {/* Test Case Selection Chips */}
              <div className="flex items-center gap-2 flex-wrap">
                {testCases.map((tc, idx) => (
                  <button
                    key={tc.id || idx}
                    onClick={() => setSelectedCaseIdx(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
                      selectedCaseIdx === idx
                        ? 'bg-slate-800 text-slate-100 font-semibold border-slate-700/60 shadow-xs'
                        : 'bg-[#141a27] text-slate-400 border-slate-800 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>

              {/* Case Details */}
              {activeTestCase && (
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                      Target Endpoint
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#141a27] border border-slate-800/80 font-mono">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {activeTestCase.method}
                      </span>
                      <span className="text-slate-200">{activeTestCase.endpoint}</span>
                    </div>
                  </div>

                  {activeTestCase.requestPayload && (
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                        Payload
                      </div>
                      <pre className="p-2.5 rounded-lg bg-[#141a27] border border-slate-800/80 font-mono text-slate-300 overflow-x-auto text-[11.5px] leading-relaxed">
                        {activeTestCase.requestPayload}
                      </pre>
                    </div>
                  )}

                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                      Expected Response Status
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#141a27] border border-slate-800/80 font-mono text-emerald-400 font-bold">
                      HTTP {activeTestCase.expectedStatus}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TEST RESULT OUTPUT */}
          {activeConsoleTab === 'result' && (
            <div className="space-y-3.5">
              {isRunning ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                  <span className="text-xs">Running assertion tests against your server...</span>
                </div>
              ) : !hasRun ? (
                <div className="text-center py-8 text-slate-500 space-y-1">
                  <p className="text-xs">No tests executed yet.</p>
                  <p className="text-[11px] text-slate-500">Click &ldquo;Run Tests&rdquo; to evaluate your API against test assertions.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-sm font-bold flex items-center gap-1.5 ${allPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {allPassed ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Passed All Checks</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            <span>Assertion Failed</span>
                          </>
                        )}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Latency: {summary.durationMs || 10} ms
                      </span>
                    </div>

                    <div className="text-xs font-mono">
                      <span className="text-emerald-400 font-bold">{summary.passed}</span> / <span className="text-slate-400">{summary.total} passed</span>
                    </div>
                  </div>

                  {/* Case Selectors with Pass/Fail marks */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {testResults.map((tr, idx) => (
                      <button
                        key={tr.testId || idx}
                        onClick={() => setSelectedCaseIdx(idx)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
                          selectedCaseIdx === idx
                            ? 'bg-slate-800 text-slate-100 font-semibold border-slate-700/60'
                            : 'bg-[#141a27] text-slate-400 border-slate-800 hover:bg-slate-800/60 hover:text-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${tr.status === 'PASSED' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span>Case {idx + 1}</span>
                      </button>
                    ))}
                  </div>

                  {/* Selected Result Diff */}
                  {activeTestResult && (
                    <div className="space-y-3 font-mono text-[11.5px]">
                      {activeTestResult.failureReason && (
                        <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40 text-rose-300">
                          <div className="text-[10.5px] font-bold uppercase tracking-wider text-rose-400 mb-0.5">Failure Reason</div>
                          <div>{activeTestResult.failureReason}</div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <div className="text-[10.5px] font-sans font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Actual Output
                          </div>
                          <div className={`p-2.5 rounded-lg bg-[#141a27] border ${
                            activeTestResult.status === 'PASSED' ? 'border-slate-800/80 text-emerald-400' : 'border-rose-900/50 text-rose-300'
                          } space-y-1`}>
                            <div className="font-bold">HTTP {activeTestResult.actualStatus || '--'}</div>
                            {activeTestResult.actualResponse && (
                              <pre className="text-slate-300 overflow-x-auto text-[11px] leading-relaxed max-h-36">
                                {activeTestResult.actualResponse}
                              </pre>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="text-[10.5px] font-sans font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Expected Output
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#141a27] border border-slate-800/80 text-emerald-400 space-y-1">
                            <div className="font-bold">HTTP {activeTestResult.expectedStatus}</div>
                            {activeTestResult.expectedResponse && (
                              <pre className="text-slate-300 overflow-x-auto text-[11px] leading-relaxed max-h-36">
                                {activeTestResult.expectedResponse}
                              </pre>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
