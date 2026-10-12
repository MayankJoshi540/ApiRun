'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BackendRankNavbar } from '@/components/BackendRankNavbar';
import { Footer } from '@/components/Footer';
import { FeedbackCard } from '@/components/FeedbackCard';
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
  ChevronLeft,
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
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;
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

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedFeedback) {
        setSelectedFeedback(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFeedback]);

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
      const res = await fetch(
        `/api/feedback?type=${activeTypeTab}&sort=${activeSort}&status=${statusFilter}&_t=${Date.now()}`,
        {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        }
      );
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

    if (!isAdmin) {
      alert('Only the moderator (joshimayank646@gmail.com) can delete feedback items.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to permanently delete this feedback?');
    if (!confirmed) return;

    try {
      setDeletingId(feedbackId);

      const res = await fetch(`/api/feedback?id=${encodeURIComponent(feedbackId)}&email=${encodeURIComponent(user?.email || '')}`, {
        method: 'DELETE',
        headers: {
          'x-user-email': user?.email || '',
        },
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

  // Handle New Feedback Form Submission (Stored anonymously, shows in main immediately)
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

      // Optimistically insert newly created feedback immediately at the top of feed
      if (data.feedback) {
        setFeedbacks((prev) => [data.feedback, ...prev.filter((fb) => fb.id !== data.feedback.id)]);
        setCounts((prev) => ({
          ...prev,
          all: prev.all + 1,
          open: prev.open + 1,
          [data.feedback.type === 'bug' ? 'bugs' : 'suggestions']:
            prev[data.feedback.type === 'bug' ? 'bugs' : 'suggestions'] + 1,
        }));
      }

      setFormSuccessMessage('Feedback recorded and posted to the community feed!');
      setFormTitle('');
      setFormDescription('');

      // If user had active filters hiding new open feedback, reset them so user sees it right away
      if (statusFilter === 'closed') {
        setStatusFilter('all');
      }
      setSearchQuery('');

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
          userEmail: user?.email || undefined,
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

  // Handle Closing or Reopening Ticket (STRICTLY MODERATOR ONLY)
  const handleToggleTicketStatus = async (targetStatus: 'closed' | 'open') => {
    if (!selectedFeedback) return;

    if (!isAdmin) {
      alert('Only the moderator (joshimayank646@gmail.com) is authorized to resolve or reopen feedback tickets.');
      return;
    }

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
          userName: 'Moderator',
          userRole: 'admin',
          userEmail: user?.email || undefined,
          closingNote: commentText.trim() ? commentText.trim() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update ticket status.');

      const updated = data.feedback || {
        ...selectedFeedback,
        status: targetStatus,
        closedAt: targetStatus === 'closed' ? new Date().toISOString() : undefined,
        closedBy: targetStatus === 'closed' ? 'Moderator' : undefined,
      };

      setSelectedFeedback(updated);
      setFeedbacks((prev) =>
        prev.map((fb) => (fb.id === selectedFeedback.id ? { ...fb, ...updated } : fb))
      );

      if (commentText.trim()) {
        setCommentText('');
      }

      fetchFeedbacks();
    } catch (err: any) {
      console.error('Error toggling ticket status:', err);
      alert(err.message || 'Failed to update ticket status.');
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

  // Reset to first page when search, status, type, or sort filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, activeTypeTab, activeSort]);

  const totalPages = Math.max(1, Math.ceil(displayedFeedbacks.length / ITEMS_PER_PAGE));

  const paginatedFeedbacks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return displayedFeedbacks.slice(start, start + ITEMS_PER_PAGE);
  }, [displayedFeedbacks, currentPage]);

  const scrollToFeedTop = () => {
    const el = document.getElementById('feedback-feed-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
            background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255, 255, 255, 0.05), transparent 75%)',
            filter: 'blur(50px)',
          }}
        />

        {/* High-Resolution Globe / Grid Artwork (Visible & Crisp) */}
        <img
          src="/backgrounds/background.png"
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
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.04) 0%, transparent 70%)',
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
        
        {/* Moderator Info Banner (Visible for Admin - Fully Mobile Responsive) */}
        {isAdmin && (
          <div className="mb-6 sm:mb-8 p-3.5 sm:p-4 rounded-xl bg-[#090e17]/95 backdrop-blur-md border border-emerald-500/20 shadow-[0_4px_20px_rgba(16,185,129,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center space-x-3 w-full sm:w-auto min-w-0 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span>Moderator Access Active</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 text-[10px] font-mono border border-emerald-500/30 break-all max-w-full">
                    {user?.email}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-1 leading-snug">
                  You can permanently delete feedback items, resolve tickets, and post as Moderator.
                </p>
              </div>
            </div>
            <button
              onClick={fetchFeedbacks}
              className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/[0.08] text-xs font-semibold text-white transition-colors shrink-0 self-stretch sm:self-auto"
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
                
                {/* Type Tabs (All / Features / Bugs) */}
                <div className="inline-flex items-center gap-1 p-1 bg-[#05070a] rounded-xl border border-white/[0.08] w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTypeTab('all')}
                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer select-none ${
                      activeTypeTab === 'all'
                        ? 'bg-white/[0.12] text-white font-semibold shadow-xs'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] font-medium'
                    }`}
                  >
                    <span className="leading-none">All</span>
                    <span
                      className={`inline-flex items-center justify-center h-4.5 min-w-[18px] px-1.5 rounded-full text-[10px] font-mono leading-none ${
                        activeTypeTab === 'all'
                          ? 'bg-white/[0.18] text-white font-semibold'
                          : 'bg-white/[0.06] text-zinc-400'
                      }`}
                    >
                      {counts.all}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTypeTab('suggestions')}
                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer select-none ${
                      activeTypeTab === 'suggestions'
                        ? 'bg-white/[0.12] text-white font-semibold shadow-xs'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] font-medium'
                    }`}
                  >
                    <span className="leading-none">Features</span>
                    <span
                      className={`inline-flex items-center justify-center h-4.5 min-w-[18px] px-1.5 rounded-full text-[10px] font-mono leading-none ${
                        activeTypeTab === 'suggestions'
                          ? 'bg-emerald-500/25 text-emerald-300 font-semibold border border-emerald-500/30'
                          : 'bg-white/[0.06] text-zinc-400'
                      }`}
                    >
                      {counts.suggestions}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTypeTab('bugs')}
                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer select-none ${
                      activeTypeTab === 'bugs'
                        ? 'bg-white/[0.12] text-white font-semibold shadow-xs'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] font-medium'
                    }`}
                  >
                    <span className="leading-none">Bugs</span>
                    <span
                      className={`inline-flex items-center justify-center h-4.5 min-w-[18px] px-1.5 rounded-full text-[10px] font-mono leading-none ${
                        activeTypeTab === 'bugs'
                          ? 'bg-rose-500/25 text-rose-300 font-semibold border border-rose-500/30'
                          : 'bg-white/[0.06] text-zinc-400'
                      }`}
                    >
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
                        ? 'bg-white/[0.12] text-white border-white/20'
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
                        ? 'bg-white/[0.12] text-white border-white/20'
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
                        ? 'bg-white/[0.12] text-white border-white/20'
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
                    placeholder="Search feedback or features..."
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
            <div id="feedback-feed-anchor" className="scroll-mt-24" />
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
              <div className="space-y-4 sm:space-y-5">
                {paginatedFeedbacks.map((item, index) => {
                  const overallIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
                  const hasVoted = item.upvotedBy.includes(currentUserId);

                  return (
                    <FeedbackCard
                      key={item.id}
                      item={item}
                      index={overallIndex}
                      hasVoted={hasVoted}
                      isAdmin={isAdmin}
                      isDeleting={deletingId === item.id}
                      onVote={handleVote}
                      onSelect={setSelectedFeedback}
                      onDelete={handleDeleteFeedback}
                      formatDate={formatDate}
                      formatTicketNumber={formatTicketNumber}
                    />
                  );
                })}

                {/* Pagination Navigation Bar */}
                {totalPages > 1 && (
                  <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs select-none">
                    {/* Record count information */}
                    <div className="text-zinc-400 font-mono text-[11px] sm:text-xs">
                      Showing{' '}
                      <span className="text-white font-semibold">
                        {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, displayedFeedbacks.length)}
                      </span>{' '}
                      of <span className="text-white font-semibold">{displayedFeedbacks.length}</span> feedback items
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-1.5">
                      {/* Previous Page Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPage((p) => Math.max(1, p - 1));
                          scrollToFeedTop();
                        }}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 hover:text-white font-medium flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                      </button>

                      {/* Numbered Page Buttons */}
                      <div className="flex items-center gap-1 px-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                          if (
                            totalPages > 5 &&
                            pageNum !== 1 &&
                            pageNum !== totalPages &&
                            Math.abs(pageNum - currentPage) > 1
                          ) {
                            if (pageNum === 2 || pageNum === totalPages - 1) {
                              return (
                                <span key={pageNum} className="px-1 text-zinc-600 font-mono text-[11px]">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          }

                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => {
                                setCurrentPage(pageNum);
                                scrollToFeedTop();
                              }}
                              className={`w-7 h-7 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
                                currentPage === pageNum
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xs'
                                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      {/* Next Page Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPage((p) => Math.min(totalPages, p + 1));
                          scrollToFeedTop();
                        }}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 hover:text-white font-medium flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* ================= RIGHT COLUMN: STICKY SUBMISSION FORM (1 COL) ================= */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl bg-[#090d14]/85 backdrop-blur-md border border-white/[0.08] p-5 sm:p-6 space-y-4">
              
              <div className="border-b border-white/[0.06] pb-3">
                <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  DEVELOPER FEEDBACK
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
                        Submit {formType === 'bug' ? 'Bug Report' : 'Feature'}
                      </span>
                    </>
                  )}
                </button>

              </form>

              {/* Bottom Support Link */}
              <div className="pt-2 border-t border-white/[0.06] text-center">
                <p className="text-[11px] text-zinc-500 leading-relaxed break-words">
                  Direct question or urgent issue? Contact maintainers at{' '}
                  <a
                    href="mailto:joshimayank646@gmail.com"
                    className="text-emerald-400 hover:underline font-mono inline-block break-all"
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
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedFeedback(null)}
        >
          <div 
            className="relative w-full max-w-3xl max-h-[92vh] bg-[#0d121c] border border-white/[0.12] rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col shadow-[0_25px_70px_rgba(0,0,0,0.85)] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-7 border-b border-white/[0.08] bg-[#090e17] space-y-4">
              
              {/* Top Meta Strip */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Ticket Code */}
                  <span className="font-mono text-xs text-zinc-400 font-semibold px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08]">
                    {formatTicketNumber(selectedFeedback.id, 0)}
                  </span>

                  {/* Type Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                      selectedFeedback.type === 'bug'
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/25'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                    }`}
                  >
                    {selectedFeedback.type === 'bug' ? (
                      <Bug className="w-3.5 h-3.5" />
                    ) : (
                      <Zap className="w-3.5 h-3.5" />
                    )}
                    <span>{selectedFeedback.type === 'bug' ? 'Bug Report' : 'Feature'}</span>
                  </span>

                  {/* Status Indicator */}
                  {selectedFeedback.status === 'closed' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/35">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Resolved</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span>Open</span>
                    </span>
                  )}

                  <span className="text-zinc-600 hidden sm:inline">•</span>

                  <span className="text-zinc-400 font-mono text-xs">
                    {formatDate(selectedFeedback.createdAt)}
                  </span>

                  <span className="text-zinc-600 hidden sm:inline">•</span>

                  <span className="text-zinc-400 font-mono text-xs">
                    {selectedFeedback.userName || 'Anonymous Engineer'}
                  </span>
                </div>

                {/* Top Right Controls: Admin Delete & Close */}
                <div className="flex items-center space-x-1 shrink-0">
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteFeedback(selectedFeedback.id)}
                      title="Delete permanently (Moderator)"
                      className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedFeedback(null)}
                    title="Close (Esc)"
                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/[0.1] transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Title & Upvote Row */}
              <div className="flex items-start gap-4 sm:gap-5">
                <button
                  type="button"
                  onClick={() => handleVote(selectedFeedback.id)}
                  className={`flex flex-col items-center justify-center min-w-[54px] sm:min-w-[58px] py-2.5 px-2 rounded-xl border transition-all duration-150 active:scale-95 cursor-pointer shrink-0 ${
                    selectedFeedback.upvotedBy.includes(currentUserId)
                      ? 'bg-white text-zinc-950 border-white font-bold shadow-xs'
                      : 'bg-white/[0.04] hover:bg-white/[0.09] border-white/[0.1] hover:border-white/[0.2] text-zinc-300 hover:text-white'
                  }`}
                  title="Upvote"
                >
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-xs font-bold font-mono tabular-nums mt-0.5">
                    {selectedFeedback.upvotesCount}
                  </span>
                </button>

                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                  {selectedFeedback.title}
                </h2>
              </div>

            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-7">
              
              {/* Full Description - Clean Editorial Layout without nested box slop */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                  Description
                </h4>
                <div className="text-sm sm:text-base text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedFeedback.description}
                </div>
              </div>

              {/* Status Notice if Closed */}
              {selectedFeedback.status === 'closed' && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/35 text-xs text-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center space-x-2">
                        <span className="text-emerald-400 font-mono text-[11px] uppercase tracking-wider">RESOLVED BY MAINTAINER</span>
                      </div>
                      <p className="text-emerald-300/80 text-xs mt-0.5">
                        This item has been reviewed and addressed in APIRun.
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleToggleTicketStatus('open')}
                      disabled={isClosingTicket}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white border border-white/[0.1] text-xs font-mono font-semibold transition-colors shrink-0 cursor-pointer"
                    >
                      Reopen Issue
                    </button>
                  )}
                </div>
              )}

              {/* Discussion Section */}
              <div className="space-y-5 pt-3 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center space-x-2">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Discussion ({selectedFeedback.comments?.length || 0})</span>
                  </h4>
                </div>

                {/* Reply Composer */}
                <div className="space-y-3">
                  <textarea
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a constructive reply or note..."
                    className="w-full p-4 bg-white/[0.03] border border-white/[0.1] focus:border-emerald-400 focus:bg-white/[0.05] rounded-xl text-sm text-white placeholder-zinc-500 font-sans transition-all resize-y min-h-[90px] outline-none"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-zinc-400 font-mono">
                      {isAdmin ? 'Posting as Verified Maintainer' : 'Posting anonymously'}
                    </span>

                    <div className="flex items-center space-x-2.5">
                      {/* Mark as Resolved Button (Moderator Only) */}
                      {isAdmin && selectedFeedback.status === 'open' && (
                        <button
                          type="button"
                          onClick={() => handleToggleTicketStatus('closed')}
                          disabled={isClosingTicket}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/35 text-xs font-semibold transition-all disabled:opacity-50 flex items-center space-x-1.5 active:scale-95 cursor-pointer"
                        >
                          {isClosingTicket ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          <span>Mark as Resolved</span>
                        </button>
                      )}

                      {/* Submit Reply */}
                      <button
                        type="button"
                        onClick={handleAddComment}
                        disabled={isSubmittingComment || !commentText.trim()}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold transition-all disabled:opacity-40 flex items-center space-x-1.5 active:scale-95 cursor-pointer shadow-xs"
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
                  <div className="space-y-3.5 pt-2">
                    {selectedFeedback.comments.map((c) => (
                      <div
                        key={c.id}
                        className={`p-4 rounded-xl border transition-colors space-y-2 ${
                          c.userRole === 'admin'
                            ? 'bg-white/[0.06] border-white/[0.14]'
                            : 'bg-white/[0.03] border-white/[0.07]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                              c.userRole === 'admin' ? 'bg-white text-zinc-950' : 'bg-zinc-800 text-zinc-300'
                            }`}>
                              {c.userRole === 'admin' ? 'M' : 'A'}
                            </div>
                            <span className="font-semibold text-white font-mono text-xs">
                              {c.userRole === 'admin' ? 'Maintainer' : (c.userName || 'Anonymous Engineer')}
                            </span>
                            {c.userRole === 'admin' && (
                              <span className="px-2 py-0.5 rounded-full bg-white/[0.1] text-zinc-200 text-[10px] font-mono font-bold border border-white/[0.15]">
                                Verified
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono text-zinc-400">
                            {formatDate(c.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap pl-8 font-sans">
                          {c.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 py-3 text-center font-mono">
                    No replies yet. Be the first to join the discussion.
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
