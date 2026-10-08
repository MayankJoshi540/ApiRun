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
        <div className="flex flex-col items-center space-y-6">
          <div className="relative flex items-center justify-center w-12 h-12">
            <div className="absolute inset-0 border-[3px] border-[#18181b] rounded-full"></div>
            <div className="absolute inset-0 border-[3px] border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
          </div>

          <div className="space-y-2 text-center">
            <div className="text-sm font-semibold text-slate-200 tracking-wide">
              APIRun Workspace
            </div>
            <p className="text-xs text-zinc-500 font-medium">
              Loading your environment...
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
        <div className="flex flex-col items-center space-y-4">
          <div className="relative flex items-center justify-center w-8 h-8">
            <div className="absolute inset-0 border-2 border-[#18181b] rounded-full"></div>
            <div className="absolute inset-0 border-2 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <div className="text-xs font-medium text-zinc-400">
            Redirecting to authentication...
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
