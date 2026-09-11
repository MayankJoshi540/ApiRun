'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SignIn, useUser } from '@clerk/nextjs';
import { ArrowLeft, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if Clerk is active
  let isClerkActive = false;
  try {
    const rawKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() || '';
    isClerkActive = rawKey.length > 0 && rawKey !== 'pk_test_Y2xlcmsuYXBpcnVuLmRldiQ' && !rawKey.includes('placeholder');
  } catch {
    isClerkActive = false;
  }

  const handleDevLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/challenges');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#050708] text-slate-100 flex flex-col justify-between selection:bg-[#00f2a9] selection:text-black">
      {/* Top Navbar */}
      <header className="w-full px-6 py-5 flex items-center justify-between border-b border-white/[0.06] bg-[#070a10]/80 backdrop-blur-xl">
        <Link 
          href="/"
          className="flex items-center space-x-2 transition-transform hover:scale-105"
        >
          <span className="font-mono text-base font-extrabold text-[#00f2a9]">&#123;&bull;&gt;&#125;</span>
          <span className="font-extrabold text-lg tracking-tight">
            <span className="text-white">API</span>
            <span className="text-[#00f2a9]">Run</span>
          </span>
        </Link>

        <Link
          href="/challenges"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#00f2a9]" />
          <span>Explore Challenges</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Platform Highlights & Live Preview */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Sign in to <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#00f2a9]">APIRun</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg">
              Solve real-world REST, GraphQL, idempotency, and distributed systems challenges with live automated verification.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-3 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-md bg-[#00f2a9]/10 border border-[#00f2a9]/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00f2a9]" />
              </div>
              <span>Track your solves, streak, and rank on the global leaderboard</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-md bg-[#00f2a9]/10 border border-[#00f2a9]/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00f2a9]" />
              </div>
              <span>Run test suites directly against local server instances or in-memory sandboxes</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-md bg-[#00f2a9]/10 border border-[#00f2a9]/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00f2a9]" />
              </div>
              <span>LeetCode-style Developer Progression dashboard</span>
            </div>
          </div>

          {/* Mini Code Preview Card */}
          <div className="rounded-2xl bg-[#090d14] border border-white/[0.08] p-4 shadow-xl font-mono text-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-slate-400 text-[11px]">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#00f2a9]/80" />
                <span className="text-slate-400 font-sans ml-2">curl test assertion</span>
              </div>
              <span className="text-[#00f2a9]">200 OK &bull; 14ms</span>
            </div>
            <div className="text-slate-400">
              <span className="text-purple-400">POST</span> <span className="text-emerald-300">/api/v1/auth/tokens</span>
            </div>
            <div className="text-slate-300 pl-2 border-l-2 border-[#00f2a9]/40">
              <span className="text-slate-400">&#123;</span> <span className="text-[#00f2a9]">&quot;status&quot;</span>: <span className="text-yellow-300">&quot;verified&quot;</span>, <span className="text-[#00f2a9]">&quot;tier&quot;</span>: <span className="text-yellow-300">&quot;pro_developer&quot;</span> <span className="text-slate-400">&#125;</span>
            </div>
          </div>
        </div>

        {/* Right Column: Custom Auth Card */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-[#0a0e17] border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {isClerkActive ? (
              <div className="flex justify-center">
                <SignIn 
                  routing="path" 
                  path="/sign-in" 
                  signUpUrl="/sign-up"
                  appearance={{
                    elements: {
                      card: 'bg-transparent shadow-none p-0 w-full',
                      headerTitle: 'text-white font-sans text-xl font-bold',
                      headerSubtitle: 'text-slate-400 text-xs',
                      formButtonPrimary: 'bg-[#00f2a9] hover:bg-[#20fbb7] text-black font-bold text-xs shadow-lg transition-all rounded-xl py-2.5',
                      socialButtonsBlockButton: 'bg-[#06090f] border border-white/[0.12] text-white hover:bg-white/[0.06] rounded-xl text-xs font-semibold',
                      formFieldInput: 'bg-[#06090f] border border-white/[0.1] text-white rounded-xl text-xs focus:border-[#00f2a9]',
                      footerActionLink: 'text-[#00f2a9] hover:underline font-semibold text-xs',
                    }
                  }}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h2 className="text-xl font-bold text-white tracking-tight">Welcome back</h2>
                  <p className="text-xs text-slate-400">
                    Sign in to continue practicing backend endpoints.
                  </p>
                </div>

                {/* Developer Quick Sign-In */}
                <form onSubmit={handleDevLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Developer Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="alex@backend.dev"
                      className="w-full px-4 py-2.5 bg-[#06090f] border border-white/[0.1] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00f2a9] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">Password</label>
                      <a href="#" className="text-[11px] text-[#00f2a9] hover:underline">Forgot?</a>
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2.5 bg-[#06090f] border border-white/[0.1] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00f2a9] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-[#00f2a9] hover:bg-[#20fbb7] text-black font-bold text-xs transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </form>

                {/* Quick 1-Click Demo Login */}
                <div className="pt-2 border-t border-white/[0.08] space-y-3">
                  <button
                    onClick={() => {
                      setEmail('dev@apirun.io');
                      setPassword('demo-dev-password');
                      setTimeout(() => router.push('/challenges'), 400);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center space-x-2 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#00f2a9]" />
                    <span>Quick Demo Sign-In (1-Click)</span>
                  </button>
                </div>

                <div className="text-center text-xs text-slate-400">
                  Don&apos;t have an account?{' '}
                  <Link href="/sign-up" className="text-[#00f2a9] font-semibold hover:underline">
                    Create one here
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-slate-500 border-t border-white/[0.04]">
        &copy; {new Date().getFullYear()} APIRun &bull; Built for Backend Engineers
      </footer>
    </div>
  );
}
