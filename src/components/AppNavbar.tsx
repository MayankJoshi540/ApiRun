'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthControls } from './AuthControls';
import { 
  Menu, 
  X, 
  Layers, 
  Activity, 
  MessageSquarePlus, 
  LogIn, 
  UserPlus, 
  LogOut, 
  User as UserIcon,
  ChevronRight 
} from '@/components/ui/GoogleIcon';
import { useAuth } from '@/context/AuthContext';

interface Props {
  activeTab?: 'landing' | 'challenges' | 'progress' | 'feedback' | 'dashboard';
  onNavigate?: (route: 'landing' | 'challenges' | 'progress' | 'feedback') => void;
  onSelectTab?: (tab: 'landing' | 'challenges' | 'progress' | 'feedback' | 'dashboard') => void;
  solvedCount?: number;
  totalCount?: number;
}

export const AppNavbar: React.FC<Props> = ({
  activeTab: manualActiveTab,
  onNavigate,
  onSelectTab
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Scroll detection for navbar shrinking
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { 
      href: '/challenges', 
      label: 'Challenges', 
      key: 'challenges', 
      desc: 'Real backend scenarios & race conditions',
      icon: Layers 
    },
    { 
      href: '/progress', 
      label: 'Progress', 
      key: 'progress', 
      desc: 'Mastery metrics & solved challenges',
      icon: Activity 
    },
    { 
      href: '/feedback', 
      label: 'Feedback', 
      key: 'feedback', 
      desc: 'Suggest challenges & report issues',
      icon: MessageSquarePlus 
    },
  ];

  const getIsActive = (key: string, href: string) => {
    if (manualActiveTab) {
      if (key === 'challenges' && (manualActiveTab === 'challenges' || manualActiveTab === 'dashboard')) return true;
      return manualActiveTab === key;
    }
    if (href === '/challenges' && (pathname.startsWith('/challenges') || pathname === '/dashboard')) return true;
    if (href === '/progress' && pathname.startsWith('/progress')) return true;
    if (href === '/feedback' && pathname.startsWith('/feedback')) return true;
    return pathname === href;
  };

  const handleLinkClick = (key: string) => {
    setMobileMenuOpen(false);
    onNavigate?.(key as any);
    onSelectTab?.(key as any);
  };

  const handleMobileLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    router.push('/');
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Developer';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="fixed top-2.5 sm:top-4 left-0 right-0 z-50 w-full px-3 sm:px-6 pointer-events-none font-sans select-none transition-all duration-300">
      <div 
        ref={navContainerRef}
        className="max-w-5xl mx-auto flex flex-col items-center"
      >
        {/* Main Floating Navbar Pill */}
        <div 
          style={{
            backdropFilter: 'blur(28px) saturate(190%)',
            WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          }}
          className={`w-full pointer-events-auto rounded-full flex items-center justify-between transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? 'h-12 sm:h-13 px-3.5 sm:px-6 bg-[#080d14]/90 border border-white/[0.18] shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_1px_rgba(0,0,0,0.4)] scale-[0.99] sm:scale-[0.98]'
              : 'h-13 sm:h-16 px-4 sm:px-8 bg-[#080d14]/80 border border-white/[0.14] shadow-[0_12px_45px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.18),inset_0_-1px_1px_rgba(0,0,0,0.3)] scale-100'
          }`}
        >
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center justify-start shrink-0">
            <Link
              href="/"
              onClick={() => handleLinkClick('landing')}
              className="inline-flex items-center space-x-2.5 text-left shrink-0 transition-transform duration-200 hover:scale-105 active:scale-[0.97] group"
              aria-label="APIRun home"
            >
              <img
                src="/logo.png"
                alt="APIRun"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-md drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]"
              />
              <span className="font-extrabold text-base sm:text-lg tracking-tight font-sans">
                <span className="text-white">API</span>
                <span className="text-emerald-400">Run</span>
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links (Hidden on mobile) */}
          <nav 
            onMouseLeave={() => setHoveredTab(null)}
            className="hidden md:flex items-center justify-center space-x-1 sm:space-x-2"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive = getIsActive(link.key, link.href);
              const isHovered = hoveredTab === link.key;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredTab(link.key)}
                  onClick={() => handleLinkClick(link.key)}
                  className={`relative px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 z-10 active:scale-[0.97] ${
                    isActive 
                      ? 'text-emerald-300 font-bold' 
                      : isHovered 
                      ? 'text-white' 
                      : 'text-[#cbd5e1]'
                  }`}
                >
                  {(isActive || isHovered) && (
                    <span
                      className={`absolute inset-0 rounded-full -z-10 transition-all duration-200 ${
                        isHovered
                          ? 'bg-white/[0.1] border border-white/[0.14]'
                          : isActive
                          ? 'bg-emerald-500/15 border border-emerald-500/30'
                          : 'bg-transparent'
                      }`}
                      style={{
                        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  )}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Desktop Auth Controls & Mobile Menu Toggle */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-3 shrink-0">
            {/* Desktop Auth Controls */}
            <div className="hidden md:block">
              <AuthControls variant="navbar" />
            </div>

            {/* Mobile: Compact Avatar or Sign In + Hamburger Toggle */}
            <div className="flex md:hidden items-center space-x-2">
              {user ? (
                <Link
                  href="/progress"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs w-7 h-7 flex items-center justify-center"
                  aria-label="User profile"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={displayName}
                      className="w-full h-full rounded object-cover"
                    />
                  ) : (
                    <span>{initial}</span>
                  )}
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-200 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] active:scale-95 transition-all"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-full border transition-all duration-200 flex items-center justify-center active:scale-90 ${
                  mobileMenuOpen
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-white/[0.06] border-white/[0.12] text-zinc-200 hover:bg-white/[0.1] hover:text-white'
                }`}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4 text-emerald-300" />
                ) : (
                  <Menu className="w-4 h-4 text-zinc-200" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div 
            style={{
              backdropFilter: 'blur(32px) saturate(200%)',
              WebkitBackdropFilter: 'blur(32px) saturate(200%)',
            }}
            className="w-full mt-2 pointer-events-auto rounded-3xl bg-[#080d15]/95 border border-white/[0.16] shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_30px_rgba(16,185,129,0.08)] p-3.5 space-y-3 animate-in fade-in slide-in-from-top-3 duration-200 md:hidden z-50 font-sans"
          >
            {/* Nav Items List */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = getIsActive(link.key, link.href);
                const IconComponent = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => handleLinkClick(link.key)}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-150 active:scale-[0.98] ${
                      isActive
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-white'
                        : 'bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl border ${
                        isActive 
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                          : 'bg-white/[0.04] border-white/[0.06] text-zinc-400'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className={`text-sm font-bold tracking-tight ${isActive ? 'text-emerald-300' : 'text-white'}`}>
                          {link.label}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-normal">
                          {link.desc}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-white/[0.08] pt-2" />

            {/* Mobile Auth Options */}
            {user ? (
              <div className="space-y-2">
                {/* User summary card */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center space-x-2.5 truncate">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={displayName}
                        className="w-8 h-8 rounded-xl object-cover border border-white/[0.1] shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-xs shrink-0">
                        {initial}
                      </div>
                    )}
                    <div className="text-left truncate">
                      <div className="text-xs font-bold text-white truncate">{displayName}</div>
                      <div className="text-[10px] text-zinc-400 truncate">{user.email}</div>
                    </div>
                  </div>

                  <Link
                    href="/progress"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px] font-semibold shrink-0"
                  >
                    View Stats
                  </Link>
                </div>

                {/* Mobile Log Out */}
                <button
                  onClick={handleMobileLogout}
                  className="w-full flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-400 font-medium text-xs transition-colors active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out of APIRun</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-zinc-200 transition-all active:scale-95 text-center"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40 active:scale-95 text-center"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
