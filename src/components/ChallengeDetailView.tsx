import React, { useState, useEffect } from 'react';
import { Challenge, TestResultItem, TestSuiteSummary } from '../types';
import { ChallengeHeader } from './ChallengeHeader';
import { APIEndpoint } from './APIEndpoint';
import { CodeBlock } from './CodeBlock';
import { TestResultsPanel } from './TestResultsPanel';
import { TerminalLogViewer, LogEntry } from './TerminalLogViewer';
import { SubmissionModal } from './SubmissionModal';
import { MockServerSettingsModal } from './MockServerSettingsModal';
import { CodeEditorPanel } from './CodeEditorPanel';
import { CheckCheck, Code2, Terminal, Layers, FileText } from 'lucide-react';

interface Props {
  challenge: Challenge;
  onBack: () => void;
  onChallengeSolved?: (challengeId: string) => void;
  onNavigateProgress: () => void;
}

export const ChallengeDetailView: React.FC<Props> = ({
  challenge,
  onBack,
  onChallengeSolved,
  onNavigateProgress
}) => {
  const [serverUrl, setServerUrl] = useState('http://localhost:8000');
  const [leftTab, setLeftTab] = useState<'PROBLEM' | 'REQUIREMENTS' | 'STARTER_CODE'>('PROBLEM');
  const [rightTab, setRightTab] = useState<'editor' | 'tests' | 'contract' | 'logs'>('editor');
  const [selectedStarterLang, setSelectedStarterLang] = useState<'nodejs' | 'go' | 'python'>('nodejs');

  // Interactive In-Browser Code State per Language
  const [selectedEditorLang, setSelectedEditorLang] = useState<'nodejs' | 'go' | 'python'>('nodejs');
  
  const getInitialEditorCodes = (c: Challenge) => ({
    nodejs: c.starterCode?.nodejs || `import express, { Request, Response } from 'express';\n\nconst app = express();\napp.use(express.json());\n\n// TODO: Implement endpoints for ${c.title}\n\nexport default app;\n`,
    go: c.starterCode?.go || `package main\n\nimport "net/http"\n\n// TODO: Implement endpoints for ${c.title}\nfunc main() {\n\thttp.ListenAndServe(":8000", nil)\n}\n`,
    python: c.starterCode?.python || `from fastapi import FastAPI\n\napp = FastAPI(title="${c.title}")\n\n# TODO: Implement endpoints for ${c.title}\n`
  });

  const [editorCodes, setEditorCodes] = useState<Record<'nodejs' | 'go' | 'python', string>>(() => getInitialEditorCodes(challenge));

  useEffect(() => {
    setEditorCodes(getInitialEditorCodes(challenge));
  }, [challenge.id]);

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [isServerSettingsOpen, setIsServerSettingsOpen] = useState(false);

  const [testResults, setTestResults] = useState<TestResultItem[]>(() => {
    return challenge.testCases.map(tc => ({
      testId: tc.id,
      name: tc.name,
      category: tc.category,
      status: challenge.status === 'SOLVED' ? 'PASSED' : 'PENDING',
      durationMs: challenge.status === 'SOLVED' ? Math.floor(Math.random() * 15 + 5) : 0,
      isHidden: tc.isHidden,
      endpoint: tc.endpoint,
      method: tc.method,
      expectedStatus: tc.expectedStatus,
      actualStatus: challenge.status === 'SOLVED' ? tc.expectedStatus : undefined,
      requestPayload: tc.requestPayload,
      expectedResponse: tc.expectedResponseSnippet,
      actualResponse: challenge.status === 'SOLVED' ? (tc.expectedResponseSnippet || '{}') : undefined,
      logs: challenge.status === 'SOLVED' ? [`POST ${tc.endpoint} -> HTTP ${tc.expectedStatus}`] : [],
    }));
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);

  const summary: TestSuiteSummary = (() => {
    const total = testResults.length;
    const passed = testResults.filter(r => r.status === 'PASSED').length;
    const failed = testResults.filter(r => r.status === 'FAILED').length;
    const durationMs = testResults.reduce((acc, c) => acc + (c.durationMs || 0), 0);
    const scorePercent = total > 0 ? Math.round((passed / total) * 100) : 0;

    return {
      total,
      passed,
      failed,
      durationMs,
      scorePercent,
      status: isRunning ? 'RUNNING' : passed + failed === total && total > 0 ? 'COMPLETED' : 'IDLE'
    };
  })();

  const handleRunTests = async (viewTests = true) => {
    if (isRunning) return;
    if (viewTests) setRightTab('tests');
    setIsRunning(true);
    setLogs([]);

    const initialLogs: LogEntry[] = [
      { timestamp: new Date().toISOString().slice(11, 19), level: 'INFO', message: `[INFRA] Initializing APIRun In-Browser Engine & Contract Tester` },
      { timestamp: new Date().toISOString().slice(11, 19), level: 'INFO', message: `Compiling ${selectedEditorLang.toUpperCase()} source AST -> sandbox runtime started` },
      { timestamp: new Date().toISOString().slice(11, 19), level: 'INFO', message: `Dispatched test runner against active contract endpoints...` }
    ];
    setLogs(initialLogs);

    for (let i = 0; i < testResults.length; i++) {
      setTestResults(prev =>
        prev.map((t, idx) => idx === i ? { ...t, status: 'RUNNING' } : t)
      );

      await new Promise(r => setTimeout(r, 220 + Math.random() * 140));

      const currentTest = testResults[i];
      const latency = Math.floor(Math.random() * 16 + 5);
      const timestamp = new Date().toISOString().slice(11, 19);

      const shouldPass = challenge.status === 'SOLVED' || i < challenge.testCases.length - 1 || Math.random() > 0.25;

      if (shouldPass) {
        setTestResults(prev =>
          prev.map((t, idx) =>
            idx === i
              ? {
                  ...t,
                  status: 'PASSED',
                  durationMs: latency,
                  actualStatus: currentTest.expectedStatus,
                  actualResponse: currentTest.expectedResponse || JSON.stringify({ status: 'ok' }),
                  logs: [
                    `TEST_EV ${latency}ms [-> ${currentTest.method} ${currentTest.endpoint}]`,
                    `Received status: ${currentTest.expectedStatus} (Expected: ${currentTest.expectedStatus})`,
                    'Body matches required RFC/suite assertions'
                  ]
                }
              : t
          )
        );
        setLogs(prev => [
          ...prev,
          { timestamp, level: 'INFO', message: `✓ Test #${i + 1}: ${currentTest.name} (${latency}ms)` }
        ]);
      } else {
        setTestResults(prev =>
          prev.map((t, idx) =>
            idx === i
              ? {
                  ...t,
                  status: 'FAILED',
                  durationMs: latency,
                  actualStatus: 500,
                  actualResponse: JSON.stringify({ error: 'internal_server_error', message: 'Unhandled exception' }, null, 2),
                  failureReason: `Expected HTTP ${currentTest.expectedStatus}, but server dispatched HTTP 500 Internal Server Error`,
                  logs: [
                    `TEST_EV ${latency}ms [${currentTest.method} ${currentTest.endpoint}] -> HTTP 500`
                  ]
                }
              : t
          )
        );
        setLogs(prev => [
          ...prev,
          { timestamp, level: 'ERROR', message: `✗ Test #${i + 1} FAILED: ${currentTest.name} (method ${currentTest.method} returned 500)` }
        ]);
      }
    }
    setIsRunning(false);
  };

  const handleSubmitSolution = async () => {
    setIsSubmissionModalOpen(true);
    setIsSubmitting(true);
    await handleRunTests(false);
    setIsSubmitting(false);
    if (onChallengeSolved) {
      onChallengeSolved(challenge.id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090c] font-sans">
      <ChallengeHeader
        challenge={challenge}
        onBack={onBack}
        onRunTests={() => handleRunTests(true)}
        onSubmitSolution={handleSubmitSolution}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
        serverUrl={serverUrl}
        onOpenServerSettings={() => setIsServerSettingsOpen(true)}
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Specification Pane */}
          <div className="lg:col-span-5 space-y-4">
            {/* Clean Modern Navigation Tabs */}
            <div className="flex items-center space-x-1 bg-[#12161f] border border-[#262d3a] p-1 rounded-md font-sans text-xs">
              <button
                onClick={() => setLeftTab('PROBLEM')}
                className={`px-3 py-1.5 rounded-md transition-colors flex-1 text-center font-medium ${
                  leftTab === 'PROBLEM'
                    ? 'bg-[#171c26] text-[#e6edf3] border border-[#374151] font-semibold'
                    : 'text-[#8b949e] hover:text-[#e6edf3]'
                }`}
              >
                Problem
              </button>
              <button
                onClick={() => setLeftTab('REQUIREMENTS')}
                className={`px-3 py-1.5 rounded-md transition-colors flex-1 text-center font-medium ${
                  leftTab === 'REQUIREMENTS'
                    ? 'bg-[#171c26] text-[#e6edf3] border border-[#374151] font-semibold'
                    : 'text-[#8b949e] hover:text-[#e6edf3]'
                }`}
              >
                Requirements
              </button>
              <button
                onClick={() => setLeftTab('STARTER_CODE')}
                className={`px-3 py-1.5 rounded-md transition-colors flex-1 text-center font-medium ${
                  leftTab === 'STARTER_CODE'
                    ? 'bg-[#171c26] text-[#e6edf3] border border-[#374151] font-semibold'
                    : 'text-[#8b949e] hover:text-[#e6edf3]'
                }`}
              >
                Templates
              </button>
            </div>

            {leftTab === 'PROBLEM' && (
              <div className="space-y-4 font-sans">
                {/* Overview Section */}
                <div className="p-5 rounded-md bg-[#12161f] border border-[#262d3a] space-y-3">
                  <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-emerald-400">
                    Overview
                  </div>
                  <div className="text-sm text-[#cbd5e1] leading-relaxed font-normal whitespace-pre-line">
                    {challenge.problemStatement}
                  </div>
                </div>

                {/* Expected Response Codes Section */}
                <div className="p-5 rounded-md bg-[#12161f] border border-[#262d3a] space-y-3">
                  <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#8b949e]">
                    Expected Response Codes
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-md bg-[#090b0e] border border-[#262d3a]">
                      <span className="font-mono text-xs text-emerald-400 font-semibold">201 Created</span>
                      <span className="font-sans text-xs text-[#94a3b8]">Successful mutation</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-md bg-[#090b0e] border border-[#262d3a]">
                      <span className="font-mono text-xs text-sky-400 font-semibold">200 OK</span>
                      <span className="font-sans text-xs text-[#94a3b8]">Reads & inspection</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-md bg-[#090b0e] border border-[#262d3a]">
                      <span className="font-mono text-xs text-amber-400 font-semibold">400 Bad Request</span>
                      <span className="font-sans text-xs text-[#94a3b8]">Validation failure & missing fields</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-md bg-[#090b0e] border border-[#262d3a]">
                      <span className="font-mono text-xs text-amber-400 font-semibold">404 Not Found</span>
                      <span className="font-sans text-xs text-[#94a3b8]">Resource missing</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-md bg-[#090b0e] border border-[#262d3a]">
                      <span className="font-mono text-xs text-red-400 font-semibold">409 Conflict</span>
                      <span className="font-sans text-xs text-[#94a3b8]">Uniqueness collision</span>
                    </div>
                  </div>
                </div>

                {/* Constraints Section */}
                <div className="p-5 rounded-md bg-[#12161f] border border-[#262d3a] space-y-2.5">
                  <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#8b949e]">
                    Infrastructure Constraints
                  </div>
                  <ul className="space-y-2 text-xs text-[#cbd5e1] font-sans">
                    {challenge.constraints.map((c, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span className="leading-relaxed">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {leftTab === 'REQUIREMENTS' && (
              <div className="space-y-3 font-sans">
                {challenge.requirements.map((req) => (
                  <div
                    key={req.id}
                    className={`px-4.5 py-4 rounded-md bg-[#12161f] border ${req.isCritical ? 'border-[#262d3a]' : 'border-[#1b202a]'} space-y-1.5`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm text-[#e6edf3] flex items-center space-x-2">
                        <CheckCheck className="w-4 h-4 text-emerald-400" />
                        <span>{req.title}</span>
                      </div>
                      {req.badge && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#171c26] border border-[#272e3a] text-emerald-400 font-medium">
                          {req.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#94a3b8] leading-relaxed font-normal">
                      {req.detail}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {leftTab === 'STARTER_CODE' && challenge.starterCode && (
              <div className="space-y-3 font-sans">
                <div className="flex items-center space-x-1 bg-[#12161f] p-1 rounded-md border border-[#262d3a] text-xs">
                  {(['nodejs', 'go', 'python'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedStarterLang(lang)}
                      className={`px-3 py-1 rounded-md transition-colors font-medium ${
                        selectedStarterLang === lang
                          ? 'bg-[#171c26] text-emerald-400 border border-[#374151] font-semibold'
                          : 'text-[#8b949e] hover:text-[#e6edf3]'
                      }`}
                    >
                      {lang === 'nodejs' ? 'Node.js' : lang === 'go' ? 'Go' : 'Python'}
                    </button>
                  ))}
                </div>

                <CodeBlock
                  code={challenge.starterCode[selectedStarterLang] || ''}
                  language={selectedStarterLang === 'nodejs' ? 'javascript' : selectedStarterLang}
                  filename={selectedStarterLang === 'nodejs' ? 'server.js' : selectedStarterLang === 'go' ? 'main.go' : 'main.py'}
                  showLineNumbers={true}
                />
              </div>
            )}
          </div>

          {/* Right Interactive Coding & Testing Pane */}
          <div className="lg:col-span-7 space-y-4 font-sans">
            {/* Top Workspace Tabs */}
            <div className="flex items-center justify-between bg-[#12161f] border border-[#262d3a] p-1 rounded-md text-xs">
              <div className="flex flex-wrap items-center gap-1">
                <button
                  onClick={() => setRightTab('editor')}
                  className={`px-3 py-1.5 rounded-md transition-colors font-medium flex items-center space-x-1.5 ${
                    rightTab === 'editor'
                      ? 'bg-[#171c26] text-emerald-400 border border-[#374151] font-semibold'
                      : 'text-[#8b949e] hover:text-[#e6edf3]'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Code Editor</span>
                </button>
                <button
                  onClick={() => setRightTab('tests')}
                  className={`px-3 py-1.5 rounded-md transition-colors font-medium flex items-center space-x-1.5 ${
                    rightTab === 'tests'
                      ? 'bg-[#171c26] text-emerald-400 border border-[#374151] font-semibold'
                      : 'text-[#8b949e] hover:text-[#e6edf3]'
                  }`}
                >
                  <span>Test Results</span>
                  <span className="font-mono text-[11px] text-emerald-400/90">({summary.passed}/{summary.total})</span>
                </button>
                <button
                  onClick={() => setRightTab('contract')}
                  className={`px-3 py-1.5 rounded-md transition-colors font-medium flex items-center space-x-1.5 ${
                    rightTab === 'contract'
                      ? 'bg-[#171c26] text-[#e6edf3] border border-[#374151] font-semibold'
                      : 'text-[#8b949e] hover:text-[#e6edf3]'
                  }`}
                >
                  <span>API Contract</span>
                  <span className="font-mono text-[11px] text-[#8b949e]">({challenge.endpoints.length})</span>
                </button>
                <button
                  onClick={() => setRightTab('logs')}
                  className={`px-3 py-1.5 rounded-md transition-colors font-medium flex items-center space-x-1.5 ${
                    rightTab === 'logs'
                      ? 'bg-[#171c26] text-[#e6edf3] border border-[#374151] font-semibold'
                      : 'text-[#8b949e] hover:text-[#e6edf3]'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Wire Logs</span>
                  <span className="font-mono text-[11px] text-[#8b949e]">({logs.length})</span>
                </button>
              </div>
            </div>

            {/* In-Browser Code Editor Tab */}
            {rightTab === 'editor' && (
              <CodeEditorPanel
                challenge={challenge}
                selectedLang={selectedEditorLang}
                onSelectLang={setSelectedEditorLang}
                code={editorCodes[selectedEditorLang]}
                onChangeCode={(newCode) => {
                  setEditorCodes(prev => ({
                    ...prev,
                    [selectedEditorLang]: newCode
                  }));
                }}
                onRunTests={() => handleRunTests(true)}
                isRunning={isRunning}
              />
            )}

            {/* Test Runner Results Tab */}
            {rightTab === 'tests' && (
              <TestResultsPanel
                testResults={testResults}
                summary={summary}
                onRunTests={() => handleRunTests(true)}
                isRunning={isRunning}
                serverUrl={serverUrl}
              />
            )}

            {/* API Contract Inspector Tab */}
            {rightTab === 'contract' && (
              <div className="space-y-3">
                {challenge.endpoints.map((ep) => (
                  <APIEndpoint key={ep.id} endpoint={ep} initiallyExpanded={true} />
                ))}
              </div>
            )}

            {/* Wire Logs Tab */}
            {rightTab === 'logs' && (
              <TerminalLogViewer logs={logs} onClear={() => setLogs([])} />
            )}
          </div>
        </div>
      </div>

      <SubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        challenge={challenge}
        summary={summary}
        results={testResults}
        isSubmitting={isSubmitting}
        onFeedbackProgress={() => {
          setIsSubmissionModalOpen(false);
          onNavigateProgress();
        }}
      />

      <MockServerSettingsModal
        isOpen={isServerSettingsOpen}
        onClose={() => setIsServerSettingsOpen(false)}
        serverUrl={serverUrl}
        onChangeServerUrl={url => setServerUrl(url)}
      />
    </div>
  );
};