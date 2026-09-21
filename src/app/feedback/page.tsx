'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BackendRankNavbar } from '@/components/BackendRankNavbar';
import { useAuth } from '@/context/AuthContext';
import { 
  MessageSquarePlus, 
  Star, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Bug, 
  Zap, 
  MessageCircle, 
  ArrowRight, 
  Loader2, 
  FileText, 
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
  ArrowLeft
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

const ADMIN_EMAILS = ['joshimayank646@gmail.com'];

const CATEGORIES = [
  { id: 'Challenge Suggestion', label: 'New Challenge Idea', icon: Layers, desc: 'Suggest a real-world backend scenario or edge case' },
  { id: 'Feature Request', label: 'Feature Request', icon: Sparkles, desc: 'Ideas for Monaco editor, CLI, or test harness' },
  { id: 'Bug Report', label: 'Bug Report', icon: Bug, desc: 'Issue with test runner, contracts, or UI' },
  { id: 'Performance', label: 'Test Harness & Performance', icon: Zap, desc: 'Latency, runner sandbox, or assertions' },
  { id: 'General Feedback', label: 'General Experience', icon: MessageCircle, desc: 'Overall impressions and suggestions' },
];

export default function FeedbackPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Admin state
  const isAdmin = Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase().trim()));
  const [activeTab, setActiveTab] = useState<'submit' | 'inbox'>('submit');

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

  // Admin Inbox State
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL');

  const fetchFeedbacks = async () => {
    try {
      setIsLoadingFeedbacks(true);
      const res = await fetch('/api/feedback');
      if (!res.ok) throw new Error('Failed to load feedback records.');
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
    } catch (err: any) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setIsLoadingFeedbacks(false);
    }
  };

  useEffect(() => {
    if (isAdmin && activeTab === 'inbox') {
      fetchFeedbacks();
    }
  }, [isAdmin, activeTab]);

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

  const handleResetForm = () => {
    setIsSuccess(false);
    setSubject('');
    setMessage('');
    setRating(5);
  };

  const handleNavigate = (tab: 'landing' | 'challenges' | 'progress' | 'feedback' | 'dashboard') => {
    if (tab === 'landing') router.push('/');
    else if (tab === 'progress') router.push('/progress');
    else if (tab === 'challenges' || tab === 'dashboard') router.push('/challenges');
    else router.push('/feedback');
  };

  // Filtered feedbacks for Admin Inbox
  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesSearch = 
      (fb.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fb.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fb.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fb.message || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fb.category || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'ALL' || fb.category === filterCategory;
    const matchesRating = filterRating === 'ALL' || fb.rating === filterRating;

    return matchesSearch && matchesCategory && matchesRating;
  });

  return (
    <div className="min-h-screen bg-[#050708] text-[#F5F7FA] font-sans antialiased relative selection:bg-[#10b981] selection:text-white">
      
      {/* Top Navbar */}
      <BackendRankNavbar
        activeTab="feedback"
        onSelectTab={handleNavigate}
        solvedCount={0}
        totalCount={12}
      />

      {/* Main Feedback Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8 relative z-10">
        
        {/* Admin Switcher Bar (Visible only for joshimayank646@gmail.com) */}
        {isAdmin && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-xl animate-in fade-in">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span>Admin Access Verified</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                    {user?.email}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  You have administrative privileges to review user submissions.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('submit')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'submit'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border border-white/[0.08]'
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
                className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'inbox'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>See Feedbacks ({feedbacks.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* ----------------- ADMIN INBOX VIEW ----------------- */}
        {isAdmin && activeTab === 'inbox' ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header / Search Controls */}
            <div className="rounded-3xl bg-[#080c14]/90 border border-white/[0.1] backdrop-blur-2xl p-6 sm:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-display flex items-center space-x-2">
                    <span>Developer Feedback Inbox</span>
                    <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      {feedbacks.length} Total
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Live feedback submissions retrieved from Firebase Firestore.
                  </p>
                </div>

                <button
                  onClick={fetchFeedbacks}
                  disabled={isLoadingFeedbacks}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-white transition-all active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFeedbacks ? 'animate-spin text-emerald-400' : ''}`} />
                  <span>Refresh List</span>
                </button>
              </div>

              {/* Search & Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-white/[0.08]">
                <div className="relative md:col-span-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by keyword, email..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#05070a] border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Filter Category */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#05070a] border border-white/[0.1] rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Categories</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>

                {/* Filter Rating */}
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                  className="px-3.5 py-2.5 bg-[#05070a] border border-white/[0.1] rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
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

            {/* List of Feedback Cards */}
            {isLoadingFeedbacks ? (
              <div className="py-16 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
                <p className="text-xs text-zinc-400">Loading user feedbacks from database...</p>
              </div>
            ) : filteredFeedbacks.length === 0 ? (
              <div className="py-16 text-center space-y-3 rounded-3xl bg-[#080c14]/40 border border-white/[0.06] p-8">
                <MessageCircle className="w-10 h-10 text-zinc-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No feedbacks found</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  {searchQuery || filterCategory !== 'ALL' || filterRating !== 'ALL'
                    ? 'No submissions matched your search filters.'
                    : 'No feedback submissions have been recorded yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFeedbacks.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-2xl bg-[#080c14]/80 border border-white/[0.08] hover:border-emerald-500/30 transition-all space-y-4 shadow-lg"
                  >
                    {/* Card Top Row: Rating, Category, Date */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${s <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {item.rating}/5
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-zinc-300 text-[11px] font-medium">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5 text-zinc-500 text-[11px] font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Recent'}
                        </span>
                      </div>
                    </div>

                    {/* Submitter Details */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                      <div className="flex items-center space-x-1.5 text-white font-medium">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{item.name || 'Anonymous'}</span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-zinc-500" />
                        <a
                          href={`mailto:${item.email}`}
                          className="hover:text-emerald-400 transition-colors underline underline-offset-2"
                        >
                          {item.email || 'No email provided'}
                        </a>
                      </div>

                      {item.userId && (
                        <span className="text-[10px] font-mono text-zinc-600">
                          UID: {item.userId.substring(0, 10)}...
                        </span>
                      )}
                    </div>

                    {/* Subject & Message Content */}
                    <div className="space-y-2">
                      {item.subject && (
                        <h4 className="text-sm font-bold text-white font-display">
                          {item.subject}
                        </h4>
                      )}
                      <div className="p-4 rounded-xl bg-black/40 border border-white/[0.05] text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                        {item.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ----------------- SUBMIT FEEDBACK VIEW ----------------- */
          <>
            {/* Header Eyebrow & Title */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/25 text-[#10b981] text-xs font-semibold uppercase tracking-wider">
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>DEVELOPER FEEDBACK</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight">
                Help Us Make APIRun Better
              </h1>

              <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
                Suggest a new production challenge, request an API test feature, or share your thoughts to help shape the future of backend practice.
              </p>
            </div>

            {/* Feedback Card Form / Success View */}
            <div className="rounded-3xl bg-[#080c14]/90 border border-white/[0.1] backdrop-blur-2xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              
              {isSuccess ? (
                /* Success Screen */
                <div className="py-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-[#10b981]/40 flex items-center justify-center mx-auto text-[#10b981]">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white font-display">
                      Feedback Received!
                    </h2>
                    <p className="text-sm text-zinc-400 max-w-md mx-auto">
                      Thank you for contributing! Your feedback has been successfully recorded in our database.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleResetForm}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.1] transition-all"
                    >
                      Submit Another Feedback
                    </button>

                    <button
                      onClick={() => router.push('/challenges')}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-white/[0.1] hover:bg-white/[0.16] text-white text-xs font-semibold border border-white/[0.15] transition-all"
                    >
                      <span>Back to Challenges</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Feedback Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-center space-x-2">
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* 1. Category Selection */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
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
                                ? 'bg-white/[0.08] border-[#10b981]/50 text-white'
                                : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] text-zinc-400'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-[#10b981]' : 'text-zinc-500'}`} />
                              <span className="text-xs font-bold text-white">{cat.label}</span>
                            </div>
                            <p className="text-[11px] text-zinc-500 leading-tight">
                              {cat.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Rating */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      2. Overall Experience Rating
                    </label>
                    
                    <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.08] w-fit">
                      <div className="flex items-center space-x-1.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isLit = (hoveredRating || rating) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              onMouseEnter={() => setHoveredRating(star)}
                              onMouseLeave={() => setHoveredRating(0)}
                              onClick={() => setRating(star)}
                              className="p-1 hover:scale-110 transition-transform text-amber-400"
                            >
                              <Star className={`w-5 h-5 ${isLit ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`} />
                            </button>
                          );
                        })}
                      </div>
                      
                      <span className="text-xs font-mono text-zinc-400 pl-2 border-l border-white/[0.1]">
                        {rating === 5 ? '⭐⭐⭐⭐⭐ Excellent' : rating === 4 ? '⭐⭐⭐⭐ Great' : rating === 3 ? '⭐⭐⭐ Good' : rating === 2 ? '⭐⭐ Needs Work' : '⭐ Poor'}
                      </span>
                    </div>
                  </div>

                  {/* 3. Title / Subject */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      3. Subject / Summary
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Add distributed Redlock challenge / Improve dark mode contrast"
                      className="w-full px-4 py-3 bg-[#05070a] border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all text-xs sm:text-sm"
                    />
                  </div>

                  {/* 4. Detailed Message */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                        4. Your Detailed Feedback &amp; Ideas
                      </label>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {message.length} characters
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your suggestion, edge case scenario, or feedback in detail. How can we make this platform more valuable for your backend interview and system practice?"
                      className="w-full px-4 py-3 bg-[#05070a] border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all text-xs sm:text-sm resize-y leading-relaxed"
                    />
                  </div>

                  {/* 5. User Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.08]">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300">Your Name (Optional)</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Mayank Joshi"
                        className="w-full px-3.5 py-2.5 bg-[#05070a] border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#10b981] text-xs sm:text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300">Your Email (Optional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. developer@apirun.dev"
                        className="w-full px-3.5 py-2.5 bg-[#05070a] border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#10b981] text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold font-display text-sm transition-all shadow-sm flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Feedback...</span>
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

            {/* Feature Suggestion Inspirations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-400">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <Code2 className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Challenge Ideas</span>
                </div>
                <p className="leading-relaxed">
                  Have a favorite distributed lock, GraphQL batching, or gRPC streaming problem? Share the contract spec!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Harness &amp; CLI</span>
                </div>
                <p className="leading-relaxed">
                  Let us know how the local execution CLI and RFC validation harness can run smoother in your workflow.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <ThumbsUp className="w-3.5 h-3.5 text-sky-400" />
                  <span>Platform Quality</span>
                </div>
                <p className="leading-relaxed">
                  Every piece of feedback helps improve challenge assertions, runner accuracy, and learning paths.
                </p>
              </div>
            </div>
          </>
        )}

      </main>

    </div>
  );
}
