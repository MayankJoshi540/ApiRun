'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
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
  Tag,
  Lightbulb,
  Unlock
} from '@/components/ui/GoogleIcon';
import { runChallengeTests, RunTestOutput } from '../utils/challengeRunner';

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
  const { user } = useAuth();
  const [serverUrl, setServerUrl] = useState('http://localhost:8000');

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
  const [activeConsoleTab, setActiveConsoleTab] = useState<'testcase' | 'result' | 'playground'>('testcase');

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

  const executeTests = async (): Promise<RunTestOutput> => {
    try {
      const response = await fetch('/api/run-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          code: editorCodes[selectedEditorLang],
          language: selectedEditorLang,
          timeoutMs: 3000
        })
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Server runner returned HTTP ${response.status}`);
      }

      return await response.json();
    } catch (apiError: any) {
      console.warn('[APIRun] Server VM API unreachable, running fallback evaluation:', apiError);
      return await runChallengeTests({
        challenge,
        code: editorCodes[selectedEditorLang],
        language: selectedEditorLang,
        serverUrl,
        isLocalServerMode: false
      });
    }
  };

  const handleRunTests = async () => {
    if (isRunning) return;
    setIsConsoleCollapsed(false);
    setActiveConsoleTab('result');
    setIsRunning(true);
    setLogs([]);

    setTestResults(prev => prev.map(t => ({ ...t, status: 'RUNNING' })));

    const output = await executeTests();

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

    // Artificial evaluation delay for realistic backend grading feel
    const [output] = await Promise.all([
      executeTests(),
      new Promise(resolve => setTimeout(resolve, 1500))
    ]);

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
      const prevChallenge = challengesList[currentIndex - 1];
      if (!user && prevChallenge.slug !== 'ping-health-api') {
        router.push(`/sign-in?redirect=${encodeURIComponent(`/challenges/${prevChallenge.slug}`)}`);
        return;
      }
      router.push(`/challenges/${prevChallenge.slug}`);
    }
  };
  const handleNavigateNext = () => {
    if (currentIndex >= 0 && currentIndex < challengesList.length - 1) {
      const nextChallenge = challengesList[currentIndex + 1];
      if (!user && nextChallenge.slug !== 'ping-health-api') {
        router.push(`/sign-in?redirect=${encodeURIComponent(`/challenges/${nextChallenge.slug}`)}`);
        return;
      }
      router.push(`/challenges/${nextChallenge.slug}`);
    }
  };
  const handleNavigateRandom = () => {
    if (challengesList.length > 1) {
      const otherChallenges = challengesList.filter(c => c.id !== challenge.id);
      const randomChallenge = otherChallenges[Math.floor(Math.random() * otherChallenges.length)];
      if (!user && randomChallenge.slug !== 'ping-health-api') {
        router.push(`/sign-in?redirect=${encodeURIComponent(`/challenges/${randomChallenge.slug}`)}`);
        return;
      }
      router.push(`/challenges/${randomChallenge.slug}`);
    }
  };

  const isSolved = challenge.status === 'SOLVED';

  return (
    <div className="h-screen w-screen flex flex-col bg-[#08090c] font-sans text-zinc-100 overflow-hidden select-none antialiased">
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

      {/* ── Free Demo Preview Banner (for guests on ping-health-api) ── */}
      {!user && challenge.slug === 'ping-health-api' && (
        <div className="bg-[#12141a] border-b border-zinc-800 px-4 py-2 flex items-center justify-between text-xs text-emerald-400 shrink-0 select-none">
          <div className="flex items-center gap-2">
            <Unlock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-zinc-300">
              <strong className="text-white">Free Demo Access:</strong> You can code and execute test suites for this challenge without signing in.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-zinc-500">Want to save your score and unlock all challenges?</span>
            <Link
              href={`/sign-in?redirect=${encodeURIComponent('/challenges/ping-health-api')}`}
              className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-[0.97] border border-emerald-500/40 rounded-lg text-emerald-300 font-semibold transition-all shadow-xs"
            >
              Sign In / Sign Up
            </Link>
          </div>
        </div>
      )}

      {/* ── Main Split Workbench (Floating Apple Obsidian Cards Layout) ── */}
      <div 
        ref={workbenchRef}
        className="flex-1 flex overflow-hidden p-2.5 gap-0 relative bg-transparent"
      >
        {/* ── LEFT PANEL: Problem Specification Card ── */}
        <div 
          id="tour-workbench-specs"
          style={{ width: `${leftWidthPercent}%` }} 
          className={`h-full flex flex-col bg-[#0e1015] rounded-2xl border border-zinc-800 shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden shrink-0 ${
            (isDraggingHorizontal || isDraggingVertical) ? 'transition-none pointer-events-none select-none' : 'transition-all duration-150 ease-out'
          }`}
        >
          {/* Top Card Header */}
          <div className="h-11 px-4 bg-[#13151b] border-b border-zinc-800/90 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Description</span>
            </div>
          </div>

          {/* Left Card Body (Scrollable Problem Statement) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 select-text scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent text-zinc-200">
            <div className="space-y-4">
              {/* Title + Status Badges */}
              <div className="space-y-3 pb-3.5 border-b border-zinc-800/80">
                <div className="flex items-center justify-between gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {challenge.title}
                  </h1>
                  {isSolved && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full select-none shrink-0 shadow-xs">
                      <span>Solved</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </span>
                  )}
                </div>

                {/* Tag Badges Row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <DifficultyBadge difficulty={challenge.difficulty} size="md" />

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/90 text-zinc-300 text-xs font-medium border border-zinc-700/60">
                    <Tag className="w-3 h-3 text-zinc-400" />
                    <span>{challenge.category}</span>
                  </span>

                  <button 
                    onClick={() => setShowHint(!showHint)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/90 hover:bg-zinc-700 active:scale-[0.97] text-zinc-300 hover:text-white text-xs font-medium cursor-pointer transition-all border border-zinc-700/60"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hint</span>
                  </button>
                </div>

                {showHint && (
                  <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm text-amber-200 leading-relaxed shadow-sm">
                    💡 Focus on handling incoming request parameters, returning valid JSON formats, and matching expected RFC status codes accurately.
                  </div>
                )}
              </div>

              {/* Problem Specification Content */}
              <ProblemSpecRenderer challenge={challenge} />
            </div>
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
            isDraggingHorizontal ? 'bg-emerald-500/20' : 'hover:bg-white/[0.06]'
          }`}
          title="Drag to resize columns"
        >
          <div className={`w-1 h-8 rounded-full transition-all duration-150 ${
            isDraggingHorizontal ? 'bg-emerald-400 scale-y-125 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-zinc-700 group-hover:bg-emerald-400'
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
                isDraggingVertical ? 'bg-emerald-500/20' : 'hover:bg-white/[0.06]'
              }`}
              title="Drag to resize editor and console"
            >
              <div className={`h-1 w-8 rounded-full transition-all duration-150 ${
                isDraggingVertical ? 'bg-emerald-400 scale-x-125 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-zinc-700 group-hover:bg-emerald-400'
              }`} />
            </div>
          )}

          {/* ── Bottom Right: Testcase & Test Result Dock ── */}
          <div 
            id="tour-workbench-console"
            style={{ 
              height: isConsoleCollapsed 
                ? '44px' 
                : `calc(${100 - editorHeightPercent}% - 10px)` 
            }}
            className={`w-full flex flex-col overflow-hidden mt-auto ${
              (isDraggingHorizontal || isDraggingVertical) ? 'transition-none pointer-events-none' : 'transition-all duration-150 ease-out'
            }`}
          >
            <LeetCodeConsoleDock
              challenge={challenge}
              currentCode={editorCodes[selectedEditorLang]}
              currentLanguage={selectedEditorLang}
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
