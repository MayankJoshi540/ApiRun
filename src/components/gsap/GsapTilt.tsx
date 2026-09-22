'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

interface GsapTiltProps {
  children: React.ReactNode;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  className?: string;
  disabled?: boolean;
}

export const GsapTilt: React.FC<GsapTiltProps> = ({
  children,
  maxTilt = 6,
  perspective = 1000,
  scale = 1.02,
  className = '',
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || disabled) return;

    // Check if device supports hover
    const matchMedia = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!matchMedia.matches) return;

    gsap.set(el, { transformPerspective: perspective, transformStyle: 'preserve-3d' });

    const rotXTo = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power2.out' });
    const rotYTo = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power2.out' });
    const scaleTo = gsap.quickTo(el, 'scale', { duration: 0.5, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -maxTilt;
      const rotY = ((x - centerX) / centerX) * maxTilt;

      rotXTo(rotX);
      rotYTo(rotY);
      scaleTo(scale);
    };

    const handleMouseLeave = () => {
      rotXTo(0);
      rotYTo(0);
      scaleTo(1);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(el);
    };
  }, [maxTilt, perspective, scale, disabled]);

  return (
    <div ref={containerRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
};
