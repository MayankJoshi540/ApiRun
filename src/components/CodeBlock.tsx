import React, { useState } from 'react';
import { Copy, Check } from '@/components/ui/GoogleIcon';

interface Props {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<Props> = ({
  code,
  language = 'json',
  filename,
  showLineNumbers = false
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trimEnd().split('\n');

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#06080d] overflow-hidden text-[13.5px] sm:text-sm font-mono shadow-inner">
      {(filename || language) && (
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/[0.06] bg-[#0b0e14] text-[#94a3b8]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
            <span className="text-[#e2e8f0] font-medium text-xs tracking-wider uppercase font-mono">
              {filename || language}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 text-xs text-[#94a3b8] hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/[0.06]"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
      <div className="p-3.5 sm:p-4 overflow-x-auto">
        <pre className="text-[#f1f5f9] leading-relaxed font-mono">
          {lines.map((line, idx) => (
            <div key={idx} className="table-row">
              {showLineNumbers && (
                <span className="table-cell pr-4 text-[#475569] select-none text-right w-8 font-mono text-xs">
                  {idx + 1}
                </span>
              )}
              <span className="table-cell">{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};
