import React from 'react';
import { ArrowRight } from '@/components/ui/GoogleIcon';

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
        className="group w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base tracking-tight transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-md shadow-emerald-950/40"
      >
        <span>Launch Free Arena</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
      </button>

      {/* Secondary CTA: Browse Production Tracks */}
      <button
        onClick={onBrowseTracks}
        className="group w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-[#0a0f16] hover:bg-[#121826] text-[#f8fafc] border border-white/[0.14] hover:border-emerald-500/40 font-semibold text-sm sm:text-base tracking-tight transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-md"
      >
        <span className="text-emerald-400 font-mono font-bold text-sm sm:text-base">
          &gt;_
        </span>
        <span>Browse Production Tracks</span>
      </button>
    </div>
  );
};
