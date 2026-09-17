'use client';

import React, { useState } from 'react';
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
  ThumbsUp
} from 'lucide-react';

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
  const [savedLocation, setSavedLocation] = useState<string | null>(null);

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

      setSavedLocation(data.savedTo || 'feedbacks.json');
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

  return (
    <div className="min-h-screen bg-[#050708] text-[#F5F7FA] font-sans antialiased relative selection:bg-[#00f2a9] selection:text-black">
      
      {/* Top Navbar */}
      <BackendRankNavbar
        activeTab="feedback"
        onSelectTab={handleNavigate}
        solvedCount={0}
        totalCount={12}
      />

      {/* Main Feedback Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8 relative z-10">
        
        {/* Header Eyebrow & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#00f2a9]/10 border border-[#00f2a9]/25 text-[#00f2a9] text-xs font-semibold uppercase tracking-wider">
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
              <div className="w-16 h-16 rounded-2xl bg-[#00f2a9]/10 border border-[#00f2a9]/30 flex items-center justify-center mx-auto text-[#00f2a9] shadow-[0_0_30px_rgba(0,242,169,0.2)]">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white font-display">
                  Feedback Received &amp; Saved!
                </h2>
                <p className="text-sm text-zinc-400 max-w-md mx-auto">
                  Thank you for contributing! Your feedback has been saved to your local machine file:
                </p>
                {savedLocation && (
                  <div className="inline-block mt-2 px-4 py-2 rounded-xl bg-black/60 border border-white/[0.1] text-xs font-mono text-[#00f2a9]">
                    {savedLocation}
                  </div>
                )}
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
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#00f2a9] hover:bg-[#00d696] text-black text-xs font-bold font-display shadow-md transition-all"
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
                            ? 'bg-[#00f2a9]/10 border-[#00f2a9]/50 shadow-[0_0_15px_rgba(0,242,169,0.15)] text-white'
                            : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] text-zinc-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#00f2a9]' : 'text-zinc-500'}`} />
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
                  className="w-full px-4 py-3 bg-[#05070a] border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#00f2a9] focus:ring-1 focus:ring-[#00f2a9] transition-all text-xs sm:text-sm"
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
                  className="w-full px-4 py-3 bg-[#05070a] border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#00f2a9] focus:ring-1 focus:ring-[#00f2a9] transition-all text-xs sm:text-sm resize-y leading-relaxed"
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
                    className="w-full px-3.5 py-2.5 bg-[#05070a] border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#00f2a9] text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Your Email (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. developer@apirun.dev"
                    className="w-full px-3.5 py-2.5 bg-[#05070a] border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#00f2a9] text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#00f2a9] hover:bg-[#00d696] text-black font-bold font-display text-sm transition-all shadow-[0_4px_25px_rgba(0,242,169,0.3)] flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Feedback Locally...</span>
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
              <Code2 className="w-3.5 h-3.5 text-[#00f2a9]" />
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
              Every piece of feedback is saved locally into <code className="text-[#00f2a9]">feedbacks.json</code> to iterate on.
            </p>
          </div>
        </div>

      </main>

    </div>
  );
}
