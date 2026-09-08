'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SignUp } from '@clerk/nextjs';
import { ArrowLeft, CheckCircle2, Zap, ArrowRight, Database, Server, Cpu } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
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

  const handleDevSignUp = (e: React.FormEvent) => {
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
        {/* Left Column: Platform Curriculum & Perks */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Create your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#00f2a9]">APIRun Account</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg">
              Join backend developers worldwide building production-ready API servers, rate limiters, caching layers, and idempotent architectures.
            </p>
          </div>

          {/* Grid of Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#090d14] border border-white/[0.08] space-y-1.5">
              <div className="flex items-center space-x-2 text-[#00f2a9]">
                <Server className="w-4 h-4" />
                <span className="font-bold text-xs text-white">HTTP & Contracts</span>
              </div>
              <p className="text-[11px] text-slate-400">Strict payload validation, status codes, query pagination, and schema parity.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#090d14] border border-white/[0.08] space-y-1.5">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Database className="w-4 h-4" />
                <span className="font-bold text-xs text-white">Concurrency & Locks</span>
              </div>
              <p className="text-[11px] text-slate-400">Idempotency keys, optimistic locking, distributed transactions, and replay safety.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#090d14] border border-white/[0.08] space-y-1.5">
              <div className="flex items-center space-x-2 text-yellow-400">
                <Zap className="w-4 h-4" />
                <span className="font-bold text-xs text-white">Automated Tests</span>
              </div>
              <p className="text-[11px] text-slate-400">Edge case fuzzing, throughput stress tests, and automated pass/fail verification.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#090d14] border border-white/[0.08] space-y-1.5">
              <div className="flex items-center space-x-2 text-purple-400">
                <Cpu className="w-4 h-4" />
                <span className="font-bold text-xs text-white">Global Portfolio</span>
              </div>
              <p className="text-[11px] text-slate-400">Shareable developer profile with skill badges, solved metrics, and test logs.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Custom Sign Up Card */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-[#0a0e17] border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {isClerkActive ? (
              <div className="flex justify-center">
                <SignUp 
                  routing="path" 
                  path="/sign-up" 
                  signInUrl="/sign-in"
                  appearance={{
                    elements: {
                      card: 'bg-transparent shadow-none p-0 w-full',
                      headerTitle: 'text-white font-sans text-xl font-bold',
                      headerSubtitle: 'text-slate-400 text-xs',
                      formButtonPrimary: 'bg-[#00f2a9] hover:bg-[#20fbb7] text-black font-bold text-xs shadow-md transition-all rounded-xl py-2.5',
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
                  <h2 className="text-xl font-bold text-white tracking-tight">Create Developer Account</h2>
                  <p className="text-xs text-slate-400">
                    Get started with full access to challenges, sandboxes, and leaderboards.
                  </p>
                </div>

                <form onSubmit={handleDevSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Your Name / Handle</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="alex_dev"
                      className="w-full px-4 py-2.5 bg-[#06090f] border border-white/[0.1] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00f2a9] transition-all"
                    />
                  </div>

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
                    <label className="text-xs font-semibold text-slate-300">Create Password</label>
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
                    <span>{isLoading ? 'Creating Account...' : 'Get Started for Free'}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </form>

                <div className="text-center text-xs text-slate-400">
                  Already have an account?{' '}
                  <Link href="/sign-in" className="text-[#00f2a9] font-semibold hover:underline">
                    Sign in here
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
