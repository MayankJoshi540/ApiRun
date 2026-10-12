'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { challenges as defaultChallenges } from '@/data/challenges';
import { ChallengeDetailView } from '@/components/ChallengeDetailView';
import { useAuth } from '@/context/AuthContext';
import { loadUserProgress, recordChallengeSolved, applyUserProgressToChallenges } from '@/lib/userProgress';
import { notFound } from 'next/navigation';
import { Challenge } from '@/types';
import { WorkbenchSkeleton } from '@/components/ui/Skeleton';
import { MobileWorkbenchBanner } from '@/components/MobileWorkbenchBanner';
import { WalkthroughSpotlight, TourStep } from '@/components/WalkthroughSpotlight';

const WORKBENCH_TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-workbench-target-url',
    title: 'Target API Server (Localhost Port)',
    description: 'Direct live test assertions to your running backend (defaults to http://localhost:8000). You can edit this directly to test custom local ports, Docker containers, or staging URLs.',
    preferredPlacement: 'bottom',
  },
  {
    targetId: 'tour-workbench-specs',
    title: 'API Specification & Invariants',
    description: 'Review the required endpoints, HTTP response schemas, status codes, and concurrency requirements before writing code.',
    preferredPlacement: 'right',
  },
  {
    targetId: 'tour-workbench-editor',
    title: 'Multi-Language IDE Workbench',
    description: 'Implement your solution directly in Node.js, Go, or Python. Your code is preserved automatically as you type.',
    preferredPlacement: 'left',
  },
  {
    targetId: 'tour-workbench-runner',
    title: 'Run Tests & Submit Solutions',
    description: 'Fire concurrency suites and edge-case payloads to verify your server, or submit your solution for official evaluation.',
    preferredPlacement: 'left',
  },
  {
    targetId: 'tour-workbench-console',
    title: 'Live Terminal & Assertions Dock',
    description: 'Inspect live execution results, HTTP response payloads, test durations, and terminal logs in real-time.',
    preferredPlacement: 'left',
  },
];

interface Props {
  params: any;
}

export default function ChallengeDetailPage({ params }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [challengesList, setChallengesList] = useState<Challenge[]>(defaultChallenges);

  // Unwrap params using React 19 use()
  const resolvedParams = params && typeof (params as any).then === 'function'
    ? React.use(params as Promise<{ slug: string }>)
    : (params as { slug: string });

  const slug = resolvedParams?.slug || '';

  // Synchronize challenge state with user's personal Firestore progress
  useEffect(() => {
    async function syncProgress() {
      const progress = await loadUserProgress(user?.uid);
      setChallengesList(applyUserProgressToChallenges(defaultChallenges, progress));
    }
    syncProgress();
  }, [user?.uid]);

  const challenge = challengesList.find(c => c.slug === slug);

  if (!slug) {
    return <WorkbenchSkeleton />;
  }

  if (!challenge) {
    notFound();
  }

  const handleChallengeSolved = async (challengeId: string, submission?: { code: string; language: string; testsPassed: number }) => {
    // 1. Optimistic local state update
    setChallengesList(prev =>
      prev.map(c => c.id === challengeId ? { ...c, status: 'SOLVED' } : c)
    );

    // 2. Persist to Firestore under user document
    try {
      await recordChallengeSolved(user?.uid, challengeId, submission);
    } catch (err) {
      console.error('Failed to save challenge solve to Firestore:', err);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#000000] text-[#f5f5f7] font-sans antialiased relative selection:bg-white/20 selection:text-white">
      {/* Background Decor & Ambient Canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/backgrounds/challenges-bg.png"
          alt="Ambient Background"
          fill
          className="object-cover object-top opacity-35"
          priority
        />
        <div className="absolute inset-0 bg-[#000000]/75 backdrop-blur-2xl pointer-events-none" />
      </div>

      {/* Mobile Device Advisory Banner */}
      <MobileWorkbenchBanner />

      {/* First-Visit Walkthrough for Authenticated Developers */}
      <WalkthroughSpotlight tourKey="workbench" steps={WORKBENCH_TOUR_STEPS} />

      <div className="relative z-10 h-full w-full">
        <ChallengeDetailView
          challenge={challenge}
          challengesList={challengesList}
          onBack={() => router.push('/challenges')}
          onChallengeSolved={handleChallengeSolved}
          onNavigateProgress={() => router.push('/progress')}
        />
      </div>
    </div>
  );
}
