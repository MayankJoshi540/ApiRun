'use client';

import React, { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface GsapTextRevealProps {
  text: string;
  className?: string;
  splitBy?: 'word' | 'char';
  stagger?: number;
  duration?: number;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  highlightWords?: string[];
  highlightClassName?: string;
}

export const GsapTextReveal: React.FC<GsapTextRevealProps> = ({
  text,
  className = '',
  splitBy = 'word',
  stagger = 0.04,
  duration = 0.6,
  tag: Tag = 'div',
  highlightWords,
  highlightClassName = '',
}) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.querySelectorAll('.gsap-text-unit').forEach((unit) => {
        (unit as HTMLElement).style.opacity = '1';
        (unit as HTMLElement).style.transform = 'none';
        (unit as HTMLElement).style.filter = 'none';
      });
      return;
    }

    const units = el.querySelectorAll('.gsap-text-unit');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        units,
        {
          opacity: 0,
          y: 20,
          filter: 'blur(4px)',
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [text, splitBy, stagger, duration]);

  const units = splitBy === 'word' ? text.split(' ') : text.split('');

  return (
    <Tag
      ref={containerRef as React.RefObject<any>}
      className={className}
      aria-label={text}
    >
      {units.map((unit, i) => {
        const cleanUnit = splitBy === 'word' ? unit.replace(/[^a-zA-Z0-9]/g, '') : unit;
        const isHighlighted = highlightWords?.includes(cleanUnit);
        
        return (
          <span
            key={`${unit}-${i}`}
            className={`gsap-text-unit inline-block ${isHighlighted ? highlightClassName : ''}`}
            style={{ opacity: 0 }}
            aria-hidden="true"
          >
            {unit}
            {splitBy === 'word' && i < units.length - 1 ? '\u00A0' : ''}
          </span>
        );
      })}
    </Tag>
  );
};
