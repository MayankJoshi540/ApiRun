'use client';

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
import { CheckCheck, Code2, Terminal, Layers, FileText } from '@/components/ui/GoogleIcon';
import { runChallengeTests } from '../utils/challengeRunner';

interface Props {
  challenge: Challenge;
  onBack: () => void;
  onChallengeSolved?: (challengeId: string, submission?: { code: string; language: string; testsPassed: number }) => void;
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
      durationMs: challenge.status === 'SOLVED' ? Math.floor(Math.random() * 10 + 4) : 0,
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

    // Step 1: Set all tests to RUNNING
    setTestResults(prev => prev.map(t => ({ ...t, status: 'RUNNING' })));

    // Step 2: Execute actual test runner against user's code
    const output = await runChallengeTests({
      challenge,
      code: editorCodes[selectedEditorLang],
      language: selectedEditorLang,
      serverUrl,
      isLocalServerMode: false
    });

    // Step 3: Progressive status update for real-time visual feedback
    for (let i = 0; i < output.results.length; i++) {
      await new Promise(r => setTimeout(r, 60));
      const resItem = output.results[i];
      setTestResults(prev =>
        prev.map((t, idx) => idx === i ? resItem : t)
      );
    }

    setLogs(output.logs);
    setIsRunning(false);
  };

  const handleSubmitSolution = async () => {
    setIsSubmissionModalOpen(true);
    setIsSubmitting(true);

    const output = await runChallengeTests({
      challenge,
      code: editorCodes[selectedEditorLang],
      language: selectedEditorLang,
      serverUrl,
      isLocalServerMode: false
    });

    setTestResults(output.results);
    setLogs(output.logs);
    setIsSubmitting(false);

    if (output.allPassed && onChallengeSolved) {
      onChallengeSolved(challenge.id, {
        code: editorCodes[selectedEditorLang],
        language: selectedEditorLang,
        testsPassed: output.results.filter(r => r.status === 'PASSED').length
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050708] font-sans text-[#f8fafc]">
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
            <div className="flex items-center space-x-1 bg-[#090d14] border border-white/[0.08] p-1 rounded-xl font-sans text-xs">
              <button
                onClick={() => setLeftTab('PROBLEM')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex-1 text-center font-medium ${
                  leftTab === 'PROBLEM'
                    ? 'bg-white/[0.1] text-white font-semibold'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                Problem Spec
              </button>
              <button
                onClick={() => setLeftTab('REQUIREMENTS')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex-1 text-center font-medium ${
                  leftTab === 'REQUIREMENTS'
                    ? 'bg-white/[0.1] text-white font-semibold'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                Requirements ({challenge.requirements.length})
              </button>
              <button
                onClick={() => setLeftTab('STARTER_CODE')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex-1 text-center font-medium ${
                  leftTab === 'STARTER_CODE'
                    ? 'bg-white/[0.1] text-white font-semibold'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                Starter Scaffold
              </button>
            </div>

            {/* Left Content Switcher */}
            <div className="rounded-xl border border-white/[0.08] bg-[#090d14] p-5 space-y-5 text-sm">
              {leftTab === 'PROBLEM' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-white mb-2">
                      Overview &amp; Problem Statement
                    </h2>
                    <div className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-line">
                      {challenge.problemStatement}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#64748b] mb-2 font-bold">
                      SYSTEM CONSTRAINTS &amp; SLAS
                    </h3>
                    <ul className="space-y-1.5 text-xs text-[#94a3b8]">
                      {challenge.constraints.map((c, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-[#10b981] font-mono mt-0.5">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#64748b] mb-2 font-bold">
                      HTTP CONTRACT ENDPOINTS
                    </h3>
                    <div className="space-y-3">
                      {challenge.endpoints.map(ep => (
                        <APIEndpoint key={ep.id} endpoint={ep} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {leftTab === 'REQUIREMENTS' && (
                <div className="space-y-3">
                  <div className="text-xs text-[#94a3b8]">
                    Verify every critical contract rule and boundary condition:
                  </div>
                  {challenge.requirements.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-lg bg-black/30 border border-white/[0.06] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center space-x-2">
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{req.title}</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[#94a3b8]">
                          {req.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#94a3b8] leading-relaxed">
                        {req.detail}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {leftTab === 'STARTER_CODE' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b border-white/[0.06] pb-2 text-xs">
                    {(['nodejs', 'go', 'python'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => setSelectedStarterLang(lang)}
                        className={`px-3 py-1 rounded font-mono uppercase transition-colors ${
                          selectedStarterLang === lang
                            ? 'bg-white/[0.1] text-[#10b981] font-bold'
                            : 'text-[#94a3b8] hover:text-white'
                        }`}
                      >
                        {lang === 'nodejs' ? 'TypeScript/Node' : lang}
                      </button>
                    ))}
                  </div>
                  <CodeBlock
                    code={challenge.starterCode?.[selectedStarterLang] || '// No starter code available'}
                    language={selectedStarterLang === 'nodejs' ? 'typescript' : selectedStarterLang}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Editor & Test Execution Pane */}
          <div className="lg:col-span-7 space-y-4 flex flex-col">
            {/* Right Pane Tab Bar */}
            <div className="flex items-center justify-between bg-[#090d14] border border-white/[0.08] p-1 rounded-xl text-xs font-sans">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setRightTab('editor')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    rightTab === 'editor'
                      ? 'bg-white/[0.1] text-white font-semibold'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>In-Browser Editor</span>
                </button>
                <button
                  onClick={() => setRightTab('tests')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    rightTab === 'tests'
                      ? 'bg-white/[0.1] text-white font-semibold'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Test Results ({summary.passed}/{summary.total})</span>
                </button>
                <button
                  onClick={() => setRightTab('logs')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    rightTab === 'logs'
                      ? 'bg-white/[0.1] text-white font-semibold'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Engine Logs ({logs.length})</span>
                </button>
              </div>

              {/* Language Selector in Editor */}
              {rightTab === 'editor' && (
                <div className="flex items-center space-x-1 pr-1 font-mono text-[11px]">
                  {(['nodejs', 'python', 'go'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setSelectedEditorLang(lang)}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        selectedEditorLang === lang
                          ? 'bg-[#10b981]/15 text-[#10b981] font-bold'
                          : 'text-[#64748b] hover:text-white'
                      }`}
                    >
                      {lang === 'nodejs' ? 'TS' : lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Pane Body */}
            <div className="flex-1 flex flex-col min-h-[500px]">
              {rightTab === 'editor' && (
                <CodeEditorPanel
                  challenge={challenge}
                  selectedLang={selectedEditorLang}
                  onSelectLang={setSelectedEditorLang}
                  code={editorCodes[selectedEditorLang]}
                  onChangeCode={(val) => {
                    setEditorCodes(prev => ({
                      ...prev,
                      [selectedEditorLang]: val
                    }));
                  }}
                  onRunTests={() => handleRunTests(true)}
                  isRunning={isRunning}
                />
              )}

              {rightTab === 'tests' && (
                <TestResultsPanel
                  results={testResults}
                  summary={summary}
                  onRerun={() => handleRunTests(true)}
                  isRunning={isRunning}
                />
              )}

              {rightTab === 'logs' && (
                <div className="h-full rounded-xl overflow-hidden border border-white/[0.08] bg-[#090d14]">
                  <TerminalLogViewer logs={logs} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      <SubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        challenge={challenge}
        summary={summary}
        results={testResults}
        isSubmitting={isSubmitting}
        onFeedbackProgress={onNavigateProgress}
      />

      {/* Server Settings Modal */}
      <MockServerSettingsModal
        isOpen={isServerSettingsOpen}
        onClose={() => setIsServerSettingsOpen(false)}
        serverUrl={serverUrl}
        onChangeServerUrl={(url) => setServerUrl(url)}
      />
    </div>
  );
};