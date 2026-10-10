import React from 'react';
import { Skeleton, SkeletonNavbar } from '@/components/ui/Skeleton';

export default function ChallengesLoading() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#f5f5f7] font-sans antialiased relative overflow-x-hidden">
      
      {/* Navbar Skeleton */}
      <SkeletonNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20 relative z-10 w-full space-y-6">
        
        {/* Catalog Header Card Skeleton */}
        <div className="rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.07] p-6 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="w-56 h-8 rounded-lg bg-white/[0.08]" />
              <Skeleton className="w-96 max-w-full h-4 rounded-md bg-white/[0.04]" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="w-28 h-8 rounded-full bg-white/[0.05]" />
              <Skeleton className="w-24 h-8 rounded-full bg-white/[0.05]" />
            </div>
          </div>
          <Skeleton className="w-full h-1.5 rounded-full bg-white/[0.06]" />
        </div>

        {/* Filter & Search Bar Skeleton */}
        <div className="space-y-3">
          <Skeleton className="w-full h-12 rounded-xl bg-[#1c1c1e]/60 border border-white/[0.07]" />
          
          {/* Track Pills Skeleton */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Skeleton className="w-16 h-8 rounded-full bg-white/[0.06]" />
            <Skeleton className="w-32 h-8 rounded-full bg-white/[0.04]" />
            <Skeleton className="w-24 h-8 rounded-full bg-white/[0.04]" />
            <Skeleton className="w-28 h-8 rounded-full bg-white/[0.04]" />
            <Skeleton className="w-36 h-8 rounded-full bg-white/[0.04]" />
          </div>
        </div>

        {/* Challenge Cards List Skeleton */}
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i}
              className="rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.07] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2.5 flex-grow">
                <div className="flex items-center space-x-2.5">
                  <Skeleton className="w-48 h-5 rounded-md bg-white/[0.08]" />
                  <Skeleton className="w-20 h-5 rounded-full bg-white/[0.05]" />
                </div>
                <Skeleton className="w-full max-w-xl h-3.5 rounded-md bg-white/[0.04]" />
                <div className="flex items-center space-x-2 pt-1">
                  <Skeleton className="w-24 h-6 rounded-md bg-white/[0.05]" />
                  <Skeleton className="w-16 h-6 rounded-md bg-white/[0.05]" />
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <Skeleton className="w-16 h-4 rounded-md bg-white/[0.04]" />
                <Skeleton className="w-24 h-10 rounded-full bg-white/[0.08]" />
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
