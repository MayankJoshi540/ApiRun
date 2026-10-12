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
    <div className="h-full w-full rounded-2xl bg-[#1c1c1e]/85 backdrop-blur-2xl border border-white/[0.08] border-t-white/[0.14] flex flex-col overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
      {/* ── Console Header (Tabs + Toggle) ── */}
      <div className="h-11 px-4 bg-[#161618]/70 border-b border-white/[0.06] flex items-center justify-between shrink-0 select-none text-sm">
        {/* Tabs: ☑ Testcase | >_ Test Result */}
        <div className="flex items-center gap-2 font-medium">
          <button
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              onSelectTab('testcase');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer active:scale-[0.97] text-sm ${
              activeConsoleTab === 'testcase' && !isCollapsed
                ? 'bg-white/[0.12] text-white font-semibold border border-white/[0.1] shadow-xs'
                : 'text-[#86868b] hover:text-[#f5f5f7] hover:bg-white/[0.06]'
            }`}
          >
            <span className="text-[#30d158] font-bold text-sm">☑</span>
            <span>Testcase</span>
          </button>

          <button
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              onSelectTab('result');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer active:scale-[0.97] text-sm ${
              activeConsoleTab === 'result' && !isCollapsed
                ? 'bg-white/[0.12] text-white font-semibold border border-white/[0.1] shadow-xs'
                : 'text-[#86868b] hover:text-[#f5f5f7] hover:bg-white/[0.06]'
            }`}
          >
            <Terminal className="w-4 h-4 text-[#30d158]" />
            <span>Test Result</span>
            {hasRun && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold border ${
                allPassed 
                  ? 'bg-[#30d158]/15 text-[#30d158] border-[#30d158]/30' 
                  : 'bg-[#ff453a]/15 text-[#ff453a] border-[#ff453a]/30'
              }`}>
                {summary.passed}/{summary.total}
              </span>
            )}
          </button>
        </div>

        {/* Right: Collapse / Expand Button */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-[#86868b] hover:text-[#f5f5f7] hover:bg-white/[0.08] active:scale-[0.95] transition-all cursor-pointer"
          title={isCollapsed ? 'Expand Console' : 'Collapse Console'}
        >
          {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Console Body (When Not Collapsed) ── */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#161618] text-sm font-sans text-[#d1d1d6] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {/* TAB 1: TESTCASE SPECIFICATION */}
          {activeConsoleTab === 'testcase' && (
            <div className="space-y-4">
              {/* Test Case Selection Chips */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {testCases.map((tc, idx) => (
                  <button
                    key={tc.id || idx}
                    onClick={() => setSelectedCaseIdx(idx)}
                    className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer border active:scale-[0.97] ${
                      selectedCaseIdx === idx
                        ? 'bg-white/[0.12] text-white font-semibold border-white/[0.14] shadow-xs'
                        : 'bg-white/[0.04] text-[#86868b] border-white/[0.06] hover:bg-white/[0.08] hover:text-[#f5f5f7]'
                    }`}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>

              {/* Case Details */}
              {activeTestCase && (
                <div className="space-y-3.5 text-sm">
                  <div>
                    <div className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1.5 font-mono">
                      Target Endpoint
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono text-sm shadow-xs">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30">
                        {activeTestCase.method}
                      </span>
                      <span className="text-[#f5f5f7] font-semibold">{activeTestCase.endpoint}</span>
                    </div>
                  </div>

                  {activeTestCase.requestPayload && (
                    <div>
                      <div className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1.5 font-mono">
                        Payload
                      </div>
                      <pre className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono text-[#f5f5f7] overflow-x-auto text-[13px] sm:text-sm leading-relaxed">
                        {activeTestCase.requestPayload}
                      </pre>
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1.5 font-mono">
                      Expected Response Status
                    </div>
                    <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-[#30d158]/30 font-mono text-sm shadow-xs">
                      <span className="text-[#86868b] font-semibold text-xs">HTTP</span>
                      <span className="text-[#30d158] font-bold text-sm">{activeTestCase.expectedStatus}</span>
                      <span className="text-[#a1a1a6] text-xs font-sans font-medium">
                        {activeTestCase.expectedStatus === 200 ? 'OK' : activeTestCase.expectedStatus === 201 ? 'Created' : activeTestCase.expectedStatus === 204 ? 'No Content' : activeTestCase.expectedStatus === 400 ? 'Bad Request' : activeTestCase.expectedStatus === 401 ? 'Unauthorized' : activeTestCase.expectedStatus === 404 ? 'Not Found' : activeTestCase.expectedStatus === 429 ? 'Too Many Requests' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TEST RESULT OUTPUT */}
          {activeConsoleTab === 'result' && (
            <div className="space-y-4">
              {isRunning ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2.5 text-[#86868b]">
                  <Loader2 className="w-6 h-6 animate-spin text-[#30d158]" />
                  <span className="text-sm font-medium">Running assertion tests against your server...</span>
                </div>
              ) : !hasRun ? (
                <div className="text-center py-8 text-[#86868b] space-y-1.5">
                  <p className="text-sm font-medium text-[#d1d1d6]">No tests executed yet.</p>
                  <p className="text-xs text-[#86868b]">Click &ldquo;Run Tests&rdquo; to evaluate your API against test assertions.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <span className={`text-base font-semibold flex items-center gap-2 ${allPassed ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                        {allPassed ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-[#30d158]" />
                            <span>Passed All Checks</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-[#ff453a]" />
                            <span>Assertion Failed</span>
                          </>
                        )}
                      </span>
                      <span className="text-xs text-[#86868b] font-mono">
                        Latency: {summary.durationMs || 10} ms
                      </span>
                    </div>

                    <div className="text-sm font-mono">
                      <span className="text-[#30d158] font-bold">{summary.passed}</span> / <span className="text-[#86868b]">{summary.total} passed</span>
                    </div>
                  </div>

                  {/* Case Selectors with Pass/Fail marks */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {testResults.map((tr, idx) => (
                      <button
                        key={tr.testId || idx}
                        onClick={() => setSelectedCaseIdx(idx)}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer border active:scale-[0.97] ${
                          selectedCaseIdx === idx
                            ? 'bg-white/[0.12] text-white font-semibold border-white/[0.14] shadow-xs'
                            : 'bg-white/[0.04] text-[#86868b] border-white/[0.06] hover:bg-white/[0.08] hover:text-[#f5f5f7]'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${tr.status === 'PASSED' ? 'bg-[#30d158]' : 'bg-[#ff453a]'}`} />
                        <span>Case {idx + 1}</span>
                      </button>
                    ))}
                  </div>

                  {/* Selected Result Diff */}
                  {activeTestResult && (
                    <div className="space-y-3.5 font-mono text-[13px]">
                      {activeTestResult.failureReason && (
                        <div className="p-3.5 rounded-xl bg-[#ff453a]/10 border border-[#ff453a]/20 text-[#ff453a] shadow-xs">
                          <div className="text-xs font-bold uppercase tracking-wider text-[#ff453a] mb-1">Failure Reason</div>
                          <div className="text-[13px] sm:text-sm leading-relaxed">{activeTestResult.failureReason}</div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {/* Actual Output */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-sans font-semibold text-[#86868b] uppercase tracking-wider">
                              Actual Output
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
                              activeTestResult.status === 'PASSED'
                                ? 'text-[#30d158] bg-[#30d158]/10 border-[#30d158]/30'
                                : 'text-[#ff453a] bg-[#ff453a]/10 border-[#ff453a]/30'
                            }`}>
                              HTTP {activeTestResult.actualStatus || '--'}
                            </span>
                          </div>
                          <div className={`p-3 rounded-xl bg-white/[0.03] border ${
                            activeTestResult.status === 'PASSED' ? 'border-white/[0.06]' : 'border-[#ff453a]/30'
                          } min-h-[52px]`}>
                            {activeTestResult.actualResponse ? (
                              <pre className={`overflow-x-auto text-[13px] leading-relaxed max-h-40 font-mono ${
                                activeTestResult.status === 'PASSED' ? 'text-[#d1d1d6]' : 'text-[#ff453a]'
                              }`}>
                                {activeTestResult.actualResponse}
                              </pre>
                            ) : (
                              <div className="text-[#86868b] text-xs italic">No response body returned</div>
                            )}
                          </div>
                        </div>

                        {/* Expected Output */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-sans font-semibold text-[#86868b] uppercase tracking-wider">
                              Expected Output
                            </span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold text-[#30d158] bg-[#30d158]/10 border border-[#30d158]/30">
                              HTTP {activeTestResult.expectedStatus}
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] min-h-[52px]">
                            {activeTestResult.expectedResponse ? (
                              <pre className="text-[#d1d1d6] overflow-x-auto text-[13px] leading-relaxed max-h-40 font-mono">
                                {activeTestResult.expectedResponse}
                              </pre>
                            ) : (
                              <div className="text-[#86868b] text-xs italic">No response body expected</div>
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
