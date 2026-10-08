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
    <header className="h-14 px-3 sm:px-5 bg-[#0e131f] border-b border-slate-800/80 flex items-center justify-between shrink-0 select-none z-30 text-slate-300">
      {/* ── Left: APIRun Brand Sign + Problem List + Navigation Chevrons ── */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Your Original APIRun Brand Sign */}
        <Link
          href="/"
          className="flex items-center gap-2.5 p-1 rounded-xl hover:opacity-90 transition cursor-pointer shrink-0 group active:scale-95"
          title="APIRun Home"
        >
          <img
            src="/logo.png"
            alt="APIRun"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded"
          />
          <span className="font-extrabold text-base sm:text-lg tracking-tight font-sans hidden xs:inline">
            <span className="text-white">API</span>
            <span className="text-emerald-400">Run</span>
          </span>
        </Link>

        <div className="h-5 w-px bg-slate-800 shrink-0 mx-0.5" />

        {/* Big Problem List Button */}
        <button
          onClick={onBack}
          className="h-9.5 px-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-slate-700/70 transition flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer shrink-0 active:scale-95 shadow-sm"
          title="Back to Problems List"
        >
          <Menu className="w-4 h-4 text-emerald-400" />
          <span>Problem List</span>
        </button>

        {/* Big Navigation Arrows: Prev / Next */}
        <div className="flex items-center gap-1">
          <button
            onClick={onNavigatePrev}
            disabled={!hasPrev}
            className="w-9.5 h-9.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/70 text-slate-300 hover:text-white flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95 shadow-sm"
            title="Previous Problem"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={onNavigateNext}
            disabled={!hasNext}
            className="w-9.5 h-9.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/70 text-slate-300 hover:text-white flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95 shadow-sm"
            title="Next Problem"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>

          {/* Random Problem Shuffle */}
          <button
            onClick={onNavigateRandom}
            className="w-9.5 h-9.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/70 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer active:scale-95 shadow-sm"
            title="Pick Random Problem"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>

        {/* Active Problem Title */}
        <span className="hidden xl:inline text-xs sm:text-sm text-slate-400 font-medium truncate max-w-[220px] pl-1">
          {challenge.title}
        </span>
      </div>

      {/* ── Center: Big Prominent Target API Input ── */}
      <div className="flex items-center gap-2">
        <div 
          onClick={() => inputRef.current?.focus()}
          className="h-10 px-3.5 sm:px-4 rounded-xl bg-[#141b2b] hover:bg-[#182136] border border-slate-700/80 hover:border-slate-600 focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20 flex items-center gap-2.5 transition cursor-text shadow-sm"
          title="Target API Server URL (Click to edit directly)"
        >
          {/* Live Pulsing Emerald Dot */}
          

          {/* Label */}
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0 font-mono">
            <Server className="w-4 h-4 text-emerald-400" />
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
            className="bg-transparent font-mono text-xs sm:text-sm text-emerald-300 font-semibold outline-none w-36 sm:w-56 md:w-64 selection:bg-emerald-500/30 selection:text-white"
            placeholder="http://localhost:8000"
          />
        </div>
      </div>

      {/* ── Right: Big Stopwatch + Streak + Settings + User Profile ── */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* ── BIG PROMINENT STOPWATCH BUTTON ── */}
        <div
          onClick={() => setTimerActive(!timerActive)}
          className={`h-10 px-3.5 sm:px-4 rounded-xl flex items-center gap-2.5 cursor-pointer transition select-none font-mono text-xs sm:text-sm font-bold shadow-sm ${
            timerActive 
              ? 'bg-sky-500/20 text-sky-300 border border-sky-400/60 shadow-sky-500/10 animate-pulse' 
              : seconds > 0
                ? 'bg-slate-800/90 text-sky-400 border border-slate-700 hover:bg-slate-800'
                : 'bg-slate-800/60 hover:bg-slate-700/80 text-sky-400 hover:text-sky-300 border border-slate-700/70'
          }`}
          title={timerActive ? 'Pause Stopwatch' : 'Start Stopwatch'}
        >
          <Clock className="w-4.5 h-4.5 text-sky-400" />
          <span className="tracking-wider">
            {formatTimer(seconds)}
          </span>

          {seconds > 0 && (
            <button
              onClick={handleResetTimer}
              className="p-1 rounded-lg hover:bg-sky-400/20 text-sky-400/80 hover:text-sky-200 transition ml-0.5 cursor-pointer"
              title="Reset Stopwatch"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Streak Badge */}
        <div 
          className="h-10 px-3 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-400 cursor-default shadow-sm hidden sm:flex"
          title="Daily Challenge Streak"
        >
          <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>0</span>
        </div>

        {/* User Account / Auth Controls */}
        <AuthControls variant="navbar" />
      </div>
    </header>
  );
};
