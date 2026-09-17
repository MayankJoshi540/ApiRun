'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { challenges as defaultChallenges } from '@/data/challenges';
import { LandingNavbar } from '@/components/LandingNavbar';
import { LandingPageView } from '@/components/LandingPageView';
import { useAuth } from '@/context/AuthContext';
import { Challenge } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [challengesList] = useState<Challenge[]>(defaultChallenges);

  const handleSelectChallenge = (challenge: Challenge) => {
    if (!user) {
      router.push(`/sign-in?redirect=${encodeURIComponent(`/challenges/${challenge.slug}`)}`);
      return;
    }
    router.push(`/challenges/${challenge.slug}`);
  };

  const handleNavigate = (route: 'landing' | 'challenges' | 'progress' | 'feedback') => {
    if (route === 'landing') {
      router.push('/');
    } else if (route === 'feedback') {
      router.push('/feedback');
    } else {
      if (!user) {
        router.push(`/sign-in?redirect=${encodeURIComponent(`/${route}`)}`);
        return;
      }
      router.push(`/${route}`);
    }
  };

  const handleExploreChallenges = () => {
    if (!user) {
      router.push('/sign-in?redirect=/challenges');
      return;
    }
    router.push('/challenges');
  };

  const handleNavigateProgress = () => {
    if (!user) {
      router.push('/sign-in?redirect=/progress');
      return;
    }
    router.push('/progress');
  };

  return (
    <div className="min-h-screen bg-[#050708] text-slate-100 font-sans antialiased relative">
      <LandingNavbar
        onNavigate={handleNavigate}
      />
      
      <main>
        <LandingPageView
          challenges={challengesList}
          onSelectChallenge={handleSelectChallenge}
          onExploreChallenges={handleExploreChallenges}
          onNavigateProgress={handleNavigateProgress}
        />
      </main>
    </div>
  );
}
