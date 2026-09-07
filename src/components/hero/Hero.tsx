import React from 'react';
import { ChevronDown } from 'lucide-react';
import { HeroBackground } from './HeroBackground';
import { HeroBadge } from './HeroBadge';
import { HeroButtons } from './HeroButtons';
import { FloatingCodeCard } from './FloatingCodeCard';
import { ChecklistCard } from './ChecklistCard';
import { TestCard } from './TestCard';
import { EndpointCard } from './EndpointCard';

interface HeroProps {
  onLaunchArena: () => void;
  onBrowseTracks: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLaunchArena, onBrowseTracks }) => {
  return (
    <section className="relative min-h-[780px] lg:min-h-[850px] w-full flex flex-col justify-between items-center pt-28 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 overflow-visible select-none bg-[#050708]">
      {/* 1. Exact High-Resolution Background Artwork with Globe Visible & Reveal Animation */}
      <HeroBackground />

      {/* 2. Left Floating Glassmorphic Cards (Entrance Reveal + Floating Physics) */}
      <div className="hidden xl:block absolute left-2 2xl:left-8 top-[24%] z-10 pointer-events-auto animate-card-left-1">
        <FloatingCodeCard />
      </div>
      <div className="hidden xl:block absolute left-3 2xl:left-10 bottom-[18%] z-10 pointer-events-auto animate-card-left-2">
        <ChecklistCard />
      </div>

      {/* 3. Right Floating Glassmorphic Cards (Entrance Reveal + Floating Physics) */}
      <div className="hidden xl:block absolute right-2 2xl:right-8 top-[24%] z-10 pointer-events-auto animate-card-right-1">
        <TestCard />
      </div>
      <div className="hidden xl:block absolute right-3 2xl:right-10 bottom-[16%] z-10 pointer-events-auto animate-card-right-2">
        <EndpointCard />
      </div>

      {/* 4. Central Hero Content Container with Staggered Entrance Reveal */}
      <div className="relative z-20 max-w-xl sm:max-w-2xl lg:max-w-3xl 2xl:max-w-4xl mx-auto flex flex-col items-center text-center space-y-5 sm:space-y-6 my-auto pt-2 pb-4 px-4">
        {/* Status Pipeline Badge */}
        <div className="animate-hero-badge">
          <HeroBadge />
        </div>

        {/* 3-Line Headline strictly bounded and centered with Staggered Fade Up */}
        <div className="space-y-1 font-display font-black tracking-tight leading-[0.98] sm:leading-[0.94] max-w-lg sm:max-w-xl lg:max-w-2xl 2xl:max-w-3xl mx-auto">
          <h1 className="animate-hero-1 text-[32px] sm:text-5xl md:text-[52px] lg:text-[56px] xl:text-[62px] 2xl:text-[72px] text-white">
            Practice Real Backends.
          </h1>
          <h1 className="animate-hero-2 text-[32px] sm:text-5xl md:text-[52px] lg:text-[56px] xl:text-[62px] 2xl:text-[72px] text-[#f1f5f9]">
            Defend Edge Cases.
          </h1>
          <h1 className="animate-hero-3 text-[32px] sm:text-5xl md:text-[52px] lg:text-[56px] xl:text-[62px] 2xl:text-[72px] text-[#00f2a9]">
            Master Production Systems.
          </h1>
        </div>

        {/* Subtitle with Fade Up */}
        <p className="animate-hero-sub max-w-md sm:max-w-lg lg:max-w-xl 2xl:max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#94a3b8] font-normal leading-relaxed pt-0.5 px-2">
          Hands-on backend challenges, real-world scenarios, automated verification, and a path to production-ready skills.
        </p>

        {/* Action Buttons with Fade Up */}
        <div className="animate-hero-cta pt-2 pb-2">
          <HeroButtons 
            onLaunchArena={onLaunchArena}
            onBrowseTracks={onBrowseTracks}
          />
        </div>
      </div>

      {/* 5. Bottom Horizon Arc & Scroll Indicator */}
      <div className="relative z-20 flex flex-col items-center justify-center pt-2 space-y-1 opacity-85 hover:opacity-100 transition-opacity animate-hero-cta">
        <ChevronDown className="w-4 h-4 text-[#00f2a9] animate-bounce" />
        <span className="text-[10px] sm:text-[11px] font-mono font-medium tracking-[0.25em] text-[#94a3b8] uppercase">
          Scroll to explore
        </span>
      </div>
    </section>
  );
};
