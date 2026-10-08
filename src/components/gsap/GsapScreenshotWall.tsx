'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';
import { useGSAP } from '@gsap/react';

const screenshots = [
  { 
    id: 1, 
    src: '/new-catalog.png', 
    alt: 'Platform Overview',
    title: 'The Challenge Catalog',
    description: 'Browse our massive curriculum of real-world backend engineering challenges and architectural scenarios.'
  },
  { 
    id: 2, 
    src: '/new-editor.png', 
    alt: 'Interactive Editor',
    title: 'Browser-Based IDE',
    description: 'Write, debug, and execute your code in a professional workspace without ever leaving the browser.'
  },
  { 
    id: 3, 
    src: '/new-tests.png', 
    alt: 'Advanced Test Runner',
    title: 'Production Edge Cases',
    description: 'Our distributed runner hits your API with high concurrency to catch race conditions and strict RFC compliance issues.'
  },
  { 
    id: 4, 
    src: '/new-success.png', 
    alt: 'Analytics Dashboard',
    title: 'Track Your Mastery',
    description: 'Review your latency, memory usage, and build a verified portfolio of production-ready backend code.'
  },
];

export const GsapScreenshotWall: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(() => {
    if (!containerRef.current || !wrapperRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=400%', // 4 viewport heights to give plenty of scroll space
        pin: true,
        scrub: 1, // Smooth Emil-Kowalski physics lerp
        snap: {
          snapTo: 1 / (screenshots.length - 1),
          duration: { min: 0.2, max: 0.5 },
          ease: 'power2.inOut'
        },
        onUpdate: (self) => {
          const progress = self.progress;
          const newIndex = Math.round(progress * (screenshots.length - 1));
          
          // Use setter callback to avoid stale closure issues
          setActiveIndex((prev) => (prev !== newIndex ? newIndex : prev));
        }
      },
    });

    // Fade out title immediately on scroll
    if (titleRef.current) {
      tl.to(titleRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: 'power2.out'
      }, 0);
    }

    // Helper to calculate 3D Coverflow geometry based on distance from the active center index
    const getCoverflowState = (distance: number) => {
      if (distance === 0) {
        // Active Center Screenshot
        return { 
          x: 0, 
          z: 0, 
          rotateY: 0, 
          scale: 1, 
          opacity: 1, 
          zIndex: 10, 
          filter: 'blur(0px)' 
        };
      } else if (distance < 0) { 
        // Left side
        return { 
          x: -450 + (distance * 100), 
          z: -400 + (distance * 50), 
          rotateY: 45, 
          scale: 0.7, 
          opacity: Math.max(0, 1 + distance * 0.4),
          zIndex: 10 - Math.abs(distance),
          filter: 'blur(4px)'
        };
      } else { 
        // Right side
        return { 
          x: 450 + (distance * 100), 
          z: -400 - (distance * 50), 
          rotateY: -45, 
          scale: 0.7, 
          opacity: Math.max(0, 1 - distance * 0.4),
          zIndex: 10 - Math.abs(distance),
          filter: 'blur(4px)'
        };
      }
    };

    // 1. Set initial states (Screenshot 0 is active at the start)
    imagesRef.current.forEach((img, i) => {
      if (!img) return;
      gsap.set(img, getCoverflowState(i - 0));
    });

    // 2. Animate the transitions as we scroll
    for (let step = 0; step < screenshots.length - 1; step++) {
      tl.addLabel(`step${step}`, step);

      imagesRef.current.forEach((img, i) => {
        if (!img) return;
        
        // Calculate where this image should be in the next step
        const targetState = getCoverflowState(i - (step + 1));

        tl.to(img, {
          x: targetState.x,
          z: targetState.z,
          rotateY: targetState.rotateY,
          scale: targetState.scale,
          opacity: targetState.opacity,
          filter: targetState.filter,
          zIndex: targetState.zIndex,
          duration: 1,
          ease: 'power2.inOut' // Smooth ease between coverflow states
        }, `step${step}`);
      });
    }

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="h-screen w-full overflow-hidden bg-[#050708] relative flex flex-col items-center justify-center z-20 border-y border-white/[0.04]"
    >
      {/* Background ambient glow to support the 3D depth */}
      <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full opacity-30" />
      
      {/* Title that fades out as you scroll */}
      <div ref={titleRef} className="absolute top-8 sm:top-12 left-0 w-full text-center z-30 pointer-events-none">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Experience the Platform
        </h2>
        <p className="text-slate-400 font-mono text-xs mt-2 uppercase tracking-wider">Scroll to explore</p>
      </div>

      {/* 3D Perspective Wrapper */}
      <div 
        ref={wrapperRef}
        className="relative w-full max-w-[1600px] h-[55vh] mt-12 flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        {screenshots.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => { imagesRef.current[index] = el; }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[900px] aspect-video rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/90 bg-[#090d15]"
            style={{ transformStyle: 'preserve-3d' }} // zIndex handled by GSAP
          >
            {/* Subtle glass reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/5 z-10 pointer-events-none" />
            
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Dynamic Content (Text + Progress Dots) */}
      <div className="absolute bottom-12 left-0 w-full flex flex-col items-center justify-end z-30 pointer-events-none px-4">
        {/* Animated Text Container */}
        <div className="h-[80px] w-full max-w-2xl flex flex-col items-center justify-center text-center relative">
          {screenshots.map((item, index) => (
            <div 
              key={item.id}
              className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out ${
                index === activeIndex 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-4 scale-95'
              }`}
            >
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg mx-auto">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Progress Dots */}
        <div className="flex items-center space-x-3 mt-6">
          {screenshots.map((_, index) => (
            <div 
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'w-6 bg-emerald-400' 
                  : 'w-2 bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
