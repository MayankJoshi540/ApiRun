import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthControls } from './AuthControls';

interface Props {
  onNavigate?: (route: 'landing' | 'challenges' | 'progress' | 'feedback') => void;
  onStartBuilding?: () => void;
}

export const LandingNavbar: React.FC<Props> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/challenges', label: 'Challenges', route: 'challenges' as const },
    { href: '/progress', label: 'Progress', route: 'progress' as const },
    { href: '/feedback', label: 'Feedback', route: 'feedback' as const },
  ];

  return (
    <header className="fixed top-4 sm:top-6 left-0 right-0 z-50 w-full px-4 sm:px-6 pointer-events-none font-sans animate-navbar-drop">
      <div 
        className={`max-w-5xl mx-auto pointer-events-auto rounded-full px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#05070a]/90 border border-white/[0.14] shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl' 
            : 'bg-[#05070a]/75 border border-white/[0.1] shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl'
        }`}
      >
        {/* Left: Brand Logo {•>} APIRun */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/"
            onClick={() => onNavigate?.('landing')}
            className="flex items-center space-x-2 text-left shrink-0 transition-transform duration-200 hover:scale-105 active:scale-[0.97] group"
            aria-label="API Run home"
          >
            {/* Custom Terminal Code Icon */}
            <div className="flex items-center font-mono text-sm sm:text-base font-extrabold text-[#10b981] tracking-tighter">
              &#123;&bull;&gt;&#125;
            </div>
            {/* Logo Text */}
            <span className="font-extrabold text-base sm:text-lg tracking-tight font-sans">
              <span className="text-white">API</span>
              <span className="text-[#10b981]">Run</span>
            </span>
          </Link>
        </div>

        {/* Center: Fluid Pill Navigation Group */}
        <nav 
          onMouseLeave={() => setHoveredTab(null)}
          className="hidden sm:flex items-center relative p-1 rounded-full bg-[#0c1017]/90 border border-white/[0.08] shadow-inner" 
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHoveredTab(link.label)}
              onClick={() => onNavigate?.(link.route)}
              className="relative px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 z-10 active:scale-[0.97]"
            >
              {hoveredTab === link.label && (
                <span
                  className="absolute inset-0 bg-white/[0.08] rounded-full border border-white/[0.12] -z-10 transition-all duration-200"
                  style={{
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              )}
              <span className={hoveredTab === link.label ? 'text-white' : 'text-[#cbd5e1]'}>
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Right Section: Auth Controls (Sign In / Sign Up / User Avatar) */}
        <div className="flex items-center">
          <AuthControls variant="landing" />
        </div>
      </div>
    </header>
  );
};
