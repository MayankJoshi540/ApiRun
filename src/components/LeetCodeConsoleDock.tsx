'use client';

import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Zap
} from '@/components/ui/GoogleIcon';
import { Challenge, TestCase, TestResultItem, TestSuiteSummary } from '../types';
import { ApiPlaygroundPanel } from './ApiPlaygroundPanel';

interface Props {
  challenge: Challenge;
  currentCode: string;
  currentLanguage: 'nodejs' | 'go' | 'python';
  testCases: TestCase[];
  testResults: TestResultItem[];
  summary: TestSuiteSummary;
  isRunning: boolean;
  activeConsoleTab: 'testcase' | 'result' | 'playground';
  onSelectTab: (tab: 'testcase' | 'result' | 'playground') => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const LeetCodeConsoleDock: React.FC<Props> = ({
  challenge,
  currentCode,
  currentLanguage,
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
    <div className="h-full w-full rounded-2xl bg-[#0e1015] border border-zinc-800 flex flex-col overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
      {/* ── Console Header (Tabs + Toggle) ── */}
      <div className="h-11 px-3 bg-[#13151b] border-b border-zinc-800/90 flex items-center justify-between shrink-0 select-none text-xs">
        {/* Tabs: ☑ Testcase | >_ Test Result | ⚡ API Playground */}
        <div className="flex items-center gap-1.5 font-medium">
          <button
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              onSelectTab('testcase');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer active:scale-[0.97] ${
              activeConsoleTab === 'testcase' && !isCollapsed
                ? 'bg-zinc-800 text-white font-semibold border border-zinc-700 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <span className="text-emerald-400 font-bold">☑</span>
            <span>Testcases</span>
          </button>

          <button
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              onSelectTab('result');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer active:scale-[0.97] ${
              activeConsoleTab === 'result' && !isCollapsed
                ? 'bg-zinc-800 text-white font-semibold border border-zinc-700 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Test Result</span>
            {hasRun && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold border ${
                allPassed 
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}>
                {summary.passed}/{summary.total}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              if (isCollapsed) onToggleCollapse();
              onSelectTab('playground');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer active:scale-[0.97] ${
              activeConsoleTab === 'playground' && !isCollapsed
                ? 'bg-zinc-800 text-white font-semibold border border-zinc-700 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>API Playground</span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-emerald-500/15 text-emerald-400 rounded border border-emerald-500/30">
              TRY IT
            </span>
          </button>
        </div>

        {/* Right: Collapse / Expand Button */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 active:scale-[0.95] transition-all cursor-pointer"
          title={isCollapsed ? 'Expand Console' : 'Collapse Console'}
        >
          {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Console Body (When Not Collapsed) ── */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#0e1015] text-sm font-sans text-zinc-200 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {/* TAB 1: TESTCASE SPECIFICATION */}
          {activeConsoleTab === 'testcase' && (
            <div className="space-y-4">
              {/* Test Case Selection Chips */}
              <div className="flex items-center gap-2 flex-wrap">
                {testCases.map((tc, idx) => (
                  <button
                    key={tc.id || idx}
                    onClick={() => setSelectedCaseIdx(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border active:scale-[0.97] ${
                      selectedCaseIdx === idx
                        ? 'bg-zinc-800 text-white font-semibold border-zinc-700 shadow-xs'
                        : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
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
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 font-mono">
                      Target Endpoint
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#14161c] border border-zinc-800 font-mono text-sm shadow-xs">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {activeTestCase.method}
                      </span>
                      <span className="text-zinc-100 font-semibold">{activeTestCase.endpoint}</span>
                    </div>
                  </div>

                  {activeTestCase.requestPayload && (
                    <div>
                      <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 font-mono">
                        Payload
                      </div>
                      <pre className="p-3 rounded-xl bg-[#14161c] border border-zinc-800 font-mono text-zinc-200 overflow-x-auto text-[13px] leading-relaxed">
                        {activeTestCase.requestPayload}
                      </pre>
                    </div>
                  )}

                  <div>
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 font-mono">
                      Expected Response Status
                    </div>
                    <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#14161c] border border-emerald-500/30 font-mono text-sm shadow-xs">
                      <span className="text-zinc-400 font-semibold text-xs">HTTP</span>
                      <span className="text-emerald-400 font-bold text-sm">{activeTestCase.expectedStatus}</span>
                      <span className="text-zinc-400 text-xs font-sans font-medium">
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
                <div className="flex flex-col items-center justify-center py-8 gap-2.5 text-zinc-400">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                  <span className="text-sm font-medium">Running assertion tests in server sandbox...</span>
                </div>
              ) : !hasRun ? (
                <div className="text-center py-8 text-zinc-400 space-y-1.5">
                  <p className="text-sm font-medium text-zinc-300">No tests executed yet.</p>
                  <p className="text-xs text-zinc-500">Click &ldquo;Run Tests&rdquo; to evaluate your API against test assertions.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                      <span className={`text-base font-semibold flex items-center gap-2 ${allPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {allPassed ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span>Passed All Checks</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-rose-400" />
                            <span>Assertion Failed</span>
                          </>
                        )}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">
                        Latency: {summary.durationMs || 10} ms
                      </span>
                    </div>

                    <div className="text-sm font-mono">
                      <span className="text-emerald-400 font-bold">{summary.passed}</span> / <span className="text-zinc-400">{summary.total} passed</span>
                    </div>
                  </div>

                  {/* Case Selectors with Pass/Fail marks */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {testResults.map((tr, idx) => (
                      <button
                        key={tr.testId || idx}
                        onClick={() => setSelectedCaseIdx(idx)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border active:scale-[0.97] ${
                          selectedCaseIdx === idx
                            ? 'bg-zinc-800 text-white font-semibold border-zinc-700 shadow-xs'
                            : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${tr.status === 'PASSED' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span>Case {idx + 1}</span>
                      </button>
                    ))}
                  </div>

                  {/* Selected Result Diff */}
                  {activeTestResult && (
                    <div className="space-y-3.5 font-mono text-[13px]">
                      {activeTestResult.failureReason && (
                        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-xs">
                          <div className="text-xs font-bold uppercase tracking-wider mb-1">Failure Reason</div>
                          <div className="text-xs leading-relaxed">{activeTestResult.failureReason}</div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {/* Actual Output */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-sans font-semibold text-zinc-400 uppercase tracking-wider">
                              Actual Output
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-bold border ${
                              activeTestResult.status === 'PASSED'
                                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                                : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                            }`}>
                              HTTP {activeTestResult.actualStatus || '--'}
                            </span>
                          </div>
                          <div className={`p-3 rounded-xl bg-[#14161c] border ${
                            activeTestResult.status === 'PASSED' ? 'border-zinc-800' : 'border-rose-500/30'
                          } min-h-[52px]`}>
                            {activeTestResult.actualResponse ? (
                              <pre className={`overflow-x-auto text-[13px] leading-relaxed max-h-40 font-mono ${
                                activeTestResult.status === 'PASSED' ? 'text-zinc-200' : 'text-rose-400'
                              }`}>
                                {activeTestResult.actualResponse}
                              </pre>
                            ) : (
                              <div className="text-zinc-500 text-xs italic">No response body returned</div>
                            )}
                          </div>
                        </div>

                        {/* Expected Output */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-sans font-semibold text-zinc-400 uppercase tracking-wider">
                              Expected Output
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                              HTTP {activeTestResult.expectedStatus}
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-[#14161c] border border-zinc-800 min-h-[52px]">
                            {activeTestResult.expectedResponse ? (
                              <pre className="text-zinc-200 overflow-x-auto text-[13px] leading-relaxed max-h-40 font-mono">
                                {activeTestResult.expectedResponse}
                              </pre>
                            ) : (
                              <div className="text-zinc-500 text-xs italic">No response body expected</div>
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

          {/* TAB 3: INTERACTIVE API PLAYGROUND (SWAGGER / POSTMAN STYLE) */}
          {activeConsoleTab === 'playground' && (
            <ApiPlaygroundPanel
              challenge={challenge}
              currentCode={currentCode}
              currentLanguage={currentLanguage}
            />
          )}
        </div>
      )}
    </div>
  );
};
