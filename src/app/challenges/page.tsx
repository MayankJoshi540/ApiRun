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
    <div className="min-h-screen bg-[#0c0f17] text-slate-200 font-sans antialiased relative selection:bg-emerald-500/25 selection:text-slate-100 flex flex-col justify-between">
      
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
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0e1624] to-slate-900/60 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <span className="font-mono text-base font-extrabold">&#123;&bull;&gt;&#125;</span>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white">
                    Free Demo Access: Try &quot;Ping &amp; Health Check API&quot; without logging in!
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Sign in to unlock all other challenges, save code submissions, and track your streak.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => router.push('/challenges/ping-health-api')}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Try Ping Pong
                </button>
                <button
                  onClick={() => router.push('/sign-in?redirect=/challenges')}
                  className="px-3.5 py-1.5 bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-semibold rounded-xl border border-white/[0.1] transition cursor-pointer"
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
