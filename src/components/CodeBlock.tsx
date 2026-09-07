import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

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
    <div className="rounded border border-[#262d3a] bg-[#090b0e] overflow-hidden text-xs font-mono">
      {(filename || language) && (
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#262d3a] bg-[#0e1117] text-[#8b949e]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#262d3a]" />
            <span className="text-[#c9d1d9] font-medium text-[11px]">{filename || language.toUpperCase()}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 text-[11px] text-[#8b949e] hover:text-[#e6edf3] transition-colors px-1.5 py-0.5 rounded hover:bg-[#1a202c]"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
      <div className="p-3 overflow-x-auto">
        <pre className="text-[#e6edf3] leading-relaxed">
          {lines.map((line, idx) => (
            <div key={idx} className="table-row">
              {showLineNumbers && (
                <span className="table-cell pr-4 text-[#484f58] select-none text-right w-6">
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
