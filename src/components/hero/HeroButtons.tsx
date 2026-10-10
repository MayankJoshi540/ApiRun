'use client';

import React from 'react';
import { ArrowRight } from '@/components/ui/GoogleIcon';
import { GsapMagnetic } from '@/components/gsap/GsapMagnetic';

interface Props {
  onLaunchArena: () => void;
  onBrowseTracks: () => void;
}

export const HeroButtons: React.FC<Props> = ({ onLaunchArena, onBrowseTracks }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto pt-2 px-2 sm:px-0">
      {/* Primary CTA */}
      <GsapMagnetic strength={0.2} className="w-full sm:w-auto block sm:inline-block">
        <button
          onClick={onLaunchArena}
          className="group w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-semibold text-sm sm:text-base tracking-tight border border-emerald-400/20 shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <span>Explore Challenges</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </GsapMagnetic>

      {/* Secondary CTA */}
      <GsapMagnetic strength={0.2} className="w-full sm:w-auto block sm:inline-block">
        <button
          onClick={onBrowseTracks}
          className="group w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-[#0a0f16] hover:bg-[#121826] text-[#f8fafc] border border-white/[0.14] hover:border-emerald-500/40 font-semibold text-sm sm:text-base tracking-tight transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <span className="text-emerald-400 font-sans font-black text-sm sm:text-base">
            &gt;_
          </span>
          <span>Browse Tracks</span>
        </button>
      </GsapMagnetic>
    </div>
  );
};
