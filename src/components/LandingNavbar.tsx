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
    <header className="sticky top-3 sm:top-4 z-50 w-full px-3.5 sm:px-6 pointer-events-none">
      <div className="max-w-6xl mx-auto pointer-events-auto rounded-2xl bg-[#05070a]/75 backdrop-blur-2xl backdrop-saturate-150 border border-white/[0.12] shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] px-3.5 sm:px-5 h-14 flex items-center justify-between font-sans transition-all hover:border-white/[0.18]">
        {/* Left: Brand */}
        <div className="flex items-center space-x-5 sm:space-x-6">
          <button
            onClick={() => onNavigate('landing')}
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

          {/* Center Links with Floating Glass Capsule */}
          <nav className="hidden md:flex items-center space-x-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm">
            <button
              onClick={() => onNavigate('challenges')}
              className="px-3 py-1 rounded-lg font-medium text-xs text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/[0.08] transition-all"
            >
              Challenges
            </button>
            <button
              onClick={() => onNavigate('progress')}
              className="px-3 py-1 rounded-lg font-medium text-xs text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/[0.08] transition-all"
            >
              Progress
            </button>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Engine Status Glass Pill */}
          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] font-mono text-[11px] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[#94a3b8]">ENGINE:</span>
            <span className="text-emerald-400 font-semibold tracking-wide">ONLINE</span>
          </div>

          {/* User / Sign In */}
          <button
            onClick={() => onNavigate('challenges')}
            className="hidden sm:block text-[#94a3b8] hover:text-[#f8fafc] font-medium transition-colors px-2 py-1"
          >
            dev_user
          </button>

          {/* Primary CTA Button */}
          <button
            onClick={onStartBuilding}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all active:scale-[0.98]"
          >
            <span>Start Building</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};