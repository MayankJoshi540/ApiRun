'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const redirectUrl = pathname 
        ? `/sign-in?redirect=${encodeURIComponent(pathname)}` 
        : '/sign-in';
      router.replace(redirectUrl);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050708] flex flex-col items-center justify-center text-white select-none px-4">
        <div className="flex flex-col items-center space-y-5">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#00f2a9]/10 border border-[#00f2a9]/30 flex items-center justify-center shadow-[0_0_35px_rgba(0,242,169,0.25)]">
              <span className="font-mono text-2xl font-extrabold text-[#00f2a9] tracking-tighter">
                &#123;&bull;&gt;&#125;
              </span>
            </div>
            <div className="absolute -inset-1.5 rounded-2xl border border-[#00f2a9]/20 animate-ping opacity-25 pointer-events-none" />
          </div>

          <div className="space-y-1.5 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm font-semibold text-slate-200">
              <Loader2 className="w-4 h-4 animate-spin text-[#00f2a9]" />
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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050708] flex flex-col items-center justify-center text-white select-none px-4">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <span className="font-mono text-lg font-bold text-[#00f2a9]">&#123;&bull;&gt;&#125;</span>
          </div>
          <div className="text-xs font-mono text-zinc-400">
            Authentication required. Redirecting to sign in...
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
