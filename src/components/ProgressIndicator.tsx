import React from 'react';

interface Props {
  passed: number;
  total: number;
  isRunning?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  accentColor?: 'mint' | 'blue' | 'amber';
}

export const ProgressIndicator: React.FC<Props> = ({
  passed,
  total,
  isRunning = false,
  showLabel = true,
  size = 'sm',
  accentColor = 'mint'
}) => {
  const percent = total > 0 ? Math.min(100, Math.round((passed / total) * 100)) : 0;
  const isComplete = passed === total && total > 0;

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'md' ? 'h-2' : 'h-2.5';

  return (
    <div className="space-y-1.5 font-mono select-none">
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-[#94a3b8]">
          <span className="text-[11px] font-medium">{passed} / {total} Completed</span>
          <span className={`text-[11px] font-bold ${
            isComplete ? 'text-[#10b981]' : isRunning ? 'text-sky-400' : percent > 0 ? 'text-white' : 'text-[#64748b]'
          }`}>
            {percent}%
          </span>
        </div>
      )}
      <div className={`w-full bg-white/[0.06] rounded-full overflow-hidden p-0.5 border border-white/[0.04] ${heightClass}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isComplete
              ? 'bg-[#10b981]'
              : isRunning
              ? 'bg-sky-400 animate-pulse'
              : percent > 0
              ? 'bg-white/80'
              : 'bg-transparent'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
