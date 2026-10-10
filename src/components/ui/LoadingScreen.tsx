'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  message?: string;
  subtext?: string;
  fullScreen?: boolean;
}

const DEFAULT_MESSAGES = [
  'Initializing backend sandbox...',
  'Binding RFC-9110 contract suites...',
  'Preparing automated fuzzing harnesses...',
  'Connecting telemetry pipeline...',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message,
  subtext,
  fullScreen = true,
}) => {
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  useEffect(() => {
    if (message) return;
    const interval = setInterval(() => {
      setActiveMessageIndex(prev => (prev + 1) % DEFAULT_MESSAGES.length);
    }, 1600);
    return () => clearInterval(interval);
  }, [message]);

  const displayMessage = message || DEFAULT_MESSAGES[activeMessageIndex];

  return (
    <div 
      className={`flex items-center justify-center font-sans antialiased text-[#f5f5f7] select-none ${
        fullScreen ? 'fixed inset-0 z-50 bg-[#000000]' : 'w-full py-16'
      }`}
    >
      {/* Ambient background depth */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(48, 209, 88, 0.08), rgba(0, 0, 0, 0) 70%)'
        }}
      />

      {/* Obsidian Card Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full mx-4 px-8 py-9 rounded-3xl bg-[#1c1c1e]/85 backdrop-blur-2xl border border-white/[0.09] border-t-white/[0.18] shadow-[0_24px_64px_rgba(0,0,0,0.6)] text-center animate-cascade-1">
        
        {/* APIRun Logo Frame */}
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-2xl bg-[#2c2c2e]/60 border border-white/[0.12] p-2 flex items-center justify-center shadow-lg relative overflow-hidden">
            <Image
              src="/logo.png"
              alt="APIRun"
              width={52}
              height={52}
              className="object-contain rounded-xl animate-emblem-breath"
              priority
            />
          </div>
          {/* Subtle live indicator dot */}
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#30d158] border-2 border-[#1c1c1e] shadow-sm" />
        </div>

        {/* Wordmark */}
        <div className="space-y-1 mb-6">
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-white">
            APIRun
          </h2>
          <p className="text-[11px] font-mono text-[#86868b] uppercase tracking-wider">
            Backend Engineering Sandbox
          </p>
        </div>

        {/* Indeterminate Apple Progress Bar */}
        <div className="w-48 sm:w-56 h-1 rounded-full bg-white/[0.08] overflow-hidden relative mb-4">
          <div className="bg-[#30d158] h-full rounded-full animate-apirun-bar shadow-[0_0_8px_rgba(48,209,88,0.5)]" />
        </div>

        {/* Dynamic Status Readout */}
        <div className="min-h-[20px] flex items-center justify-center">
          <p className="text-xs text-[#a1a1aa] font-medium tracking-tight animate-in fade-in duration-200">
            {displayMessage}
          </p>
        </div>

        {subtext && (
          <p className="text-[11px] text-[#636366] mt-1">
            {subtext}
          </p>
        )}

        {/* System telemetry footer tags */}
        <div className="flex items-center space-x-2 pt-6 mt-6 border-t border-white/[0.06] text-[10px] font-mono text-[#636366]">
          <span className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
            <span>PORT 8000</span>
          </span>
          <span>•</span>
          <span>HTTP/2 READY</span>
        </div>

      </div>
    </div>
  );
};
