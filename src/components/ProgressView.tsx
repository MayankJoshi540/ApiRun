'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Challenge, UserStats } from '../types';
import { 
  CheckCircle2, Terminal, ArrowRight, Award, Shield, Zap, Activity, Flame, Search, 
  Check, Lock, Unlock, Layers, Code2, Cpu, Database, Key, RefreshCw, TrendingUp, 
  BarChart3, Clock, Server, Compass, HelpCircle, MapPin, Calendar, CheckCircle, 
  Tag, ChevronRight, Edit3, X, Loader2, Save, Globe, User as UserIcon
} from '@/components/ui/GoogleIcon';
import { useAuth } from '@/context/AuthContext';
import { loadUserProgress, updateUserProfile, UserProgressRecord } from '@/lib/userProgress';
import { SubmissionHeatmap } from './SubmissionHeatmap';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    gsap.fromTo('.stagger-item', 
      { opacity: 0, y: 15, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.08, ease: "power3.out", clearProps: "all" }
    );
  }, { scope: containerRef });

  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgressRecord | null>(null);

  // Profile data states
  const [profileBio, setProfileBio] = useState('Building backend skills, one API at a time.');
  const [profileLocation, setProfileLocation] = useState('India');
  const [profileGithub, setProfileGithub] = useState('');
  const [profileTitle, setProfileTitle] = useState('Backend Engineer');
  const [customDisplayName, setCustomDisplayName] = useState('');
  
  // Modal & Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ bio: '', location: '', github: '', title: '', displayName: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

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
  const handle = profileGithub ? `@${profileGithub.replace(/^@/, '')}` : displayEmail ? `@${displayEmail.split('@')[0]}` : '@apirun_developer';

  const initials = (() => {
    if (displayName && displayName !== 'Backend Engineer') {
      const parts = displayName.trim().split(/\s+/);
      if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      return displayName.slice(0, 2).toUpperCase();
    }
    return 'AP';
  })();

  const handleOpenEditModal = () => {
    setEditForm({ bio: profileBio, location: profileLocation, github: profileGithub || (displayEmail ? displayEmail.split('@')[0] : ''), title: profileTitle, displayName });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateUserProfile(user?.uid, {
        bio: editForm.bio.trim(), location: editForm.location.trim(), github: editForm.github.trim(), title: editForm.title.trim(), displayName: editForm.displayName.trim()
      });
      setProfileBio(editForm.bio.trim()); setProfileLocation(editForm.location.trim() || 'India'); setProfileGithub(editForm.github.trim()); setProfileTitle(editForm.title.trim() || 'Backend Engineer');
      if (editForm.displayName.trim()) setCustomDisplayName(editForm.displayName.trim());
      setIsEditModalOpen(false); setSaveSuccessMsg(true); setTimeout(() => setSaveSuccessMsg(false), 4000);
    } catch (err) {
      console.error('Failed to update user profile:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const solvedChallenges = useMemo(() => challenges.filter(c => c.status === 'SOLVED'), [challenges]);
  const inProgressChallenges = useMemo(() => challenges.filter(c => c.status === 'IN_PROGRESS'), [challenges]);
  const totalChallenges = challenges.length;
  const solvedCount = solvedChallenges.length;
  const totalAttempted = solvedCount + inProgressChallenges.length;
  const successRate = totalAttempted > 0 ? Math.round((solvedCount / totalAttempted) * 100) : 0;

  // Breakdown by LeetCode difficulty tiers
  const easyChallenges = useMemo(() => challenges.filter(c => c.difficulty === 'BEGINNER'), [challenges]);
  const mediumChallenges = useMemo(() => challenges.filter(c => c.difficulty === 'INTERMEDIATE'), [challenges]);
  const hardChallenges = useMemo(() => challenges.filter(c => c.difficulty === 'ADVANCED'), [challenges]);
  const easySolved = solvedChallenges.filter(c => c.difficulty === 'BEGINNER').length;
  const mediumSolved = solvedChallenges.filter(c => c.difficulty === 'INTERMEDIATE').length;
  const hardSolved = solvedChallenges.filter(c => c.difficulty === 'ADVANCED').length;

  // Derived Learning Paths
  const learningPaths = useMemo(() => {
    const map: Record<string, { total: number, solved: number }> = {};
    challenges.forEach(c => {
      const cat = c.category || 'General';
      if (!map[cat]) map[cat] = { total: 0, solved: 0 };
      map[cat].total += 1;
      if (c.status === 'SOLVED') map[cat].solved += 1;
    });
    return Object.entries(map).map(([name, data]) => ({ name, ...data }));
  }, [challenges]);

  // Submissions Data
  const recentSubmissions = useMemo(() => {
    const subs = Object.entries(userProgress?.submissions || {}).map(([cId, sub]) => {
      const challenge = challenges.find(c => c.id === cId || c.slug === cId);
      return { ...sub, challenge, id: cId };
    }).filter(s => s.challenge).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
    
    // If no submissions, show recent in-progress or solved from local data as fallback
    if (subs.length === 0) {
      return [...solvedChallenges, ...inProgressChallenges].slice(0, 5).map(c => ({
        id: c.id, challenge: c, language: 'typescript', testsPassed: c.status === 'SOLVED' ? 1 : 0, timestamp: new Date().toISOString()
      }));
    }
    return subs;
  }, [userProgress, challenges, solvedChallenges, inProgressChallenges]);

  const getTimeAgo = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Recently';
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / (1000 * 3600 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  // Challenge Stats Donut Calculation
  const notAttemptedCount = totalChallenges - totalAttempted;
  const errorCount = inProgressChallenges.length; // We map in-progress to Attempted/Error for visualization
  // SVG Donut calculation
  const getStrokeDash = (value: number, total: number, radius: number) => {
    const circumference = 2 * Math.PI * radius;
    const stroke = (value / total) * circumference;
    return `${stroke} ${circumference}`;
  };
  const getStrokeOffset = (startValue: number, total: number, radius: number) => {
    const circumference = 2 * Math.PI * radius;
    return -(startValue / total) * circumference;
  };
  const radius = 44;
  
  return (
    <div ref={containerRef} className="w-full space-y-6 font-sans select-none antialiased">
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 text-[#34d399] text-sm font-medium flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-2"><Check className="w-4 h-4" /><span>Profile updated successfully</span></div>
          <button onClick={() => setSaveSuccessMsg(false)} className="text-[#34d399]/70 hover:text-[#34d399]"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ROW 1: PROFILE HEADER                                                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* Left: Profile Info */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12]/60 backdrop-blur-xl p-5 lg:p-7 flex flex-col justify-center relative group hover:border-white/[0.12] transition-all duration-300 stagger-item">
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button onClick={handleOpenEditModal} className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md border border-white/[0.08] hover:border-[#10b981]/50 text-xs font-medium text-[#a1a1aa] hover:text-[#34d399] bg-black/40 backdrop-blur-sm transition-all duration-150">
              <Edit3 className="w-3.5 h-3.5" /><span>Edit</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
            <div className="relative shrink-0 mt-1">
              {displayPhoto ? (
                <img src={displayPhoto} alt={displayName} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#10b981]/40" />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#18181b] border-2 border-[#10b981]/40 flex items-center justify-center text-3xl font-bold text-[#f4f4f5]">{initials}</div>
              )}
              <div className="absolute bottom-1 right-2 w-5 h-5 bg-[#10b981] border-2 border-[#0c0e12] rounded-full"></div>
            </div>
            <div className="space-y-2 flex-grow">
              <div className="text-[#10b981] text-xs uppercase tracking-widest font-bold">Good to see you back,</div>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f4f4f5] tracking-tight">{displayName}</h1>
                <span className="text-3xl sm:text-4xl inline-block origin-bottom-right">👋</span>
              </div>
              <div className="text-[#34d399] font-semibold text-base">{handle}</div>
              <p className="text-[#a1a1aa] text-sm max-w-sm leading-relaxed pt-1.5 mx-auto sm:mx-0">{profileBio}</p>
              
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-3 pt-4">
                <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-semibold text-xs">
                  <Shield className="w-3.5 h-3.5" /><span>{profileTitle}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs font-medium text-[#71717a]"><MapPin className="w-4 h-4" /><span>{profileLocation}</span></div>
                <div className="flex items-center space-x-1.5 text-xs font-medium text-[#71717a] hover:text-[#a1a1aa] transition-colors"><Code2 className="w-4 h-4" /><a href={`https://github.com/${(profileGithub || handle).replace(/^@/, '')}`} target="_blank" rel="noreferrer">GitHub</a></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Metric Cards (Box Shape) */}
        <div className="grid grid-cols-2 gap-3 lg:gap-4 w-full">
          {/* Solved */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12]/60 backdrop-blur-xl p-4 flex flex-col justify-between hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1 w-full shadow-sm stagger-item">
            <div className="w-8 h-8 rounded bg-[#10b981]/10 flex items-center justify-center mb-3">
              <Check className="w-4 h-4 text-[#10b981]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-[#f4f4f5] leading-none">{solvedCount}</div>
              <div className="text-[11px] sm:text-xs text-[#a1a1aa] mt-1.5 whitespace-nowrap">Solved</div>
            </div>
          </div>

          {/* Total Challenges */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12]/60 backdrop-blur-xl p-4 flex flex-col justify-between hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1 w-full shadow-sm stagger-item">
            <div className="w-8 h-8 rounded bg-[#38bdf8]/10 flex items-center justify-center mb-3">
              <Layers className="w-4 h-4 text-[#38bdf8]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-[#f4f4f5] leading-none">{totalChallenges}</div>
              <div className="text-[11px] sm:text-xs text-[#a1a1aa] mt-1.5 whitespace-nowrap">Total Challenges</div>
            </div>
          </div>

          {/* Success Rate */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12]/60 backdrop-blur-xl p-4 flex flex-col justify-between hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1 w-full shadow-sm stagger-item">
            <div className="w-8 h-8 rounded bg-[#f59e0b]/10 flex items-center justify-center mb-3">
              <BarChart3 className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-[#f4f4f5] leading-none">{successRate}%</div>
              <div className="text-[11px] sm:text-xs text-[#a1a1aa] mt-1.5 whitespace-nowrap">Success Rate</div>
            </div>
          </div>

          {/* Avg Latency */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12]/60 backdrop-blur-xl p-4 flex flex-col justify-between hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1 w-full shadow-sm stagger-item">
            <div className="w-8 h-8 rounded bg-[#f59e0b]/10 flex items-center justify-center mb-3">
              <Zap className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-[#f4f4f5] leading-none">14.8ms</div>
              <div className="text-[11px] sm:text-xs text-[#a1a1aa] mt-1.5 whitespace-nowrap">Avg Latency</div>
            </div>
          </div>

          {/* Level & XP */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12]/60 backdrop-blur-xl p-4 flex flex-col justify-between hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1 w-full col-span-2 shadow-sm stagger-item">
            <div className="text-sm font-semibold text-[#f4f4f5] mb-2">Level 2</div>
            <div className="flex-grow flex flex-col justify-end">
              <div className="w-full h-2 bg-[#18181b] rounded-full overflow-hidden mb-2 shadow-inner">
                <div className="h-full bg-[#10b981] rounded-full" style={{ width: '53%' }} />
              </div>
              <div className="text-xs text-[#a1a1aa] whitespace-nowrap">320 / 600 XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: LEARNING PATH + STREAK & ACTIVITY                                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Learning Path */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12]/60 backdrop-blur-xl p-5 lg:p-6 flex flex-col hover:border-white/[0.12] transition-all duration-300 relative overflow-hidden group stagger-item">
          {/* Subtle background glow for the card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10 group-hover:bg-emerald-500/10 transition-colors duration-500" />
          
          <div className="flex items-start justify-between mb-8 relative z-10">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-sm font-bold text-[#f4f4f5] tracking-wide">Backend Engineer Path</h2>
              </div>
              <p className="text-xs text-[#a1a1aa] mt-1.5 font-medium">{totalChallenges} challenges <span className="mx-1.5 text-white/10">•</span> {Math.max(4, learningPaths.length)} tracks</p>
            </div>
            <button className="text-[11px] font-semibold text-[#a1a1aa] hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] rounded-full px-3.5 py-1.5 transition-all flex items-center shadow-sm active:scale-95">
              <span>View Path</span><ArrowRight className="w-3 h-3 ml-1.5" />
            </button>
          </div>
          
          <div className="relative flex-grow flex items-center justify-between px-2 mt-4 sm:mt-0 z-10">
            {/* Background Line */}
            <div className="absolute left-[12%] right-[12%] top-[24px] -translate-y-1/2 h-[3px] bg-white/[0.03] rounded-full z-0" />
            
            {/* Active Multi-Color Line */}
            <div className="absolute left-[12%] top-[24px] -translate-y-1/2 h-[3px] bg-gradient-to-r from-emerald-500 via-sky-500 to-transparent z-0 rounded-full transition-all duration-1000 ease-out" style={{ width: '25%' }} />
            
            {/* We pad the learning paths to ensure exactly 4 for visual consistency */}
            {[...learningPaths.slice(0, 4), ...Array(Math.max(0, 4 - learningPaths.length)).fill({ name: 'Upcoming', solved: 0, total: 4 })].slice(0, 4).map((path, idx) => {
              const isActive = idx === 0 || learningPaths[idx - 1]?.solved === learningPaths[idx - 1]?.total;
              const isComplete = path.solved === path.total && path.total > 0;
              
              // Distinct visual theme per track
              const theme = idx === 0 ? {
                color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', ring: 'ring-emerald-500/20', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]', icon: Server, name: 'HTTP & REST'
              } : idx === 1 ? {
                color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30', ring: 'ring-sky-500/20', shadow: 'shadow-[0_0_15px_rgba(14,165,233,0.2)]', icon: Database, name: 'Databases'
              } : idx === 2 ? {
                color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30', ring: 'ring-violet-500/20', shadow: 'shadow-[0_0_15px_rgba(139,92,246,0.2)]', icon: Key, name: 'Auth & Security'
              } : {
                color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', ring: 'ring-amber-500/20', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]', icon: Cpu, name: 'System Design'
              };
              
              const displayName = path.name === 'Upcoming' ? theme.name : path.name;
              const Icon = theme.icon;
              
              return (
                <div key={`${path.name}-${idx}`} className="relative z-10 flex flex-col items-center gap-3 w-1/4 group/node cursor-pointer active:scale-95 transition-transform">
                  <div className={`w-12 h-12 rounded-full border-[3px] border-[#0c0e12] flex items-center justify-center transition-all duration-300 group-hover/node:scale-110 ${isActive && !isComplete ? `${theme.bg} ring-2 ${theme.ring}` : isComplete ? `bg-[#10b981] ring-2 ring-emerald-500/30` : 'bg-[#18181b] ring-1 ring-white/[0.06] group-hover/node:ring-white/[0.12]'}`}>
                    {isComplete ? <Check className="w-5 h-5 text-[#050708]" /> : isActive ? <Icon className={`w-5 h-5 ${theme.color}`} /> : <Lock className="w-4 h-4 text-[#52525b]" />}
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className={`text-[11px] font-semibold whitespace-nowrap transition-colors ${isActive ? theme.color : 'text-[#71717a] group-hover/node:text-[#a1a1aa]'}`}>{displayName}</span>
                    <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'text-[#f4f4f5]' : 'text-[#52525b]'}`}>{path.solved}/{path.total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak & Activity */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12]/60 backdrop-blur-xl p-5 lg:p-6 flex flex-col hover:border-white/[0.12] transition-colors duration-200 overflow-hidden stagger-item">
          <SubmissionHeatmap
            submissions={userProgress?.submissions || {}}
            streak={userProgress?.streak || userStats.currentStreak}
            solvedCount={solvedCount}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 3: RECENT SUBMISSIONS + CHALLENGE STATS                               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Submissions Table */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12]/60 backdrop-blur-xl lg:col-span-2 flex flex-col hover:border-white/[0.12] transition-colors duration-200 overflow-hidden stagger-item">
          <div className="p-5 border-b border-white/[0.04] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#f4f4f5]">Recent Submissions</h2>
            <button className="text-xs font-medium text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors active:scale-95">View all</button>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-[#71717a] font-medium bg-black/20 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5 font-medium">Challenge</th>
                  <th className="py-3 px-5 font-medium">Status</th>
                  <th className="py-3 px-5 font-medium">Language</th>
                  <th className="py-3 px-5 font-medium">Runtime</th>
                  <th className="py-3 px-5 font-medium text-right">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentSubmissions.length > 0 ? (
                  recentSubmissions.map((sub, i) => {
                    const isAccepted = sub.testsPassed > 0 || sub.challenge?.status === 'SOLVED';
                    const isError = !isAccepted && sub.testsPassed === 0;
                    
                    return (
                      <tr key={i} className="hover:bg-white/[0.02] border-b border-transparent hover:border-white/[0.04] transition-all cursor-pointer group active:bg-white/[0.04]" onClick={() => sub.challenge && onSelectChallenge(sub.challenge)}>
                        <td className="py-3.5 px-5">
                          <div className="font-medium text-[#f4f4f5] group-hover:text-[#34d399] transition-colors">{sub.challenge?.title || 'Unknown Challenge'}</div>
                        </td>
                        <td className="py-3.5 px-5">
                          {isAccepted ? (
                            <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] font-medium text-xs border border-[#10b981]/20">
                              <CheckCircle className="w-3.5 h-3.5" /><span>Accepted</span>
                            </span>
                          ) : isError ? (
                            <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#f59e0b]/10 text-[#f59e0b] font-medium text-xs border border-[#f59e0b]/20">
                              <Terminal className="w-3.5 h-3.5" /><span>Error</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#f43f5e]/10 text-[#f43f5e] font-medium text-xs border border-[#f43f5e]/20">
                              <X className="w-3.5 h-3.5" /><span>Wrong Answer</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="text-[11px] font-medium text-[#a1a1aa] uppercase tracking-wider">{sub.language === 'typescript' ? 'TypeScript' : sub.language}</span>
                        </td>
                        <td className="py-3.5 px-5 text-[#a1a1aa] font-mono text-[11px]">
                          {isAccepted ? '14.8ms' : '—'}
                        </td>
                        <td className="py-3.5 px-5 text-right text-xs text-[#71717a]">
                          {getTimeAgo(sub.timestamp)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={5} className="py-8 text-center text-[#71717a] text-sm">No recent submissions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Challenge Stats */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12]/60 backdrop-blur-xl p-5 lg:p-6 flex flex-col hover:border-white/[0.12] transition-colors duration-200 stagger-item">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-semibold text-[#f4f4f5]">Challenge Stats</h2>
            <div className="px-3 py-1.5 bg-black/40 border border-white/[0.08] rounded-md text-xs text-[#a1a1aa] cursor-pointer hover:text-[#f4f4f5] flex items-center space-x-2 active:scale-95 transition-transform">
              <span>All Time</span>
              <ChevronRight className="w-3 h-3 rotate-90" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between flex-grow gap-6 sm:gap-0 mt-2">
            <div className="relative flex justify-center w-full sm:w-1/2">
              <svg width="150" height="150" viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r={radius} stroke="#18181b" strokeWidth="5" fill="transparent" />
                {/* Not Attempted */}
                <circle cx="50" cy="50" r={radius} stroke="#3f3f46" strokeWidth="5" fill="transparent" strokeDasharray={getStrokeDash(notAttemptedCount, totalChallenges, radius)} strokeDashoffset={getStrokeOffset(0, totalChallenges, radius)} strokeLinecap="round" />
                {/* Error / Wrong Answer */}
                <circle cx="50" cy="50" r={radius} stroke="#f59e0b" strokeWidth="5" fill="transparent" strokeDasharray={getStrokeDash(errorCount, totalChallenges, radius)} strokeDashoffset={getStrokeOffset(notAttemptedCount, totalChallenges, radius)} strokeLinecap="round" />
                {/* Accepted */}
                <circle cx="50" cy="50" r={radius} stroke="#10b981" strokeWidth="5" fill="transparent" strokeDasharray={getStrokeDash(solvedCount, totalChallenges, radius)} strokeDashoffset={getStrokeOffset(notAttemptedCount + errorCount, totalChallenges, radius)} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[#f4f4f5] tracking-tight">{successRate}%</span>
                <span className="text-[10px] font-medium text-[#71717a] mt-0.5 tracking-wide">Success</span>
              </div>
            </div>
            
            <div className="space-y-4 w-full sm:w-1/2 flex flex-col justify-center sm:pl-4">
              <div className="flex items-center space-x-3 text-sm">
                <span className="w-3 h-3 rounded-full bg-[#10b981]" />
                <span className="font-medium text-[#f4f4f5]">{solvedCount}</span>
                <span className="text-[#a1a1aa]">Accepted</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <span className="w-3 h-3 rounded-full bg-[#f43f5e]" />
                <span className="font-medium text-[#f4f4f5]">0</span>
                <span className="text-[#a1a1aa]">Wrong Answer</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                <span className="font-medium text-[#f4f4f5]">{errorCount}</span>
                <span className="text-[#a1a1aa]">Error</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <span className="w-3 h-3 rounded-full bg-[#3f3f46]" />
                <span className="font-medium text-[#f4f4f5]">{notAttemptedCount}</span>
                <span className="text-[#a1a1aa]">Not Attempted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 4: BOTTOM ANALYTICS ROW                                               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* A. Progress Overview */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12]/60 backdrop-blur-xl p-5 flex flex-col hover:border-white/[0.12] transition-colors duration-200 stagger-item">
          <h2 className="text-sm font-semibold text-[#f4f4f5] mb-5">Progress Overview</h2>
          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.04)" strokeWidth="4" fill="transparent" />
                <circle cx="50" cy="50" r="44" stroke="#10b981" strokeWidth="4" fill="transparent" strokeDasharray="276.46" strokeDashoffset={276.46 - (276.46 * (solvedCount / totalChallenges))} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-semibold text-[#f4f4f5] tracking-tight">{solvedCount}</span>
                <span className="text-[10px] font-medium text-[#71717a] uppercase tracking-widest mt-1">Solved</span>
              </div>
            </div>
            <div className="text-xs font-medium text-[#a1a1aa] bg-black/40 px-3 py-1.5 rounded-full border border-white/[0.04]">
              {solvedCount} / {totalChallenges} challenges
            </div>
          </div>
        </div>

        {/* B. Difficulty */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12]/60 backdrop-blur-xl p-5 flex flex-col hover:border-white/[0.12] transition-colors duration-200 stagger-item">
          <h2 className="text-sm font-semibold text-[#f4f4f5] mb-6">Difficulty</h2>
          <div className="flex-grow flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a1a1aa] font-medium">Easy</span>
                <span className="text-[#f4f4f5] font-semibold">{easySolved} <span className="text-[#71717a] font-normal">/ {easyChallenges.length}</span></span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-1 overflow-hidden">
                <div className="h-full bg-[#10b981] rounded-full transition-all duration-500" style={{ width: `${easyChallenges.length > 0 ? (easySolved / easyChallenges.length) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a1a1aa] font-medium">Medium</span>
                <span className="text-[#f4f4f5] font-semibold">{mediumSolved} <span className="text-[#71717a] font-normal">/ {mediumChallenges.length}</span></span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-1 overflow-hidden">
                <div className="h-full bg-[#f59e0b] rounded-full transition-all duration-500" style={{ width: `${mediumChallenges.length > 0 ? (mediumSolved / mediumChallenges.length) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a1a1aa] font-medium">Hard</span>
                <span className="text-[#f4f4f5] font-semibold">{hardSolved} <span className="text-[#71717a] font-normal">/ {hardChallenges.length}</span></span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-1 overflow-hidden">
                <div className="h-full bg-[#f43f5e] rounded-full transition-all duration-500" style={{ width: `${hardChallenges.length > 0 ? (hardSolved / hardChallenges.length) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* C. Languages */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12]/60 backdrop-blur-xl p-5 flex flex-col hover:border-white/[0.12] transition-colors duration-200 stagger-item">
          <h2 className="text-sm font-semibold text-[#f4f4f5] mb-5">Languages</h2>
          <div className="space-y-3 flex-grow">
            <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/[0.04]">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded flex items-center justify-center bg-[#38bdf8]/10 text-[#38bdf8] text-[10px] font-bold">TS</div>
                <span className="text-sm font-medium text-[#f4f4f5]">TypeScript</span>
              </div>
              <span className="text-xs text-[#a1a1aa]"><span className="text-[#10b981] font-semibold">{solvedCount}</span> solved</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-transparent opacity-50">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded flex items-center justify-center bg-[#10b981]/10 text-[#10b981] text-[10px] font-bold">GO</div>
                <span className="text-sm font-medium text-[#a1a1aa]">Go</span>
              </div>
              <span className="text-xs text-[#52525b]">0</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-transparent opacity-50">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded flex items-center justify-center bg-[#f59e0b]/10 text-[#f59e0b] text-[10px] font-bold">PY</div>
                <span className="text-sm font-medium text-[#a1a1aa]">Python</span>
              </div>
              <span className="text-xs text-[#52525b]">0</span>
            </div>
          </div>
        </div>

        {/* D. Badges */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0e12]/60 backdrop-blur-xl p-5 flex flex-col hover:border-white/[0.12] transition-colors duration-200 stagger-item">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-[#f4f4f5]">Badges</h2>
            <button className="text-xs font-medium text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors">View all</button>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-grow">
            <div className={`flex flex-col items-center justify-center p-3 rounded-lg border ${solvedCount >= 1 ? 'bg-[#10b981]/5 border-[#10b981]/20' : 'bg-black/40 border-white/[0.04] opacity-50'}`}>
              <Award className={`w-6 h-6 mb-2 ${solvedCount >= 1 ? 'text-[#10b981]' : 'text-[#52525b]'}`} />
              <span className={`text-xs font-medium text-center ${solvedCount >= 1 ? 'text-[#f4f4f5]' : 'text-[#71717a]'}`}>First Blood</span>
            </div>
            <div className={`flex flex-col items-center justify-center p-3 rounded-lg border ${userStats.currentStreak >= 3 ? 'bg-[#f59e0b]/5 border-[#f59e0b]/20' : 'bg-black/40 border-white/[0.04] opacity-50'}`}>
              <Flame className={`w-6 h-6 mb-2 ${userStats.currentStreak >= 3 ? 'text-[#f59e0b]' : 'text-[#52525b]'}`} />
              <span className={`text-xs font-medium text-center ${userStats.currentStreak >= 3 ? 'text-[#f4f4f5]' : 'text-[#71717a]'}`}>Hot Streak</span>
            </div>
            <div className={`flex flex-col items-center justify-center p-3 rounded-lg border ${solvedCount >= 5 ? 'bg-[#3b82f6]/5 border-[#3b82f6]/20' : 'bg-black/40 border-white/[0.04] opacity-50'}`}>
              <Layers className={`w-6 h-6 mb-2 ${solvedCount >= 5 ? 'text-[#3b82f6]' : 'text-[#52525b]'}`} />
              <span className={`text-xs font-medium text-center ${solvedCount >= 5 ? 'text-[#f4f4f5]' : 'text-[#71717a]'}`}>5 APIs</span>
            </div>
            <div className={`flex flex-col items-center justify-center p-3 rounded-lg border ${solvedCount >= 10 ? 'bg-[#8b5cf6]/5 border-[#8b5cf6]/20' : 'bg-black/40 border-white/[0.04] opacity-50'}`}>
              <Shield className={`w-6 h-6 mb-2 ${solvedCount >= 10 ? 'text-[#8b5cf6]' : 'text-[#52525b]'}`} />
              <span className={`text-xs font-medium text-center ${solvedCount >= 10 ? 'text-[#f4f4f5]' : 'text-[#71717a]'}`}>10 APIs</span>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Modal (Preserved) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-xl bg-[#0c0e12]/60 backdrop-blur-xl border border-white/[0.12] p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#f4f4f5]">Edit Profile</h3>
                <p className="text-xs text-[#a1a1aa] mt-1">Personalize your developer analytics card</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/[0.08] text-[#71717a] hover:text-[#f4f4f5] transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-sm">
              <div className="space-y-1.5"><label className="text-[#a1a1aa] font-medium text-xs">Display Name</label><input type="text" required value={editForm.displayName} onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))} className="w-full px-3 py-2 bg-black/40 border border-white/[0.08] rounded-md text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:border-[#34d399] transition-colors" /></div>
              <div className="space-y-1.5"><label className="text-[#a1a1aa] font-medium text-xs">Role</label><input type="text" value={editForm.title} onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 bg-black/40 border border-white/[0.08] rounded-md text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:border-[#34d399] transition-colors" /></div>
              <div className="space-y-1.5"><div className="flex items-center justify-between"><label className="text-[#a1a1aa] font-medium text-xs">Bio</label><span className="text-[10px] text-[#71717a] font-mono">{editForm.bio.length}/320</span></div><textarea rows={3} maxLength={320} required value={editForm.bio} onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))} className="w-full px-3 py-2 bg-black/40 border border-white/[0.08] rounded-md text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:border-[#34d399] transition-colors resize-none leading-relaxed" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-[#a1a1aa] font-medium text-xs">Location</label><input type="text" value={editForm.location} onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))} className="w-full px-3 py-2 bg-black/40 border border-white/[0.08] rounded-md text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:border-[#34d399] transition-colors" /></div>
                <div className="space-y-1.5"><label className="text-[#a1a1aa] font-medium text-xs">GitHub Username</label><input type="text" value={editForm.github} onChange={(e) => setEditForm(prev => ({ ...prev, github: e.target.value }))} className="w-full px-3 py-2 bg-black/40 border border-white/[0.08] rounded-md text-[#f4f4f5] placeholder-[#71717a] focus:outline-none focus:border-[#34d399] transition-colors" /></div>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/[0.08]">
                <button type="button" onClick={() => setIsEditModalOpen(false)} disabled={isSavingProfile} className="px-4 py-2 rounded-md text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-white/[0.04] text-sm font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={isSavingProfile} className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-[#10b981] hover:bg-[#34d399] text-black font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50">
                  {isSavingProfile ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving...</span></> : <span>Save Changes</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};