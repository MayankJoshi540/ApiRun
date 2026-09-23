'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BackendRankNavbar } from '@/components/BackendRankNavbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  MessageSquarePlus, 
  Star, 
  Send, 
  CheckCircle2, 
  Layers, 
  Bug, 
  Zap, 
  MessageCircle, 
  ArrowRight, 
  Loader2, 
  Check, 
  Code2, 
  ThumbsUp,
  Eye,
  RefreshCw,
  Search,
  Mail,
  User,
  ShieldCheck,
  Clock,
  ArrowLeft,
  Activity,
  Trash2,
  AlertTriangle
} from '@/components/ui/GoogleIcon';

interface FeedbackItem {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  rating: number;
  category: string;
  subject: string;
  message: string;
  userId?: string;
  userAgent?: string;
}

const ADMIN_EMAIL = 'joshimayank646@gmail.com';

const CATEGORIES = [
  { id: 'Challenge Suggestion', label: 'New Challenge Idea', icon: Layers, desc: 'Suggest a real-world backend scenario, idempotency edge case, or system contract' },
  { id: 'Feature Request', label: 'Feature Request', icon: Code2, desc: 'Propose new features for the test harness, CLI runner, or Monaco editor' },
  { id: 'Bug Report', label: 'Bug Report', icon: Bug, desc: 'Report an issue with challenge assertions, runner execution, or UI' },
  { id: 'Performance', label: 'Harness & Performance', icon: Zap, desc: 'Suggest optimizations for runner latency, sandbox overhead, or streaming logs' },
  { id: 'General Feedback', label: 'General Experience', icon: MessageCircle, desc: 'Share your thoughts, praise, or ideas for improving the platform' },
];

export default function FeedbackPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Admin access strictly restricted to joshimayank646@gmail.com
  const isAdmin = Boolean(user?.email && user.email.toLowerCase().trim() === ADMIN_EMAIL);
  const [activeTab, setActiveTab] = useState<'submit' | 'inbox'>('submit');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Form State
  const [category, setCategory] = useState('Challenge Suggestion');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Admin Inbox & Table State
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    if (!isAdmin || !user?.email) return;

    try {
      setIsLoadingFeedbacks(true);
      const res = await fetch(`/api/feedback?adminEmail=${encodeURIComponent(user.email)}`, {
        headers: {
          'x-admin-email': user.email,
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to load database feedback records.');
      }
      
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
    } catch (err: any) {
      console.error('Error fetching feedbacks:', err);
      setActionNotice(err.message || 'Error loading records.');
    } finally {
      setIsLoadingFeedbacks(false);
    }
  };

  useEffect(() => {
    if (isAdmin && activeTab === 'inbox') {
      fetchFeedbacks();
    }
  }, [isAdmin, activeTab, user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMessage('Please enter your feedback message.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          rating,
          subject: subject.trim() || `${category} from ${name || 'Developer'}`,
          message: message.trim(),
          name: name.trim() || user?.displayName || 'Anonymous Developer',
          email: email.trim() || user?.email || 'developer@apirun.dev',
          userId: user?.uid || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit feedback.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Feedback submit error:', err);
      setErrorMessage(err.message || 'Could not save feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Feedback Entry (Admin Only)
  const handleDeleteFeedback = async (id: string) => {
    if (!user?.email || !isAdmin) return;
    
    if (!window.confirm('Are you sure you want to permanently delete this feedback entry from the database?')) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch('/api/feedback', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': user.email,
        },
        body: JSON.stringify({
          id,
          adminEmail: user.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete record.');
      }

      // Optimistic removal from state
      setFeedbacks(prev => prev.filter(item => item.id !== id));
      setActionNotice('Feedback entry successfully deleted from database.');
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err: any) {
      console.error('Delete feedback error:', err);
      alert(err.message || 'Failed to delete feedback entry.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setSubject('');
    setMessage('');
    setRating(5);
    setCategory('Challenge Suggestion');
    setErrorMessage(null);
  };

  // Filtered & Searched Feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(item => {
      const matchesSearch = 
        !searchQuery ||
        item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
      const matchesRating = filterRating === 'ALL' || item.rating === filterRating;

      return matchesSearch && matchesCategory && matchesRating;
    });
  }, [feedbacks, searchQuery, filterCategory, filterRating]);

  const averageRating = useMemo(() => {
    if (feedbacks.length === 0) return 5.0;
    const sum = feedbacks.reduce((acc, curr) => acc + (curr.rating || 5), 0);
    return (sum / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  return (
    <div className="min-h-screen bg-[#050708] text-[#f8fafc] font-sans antialiased relative selection:bg-emerald-500/30 selection:text-white flex flex-col justify-between">
      
      <BackendRankNavbar activeTab="feedback" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20 relative z-10 flex-grow w-full space-y-8 font-sans">
        
        {/* Admin Access Notification Banner (Visible exclusively to joshimayank646@gmail.com) */}
        {isAdmin && (
          <div className="rounded-2xl bg-[#080d16] border border-emerald-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-2">
                  <span>Database Administrator Mode</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    {ADMIN_EMAIL}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  You have authorized administrator privileges to view, search, and delete database feedback entries.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('submit')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  activeTab === 'submit'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08]'
                }`}
              >
                Submit Form
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('inbox');
                  fetchFeedbacks();
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  activeTab === 'inbox'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.1]'
                }`}
              >
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Admin DB Table ({feedbacks.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* Global Action Toast */}
        {actionNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* ----------------- ADMIN DATABASE TABLE & INBOX VIEW ----------------- */}
        {isAdmin && activeTab === 'inbox' ? (
          <div className="space-y-6">
            {/* Admin Stats Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#080d16] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Stored Records</div>
                  <div className="text-2xl font-black text-white mt-0.5">{feedbacks.length}</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-200">
                  <MessageSquarePlus className="w-5 h-5 text-emerald-400" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#080d16] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Average Score</div>
                  <div className="text-2xl font-black text-amber-400 mt-0.5">{averageRating} / 5.0</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-amber-400">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#080d16] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Database Source</div>
                  <div className="text-xs font-bold text-emerald-400 mt-1">Firestore &bull; feedbacks table</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-emerald-400">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Filter & View Mode Controls */}
            <div className="rounded-2xl bg-[#080d16] border border-white/[0.08] p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
                    <span>Database Feedback Submissions</span>
                    <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-slate-300">
                      {filteredFeedbacks.length} Showing
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live feedback records stored in Firestore database and synced locally.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-stretch sm:self-auto">
                  {/* Table vs Card View Toggle */}
                  <div className="flex items-center bg-black/40 p-0.5 rounded-xl border border-white/[0.08] text-xs">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        viewMode === 'table' ? 'bg-white/[0.1] text-emerald-300' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Table View
                    </button>
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        viewMode === 'cards' ? 'bg-white/[0.1] text-emerald-300' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Card View
                    </button>
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={fetchFeedbacks}
                    disabled={isLoadingFeedbacks}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-semibold text-white transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFeedbacks ? 'animate-spin text-emerald-400' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </div>

              {/* Search & Filters Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-white/[0.06]">
                <div className="relative md:col-span-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by keyword, author, email..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#04060a] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#04060a] border border-white/[0.08] rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Categories</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>

                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                  className="px-3.5 py-2.5 bg-[#04060a] border border-white/[0.08] rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Ratings (1 - 5 Stars)</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                  <option value="3">⭐⭐⭐ 3 Stars</option>
                  <option value="2">⭐⭐ 2 Stars</option>
                  <option value="1">⭐ 1 Star</option>
                </select>
              </div>
            </div>

            {/* List / Table Content */}
            {isLoadingFeedbacks ? (
              <div className="py-20 text-center space-y-3 rounded-2xl bg-[#080d16] border border-white/[0.08]">
                <Loader2 className="w-7 h-7 animate-spin text-emerald-400 mx-auto" />
                <p className="text-xs text-slate-400 font-medium">Fetching feedback database records...</p>
              </div>
            ) : filteredFeedbacks.length === 0 ? (
              <div className="py-16 text-center space-y-3 rounded-2xl bg-[#080d16] border border-white/[0.06] p-8">
                <MessageCircle className="w-8 h-8 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">No feedback records found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {searchQuery || filterCategory !== 'ALL' || filterRating !== 'ALL'
                    ? 'No submissions matched your current search filters.'
                    : 'No feedback submissions have been stored in the database yet.'}
                </p>
              </div>
            ) : viewMode === 'table' ? (
              /* ----------------- STRUCTURED DATABASE TABLE ----------------- */
              <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#080d16] shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[780px] text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-[#0d1320] text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                        <th className="p-4 w-[160px]">Date / Time</th>
                        <th className="p-4 w-[200px]">User &bull; Email</th>
                        <th className="p-4 w-[150px]">Category &amp; Rating</th>
                        <th className="p-4">Subject &amp; Message</th>
                        <th className="p-4 w-[110px] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {filteredFeedbacks.map((item) => (
                        <tr 
                          key={item.id} 
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          {/* Date / Time */}
                          <td className="p-4 align-top text-slate-400">
                            <div className="font-semibold text-white">
                              {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'N/A'}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </div>
                          </td>

                          {/* Author / Email */}
                          <td className="p-4 align-top">
                            <div className="font-bold text-white truncate max-w-[180px]">
                              {item.name || 'Anonymous'}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                              {item.email}
                            </div>
                            {item.userId && (
                              <div className="text-[10px] text-slate-600 truncate mt-0.5">
                                UID: {item.userId.substring(0, 8)}...
                              </div>
                            )}
                          </td>

                          {/* Category & Rating */}
                          <td className="p-4 align-top space-y-1.5">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300 text-[10px] font-semibold">
                              {item.category}
                            </span>
                            <div className="flex items-center space-x-1 text-amber-400">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3 h-3 ${s <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                                />
                              ))}
                              <span className="text-[11px] font-bold text-amber-400 pl-1">
                                {item.rating}/5
                              </span>
                            </div>
                          </td>

                          {/* Subject & Message */}
                          <td className="p-4 align-top space-y-1">
                            {item.subject && (
                              <div className="font-bold text-white text-xs">
                                {item.subject}
                              </div>
                            )}
                            <div className="p-2.5 rounded-xl bg-[#04060a] border border-white/[0.04] text-slate-300 text-xs leading-relaxed whitespace-pre-wrap max-h-[140px] overflow-y-auto">
                              {item.message}
                            </div>
                          </td>

                          {/* Actions: Delete Button */}
                          <td className="p-4 align-top text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              {item.email && item.email.includes('@') && (
                                <a
                                  href={`mailto:${item.email}?subject=Regarding your APIRun Feedback: ${encodeURIComponent(item.subject || item.category)}`}
                                  className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] transition-all"
                                  title="Reply via Email"
                                >
                                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                                </a>
                              )}

                              <button
                                onClick={() => handleDeleteFeedback(item.id)}
                                disabled={deletingId === item.id}
                                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/25 transition-all active:scale-95 disabled:opacity-50"
                                title="Delete from Database"
                              >
                                {deletingId === item.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* ----------------- CARD VIEW ----------------- */
              <div className="space-y-3.5">
                {filteredFeedbacks.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 rounded-2xl bg-[#080d16] border border-white/[0.08] space-y-3.5 shadow-lg"
                  >
                    {/* Top Row: Rating, Category, Date, Delete */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-amber-400">
                          {item.rating}/5
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-slate-300 text-[11px] font-semibold">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1.5 text-slate-500 text-[11px]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Recent'}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteFeedback(item.id)}
                          disabled={deletingId === item.id}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 transition-all active:scale-95 disabled:opacity-50"
                          title="Delete record"
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Submitter Details */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <div className="flex items-center space-x-1.5 text-white font-medium">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{item.name || 'Anonymous'}</span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <a
                          href={`mailto:${item.email}`}
                          className="hover:text-white transition-colors"
                        >
                          {item.email || 'No email provided'}
                        </a>
                      </div>

                      {item.userId && (
                        <span className="text-[10px] text-slate-600">
                          UID: {item.userId.substring(0, 10)}...
                        </span>
                      )}
                    </div>

                    {/* Subject & Message Content */}
                    <div className="space-y-1.5">
                      {item.subject && (
                        <h4 className="text-sm font-bold text-white">
                          {item.subject}
                        </h4>
                      )}
                      <div className="p-3.5 rounded-xl bg-[#04060a] border border-white/[0.04] text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                        {item.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ----------------- SUBMIT FEEDBACK VIEW (FOR ALL USERS) ----------------- */
          <>
            {/* Header Eyebrow & Title */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>DEVELOPER FEEDBACK</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Help Us Improve APIRun
              </h1>

              <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed font-normal">
                Suggest a backend challenge scenario, report an issue, or request API testing features.
              </p>
            </div>

            {/* Feedback Card Form / Success View */}
            <div className="rounded-3xl bg-[#080d16] border border-white/[0.1] p-6 sm:p-9 shadow-2xl">
              
              {isSuccess ? (
                /* Success Screen */
                <div className="py-8 text-center space-y-5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
                    <Check className="w-7 h-7 stroke-[3]" />
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Feedback Received!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                      Thank you for contributing! Your feedback is securely stored in our database to help us improve APIRun.
                    </p>
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleResetForm}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white text-xs font-semibold border border-white/[0.08] transition-colors"
                    >
                      Submit Another Feedback
                    </button>

                    <button
                      onClick={() => router.push('/challenges')}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40"
                    >
                      <span>Back to Challenges</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Feedback Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* 1. Category Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      1. Feedback Category
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {CATEGORIES.map(cat => {
                        const Icon = cat.icon;
                        const isSelected = category === cat.id;

                        return (
                          <div
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col space-y-1 text-left ${
                              isSelected
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-sm'
                                : 'bg-[#04060a] border-white/[0.06] hover:border-white/[0.12] text-slate-400'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                              <span className="text-xs font-bold text-white">{cat.label}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-tight">
                              {cat.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Rating */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      2. Overall Rating
                    </label>
                    
                    <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[#04060a] border border-white/[0.08] w-fit">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isLit = (hoveredRating || rating) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              onMouseEnter={() => setHoveredRating(star)}
                              onMouseLeave={() => setHoveredRating(0)}
                              onClick={() => setRating(star)}
                              className="p-1 hover:scale-105 transition-transform text-amber-400"
                            >
                              <Star className={`w-4 h-4 ${isLit ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                            </button>
                          );
                        })}
                      </div>
                      
                      <span className="text-xs text-slate-400 pl-2.5 border-l border-white/[0.08] font-semibold">
                        {rating === 5 ? '5/5 Excellent' : rating === 4 ? '4/5 Great' : rating === 3 ? '3/5 Good' : rating === 2 ? '2/5 Needs Work' : '1/5 Poor'}
                      </span>
                    </div>
                  </div>

                  {/* 3. Title / Subject */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      3. Subject / Summary
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Add distributed lock challenge / Editor shortcut feature"
                      className="w-full px-4 py-2.5 bg-[#04060a] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm transition-all"
                    />
                  </div>

                  {/* 4. Detailed Message */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        4. Detailed Message
                      </label>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {message.length} characters
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your suggestion, edge case, or feedback in detail..."
                      className="w-full px-4 py-3 bg-[#04060a] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm resize-y leading-relaxed transition-all"
                    />
                  </div>

                  {/* 5. User Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-white/[0.06]">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300">Name (Optional)</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Mayank Joshi"
                        className="w-full px-3.5 py-2.5 bg-[#04060a] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300">Email (Optional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. developer@apirun.dev"
                        className="w-full px-3.5 py-2.5 bg-[#04060a] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-emerald-950/40 flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-95 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Feedback to Database...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Developer Feedback</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>

            {/* Feature Suggestion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs text-slate-400">
              <div className="p-4 rounded-2xl bg-[#080d16] border border-white/[0.06] space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>Challenge Ideas</span>
                </div>
                <p className="leading-relaxed text-slate-400">
                  Suggest distributed locks, rate limiters, or queue batching challenge contracts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#080d16] border border-white/[0.06] space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Harness &amp; CLI</span>
                </div>
                <p className="leading-relaxed text-slate-400">
                  Help us refine assertion speed, terminal log output, and RFC test accuracy.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#080d16] border border-white/[0.06] space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-2">
                  <ThumbsUp className="w-4 h-4 text-sky-400" />
                  <span>Platform Quality</span>
                </div>
                <p className="leading-relaxed text-slate-400">
                  Every submission is reviewed to improve challenge depth and interview tracks.
                </p>
              </div>
            </div>
          </>
        )}

      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
