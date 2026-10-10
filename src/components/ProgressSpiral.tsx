'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Challenge } from '@/types';
import { ArrowRight } from '@/components/ui/GoogleIcon';

interface ProgressSpiralProps {
  solvedCount: number;
  totalChallenges: number;
  challenges: Challenge[];
  nextChallenge?: Challenge;
  onSelectChallenge: (challenge: Challenge) => void;
  streakCount?: number;
}

export const ProgressSpiral: React.FC<ProgressSpiralProps> = ({
  solvedCount,
  totalChallenges,
  challenges,
  nextChallenge,
  onSelectChallenge,
}) => {
  const [hoveredChallenge, setHoveredChallenge] = useState<Challenge | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const safeTotal = Math.max(1, totalChallenges);
  const completionPercentage = Math.round((solvedCount / safeTotal) * 100);

  // Geometric spiral configuration
  // Centered at (110, 110) in viewBox 0 0 220 220
  const cx = 110;
  const cy = 110;
  const outerR = 90;
  const innerR = 48;
  const turns = 2.25;
  const totalAngle = turns * 2 * Math.PI;

  // Generate Archimedean spiral coordinates
  const { pathString, milestonePoints } = useMemo(() => {
    const pointsCount = 180;
    let path = '';

    for (let i = 0; i <= pointsCount; i++) {
      const t = i / pointsCount;
      const angle = -Math.PI / 2 + t * totalAngle;
      const r = outerR - (outerR - innerR) * t;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);

      if (i === 0) {
        path += `M ${x.toFixed(2)} ${y.toFixed(2)}`;
      } else {
        path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
      }
    }

    const milestones = challenges.map((ch, idx) => {
      const t = (idx + 0.5) / (challenges.length || 1);
      const angle = -Math.PI / 2 + t * totalAngle;
      const r = outerR - (outerR - innerR) * t;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      const isSolved = ch.status === 'SOLVED';
      const isCurrent = ch.id === nextChallenge?.id;

      return {
        challenge: ch,
        index: idx + 1,
        x,
        y,
        isSolved,
        isCurrent,
      };
    });

    return { pathString: path, milestonePoints: milestones };
  }, [challenges, nextChallenge]);

  // Breakdown statistics
  const easySolved = useMemo(() => challenges.filter(c => c.difficulty === 'BEGINNER' && c.status === 'SOLVED').length, [challenges]);
  const easyTotal = useMemo(() => challenges.filter(c => c.difficulty === 'BEGINNER').length, [challenges]);
  const medSolved = useMemo(() => challenges.filter(c => c.difficulty === 'INTERMEDIATE' && c.status === 'SOLVED').length, [challenges]);
  const medTotal = useMemo(() => challenges.filter(c => c.difficulty === 'INTERMEDIATE').length, [challenges]);
  const hardSolved = useMemo(() => challenges.filter(c => c.difficulty === 'ADVANCED' && c.status === 'SOLVED').length, [challenges]);
  const hardTotal = useMemo(() => challenges.filter(c => c.difficulty === 'ADVANCED').length, [challenges]);

  return (
    <div className="lg:col-span-5 rounded-2xl bg-[#1c1c1e]/75 backdrop-blur-2xl border border-white/[0.08] border-t-white/[0.14] p-6 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
      
      {/* Header: Clean, understated title and count */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
          Progress Spiral
        </h3>
        <span className="text-xs font-mono text-[#a1a1aa] tabular-nums">
          {solvedCount} / {totalChallenges} Solved
        </span>
      </div>

      {/* Center: Spiral Visualization without gradients or endless animations */}
      <div className="relative flex items-center justify-center my-4">
        
        <svg
          viewBox="0 0 220 220"
          className="w-48 h-48 sm:w-52 sm:h-52 select-none overflow-visible"
        >
          {/* Base track: quiet neutral */}
          <path
            d={pathString}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Active Progress: Solid Brand Green (#30d158) */}
          <path
            d={pathString}
            fill="none"
            stroke="#30d158"
            strokeWidth="6"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={mounted ? Math.max(0, 100 - completionPercentage) : 100}
            style={{
              transition: 'stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {/* Milestone Nodes */}
          {milestonePoints.map((m) => {
            const isHovered = hoveredChallenge?.id === m.challenge.id;

            return (
              <g 
                key={m.challenge.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredChallenge(m.challenge)}
                onMouseLeave={() => setHoveredChallenge(null)}
                onClick={() => onSelectChallenge(m.challenge)}
              >
                {/* Hit area */}
                <circle
                  cx={m.x}
                  cy={m.y}
                  r={8}
                  fill="transparent"
                />

                {/* Node point: Solid state indicator */}
                <circle
                  cx={m.x}
                  cy={m.y}
                  r={isHovered ? 4.5 : m.isSolved ? 3.5 : 2.5}
                  fill={
                    m.isSolved 
                      ? '#30d158' 
                      : m.isCurrent 
                      ? '#ffffff' 
                      : '#3a3a3c'
                  }
                  stroke={m.isCurrent && !m.isSolved ? '#30d158' : 'none'}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
          {hoveredChallenge ? (
            <div className="px-3">
              <span className="text-[10px] font-mono uppercase text-[#30d158]">
                {hoveredChallenge.status === 'SOLVED' ? 'Solved' : hoveredChallenge.difficulty}
              </span>
              <p className="text-xs font-semibold text-white max-w-[120px] truncate mt-0.5">
                {hoveredChallenge.title}
              </p>
              <span className="text-[10px] text-[#86868b]">Click to view</span>
            </div>
          ) : (
            <div>
              <span className="text-3xl font-semibold tracking-tight text-white tabular-nums">
                {completionPercentage}%
              </span>
              <p className="text-[11px] text-[#86868b] font-medium mt-0.5">
                Completed
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Difficulty Breakdown: Matte, Structured, High Contrast */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.06] text-center">
        <div className="py-1 px-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <div className="text-[10px] text-[#86868b]">Beginner</div>
          <div className="text-xs font-medium text-white mt-0.5 tabular-nums">
            {easySolved}<span className="text-[#636366]">/{easyTotal}</span>
          </div>
        </div>
        <div className="py-1 px-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <div className="text-[10px] text-[#86868b]">Intermediate</div>
          <div className="text-xs font-medium text-white mt-0.5 tabular-nums">
            {medSolved}<span className="text-[#636366]">/{medTotal}</span>
          </div>
        </div>
        <div className="py-1 px-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <div className="text-[10px] text-[#86868b]">Advanced</div>
          <div className="text-xs font-medium text-white mt-0.5 tabular-nums">
            {hardSolved}<span className="text-[#636366]">/{hardTotal}</span>
          </div>
        </div>
      </div>

      {/* Footer: Next Challenge Action */}
      {nextChallenge && (
        <div className="pt-4 mt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] text-[#86868b] uppercase tracking-wider block font-medium">
              Next Up
            </span>
            <span className="text-xs font-medium text-white truncate block max-w-[200px]">
              {nextChallenge.title}
            </span>
          </div>

          <button
            onClick={() => onSelectChallenge(nextChallenge)}
            className="shrink-0 inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#e5e5ea] text-black font-semibold text-xs active:scale-[0.97] transition-colors cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      )}

    </div>
  );
};
