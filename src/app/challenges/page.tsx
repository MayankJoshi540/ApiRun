'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
    if (!user && challenge.slug !== 'ping-health-api') {
      router.push(`/sign-in?redirect=${encodeURIComponent(`/challenges/${challenge.slug}`)}`);
      return;
    }
    router.push(`/challenges/${challenge.slug}`);
  };

  const handleNavigate = (tab: 'landing' | 'challenges' | 'progress' | 'feedback' | 'dashboard') => {
    if (tab === 'landing') router.push('/');
    else if (tab === 'progress') {
      if (!user) {
        router.push('/sign-in?redirect=/progress');
      } else {
        router.push('/progress');
      }
    }
    else if (tab === 'feedback') router.push('/feedback');
    else router.push('/challenges');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#f5f5f7] font-sans antialiased relative selection:bg-white/20 selection:text-white flex flex-col justify-between">
      
      {/* Background Decor & Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/backgrounds/challenges-bg.png"
          alt="Challenges Background"
          fill
          className="object-cover object-top opacity-100"
          priority
        />
        <div className="absolute inset-0 bg-[#000000]/40 pointer-events-none" />
      </div>
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
          {!user && (
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#1c1c1e]/70 border border-white/[0.08] border-t-white/[0.14] shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-[#30d158] shrink-0 font-mono text-sm font-semibold">
                  &lt;/&gt;
                </div>
                <div>
                  <p className="text-sm font-semibold text-white tracking-[-0.01em]">
                    Free Demo Access: Try &quot;Ping &amp; Health Check API&quot; without signing in
                  </p>
                  <p className="text-xs text-[#86868b] mt-0.5">
                    Sign in with your developer account to save submissions, track test accuracy, and rank on leaderboards.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => router.push('/challenges/ping-health-api')}
                  className="px-4 py-2 bg-[#30d158] hover:bg-[#34c759] active:scale-95 text-black text-xs font-semibold rounded-full transition-all cursor-pointer shadow-[0_2px_8px_rgba(48,209,88,0.25)]"
                >
                  Try Demo
                </button>
                <button
                  onClick={() => router.push('/sign-in?redirect=/challenges')}
                  className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 text-white text-xs font-medium rounded-full border border-white/[0.1] transition-all cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

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
