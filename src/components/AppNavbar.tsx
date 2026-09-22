'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthControls } from './AuthControls';

interface Props {
  activeTab?: 'landing' | 'challenges' | 'progress' | 'feedback' | 'dashboard';
  onNavigate?: (route: 'landing' | 'challenges' | 'progress' | 'feedback') => void;
  onSelectTab?: (tab: 'landing' | 'challenges' | 'progress' | 'feedback' | 'dashboard') => void;
  solvedCount?: number;
  totalCount?: number;
}

export const AppNavbar: React.FC<Props> = ({
  activeTab: manualActiveTab,
  onNavigate,
  onSelectTab
}) => {
  const pathname = usePathname();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/challenges', label: 'Challenges', key: 'challenges' },
    { href: '/progress', label: 'Progress', key: 'progress' },
    { href: '/feedback', label: 'Feedback', key: 'feedback' },
  ];

  const getIsActive = (key: string, href: string) => {
    if (manualActiveTab) {
      if (key === 'challenges' && (manualActiveTab === 'challenges' || manualActiveTab === 'dashboard')) return true;
      return manualActiveTab === key;
    }
    if (href === '/challenges' && (pathname.startsWith('/challenges') || pathname === '/dashboard')) return true;
    if (href === '/progress' && pathname.startsWith('/progress')) return true;
    if (href === '/feedback' && pathname.startsWith('/feedback')) return true;
    return pathname === href;
  };

  const handleLinkClick = (key: string) => {
    onNavigate?.(key as any);
    onSelectTab?.(key as any);
  };

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 w-full px-3.5 sm:px-6 pointer-events-none font-sans select-none transition-all duration-300">
      <div 
        style={{
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
        }}
        className={`mx-auto pointer-events-auto rounded-full flex items-center justify-between transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? 'max-w-4xl h-12 sm:h-13 px-4 sm:px-6 bg-white/[0.06] border border-white/[0.2] shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-1px_1px_rgba(0,0,0,0.4)] scale-[0.98]'
            : 'max-w-5xl h-14 sm:h-16 px-5 sm:px-8 bg-white/[0.04] border border-white/[0.16] shadow-[0_12px_45px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(0,0,0,0.3)] scale-100'
        }`}
      >
        {/* Left: Brand Logo */}
        <div className="flex-1 flex items-center justify-start">
          <Link
            href="/"
            onClick={() => handleLinkClick('landing')}
            className="inline-flex items-center space-x-2 text-left shrink-0 transition-transform duration-200 hover:scale-105 active:scale-[0.97] group"
            aria-label="API Run home"
          >
            <div className="flex items-center font-mono text-sm sm:text-base font-extrabold text-emerald-400 tracking-tighter drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
              &#123;&bull;&gt;&#125;
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight font-sans">
              <span className="text-white">API</span>
              <span className="text-emerald-400">Run</span>
            </span>
          </Link>
        </div>

        {/* Center: Clean Seamless Navigation Links (No redundant capsule border) */}
        <nav 
          onMouseLeave={() => setHoveredTab(null)}
          className="flex items-center justify-center space-x-1 sm:space-x-2"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const isActive = getIsActive(link.key, link.href);
            const isHovered = hoveredTab === link.key;

            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredTab(link.key)}
                onClick={() => handleLinkClick(link.key)}
                className={`relative px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 z-10 active:scale-[0.97] ${
                  isActive 
                    ? 'text-emerald-300 font-bold' 
                    : isHovered 
                    ? 'text-white' 
                    : 'text-[#cbd5e1]'
                }`}
              >
                {(isActive || isHovered) && (
                  <span
                    className={`absolute inset-0 rounded-full -z-10 transition-all duration-200 ${
                      isHovered
                        ? 'bg-white/[0.1] border border-white/[0.14]'
                        : isActive
                        ? 'bg-emerald-500/15 border border-emerald-500/30'
                        : 'bg-transparent'
                    }`}
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Auth Controls */}
        <div className="flex-1 flex items-center justify-end">
          <AuthControls variant="navbar" />
        </div>
      </div>
    </header>
  );
};
