import React from 'react';

export const HeroBadge: React.FC = () => {
  return (
    <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#061813]/80 border border-[#00f2a9]/30 text-[#00f2a9] shadow-[0_0_20px_rgba(0,242,169,0.15)] backdrop-blur-md transition-all duration-300 hover:border-[#00f2a9]/50 hover:shadow-[0_0_28px_rgba(0,242,169,0.25)] select-none">
      {/* Glowing Neon Dot */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2a9] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f2a9] shadow-[0_0_8px_#00f2a9]" />
      </span>

      {/* Monospace Developer Pipeline Text */}
      <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-wider text-[#00f2a9]">
        PRACTICE &nbsp;&gt;&nbsp; BUILD &nbsp;&gt;&nbsp; DEPLOY &nbsp;&gt;
      </span>
    </div>
  );
};
