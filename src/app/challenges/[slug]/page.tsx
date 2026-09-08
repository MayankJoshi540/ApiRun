'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { challenges as defaultChallenges } from '@/data/challenges';
import { ChallengeDetailView } from '@/components/ChallengeDetailView';
import { notFound } from 'next/navigation';
import { Challenge } from '@/types';

interface Props {
  params: any;
}

export default function ChallengeDetailPage({ params }: Props) {
  const router = useRouter();
  const [challengesList, setChallengesList] = useState<Challenge[]>(defaultChallenges);

  // Safely support both Next.js 14 (synchronous params object) and Next.js 15+ (Promise params)
  const [slug, setSlug] = useState<string>(() => {
    if (params && typeof params.slug === 'string') return params.slug;
    return '';
  });

  useEffect(() => {
    if (params && typeof params.then === 'function') {
      params.then((p: any) => {
        if (p?.slug) setSlug(p.slug);
      });
    } else if (params?.slug) {
      setSlug(params.slug);
    }
  }, [params]);

  const challenge = challengesList.find(c => c.slug === slug);

  if (!slug) {
    return <div className="min-h-screen bg-[#050708]" />;
  }

  if (!challenge) {
    notFound();
  }

  const handleChallengeSolved = (challengeId: string) => {
    setChallengesList(prev =>
      prev.map(c => c.id === challengeId ? { ...c, status: 'SOLVED' } : c)
    );
  };

  return (
    <div className="min-h-screen bg-[#050708] text-slate-100 font-sans antialiased">
      <ChallengeDetailView
        challenge={challenge}
        onBack={() => router.push('/challenges')}
        onChallengeSolved={handleChallengeSolved}
        onNavigateProgress={() => router.push('/progress')}
      />
    </div>
  );
}
