import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Props {
  onLaunchArena: () => void;
  onBrowseTracks: () => void;
}

export const HeroButtons: React.FC<Props> = ({ onLaunchArena, onBrowseTracks }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto pt-2">
      {/* Primary CTA: Launch Free Arena */}
      <button
        onClick={onLaunchArena}
        className="group w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[#00f2a9] hover:bg-[#22fbb9] text-black font-extrabold text-sm sm:text-base tracking-tight transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-md"
      >
        <span>Launch Free Arena</span>
        <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" />
      </button>

      {/* Secondary CTA: Browse Production Tracks */}
      <button
        onClick={onBrowseTracks}
        className="group w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-[#0a0f16] hover:bg-[#121a26] text-[#f8fafc] border border-white/[0.14] hover:border-[#00f2a9]/60 font-semibold text-sm sm:text-base tracking-tight transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-md"
      >
        <span className="text-[#00f2a9] font-mono font-bold text-sm sm:text-base">
          &gt;_
        </span>
        <span>Browse Production Tracks</span>
      </button>
    </div>
  );
};
