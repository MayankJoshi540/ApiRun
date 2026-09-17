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
  return (
    <header className="sticky top-3 sm:top-4 z-40 w-full px-3.5 sm:px-6 pointer-events-none font-sans select-none">
      <div className="max-w-6xl mx-auto pointer-events-auto rounded-full bg-[#05070a]/90 backdrop-blur-xl border border-white/[0.1] px-4 sm:px-6 h-14 flex items-center justify-between transition-colors">
        {/* Brand Logo */}
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            onClick={() => onSelectTab?.('landing')}
            className="flex items-center space-x-2 text-left shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95 group"
            aria-label="API Run home"
          >
            {/* Code Bracket Icon */}
            <div className="flex items-center font-mono text-sm sm:text-base font-extrabold text-[#10b981] tracking-tighter">
              &#123;&bull;&gt;&#125;
            </div>
            {/* Brand Text */}
            <span className="font-extrabold text-base sm:text-lg tracking-tight font-sans">
              <span className="text-white">API</span>
              <span className="text-[#10b981]">Run</span>
            </span>
          </Link>

          {/* Navigation Pill Container */}
          <nav className="hidden md:flex items-center p-1 rounded-full bg-[#0c1017] border border-white/[0.08]">
            <Link
              href="/challenges"
              onClick={() => onSelectTab?.('challenges')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeTab === 'challenges' || activeTab === 'dashboard'
                  ? 'bg-white/[0.1] text-white' 
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Challenges
            </Link>
            <Link
              href="/progress"
              onClick={() => onSelectTab?.('progress')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeTab === 'progress'
                  ? 'bg-white/[0.1] text-white'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Progress
            </Link>
            <Link
              href="/feedback"
              onClick={() => onSelectTab?.('feedback')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeTab === 'feedback'
                  ? 'bg-white/[0.1] text-white'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Feedback
            </Link>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          {/* Solved Progress Counter */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
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
