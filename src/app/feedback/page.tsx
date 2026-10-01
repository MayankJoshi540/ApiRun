'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BackendRankNavbar } from '@/components/BackendRankNavbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  MessageSquare, 
  MessageCircle,
  Star, 
  Send, 
  CheckCircle2, 
  CheckCheck,
  Bug, 
  Zap, 
  Loader2, 
  Flame,
  Clock,
  User as UserIcon,
  ChevronUp,
  ChevronRight,
  X,
  RefreshCw,
  Search,
  ShieldCheck,
  Lock,
  Trash2,
  Layers
} from '@/components/ui/Icons';

export interface FeedbackComment {
  id: string;
  userId?: string;
  userName: string;
  userRole?: 'admin' | 'user';
  content: string;
  isAnonymous?: boolean;
  createdAt: string;
}

export interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  type: 'suggestion' | 'bug';
  status: 'open' | 'closed';
  isAnonymous: boolean;
  userId?: string;
  userName: string;
  userEmail?: string;
  upvotesCount: number;
  upvotedBy: string[];
  commentsCount: number;
  comments: FeedbackComment[];
  createdAt: string;
  closedAt?: string;
  closedBy?: string;
  category?: string;
}

const ADMIN_EMAILS = ['joshimayank646@gmail.com'];

export default function FeedbackPage() {
  const router = useRouter();
  const { user } = useAuth();

  const isAdmin = Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase().trim()));

  // Feed State
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTypeTab, setActiveTypeTab] = useState<'all' | 'suggestions' | 'bugs'>('all');
  const [activeSort, setActiveSort] = useState<'hot' | 'top' | 'new'>('hot');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [counts, setCounts] = useState({ all: 0, suggestions: 0, bugs: 0, open: 0, closed: 0 });

  // Form State
  const [formType, setFormType] = useState<'suggestion' | 'bug'>('suggestion');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  // Discussion Modal State
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isClosingTicket, setIsClosingTicket] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Client identifier for voting
  const currentUserId = useMemo(() => {
    if (user?.uid) return user.uid;
    if (typeof window !== 'undefined') {
      let storedId = localStorage.getItem('apirun_client_id');
      if (!storedId) {
        storedId = `client_${Math.random().toString(36).substring(2, 10)}`;
        localStorage.setItem('apirun_client_id', storedId);
      }
      return storedId;
    }
    return 'client_temp';
  }, [user]);

  // Fetch Feedbacks from Server/DB
  const fetchFeedbacks = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/feedback?type=${activeTypeTab}&sort=${activeSort}&status=${statusFilter}`);
      if (!res.ok) throw new Error('Failed to fetch feedbacks.');
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
      if (data.counts) {
        setCounts(data.counts);
      }
    } catch (err) {
      console.error('Error loading feedbacks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTypeTab, activeSort, statusFilter]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  // Aggregate stats
  const totalUpvotes = useMemo(() => {
    return feedbacks.reduce((acc, curr) => acc + (curr.upvotesCount || 0), 0);
  }, [feedbacks]);

  // Handle Upvoting
  const handleVote = async (feedbackId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Optimistic UI update
    setFeedbacks((prev) =>
      prev.map((fb) => {
        if (fb.id !== feedbackId) return fb;
        const hasVoted = fb.upvotedBy.includes(currentUserId);
        return {
          ...fb,
          upvotesCount: hasVoted ? Math.max(0, fb.upvotesCount - 1) : fb.upvotesCount + 1,
          upvotedBy: hasVoted
            ? fb.upvotedBy.filter((id) => id !== currentUserId)
            : [...fb.upvotedBy, currentUserId],
        };
      })
    );

    if (selectedFeedback && selectedFeedback.id === feedbackId) {
      const hasVoted = selectedFeedback.upvotedBy.includes(currentUserId);
      setSelectedFeedback({
        ...selectedFeedback,
        upvotesCount: hasVoted ? Math.max(0, selectedFeedback.upvotesCount - 1) : selectedFeedback.upvotesCount + 1,
        upvotedBy: hasVoted
          ? selectedFeedback.upvotedBy.filter((id) => id !== currentUserId)
          : [...selectedFeedback.upvotedBy, currentUserId],
      });
    }

    try {
      await fetch('/api/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'vote',
          feedbackId,
          userId: currentUserId,
        }),
      });
    } catch (err) {
      console.error('Error submitting vote:', err);
      fetchFeedbacks();
    }
  };

  // Handle Moderator Delete
  const handleDeleteFeedback = async (feedbackId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const confirmed = window.confirm('Are you sure you want to permanently delete this feedback?');
    if (!confirmed) return;

    try {
      setDeletingId(feedbackId);

      const res = await fetch(`/api/feedback?id=${encodeURIComponent(feedbackId)}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete feedback');

      setFeedbacks((prev) => prev.filter((fb) => fb.id !== feedbackId));

      if (selectedFeedback && selectedFeedback.id === feedbackId) {
        setSelectedFeedback(null);
      }

      fetchFeedbacks();
    } catch (err) {
      console.error('Error deleting feedback:', err);
      alert('Failed to delete feedback. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Handle New Feedback Form Submission (Stored anonymously)
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) {
      setFormErrorMessage('Please fill in both the title and description.');
      return;
    }

    try {
      setIsSubmittingForm(true);
      setFormErrorMessage(null);
      setFormSuccessMessage(null);

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle.trim(),
          description: formDescription.trim(),
          type: formType,
          userId: currentUserId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit feedback.');

      setFormSuccessMessage('Feedback recorded and saved to live database!');
      setFormTitle('');
      setFormDescription('');

      fetchFeedbacks();

      setTimeout(() => setFormSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      setFormErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Handle Submitting Comment / Reply (Anonymous or Moderator)
  const handleAddComment = async () => {
    if (!selectedFeedback || !commentText.trim()) return;

    try {
      setIsSubmittingComment(true);

      const res = await fetch('/api/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comment',
          feedbackId: selectedFeedback.id,
          userId: currentUserId,
          userName: isAdmin ? 'Moderator' : 'Anonymous',
          userRole: isAdmin ? 'admin' : 'user',
          content: commentText.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post reply.');

      const newComment: FeedbackComment = data.comment || {
        id: `c_${Date.now()}`,
        userName: isAdmin ? 'Moderator' : 'Anonymous',
        userRole: isAdmin ? 'admin' : 'user',
        content: commentText.trim(),
        isAnonymous: !isAdmin,
        createdAt: new Date().toISOString(),
      };

      setSelectedFeedback((prev) => {
        if (!prev) return null;
        const nextComments = [...prev.comments, newComment];
        return {
          ...prev,
          comments: nextComments,
          commentsCount: nextComments.length,
        };
      });

      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb.id === selectedFeedback.id
            ? {
                ...fb,
                comments: [...fb.comments, newComment],
                commentsCount: fb.commentsCount + 1,
              }
            : fb
        )
      );

      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle Closing or Reopening Ticket
  const handleToggleTicketStatus = async (targetStatus: 'closed' | 'open') => {
    if (!selectedFeedback) return;

    try {
      setIsClosingTicket(true);

      const res = await fetch('/api/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'status',
          status: targetStatus,
          feedbackId: selectedFeedback.id,
          userId: currentUserId,
          userName: isAdmin ? 'Moderator' : 'Anonymous',
          userRole: isAdmin ? 'admin' : 'user',
          closingNote: commentText.trim() ? commentText.trim() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update ticket status.');

      const updated = data.feedback || {
        ...selectedFeedback,
        status: targetStatus,
        closedAt: targetStatus === 'closed' ? new Date().toISOString() : undefined,
        closedBy: targetStatus === 'closed' ? (isAdmin ? 'Moderator' : 'Anonymous') : undefined,
      };

      setSelectedFeedback(updated);
      setFeedbacks((prev) =>
        prev.map((fb) => (fb.id === selectedFeedback.id ? { ...fb, ...updated } : fb))
      );

      if (commentText.trim()) {
        setCommentText('');
      }

      fetchFeedbacks();
    } catch (err) {
      console.error('Error toggling ticket status:', err);
    } finally {
      setIsClosingTicket(false);
    }
  };

  // Filtered feedbacks by search
  const displayedFeedbacks = useMemo(() => {
    if (!searchQuery.trim()) return feedbacks;
    const q = searchQuery.toLowerCase();
    return feedbacks.filter(
      (fb) =>
        fb.title.toLowerCase().includes(q) ||
        fb.description.toLowerCase().includes(q)
    );
  }, [feedbacks, searchQuery]);

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const formatTicketNumber = (id: string, index: number) => {
    if (id.startsWith('fb_sample_')) return `#RFC-00${id.replace('fb_sample_', '')}`;
    const cleanNum = String(index + 1).padStart(3, '0');
    return `#RFC-${cleanNum}`;
  };

  const handleNavigate = (tab: 'landing' | 'challenges' | 'progress' | 'feedback' | 'dashboard') => {
    if (tab === 'landing') router.push('/');
    else if (tab === 'progress') router.push('/progress');
    else if (tab === 'challenges' || tab === 'dashboard') router.push('/challenges');
    else router.push('/feedback');
  };

  return (
    <div className="min-h-screen bg-[#050708] text-[#F5F7FA] font-sans antialiased relative flex flex-col justify-between selection:bg-emerald-500/20 selection:text-white">
      
      {/* 1. Visible Home Page Background Artwork */}
      <div className="absolute top-0 left-0 right-0 h-[950px] overflow-hidden pointer-events-none z-0">
        
        {/* Top Ambient Studio Glow */}
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16, 185, 129, 0.16), rgba(5, 150, 105, 0.04) 50%, transparent 80%)',
            filter: 'blur(40px)',
          }}
        />

        {/* High-Resolution Globe / Grid Artwork (Visible & Crisp) */}
        <img
          src="/background.png"
          alt="APIRun Background"
          className="absolute inset-0 w-full h-full object-cover object-bottom select-none opacity-75 brightness-105 saturate-[1.05]"
          style={{ 
            objectPosition: 'center bottom',
            minHeight: '100%',
            minWidth: '100%'
          }}
        />

        {/* Radiant Horizon Light Arc */}
        <div 
          className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[85%] max-w-4xl h-[160px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(52, 211, 153, 0.12) 0%, rgba(16, 185, 129, 0.04) 40%, transparent 75%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Natural Smooth Bottom Fade into Content */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(5, 7, 8, 0.6) 50%, #050708 100%)'
          }}
        />
      </div>

      {/* Top Navigation */}
      <BackendRankNavbar
        activeTab="feedback"
        onSelectTab={handleNavigate}
        solvedCount={0}
        totalCount={12}
      />

      {/* Main Feedback Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20 flex-grow w-full relative z-10">
        
        {/* Moderator Info Banner (Visible for Admin) */}
        {isAdmin && (
          <div className="mb-8 p-4 rounded-xl bg-[#090e17]/90 backdrop-blur-md border border-white/[0.12] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-2">
                  <span>Moderator Access Active</span>
                  <span className="px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300 text-[10px] font-mono border border-white/[0.1]">
                    {user?.email}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  You can permanently delete feedback items, resolve tickets, and post as Moderator.
                </p>
              </div>
            </div>
            <button
              onClick={fetchFeedbacks}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/[0.08] text-xs font-semibold text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-10 sm:mb-12 space-y-4">
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Suggest a{' '}
            <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-xl inline-block font-mono text-2xl sm:text-4xl lg:text-5xl align-middle">
              feature
            </span>{' '}
            or Report{' '}
            <br className="hidden sm:inline" />
            a{' '}
            <span className="text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-0.5 rounded-xl inline-block font-mono text-2xl sm:text-4xl lg:text-5xl align-middle">
              bug
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mx-auto leading-relaxed font-sans">
            Help shape the future of APIRun. Propose backend challenges, request execution harness features, or report edge cases. All submissions are stored in the database and posted anonymously.
          </p>

          {/* Quick Metrics Bar (Clean, Structured, LinkedIn-Ready) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto pt-4 text-left">
            <div className="p-3.5 rounded-xl bg-[#090d14]/85 backdrop-blur-md border border-white/[0.08]">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Submissions</span>
                <Layers className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <div className="text-xl font-bold text-white font-mono mt-1">{counts.all}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090d14]/85 backdrop-blur-md border border-white/[0.08]">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Feature RFCs</span>
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-1">{counts.suggestions}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090d14]/85 backdrop-blur-md border border-white/[0.08]">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Bug Reports</span>
                <Bug className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-xl font-bold text-rose-400 font-mono mt-1">{counts.bugs}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090d14]/85 backdrop-blur-md border border-white/[0.08]">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Total Upvotes</span>
                <Star className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-amber-400 font-mono mt-1">{totalUpvotes}</div>
            </div>
          </div>

        </div>

        {/* 2-Column Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          
          {/* ================= LEFT COLUMN: FEEDBACK LIST & FILTERS (2 COLS) ================= */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Filter Bar & Controls */}
            <div className="p-3 sm:p-4 rounded-xl bg-[#090d14]/85 backdrop-blur-md border border-white/[0.08] space-y-3">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                
                {/* Type Tabs (All / Suggestions / Bugs) */}
                <div className="flex items-center p-1 bg-[#05070a] rounded-lg border border-white/[0.06] w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTypeTab('all')}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center justify-center space-x-1.5 ${
                      activeTypeTab === 'all'
                        ? 'bg-emerald-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>All</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/[0.15] font-mono">
                      {counts.all}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTypeTab('suggestions')}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center justify-center space-x-1.5 ${
                      activeTypeTab === 'suggestions'
                        ? 'bg-emerald-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>Suggestions</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/[0.15] font-mono">
                      {counts.suggestions}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTypeTab('bugs')}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center justify-center space-x-1.5 ${
                      activeTypeTab === 'bugs'
                        ? 'bg-emerald-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>Bugs</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/[0.15] font-mono">
                      {counts.bugs}
                    </span>
                  </button>
                </div>

                {/* Sort Tabs (Hot / Top / New) */}
                <div className="flex items-center space-x-1.5 self-end sm:self-center">
                  <button
                    onClick={() => setActiveSort('hot')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                      activeSort === 'hot'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-[#05070a] hover:bg-zinc-900 text-zinc-400 border-white/[0.06]'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Hot</span>
                  </button>

                  <button
                    onClick={() => setActiveSort('top')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                      activeSort === 'top'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-[#05070a] hover:bg-zinc-900 text-zinc-400 border-white/[0.06]'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Top</span>
                  </button>

                  <button
                    onClick={() => setActiveSort('new')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                      activeSort === 'new'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-[#05070a] hover:bg-zinc-900 text-zinc-400 border-white/[0.06]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>New</span>
                  </button>
                </div>

              </div>

              {/* Search Bar & Status Filter Row */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-white/[0.06]">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search feedback or RFC keywords..."
                    className="w-full pl-10 pr-4 py-2 bg-[#05070a] border border-white/[0.08] rounded-lg text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white/30 transition-colors font-sans"
                  />
                </div>

                <div className="flex items-center space-x-1.5 w-full sm:w-auto">
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono pl-1">Status:</span>
                  {(['all', 'open', 'closed'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-md text-xs capitalize transition-colors border font-mono flex items-center space-x-1 ${
                        statusFilter === st
                          ? st === 'closed'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-semibold'
                            : 'bg-zinc-800 text-white border-white/20 font-semibold'
                          : 'bg-[#05070a] text-zinc-400 border-white/[0.04] hover:text-zinc-200'
                      }`}
                    >
                      {st === 'closed' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      <span>{st === 'closed' ? 'resolved' : st}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* List of Feedback Items */}
            {isLoading ? (
              <div className="py-20 text-center space-y-3 rounded-xl bg-[#090d14]/85 backdrop-blur-md border border-white/[0.06]">
                <Loader2 className="w-7 h-7 animate-spin text-zinc-400 mx-auto" />
                <p className="text-xs text-zinc-400 font-mono">Loading records from database...</p>
              </div>
            ) : displayedFeedbacks.length === 0 ? (
              <div className="py-16 text-center space-y-3 rounded-xl bg-[#090d14]/85 backdrop-blur-md border border-white/[0.06] p-8">
                <MessageCircle className="w-10 h-10 text-zinc-600 mx-auto" />
                <h3 className="text-sm font-bold text-white font-mono">No feedback records found</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  {searchQuery
                    ? 'No submissions matched your search query.'
                    : 'Be the first to submit a feature proposal or report an issue!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {displayedFeedbacks.map((item, index) => {
                  const hasVoted = item.upvotedBy.includes(currentUserId);

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedFeedback(item)}
                      className={`p-5 rounded-xl bg-[#090d14]/85 backdrop-blur-md border transition-all cursor-pointer group flex items-start gap-4 sm:gap-5 relative active:scale-[0.99] ${
                        item.status === 'closed'
                          ? 'border-emerald-500/30 hover:border-emerald-500/60 bg-[#07130e]/40 hover:bg-[#07130e]/60 shadow-[0_0_20px_rgba(16,185,129,0.06)]'
                          : 'border-white/[0.08] hover:border-white/20 hover:bg-[#0d131f]/90'
                      }`}
                    >
                      {/* Left: Tactile Vertical Upvote Button */}
                      <div className="shrink-0 pt-0.5">
                        <button
                          type="button"
                          onClick={(e) => handleVote(item.id, e)}
                          className={`flex flex-col items-center justify-center min-w-[50px] sm:min-w-[52px] py-2 px-2 rounded-lg border transition-colors ${
                            hasVoted
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'bg-[#05070a] border-white/[0.08] hover:bg-zinc-900 hover:border-white/20 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <ChevronUp className="w-4 h-4" />
                          <span className="text-xs font-bold font-mono mt-0.5">
                            {item.upvotesCount}
                          </span>
                        </button>
                      </div>

                      {/* Center Content Body */}
                      <div className="flex-1 min-w-0 space-y-2">
                        
                        {/* Top Metadata Row */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {/* Ticket Number */}
                          <span className="text-[11px] font-mono text-zinc-500 font-semibold">
                            {formatTicketNumber(item.id, index)}
                          </span>

                          {/* Type Pill */}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border flex items-center space-x-1 ${
                              item.type === 'bug'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}
                          >
                            {item.type === 'bug' ? (
                              <Bug className="w-3 h-3" />
                            ) : (
                              <Zap className="w-3 h-3" />
                            )}
                            <span className="capitalize">{item.type === 'bug' ? 'Bug Report' : 'Feature RFC'}</span>
                          </span>

                          {/* Status Pill */}
                          {item.status === 'closed' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold tracking-wider flex items-center space-x-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 shadow-[0_0_12px_rgba(16,185,129,0.18)]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>RESOLVED</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider flex items-center space-x-1 bg-zinc-900 text-zinc-300 border border-white/[0.08]">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 animate-pulse" />
                              <span>Open</span>
                            </span>
                          )}

                          <span className="text-zinc-600 hidden sm:inline">•</span>

                          {/* Relative Date */}
                          <span className="text-zinc-500 font-mono text-[11px]">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                          {item.title}
                        </h3>

                        {/* Description Snippet */}
                        <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                          {item.description}
                        </p>

                        {/* Bottom Meta Tags Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/[0.04] text-xs text-zinc-500">
                          <div className="flex items-center space-x-3">
                            {/* Author */}
                            <div className="flex items-center space-x-1.5 text-zinc-400">
                              <UserIcon className="w-3.5 h-3.5 text-zinc-500" />
                              <span className="font-mono text-[11px]">Anonymous Engineer</span>
                            </div>

                            <span>•</span>

                            {/* Discussion Counter */}
                            <div className="flex items-center space-x-1 text-zinc-400">
                              <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                              <span className="font-mono text-[11px]">{item.commentsCount || item.comments?.length || 0} replies</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-mono">
                            <span>Open Thread</span>
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        </div>

                      </div>

                      {/* Moderator Delete Control (if admin logged in) */}
                      {isAdmin && (
                        <div className="shrink-0 pt-0.5">
                          <button
                            type="button"
                            title="Delete this feedback permanently (Moderator)"
                            disabled={deletingId === item.id}
                            onClick={(e) => handleDeleteFeedback(item.id, e)}
                            className="p-2 rounded-lg bg-zinc-900 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 border border-white/[0.08] hover:border-rose-500/30 transition-colors"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* ================= RIGHT COLUMN: STICKY SUBMISSION FORM (1 COL) ================= */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl bg-[#090d14]/85 backdrop-blur-md border border-white/[0.08] p-5 sm:p-6 space-y-4">
              
              <div className="border-b border-white/[0.06] pb-3">
                <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  DEVELOPER RFC
                </div>
                <h2 className="text-base font-bold text-white font-display mt-0.5">
                  Suggest a feature or Report a bug
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Submissions are posted anonymously to the public roadmap.
                </p>
              </div>

              {formSuccessMessage && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{formSuccessMessage}</span>
                </div>
              )}

              {formErrorMessage && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center space-x-2">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{formErrorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmitFeedback} className="space-y-3.5">
                
                {/* Type Switcher */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#05070a] rounded-lg border border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setFormType('suggestion')}
                    className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-md text-xs font-bold transition-colors ${
                      formType === 'suggestion'
                        ? 'bg-emerald-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Feature</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormType('bug')}
                    className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-md text-xs font-bold transition-colors ${
                      formType === 'bug'
                        ? 'bg-rose-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Bug className="w-3.5 h-3.5" />
                    <span>Bug</span>
                  </button>
                </div>

                {/* Title Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider">
                    Title / Summary
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder={
                      formType === 'suggestion'
                        ? 'e.g. Add Redis Distributed Lock challenge'
                        : 'e.g. Content-Type parser error on multipart'
                    }
                    className="w-full px-3.5 py-2.5 bg-[#05070a] border border-white/[0.08] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 text-xs transition-colors font-sans"
                  />
                </div>

                {/* Description Textarea */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider">
                      Description
                    </label>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {formDescription.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder={
                      formType === 'suggestion'
                        ? 'Describe the backend scenario, assertions, or test requirements...'
                        : 'Steps to reproduce the error or assertion mismatch...'
                    }
                    className="w-full px-3.5 py-2.5 bg-[#05070a] border border-white/[0.08] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 text-xs resize-y transition-colors font-sans"
                  />
                </div>

                {/* Privacy Badge */}
                <div className="p-2.5 rounded-lg bg-[#05070a] border border-white/[0.04] flex items-center space-x-2 text-[11px] text-zinc-400">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>100% Anonymous. Stored directly in database.</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmittingForm}
                  className={`w-full py-2.5 px-4 rounded-lg text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center space-x-2 active:scale-[0.98] disabled:opacity-50 ${
                    formType === 'bug'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isSubmittingForm ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Recording Feedback...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        Submit {formType === 'bug' ? 'Bug Report' : 'Feature RFC'}
                      </span>
                    </>
                  )}
                </button>

              </form>

              {/* Bottom Support Link */}
              <div className="pt-2 border-t border-white/[0.06] text-center">
                <p className="text-[11px] text-zinc-500">
                  Direct question or urgent issue? Contact maintainers at{' '}
                  <a
                    href="mailto:joshimayank646@gmail.com"
                    className="text-emerald-400 hover:underline font-mono"
                  >
                    joshimayank646@gmail.com
                  </a>
                </p>
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* ================= DISCUSSION & REPLY MODAL (DIALOG) ================= */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in-0">
          
          <div 
            className="relative w-full max-w-2xl max-h-[90vh] bg-[#090d14] border border-white/[0.12] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-start justify-between gap-4 bg-[#070b10]">
              
              <div className="flex items-start space-x-4 flex-1 min-w-0">
                
                {/* Header Vote Counter */}
                <button
                  onClick={() => handleVote(selectedFeedback.id)}
                  className={`flex flex-col items-center justify-center min-w-[48px] py-2 px-2 rounded-lg border transition-colors shrink-0 ${
                    selectedFeedback.upvotedBy.includes(currentUserId)
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-[#05070a] border-white/[0.08] hover:bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold mt-0.5">
                    {selectedFeedback.upvotesCount}
                  </span>
                </button>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    
                    {/* Status Badge */}
                    {selectedFeedback.status === 'closed' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 shadow-[0_0_12px_rgba(16,185,129,0.18)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>RESOLVED</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center space-x-1 bg-zinc-900 text-zinc-300 border border-white/[0.08]">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 animate-pulse" />
                        <span>Open</span>
                      </span>
                    )}

                    {/* Type Badge */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                        selectedFeedback.type === 'bug'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {selectedFeedback.type}
                    </span>

                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400 font-mono">{formatDate(selectedFeedback.createdAt)}</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-300 font-mono text-[11px]">
                      Anonymous Engineer
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {selectedFeedback.title}
                  </h2>
                </div>

              </div>

              {/* Close Button & Moderator Delete */}
              <div className="flex items-center space-x-1.5">
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteFeedback(selectedFeedback.id)}
                    title="Delete permanently"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Full Description */}
              <div className="p-4 rounded-xl bg-[#05070a] border border-white/[0.06] text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
                {selectedFeedback.description}
              </div>

              {/* Status Notice if Closed */}
              {selectedFeedback.status === 'closed' && (
                <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/35 text-xs text-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                      <CheckCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center space-x-2">
                        <span className="text-emerald-400 font-mono text-[11px] uppercase tracking-wider">RESOLVED & VERIFIED</span>
                      </div>
                      <p className="text-emerald-300/80 text-xs mt-0.5">
                        This item was marked as resolved {selectedFeedback.closedBy ? `by ${selectedFeedback.closedBy}` : 'by maintainers'}.
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleToggleTicketStatus('open')}
                      disabled={isClosingTicket}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white border border-white/[0.1] text-xs font-mono font-semibold transition-colors shrink-0"
                    >
                      Reopen Issue
                    </button>
                  )}
                </div>
              )}

              {/* Discussion Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center space-x-2">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Discussion Thread ({selectedFeedback.comments?.length || 0})</span>
                  </h4>
                </div>

                {/* Reply / Comment Input Box */}
                <div className="p-4 rounded-xl bg-[#070b10] border border-white/[0.08] space-y-3">
                  <textarea
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write an anonymous reply or resolution note..."
                    className="w-full px-3.5 py-2.5 bg-[#05070a] border border-white/[0.08] rounded-lg text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors resize-y font-sans"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    
                    <span className="text-xs text-zinc-500 font-mono">
                      {isAdmin ? 'Posting as Maintainer' : 'Posting as Anonymous'}
                    </span>

                    <div className="flex items-center space-x-2">
                      
                      {/* Mark as Resolved Button (for admin / moderator) */}
                      {selectedFeedback.status === 'open' && (
                        <button
                          type="button"
                          onClick={() => handleToggleTicketStatus('closed')}
                          disabled={isClosingTicket}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 hover:text-emerald-300 border border-emerald-500/35 text-xs font-semibold transition-all disabled:opacity-50 flex items-center space-x-1.5 active:scale-95 shadow-[0_0_10px_rgba(16,185,129,0.12)]"
                        >
                          {isClosingTicket ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          <span>Mark as Resolved</span>
                        </button>
                      )}

                      {/* Post Comment Button */}
                      <button
                        type="button"
                        onClick={handleAddComment}
                        disabled={isSubmittingComment || !commentText.trim()}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center space-x-1.5 active:scale-[0.98]"
                      >
                        {isSubmittingComment ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>Post Reply</span>
                      </button>

                    </div>

                  </div>
                </div>

                {/* Comment List */}
                {selectedFeedback.comments && selectedFeedback.comments.length > 0 ? (
                  <div className="space-y-3 pt-2">
                    {selectedFeedback.comments.map((c) => (
                      <div
                        key={c.id}
                        className="p-3.5 sm:p-4 rounded-xl bg-[#05070a] border border-white/[0.06] space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center text-[10px] font-mono font-bold">
                              {c.userRole === 'admin' ? 'M' : 'A'}
                            </div>
                            <span className="font-semibold text-white font-mono text-[11px]">
                              {c.userRole === 'admin' ? 'Maintainer' : 'Anonymous Engineer'}
                            </span>
                            {c.userRole === 'admin' && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-mono border border-emerald-500/20">
                                Verified
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-zinc-500">
                            {formatDate(c.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap pl-7 font-sans">
                          {c.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic py-2 text-center font-mono">
                    No replies yet. Start the thread!
                  </p>
                )}

              </div>

            </div>

          </div>

        </div>
      )}

      {/* Global Footer (Crisp, Normal, Not dimmed) */}
      <Footer />
    </div>
  );
}
