import React from 'react';
import { Skeleton, SkeletonNavbar } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#f5f5f7] font-sans antialiased relative overflow-x-hidden">
      
      {/* Navbar Skeleton */}
      <SkeletonNavbar />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20 relative z-10 w-full space-y-6">
        
        {/* Top Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 pb-1">
          <div className="space-y-2">
            <Skeleton className="w-56 sm:w-72 h-8 rounded-lg bg-white/[0.08]" />
            <Skeleton className="w-80 sm:w-96 h-4 rounded-md bg-white/[0.04]" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="w-28 h-7 rounded-full bg-white/[0.05]" />
            <Skeleton className="w-24 h-7 rounded-full bg-white/[0.05]" />
          </div>
        </div>

        {/* Hero Grid Skeleton (Left Profile / Right Spiral) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left Card Skeleton */}
          <div className="lg:col-span-7 rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.07] p-6 sm:p-7 space-y-6">
            <div className="flex items-start gap-5">
              <Skeleton className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white/[0.08] shrink-0" />
              <div className="space-y-2.5 flex-grow">
                <Skeleton className="w-48 h-6 rounded-md bg-white/[0.08]" />
                <Skeleton className="w-32 h-3.5 rounded-md bg-white/[0.04]" />
                <Skeleton className="w-full h-3.5 rounded-md bg-white/[0.04]" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="w-24 h-6 rounded-full bg-white/[0.05]" />
                  <Skeleton className="w-20 h-6 rounded-full bg-white/[0.05]" />
                </div>
              </div>
            </div>

            {/* Middle Grid Skeleton */}
            <div className="pt-4 border-t border-white/[0.06] space-y-2.5">
              <Skeleton className="w-36 h-3 rounded-md bg-white/[0.04]" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Skeleton className="h-16 rounded-xl bg-white/[0.03]" />
                <Skeleton className="h-16 rounded-xl bg-white/[0.03]" />
                <Skeleton className="h-16 rounded-xl bg-white/[0.03]" />
                <Skeleton className="h-16 rounded-xl bg-white/[0.03]" />
              </div>
            </div>

            {/* Footer Line Skeleton */}
            <div className="pt-4 border-t border-white/[0.06] space-y-2">
              <div className="flex justify-between">
                <Skeleton className="w-44 h-3.5 rounded-md" />
                <Skeleton className="w-12 h-3.5 rounded-md" />
              </div>
              <Skeleton className="w-full h-1.5 rounded-full bg-white/[0.06]" />
            </div>
          </div>

          {/* Right Spiral Card Skeleton */}
          <div className="lg:col-span-5 rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.07] p-6 flex flex-col justify-between space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-white/[0.06]">
              <Skeleton className="w-32 h-4 rounded-md bg-white/[0.06]" />
              <Skeleton className="w-20 h-4 rounded-md bg-white/[0.06]" />
            </div>

            {/* Circular Ring Skeleton */}
            <div className="flex items-center justify-center py-4">
              <div className="w-44 h-44 rounded-full border-4 border-white/[0.06] flex flex-col items-center justify-center space-y-2">
                <Skeleton className="w-16 h-8 rounded-md bg-white/[0.08]" />
                <Skeleton className="w-20 h-3 rounded-md bg-white/[0.04]" />
              </div>
            </div>

            {/* Bottom 3 Pills Skeleton */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.06]">
              <Skeleton className="h-10 rounded-lg bg-white/[0.03]" />
              <Skeleton className="h-10 rounded-lg bg-white/[0.03]" />
              <Skeleton className="h-10 rounded-lg bg-white/[0.03]" />
            </div>
          </div>

        </div>

        {/* 3 Metrics Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-24 rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.07] p-5 flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="w-28 h-3 rounded-md" />
              <Skeleton className="w-20 h-7 rounded-md bg-white/[0.08]" />
            </div>
            <Skeleton className="w-12 h-6 rounded-md bg-white/[0.05]" />
          </div>
          <div className="h-24 rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.07] p-5 flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="w-28 h-3 rounded-md" />
              <Skeleton className="w-20 h-7 rounded-md bg-white/[0.08]" />
            </div>
            <Skeleton className="w-12 h-6 rounded-md bg-white/[0.05]" />
          </div>
          <div className="h-24 rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.07] p-5 flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="w-28 h-3 rounded-md" />
              <Skeleton className="w-20 h-7 rounded-md bg-white/[0.08]" />
            </div>
            <Skeleton className="w-12 h-6 rounded-md bg-white/[0.05]" />
          </div>
        </div>

        {/* Heatmap Section Skeleton */}
        <div className="h-60 rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.07] p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1.5">
              <Skeleton className="w-40 h-4 rounded-md bg-white/[0.08]" />
              <Skeleton className="w-64 h-3 rounded-md bg-white/[0.04]" />
            </div>
            <Skeleton className="w-32 h-6 rounded-full bg-white/[0.05]" />
          </div>
          <Skeleton className="w-full h-36 rounded-xl bg-white/[0.02]" />
        </div>

      </main>
    </div>
  );
}
