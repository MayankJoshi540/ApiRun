'use client';

import React, { useState, useEffect } from 'react';
import { AuthControls } from './AuthControls';

interface Props {
  onNavigate: (route: 'landing' | 'challenges' | 'progress') => void;
  onStartBuilding?: () => void;
}

export const LandingNavbar: React.FC<Props> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-4 sm:top-6 left-0 right-0 z-50 w-full px-4 sm:px-6 pointer-events-none font-sans animate-navbar-drop">
      <div 
        className={`max-w-5xl mx-auto pointer-events-auto rounded-full px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#05070a]/90 border border-white/[0.16] shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl' 
            : 'bg-[#05070a]/75 border border-white/[0.1] shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl'
        }`}
      >
        {/* Left: Brand Logo {•>} APIRun */}
        <div className="flex items-center gap-6 sm:gap-8">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-2 text-left shrink-0 transition-transform duration-300 hover:scale-105 active:scale-95 group"
            aria-label="API Run home"
          >
            {/* Custom Terminal Code Icon */}
            <div className="flex items-center font-mono text-sm sm:text-base font-extrabold text-[#00f2a9] tracking-tighter">
              &#123;&bull;&gt;&#125;
            </div>
            {/* Logo Text */}
            <span className="font-extrabold text-base sm:text-lg tracking-tight font-sans">
              <span className="text-white">API</span>
              <span className="text-[#00f2a9]">Run</span>
            </span>
          </button>
        </div>

        {/* Center: Pill Navigation Group */}
        <nav 
          className="hidden sm:flex items-center p-1 rounded-full bg-[#0c1017]/90 border border-white/[0.08] shadow-inner" 
          aria-label="Primary navigation"
        >
          <button
            onClick={() => onNavigate('challenges')}
            className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-[#cbd5e1] hover:text-white transition-all duration-200 hover:bg-white/[0.08]"
          >
            Challenges
          </button>
          <button
            onClick={() => onNavigate('progress')}
            className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-[#cbd5e1] hover:text-white transition-all duration-200 hover:bg-white/[0.08]"
          >
            Progress
          </button>
        </nav>

        {/* Right Section: Auth Controls (Sign In / Sign Up / User Avatar) */}
        <div className="flex items-center">
          <AuthControls variant="landing" />
        </div>
      </div>
    </header>
  );
};
