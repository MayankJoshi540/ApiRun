'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { challenges as defaultChallenges } from '@/data/challenges';
import { LandingNavbar } from '@/components/LandingNavbar';
import { LandingPageView } from '@/components/LandingPageView';
import { Challenge } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [challengesList] = useState<Challenge[]>(defaultChallenges);

  const handleSelectChallenge = (challenge: Challenge) => {
    router.push(`/challenges/${challenge.slug}`);
  };

  const handleNavigate = (route: 'landing' | 'challenges' | 'progress') => {
    if (route === 'landing') {
      router.push('/');
    } else {
      router.push(`/${route}`);
    }
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
          onExploreChallenges={() => router.push('/challenges')}
          onNavigateProgress={() => router.push('/progress')}
        />
      </main>
    </div>
  );
}
