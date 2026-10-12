'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowLeft } from '@/components/ui/GoogleIcon';

interface MobileWorkbenchBannerProps {
  onDismiss?: () => void;
}

const LaptopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect width="18" height="12" x="3" y="4" rx="2" />
    <line x1="2" x2="22" y1="20" y2="20" />
  </svg>
);

const AlertIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const MobileWorkbenchBanner: React.FC<MobileWorkbenchBannerProps> = ({ onDismiss }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if on mobile or tablet viewport (<1024px or mobile user agent)
    const checkIsMobile = () => {
      const isSmallScreen = window.innerWidth < 1024;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const isAlreadyDismissed = sessionStorage.getItem('apirun_mobile_workbench_dismissed') === 'true';

      if ((isSmallScreen || isMobileUA) && !isAlreadyDismissed) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Keyboard accessibility: ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleVisitAnyway();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleVisitAnyway = () => {
    sessionStorage.setItem('apirun_mobile_workbench_dismissed', 'true');
    setIsOpen(false);
    onDismiss?.();
  };

  const handleBackToChallenges = () => {
    router.push('/challenges');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-banner-title"
      onClick={handleVisitAnyway}
    >
      <div 
        style={{
          backdropFilter: 'blur(30px) saturate(190%)',
          WebkitBackdropFilter: 'blur(30px) saturate(190%)',
        }}
        className="relative w-full max-w-md bg-[#0a1114]/80 border border-white/[0.12] border-t-white/[0.22] rounded-3xl p-6 sm:p-7 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.18),0_24px_60px_rgba(0,0,0,0.85)] animate-in zoom-in-95 duration-200 space-y-4 select-none font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Row with Apple Pill and Close Control */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {/* Apple Translucent Hardware Capsule */}
            <div className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-[#30d158] shrink-0 shadow-xs">
              <LaptopIcon className="w-4 h-4" />
            </div>

            <span className="font-mono text-[11px] font-semibold text-[#30d158] bg-[#30d158]/12 border border-[#30d158]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Desktop Recommended
            </span>
          </div>

          {/* Dismiss Icon */}
          <button
            onClick={handleVisitAnyway}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/[0.1] transition-all duration-150 cursor-pointer active:scale-95"
            aria-label="Close advisory"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-1.5">
          <h2 
            id="mobile-banner-title"
            className="text-base sm:text-lg font-bold text-white tracking-[-0.02em] leading-snug"
          >
            Use a Laptop or PC for the best experience
          </h2>
          <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed font-sans">
            Solving backend challenges requires writing code, testing real HTTP endpoints, and analyzing live terminal logs.
          </p>
        </div>

        {/* Mobile Viewport Disclaimer Callout (Apple Notice Plate) */}
        <div className="p-3.5 rounded-2xl bg-amber-500/[0.08] border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200/90 leading-relaxed shadow-[inset_0_1px_0_0_rgba(245,158,11,0.15)]">
          <AlertIcon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-left">
            <span className="font-semibold text-amber-300 block text-[11px] uppercase tracking-wider font-mono">
              Mobile Screen Limitation
            </span>
            <p className="text-[11px] sm:text-xs text-amber-200/80 leading-normal">
              The dual-pane IDE, code editor, and live test suites will look cramped and messy on phone screens. Mobile screens lack the width for complex IDEs, and the layout cannot be reconfigured for narrow viewports.
            </p>
          </div>
        </div>

        {/* Apple Tactile Action Controls */}
        <div className="flex items-center gap-2.5 pt-1.5">
          <button
            onClick={handleVisitAnyway}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#30d158] hover:bg-[#34c759] active:scale-[0.96] text-black font-bold text-xs transition-all duration-150 cursor-pointer shadow-[0_2px_12px_rgba(48,209,88,0.3)] text-center font-sans"
          >
            Visit anyway
          </button>

          <button
            onClick={handleBackToChallenges}
            className="py-3 px-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] active:scale-[0.96] text-zinc-200 hover:text-white border border-white/[0.12] text-xs font-semibold transition-all duration-150 flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
