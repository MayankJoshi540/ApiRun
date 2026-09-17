'use client';

import React, { useState, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  FileCode, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  Terminal,
  Settings2
} from '@/components/ui/GoogleIcon';
import { Challenge } from '../types';

interface Props {
  challenge: Challenge;
  selectedLang: 'nodejs' | 'go' | 'python';
  onSelectLang: (lang: 'nodejs' | 'go' | 'python') => void;
  code: string;
  onChangeCode: (newCode: string) => void;
  onRunTests: () => void;
  isRunning: boolean;
}

export const CodeEditorPanel: React.FC<Props> = ({
  challenge,
  selectedLang,
  onSelectLang,
  code,
  onChangeCode,
  onRunTests,
  isRunning
}) => {
  const editorRef = useRef<any>(null);
  const [copied, setCopied] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [lineCount, setLineCount] = useState(() => code.split('\n').length);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);

  // Map language to Monaco language identifier
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

  const languageBadges = {
    nodejs: 'TypeScript / Node.js 20',
    go: 'Go 1.22',
    python: 'Python 3.12 (FastAPI)'
  };

  // Configure Monaco Editor Theme and Keybindings on mount
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define Custom Dark VS Code Theme with emerald accents
    monaco.editor.defineTheme('apirun-vscode-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'E2E8F0', background: '07080B' },
        { token: 'comment', foreground: '64748B', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'F43F5E', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: 'C084FC' },
        { token: 'string', foreground: '34D399' },
        { token: 'string.escape', foreground: '6EE7B7' },
        { token: 'number', foreground: 'FB923C' },
        { token: 'type', foreground: '38BDF8', fontStyle: 'bold' },
        { token: 'class', foreground: '38BDF8' },
        { token: 'function', foreground: 'FBBF24' },
        { token: 'variable', foreground: 'E2E8F0' },
        { token: 'variable.parameter', foreground: '93C5FD' },
        { token: 'operator', foreground: '94A3B8' },
        { token: 'delimiter', foreground: '94A3B8' },
        { token: 'tag', foreground: 'F43F5E' },
        { token: 'attribute.name', foreground: 'FBBF24' },
        { token: 'attribute.value', foreground: '34D399' }
      ],
      colors: {
        'editor.background': '#07080B',
        'editor.foreground': '#E2E8F0',
        'editor.lineHighlightBackground': '#12161F80',
        'editor.lineHighlightBorder': '#1B202A',
        'editorCursor.foreground': '#34D399',
        'editorWhitespace.foreground': '#262D3A',
        'editorIndentGuide.background': '#1B202A',
        'editorIndentGuide.activeBackground': '#374151',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#34D399',
        'editorGutter.background': '#07080B',
        'editor.selectionBackground': '#10B98133',
        'editor.inactiveSelectionBackground': '#10B9811A',
        'editorBracketMatch.background': '#10B9812A',
        'editorBracketMatch.border': '#10B98180',
        'scrollbarSlider.background': '#1E243080',
        'scrollbarSlider.hoverBackground': '#334155',
        'scrollbarSlider.activeBackground': '#10B98160',
        'minimap.background': '#07080B'
      }
    });

    monaco.editor.setTheme('apirun-vscode-dark');

    // Configure Monaco TypeScript & JavaScript Compiler Options and Diagnostics
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

      // Disable false-positive module resolution errors (e.g. 'Cannot find module express') in browser
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
        noSuggestionDiagnostics: true,
      });

      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
        noSuggestionDiagnostics: true,
      });

      // Provide ambient declaration for express/node so autocomplete stays smart
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        `declare module 'express';
declare module 'http';
declare module 'crypto';
declare module 'fs';
declare module 'path';`,
        'node-ambient.d.ts'
      );
    }

    // Bind Ctrl+Enter / Cmd+Enter to Run Tests
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunTests();
    });

    // Track Cursor position line and column
    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({
        line: e.position.lineNumber,
        col: e.position.column
      });
    });

    // Track Model content changes
    editor.onDidChangeModelContent(() => {
      const model = editor.getModel();
      if (model) {
        setLineCount(model.getLineCount());
      }
    });

    // Auto-focus the editor
    editor.focus();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code to the original challenge template?')) {
      const defaultStarter = challenge.starterCode?.[selectedLang] || '';
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
    <div className={`rounded-lg border border-[#262d3a] bg-[#07080b] overflow-hidden flex flex-col shadow-2xl transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : 'h-[680px]'
    }`}>
      {/* Top VS Code Tab & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3.5 py-2 bg-[#0c0e14] border-b border-[#262d3a] gap-2 select-none">
        {/* Left: Language Switcher & File Tab */}
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <div className="flex items-center space-x-1 bg-[#050608] p-0.5 rounded border border-[#262d3a] font-mono text-xs">
            {(['nodejs', 'go', 'python'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => onSelectLang(lang)}
                className={`px-2.5 py-1 rounded transition-colors text-[11px] font-medium ${
                  selectedLang === lang
                    ? 'bg-[#171c26] text-emerald-400 font-semibold border border-[#374151]'
                    : 'text-[#8b949e] hover:text-[#e6edf3]'
                }`}
              >
                {lang === 'nodejs' ? 'TypeScript' : lang === 'go' ? 'Go' : 'Python'}
              </button>
            ))}
          </div>

          {/* VS Code Style File Tab */}
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-[#12161f] border border-[#262d3a] border-b-0 rounded-t text-xs font-mono text-[#e6edf3]">
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">{fileNames[selectedLang]}</span>
          </div>
        </div>

        {/* Right: Quick Actions (Format, Copy, Reset, Minimap, Fullscreen, Run Tests) */}
        <div className="flex items-center space-x-1.5 font-mono text-xs">
          <button
            onClick={handleFormatCode}
            className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded bg-[#12161f] hover:bg-[#171c26] text-[#8b949e] hover:text-[#e6edf3] border border-[#262d3a] transition-colors"
            title="Format Document"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="text-[11px]">Format</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#12161f] hover:bg-[#171c26] text-[#8b949e] hover:text-[#e6edf3] border border-[#262d3a] transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleResetCode}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#12161f] hover:bg-[#171c26] text-[#8b949e] hover:text-[#e6edf3] border border-[#262d3a] transition-colors"
            title="Reset to starter template"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[11px]">Reset</span>
          </button>

          <button
            onClick={() => setShowMinimap(!showMinimap)}
            className={`hidden md:flex items-center px-2 py-1 rounded border transition-colors ${
              showMinimap ? 'bg-[#171c26] text-emerald-400 border-[#374151]' : 'bg-[#12161f] text-[#8b949e] border-[#262d3a]'
            }`}
            title="Toggle Minimap"
          >
            <span className="text-[10px]">MAP</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="hidden sm:flex items-center p-1.5 rounded bg-[#12161f] hover:bg-[#171c26] text-[#8b949e] hover:text-[#e6edf3] border border-[#262d3a] transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Primary Action: Run Tests */}
          <button
            onClick={onRunTests}
            disabled={isRunning}
            className="flex items-center space-x-1.5 px-3.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-medium font-sans text-xs transition-all disabled:opacity-50 active:scale-[0.98]"
            title="Run test suite against this code (Ctrl+Enter)"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isRunning ? 'Testing...' : 'Run Tests'}</span>
          </button>
        </div>
      </div>

      {/* Main Monaco VS Code Editor Surface */}
      <div className="flex-1 relative overflow-hidden bg-[#07080b]">
        <Editor
          height="100%"
          path={fileNames[selectedLang]}
          language={monacoLanguages[selectedLang]}
          value={code}
          theme="apirun-vscode-dark"
          onChange={(value) => onChangeCode(value || '')}
          onMount={handleEditorDidMount}
          options={{
            fontFamily: "'Fira Code', 'Cascadia Code', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
            fontSize: 13,
            lineHeight: 22,
            fontLigatures: true,
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: false,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            bracketPairColorization: {
              enabled: true
            },
            guides: {
              bracketPairs: true,
              indentation: true
            },
            minimap: {
              enabled: showMinimap,
              maxColumn: 60,
              renderCharacters: false
            },
            folding: true,
            foldingHighlight: true,
            renderLineHighlight: 'all',
            suggestOnTriggerCharacters: true,
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true
            },
            parameterHints: {
              enabled: true
            },
            wordWrap: 'off',
            padding: {
              top: 12,
              bottom: 12
            }
          }}
          loading={
            <div className="flex items-center justify-center h-full space-x-2 text-xs font-mono text-[#8b949e]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Loading VS Code Engine...</span>
            </div>
          }
        />
      </div>

      {/* VS Code Style Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#0c0e14] border-t border-[#262d3a] font-mono text-[11px] text-[#8b949e] select-none">
        {/* Left Status: Language + Shortcut Tip */}
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">{languageBadges[selectedLang]}</span>
          </span>
          <span className="hidden sm:inline text-[#484f58]">|</span>
          <span className="hidden sm:inline text-[#8b949e]">
            Press <kbd className="px-1 py-0.2 rounded bg-[#171c26] text-[#c9d1d9] border border-[#272e3a] font-mono">Ctrl+Enter</kbd> to Run
          </span>
        </div>

        {/* Right Status: Line/Col, Line Count, Encoding */}
        <div className="flex items-center space-x-3">
          <span className="text-[#c9d1d9]">
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
          <span className="text-[#484f58]">|</span>
          <span>{lineCount} lines</span>
          <span className="hidden sm:inline text-[#484f58]">|</span>
          <span className="hidden sm:inline text-[#8b949e]">Spaces: 2</span>
          <span className="hidden sm:inline text-[#484f58]">|</span>
          <span className="hidden sm:inline text-[#8b949e]">UTF-8</span>
        </div>
      </div>
    </div>
  );
};