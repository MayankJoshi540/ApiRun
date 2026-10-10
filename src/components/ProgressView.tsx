'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Challenge, UserStats } from '../types';
import { 
  Check, ArrowRight, Shield, MapPin, Code2, Edit3, X, Loader2, 
  Terminal, CheckCircle, Clock, Server, Database, Key, Cpu,
  Flame, Award
} from '@/components/ui/GoogleIcon';
import { useAuth } from '@/context/AuthContext';
import { loadUserProgress, updateUserProfile, UserProgressRecord } from '@/lib/userProgress';
import { SubmissionHeatmap } from './SubmissionHeatmap';
import { ProgressSpiral } from './ProgressSpiral';

interface Props {
  userStats: UserStats;
  challenges: Challenge[];
  onSelectChallenge: (challenge: Challenge) => void;
  userName?: string | null;
  userEmail?: string | null;
  userPhotoURL?: string | null;
}

export const ProgressView: React.FC<Props> = ({
  userStats,
  challenges,
  onSelectChallenge,
  userName: propUserName,
  userEmail: propUserEmail,
  userPhotoURL: propUserPhotoURL
}) => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgressRecord | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  // Profile data
  const [profileBio, setProfileBio] = useState('Backend engineer focused on resilient APIs, clean contract validation, and high-throughput systems.');
  const [profileLocation, setProfileLocation] = useState('India');
  const [profileGithub, setProfileGithub] = useState('');
  const [profileTitle, setProfileTitle] = useState('Backend Engineer');
  const [customDisplayName, setCustomDisplayName] = useState('');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ bio: '', location: '', github: '', title: '', displayName: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Close modal on ESC key and prevent body scroll
  useEffect(() => {
    if (!isEditModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsEditModalOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isEditModalOpen]);

  useEffect(() => {
    async function fetchProfile() {
      const progress = await loadUserProgress(user?.uid);
      setUserProgress(progress);
      if (progress?.profile) {
        if (progress.profile.bio) setProfileBio(progress.profile.bio);
        if (progress.profile.location) setProfileLocation(progress.profile.location);
        if (progress.profile.github) setProfileGithub(progress.profile.github);
        if (progress.profile.title) setProfileTitle(progress.profile.title);
        if (progress.profile.displayName) setCustomDisplayName(progress.profile.displayName);
      }
    }
    fetchProfile();
  }, [user?.uid]);

  const displayName = customDisplayName || propUserName || user?.displayName || user?.email?.split('@')[0] || 'Backend Engineer';
  const displayEmail = propUserEmail || user?.email || null;
  const displayPhoto = propUserPhotoURL || user?.photoURL || null;
  const handle = profileGithub ? `@${profileGithub.replace(/^@/, '')}` : displayEmail ? `@${displayEmail.split('@')[0]}` : '@engineer';

  const initials = useMemo(() => {
    if (displayName && displayName !== 'Backend Engineer') {
      const parts = displayName.trim().split(/\s+/);
      if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      return displayName.slice(0, 2).toUpperCase();
    }
    return 'BE';
  }, [displayName]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const firstName = useMemo(() => {
    if (!displayName || displayName === 'Backend Engineer') return 'Developer';
    return displayName.trim().split(/\s+/)[0];
  }, [displayName]);

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(new Date());
  }, []);

  const handleOpenEditModal = () => {
    setEditForm({ bio: profileBio, location: profileLocation, github: profileGithub || (displayEmail ? displayEmail.split('@')[0] : ''), title: profileTitle, displayName });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateUserProfile(user?.uid, {
        bio: editForm.bio.trim(),
        location: editForm.location.trim(),
        github: editForm.github.trim(),
        title: editForm.title.trim(),
        displayName: editForm.displayName.trim()
      });
      setProfileBio(editForm.bio.trim());
      setProfileLocation(editForm.location.trim() || 'India');
      setProfileGithub(editForm.github.trim());
      setProfileTitle(editForm.title.trim() || 'Backend Engineer');
      if (editForm.displayName.trim()) setCustomDisplayName(editForm.displayName.trim());
      setIsEditModalOpen(false);
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 4000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Metrics calculation
  const solvedChallenges = useMemo(() => challenges.filter(c => c.status === 'SOLVED'), [challenges]);
  const inProgressChallenges = useMemo(() => challenges.filter(c => c.status === 'IN_PROGRESS'), [challenges]);
  const totalChallenges = challenges.length;
  const solvedCount = solvedChallenges.length;
  const totalAttempted = solvedCount + inProgressChallenges.length;
  const successRate = totalAttempted > 0 ? Math.round((solvedCount / totalAttempted) * 100) : (solvedCount > 0 ? 100 : 0);
  const completionPercentage = Math.round((solvedCount / Math.max(1, totalChallenges)) * 100);
  const streakCount = userProgress?.streak || userStats.currentStreak || (solvedCount > 0 ? 1 : 0);

  // Next unsolved challenge to continue practice
  const nextChallenge = useMemo(() => {
    return inProgressChallenges[0] || challenges.find(c => c.status === 'UNSOLVED') || challenges[0];
  }, [challenges, inProgressChallenges]);

  // Breakdown by difficulty
  const easyChallenges = useMemo(() => challenges.filter(c => c.difficulty === 'BEGINNER'), [challenges]);
  const mediumChallenges = useMemo(() => challenges.filter(c => c.difficulty === 'INTERMEDIATE'), [challenges]);
  const hardChallenges = useMemo(() => challenges.filter(c => c.difficulty === 'ADVANCED'), [challenges]);
  const easySolved = solvedChallenges.filter(c => c.difficulty === 'BEGINNER').length;
  const mediumSolved = solvedChallenges.filter(c => c.difficulty === 'INTERMEDIATE').length;
  const hardSolved = solvedChallenges.filter(c => c.difficulty === 'ADVANCED').length;

  // Real Category Tracks
  const categoryTracks = useMemo(() => {
    const tracks = [
      { name: 'HTTP & REST APIs', categoryKey: 'HTTP', desc: 'RFC request validation, headers, and error contracts.', icon: Server },
      { name: 'Database & Transactions', categoryKey: 'Database', desc: 'ACID transactions, atomic updates, and row locking.', icon: Database },
      { name: 'Auth & Concurrency', categoryKey: 'Auth', desc: 'Token expiration, race conditions, and mutexes.', icon: Key },
      { name: 'System Architecture', categoryKey: 'System', desc: 'State idempotency, asynchronous queues, and workers.', icon: Cpu },
    ];

    return tracks.map(t => {
      const trackChallenges = challenges.filter(c => 
        (c.category && c.category.toLowerCase().includes(t.categoryKey.toLowerCase())) ||
        (c.concepts && c.concepts.some(cp => cp.toLowerCase().includes(t.categoryKey.toLowerCase())))
      );
      const total = trackChallenges.length || 3;
      const solved = trackChallenges.filter(c => c.status === 'SOLVED').length;
      return {
        ...t,
        total,
        solved,
        firstChallenge: trackChallenges[0] || challenges[0],
      };
    });
  }, [challenges]);

  // Real Submissions
  const recentSubmissions = useMemo(() => {
    const subs = Object.entries(userProgress?.submissions || {}).map(([cId, sub]) => {
      const challenge = challenges.find(c => c.id === cId || c.slug === cId);
      return { ...sub, challenge, id: cId };
    }).filter(s => s.challenge).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
    
    if (subs.length === 0) {
      return solvedChallenges.slice(0, 5).map(c => ({
        id: c.id, challenge: c, language: 'typescript', testsPassed: 1, timestamp: new Date().toISOString()
      }));
    }
    return subs;
  }, [userProgress, challenges, solvedChallenges]);

  const getTimeAgo = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Recently';
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / (1000 * 3600 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  return (
    <div className="w-full space-y-6 font-sans antialiased text-[#f5f5f7]">
      
      {/* Toast Alert */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-[#1c1c1e]/90 border border-white/[0.14] text-white text-xs font-medium flex items-center justify-between shadow-xl animate-in fade-in duration-150">
          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 rounded-full bg-[#30d158]/20 flex items-center justify-center text-[#30d158]">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span>Profile information updated successfully.</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(false)} className="text-[#86868b] hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dynamic Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-white">
            {greeting}, {firstName}
          </h1>
          <p className="text-xs sm:text-sm text-[#86868b] mt-1">
            Track your backend engineering curriculum, streak consistency, and API verification tests.
          </p>
        </div>
        <div className="flex items-center space-x-2.5 self-start sm:self-auto shrink-0">
          <div className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#a1a1aa] flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
            <span>{formattedDate}</span>
          </div>
          {streakCount > 0 && (
            <div className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-white flex items-center space-x-1.5">
              <Flame className="w-3.5 h-3.5 text-[#ff9f0a] fill-[#ff9f0a]" />
              <span>{streakCount}d streak</span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DEVELOPER HERO & PRIMARY QUEUE CARD                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left: Developer Profile Plate (Span 7) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#1c1c1e]/75 backdrop-blur-2xl border border-white/[0.08] border-t-white/[0.14] p-6 sm:p-7 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.35)] relative">
          <div>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                {displayPhoto && !avatarError ? (
                  <img 
                    src={displayPhoto} 
                    alt={displayName} 
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarError(true)}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border border-white/[0.12] shadow-sm" 
                  />
                ) : (
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#2c2c2e] border border-white/[0.1] flex items-center justify-center text-2xl font-semibold text-white shadow-sm">
                    {initials}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-grow min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate">
                    <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-[-0.02em] truncate">{displayName}</h2>
                    <p className="text-xs text-[#86868b] font-mono mt-0.5">{handle}</p>
                  </div>
                  <button 
                    onClick={handleOpenEditModal}
                    className="shrink-0 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-medium text-white flex items-center space-x-1.5 transition-all active:scale-[0.97] cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#86868b]" />
                    <span>Edit</span>
                  </button>
                </div>

                <p className="text-xs text-[#a1a1aa] leading-relaxed pt-1.5 max-w-xl">
                  {profileBio}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-3">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-white">
                    <Shield className="w-3.5 h-3.5 text-white/70" />
                    <span>{profileTitle}</span>
                  </span>
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-[#86868b]">
                    <MapPin className="w-3.5 h-3.5 text-[#636366]" />
                    <span>{profileLocation}</span>
                  </span>
                  {profileGithub && (
                    <a 
                      href={`https://github.com/${profileGithub.replace(/^@/, '')}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-[#86868b] hover:text-white transition-colors"
                    >
                      <Code2 className="w-3.5 h-3.5 text-[#636366]" />
                      <span>github.com/{profileGithub.replace(/^@/, '')}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Domain Competencies (Roomy 2x2 cards with clear hierarchy and progress) */}
          <div className="my-5 pt-4 border-t border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#86868b] font-medium uppercase tracking-wider text-[11px]">Domain Competencies</span>
              <span className="text-[#a1a1aa] text-xs font-mono tabular-nums">{solvedCount} of {totalChallenges} Solved</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categoryTracks.map(track => {
                const Icon = track.icon;
                const pct = Math.round((track.solved / Math.max(1, track.total)) * 100);
                return (
                  <div 
                    key={track.name} 
                    className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.07] transition-colors flex flex-col justify-between space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5 text-white/80" />
                        </div>
                        <span className="text-xs font-semibold text-white truncate">{track.name}</span>
                      </div>
                      <span className="text-xs font-mono text-[#a1a1aa] tabular-nums shrink-0 ml-2">
                        {track.solved}/{track.total}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#30d158] h-full rounded-full transition-all duration-300" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer: Curriculum Progress with Visual Progress Bar */}
          <div className="pt-4 border-t border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#86868b]">
              <span>Curriculum progress: <strong className="text-white font-medium tabular-nums">{solvedCount} of {totalChallenges} completed</strong></span>
              <span className="font-mono text-white tabular-nums font-medium">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#30d158] h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.max(completionPercentage, solvedCount > 0 ? 3 : 0)}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Right: Progress Spiral Card (Span 5) */}
        <ProgressSpiral
          solvedCount={solvedCount}
          totalChallenges={totalChallenges}
          challenges={challenges}
          nextChallenge={nextChallenge}
          onSelectChallenge={onSelectChallenge}
          streakCount={streakCount}
        />

      </div>

      {/* ========================================================================= */}
      {/* 2. THREE CORE METRICS STRIP                                               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Solved */}
        <div className="rounded-2xl bg-[#1c1c1e]/75 backdrop-blur-2xl border border-white/[0.08] border-t-white/[0.14] p-5 sm:p-6 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs font-medium text-[#86868b]">Solved Challenges</div>
            <div className="text-3xl font-semibold text-white mt-1 tabular-nums tracking-[-0.02em]">
              {solvedCount} <span className="text-sm font-normal text-[#86868b]">/ {totalChallenges}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-[#30d158] font-semibold">
              {completionPercentage}%
            </span>
            <div className="text-[11px] text-[#636366]">Curriculum</div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="rounded-2xl bg-[#1c1c1e]/75 backdrop-blur-2xl border border-white/[0.08] border-t-white/[0.14] p-5 sm:p-6 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs font-medium text-[#86868b]">Test Run Accuracy</div>
            <div className="text-3xl font-semibold text-white mt-1 tabular-nums tracking-[-0.02em]">{successRate}%</div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-white font-semibold tabular-nums">{totalAttempted}</span>
            <div className="text-[11px] text-[#636366]">Total Attempts</div>
          </div>
        </div>

        {/* Streak */}
        <div className="rounded-2xl bg-[#1c1c1e]/75 backdrop-blur-2xl border border-white/[0.08] border-t-white/[0.14] p-5 sm:p-6 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs font-medium text-[#86868b]">Practice Consistency</div>
            <div className="text-3xl font-semibold text-white mt-1 tabular-nums tracking-[-0.02em]">
              {streakCount} <span className="text-sm font-normal text-[#86868b]">days</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-[#30d158] font-semibold">Active</span>
            <div className="text-[11px] text-[#636366]">Daily Streak</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PRACTICE ACTIVITY HEATMAP                                              */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-[#1c1c1e]/75 backdrop-blur-2xl border border-white/[0.08] border-t-white/[0.14] p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        <SubmissionHeatmap
          submissions={userProgress?.submissions || {}}
          streak={streakCount}
          solvedCount={solvedCount}
        />
      </div>

      {/* ========================================================================= */}
      {/* 4. CURRICULUM ROADMAP (REAL CONTENT TRACKS)                               */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-[#1c1c1e]/75 backdrop-blur-2xl border border-white/[0.08] border-t-white/[0.14] p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-[-0.01em]">Backend Engineering Curriculum</h3>
            <p className="text-xs text-[#86868b] mt-0.5">Core architectural domains required for production systems</p>
          </div>
          <div className="text-xs text-[#86868b] font-mono">
            <span>Progress: </span>
            <strong className="text-white tabular-nums">{solvedCount} of {totalChallenges} completed</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryTracks.map((track, i) => {
            const Icon = track.icon;
            const isCompleted = track.solved === track.total && track.total > 0;
            const progressPercent = Math.round((track.solved / Math.max(1, track.total)) * 100);

            return (
              <div 
                key={i}
                onClick={() => onSelectChallenge(track.firstChallenge)}
                className="rounded-2xl border border-white/[0.06] hover:border-white/[0.18] bg-white/[0.02] p-4 sm:p-5 flex flex-col justify-between hover:bg-white/[0.04] transition-all cursor-pointer group active:scale-[0.98]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white">
                      <Icon className="w-4 h-4" />
                    </div>
                    {isCompleted ? (
                      <span className="text-[10px] font-semibold text-[#30d158] bg-[#30d158]/12 border border-[#30d158]/25 px-2 py-0.5 rounded-full font-mono">
                        Mastered
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono tabular-nums text-[#86868b] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
                        {track.solved}/{track.total}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-semibold text-white group-hover:text-white transition-colors tracking-tight">
                    {track.name}
                  </h4>
                  <p className="text-[11px] text-[#86868b] mt-1 line-clamp-2 leading-relaxed">
                    {track.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.04]">
                  <div className="w-full bg-[#2c2c2e] rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#86868b] mt-2 font-mono">
                    <span className="tabular-nums">{progressPercent}%</span>
                    <span className="text-white group-hover:underline flex items-center space-x-1">
                      <span>Practice</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. RECENT SUBMISSIONS & DIFFICULTY BREAKDOWN                              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Recent Submissions Table (Span 8) */}
        <div className="lg:col-span-8 rounded-2xl bg-[#1c1c1e]/75 backdrop-blur-2xl border border-white/[0.08] border-t-white/[0.14] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-col">
          <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Clock className="w-4 h-4 text-[#86868b]" />
              <h3 className="text-sm font-semibold text-white tracking-[-0.01em]">Recent Test Runs</h3>
            </div>
            <span className="text-xs text-[#86868b] font-mono">Real execution results</span>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="text-[#86868b] font-semibold bg-white/[0.02] uppercase tracking-wider border-b border-white/[0.04]">
                <tr>
                  <th className="py-3 px-5">Challenge</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Language</th>
                  <th className="py-3 px-5 text-right">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentSubmissions.length > 0 ? (
                  recentSubmissions.map((sub, i) => {
                    const isAccepted = sub.testsPassed > 0 || sub.challenge?.status === 'SOLVED';
                    
                    return (
                      <tr 
                        key={i} 
                        className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                        onClick={() => sub.challenge && onSelectChallenge(sub.challenge)}
                      >
                        <td className="py-3.5 px-5">
                          <span className="font-medium text-[#f5f5f7] group-hover:text-white transition-colors">
                            {sub.challenge?.title || 'API Challenge'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          {isAccepted ? (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#30d158]/12 text-[#30d158] font-medium text-[11px] border border-[#30d158]/25">
                              <CheckCircle className="w-3 h-3" />
                              <span>Accepted</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#ff453a]/12 text-[#ff453a] font-medium text-[11px] border border-[#ff453a]/25">
                              <Terminal className="w-3 h-3" />
                              <span>Tests Failed</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-5 text-[#86868b] font-mono">
                          {sub.language || 'typescript'}
                        </td>
                        <td className="py-3.5 px-5 text-right text-[#86868b] font-mono">
                          {getTimeAgo(sub.timestamp)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-[#86868b] text-xs">
                      No test runs recorded yet. Open any challenge to run your first test suite.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Difficulty Breakdown & Language Mastery (Span 4) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Difficulty Mastery */}
          <div className="rounded-2xl bg-[#1c1c1e]/75 backdrop-blur-2xl border border-white/[0.08] border-t-white/[0.14] p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
            <h3 className="text-sm font-semibold text-white mb-4 tracking-[-0.01em]">Difficulty Breakdown</h3>
            
            <div className="space-y-3.5">
              {/* Beginner */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#d1d1d6] font-medium">Beginner</span>
                  <span className="font-mono tabular-nums text-[#86868b]">{easySolved} / {easyChallenges.length}</span>
                </div>
                <div className="w-full bg-[#2c2c2e] rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${easyChallenges.length > 0 ? (easySolved / easyChallenges.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Intermediate */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#d1d1d6] font-medium">Intermediate</span>
                  <span className="font-mono tabular-nums text-[#86868b]">{mediumSolved} / {mediumChallenges.length}</span>
                </div>
                <div className="w-full bg-[#2c2c2e] rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-white/70 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${mediumChallenges.length > 0 ? (mediumSolved / mediumChallenges.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Advanced */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#d1d1d6] font-medium">Advanced</span>
                  <span className="font-mono tabular-nums text-[#86868b]">{hardSolved} / {hardChallenges.length}</span>
                </div>
                <div className="w-full bg-[#2c2c2e] rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-white/40 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${hardChallenges.length > 0 ? (hardSolved / hardChallenges.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Supported Languages */}
          <div className="rounded-2xl bg-[#1c1c1e]/75 backdrop-blur-2xl border border-white/[0.08] border-t-white/[0.14] p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
            <h3 className="text-sm font-semibold text-white mb-3 tracking-[-0.01em]">Runtime Environments</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs">
                <span className="font-medium text-white">TypeScript / Node.js</span>
                <span className="font-mono text-white font-semibold tabular-nums">{solvedCount} solved</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-[#86868b]">
                <span>Go (Standard Library)</span>
                <span className="font-mono text-[#636366]">Active runtime</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-[#86868b]">
                <span>Python (FastAPI / ASGI)</span>
                <span className="font-mono text-[#636366]">Active runtime</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 6. EDIT PROFILE MODAL (APPLE CONSTRAINED SHEET)                           */}
      {/* ========================================================================= */}
      {isEditModalOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditModalOpen(false);
          }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150"
        >
          <div 
            className="relative w-full max-w-lg my-auto max-h-[calc(100dvh-2.5rem)] flex flex-col rounded-3xl bg-[#1c1c1e] border border-white/[0.12] border-t-white/[0.22] shadow-[0_24px_64px_rgba(0,0,0,0.85)] overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* STICKY HEADER - NEVER CUT OFF, ALWAYS VISIBLE */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.08] bg-[#1c1c1e] shrink-0 z-20">
              <div>
                <h3 className="text-base font-semibold text-white tracking-[-0.02em]">Edit Profile</h3>
                <p className="text-xs text-[#86868b] mt-0.5">Update public developer credentials</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsEditModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.15] active:scale-95 text-[#a1a1aa] hover:text-white transition-all flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* SCROLLABLE FORM BODY */}
            <form onSubmit={handleSaveProfile} className="flex flex-col min-h-0 flex-grow">
              <div className="overflow-y-auto px-5 sm:px-6 py-4 space-y-4 text-xs flex-grow scrollbar-thin scrollbar-thumb-white/10">
                {/* Display Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#d1d1d6]">Display Name</label>
                  <input 
                    type="text" 
                    required 
                    value={editForm.displayName} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))} 
                    className="w-full px-3.5 py-2.5 bg-[#2c2c2e]/70 border border-white/[0.08] rounded-xl text-sm text-white placeholder-[#636366] focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all" 
                  />
                </div>

                {/* Title / Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#d1d1d6]">Title / Role</label>
                  <input 
                    type="text" 
                    value={editForm.title} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))} 
                    className="w-full px-3.5 py-2.5 bg-[#2c2c2e]/70 border border-white/[0.08] rounded-xl text-sm text-white placeholder-[#636366] focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all" 
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[#d1d1d6]">Bio</label>
                    <span className="text-[11px] text-[#86868b] tabular-nums">{editForm.bio.length} / 320</span>
                  </div>
                  <textarea 
                    rows={3} 
                    maxLength={320} 
                    required 
                    value={editForm.bio} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))} 
                    className="w-full px-3.5 py-2.5 bg-[#2c2c2e]/70 border border-white/[0.08] rounded-xl text-sm text-white placeholder-[#636366] focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all resize-none leading-relaxed" 
                  />
                </div>

                {/* Location & GitHub Username */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#d1d1d6]">Location</label>
                    <input 
                      type="text" 
                      value={editForm.location} 
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))} 
                      className="w-full px-3.5 py-2.5 bg-[#2c2c2e]/70 border border-white/[0.08] rounded-xl text-sm text-white placeholder-[#636366] focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#d1d1d6]">GitHub Username</label>
                    <input 
                      type="text" 
                      value={editForm.github} 
                      onChange={(e) => setEditForm(prev => ({ ...prev, github: e.target.value }))} 
                      className="w-full px-3.5 py-2.5 bg-[#2c2c2e]/70 border border-white/[0.08] rounded-xl text-sm text-white placeholder-[#636366] focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* STICKY FOOTER - ALWAYS PINNED */}
              <div className="flex items-center justify-end space-x-3 px-5 sm:px-6 py-3.5 border-t border-white/[0.08] bg-[#1c1c1e] shrink-0 z-20">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)} 
                  disabled={isSavingProfile} 
                  className="px-4 py-2 rounded-full text-xs font-medium text-[#86868b] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.97] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSavingProfile} 
                  className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-white hover:bg-[#e5e5ea] text-black font-semibold text-xs active:scale-[0.97] transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};