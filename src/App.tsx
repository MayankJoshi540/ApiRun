import React, { useState, useEffect } from 'react';
import { Challenge, UserStats } from './types';
import { challenges as initialChallenges, initialUserStats } from './data/challenges';
import { BackendRankNavbar } from './components/BackendRankNavbar';
import { LandingNavbar } from './components/LandingNavbar';
import { LandingPageView } from './components/LandingPageView';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ChallengeDetailView } from './components/ChallengeDetailView';
import { ProgressView } from './components/ProgressView';

export default function App() {
  const [challengesList, setChallengesList] = useState<Challenge[]>(initialChallenges);
  const [userStats, setUserStats] = useState<UserStats>(initialUserStats);
  
  // Route state
  const [currentRoute, setCurrentRoute] = useState<'landing' | 'challenges' | 'progress'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/challenges') return 'challenges';
      if (path === '/progress') return 'progress';
    }
    return 'landing';
  });

  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedConcept, setSelectedConcept] = useState('ALL');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/challenges') {
        setCurrentRoute('challenges');
        setActiveChallenge(null);
      } else if (path === '/progress') {
        setCurrentRoute('progress');
        setActiveChallenge(null);
      } else {
        setCurrentRoute('landing');
        setActiveChallenge(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: 'landing' | 'challenges' | 'progress') => {
    setCurrentRoute(route);
    setActiveChallenge(null);
    const path = route === 'landing' ? '/' : `/${route}`;
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const allConcepts = Array.from(
    new Set(challengesList.flatMap(c => c.concepts))
  );

  const solvedCount = challengesList.filter(c => c.status === 'SOLVED').length;

  const handleSelectChallenge = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setCurrentRoute('challenges');
    if (window.location.pathname !== `/challenges/${challenge.slug}`) {
      window.history.pushState({}, '', `/challenges/${challenge.slug}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleChallengeSolved = (challengeId: string) => {
    setChallengesList(prev =>
      prev.map(c => c.id === challengeId ? { ...c, status: 'SOLVED' } : c)
    );
    setUserStats(prev => {
      return {
        ...prev,
        challengesSolved: prev.challengesSolved + 1,
        totalTestsPassed: prev.totalTestsPassed + 4,
        totalSubmissions: prev.totalSubmissions + 1
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#050708] text-[#f8fafc] font-sans antialiased selection:bg-[#10b981] selection:text-white relative">
      {/* Route-Specific Navbar */}
      {activeChallenge ? null : currentRoute === 'landing' ? (
        <LandingNavbar
          onNavigate={navigateTo}
          onStartBuilding={() => handleSelectChallenge(challengesList[0])}
        />
      ) : (
        <BackendRankNavbar
          activeTab={currentRoute}
          onSelectTab={tab => {
            if (tab === 'landing') {
              navigateTo('landing');
            } else {
              navigateTo(tab as 'challenges' | 'progress');
            }
          }}
          solvedCount={solvedCount}
          totalCount={challengesList.length}
        />
      )}

      {/* Main View Router */}
      {activeChallenge ? (
        <ChallengeDetailView
          challenge={activeChallenge}
          challengesList={challengesList}
          onBack={() => {
            setActiveChallenge(null);
            navigateTo('challenges');
          }}
          onChallengeSolved={handleChallengeSolved}
          onNavigateProgress={() => {
            setActiveChallenge(null);
            navigateTo('progress');
          }}
        />
      ) : currentRoute === 'landing' ? (
        <LandingPageView
          challenges={challengesList}
          onSelectChallenge={handleSelectChallenge}
          onExploreChallenges={() => navigateTo('challenges')}
          onNavigateProgress={() => navigateTo('progress')}
        />
      ) : currentRoute === 'progress' ? (
        <ProgressView
          userStats={userStats}
          challenges={challengesList}
          onSelectChallenge={handleSelectChallenge}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-8">
          {/* Sidebar Navigation & Filters */}
          <Sidebar
            activeTab="challenges"
            onSelectTab={tab => navigateTo(tab as 'challenges' | 'progress')}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={diff => setSelectedDifficulty(diff)}
            selectedConcept={selectedConcept}
            onSelectConcept={c => setSelectedConcept(c)}
            allConcepts={allConcepts}
            challengesCount={challengesList.length}
            solvedCount={solvedCount}
          />

          {/* Main Challenges Dashboard */}
          <DashboardView
            challenges={challengesList}
            onSelectChallenge={handleSelectChallenge}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={diff => setSelectedDifficulty(diff)}
            selectedConcept={selectedConcept}
            onSelectConcept={c => setSelectedConcept(c)}
            userStats={userStats}
          />
        </div>
      )}
    </div>
  );
}
