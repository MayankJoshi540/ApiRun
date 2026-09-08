'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { challenges as defaultChallenges, initialUserStats } from '@/data/challenges';
import { BackendRankNavbar } from '@/components/BackendRankNavbar';
import { Sidebar } from '@/components/Sidebar';
import { DashboardView } from '@/components/DashboardView';
import { Challenge, UserStats } from '@/types';

export default function ChallengesPage() {
  const router = useRouter();
  const [challengesList] = useState<Challenge[]>(defaultChallenges);
  const [userStats] = useState<UserStats>(initialUserStats);
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedConcept, setSelectedConcept] = useState('ALL');

  const solvedCount = challengesList.filter(c => c.status === 'SOLVED').length;
  const allConcepts = Array.from(
    new Set(challengesList.flatMap(c => c.concepts))
  );

  const handleSelectChallenge = (challenge: Challenge) => {
    router.push(`/challenges/${challenge.slug}`);
  };

  const handleNavigate = (tab: 'landing' | 'challenges' | 'progress' | 'dashboard') => {
    if (tab === 'landing') router.push('/');
    else if (tab === 'progress') router.push('/progress');
    else router.push('/challenges');
  };

  return (
    <div className="min-h-screen bg-[#050708] text-slate-100 font-sans antialiased relative">
      <BackendRankNavbar
        activeTab="challenges"
        onSelectTab={handleNavigate}
        solvedCount={solvedCount}
        totalCount={challengesList.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-8">
        <Sidebar
          activeTab="challenges"
          onSelectTab={tab => handleNavigate(tab as any)}
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={setSelectedDifficulty}
          selectedConcept={selectedConcept}
          onSelectConcept={setSelectedConcept}
          allConcepts={allConcepts}
          challengesCount={challengesList.length}
          solvedCount={solvedCount}
        />

        <DashboardView
          challenges={challengesList}
          onSelectChallenge={handleSelectChallenge}
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={setSelectedDifficulty}
          selectedConcept={selectedConcept}
          onSelectConcept={setSelectedConcept}
          userStats={userStats}
        />
      </div>
    </div>
  );
}
