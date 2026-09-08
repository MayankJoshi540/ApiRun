'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LogIn, UserPlus, User, X, Check, ArrowRight } from 'lucide-react';
import { useUser, useClerk, SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';

interface AuthControlsProps {
  variant?: 'landing' | 'navbar';
}

export const AuthControls: React.FC<AuthControlsProps> = ({ variant = 'navbar' }) => {
  const [isFallbackModalOpen, setIsFallbackModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signedInMock, setSignedInMock] = useState(false);

  // Try using Clerk hook safely
  let clerkLoaded = false;
  let isSignedIn = false;
  let clerk: any = null;

  try {
    const userHook = useUser();
    clerk = useClerk();
    clerkLoaded = userHook.isLoaded;
    isSignedIn = !!userHook.isSignedIn;
  } catch {
    clerkLoaded = false;
    isSignedIn = signedInMock;
  }

  const handleOpenAuth = (signUp: boolean) => {
    if (clerk && clerk.openSignIn && clerk.openSignUp) {
      try {
        if (signUp) {
          clerk.openSignUp();
        } else {
          clerk.openSignIn();
        }
        return;
      } catch (err) {
        console.warn('Clerk modal trigger fallback:', err);
      }
    }
    // Fallback modal if Clerk environment key is pending
    setIsSignUp(signUp);
    setIsFallbackModalOpen(true);
  };

  const handleMockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignedInMock(true);
    setIsFallbackModalOpen(false);
  };

  if (clerkLoaded && isSignedIn) {
    return (
      <div className="flex items-center space-x-2">
        <UserButton 
          appearance={{
            elements: {
              userButtonAvatarBox: 'w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/[0.2] shadow-sm',
            }
          }}
        />
      </div>
    );
  }

  if (signedInMock) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-7 h-7 rounded-full bg-[#00f2a9]/20 border border-[#00f2a9]/40 flex items-center justify-center text-[#00f2a9] text-xs font-bold font-mono">
          dev
        </div>
        <button 
          onClick={() => setSignedInMock(false)}
          className="text-[11px] text-[#94a3b8] hover:text-white transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Sign In Button */}
      <Link
        href="/sign-in"
        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
          variant === 'landing'
            ? 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white border border-white/[0.12]'
            : 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white border border-white/[0.1]'
        }`}
        title="Sign in to your APIRun account"
      >
        <LogIn className="w-3.5 h-3.5 text-[#00f2a9]" />
        <span>Sign In</span>
      </Link>

      {/* Sign Up Button */}
      <Link
        href="/sign-up"
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#00f2a9]/15 hover:bg-[#00f2a9]/25 text-[#00f2a9] border border-[#00f2a9]/30 text-xs font-semibold transition-all"
        title="Create a new APIRun account"
      >
        <UserPlus className="w-3.5 h-3.5 text-[#00f2a9]" />
        <span>Sign Up</span>
      </Link>
    </div>
  );
};
