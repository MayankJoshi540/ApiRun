'use client';

import React, { useEffect, useState } from 'react';

export const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const currentScroll = window.scrollY;
      const scrollPercent = (currentScroll / totalHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[100] pointer-events-none bg-transparent">
      <div
        className="h-full bg-emerald-500 transition-all duration-75 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)',
        }}
      />
    </div>
  );
};
