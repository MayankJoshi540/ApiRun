'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, LogOut, User, ChevronDown } from '@/components/ui/GoogleIcon';
import { useAuth } from '@/context/AuthContext';

interface AuthControlsProps {
  variant?: 'landing' | 'navbar';
}

export const AuthControls: React.FC<AuthControlsProps> = ({ variant = 'navbar' }) => {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="w-16 h-7 rounded-full bg-white/[0.04] animate-pulse" />
    );
  }

  if (user) {
    const displayName = user.displayName || user.email?.split('@')[0] || 'Developer';
    const initial = displayName.charAt(0).toUpperCase();

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 py-1 px-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all text-left group"
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              className="w-6 h-6 rounded-lg object-cover border border-white/[0.1]"
            />
          ) : (
            <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold font-display">
              {initial}
            </div>
          )}

          <span className="text-xs font-medium text-zinc-200 max-w-[100px] truncate hidden sm:inline-block">
            {displayName}
          </span>

          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-transform duration-200" />
        </button>

        {/* User Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0b0e14] border border-white/[0.1] shadow-2xl p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header info */}
            <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
              <div className="font-bold text-white font-display truncate">{displayName}</div>
              <div className="text-[11px] text-zinc-400 truncate mt-0.5">{user.email}</div>
            </div>

            {/* Links */}
            <Link
              href="/progress"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-white/[0.05] text-zinc-300 hover:text-white transition-colors"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>My Progress &amp; Solves</span>
            </Link>

            {/* Sign Out Action */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-red-500/10 text-zinc-300 hover:text-red-400 transition-colors text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Not signed in
  return (
    <div className="flex items-center space-x-2">
      <Link
        href="/sign-in"
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 hover:text-white border border-white/[0.08] transition-all"
      >
        <LogIn className="w-3.5 h-3.5 text-emerald-400" />
        <span>Sign In</span>
      </Link>

      <Link
        href="/sign-up"
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm shadow-emerald-950/40"
      >
        <UserPlus className="w-3.5 h-3.5" />
        <span>Sign Up</span>
      </Link>
    </div>
  );
};
