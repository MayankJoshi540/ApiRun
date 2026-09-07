import React from 'react';
import { CheckCircle2, User } from 'lucide-react';

interface Props {
  activeTab: 'landing' | 'challenges' | 'progress' | 'dashboard';
  onSelectTab: (tab: 'landing' | 'challenges' | 'progress' | 'dashboard') => void;
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
    <header className="sticky top-3 sm:top-4 z-40 w-full px-3.5 sm:px-6 pointer-events-none font-sans">
      <div className="max-w-6xl mx-auto pointer-events-auto rounded-2xl bg-[#05070a]/75 backdrop-blur-2xl backdrop-saturate-150 border border-white/[0.12] shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] px-3.5 sm:px-5 h-14 flex items-center justify-between transition-all hover:border-white/[0.18]">
        {/* Brand Logo */}
        <div className="flex items-center space-x-5 sm:space-x-6">
          <button
            onClick={() => onSelectTab('landing')}
            className="flex items-center space-x-2.5 group text-left transition-all"
          >
            <img 
              src="/logo.png" 
              alt="API Run" 
              className="h-7.5 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/30 backdrop-blur-sm">
              v0.9.4
            </span>
          </button>

          {/* Navigation Links with Floating Capsule */}
          <nav className="hidden md:flex items-center space-x-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <button
              onClick={() => onSelectTab('challenges')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'challenges' || activeTab === 'dashboard'
                  ? 'bg-white/[0.1] text-emerald-400 border border-emerald-500/30 font-semibold' 
                  : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/[0.05]'
              }`}
            >
              Challenges
            </button>
            <button
              onClick={() => onSelectTab('progress')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'progress'
                  ? 'bg-white/[0.1] text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/[0.05]'
              }`}
            >
              Progress
            </button>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          {/* System Telemetry Badge */}
          <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] font-mono text-xs backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[#94a3b8]">ENGINE:</span>
            <span className="text-emerald-400 font-semibold tracking-wide">ONLINE</span>
          </div>

          {/* Completion Counter Glass Pill */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-sans backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[#f8fafc] font-semibold">{solvedCount}</span>
            <span className="text-[#94a3b8]">/{totalCount} solved</span>
          </div>

          {/* Developer Profile Floating Glass Card */}
          <div className="flex items-center space-x-2.5 pl-2 border-l border-white/[0.1]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-white/[0.1] to-white/[0.02] border border-white/[0.14] flex items-center justify-center text-[#f8fafc] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
              <User className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-medium text-[#f8fafc]">dev_user</div>
              <div className="text-[10px] text-emerald-400/80 font-mono">localhost:8000</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
