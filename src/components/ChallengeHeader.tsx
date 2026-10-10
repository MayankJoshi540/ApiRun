'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Flame, 
  Clock, 
  RotateCcw,
  Server
} from '@/components/ui/GoogleIcon';
import { AuthControls } from '@/components/AuthControls';
import { Challenge } from '../types';

interface Props {
  challenge: Challenge;
  challengesList?: Challenge[];
  onBack: () => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  onNavigateRandom?: () => void;
  onRunTests: () => void;
  onSubmitSolution: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  serverUrl: string;
  onOpenServerSettings?: () => void;
  onChangeServerUrl?: (url: string) => void;
}

export const ChallengeHeader: React.FC<Props> = ({
  challenge,
  challengesList = [],
  onBack,
  onNavigatePrev,
  onNavigateNext,
  onNavigateRandom,
  serverUrl,
  onOpenServerSettings,
  onChangeServerUrl
}) => {
  const [timerActive, setTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Target input local edit state
  const [tempUrl, setTempUrl] = useState(serverUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempUrl(serverUrl);
  }, [serverUrl]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  const handleResetTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimerActive(false);
    setSeconds(0);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSaveTarget = () => {
    if (tempUrl.trim() && onChangeServerUrl) {
      onChangeServerUrl(tempUrl.trim());
    }
  };

  const currentIndex = challengesList.findIndex(c => c.id === challenge.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < challengesList.length - 1;

  return (
    <header className="h-14 px-3 sm:px-5 bg-[#161618]/80 backdrop-blur-2xl border-b border-white/[0.08] flex items-center justify-between shrink-0 select-none z-30 text-[#f5f5f7]">
      {/* ── Left: APIRun Brand Sign + Problem List + Navigation Chevrons ── */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Your Original APIRun Brand Sign */}
        <Link
          href="/"
          className="flex items-center gap-2.5 p-1 rounded-xl hover:opacity-90 transition-all cursor-pointer shrink-0 group active:scale-[0.97]"
          title="APIRun Home"
        >
          <img
            src="/logo.png"
            alt="APIRun"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-lg"
          />
          <span className="font-semibold text-base sm:text-lg tracking-tight font-sans hidden xs:inline">
            <span className="text-white">API</span>
            <span className="text-[#30d158]">Run</span>
          </span>
        </Link>

        <div className="h-5 w-px bg-white/[0.08] shrink-0 mx-0.5" />

        {/* Apple Style Problem List Button */}
        <button
          onClick={onBack}
          className="h-9.5 px-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] active:scale-[0.97] border border-white/[0.08] text-[#f5f5f7] transition-all flex items-center gap-2 text-xs sm:text-sm font-medium cursor-pointer shrink-0 shadow-sm"
          title="Back to Problems List"
        >
          <Menu className="w-4 h-4 text-[#30d158]" />
          <span>Problem List</span>
        </button>

        {/* Navigation Arrows: Prev / Next */}
        <div className="flex items-center gap-1">
          <button
            onClick={onNavigatePrev}
            disabled={!hasPrev}
            className="w-9.5 h-9.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-[#d1d1d6] hover:text-white flex items-center justify-center transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer active:scale-[0.97] shadow-sm"
            title="Previous Problem"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={onNavigateNext}
            disabled={!hasNext}
            className="w-9.5 h-9.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-[#d1d1d6] hover:text-white flex items-center justify-center transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer active:scale-[0.97] shadow-sm"
            title="Next Problem"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>

          {/* Random Problem Shuffle */}
          <button
            onClick={onNavigateRandom}
            className="w-9.5 h-9.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-[#d1d1d6] hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-[0.97] shadow-sm"
            title="Pick Random Problem"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>

        {/* Active Problem Title */}
        <span className="hidden xl:inline text-xs sm:text-sm text-[#86868b] font-medium truncate max-w-[220px] pl-1">
          {challenge.title}
        </span>
      </div>

      {/* ── Center: Target API Server URL Box ── */}
      <div className="flex items-center gap-2">
        <div 
          onClick={() => inputRef.current?.focus()}
          className="h-10 px-3.5 sm:px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] focus-within:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.14] focus-within:border-[#30d158]/70 focus-within:ring-2 focus-within:ring-[#30d158]/20 flex items-center gap-2.5 transition-all cursor-text shadow-sm"
          title="Target API Server URL (Click to edit directly)"
        >
          {/* Label */}
          <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider flex items-center gap-1.5 shrink-0 font-mono">
            <Server className="w-4 h-4 text-[#30d158]" />
            <span className="hidden sm:inline">Target:</span>
          </span>

          {/* Live Editable Input */}
          <input
            ref={inputRef}
            type="text"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveTarget();
                inputRef.current?.blur();
              }
              if (e.key === 'Escape') {
                setTempUrl(serverUrl);
                inputRef.current?.blur();
              }
            }}
            onBlur={handleSaveTarget}
            className="bg-transparent font-mono text-xs sm:text-sm text-[#30d158] font-semibold outline-none w-36 sm:w-56 md:w-64 selection:bg-[#30d158]/30 selection:text-white placeholder-[#86868b]/50"
            placeholder="http://localhost:8000"
          />
        </div>
      </div>

      {/* ── Right: Stopwatch + Streak + User Profile ── */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Stopwatch */}
        <div
          onClick={() => setTimerActive(!timerActive)}
          className={`h-10 px-3.5 sm:px-4 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all select-none font-mono text-xs sm:text-sm font-semibold shadow-sm active:scale-[0.97] ${
            timerActive 
              ? 'bg-[#0a84ff]/20 text-[#64d2ff] border border-[#0a84ff]/50 shadow-[0_0_12px_rgba(10,132,255,0.2)]' 
              : seconds > 0
                ? 'bg-white/[0.08] text-[#0a84ff] border border-white/[0.12] hover:bg-white/[0.12]'
                : 'bg-white/[0.06] hover:bg-white/[0.10] text-[#0a84ff] border border-white/[0.08]'
          }`}
          title={timerActive ? 'Pause Stopwatch' : 'Start Stopwatch'}
        >
          <Clock className="w-4.5 h-4.5 text-[#0a84ff]" />
          <span className="tracking-wider">
            {formatTimer(seconds)}
          </span>

          {seconds > 0 && (
            <button
              onClick={handleResetTimer}
              className="p-1 rounded-lg hover:bg-white/[0.15] text-[#0a84ff] transition-all ml-0.5 cursor-pointer active:scale-90"
              title="Reset Stopwatch"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Streak Badge */}
        <div 
          className="h-10 px-3 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#ff9f0a] cursor-default shadow-sm hidden sm:flex"
          title="Daily Challenge Streak"
        >
          <Flame className="w-4 h-4 fill-[#ff9f0a] text-[#ff9f0a]" />
          <span>0</span>
        </div>

        {/* User Account / Auth Controls */}
        <AuthControls variant="navbar" />
      </div>
    </header>
  );
};
