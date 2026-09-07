import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Props {
  onNavigate: (route: 'landing' | 'challenges' | 'progress') => void;
  onStartBuilding: () => void;
}

export const LandingNavbar: React.FC<Props> = ({ onNavigate, onStartBuilding }) => {
  return (
    <header className="sticky top-3 sm:top-4 z-50 w-full px-3 sm:px-6 pointer-events-none">
      <div className="max-w-6xl mx-auto pointer-events-auto rounded-2xl bg-[#05070a]/80 backdrop-blur-xl border border-white/[0.10] shadow-[0_10px_30px_rgba(0,0,0,0.45)] px-3 sm:px-5 h-14 flex items-center justify-between font-sans transition-colors hover:border-white/[0.16]">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center group text-left shrink-0"
          aria-label="API Run home"
        >
          <img
            src="/logo.png"
            alt="API Run"
            className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-[1.03]"
          />
        </button>

        <nav className="hidden md:flex items-center gap-1 ml-8 mr-auto" aria-label="Primary navigation">
          <button
            onClick={() => onNavigate('challenges')}
            className="px-3.5 py-2 rounded-lg font-medium text-xs text-[#94a3b8] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            Challenges
          </button>
          <button
            onClick={() => onNavigate('progress')}
            className="px-3.5 py-2 rounded-lg font-medium text-xs text-[#94a3b8] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            Progress
          </button>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/[0.035] border border-white/[0.07] font-mono text-[10px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="text-[#64748b]">ENGINE</span>
            <span className="text-emerald-400 font-semibold">ONLINE</span>
          </div>

          <button
            onClick={() => onNavigate('challenges')}
            className="hidden sm:block text-[#94a3b8] hover:text-white font-medium transition-colors px-2 py-1"
          >
            dev_user
          </button>

          <button
            onClick={onStartBuilding}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(0,242,169,0.10)]"
          >
            <span>Start Building</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
