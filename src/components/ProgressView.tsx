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
  Sparkles,
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
  const [profileLocation, setProfileLocation] = useState('San Francisco, CA');
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
      setProfileLocation(editForm.location.trim() || 'San Francisco, CA');
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
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<'ALL' | 'CORE' | 'SECURITY' | 'DISTRIBUTED'>('ALL');
  const [searchHistory, setSearchHistory] = useState('');

  const solvedChallenges = useMemo(() => challenges.filter(c => c.status === 'SOLVED'), [challenges]);
  const inProgressChallenges = useMemo(() => challenges.filter(c => c.status === 'IN_PROGRESS'), [challenges]);
  const totalChallenges = challenges.length;
  const solvedCount = solvedChallenges.length;
  const solvedPercent = totalChallenges > 0 ? Math.round((solvedCount / totalChallenges) * 100) : 0;

  // Breakdown by LeetCode difficulty tiers
  const easyChallenges = useMemo(() => challenges.filter(c => c.difficulty === 'BEGINNER'), [challenges]);
  const mediumChallenges = useMemo(() => challenges.filter(c => c.difficulty === 'INTERMEDIATE'), [challenges]);
  const hardChallenges = useMemo(() => challenges.filter(c => c.difficulty === 'ADVANCED'), [challenges]);

  const easySolved = useMemo(() => solvedChallenges.filter(c => c.difficulty === 'BEGINNER').length, [solvedChallenges]);
  const mediumSolved = useMemo(() => solvedChallenges.filter(c => c.difficulty === 'INTERMEDIATE').length, [solvedChallenges]);
  const hardSolved = useMemo(() => solvedChallenges.filter(c => c.difficulty === 'ADVANCED').length, [solvedChallenges]);

  // Skill Tags (LeetCode style: Advanced, Intermediate, Fundamental)
  const skillTags = [
    { name: 'Input Validation', count: 1, total: 2, level: 'CORE' },
    { name: 'HTTP Protocol & REST', count: 1, total: 3, level: 'CORE' },
    { name: 'Database CRUD & SQL', count: 0, total: 2, level: 'CORE' },
    { name: 'JWT Authentication', count: 0, total: 1, level: 'SECURITY' },
    { name: 'Rate Limiting Algorithms', count: 0, total: 1, level: 'SECURITY' },
    { name: 'Security & CORS Headers', count: 0, total: 1, level: 'SECURITY' },
    { name: 'Redis In-Memory Cache', count: 0, total: 2, level: 'DISTRIBUTED' },
    { name: 'Concurrency & Mutex Locks', count: 0, total: 1, level: 'DISTRIBUTED' },
    { name: 'Idempotency Keys', count: 0, total: 1, level: 'DISTRIBUTED' },
    { name: 'Webhook Event Dispatch', count: 0, total: 1, level: 'DISTRIBUTED' },
    { name: 'Background Message Queues', count: 0, total: 1, level: 'DISTRIBUTED' },
  ];

  const filteredSkills = useMemo(() => {
    if (selectedSkillCategory === 'ALL') return skillTags;
    return skillTags.filter(s => s.level === selectedSkillCategory);
  }, [selectedSkillCategory]);

  // Badges showcase (LeetCode Badges)
  const badges = [
    { id: 'b1', name: 'First AC', desc: 'Solved 1st backend challenge', date: 'Sep 2026', unlocked: true, icon: Zap, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'b2', name: 'Validation Master', desc: 'Passed all input validation suites', date: 'Sep 2026', unlocked: true, icon: CheckCircle2, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    { id: 'b3', name: 'Sub-15ms Latency', desc: 'Average latency under 20ms', date: 'Active', unlocked: true, icon: Cpu, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'b4', name: 'Idempotency Key', desc: 'Completed safe retry API', date: 'Locked', unlocked: false, icon: RefreshCw, color: 'text-zinc-500 bg-zinc-900/40 border-zinc-800/80' },
    { id: 'b5', name: 'JWT Auth Sentinel', desc: 'Bearer token crypto verify', date: 'Locked', unlocked: false, icon: Key, color: 'text-zinc-500 bg-zinc-900/40 border-zinc-800/80' },
    { id: 'b6', name: 'Production 50 AC', desc: '50 challenges completed', date: 'Locked', unlocked: false, icon: Award, color: 'text-zinc-500 bg-zinc-900/40 border-zinc-800/80' }
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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans select-none text-slate-100 antialiased">
      
      {/* Save Success Alert */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
            <span>Profile and bio updated successfully!</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(false)} className="text-zinc-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2-COLUMN LEETCODE DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: USER PROFILE, STATS & LANGUAGE METRICS (LEETCODE PROFILE)   */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Profile Card */}
          <div className="rounded-2xl bg-[#0b0f17] border border-white/[0.08] p-6 sm:p-7 space-y-6 shadow-xl relative overflow-hidden group">
            {/* Edit Profile Action Button */}
            <div className="absolute top-5 right-5 z-10">
              <button
                onClick={handleOpenEditModal}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-emerald-500/50 text-xs font-semibold text-zinc-300 hover:text-emerald-400 transition-all duration-150 active:scale-95 shadow-sm group"
                title="Edit bio and profile info"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Edit Bio</span>
              </button>
            </div>

            {/* Avatar & Identifiers */}
            <div className="flex items-center space-x-4 pr-16">
              <div className="relative shrink-0">
                {displayPhoto ? (
                  <img
                    src={displayPhoto}
                    alt={displayName}
                    className="w-16 h-16 rounded-2xl object-cover border border-white/[0.12] shadow-inner"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1e293b] border border-white/[0.12] flex items-center justify-center text-xl font-bold text-emerald-400 shadow-inner font-display">
                    {initials}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0b0f17] flex items-center justify-center">
                  <Check className="w-3 h-3 text-black stroke-[3]" />
                </div>
              </div>

              <div className="space-y-1 min-w-0">
                <h1 className="text-xl font-bold text-white tracking-tight font-display truncate">
                  {displayName}
                </h1>
                <div className="text-xs text-slate-400 font-sans truncate">{handle}</div>
                <div className="text-xs text-emerald-400 font-medium flex items-center space-x-1.5 pt-0.5">
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    {profileTitle} · {solvedCount > 3 ? 'Level 3 Architect' : solvedCount > 0 ? 'Level 2 Engineer' : 'Level 1 Initiate'}
                  </span>
                </div>
              </div>
            </div>

            {/* Custom Bio Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                <span>About Developer</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-sans bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.04]">
                {profileBio}
              </p>
            </div>

            {/* Bio Metadata */}
            <div className="space-y-2.5 pt-4 border-t border-white/[0.08] text-xs text-slate-400">
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{profileLocation}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Code2 className="w-4 h-4 text-slate-500 shrink-0" />
                <a
                  href={`https://github.com/${(profileGithub || handle).replace(/^@/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer truncate"
                >
                  github.com/{(profileGithub || handle).replace(/^@/, '')}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Joined APIRun Beta</span>
              </div>
            </div>

            {/* Community Stats */}
            <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-white/[0.08] text-center">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-lg font-bold text-white">{solvedCount > 0 ? solvedCount + 3 : 4}</div>
                <div className="text-xs text-slate-400 font-medium">Submissions</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-lg font-bold text-emerald-400">{solvedPercent > 0 ? `${solvedPercent}%` : '100%'}</div>
                <div className="text-xs text-slate-400 font-medium">Pass Rate</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-lg font-bold text-sky-400">14.8ms</div>
                <div className="text-xs text-slate-400 font-medium">Avg Latency</div>
              </div>
            </div>
          </div>

          {/* Language Breakdown (LeetCode Language Widget) */}
          <div className="rounded-2xl bg-[#0b0f17] border border-white/[0.08] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Languages Used</span>
              </h2>
              <span className="text-xs text-slate-400">3 Runtimes</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-white font-medium">TypeScript / Node.js</span>
                </div>
                <span className="text-emerald-400 font-bold">1 solved <span className="text-slate-500 font-normal">/ 11 tests</span></span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span className="text-slate-300 font-medium">Go 1.22</span>
                </div>
                <span className="text-slate-400">0 solved</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-slate-300 font-medium">Python (FastAPI)</span>
                </div>
                <span className="text-slate-400">0 solved</span>
              </div>
            </div>
          </div>

          {/* Badges Showcase (LeetCode Badges Widget) */}
          <div className="rounded-2xl bg-[#0b0f17] border border-white/[0.08] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Earned Badges</span>
              </h2>
              <span className="text-xs text-emerald-400 font-semibold">3 Unlocked</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {badges.map(badge => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1.5 transition-all ${
                      badge.unlocked
                        ? `${badge.color} shadow-sm`
                        : 'bg-white/[0.01] border-white/[0.04] text-zinc-600 opacity-60'
                    }`}
                    title={`${badge.name}: ${badge.desc}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-semibold text-white line-clamp-1">{badge.name}</span>
                    <span className="text-[11px] text-slate-400">{badge.date}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: LEETCODE SOLVED GAUGE, HEATMAP, SKILL TAGS & SUBMISSIONS   */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. FAMOUS LEETCODE CIRCULAR SOLVED PROGRESS WIDGET */}
          <div className="rounded-2xl bg-[#0b0f17] border border-white/[0.08] p-6 sm:p-7 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Circular Gauge Ring */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-2">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  {/* SVG Donut Ring */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#1e293b"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#10b981"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * (solvedCount / totalChallenges))}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  
                  {/* Inner text inside circle */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-white tracking-tight">{solvedCount}</span>
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Solved</span>
                    <span className="text-xs text-emerald-400 font-semibold mt-0.5">{solvedPercent}% Total</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-2 font-medium">
                  {solvedCount} of {totalChallenges} Challenges Completed
                </div>
              </div>

              {/* Stacked Difficulty Bars (Easy, Medium, Hard) */}
              <div className="md:col-span-7 space-y-3.5">
                {/* Easy / Beginner */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-emerald-400 font-bold text-sm">Easy</span>
                      <span className="text-white font-bold">{easySolved} <span className="text-slate-500 font-normal">/ {easyChallenges.length}</span></span>
                    </div>
                    <span className="text-emerald-400 text-xs font-semibold">Beats 84.2%</span>
                  </div>
                  <div className="w-full bg-white/[0.08] rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                      style={{ width: `${easyChallenges.length > 0 ? (easySolved / easyChallenges.length) * 100 : 0}%` }} 
                    />
                  </div>
                </div>

                {/* Medium / Intermediate */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-sky-400 font-bold text-sm">Medium</span>
                      <span className="text-white font-bold">{mediumSolved} <span className="text-slate-500 font-normal">/ {mediumChallenges.length}</span></span>
                    </div>
                    <span className="text-slate-400 text-xs">Beats 0.0%</span>
                  </div>
                  <div className="w-full bg-white/[0.08] rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-sky-400 rounded-full transition-all duration-500" 
                      style={{ width: `${mediumChallenges.length > 0 ? (mediumSolved / mediumChallenges.length) * 100 : 0}%` }} 
                    />
                  </div>
                </div>

                {/* Hard / Advanced */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-rose-400 font-bold text-sm">Hard</span>
                      <span className="text-white font-bold">{hardSolved} <span className="text-slate-500 font-normal">/ {hardChallenges.length}</span></span>
                    </div>
                    <span className="text-slate-400 text-xs">Beats 0.0%</span>
                  </div>
                  <div className="w-full bg-white/[0.08] rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-rose-400 rounded-full transition-all duration-500" 
                      style={{ width: `${hardChallenges.length > 0 ? (hardSolved / hardChallenges.length) * 100 : 0}%` }} 
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 2. REAL SUBMISSION HEATMAP ACTIVITY CALENDAR */}
          <SubmissionHeatmap
            submissions={userProgress?.submissions || {}}
            streak={userProgress?.streak || userStats.currentStreak}
            solvedCount={solvedCount}
          />

          {/* 3. SKILL TAGS (LEETCODE SKILL TAGS MATRIX) */}
          <div className="rounded-2xl bg-[#0b0f17] border border-white/[0.08] p-6 sm:p-7 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">
                  Skills &amp; Concept Mastery
                </h2>
              </div>

              {/* Tag Categories */}
              <div className="flex items-center space-x-1 bg-white/[0.03] border border-white/[0.08] p-1 rounded-xl text-xs">
                {(['ALL', 'CORE', 'SECURITY', 'DISTRIBUTED'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedSkillCategory(cat)}
                    className={`px-3 py-1 rounded-lg font-medium text-xs transition-all duration-150 active:scale-95 ${
                      selectedSkillCategory === cat
                        ? 'bg-white/[0.12] text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat === 'ALL' ? 'All' : cat === 'CORE' ? 'Core HTTP' : cat === 'SECURITY' ? 'Security' : 'Distributed'}
                  </button>
                ))}
              </div>
            </div>

            {/* LeetCode Style Pill Tags */}
            <div className="flex flex-wrap gap-2.5 text-xs">
              {filteredSkills.map(skill => {
                const isCompleted = skill.count >= skill.total && skill.total > 0;
                const isInProgress = skill.count > 0;

                return (
                  <div
                    key={skill.name}
                    className={`px-3.5 py-1.5 rounded-xl border flex items-center space-x-2 transition-all duration-150 hover:scale-[1.02] ${
                      isCompleted
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold shadow-sm'
                        : isInProgress
                        ? 'bg-sky-500/15 border-sky-500/40 text-sky-400 font-semibold'
                        : 'bg-white/[0.02] border-white/[0.08] text-slate-300'
                    }`}
                  >
                    <span>{skill.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                      isCompleted ? 'bg-emerald-500/20 text-emerald-300' : isInProgress ? 'bg-sky-500/20 text-sky-300' : 'bg-white/[0.06] text-slate-400'
                    }`}>
                      x{skill.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. RECENT SUBMISSIONS / CHALLENGE ACTIVITY (LEETCODE TABLE) */}
          <div className="rounded-2xl bg-[#0b0f17] border border-white/[0.08] overflow-hidden shadow-xl">
            {/* Header with Search and Tab filters */}
            <div className="p-5 bg-white/[0.02] border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">
                  Recent Submissions ({filteredSubmissions.length})
                </h2>
              </div>

              <div className="flex items-center space-x-2.5">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchHistory}
                    onChange={e => setSearchHistory(e.target.value)}
                    placeholder="Search challenges..."
                    className="w-48 pl-8 pr-3 py-1.5 bg-[#080c14] border border-white/[0.1] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                {/* Status Tabs */}
                <div className="flex items-center space-x-1 bg-[#080c14] border border-white/[0.08] p-1 rounded-xl text-xs">
                  {(['ALL', 'AC', 'IN_PROGRESS'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setSelectedSubmissionsTab(tab)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95 ${
                        selectedSubmissionsTab === tab
                          ? 'bg-white/[0.12] text-white font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab === 'ALL' ? 'All' : tab === 'AC' ? 'Accepted' : 'In Progress'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080c14] border-b border-white/[0.06] text-slate-400 font-semibold text-xs">
                  <tr>
                    <th className="py-3.5 px-5">CHALLENGE</th>
                    <th className="py-3.5 px-5">TIME</th>
                    <th className="py-3.5 px-5">STATUS</th>
                    <th className="py-3.5 px-5">RUNTIME</th>
                    <th className="py-3.5 px-5">LANGUAGE</th>
                    <th className="py-3.5 px-5 text-right">ACTION</th>
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
                          className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                          onClick={() => onSelectChallenge(c)}
                        >
                          <td className="py-4 px-5">
                            <div className="font-bold text-white text-sm hover:text-emerald-400 transition-colors">
                              {c.title}
                            </div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">
                              {c.endpoints?.[0]?.path || '/api'}
                            </div>
                          </td>

                          <td className="py-4 px-5 text-slate-300">
                            {isSolved ? '2 hours ago' : 'Recently'}
                          </td>

                          <td className="py-4 px-5">
                            {isSolved ? (
                              <span className="text-emerald-400 font-bold flex items-center space-x-1.5">
                                <CheckCircle className="w-4 h-4" />
                                <span>Accepted</span>
                              </span>
                            ) : isInProgress ? (
                              <span className="text-amber-400 font-semibold">In Progress</span>
                            ) : (
                              <span className="text-slate-500">Unsolved</span>
                            )}
                          </td>

                          <td className="py-4 px-5 text-slate-200 font-mono">
                            {isSolved ? '14.8 ms' : '—'}
                          </td>

                          <td className="py-4 px-5 text-slate-300">
                            <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs">
                              TypeScript
                            </span>
                          </td>

                          <td className="py-4 px-5 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectChallenge(c);
                              }}
                              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.06] hover:bg-emerald-500 text-white hover:text-black border border-white/[0.1] transition-all duration-150 active:scale-95"
                            >
                              <span>{isSolved ? 'Review' : 'Solve'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400 text-xs">
                        No submissions matching your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* EDIT DEVELOPER BIO & PROFILE MODAL                                         */}
      {/* ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="rounded-3xl bg-[#0b0f17] border border-white/[0.12] p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">Edit Developer Bio &amp; Profile</h3>
                  <p className="text-xs text-zinc-400">Personalize your public backend developer card</p>
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
              
              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium text-xs flex items-center space-x-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Display Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.displayName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2.5 bg-[#05070a] border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm"
                />
              </div>

              {/* Professional Title */}
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium text-xs flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Role / Headline</span>
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Senior Backend Engineer / Distributed Systems"
                  className="w-full px-3.5 py-2.5 bg-[#05070a] border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm"
                />
              </div>

              {/* Bio Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium text-xs flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Bio / Summary</span>
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {editForm.bio.length}/320
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={320}
                  required
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell the community about your backend engineering stack, distributed systems experience, or what challenges you are mastering..."
                  className="w-full px-3.5 py-2.5 bg-[#05070a] border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs sm:text-sm resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-medium text-xs flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-3.5 py-2.5 bg-[#05070a] border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs"
                  />
                </div>

                {/* GitHub Username */}
                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-medium text-xs flex items-center space-x-1.5">
                    <Code2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>GitHub Username</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.github}
                    onChange={(e) => setEditForm(prev => ({ ...prev, github: e.target.value }))}
                    placeholder="e.g. alexrivera"
                    className="w-full px-3.5 py-2.5 bg-[#05070a] border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSavingProfile}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-xs font-semibold transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-display shadow-[0_4px_20px_rgba(16,185,129,0.25)] transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
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