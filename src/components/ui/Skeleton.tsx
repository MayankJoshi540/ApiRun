'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div 
      className={`bg-white/[0.04] animate-pulse rounded-lg ${className}`} 
    />
  );
};

export const SkeletonNavbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 pt-4">
      <div className="max-w-7xl mx-auto h-14 rounded-full bg-[#1c1c1e]/60 backdrop-blur-2xl border border-white/[0.08] px-5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2.5">
          <Skeleton className="w-8 h-8 rounded-xl bg-white/[0.08]" />
          <Skeleton className="w-20 h-4 rounded-md" />
        </div>
        {/* Nav tabs */}
        <div className="hidden sm:flex items-center space-x-2">
          <Skeleton className="w-20 h-7 rounded-full" />
          <Skeleton className="w-20 h-7 rounded-full" />
          <Skeleton className="w-20 h-7 rounded-full" />
        </div>
        {/* User CTA */}
        <div className="flex items-center space-x-2">
          <Skeleton className="w-24 h-8 rounded-full bg-white/[0.08]" />
        </div>
      </div>
    </header>
  );
};

export const WorkbenchSkeleton: React.FC = () => {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#000000] text-[#f5f5f7] flex flex-col p-2.5 sm:p-3 space-y-2.5">
      {/* Top Toolbar Skeleton */}
      <div className="h-12 w-full rounded-2xl bg-[#1c1c1e]/70 border border-white/[0.08] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-24 h-7 rounded-full bg-white/[0.08]" />
          <Skeleton className="w-36 h-4 rounded-md bg-white/[0.04]" />
        </div>
        <div className="flex items-center space-x-2.5">
          <Skeleton className="w-48 h-7 rounded-full bg-white/[0.06]" />
          <Skeleton className="w-20 h-7 rounded-full bg-white/[0.05]" />
          <Skeleton className="w-24 h-7 rounded-full bg-white/[0.08]" />
        </div>
      </div>

      {/* Split Panels */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-2.5 min-h-0">
        {/* Left Spec Card */}
        <div className="lg:col-span-5 rounded-2xl bg-[#1c1c1e]/70 border border-white/[0.08] p-5 flex flex-col space-y-4">
          <div className="flex space-x-2">
            <Skeleton className="w-24 h-7 rounded-lg bg-white/[0.08]" />
            <Skeleton className="w-24 h-7 rounded-lg bg-white/[0.04]" />
            <Skeleton className="w-20 h-7 rounded-lg bg-white/[0.04]" />
          </div>
          <Skeleton className="w-48 h-6 rounded-md bg-white/[0.08]" />
          <div className="space-y-2 pt-2">
            <Skeleton className="w-full h-3.5 rounded-md" />
            <Skeleton className="w-5/6 h-3.5 rounded-md" />
            <Skeleton className="w-4/6 h-3.5 rounded-md" />
          </div>
          <div className="flex-grow rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 space-y-2 mt-4">
            <Skeleton className="w-32 h-4 rounded-md bg-white/[0.06]" />
            <Skeleton className="w-full h-3 rounded-md" />
            <Skeleton className="w-3/4 h-3 rounded-md" />
          </div>
        </div>

        {/* Right Editor & Console Card */}
        <div className="lg:col-span-7 flex flex-col space-y-2.5 min-h-0">
          <div className="flex-grow rounded-2xl bg-[#1c1c1e]/70 border border-white/[0.08] p-4 flex flex-col space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
              <Skeleton className="w-32 h-7 rounded-lg bg-white/[0.06]" />
              <div className="flex space-x-2">
                <Skeleton className="w-20 h-7 rounded-lg bg-white/[0.06]" />
                <Skeleton className="w-20 h-7 rounded-lg bg-white/[0.08]" />
              </div>
            </div>
            {/* Editor mock code lines */}
            <div className="space-y-2.5 pt-2">
              <Skeleton className="w-64 h-3.5 rounded-md bg-white/[0.05]" />
              <Skeleton className="w-48 h-3.5 rounded-md bg-white/[0.05]" />
              <Skeleton className="w-80 h-3.5 rounded-md bg-white/[0.05]" />
              <Skeleton className="w-56 h-3.5 rounded-md bg-white/[0.05]" />
              <Skeleton className="w-40 h-3.5 rounded-md bg-white/[0.05]" />
            </div>
          </div>
          {/* Bottom Console Dock */}
          <div className="h-36 rounded-2xl bg-[#1c1c1e]/70 border border-white/[0.08] p-4 space-y-2.5 shrink-0">
            <div className="flex space-x-2">
              <Skeleton className="w-20 h-6 rounded-md bg-white/[0.08]" />
              <Skeleton className="w-24 h-6 rounded-md bg-white/[0.04]" />
            </div>
            <Skeleton className="w-full h-16 rounded-xl bg-white/[0.02]" />
          </div>
        </div>
      </div>
    </div>
  );
};

