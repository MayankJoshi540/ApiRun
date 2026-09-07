import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Props {
  onNavigate: (route: 'landing' | 'challenges' | 'progress') => void;
  onStartBuilding: () => void;
}

export const LandingNavbar: React.FC<Props> = ({
  onNavigate,
  onStartBuilding
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#050608]/90 backdrop-blur-md border-b border-[#21262d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between font-sans">
        {/* Left: Brand */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-2.5 group text-left"
          >
            <div className="h-7 w-7 rounded bg-[#090b0e] border border-[#272e3a] group-hover:border-emerald-500/60 flex items-center justify-center transition-colors overflow-hidden p-0.5">
              <img src="/logo.png" alt="API Run" className="h-full w-full object-contain" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-semibold text-sm tracking-tight text-[#e6edf3] group-hover:text-white">
                API Run
              </span>
              <span className="text-[10px] font-mono text-emerald-500/90 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/70">
                v0.9.4
              </span>
            </div>
          </button>

          {/* Center Links */}
          <nav className="hidden md:flex items-center space-x-1 text-sm">
            <button
              onClick={() => onNavigate('challenges')}
              className="px-3 py-1.5 rounded-md font-medium text-xs text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#12161f]/60 transition-colors"
            >
              Challenges
            </button>
            <button
              onClick={() => onNavigate('progress')}
              className="px-3 py-1.5 rounded-md font-medium text-xs text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#12161f]/60 transition-colors"
            >
              Progress
            </button>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3.5 text-xs">
          {/* Engine Status */}
          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded bg-[#0c0e12] border border-[#21262d] font-mono text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[#8b949e]">ENGINE:</span>
            <span className="text-emerald-400 font-semibold">READY</span>
          </div>

          {/* User / Sign In */}
          <button
            onClick={() => onNavigate('challenges')}
            className="hidden sm:block text-[#8b949e] hover:text-[#e6edf3] font-medium transition-colors px-2 py-1"
          >
            dev_user
          </button>

          {/* Primary CTA */}
          <button
            onClick={onStartBuilding}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-xs transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-[0.98]"
          >
            <span>Start Building</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};