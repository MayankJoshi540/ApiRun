'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, CheckCircle2, Lock, Mail, AlertCircle, ArrowRight, Server, Check, Loader2 } from '@/components/ui/GoogleIcon';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const redirectTarget = rawRedirect && rawRedirect.startsWith('/') ? rawRedirect : '/challenges';

  const { signInWithEmail, signInWithGoogle, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push(redirectTarget);
    }
  }, [user, router, redirectTarget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await signInWithEmail(email, password);
      router.push(redirectTarget);
    } catch (err: any) {
      console.error('Sign in error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please verify your credentials.');
      } else if (err.code === 'auth/configuration-not-found') {
        setError('Firebase Authentication is not initialized yet in Firebase Console. Please click "Get Started" in Firebase Auth.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please wait a moment and try again.');
      } else {
        setError(err.message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      router.push(redirectTarget);
    } catch (err: any) {
      console.error('Google sign in error:', err);
      if (err.code === 'auth/configuration-not-found') {
        setError('Google sign-in is not enabled in Firebase Console. Please enable Google in Firebase Authentication.');
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050708] text-[#F5F7FA] font-sans antialiased overflow-hidden selection:bg-[#10b981] selection:text-white flex flex-col justify-between">
      {/* Fine Technical Grid Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035] z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* 2. Floating Pill Navbar Matching Home Page */}
      <header className="relative z-50 w-full pt-4 sm:pt-6 px-4 sm:px-6 font-sans">
        <div className="max-w-5xl mx-auto rounded-full px-5 sm:px-6 h-14 sm:h-16 flex items-center justify-between bg-[#05070a]/80 border border-white/[0.1] shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          {/* Logo {•>} APIRun */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-left transition-transform hover:scale-105 active:scale-95 group"
          >
            <div className="flex items-center font-mono text-base sm:text-lg font-extrabold text-[#10b981] tracking-tighter">
              &#123;&bull;&gt;&#125;
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight font-sans">
              <span className="text-white">API</span>
              <span className="text-[#10b981]">Run</span>
            </span>
          </Link>

          {/* Right Action */}
          <Link
            href="/challenges"
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Explore Challenges</span>
          </Link>
        </div>
      </header>

      {/* 3. Main Two-Column Auth Container */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center my-auto">
        
        {/* Left Column: Home-styled Hero Copy & Live Test Preview Card */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/25 text-[#10b981] text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span>BACKEND PRACTICE PLATFORM</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-1 sm:space-y-2 font-display font-black tracking-tight leading-[1.05]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-white">
              Practice Real Backends.
            </h1>
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#10b981]">
              Level Up Your Skills.
            </h1>
          </div>

          <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed max-w-lg font-normal">
            Sign in to track your challenge completions, latency benchmarks, and test assertions across real production scenarios.
          </p>

          {/* Live Platform Endpoint Card (Matching Home Page Floating Cards) */}
          <div className="rounded-2xl bg-[#090d14]/90 border border-white/[0.1] backdrop-blur-xl p-5 shadow-2xl space-y-3 font-sans text-xs max-w-lg">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold font-mono text-[11px] border border-emerald-500/20">
                  POST
                </span>
                <span className="font-mono text-zinc-300">/api/v1/users</span>
              </div>
              <span className="text-[11px] text-[#10b981] font-mono font-semibold">201 CREATED &bull; 12.4ms</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center space-x-2 text-zinc-300 text-[11px]">
                <Check className="w-3.5 h-3.5 text-[#10b981] stroke-[3]" />
                <span>RFC-5322 payload schema validated</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-300 text-[11px]">
                <Check className="w-3.5 h-3.5 text-[#10b981] stroke-[3]" />
                <span>Deterministic duplicate email collision handling</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-300 text-[11px]">
                <Check className="w-3.5 h-3.5 text-[#10b981] stroke-[3]" />
                <span>Response contract headers verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto lg:ml-auto">
          <div className="rounded-3xl bg-[#080c14]/90 border border-white/[0.12] backdrop-blur-2xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
            <div className="space-y-1.5 text-left">
              <h2 className="text-2xl font-black text-white font-display tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs sm:text-sm text-[#94a3b8]">
                Sign in to your APIRun account to continue.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] hover:border-white/[0.2] text-white transition-all text-xs sm:text-sm font-semibold flex items-center justify-center space-x-3 active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.54 0 2.94.53 4.05 1.58l3.04-3.04C17.25 1.77 14.82 1 12 1 7.58 1 3.84 3.51 2.05 7.18l3.66 2.84C6.59 7.15 9.07 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.69 2.86c2.16-1.99 3.42-4.92 3.42-8.68z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.71 14.98c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L2.05 7.62C.75 10.21 0 12.02 0 12.72c0 .7.75 2.51 2.05 5.1l3.66-2.84z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.69-2.86c-1.08.72-2.45 1.16-4.24 1.16-2.93 0-5.41-2.15-6.29-5.02L2.05 16.21C3.84 19.88 7.58 23 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/[0.08] w-full" />
              <span className="bg-[#080c14] px-3 text-[11px] text-zinc-500 uppercase tracking-wider shrink-0 font-medium">
                Or with email
              </span>
              <div className="border-t border-white/[0.08] w-full" />
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5 text-left">
                <label className="text-zinc-300 font-medium text-xs">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@apirun.dev"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#05070a]/90 border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium text-xs">Password</label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#05070a]/90 border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all text-xs sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold font-display text-xs sm:text-sm transition-all shadow-md flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-1 text-center text-xs text-zinc-400">
              Don&apos;t have an account?{' '}
              <Link 
                href={rawRedirect ? `/sign-up?redirect=${encodeURIComponent(rawRedirect)}` : '/sign-up'} 
                className="text-[#10b981] hover:underline font-semibold"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

      </main>

      {/* 4. Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-zinc-500 border-t border-white/[0.06] bg-[#050708]/60 backdrop-blur-sm">
        APIRun Backend Engineering Platform &bull; Real Labs &bull; Production Ready
      </footer>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050708] flex items-center justify-center text-white">
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <Loader2 className="w-4 h-4 animate-spin text-[#10b981]" />
            <span>Loading authentication...</span>
          </div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
