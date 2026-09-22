'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface Props {
  onExploreChallenges?: () => void;
}

export const ChallengeShowcaseScroll: React.FC<Props> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const scanBeamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !imageWrapperRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Pure straight vertical upward scroll-driven slide
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 92%',
          end: 'top 25%',
          scrub: 1.2,
          toggleActions: 'play reverse play reverse',
        }
      });

      // 1. Straight vertical upward slide of screenshot
      tl.fromTo(
        imageWrapperRef.current,
        {
          y: 240,
          scale: 0.94,
          opacity: 0.3,
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
        },
        0
      );

      // 2. Ambient background glow
      if (glowRef.current) {
        tl.fromTo(
          glowRef.current,
          {
            y: 140,
            scale: 0.7,
            opacity: 0.1,
          },
          {
            y: 0,
            scale: 1.15,
            opacity: 0.45,
            ease: 'power2.out',
          },
          0
        );
      }

      // 3. Diagonal light sweep across dashboard glass
      if (scanBeamRef.current) {
        tl.fromTo(
          scanBeamRef.current,
          { xPercent: -120, opacity: 0 },
          { xPercent: 160, opacity: 0.8, ease: 'power1.inOut' },
          0.1
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="mt-6 sm:mt-12 pt-6 sm:pt-10 pb-20 px-4 sm:px-6 max-w-6xl mx-auto relative z-10 font-sans"
    >
      {/* Ambient background effect behind the image */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div 
          ref={glowRef}
          className="w-[85%] max-w-3xl h-[340px] rounded-full bg-emerald-500/[0.08] blur-[100px] transition-all duration-300"
        />
      </div>

      {/* Straight Vertical Sliding Curved Image Container */}
      <div 
        ref={imageWrapperRef}
        style={{ willChange: 'transform, opacity' }}
        className="relative rounded-2xl sm:rounded-3xl border border-white/[0.12] bg-[#070a10] shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_40px_rgba(16,185,129,0.08)] overflow-hidden transition-all duration-500 hover:border-white/[0.2]"
      >
        <Image
          src="/image.png"
          alt="APIRun Challenges"
          width={1920}
          height={1080}
          quality={100}
          priority
          className="w-full h-auto block object-cover"
        />
      </div>
    </section>
  );
};
