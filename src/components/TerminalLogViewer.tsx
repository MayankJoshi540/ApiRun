import React, { useState } from 'react';
import { Terminal, Trash2, Copy, Check } from '@/components/ui/GoogleIcon';

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
}

interface Props {
  logs: LogEntry[];
  onClear?: () => void;
}

export const TerminalLogViewer: React.FC<Props> = ({ logs, onClear }) => {
  const [copied, setCopied] = useState(false);


  const handleCopy = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.level}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-md border border-[#262d3a] bg-[#07080a] text-xs overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#262d3a] bg-[#0d0f14] text-[#8b949e] font-sans">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[#e6edf3] font-semibold text-xs">Wire Logs & Runner Output</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 text-xs text-[#8b949e] hover:text-[#e6edf3] px-2.5 py-1 rounded-md hover:bg-[#171c26] transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>Copy</span>
          </button>
          {onClear && (
            <button
              onClick={onClear}
              className="flex items-center space-x-1 text-xs text-[#8b949e] hover:text-red-400 px-2.5 py-1 rounded-md hover:bg-[#171c26] transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-3.5 space-y-1 max-h-64 overflow-y-auto font-mono text-[11px] leading-relaxed">
        {logs.length === 0 ? (
          <div className="text-[#6e7681] italic">
            // No execution logs recorded yet. Click "Run Tests" to execute against target API.
          </div>
        ) : (
          logs.map((log, idx) => {
            const levelColor =
              log.level === 'ERROR'
                ? 'text-red-400'
                : log.level === 'WARN'
                ? 'text-amber-400'
                : log.level === 'DEBUG'
                ? 'text-[#6e7681]'
                : 'text-emerald-400';

            return (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-[#6e7681] select-none">{log.timestamp}</span>
                <span className={`font-bold ${levelColor}`}>[{log.level}]</span>
                <span className="text-[#e6edf3] break-all">{log.message}</span>
              </div>
            );
          })
        )}
        <div className="text-emerald-400 pt-1 flex items-center">
          <span>apirun@runner:~$</span>
          <span className="terminal-cursor" />
        </div>
      </div>
    </div>
  );
};
