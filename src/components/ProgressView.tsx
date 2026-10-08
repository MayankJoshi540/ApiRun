'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Challenge, UserStats } from '../types';
import { 
  CheckCircle2, 
  Terminal, 
  ArrowRight, 
  Award, 
  Shield, 
  Zap, 
  Activity, 
  Flame, 
  Search, 
  Check, 
  Lock, 
  Unlock, 
  Layers, 
  Code2, 
  Cpu, 
  Database, 
  Key, 
  RefreshCw, 
  TrendingUp, 
  BarChart3,
  Clock,
  Server,
  Compass,
  HelpCircle,
  MapPin,
  Calendar,
  CheckCircle,
  Tag,
  ChevronRight,
  Edit3,
  X,
  Loader2,
  Save,
  Globe,
  User as UserIcon
} from '@/components/ui/GoogleIcon';
import { useAuth } from '@/context/AuthContext';
import { loadUserProgress, updateUserProfile, UserProgressRecord } from '@/lib/userProgress';
import { SubmissionHeatmap } from './SubmissionHeatmap';

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

  // Full user progress record
  const [userProgress, setUserProgress] = useState<UserProgressRecord | null>(null);

  // Profile data states
  const [profileBio, setProfileBio] = useState('Practicing production-grade backend engineering with Express, Go, and Python. Focused on resilient APIs, clean validation, and sub-20ms SLAs.');
  const [profileLocation, setProfileLocation] = useState('India');
  const [profileGithub, setProfileGithub] = useState('');
  const [profileTitle, setProfileTitle] = useState('Backend Engineer');
  const [customDisplayName, setCustomDisplayName] = useState('');
  
  // Modal & Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    location: '',
    github: '',
    title: '',
    displayName: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Synchronize profile and submissions with Firestore/localStorage
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

  const handle = profileGithub 
    ? `@${profileGithub.replace(/^@/, '')}` 
    : displayEmail 
      ? `@${displayEmail.split('@')[0]}` 
      : '@apirun_developer';

  const initials = (() => {
    if (displayName && displayName !== 'Backend Engineer') {
      const parts = displayName.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return displayName.slice(0, 2).toUpperCase();
    }
    return 'AP';
  })();

  const handleOpenEditModal = () => {
    setEditForm({
      bio: profileBio,
      location: profileLocation,
      github: profileGithub || (displayEmail ? displayEmail.split('@')[0] : ''),
      title: profileTitle,
      displayName: displayName
    });
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
      if (editForm.displayName.trim()) {
        setCustomDisplayName(editForm.displayName.trim());
      }

      setIsEditModalOpen(false);
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 4000);
    } catch (err) {
      console.error('Failed to update user profile:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const [selectedSubmissionsTab, setSelectedSubmissionsTab] = useState<'ALL' | 'AC' | 'IN_PROGRESS'>('ALL');
  const [searchHistory, setSearchHistory] = useState('');

  const solvedChallenges = useMemo(() => challenges.filter(c => c.status === 'SOLVED'), [challenges]);
  const inProgressChallenges = useMemo(() => challenges.filter(c => c.status === 'IN_PROGRESS'), [challenges]);
  const totalChallenges = challenges.length;
  const solvedCount = solvedChallenges.length;
  
  // Analytics calculations
  const totalAttempted = solvedCount + inProgressChallenges.length || (solvedCount > 0 ? solvedCount + 10 : 12);
  const successRate = totalAttempted > 0 ? Math.round((solvedCount / totalAttempted) * 100) : 0;
  const failedCount = totalAttempted > solvedCount ? totalAttempted - solvedCount : 0;

  // Breakdown by LeetCode difficulty tiers
  const easyChallenges = useMemo(() => challenges.filter(c => c.difficulty === 'BEGINNER'), [challenges]);
  const mediumChallenges = useMemo(() => challenges.filter(c => c.difficulty === 'INTERMEDIATE'), [challenges]);
  const hardChallenges = useMemo(() => challenges.filter(c => c.difficulty === 'ADVANCED'), [challenges]);

  const easySolved = useMemo(() => solvedChallenges.filter(c => c.difficulty === 'BEGINNER').length, [solvedChallenges]);
  const mediumSolved = useMemo(() => solvedChallenges.filter(c => c.difficulty === 'INTERMEDIATE').length, [solvedChallenges]);
  const hardSolved = useMemo(() => solvedChallenges.filter(c => c.difficulty === 'ADVANCED').length, [solvedChallenges]);

  // Skill Tags mapped to list
  const skillTags = [
    { name: 'HTTP Protocol & REST', count: 1, total: 3 },
    { name: 'Input Validation', count: 1, total: 2 },
    { name: 'Database CRUD & SQL', count: 0, total: 2 },
    { name: 'JWT Authentication', count: 0, total: 1 },
    { name: 'Rate Limiting Algorithms', count: 0, total: 1 },
  ];

  // Filtered Submissions List
  const filteredSubmissions = useMemo(() => {
    return challenges.filter(c => {
      if (searchHistory.trim()) {
        const q = searchHistory.toLowerCase();
        if (!c.title.toLowerCase().includes(q) && !c.category.toLowerCase().includes(q)) return false;
      }
      if (selectedSubmissionsTab === 'AC' && c.status !== 'SOLVED') return false;
      if (selectedSubmissionsTab === 'IN_PROGRESS' && c.status !== 'IN_PROGRESS') return false;
      return true;
    });
  }, [challenges, searchHistory, selectedSubmissionsTab]);

  return (
    <div className="w-full space-y-5 sm:space-y-6 font-sans select-none antialiased">
      
      {/* Save Success Alert */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 text-[#34d399] text-sm font-medium flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Profile updated successfully</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(false)} className="text-[#34d399]/70 hover:text-[#34d399] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PROFILE HEADER                                                         */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12] p-5 lg:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative group hover:border-white/[0.12] transition-colors duration-200">
        
        {/* Edit Button */}
        <div className="absolute top-4 right-4 lg:top-6 lg:right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleOpenEditModal}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md border border-white/[0.08] hover:border-[#10b981]/50 text-xs font-medium text-[#a1a1aa] hover:text-[#34d399] transition-all duration-150 active:scale-95 bg-black/40 backdrop-blur-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {/* Left Side: Avatar & Identity */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative shrink-0">
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt={displayName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-white/[0.12]"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/40 border border-white/[0.12] flex items-center justify-center text-2xl font-semibold text-[#f4f4f5]">
                {initials}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#f4f4f5] tracking-tight">
              {displayName}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#a1a1aa]">
              <span className="text-[#34d399] font-medium">{handle}</span>
              <div className="flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-[#52525b]" />
                <span>{profileTitle}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#52525b]" />
                <span>{profileLocation}</span>
              </div>
              <div className="flex items-center space-x-1.5 hover:text-[#f4f4f5] transition-colors">
                <Code2 className="w-3.5 h-3.5 text-[#52525b]" />
                <a href={`https://github.com/${(profileGithub || handle).replace(/^@/, '')}`} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Horizontal Key Metrics */}
        <div className="flex items-center w-full lg:w-auto pt-5 lg:pt-0 border-t border-white/[0.08] lg:border-t-0 divide-x divide-white/[0.08] overflow-x-auto overflow-y-hidden pb-1 lg:pb-0">
          <div className="flex flex-col pr-6 sm:pr-8 shrink-0">
            <span className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-1">Solved</span>
            <span className="text-2xl sm:text-3xl font-semibold text-[#f4f4f5]">{solvedCount}</span>
          </div>
          <div className="flex flex-col px-6 sm:px-8 shrink-0">
            <span className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-1">Total</span>
            <span className="text-2xl sm:text-3xl font-semibold text-[#f4f4f5]">{totalChallenges}</span>
          </div>
          <div className="flex flex-col px-6 sm:px-8 shrink-0">
            <span className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-1">Acceptance Rate</span>
            <span className="text-2xl sm:text-3xl font-semibold text-[#34d399]">{successRate}%</span>
            {totalAttempted > 0 && <span className="text-[10px] text-[#71717a] mt-0.5 whitespace-nowrap">{solvedCount} / {totalAttempted} accepted</span>}
          </div>
          <div className="flex flex-col pl-6 sm:pl-8 hidden sm:flex shrink-0">
            <span className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-1">Avg Latency</span>
            <span className="text-2xl sm:text-3xl font-semibold text-[#f4f4f5]">14.8ms</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ANALYTICS OVERVIEW GRID (4 Columns on large screens)                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* A. Overall Progress */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12] p-5 flex flex-col hover:border-white/[0.12] transition-colors duration-200">
          <h2 className="text-sm font-semibold text-[#f4f4f5] mb-6">Overall Progress</h2>
          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.04)" strokeWidth="4" fill="transparent" />
                <circle 
                  cx="50" cy="50" r="44" stroke="#10b981" strokeWidth="4" fill="transparent" 
                  strokeDasharray="276.46" strokeDashoffset={276.46 - (276.46 * (solvedCount / totalChallenges))} 
                  strokeLinecap="round" className="transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-semibold text-[#f4f4f5] tracking-tight">{solvedCount}</span>
                <span className="text-[10px] font-medium text-[#71717a] uppercase tracking-widest mt-1">Solved</span>
              </div>
            </div>
            <div className="text-sm font-medium text-[#a1a1aa]">
              {solvedCount} / {totalChallenges} challenges
            </div>
          </div>
        </div>

        {/* B. Difficulty Breakdown */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12] p-5 flex flex-col hover:border-white/[0.12] transition-colors duration-200">
          <h2 className="text-sm font-semibold text-[#f4f4f5] mb-6">Difficulty Breakdown</h2>
          <div className="flex-grow flex flex-col justify-center space-y-6">
            
            {/* Easy */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#a1a1aa] font-medium w-16">Easy</span>
                <div className="flex-grow text-center">
                  <span className="text-[#f4f4f5] font-semibold">{easySolved} <span className="text-[#71717a] font-normal">/ {easyChallenges.length}</span></span>
                </div>
                <span className="text-[#10b981] font-medium w-12 text-right">
                  {easyChallenges.length > 0 ? Math.round((easySolved / easyChallenges.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-[#10b981] rounded-full transition-all duration-500" style={{ width: `${easyChallenges.length > 0 ? (easySolved / easyChallenges.length) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Medium */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#a1a1aa] font-medium w-16">Medium</span>
                <div className="flex-grow text-center">
                  <span className="text-[#f4f4f5] font-semibold">{mediumSolved} <span className="text-[#71717a] font-normal">/ {mediumChallenges.length}</span></span>
                </div>
                <span className="text-[#f59e0b] font-medium w-12 text-right">
                  {mediumChallenges.length > 0 ? Math.round((mediumSolved / mediumChallenges.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-[#f59e0b] rounded-full transition-all duration-500" style={{ width: `${mediumChallenges.length > 0 ? (mediumSolved / mediumChallenges.length) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Hard */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#a1a1aa] font-medium w-16">Hard</span>
                <div className="flex-grow text-center">
                  <span className="text-[#f4f4f5] font-semibold">{hardSolved} <span className="text-[#71717a] font-normal">/ {hardChallenges.length}</span></span>
                </div>
                <span className="text-[#f43f5e] font-medium w-12 text-right">
                  {hardChallenges.length > 0 ? Math.round((hardSolved / hardChallenges.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-[#f43f5e] rounded-full transition-all duration-500" style={{ width: `${hardChallenges.length > 0 ? (hardSolved / hardChallenges.length) * 100 : 0}%` }} />
              </div>
            </div>

          </div>
        </div>

        {/* C. Submission Performance */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12] p-5 flex flex-col hover:border-white/[0.12] transition-colors duration-200">
          <h2 className="text-sm font-semibold text-[#f4f4f5] mb-5">Submission Performance</h2>
          
          <div className="space-y-5 flex-grow flex flex-col justify-center">
            <div className="flex flex-col">
              <div className="flex items-end justify-between mb-2">
                <span className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider">Acceptance Rate</span>
                <span className="text-2xl font-semibold text-[#34d399] leading-none">{successRate}%</span>
              </div>
              
              <div className="h-1.5 w-full rounded-full bg-black/40 flex overflow-hidden border border-white/[0.04]">
                <div className="h-full bg-[#10b981] transition-all duration-500" style={{ width: `${successRate}%` }} />
                <div className="h-full bg-zinc-700 transition-all duration-500" style={{ width: `${100 - successRate}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 border border-white/[0.04] p-3 rounded-lg flex flex-col">
                <span className="text-xs font-medium text-[#71717a] mb-1">Accepted</span>
                <span className="text-lg font-semibold text-[#10b981]">{solvedCount}</span>
              </div>
              <div className="bg-black/20 border border-white/[0.04] p-3 rounded-lg flex flex-col">
                <span className="text-xs font-medium text-[#71717a] mb-1">Failed</span>
                <span className="text-lg font-semibold text-[#a1a1aa]">{failedCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.04] mt-auto">
              <span className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider">Avg Runtime</span>
              <span className="text-sm font-semibold text-[#f4f4f5]">14.8ms</span>
            </div>
          </div>
        </div>

        {/* D. Skills & Languages */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12] p-5 flex flex-col hover:border-white/[0.12] transition-colors duration-200">
          
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-[#f4f4f5] mb-4">Top Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skillTags.map(skill => (
                <div key={skill.name} className="px-2.5 py-1.5 rounded-md bg-black/40 border border-white/[0.06] hover:border-[#10b981]/40 hover:bg-[#10b981]/5 transition-colors cursor-default group flex items-center">
                  <span className="text-xs font-medium text-[#a1a1aa] group-hover:text-[#f4f4f5]">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 border-t border-white/[0.04] mt-auto">
            <h2 className="text-sm font-semibold text-[#f4f4f5] mb-3">Languages</h2>
            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 rounded bg-[#38bdf8]/10 border border-[#38bdf8]/20 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                <span className="text-xs font-medium text-[#38bdf8]">TS <span className="opacity-70 ml-1">1</span></span>
              </div>
              <div className="px-2.5 py-1 rounded bg-black/40 border border-white/[0.04] flex items-center space-x-1.5 opacity-50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                <span className="text-xs font-medium text-[#a1a1aa]">Go <span className="opacity-70 ml-1">0</span></span>
              </div>
              <div className="px-2.5 py-1 rounded bg-black/40 border border-white/[0.04] flex items-center space-x-1.5 opacity-50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                <span className="text-xs font-medium text-[#a1a1aa]">Py <span className="opacity-70 ml-1">0</span></span>
              </div>
            </div>
          </div>
          
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. ACTIVITY / SUBMISSION GRAPH                                            */}
      {/* ========================================================================= */}
      <SubmissionHeatmap
        submissions={userProgress?.submissions || {}}
        streak={userProgress?.streak || userStats.currentStreak}
        solvedCount={solvedCount}
      />

      {/* ========================================================================= */}
      {/* 8. RECENT SUBMISSIONS TABLE                                               */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-[#0c0e12]">
        
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-[#f4f4f5]">
            Recent Submissions
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchHistory}
                onChange={e => setSearchHistory(e.target.value)}
                placeholder="Search challenges..."
                className="w-full sm:w-56 pl-8 pr-3 py-1.5 bg-black/40 border border-white/[0.08] rounded-md text-sm text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:border-white/[0.2] transition-colors"
              />
            </div>

            <div className="flex items-center p-0.5 bg-black/40 rounded-md border border-white/[0.04]">
              {(['ALL', 'AC', 'IN_PROGRESS'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setSelectedSubmissionsTab(tab)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all duration-150 ${
                    selectedSubmissionsTab === tab
                      ? 'bg-white/[0.08] text-[#f4f4f5] shadow-sm'
                      : 'text-[#a1a1aa] hover:text-[#f4f4f5]'
                  }`}
                >
                  {tab === 'ALL' ? 'All' : tab === 'AC' ? 'Accepted' : 'Working'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dense Developer Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-white/[0.04] text-[#a1a1aa] font-medium bg-black/20 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 sm:px-5">Challenge</th>
                <th className="py-3 px-4 sm:px-5">Status</th>
                <th className="py-3 px-4 sm:px-5">Runtime</th>
                <th className="py-3 px-4 sm:px-5">Language</th>
                <th className="py-3 px-4 sm:px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map(c => {
                  const isSolved = c.status === 'SOLVED';
                  const isInProgress = c.status === 'IN_PROGRESS';

                  return (
                    <tr 
                      key={c.id} 
                      className="hover:bg-white/[0.02] border-b border-transparent hover:border-white/[0.04] transition-all cursor-pointer group"
                      onClick={() => onSelectChallenge(c)}
                    >
                      <td className="py-3 px-4 sm:px-5">
                        <div className="font-medium text-[#f4f4f5] group-hover:text-[#34d399] transition-colors">
                          {c.title}
                        </div>
                      </td>

                      <td className="py-3 px-4 sm:px-5">
                        {isSolved ? (
                          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] font-medium text-xs border border-[#10b981]/20">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Accepted</span>
                          </span>
                        ) : isInProgress ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[#a1a1aa] font-medium text-xs">
                            In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[#71717a] text-xs">
                            Unsolved
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 sm:px-5 text-[#a1a1aa] font-mono text-[11px]">
                        {isSolved ? '14.8ms' : '—'}
                      </td>

                      <td className="py-3 px-4 sm:px-5">
                        <span className="px-2 py-0.5 rounded-sm bg-[#38bdf8]/10 text-[#38bdf8] text-[11px] font-medium uppercase tracking-wider">
                          TS
                        </span>
                      </td>

                      <td className="py-3 px-4 sm:px-5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectChallenge(c);
                          }}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium text-[#a1a1aa] hover:text-[#f4f4f5] bg-black/40 hover:bg-[#10b981]/10 border border-white/[0.04] hover:border-[#10b981]/30 transition-all group-hover:bg-white/[0.04]"
                        >
                          <span>{isSolved ? 'Review' : 'Solve'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#71717a] text-sm">
                    No submissions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EDIT MODAL                                                                */}
      {/* ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-xl bg-[#0c0e12] border border-white/[0.12] p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#f4f4f5]">Edit Profile</h3>
                <p className="text-xs text-[#a1a1aa] mt-1">Personalize your developer analytics card</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/[0.08] text-[#71717a] hover:text-[#f4f4f5] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <label className="text-[#a1a1aa] font-medium text-xs">Display Name</label>
                <input
                  type="text"
                  required
                  value={editForm.displayName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/40 border border-white/[0.08] rounded-md text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:border-[#34d399] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#a1a1aa] font-medium text-xs">Role</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/40 border border-white/[0.08] rounded-md text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:border-[#34d399] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[#a1a1aa] font-medium text-xs">Bio</label>
                  <span className="text-[10px] text-[#71717a] font-mono">{editForm.bio.length}/320</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={320}
                  required
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/40 border border-white/[0.08] rounded-md text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:border-[#34d399] transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[#a1a1aa] font-medium text-xs">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 bg-black/40 border border-white/[0.08] rounded-md text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:border-[#34d399] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#a1a1aa] font-medium text-xs">GitHub Username</label>
                  <input
                    type="text"
                    value={editForm.github}
                    onChange={(e) => setEditForm(prev => ({ ...prev, github: e.target.value }))}
                    className="w-full px-3 py-2 bg-black/40 border border-white/[0.08] rounded-md text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:border-[#34d399] transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSavingProfile}
                  className="px-4 py-2 rounded-md text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-white/[0.04] text-sm font-medium transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-[#10b981] hover:bg-[#34d399] text-black font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
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