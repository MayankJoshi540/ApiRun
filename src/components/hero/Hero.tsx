'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from '@/components/ui/GoogleIcon';
import { HeroBackground } from './HeroBackground';
import { HeroButtons } from './HeroButtons';
import { FloatingCodeCard } from './FloatingCodeCard';
import { ChecklistCard } from './ChecklistCard';
import { TestCard } from './TestCard';
import { EndpointCard } from './EndpointCard';
import { gsap } from '@/lib/gsap';

interface HeroProps {
  onLaunchArena: () => void;
  onBrowseTracks: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLaunchArena, onBrowseTracks }) => {
  const heroRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLAnchorElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const title3Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndRef = useRef<HTMLDivElement>(null);

  // Floating Card Container Refs
  const cardLeft1Ref = useRef<HTMLDivElement>(null);
  const cardLeft2Ref = useRef<HTMLDivElement>(null);
  const cardRight1Ref = useRef<HTMLDivElement>(null);
  const cardRight2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Hero Elements Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        pillRef.current,
        { opacity: 0, y: -16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, delay: 0.1 }
      )
      .fromTo(
        [title1Ref.current, title2Ref.current, title3Ref.current],
        { opacity: 0, y: 36, filter: 'blur(10px)', scale: 0.97 },
        { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
        '-=0.25'
      )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 16, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo(
        scrollIndRef.current,
        { opacity: 0, y: 8 },
        { opacity: 0.85, y: 0, duration: 0.4 },
        '-=0.2'
      );

      // 2. Smooth, natural entrance for side framing cards
      gsap.fromTo(
        [cardLeft1Ref.current, cardLeft2Ref.current],
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
      );

      gsap.fromTo(
        [cardRight1Ref.current, cardRight2Ref.current],
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.25 }
      );

      // 3. Gentle, calm floating physics (only vertical translation, no conflicting rotation or jitter)
      if (cardLeft1Ref.current) {
        gsap.to(cardLeft1Ref.current, {
          y: -8,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
      if (cardLeft2Ref.current) {
        gsap.to(cardLeft2Ref.current, {
          y: 8,
          duration: 3.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.4,
        });
      }
      if (cardRight1Ref.current) {
        gsap.to(cardRight1Ref.current, {
          y: -7,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.2,
        });
      }
      if (cardRight2Ref.current) {
        gsap.to(cardRight2Ref.current, {
          y: 7,
          duration: 4.0,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.6,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative w-full flex flex-col justify-center items-center pt-24 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-6 overflow-visible select-none bg-[#050708]"
    >
      {/* 1. High-Resolution Background Artwork with Globe */}
      <HeroBackground />

      {/* 2. Left Floating Cards (Calm, stable, framed positioning) */}
      <div 
        ref={cardLeft1Ref} 
        className="hidden lg:block absolute left-2 xl:left-6 2xl:left-12 top-[18%] z-10 pointer-events-auto will-change-transform scale-[0.85] xl:scale-100 origin-left transition-transform hover:scale-105 duration-200"
      >
        <FloatingCodeCard />
      </div>
      <div 
        ref={cardLeft2Ref} 
        className="hidden lg:block absolute left-2 xl:left-6 2xl:left-14 bottom-[12%] z-10 pointer-events-auto will-change-transform scale-[0.85] xl:scale-100 origin-left transition-transform hover:scale-105 duration-200"
      >
        <ChecklistCard />
      </div>

      {/* 3. Right Floating Cards (Calm, stable, framed positioning) */}
      <div 
        ref={cardRight1Ref} 
        className="hidden lg:block absolute right-2 xl:right-6 2xl:right-12 top-[18%] z-10 pointer-events-auto will-change-transform scale-[0.85] xl:scale-100 origin-right transition-transform hover:scale-105 duration-200"
      >
        <TestCard />
      </div>
      <div 
        ref={cardRight2Ref} 
        className="hidden lg:block absolute right-2 xl:right-6 2xl:right-14 bottom-[12%] z-10 pointer-events-auto will-change-transform scale-[0.85] xl:scale-100 origin-right transition-transform hover:scale-105 duration-200"
      >
        <EndpointCard />
      </div>

      {/* 4. Central Hero Content Container */}
      <div className="relative z-20 w-full max-w-lg sm:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto flex flex-col items-center text-center space-y-4 sm:space-y-5 my-auto pt-2 pb-2 px-4">
        
        {/* Active Development & Feedback Announcement Pill */}
        <Link
          ref={pillRef}
          href="/feedback"
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 text-xs font-medium text-emerald-300 transition-all duration-200 group hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-normal">Active Development</span>
          <span className="text-emerald-400/40 hidden sm:inline">&bull;</span>
          <span className="font-semibold text-emerald-300">Accepting Feedback &amp; Ideas</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>

        {/* 3-Line Headline with Balanced Width and Bold Typography */}
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto space-y-1 sm:space-y-1.5 font-sans font-black tracking-tight leading-[0.98] sm:leading-[0.95]">
          <h1 ref={title1Ref} className="text-[34px] sm:text-5xl md:text-[54px] lg:text-[56px] xl:text-[62px] 2xl:text-[68px] text-white font-black drop-shadow-sm">
            Practice Real Backends.
          </h1>
          <h1 ref={title2Ref} className="text-[34px] sm:text-5xl md:text-[54px] lg:text-[56px] xl:text-[62px] 2xl:text-[68px] text-[#f1f5f9] font-black drop-shadow-sm">
            Defend Edge Cases.
          </h1>
          <h1 ref={title3Ref} className="text-[34px] sm:text-5xl md:text-[54px] lg:text-[56px] xl:text-[62px] 2xl:text-[68px] text-emerald-400 font-black drop-shadow-[0_0_24px_rgba(16,185,129,0.3)]">
            Master Production Systems.
          </h1>
        </div>

        {/* Subtitle */}
        <p ref={subRef} className="max-w-md sm:max-w-lg lg:max-w-xl mx-auto text-sm sm:text-base md:text-[17px] text-[#94a3b8] font-normal leading-relaxed pt-0.5 px-2">
          Hands-on backend challenges, real-world scenarios, automated verification, and a path to production-ready skills.
        </p>

        {/* Action Buttons */}
        <div ref={ctaRef} className="pt-2 pb-1">
          <HeroButtons 
            onLaunchArena={onLaunchArena}
            onBrowseTracks={onBrowseTracks}
          />
        </div>
      </div>

      {/* 5. Bottom Horizon Arc & Scroll Indicator */}
      <div ref={scrollIndRef} className="relative z-20 flex flex-col items-center justify-center pt-3 space-y-1 opacity-80 hover:opacity-100 transition-opacity">
        <ChevronDown className="w-4 h-4 text-emerald-400 animate-bounce" />
        <span className="text-[11px] font-sans font-medium tracking-[0.2em] text-[#94a3b8] uppercase">
          Scroll to explore
        </span>
      </div>
    </section>
  );
};
