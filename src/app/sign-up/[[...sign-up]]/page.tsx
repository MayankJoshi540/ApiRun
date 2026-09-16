'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, CheckCircle2, Lock, Mail, AlertCircle, ArrowRight, Terminal } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      router.push('/challenges');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await signUpWithEmail(email, password);
      router.push('/challenges');
    } catch (err: any) {
      console.error('Sign up error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
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
      router.push('/challenges');
    } catch (err: any) {
      console.error('Google sign in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050607] text-[#F5F7FA] flex flex-col justify-between selection:bg-[#F8B81F] selection:text-black">
      {/* Top Navbar */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/[0.06] bg-[#080B10]/80 backdrop-blur-xl">
        <Link 
          href="/"
          className="flex items-center space-x-2 transition-transform hover:scale-105"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0c121e] border border-white/[0.12] flex items-center justify-center text-[#F8B81F]">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-lg tracking-tight font-display">
            <span className="text-white">API</span>
            <span className="text-[#F8B81F]">Run</span>
          </span>
        </Link>

        <Link
          href="/challenges"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-zinc-400 hover:text-white px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#F8B81F]" />
          <span>Explore Challenges</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Platform info */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-display tracking-tight leading-tight">
              Join <span className="text-[#F8B81F]">APIRun</span>
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg font-normal">
              Create an account to track your backend problem-solving progress, latency telemetry, and contract compliance.
            </p>
          </div>

          {/* Key platform benefits */}
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-4 h-4 text-[#00f2a9] shrink-0" />
              <span>Full access to hands-on backend practice challenges</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-4 h-4 text-[#00f2a9] shrink-0" />
              <span>Automated test suites with hidden test assertions and stress injection</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-4 h-4 text-[#00f2a9] shrink-0" />
              <span>Synchronize progress across web IDE and terminal CLI runners</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#080B10] border border-white/[0.08] text-xs text-zinc-400 space-y-1">
            <div className="font-semibold text-zinc-200">Firebase Authentication</div>
            <div>Fast and secure authentication with Google OAuth or Email &amp; Password.</div>
          </div>
        </div>

        {/* Right Column: Sign Up Form Box */}
        <div className="lg:col-span-6 max-w-md mx-auto w-full">
          <div className="rounded-2xl bg-[#080B10] border border-white/[0.08] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white font-display">Create an account</h2>
              <p className="text-xs text-zinc-400">Get started practicing backend engineering today.</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-zinc-200 hover:text-white transition-all text-xs font-semibold flex items-center justify-center space-x-3 group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.54 0 2.94.53 4.05 1.58l3.04-3.04C17.25 1.77 14.82 1 12 5 7.58 1 3.84 3.51 2.05 7.18l3.66 2.84C6.59 7.15 9.07 5 12 5z"
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
              <span>Sign up with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/[0.08] w-full" />
              <span className="bg-[#080B10] px-3 text-[11px] text-zinc-500 uppercase tracking-wider shrink-0">
                Or with email
              </span>
              <div className="border-t border-white/[0.08] w-full" />
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium">Email address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@apirun.dev"
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#F8B81F] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium">Password (min 6 characters)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#F8B81F] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#F8B81F] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F8B81F] hover:bg-[#e0a213] text-black font-semibold transition-all shadow-md flex items-center justify-center space-x-2 text-xs"
              >
                {loading ? (
                  <span>Creating account...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-zinc-400">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-[#F8B81F] hover:underline font-semibold">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-4 border-t border-white/[0.06] text-center text-xs text-zinc-500">
        APIRun Backend Engineering Labs &bull; Powered by Firebase Auth
      </footer>
    </div>
  );
}
