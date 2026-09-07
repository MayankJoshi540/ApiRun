import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Props {
  onLaunchArena: () => void;
  onBrowseTracks: () => void;
}

export const HeroButtons: React.FC<Props> = ({ onLaunchArena, onBrowseTracks }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto pt-2">
      {/* Primary CTA: Bright Mint Launch Free Arena */}
      <button
        onClick={onLaunchArena}
        className="group w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[#00f2a9] hover:bg-[#22fbb9] text-black font-extrabold text-sm sm:text-base tracking-tight transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(0,242,169,0.45)] active:scale-95 shadow-[0_0_20px_rgba(0,242,169,0.25)]"
      >
        <span>Launch Free Arena</span>
        <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" />
      </button>

      {/* Secondary CTA: Translucent Browse Production Tracks */}
      <button
        onClick={onBrowseTracks}
        className="group w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-[#0a0f16]/80 hover:bg-[#121a26]/90 text-[#f8fafc] border border-white/[0.14] hover:border-[#00f2a9]/40 font-semibold text-sm sm:text-base tracking-tight transition-all duration-300 hover:scale-[1.03] active:scale-95 backdrop-blur-xl shadow-lg hover:shadow-[0_0_24px_rgba(0,242,169,0.15)]"
      >
        <span className="text-[#00f2a9] font-mono font-bold text-sm sm:text-base transition-transform duration-300 group-hover:scale-110">
          &gt;_
        </span>
        <span>Browse Production Tracks</span>
      </button>
    </div>
  );
};
