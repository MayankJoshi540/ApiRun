'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, ChevronRight, ChevronLeft, Check } from '@/components/ui/GoogleIcon';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  category?: string;
  preferredPlacement?: 'top' | 'bottom' | 'left' | 'right';
}

interface WalkthroughSpotlightProps {
  tourKey: string;
  steps: TourStep[];
  onComplete?: () => void;
  autoStartDelayMs?: number;
  triggerKey?: number;
}

const DragGripIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="8" cy="6" r="1.5" fill="currentColor" />
    <circle cx="16" cy="6" r="1.5" fill="currentColor" />
    <circle cx="8" cy="12" r="1.5" fill="currentColor" />
    <circle cx="16" cy="12" r="1.5" fill="currentColor" />
    <circle cx="8" cy="18" r="1.5" fill="currentColor" />
    <circle cx="16" cy="18" r="1.5" fill="currentColor" />
  </svg>
);

export const WalkthroughSpotlight: React.FC<WalkthroughSpotlightProps> = ({
  tourKey,
  steps,
  onComplete,
  autoStartDelayMs = 600,
  triggerKey,
}) => {
  const { user } = useAuth();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [cardPos, setCardPos] = useState<{ top: number; left: number }>({
    top: 100,
    left: 24,
  });
  const [isDragging, setIsDragging] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; initialLeft: number; initialTop: number } | null>(null);
  const storageKey = user?.uid ? `apirun_walkthrough_${tourKey}_${user.uid}` : `apirun_walkthrough_${tourKey}_guest`;

  // Viewport detector: ONLY enable walkthrough on desktop/laptop web browsers (>= 1024px)
  useEffect(() => {
    const handleCheckDesktop = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (!desktop) {
        setIsActive(false);
      }
    };

    handleCheckDesktop();
    window.addEventListener('resize', handleCheckDesktop);
    return () => window.removeEventListener('resize', handleCheckDesktop);
  }, []);

  // Check if tour should run on first visit
  useEffect(() => {
    if (!storageKey || steps.length === 0 || !isDesktop) {
      setIsActive(false);
      return;
    }

    const hasCompleted = localStorage.getItem(storageKey);
    if (!hasCompleted) {
      const timer = setTimeout(() => {
        setIsActive(true);
        setCurrentStepIndex(0);
      }, autoStartDelayMs);
      return () => clearTimeout(timer);
    }
  }, [user, storageKey, autoStartDelayMs, steps.length, isDesktop]);

  // Support manual trigger (e.g., clicking "Tour Guide" button)
  useEffect(() => {
    if (triggerKey !== undefined && triggerKey > 0 && isDesktop) {
      setIsActive(true);
      setCurrentStepIndex(0);
    }
  }, [triggerKey, isDesktop]);

  const currentStep = steps[currentStepIndex];

  // Helper to test if a candidate card box collides with the target cutout
  const checkCollision = (
    cLeft: number,
    cTop: number,
    cWidth: number,
    cHeight: number,
    rLeft: number,
    rTop: number,
    rRight: number,
    rBottom: number
  ) => {
    return !(
      cLeft + cWidth <= rLeft ||
      cLeft >= rRight ||
      cTop + cHeight <= rTop ||
      cTop >= rBottom
    );
  };

  // Compute a placement strictly outside the target element (zero overlap)
  const computeNonOverlappingPosition = useCallback((rect: DOMRect, preferred?: 'top' | 'bottom' | 'left' | 'right') => {
    const cardWidth = Math.min(390, window.innerWidth - 32);
    const measuredHeight = cardRef.current ? cardRef.current.offsetHeight : 210;
    const cardHeight = Math.max(190, measuredHeight);
    const gap = 16;
    const pad = 10;

    const cutoutTop = Math.max(0, rect.top - pad);
    const cutoutBottom = Math.min(window.innerHeight, rect.bottom + pad);
    const cutoutLeft = Math.max(0, rect.left - pad);
    const cutoutRight = Math.min(window.innerWidth, rect.right + pad);

    const spaceBelow = window.innerHeight - cutoutBottom;
    const spaceAbove = cutoutTop;
    const spaceLeft = cutoutLeft;
    const spaceRight = window.innerWidth - cutoutRight;

    // Ordered placement options based on preference and geometry
    type PlacementOpt = 'left' | 'right' | 'bottom' | 'top';
    let optionsToTry: PlacementOpt[] = [];

    if (preferred) {
      optionsToTry.push(preferred);
    }

    // Add remaining options based on largest available screen area
    const remainder: PlacementOpt[] = ['left', 'right', 'bottom', 'top'].filter(
      (p) => p !== preferred
    ) as PlacementOpt[];

    remainder.sort((a, b) => {
      const getSpace = (opt: PlacementOpt) => {
        if (opt === 'left') return spaceLeft;
        if (opt === 'right') return spaceRight;
        if (opt === 'bottom') return spaceBelow;
        return spaceAbove;
      };
      return getSpace(b) - getSpace(a);
    });

    optionsToTry = [...optionsToTry, ...remainder];

    // Find the first option that fits and guarantees ZERO collision with the target
    for (const opt of optionsToTry) {
      if (opt === 'left') {
        const candidateLeft = cutoutLeft - cardWidth - gap;
        if (candidateLeft >= 16 || spaceLeft >= cardWidth * 0.8) {
          const left = Math.max(16, candidateLeft);
          const top = Math.max(
            80,
            Math.min(window.innerHeight - cardHeight - 20, rect.top)
          );
          if (!checkCollision(left, top, cardWidth, cardHeight, cutoutLeft, cutoutTop, cutoutRight, cutoutBottom)) {
            return { top, left };
          }
        }
      }

      if (opt === 'right') {
        const candidateLeft = cutoutRight + gap;
        if (candidateLeft + cardWidth <= window.innerWidth - 16 || spaceRight >= cardWidth * 0.8) {
          const left = Math.min(window.innerWidth - cardWidth - 16, candidateLeft);
          const top = Math.max(
            80,
            Math.min(window.innerHeight - cardHeight - 20, rect.top)
          );
          if (!checkCollision(left, top, cardWidth, cardHeight, cutoutLeft, cutoutTop, cutoutRight, cutoutBottom)) {
            return { top, left };
          }
        }
      }

      if (opt === 'bottom') {
        const candidateTop = cutoutBottom + gap;
        if (candidateTop + cardHeight <= window.innerHeight - 16 || spaceBelow >= cardHeight) {
          const top = candidateTop;
          const left = Math.max(
            16,
            Math.min(window.innerWidth - cardWidth - 16, rect.left)
          );
          if (!checkCollision(left, top, cardWidth, cardHeight, cutoutLeft, cutoutTop, cutoutRight, cutoutBottom)) {
            return { top, left };
          }
        }
      }

      if (opt === 'top') {
        const candidateTop = cutoutTop - cardHeight - gap;
        if (candidateTop >= 70 || spaceAbove >= cardHeight) {
          const top = Math.max(70, candidateTop);
          const left = Math.max(
            16,
            Math.min(window.innerWidth - cardWidth - 16, rect.left)
          );
          if (!checkCollision(left, top, cardWidth, cardHeight, cutoutLeft, cutoutTop, cutoutRight, cutoutBottom)) {
            return { top, left };
          }
        }
      }
    }

    // Fallback: Place completely to the opposite side of the target center
    const targetCenterX = rect.left + rect.width / 2;
    if (targetCenterX > window.innerWidth / 2) {
      return {
        left: 20,
        top: Math.max(80, Math.min(window.innerHeight - cardHeight - 24, rect.top)),
      };
    } else {
      return {
        left: Math.max(16, window.innerWidth - cardWidth - 20),
        top: Math.max(80, Math.min(window.innerHeight - cardHeight - 24, rect.top)),
      };
    }
  }, []);

  // Poll and measure the target DOM element until ready, then position cleanly
  useEffect(() => {
    if (!isActive || !currentStep || !isDesktop) return;

    let attempts = 0;
    const maxAttempts = 35; // poll every 80ms for up to ~2.8s

    const measureTarget = () => {
      const el = document.getElementById(currentStep.targetId);
      if (!el) return false;

      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setTargetRect(rect);
        // Scroll into view if needed
        if (rect.top < 60 || rect.bottom > window.innerHeight - 60) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        const pos = computeNonOverlappingPosition(rect, currentStep.preferredPlacement);
        setCardPos(pos);
        return true;
      }
      return false;
    };

    if (!measureTarget()) {
      const timer = setInterval(() => {
        attempts++;
        if (measureTarget() || attempts >= maxAttempts) {
          clearInterval(timer);
        }
      }, 80);
      return () => clearInterval(timer);
    }
  }, [isActive, currentStepIndex, currentStep, isDesktop, computeNonOverlappingPosition]);

  // Recalculate on window resize or scroll (unless actively dragging)
  useEffect(() => {
    if (!isActive || !currentStep || !isDesktop || isDragging) return;

    const handleUpdate = () => {
      const el = document.getElementById(currentStep.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setTargetRect(rect);
          setCardPos(computeNonOverlappingPosition(rect, currentStep.preferredPlacement));
        }
      }
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [isActive, currentStep, isDesktop, isDragging, computeNonOverlappingPosition]);

  // Pointer drag handler for moving the card anywhere across the screen
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Only main button
    e.preventDefault();
    e.stopPropagation();

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialLeft: cardPos.left,
      initialTop: cardPos.top,
    };
    setIsDragging(true);

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!dragStartRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.startX;
      const dy = moveEvent.clientY - dragStartRef.current.startY;

      const cardWidth = cardRef.current?.offsetWidth || 390;
      const cardHeight = cardRef.current?.offsetHeight || 210;

      const newLeft = Math.max(10, Math.min(window.innerWidth - cardWidth - 10, dragStartRef.current.initialLeft + dx));
      const newTop = Math.max(10, Math.min(window.innerHeight - cardHeight - 10, dragStartRef.current.initialTop + dy));

      setCardPos({ left: newLeft, top: newTop });
    };

    const onPointerUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    if (storageKey) {
      localStorage.setItem(storageKey, 'true');
    }
    setIsActive(false);
    onComplete?.();
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isActive || !isDesktop) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleComplete();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, isDesktop, currentStepIndex, steps.length]);

  if (!isDesktop || !isActive || !currentStep) return null;

  const isLastStep = currentStepIndex === steps.length - 1;
  const pad = 10;

  // 4 slices surrounding the target element so the target remains 100% UNBLURRED and crystal clear
  const cutoutTop = targetRect ? Math.max(0, targetRect.top - pad) : 0;
  const cutoutBottom = targetRect ? Math.min(window.innerHeight, targetRect.bottom + pad) : 0;
  const cutoutLeft = targetRect ? Math.max(0, targetRect.left - pad) : 0;
  const cutoutRight = targetRect ? Math.min(window.innerWidth, targetRect.right + pad) : 0;
  const cutoutWidth = Math.max(0, cutoutRight - cutoutLeft);
  const cutoutHeight = Math.max(0, cutoutBottom - cutoutTop);

  return (
    <aside 
      className="fixed inset-0 z-[100] pointer-events-none select-none font-sans"
      aria-label="Interactive Developer Walkthrough"
      role="dialog"
      aria-modal="true"
    >
      {/* ── 4 SURROUNDING BACKDROP SLICES (Leaves target 100% crisp & unblurred, smooth easing) ── */}
      {targetRect && (
        <>
          {/* Top Slice */}
          <div
            style={{ top: 0, left: 0, right: 0, height: `${cutoutTop}px` }}
            className="fixed bg-black/75 backdrop-blur-[5px] pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            onClick={handleNext}
          />
          {/* Bottom Slice */}
          <div
            style={{ top: `${cutoutBottom}px`, left: 0, right: 0, bottom: 0 }}
            className="fixed bg-black/75 backdrop-blur-[5px] pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            onClick={handleNext}
          />
          {/* Left Slice */}
          <div
            style={{
              top: `${cutoutTop}px`,
              left: 0,
              width: `${cutoutLeft}px`,
              height: `${cutoutHeight}px`,
            }}
            className="fixed bg-black/75 backdrop-blur-[5px] pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            onClick={handleNext}
          />
          {/* Right Slice */}
          <div
            style={{
              top: `${cutoutTop}px`,
              left: `${cutoutRight}px`,
              right: 0,
              height: `${cutoutHeight}px`,
            }}
            className="fixed bg-black/75 backdrop-blur-[5px] pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            onClick={handleNext}
          />

          {/* ── Smooth Spotlight Border around the Unblurred Target (No glowing blur) ── */}
          <div
            style={{
              top: `${cutoutTop}px`,
              left: `${cutoutLeft}px`,
              width: `${cutoutWidth}px`,
              height: `${cutoutHeight}px`,
            }}
            className="fixed pointer-events-none rounded-2xl border-2 border-emerald-500/70 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-[101]"
          />
        </>
      )}

      {/* ── Floating Draggable Glassmorphism Walkthrough Card (Subtle glass, zero gradient) ── */}
      <div
        ref={cardRef}
        style={{
          top: `${cardPos.top}px`,
          left: `${cardPos.left}px`,
          width: `${Math.min(390, typeof window !== 'undefined' ? window.innerWidth - 32 : 390)}px`,
        }}
        className={`fixed z-[105] pointer-events-auto bg-[#0E1316]/80 backdrop-blur-xl border border-white/[0.10] border-t-white/[0.18] rounded-2xl p-4 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.65)] space-y-3.5 ${
          isDragging 
            ? 'transition-none cursor-grabbing select-none shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-white/[0.16]' 
            : 'transition-[top,left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Step Counter, Drag to move sign & Dismiss button */}
        <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-2.5">
          <span className="text-xs font-mono text-zinc-400 font-medium tracking-wide shrink-0">
            Step {currentStepIndex + 1} of {steps.length}
          </span>

          {/* Draggable Indicator Sign (Subtle Frosted Glass) */}
          <div
            onPointerDown={handlePointerDown}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] backdrop-blur-md text-zinc-400 hover:text-zinc-200 cursor-grab active:cursor-grabbing select-none transition-colors group"
            title="Click and drag to move card anywhere on the page"
          >
            <DragGripIcon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
            <span className="text-[11px] font-mono tracking-wider text-zinc-400 group-hover:text-zinc-200 font-medium">
              Drag to move
            </span>
          </div>

          <button
            onClick={handleComplete}
            title="Skip Walkthrough (Esc)"
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0"
            aria-label="Skip walkthrough"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Content: Compact, Crisp Typography */}
        <div className="space-y-1.5 text-left">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
            {currentStep.title}
          </h3>
          <p className="text-xs sm:text-[13.5px] text-zinc-300 leading-relaxed font-normal">
            {currentStep.description}
          </p>
        </div>

        {/* Footer: Step Indicators & Action Controls */}
        <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06]">
          {/* Step Progress Segments */}
          <div className="flex items-center space-x-1">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  idx === currentStepIndex
                    ? 'w-4 bg-emerald-400/90'
                    : idx < currentStepIndex
                    ? 'w-1.5 bg-emerald-800/80'
                    : 'w-1.5 bg-white/[0.12]'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons: Pure subtle glassmorphism, zero gradients, zero glow */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleComplete}
              className="px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Skip
            </button>

            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-xl border border-white/[0.10] bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white text-xs font-medium transition-all flex items-center space-x-1 cursor-pointer active:scale-95 backdrop-blur-md"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-3.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-white text-xs font-medium transition-all flex items-center space-x-1 cursor-pointer active:scale-95 backdrop-blur-md"
            >
              <span>{isLastStep ? 'Got it' : 'Next'}</span>
              {isLastStep ? <Check className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
