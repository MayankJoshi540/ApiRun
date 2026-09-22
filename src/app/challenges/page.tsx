'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { challenges as defaultChallenges, initialUserStats } from '@/data/challenges';
import { BackendRankNavbar } from '@/components/BackendRankNavbar';
import { Sidebar } from '@/components/Sidebar';
import { DashboardView } from '@/components/DashboardView';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { loadUserProgress, applyUserProgressToChallenges } from '@/lib/userProgress';
import { Challenge, UserStats } from '@/types';

export default function ChallengesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [challengesList, setChallengesList] = useState<Challenge[]>(defaultChallenges);
  const [userStats, setUserStats] = useState<UserStats>(initialUserStats);
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedConcept, setSelectedConcept] = useState('ALL');

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
  const allConcepts = Array.from(
    new Set(challengesList.flatMap(c => c.concepts))
  );

  const handleSelectChallenge = (challenge: Challenge) => {
    router.push(`/challenges/${challenge.slug}`);
  };

  const handleNavigate = (tab: 'landing' | 'challenges' | 'progress' | 'feedback' | 'dashboard') => {
    if (tab === 'landing') router.push('/');
    else if (tab === 'progress') router.push('/progress');
    else if (tab === 'feedback') router.push('/feedback');
    else router.push('/challenges');
  };

  return (
    <div className="min-h-screen bg-[#050708] text-slate-100 font-sans antialiased relative selection:bg-emerald-500/30 selection:text-white flex flex-col justify-between">
      
      <BackendRankNavbar
        activeTab="challenges"
        onSelectTab={handleNavigate}
        solvedCount={solvedCount}
        totalCount={challengesList.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16 flex flex-col lg:flex-row gap-8 relative z-10 flex-grow w-full">
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

        <div className="flex-1 min-w-0">
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
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
