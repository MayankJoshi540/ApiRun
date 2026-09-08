import React from 'react';
import { Check } from 'lucide-react';

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
              <span className="w-2 h-2 rounded-full bg-[#00f2a9]" />
              <span className="text-xs sm:text-sm font-bold text-[#00f2a9] tracking-tight">
                All tests passed
              </span>
            </div>

            {/* Test Details */}
            <div className="space-y-0.5 font-mono text-[10px] sm:text-[11px] text-[#94a3b8]">
              <div>12/12 test cases</div>
              <div>Verified response</div>
              <div>Edge cases covered</div>
            </div>
          </div>

          {/* Right Clean Check Circle Badge */}
          <div className="w-9 h-9 2xl:w-10 2xl:h-10 rounded-full bg-[#00f2a9]/15 border border-[#00f2a9]/60 flex items-center justify-center text-[#00f2a9] shrink-0 group-hover:scale-110 transition-transform duration-300">
            <Check className="w-4.5 h-4.5 stroke-[3]" />
          </div>
        </div>
      </div>
    </div>
  );
};
