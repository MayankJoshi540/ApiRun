import React from 'react';

interface Props {
  passed: number;
  total: number;
  isRunning?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const ProgressIndicator: React.FC<Props> = ({
  passed,
  total,
  isRunning = false,
  showLabel = true,
  size = 'sm'
}) => {
  const percent = total > 0 ? Math.round((passed / total) * 100) : 0;
  const isComplete = passed === total && total > 0;

  return (
    <div className="space-y-1 font-mono">
      {showLabel && (
        <div className="flex items-center justify-between text-[10px] text-[#8b949e]">
          <span>{passed} / {total} Completed</span>
          <span className={isComplete ? 'text-emerald-400 font-bold' : isRunning ? 'text-sky-400' : 'text-[#e6edf3]'}>
            {percent}%
          </span>
        </div>
      )}
      <div className={`w-full bg-[#262d3a] rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2'}`}>
        <div
          className={`h-full transition-all duration-300 ${
            isComplete ? 'bg-emerald-500' : isRunning ? 'bg-sky-400 animate-pulse' : percent > 0 ? 'bg-amber-400' : 'bg-transparent'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
