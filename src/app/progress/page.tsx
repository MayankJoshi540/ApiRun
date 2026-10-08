'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { challenges as defaultChallenges, initialUserStats } from '@/data/challenges';
import { BackendRankNavbar } from '@/components/BackendRankNavbar';
import { ProgressView } from '@/components/ProgressView';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { loadUserProgress, applyUserProgressToChallenges } from '@/lib/userProgress';
import { Challenge, UserStats } from '@/types';

export default function ProgressPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [challengesList, setChallengesList] = useState<Challenge[]>(defaultChallenges);
  const [userStats, setUserStats] = useState<UserStats>(initialUserStats);

  useEffect(() => {
    async function syncProgress() {
      const progress = await loadUserProgress(user?.uid);
      const updatedChallenges = applyUserProgressToChallenges(defaultChallenges, progress);
      setChallengesList(updatedChallenges);

      const solvedCount = updatedChallenges.filter(c => c.status === 'SOLVED').length;
      setUserStats(prev => ({
        ...prev,
        solvedCount,
        challengesSolved: solvedCount,
        currentStreak: progress.streak || prev.currentStreak,
      }));
    }

    syncProgress();
  }, [user?.uid]);

  const solvedCount = challengesList.filter(c => c.status === 'SOLVED').length;

  const handleSelectChallenge = (challenge: Challenge) => {
    router.push(`/challenges/${challenge.slug}`);
  };

  const handleNavigate = (tab: 'landing' | 'challenges' | 'progress' | 'feedback' | 'dashboard') => {
    if (tab === 'landing') router.push('/');
    else if (tab === 'challenges' || tab === 'dashboard') router.push('/challenges');
    else if (tab === 'feedback') router.push('/feedback');
    else router.push('/progress');
  };

  return (
    <div className="min-h-screen bg-[#050708] text-[#F5F7FA] font-sans antialiased relative selection:bg-emerald-500/30 selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* Background Decor & Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/progress-background.png"
          alt="Atmospheric Background"
          fill
          className="object-cover object-top opacity-100"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050708]/70 to-[#050708]/95 pointer-events-none" />
        
        {/* Ambient Color Blobs - Vibrant Green Theme */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] bg-[#10b981]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] bg-emerald-600/15 rounded-full blur-[150px]" />
      </div>
      
      <BackendRankNavbar
        activeTab="progress"
        onSelectTab={handleNavigate}
        solvedCount={solvedCount}
        totalCount={challengesList.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20 relative z-10 flex-grow w-full">
        <ProgressView
          userStats={userStats}
          challenges={challengesList}
          onSelectChallenge={handleSelectChallenge}
          userName={user?.displayName || (user?.email ? user.email.split('@')[0] : null)}
          userEmail={user?.email || null}
          userPhotoURL={user?.photoURL || null}
        />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
