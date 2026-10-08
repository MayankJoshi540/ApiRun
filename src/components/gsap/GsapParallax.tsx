'use client';

import React, { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface GsapParallaxProps {
  children: React.ReactNode;
  speed?: number; // parallax speed multiplier, default 0.3
  className?: string;
  direction?: 'vertical' | 'horizontal';
}

export const GsapParallax: React.FC<GsapParallaxProps> = ({
  children,
  speed = 0.3,
  className = '',
  direction = 'vertical',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const prop = direction === 'vertical' ? 'y' : 'x';
    const distance = 100 * speed;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { [prop]: -distance },
        {
          [prop]: distance,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, [speed, direction]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
};
