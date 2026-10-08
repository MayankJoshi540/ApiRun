'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from '@/components/ui/GoogleIcon';

interface AuthGuardProps {
  children: React.ReactNode;
}

// Free demo challenge slug that can be accessed without login
export const FREE_CHALLENGE_SLUG = 'ping-health-api';

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Allow access to the free ping-pong challenge and the challenges directory without login
  const isFreeChallenge =
    pathname === `/challenges/${FREE_CHALLENGE_SLUG}` ||
    pathname?.startsWith(`/challenges/${FREE_CHALLENGE_SLUG}`);
  const isChallengesCatalog = pathname === '/challenges';
  const isPublicAllowed = isFreeChallenge || isChallengesCatalog;

  useEffect(() => {
    if (!loading && !user && !isPublicAllowed) {
      const redirectUrl = pathname 
        ? `/sign-in?redirect=${encodeURIComponent(pathname)}` 
        : '/sign-in';
      router.replace(redirectUrl);
    }
  }, [user, loading, router, pathname, isPublicAllowed]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050708] flex flex-col items-center justify-center text-white select-none px-4">
        <div className="flex flex-col items-center space-y-5">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-sm">
              <span className="font-mono text-2xl font-extrabold text-emerald-400 tracking-tighter">
                &#123;&bull;&gt;&#125;
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm font-semibold text-slate-200">
              <Loader2 className="w-4 h-4 text-emerald-400" />
              <span>Verifying Developer Session</span>
            </div>
            <p className="text-xs text-zinc-500 font-mono">
              Loading challenges workspace &amp; progress...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Permit unauthenticated access on the free challenge or the catalog page
  if (!user && isPublicAllowed) {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050708] flex flex-col items-center justify-center text-white select-none px-4">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <span className="font-mono text-lg font-bold text-emerald-400">&#123;&bull;&gt;&#125;</span>
          </div>
          <div className="text-xs font-mono text-zinc-400">
            Redirecting to authentication portal...
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
