'use client';

import React, { useState, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2,
  Lock,
  Code2,
  Send,
  Loader2,
  Bookmark
} from '@/components/ui/GoogleIcon';
import { Challenge } from '../types';

interface Props {
  challenge: Challenge;
  selectedLang: 'nodejs' | 'go' | 'python';
  onSelectLang: (lang: 'nodejs' | 'go' | 'python') => void;
  code: string;
  onChangeCode: (newCode: string) => void;
  onRunTests: () => void;
  onSubmitSolution?: () => void;
  isRunning: boolean;
  isSubmitting?: boolean;
}

export const CodeEditorPanel: React.FC<Props> = ({
  challenge,
  selectedLang,
  onSelectLang,
  code,
  onChangeCode,
  onRunTests,
  onSubmitSolution,
  isRunning,
  isSubmitting = false
}) => {
  const editorRef = useRef<any>(null);
  const [copied, setCopied] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const monacoLanguages = {
    nodejs: 'typescript',
    go: 'go',
    python: 'python'
  };

  const fileNames = {
    nodejs: 'server.ts',
    go: 'main.go',
    python: 'main.py'
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Apple macOS / Xcode Dark Obsidian Theme
    monaco.editor.defineTheme('apirun-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'F5F5F7', background: '161618' },
        { token: 'comment', foreground: '86868B', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'FF375F', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: 'BF5AF2' },
        { token: 'string', foreground: '30D158' },
        { token: 'string.escape', foreground: '63E6E2' },
        { token: 'number', foreground: 'FF9F0A' },
        { token: 'type', foreground: '64D2FF', fontStyle: 'bold' },
        { token: 'class', foreground: '64D2FF' },
        { token: 'function', foreground: 'FFD60A' },
        { token: 'variable', foreground: 'F5F5F7' },
        { token: 'variable.parameter', foreground: '70D7FF' },
        { token: 'operator', foreground: 'A1A1A6' },
        { token: 'delimiter', foreground: '86868B' }
      ],
      colors: {
        'editor.background': '#161618',
        'editor.foreground': '#F5F5F7',
        'editor.lineHighlightBackground': '#ffffff08',
        'editor.lineHighlightBorder': '#ffffff0a',
        'editorCursor.foreground': '#30D158',
        'editorWhitespace.foreground': '#2c2c2e',
        'editorIndentGuide.background': '#2c2c2e',
        'editorIndentGuide.activeBackground': '#3a3a3c',
        'editorLineNumber.foreground': '#636366',
        'editorLineNumber.activeForeground': '#30D158',
        'editorGutter.background': '#161618',
        'editor.selectionBackground': '#30D15830',
        'editor.inactiveSelectionBackground': '#30D15818',
        'scrollbarSlider.background': '#ffffff14',
        'scrollbarSlider.hoverBackground': '#ffffff22',
        'scrollbarSlider.activeBackground': '#30D15840',
      }
    });

    monaco.editor.setTheme('apirun-theme');

    if (monaco.languages?.typescript) {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        allowNonTextFiles: true,
        allowJs: true,
        noLib: false,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        noEmit: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      });

      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
        noSuggestionDiagnostics: true,
      });

      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        `declare module 'express';\ndeclare module 'http';\ndeclare module 'crypto';`,
        'node-ambient.d.ts'
      );
    }

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunTests();
    });

    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({
        line: e.position.lineNumber,
        col: e.position.column
      });
    });

    editor.focus();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code to starter template?')) {
      const defaultStarter = challenge.starterCode?.[selectedLang] || '';
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(`apirun_code_${challenge.id}_${selectedLang}`);
        } catch {}
      }
      onChangeCode(defaultStarter);
      if (editorRef.current) {
        editorRef.current.setValue(defaultStarter);
      }
    }
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  return (
    <div className={`h-full w-full rounded-2xl bg-[#1c1c1e]/85 backdrop-blur-2xl border border-white/[0.08] border-t-white/[0.14] flex flex-col overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.35)] ${
      isFullscreen ? 'fixed inset-3 z-50 rounded-2xl' : ''
    }`}>
      {/* ── Top Header: </> Code Tab + Language Switcher + Tools ── */}
      <div className="h-11 px-3.5 bg-[#161618]/70 border-b border-white/[0.06] flex items-center justify-between shrink-0 select-none">
        {/* Left: Code Tab indicator + Language Selector + Auto */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#30d158] bg-[#30d158]/15 border border-[#30d158]/25 px-2.5 py-1 rounded-lg">
            <span className="text-[12px] font-mono font-bold leading-none">&lt;/&gt;</span>
            <span>Code</span>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedLang}
              onChange={(e) => onSelectLang(e.target.value as 'nodejs' | 'go' | 'python')}
              className="bg-white/[0.06] hover:bg-white/[0.10] text-[#f5f5f7] text-xs font-medium px-2.5 py-1 rounded-lg border border-white/[0.08] cursor-pointer outline-none transition-all focus:border-[#30d158]/50"
            >
              <option value="nodejs" className="bg-[#1c1c1e] text-white">TypeScript (Node.js)</option>
              <option value="go" className="bg-[#1c1c1e] text-white">Go 1.22</option>
              <option value="python" className="bg-[#1c1c1e] text-white">Python 3.12 (FastAPI)</option>
            </select>
          </div>

          {/* Auto Saved Status */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#86868b]">
            <Lock className="w-3 h-3 text-[#86868b]" />
            <span>Saved</span>
          </div>
        </div>

        {/* Right Tools: Format, Bookmark, Copy, Reset, Fullscreen */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleFormatCode}
            className="px-2 py-1 rounded-lg hover:bg-white/[0.08] active:scale-[0.95] text-[#86868b] hover:text-[#f5f5f7] transition-all cursor-pointer text-xs font-mono"
            title="Format Code"
          >
            {'{ }'}
          </button>

          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] active:scale-[0.95] text-[#86868b] hover:text-[#f5f5f7] transition-all cursor-pointer"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#30d158]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-1.5 rounded-lg hover:bg-white/[0.08] active:scale-[0.95] transition-all cursor-pointer ${
              isBookmarked ? 'text-[#ff9f0a]' : 'text-[#86868b] hover:text-[#f5f5f7]'
            }`}
            title="Bookmark"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleResetCode}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] active:scale-[0.95] text-[#86868b] hover:text-[#f5f5f7] transition-all cursor-pointer"
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] active:scale-[0.95] text-[#86868b] hover:text-[#f5f5f7] transition-all cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── Monaco Editor Surface (Flex-1) ── */}
      <div className="flex-1 relative overflow-hidden bg-[#161618]">
        <Editor
          height="100%"
          path={fileNames[selectedLang]}
          language={monacoLanguages[selectedLang]}
          value={code}
          theme="apirun-theme"
          onChange={(value) => onChangeCode(value || '')}
          onMount={handleEditorDidMount}
          options={{
            fontFamily: "Consolas, 'Courier New', monospace",
            fontSize: 20,
            lineHeight: 30,
            mouseWheelZoom: true,
            fontLigatures: false,
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: false,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            bracketPairColorization: { enabled: true },
            minimap: { enabled: false },
            folding: true,
            renderLineHighlight: 'line',
            wordWrap: 'off',
            padding: { top: 10, bottom: 10 }
          }}
          loading={
            <div className="flex items-center justify-center h-full gap-2 text-xs font-mono text-[#86868b]">
              <Loader2 className="w-4 h-4 animate-spin text-[#30d158]" />
              <span>Loading Editor...</span>
            </div>
          }
        />
      </div>

      {/* ── Bottom Status Bar with Run & Submit Buttons ── */}
      <div className="h-12 px-3.5 bg-[#161618]/70 border-t border-white/[0.06] flex items-center justify-between shrink-0 select-none text-[11px] text-[#86868b]">
        {/* Left: Cursor position & Shortcut hint */}
        <div className="flex items-center gap-3">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span className="hidden sm:inline text-white/10">|</span>
          <span className="hidden sm:inline text-[#86868b]">
            Press <kbd className="px-1.5 py-0.5 rounded-md bg-white/[0.06] text-[#d1d1d6] font-mono text-[10px] border border-white/[0.1]">Ctrl + Enter</kbd> to Run
          </span>
        </div>

        {/* Right: Run Tests & Submit Solution Buttons */}
        <div className="flex items-center gap-2">
          {/* Run Tests Button */}
          <button
            onClick={onRunTests}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] active:scale-[0.97] text-white border border-white/[0.1] text-xs font-medium transition-all cursor-pointer disabled:opacity-40 shadow-xs"
            title="Run tests against implementation"
          >
            {isRunning ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#30d158]" />
            ) : (
              <Play className="w-3.5 h-3.5 text-[#30d158] fill-current" />
            )}
            <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
          </button>

          {/* Submit Solution Button */}
          {onSubmitSolution && (
            <button
              onClick={onSubmitSolution}
              disabled={isRunning || isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#30d158] hover:bg-[#34c759] active:scale-[0.97] text-black text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 shadow-[0_2px_12px_rgba(48,209,88,0.25)]"
              title="Submit solution for full grading"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
              ) : (
                <Send className="w-3.5 h-3.5 text-black" />
              )}
              <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};