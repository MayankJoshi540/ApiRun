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
import { GsapTilt } from '@/components/gsap/GsapTilt';

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
        { opacity: 0, y: -20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.1 }
      )
      .fromTo(
        [title1Ref.current, title2Ref.current, title3Ref.current],
        { opacity: 0, y: 35, rotateX: 12 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.12, ease: 'expo.out' },
        '-=0.3'
      )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)' },
        '-=0.3'
      )
      .fromTo(
        scrollIndRef.current,
        { opacity: 0, y: 10 },
        { opacity: 0.85, y: 0, duration: 0.5 },
        '-=0.2'
      );

      // 2. Entrance for Floating Side Cards
      gsap.fromTo(
        [cardLeft1Ref.current, cardLeft2Ref.current],
        { opacity: 0, x: -60, scale: 0.92 },
        { opacity: 1, x: 0, scale: 1, duration: 1.1, stagger: 0.2, ease: 'expo.out', delay: 0.3 }
      );

      gsap.fromTo(
        [cardRight1Ref.current, cardRight2Ref.current],
        { opacity: 0, x: 60, scale: 0.92 },
        { opacity: 1, x: 0, scale: 1, duration: 1.1, stagger: 0.2, ease: 'expo.out', delay: 0.4 }
      );

      // 3. Continuous Organic Floating Physics for each card with distinct periods
      if (cardLeft1Ref.current) {
        gsap.to(cardLeft1Ref.current, {
          y: '+=10',
          rotation: 0.6,
          duration: 3.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
      if (cardLeft2Ref.current) {
        gsap.to(cardLeft2Ref.current, {
          y: '-=12',
          rotation: -0.8,
          duration: 4.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.6,
        });
      }
      if (cardRight1Ref.current) {
        gsap.to(cardRight1Ref.current, {
          y: '+=14',
          rotation: -0.5,
          duration: 3.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.3,
        });
      }
      if (cardRight2Ref.current) {
        gsap.to(cardRight2Ref.current, {
          y: '-=10',
          rotation: 0.7,
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.9,
        });
      }

      // 4. Subtle Interactive Mouse Parallax on Hero
      const hero = heroRef.current;
      if (hero && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const leftX = gsap.quickTo([cardLeft1Ref.current, cardLeft2Ref.current], 'x', { duration: 1.2, ease: 'power2.out' });
        const leftY = gsap.quickTo([cardLeft1Ref.current, cardLeft2Ref.current], 'y', { duration: 1.2, ease: 'power2.out' });
        const rightX = gsap.quickTo([cardRight1Ref.current, cardRight2Ref.current], 'x', { duration: 1.2, ease: 'power2.out' });
        const rightY = gsap.quickTo([cardRight1Ref.current, cardRight2Ref.current], 'y', { duration: 1.2, ease: 'power2.out' });

        const handleMouseMove = (e: MouseEvent) => {
          const rect = hero.getBoundingClientRect();
          const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

          leftX(normX * -15);
          leftY(normY * -12);
          rightX(normX * 15);
          rightY(normY * 12);
        };

        hero.addEventListener('mousemove', handleMouseMove);
        return () => {
          hero.removeEventListener('mousemove', handleMouseMove);
        };
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[780px] lg:min-h-[850px] w-full flex flex-col justify-between items-center pt-28 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 overflow-visible select-none bg-[#050708]"
    >
      {/* 1. High-Resolution Background Artwork with Globe */}
      <HeroBackground />

      {/* 2. Left Floating Cards with GSAP Physics & Tilt */}
      <div 
        ref={cardLeft1Ref} 
        className="hidden xl:block absolute left-2 2xl:left-8 top-[24%] z-10 pointer-events-auto will-change-transform"
      >
        <GsapTilt maxTilt={7} scale={1.03}>
          <FloatingCodeCard />
        </GsapTilt>
      </div>
      <div 
        ref={cardLeft2Ref} 
        className="hidden xl:block absolute left-3 2xl:left-10 bottom-[18%] z-10 pointer-events-auto will-change-transform"
      >
        <GsapTilt maxTilt={7} scale={1.03}>
          <ChecklistCard />
        </GsapTilt>
      </div>

      {/* 3. Right Floating Cards with GSAP Physics & Tilt */}
      <div 
        ref={cardRight1Ref} 
        className="hidden xl:block absolute right-2 2xl:right-8 top-[24%] z-10 pointer-events-auto will-change-transform"
      >
        <GsapTilt maxTilt={7} scale={1.03}>
          <TestCard />
        </GsapTilt>
      </div>
      <div 
        ref={cardRight2Ref} 
        className="hidden xl:block absolute right-3 2xl:right-10 bottom-[16%] z-10 pointer-events-auto will-change-transform"
      >
        <GsapTilt maxTilt={7} scale={1.03}>
          <EndpointCard />
        </GsapTilt>
      </div>

      {/* 4. Central Hero Content Container with GSAP Timeline */}
      <div className="relative z-20 max-w-xl sm:max-w-2xl lg:max-w-3xl 2xl:max-w-4xl mx-auto flex flex-col items-center text-center space-y-5 sm:space-y-6 my-auto pt-2 pb-4 px-4">
        
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

        {/* 3-Line Headline with GSAP 3D Entrance */}
        <div className="space-y-1 font-display font-black tracking-tight leading-[0.98] sm:leading-[0.94] max-w-lg sm:max-w-xl lg:max-w-2xl 2xl:max-w-3xl mx-auto">
          <h1 ref={title1Ref} className="text-[32px] sm:text-5xl md:text-[52px] lg:text-[56px] xl:text-[62px] 2xl:text-[72px] text-white">
            Practice Real Backends.
          </h1>
          <h1 ref={title2Ref} className="text-[32px] sm:text-5xl md:text-[52px] lg:text-[56px] xl:text-[62px] 2xl:text-[72px] text-[#f1f5f9]">
            Defend Edge Cases.
          </h1>
          <h1 ref={title3Ref} className="text-[32px] sm:text-5xl md:text-[52px] lg:text-[56px] xl:text-[62px] 2xl:text-[72px] text-emerald-400">
            Master Production Systems.
          </h1>
        </div>

        {/* Subtitle */}
        <p ref={subRef} className="max-w-md sm:max-w-lg lg:max-w-xl 2xl:max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#94a3b8] font-normal leading-relaxed pt-0.5 px-2">
          Hands-on backend challenges, real-world scenarios, automated verification, and a path to production-ready skills.
        </p>

        {/* Action Buttons */}
        <div ref={ctaRef} className="pt-2 pb-2">
          <HeroButtons 
            onLaunchArena={onLaunchArena}
            onBrowseTracks={onBrowseTracks}
          />
        </div>
      </div>

      {/* 5. Bottom Horizon Arc & Scroll Indicator */}
      <div ref={scrollIndRef} className="relative z-20 flex flex-col items-center justify-center pt-2 space-y-1 opacity-85 hover:opacity-100 transition-opacity">
        <ChevronDown className="w-4 h-4 text-emerald-400 animate-bounce" />
        <span className="text-[10px] sm:text-[11px] font-mono font-medium tracking-[0.25em] text-[#94a3b8] uppercase">
          Scroll to explore
        </span>
      </div>
    </section>
  );
};
