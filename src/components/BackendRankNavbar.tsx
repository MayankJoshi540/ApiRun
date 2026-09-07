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
    <header className="sticky top-0 z-40 w-full bg-[#080a0e]/95 backdrop-blur-md border-b border-[#21262d] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => onSelectTab('landing')}
            className="flex items-center space-x-2.5 group text-left"
          >
            <div className="h-7 w-7 rounded-md bg-[#090b0e] border border-[#272e3a] group-hover:border-emerald-500/60 flex items-center justify-center transition-colors overflow-hidden p-0.5">
              <img src="/logo.png" alt="API Run" className="h-full w-full object-contain" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-semibold text-sm tracking-tight text-[#e6edf3] group-hover:text-white font-sans">
                API Run
              </span>
              <span className="text-[10px] font-mono text-emerald-500/85 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/70">
                v0.9.4
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onSelectTab('challenges')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'challenges' || activeTab === 'dashboard'
                  ? 'bg-[#12161f] text-emerald-400 border border-[#262d3a]' 
                  : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#12161f]/50'
              }`}
            >
              Challenges
            </button>
            <button
              onClick={() => onSelectTab('progress')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'progress'
                  ? 'bg-[#12161f] text-emerald-400 border border-[#262d3a]'
                  : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#12161f]/50'
              }`}
            >
              Progress
            </button>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3.5">
          {/* System Telemetry Badge */}
          <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-md bg-[#0c0e12] border border-[#21262d] font-mono text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[#8b949e]">ENGINE:</span>
            <span className="text-emerald-400 font-semibold">READY</span>
          </div>

          {/* Completion Counter */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#11151b] border border-[#21262d] text-xs font-sans">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[#e6edf3] font-semibold">{solvedCount}</span>
            <span className="text-[#8b949e]">/{totalCount} solved</span>
          </div>

          {/* Developer Profile */}
          <div className="flex items-center space-x-2.5 pl-2 border-l border-[#21262d]">
            <div className="w-7 h-7 rounded-md bg-[#171c26] border border-[#272e3a] flex items-center justify-center text-[#e6edf3]">
              <User className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-medium text-[#e6edf3]">dev_user</div>
              <div className="text-[10px] text-[#8b949e] font-mono">localhost:8000</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
