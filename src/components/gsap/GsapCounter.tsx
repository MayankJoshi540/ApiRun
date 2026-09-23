'use client';

import React, { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface GsapCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const GsapCounter: React.FC<GsapCounterProps> = ({
  value,
  duration = 1.8,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;

    const proxy = { val: 0 };

    const anim = gsap.to(proxy, {
      val: value,
      duration,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        if (el) {
          el.innerText = `${prefix}${proxy.val.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}${suffix}`;
        }
      },
    });

    return () => {
      anim.kill();
    };
  }, [value, duration, decimals, prefix, suffix]);

  return (
    <span ref={numRef} className={`tabular-nums ${className}`}>
      {prefix}0{suffix}
    </span>
  );
};
