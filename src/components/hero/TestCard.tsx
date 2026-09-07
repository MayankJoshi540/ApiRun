import React from 'react';
import { Check } from 'lucide-react';

export const TestCard: React.FC = () => {
  return (
    <div className="relative group animate-card-float-3 transition-all duration-500 hover:scale-105 hover:!rotate-0">
      {/* Background Soft Glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-l from-[#00f2a9]/20 to-transparent rounded-2xl blur-lg opacity-40 group-hover:opacity-80 transition duration-500 pointer-events-none" />

      {/* Glassmorphic Card Container */}
      <div className="relative w-[235px] 2xl:w-[265px] rounded-2xl bg-[#080d14]/85 border border-white/[0.12] p-3.5 2xl:p-4.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-left select-none">
        <div className="flex items-center justify-between">
          {/* Left Text Column */}
          <div className="space-y-1.5">
            {/* Header with glowing dot */}
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#00f2a9] shadow-[0_0_8px_#00f2a9]" />
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

          {/* Right Large Glowing Check Circle Badge */}
          <div className="w-10 h-10 2xl:w-11 2xl:h-11 rounded-full bg-[#00f2a9]/15 border border-[#00f2a9]/60 flex items-center justify-center text-[#00f2a9] shadow-[0_0_16px_rgba(0,242,169,0.4)] shrink-0 group-hover:scale-110 transition-transform duration-300">
            <Check className="w-4.5 h-4.5 stroke-[3]" />
          </div>
        </div>
      </div>
    </div>
  );
};
