'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Challenge, TestResultItem, TestSuiteSummary } from '../types';
import { ChallengeHeader } from './ChallengeHeader';
import { CodeBlock } from './CodeBlock';
import { TerminalLogViewer, LogEntry } from './TerminalLogViewer';
import { SubmissionModal } from './SubmissionModal';
import { MockServerSettingsModal } from './MockServerSettingsModal';
import { CodeEditorPanel } from './CodeEditorPanel';
import { ProblemSpecRenderer } from './ProblemSpecRenderer';
import { LeetCodeConsoleDock } from './LeetCodeConsoleDock';
import { DifficultyBadge } from './DifficultyBadge';
import { 
  CheckCircle2, 
  BookOpen,
  ListChecks,
  FileCode2,
  Tag,
  Lightbulb
} from '@/components/ui/GoogleIcon';
import { runChallengeTests } from '../utils/challengeRunner';

interface Props {
  challenge: Challenge;
  challengesList?: Challenge[];
  onBack: () => void;
  onChallengeSolved?: (challengeId: string, submission?: { code: string; language: string; testsPassed: number }) => void;
  onNavigateProgress: () => void;
}

export const ChallengeDetailView: React.FC<Props> = ({
  challenge,
  challengesList = [],
  onBack,
  onChallengeSolved,
  onNavigateProgress
}) => {
  const router = useRouter();
  const [serverUrl, setServerUrl] = useState('http://localhost:8000');
  const [leftTab, setLeftTab] = useState<'DESCRIPTION' | 'REQUIREMENTS' | 'SCAFFOLD'>('DESCRIPTION');

  // ── 2-Axis Resizable Layout State ──
  const [leftWidthPercent, setLeftWidthPercent] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('apirun_layout_left_width');
        if (saved) return Math.min(75, Math.max(25, parseFloat(saved)));
      } catch {}
    }
    return 44; // Default 44% width for left panel
  });

  const [editorHeightPercent, setEditorHeightPercent] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('apirun_layout_editor_height');
        if (saved) return Math.min(85, Math.max(20, parseFloat(saved)));
      } catch {}
    }
    return 60; // Default 60% height for editor
  });

  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'testcase' | 'result'>('testcase');

  // Dragging active states
  const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false);
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);

  const workbenchRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);


  const [showHint, setShowHint] = useState(false);

  // Preferred language state
  const [selectedEditorLang, setSelectedEditorLang] = useState<'nodejs' | 'go' | 'python'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = localStorage.getItem('apirun_preferred_lang') as 'nodejs' | 'go' | 'python';
        if (savedLang === 'nodejs' || savedLang === 'go' || savedLang === 'python') {
          return savedLang;
        }
      } catch {}
    }
    return 'nodejs';
  });

  const getInitialEditorCodes = (c: Challenge): Record<'nodejs' | 'go' | 'python', string> => {
    const getSavedOrStarter = (lang: 'nodejs' | 'go' | 'python', fallback: string) => {
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem(`apirun_code_${c.id}_${lang}`);
          if (saved && saved.trim().length > 0) return saved;
        } catch {}
      }
      return fallback;
    };

    return {
      nodejs: getSavedOrStarter(
        'nodejs',
        c.starterCode?.nodejs || `import express from 'express';\n\nconst app = express();\napp.use(express.json());\n\n// TODO: Implement endpoints for ${c.title}\n\nexport default app;\n`
      ),
      go: getSavedOrStarter(
        'go',
        c.starterCode?.go || `package main\n\nimport "net/http"\n\n// TODO: Implement endpoints for ${c.title}\nfunc main() {\n\thttp.ListenAndServe(":8000", nil)\n}\n`
      ),
      python: getSavedOrStarter(
        'python',
        c.starterCode?.python || `from fastapi import FastAPI\n\napp = FastAPI(title="${c.title}")\n\n# TODO: Implement endpoints for ${c.title}\n`
      )
    };
  };

  const [editorCodes, setEditorCodes] = useState<Record<'nodejs' | 'go' | 'python', string>>(() => getInitialEditorCodes(challenge));

  useEffect(() => {
    setEditorCodes(getInitialEditorCodes(challenge));
  }, [challenge.id]);

  const handleLanguageChange = (lang: 'nodejs' | 'go' | 'python') => {
    setSelectedEditorLang(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('apirun_preferred_lang', lang);
      } catch {}
    }
  };

  const handleCodeChange = (newCode: string) => {
    setEditorCodes(prev => ({ ...prev, [selectedEditorLang]: newCode }));
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`apirun_code_${challenge.id}_${selectedEditorLang}`, newCode);
      } catch {}
    }
  };

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
      durationMs: challenge.status === 'SOLVED' ? Math.floor(Math.random() * 8 + 4) : 0,
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

  const handleRunTests = async () => {
    if (isRunning) return;
    setIsConsoleCollapsed(false);
    setActiveConsoleTab('result');
    setIsRunning(true);
    setLogs([]);

    setTestResults(prev => prev.map(t => ({ ...t, status: 'RUNNING' })));

    const output = await runChallengeTests({
      challenge,
      code: editorCodes[selectedEditorLang],
      language: selectedEditorLang,
      serverUrl,
      isLocalServerMode: false
    });

    for (let i = 0; i < output.results.length; i++) {
      await new Promise(r => setTimeout(r, 40));
      const resItem = output.results[i];
      setTestResults(prev => prev.map((t, idx) => idx === i ? resItem : t));
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

  // Refs to avoid tearing down listeners on each mousemove
  const leftWidthRef = useRef(leftWidthPercent);
  leftWidthRef.current = leftWidthPercent;
  const editorHeightRef = useRef(editorHeightPercent);
  editorHeightRef.current = editorHeightPercent;
  const rafIdRef = useRef<number | null>(null);

  // ── High-Performance RAF Drag Resizing ──
  useEffect(() => {
    if (!isDraggingHorizontal && !isDraggingVertical) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafIdRef.current !== null) return;

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;

        if (isDraggingHorizontal && workbenchRef.current) {
          const rect = workbenchRef.current.getBoundingClientRect();
          const newLeft = ((e.clientX - rect.left) / rect.width) * 100;
          if (newLeft >= 18 && newLeft <= 82) {
            setLeftWidthPercent(newLeft);
          }
        }

        if (isDraggingVertical && rightPaneRef.current) {
          const rect = rightPaneRef.current.getBoundingClientRect();
          const newEditor = ((e.clientY - rect.top) / rect.height) * 100;
          if (newEditor >= 15 && newEditor <= 85) {
            setEditorHeightPercent(newEditor);
          }
        }
      });
    };

    const handleMouseUp = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      if (isDraggingHorizontal) {
        setIsDraggingHorizontal(false);
        try {
          localStorage.setItem('apirun_layout_left_width', leftWidthRef.current.toString());
        } catch {}
      }

      if (isDraggingVertical) {
        setIsDraggingVertical(false);
        try {
          localStorage.setItem('apirun_layout_editor_height', editorHeightRef.current.toString());
        } catch {}
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingHorizontal, isDraggingVertical]);

  // Navigate to previous/next/random challenges
  const currentIndex = challengesList.findIndex(c => c.id === challenge.id);
  const handleNavigatePrev = () => {
    if (currentIndex > 0) {
      router.push(`/challenges/${challengesList[currentIndex - 1].slug}`);
    }
  };
  const handleNavigateNext = () => {
    if (currentIndex >= 0 && currentIndex < challengesList.length - 1) {
      router.push(`/challenges/${challengesList[currentIndex + 1].slug}`);
    }
  };
  const handleNavigateRandom = () => {
    if (challengesList.length > 1) {
      const otherChallenges = challengesList.filter(c => c.id !== challenge.id);
      const randomChallenge = otherChallenges[Math.floor(Math.random() * otherChallenges.length)];
      router.push(`/challenges/${randomChallenge.slug}`);
    }
  };

  const isSolved = challenge.status === 'SOLVED';

  return (
    <div className="h-screen w-screen flex flex-col bg-[#050708] font-sans text-slate-200 overflow-hidden select-none">
      {/* ── Drag Overlay to prevent mouse events from getting trapped in Monaco ── */}
      {(isDraggingHorizontal || isDraggingVertical) && (
        <div 
          className="fixed inset-0 z-50 select-none"
          style={{ cursor: isDraggingHorizontal ? 'col-resize' : 'row-resize' }}
        />
      )}

      {/* ── Top Navigation Header ── */}
      <ChallengeHeader
        challenge={challenge}
        challengesList={challengesList}
        onBack={onBack}
        onNavigatePrev={handleNavigatePrev}
        onNavigateNext={handleNavigateNext}
        onNavigateRandom={handleNavigateRandom}
        onRunTests={handleRunTests}
        onSubmitSolution={handleSubmitSolution}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
        serverUrl={serverUrl}
        onChangeServerUrl={(url) => setServerUrl(url)}
        onOpenServerSettings={() => setIsServerSettingsOpen(true)}
      />

      {/* ── Main Split Workbench (Floating Cards Layout) ── */}
      <div 
        ref={workbenchRef}
        className="flex-1 flex overflow-hidden p-2 gap-0 relative bg-[#0c0f17]"
      >
        {/* ── LEFT PANEL: Problem Specification Card ── */}
        <div 
          style={{ width: `${leftWidthPercent}%` }} 
          className={`h-full flex flex-col bg-[#0f1420] rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden shrink-0 ${
            (isDraggingHorizontal || isDraggingVertical) ? 'transition-none pointer-events-none select-none' : 'transition-all duration-150 ease-out'
          }`}
        >
          {/* Top Card Tabs */}
          <div className="h-13 px-4 bg-[#141a27] border-b border-slate-800/80 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <button
                onClick={() => setLeftTab('DESCRIPTION')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer ${
                  leftTab === 'DESCRIPTION'
                    ? 'bg-slate-800 text-slate-100 font-semibold border border-slate-700/60 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Description</span>
              </button>

              <button
                onClick={() => setLeftTab('REQUIREMENTS')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer ${
                  leftTab === 'REQUIREMENTS'
                    ? 'bg-slate-800 text-slate-100 font-semibold border border-slate-700/60 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
                }`}
              >
                <ListChecks className="w-4 h-4 text-sky-400" />
                <span>Requirements ({challenge.requirements.length})</span>
              </button>

              <button
                onClick={() => setLeftTab('SCAFFOLD')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer ${
                  leftTab === 'SCAFFOLD'
                    ? 'bg-slate-800 text-slate-100 font-semibold border border-slate-700/60 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
                }`}
              >
                <FileCode2 className="w-4 h-4 text-amber-400" />
                <span>Scaffold</span>
              </button>
            </div>
          </div>

          {/* Left Card Body (Scrollable Problem Statement) */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 select-text">
            {leftTab === 'DESCRIPTION' && (
              <div className="space-y-4">
                {/* Title + Status Badges */}
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                      {challenge.title}
                    </h1>
                    {isSolved && (
                      <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#00b8a3] select-none shrink-0">
                        <span>Solved</span>
                        <CheckCircle2 className="w-4 h-4 text-[#00b8a3]" />
                      </span>
                    )}
                  </div>

                  {/* Tag Badges Row */}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <DifficultyBadge difficulty={challenge.difficulty} />

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#242424] text-zinc-300 text-xs font-medium">
                      <Tag className="w-3 h-3 text-zinc-400" />
                      <span>{challenge.category}</span>
                    </span>

                    <button 
                      onClick={() => setShowHint(!showHint)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#242424] hover:bg-[#303030] text-zinc-300 hover:text-white text-xs font-medium cursor-pointer transition"
                    >
                      <Lightbulb className="w-3 h-3 text-amber-400" />
                      <span>Hint</span>
                    </button>
                  </div>

                  {showHint && (
                    <div className="mt-3.5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-200 leading-relaxed">
                      💡 Focus on handling concurrent edge cases and returning standard HTTP status codes as specified in contract assertions.
                    </div>
                  )}
                </div>

                {/* Problem Specification Content */}
                <ProblemSpecRenderer challenge={challenge} />
              </div>
            )}

            {leftTab === 'REQUIREMENTS' && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-100 tracking-tight">Contract Assertions</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Verify HTTP status codes, headers, and payload boundary conditions.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {challenge.requirements.length} CHECKS
                  </span>
                </div>

                <div className="space-y-2.5">
                  {challenge.requirements.map((req, idx) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl bg-[#141a27] border border-slate-800/80 hover:border-slate-700/80 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                          <span className="w-4.5 h-4.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-[10px] font-mono font-bold">
                            {idx + 1}
                          </span>
                          <span>{req.title}</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-slate-400 font-semibold">
                          {req.badge || 'ASSERTION'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pl-6.5">
                        {req.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {leftTab === 'SCAFFOLD' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-800/80 pb-2.5">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Language Template:</span>
                    <strong className="text-emerald-400 uppercase">{selectedEditorLang}</strong>
                  </span>
                  <span className="text-[11px] text-slate-500">Live Starter</span>
                </div>
                <CodeBlock
                  code={challenge.starterCode?.[selectedEditorLang] || '// No starter code available'}
                  language={selectedEditorLang === 'nodejs' ? 'typescript' : selectedEditorLang}
                  showLineNumbers={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* ── HORIZONTAL RESIZE DIVIDER (Between Left Card & Right Pane) ── */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDraggingHorizontal(true);
          }}
          className={`w-2.5 h-full cursor-col-resize flex items-center justify-center shrink-0 group select-none z-20 ${
            isDraggingHorizontal ? 'bg-emerald-500/30' : 'hover:bg-slate-800/50'
          }`}
          title="Drag to resize columns"
        >
          <div className={`w-1 h-8 rounded-full transition-all duration-100 ${
            isDraggingHorizontal ? 'bg-emerald-400 scale-y-125 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-slate-700 group-hover:bg-emerald-400'
          }`} />
        </div>

        {/* ── RIGHT PANE: Code Editor (Top) + Testcase Dock (Bottom) ── */}
        <div 
          ref={rightPaneRef}
          style={{ width: `calc(${100 - leftWidthPercent}% - 10px)` }}
          className={`h-full flex flex-col overflow-hidden shrink-0 ${
            (isDraggingHorizontal || isDraggingVertical) ? 'transition-none select-none' : 'transition-all duration-150 ease-out'
          }`}
        >
          {/* ── Top Right: Monaco Code Editor Card ── */}
          <div 
            style={{ 
              height: isConsoleCollapsed 
                ? 'calc(100% - 48px)' 
                : `${editorHeightPercent}%` 
            }}
            className={`w-full flex flex-col overflow-hidden ${
              (isDraggingHorizontal || isDraggingVertical) ? 'transition-none pointer-events-none' : 'transition-all duration-150 ease-out'
            }`}
          >
            <CodeEditorPanel
              challenge={challenge}
              selectedLang={selectedEditorLang}
              onSelectLang={handleLanguageChange}
              code={editorCodes[selectedEditorLang]}
              onChangeCode={handleCodeChange}
              onRunTests={handleRunTests}
              onSubmitSolution={handleSubmitSolution}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* ── VERTICAL RESIZE DIVIDER (Between Editor Card & Testcase Dock) ── */}
          {!isConsoleCollapsed && (
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDraggingVertical(true);
              }}
              className={`h-2.5 w-full cursor-row-resize flex items-center justify-center shrink-0 group select-none z-20 ${
                isDraggingVertical ? 'bg-emerald-500/30' : 'hover:bg-slate-800/50'
              }`}
              title="Drag to resize editor and console"
            >
              <div className={`h-1 w-8 rounded-full transition-all duration-100 ${
                isDraggingVertical ? 'bg-emerald-400 scale-x-125 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-slate-700 group-hover:bg-emerald-400'
              }`} />
            </div>
          )}

          {/* ── Bottom Right: Testcase & Test Result Dock ── */}
          <div 
            style={{ 
              height: isConsoleCollapsed 
                ? '40px' 
                : `calc(${100 - editorHeightPercent}% - 10px)` 
            }}
            className={`w-full flex flex-col overflow-hidden mt-auto ${
              (isDraggingHorizontal || isDraggingVertical) ? 'transition-none pointer-events-none' : 'transition-all duration-150 ease-out'
            }`}
          >
            <LeetCodeConsoleDock
              testCases={challenge.testCases}
              testResults={testResults}
              summary={summary}
              isRunning={isRunning}
              activeConsoleTab={activeConsoleTab}
              onSelectTab={(tab) => setActiveConsoleTab(tab)}
              isCollapsed={isConsoleCollapsed}
              onToggleCollapse={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
            />
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