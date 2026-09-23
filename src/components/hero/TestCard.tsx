import React from 'react';
import { Check } from '@/components/ui/GoogleIcon';

export const TestCard: React.FC = () => {
  return (
    <div className="relative group animate-card-float-3 transition-all duration-500 hover:scale-105 hover:!rotate-0">
      {/* Clean Technical Card Container */}
      <div className="relative w-[235px] 2xl:w-[265px] rounded-2xl bg-[#080d14] border border-white/[0.12] p-3.5 2xl:p-4.5 shadow-xl text-left select-none">
        <div className="flex items-center justify-between">
          {/* Left Text Column */}
          <div className="space-y-1.5">
            {/* Header with dot */}
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                All tests passed
              </span>
            </div>

            {/* Test Details */}
            <div className="space-y-0.5 font-sans text-[10px] sm:text-[11px] text-[#94a3b8] font-medium">
              <div>12/12 test cases</div>
              <div>Verified response</div>
              <div>Edge cases covered</div>
            </div>
          </div>

          {/* Right Clean Check Circle Badge */}
          <div className="w-9 h-9 2xl:w-10 2xl:h-10 rounded-full bg-teal-500/15 border border-teal-500/35 flex items-center justify-center text-teal-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
            <Check className="text-lg font-bold" />
          </div>
        </div>
      </div>
    </div>
  );
};
