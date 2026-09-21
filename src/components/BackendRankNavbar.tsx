import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from '@/components/ui/GoogleIcon';
import { AuthControls } from './AuthControls';

interface Props {
  activeTab: 'landing' | 'challenges' | 'progress' | 'feedback' | 'dashboard';
  onSelectTab?: (tab: 'landing' | 'challenges' | 'progress' | 'feedback' | 'dashboard') => void;
  solvedCount: number;
  totalCount: number;
  onOpenSearch?: () => void;
}

export const BackendRankNavbar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  solvedCount,
  totalCount
}) => {
  const [hoveredTab, setHoveredTab] = React.useState<string | null>(null);

  const tabs = [
    { key: 'challenges', label: 'Challenges', href: '/challenges' },
    { key: 'progress', label: 'Progress', href: '/progress' },
    { key: 'feedback', label: 'Feedback', href: '/feedback' },
  ];

  return (
    <header className="sticky top-3 sm:top-4 z-40 w-full px-3.5 sm:px-6 pointer-events-none font-sans select-none">
      <div className="max-w-6xl mx-auto pointer-events-auto rounded-full bg-[#05070a]/90 backdrop-blur-xl border border-white/[0.1] px-4 sm:px-6 h-14 flex items-center justify-between transition-colors shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        {/* Brand Logo */}
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            onClick={() => onSelectTab?.('landing')}
            className="flex items-center space-x-2 text-left shrink-0 transition-transform duration-200 hover:scale-105 active:scale-[0.97] group"
            aria-label="API Run home"
          >
            {/* Code Bracket Icon */}
            <div className="flex items-center font-mono text-sm sm:text-base font-extrabold text-emerald-400 tracking-tighter">
              &#123;&bull;&gt;&#125;
            </div>
            {/* Brand Text */}
            <span className="font-extrabold text-base sm:text-lg tracking-tight font-sans">
              <span className="text-white">API</span>
              <span className="text-emerald-400">Run</span>
            </span>
          </Link>

          {/* Fluid Navigation Pill Container */}
          <nav 
            onMouseLeave={() => setHoveredTab(null)}
            className="hidden md:flex items-center relative p-1 rounded-full bg-[#0c1017] border border-white/[0.08]"
          >
            {tabs.map((tab) => {
              const isCurrentActive = 
                (tab.key === 'challenges' && (activeTab === 'challenges' || activeTab === 'dashboard')) ||
                activeTab === tab.key;
              const isHovered = hoveredTab === tab.key;

              return (
                <Link
                  key={tab.key}
                  href={tab.href}
                  onMouseEnter={() => setHoveredTab(tab.key)}
                  onClick={() => onSelectTab?.(tab.key as any)}
                  className="relative px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 z-10 active:scale-[0.97]"
                >
                  {/* Sliding Background Indicator */}
                  {(isCurrentActive || isHovered) && (
                    <span
                      className={`absolute inset-0 rounded-full -z-10 transition-all duration-200 ${
                        isHovered 
                          ? 'bg-white/[0.1] border border-white/[0.12]' 
                          : isCurrentActive 
                          ? 'bg-emerald-500/15 border border-emerald-500/30' 
                          : 'bg-transparent'
                      }`}
                      style={{
                        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  )}
                  <span className={isCurrentActive ? 'text-emerald-300 font-bold' : isHovered ? 'text-white' : 'text-[#94a3b8]'}>
                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          {/* Solved Progress Counter */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono transition-transform hover:scale-105">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white font-bold">{solvedCount}</span>
            <span className="text-[#64748b]">/{totalCount}</span>
          </div>

          {/* Auth Controls Integration */}
          <div className="flex items-center pl-2 border-l border-white/[0.1]">
            <AuthControls variant="navbar" />
          </div>
        </div>
      </div>
    </header>
  );
};
