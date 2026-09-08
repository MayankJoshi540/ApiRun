'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { challenges as defaultChallenges, initialUserStats } from '@/data/challenges';
import { BackendRankNavbar } from '@/components/BackendRankNavbar';
import { ProgressView } from '@/components/ProgressView';
import { Challenge, UserStats } from '@/types';

export default function ProgressPage() {
  const router = useRouter();
  const [challengesList] = useState<Challenge[]>(defaultChallenges);
  const [userStats] = useState<UserStats>(initialUserStats);

  const solvedCount = challengesList.filter(c => c.status === 'SOLVED').length;

  const handleSelectChallenge = (challenge: Challenge) => {
    router.push(`/challenges/${challenge.slug}`);
  };

  const handleNavigate = (tab: 'landing' | 'challenges' | 'progress' | 'dashboard') => {
    if (tab === 'landing') router.push('/');
    else if (tab === 'challenges' || tab === 'dashboard') router.push('/challenges');
    else router.push('/progress');
  };

  return (
    <div className="min-h-screen bg-[#050708] text-slate-100 font-sans antialiased relative">
      <BackendRankNavbar
        activeTab="progress"
        onSelectTab={handleNavigate}
        solvedCount={solvedCount}
        totalCount={challengesList.length}
      />

      <main className="pb-16">
        <ProgressView
          userStats={userStats}
          challenges={challengesList}
          onSelectChallenge={handleSelectChallenge}
        />
      </main>
    </div>
  );
}
