import React from 'react';
import { CheckCircle2, ArrowRight, Clock, ShieldCheck, Lock, Unlock } from '@/components/ui/GoogleIcon';
import { Challenge } from '../types';
import { DifficultyBadge } from './DifficultyBadge';
import { ConceptBadge } from './ConceptBadge';
import { useAuth } from '@/context/AuthContext';

interface Props {
  challenge: Challenge;
  onSelect: (challenge: Challenge) => void;
  onClickConcept?: (concept: string) => void;
}

export const ChallengeCard: React.FC<Props> = ({
  challenge,
  onSelect,
  onClickConcept
}) => {
  const { user } = useAuth();
  const isFree = challenge.slug === 'ping-health-api';
  const isLocked = !user && !isFree;
  const isSolved = challenge.status === 'SOLVED';
  const isInProgress = challenge.status === 'IN_PROGRESS';
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0, spotlightX: 50, spotlightY: 50, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Subtle tilt within [-2.5deg, 2.5deg] for natural Apple physical depth
    const rotateY = ((x - centerX) / centerX) * 2.5;
    const rotateX = -((y - centerY) / centerY) * 2.5;
    
    const spotlightX = (x / rect.width) * 100;
    const spotlightY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, spotlightX, spotlightY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, spotlightX: 50, spotlightY: 50, isHovered: false });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(challenge)}
      style={{
        transform: tilt.isHovered 
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-2px) scale3d(1.004, 1.004, 1.004)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)',
        transition: tilt.isHovered ? 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease',
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
      className={`group relative rounded-2xl bg-[#1c1c1e]/60 border p-5 sm:p-6 mb-3 cursor-pointer select-none overflow-hidden active:scale-[0.985] transition-all shadow-[0_4px_16px_rgba(0,0,0,0.3)] ${
        isSolved 
          ? 'border-white/[0.12] hover:border-white/[0.22] border-t-white/[0.18]' 
          : isInProgress 
          ? 'border-[#ffd60a]/25 hover:border-[#ffd60a]/40 border-t-[#ffd60a]/35' 
          : 'border-white/[0.08] border-t-white/[0.14] hover:border-white/[0.18]'
      }`}
    >
      {/* Specular Spotlight Reflection */}
      {tilt.isHovered && (
        <div 
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-20 transition-opacity duration-200"
          style={{
            background: `radial-gradient(350px circle at ${tilt.spotlightX}% ${tilt.spotlightY}%, rgba(255, 255, 255, 0.1), transparent 70%)`
          }}
        />
      )}

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Column: Title, Category, Summary, Endpoints & Concepts */}
        <div className="flex-1 space-y-2">
          {/* Header Row: Title & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-white transition-colors tracking-[-0.02em]">
              {challenge.title}
            </h3>

            <span className="text-[11px] font-medium text-[#86868b] py-0.5 px-2.5 rounded-full bg-white/[0.05] border border-white/[0.08]">
              {challenge.category}
            </span>

            <DifficultyBadge difficulty={challenge.difficulty} />
            
            {isFree && !user && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#30d158] bg-[#30d158]/15 border border-[#30d158]/30 px-2 py-0.5 rounded-full">
                <Unlock className="w-3 h-3 text-[#30d158]" />
                <span>Free Demo</span>
              </span>
            )}

            {isLocked && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#ffd60a] bg-[#ffd60a]/10 border border-[#ffd60a]/25 px-2 py-0.5 rounded-full">
                <Lock className="w-3 h-3 text-[#ffd60a]" />
                <span>Login Required</span>
              </span>
            )}

            {isSolved && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#30d158]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#30d158]" />
                <span>Solved</span>
              </span>
            )}

            {isInProgress && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#ffd60a]">
                <span>In Progress</span>
              </span>
            )}
          </div>

          {/* Challenge Summary */}
          <p className="text-xs sm:text-[13px] text-[#86868b] line-clamp-2 max-w-3xl leading-relaxed">
            {challenge.summary}
          </p>

          {/* Endpoint Route Pill & Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* Route Pill */}
            <div className="flex items-center rounded-lg bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 text-xs font-mono">
              <span className={`font-bold mr-1.5 text-xs ${
                challenge.endpoints[0]?.method === 'POST' ? 'text-[#30d158]' :
                challenge.endpoints[0]?.method === 'GET' ? 'text-[#0a84ff]' :
                challenge.endpoints[0]?.method === 'DELETE' ? 'text-[#ff453a]' : 'text-[#ff9f0a]'
              }`}>
                {challenge.endpoints[0]?.method}
              </span>
              <span className="text-[#f5f5f7]">{challenge.endpoints[0]?.path}</span>
              {challenge.endpoints.length > 1 && (
                <span className="text-[#86868b] ml-1.5 text-[11px]">+{challenge.endpoints.length - 1}</span>
              )}
            </div>

            <div className="hidden sm:block h-3.5 bg-white/[0.1] w-px" />

            {/* Concept Pills */}
            <div className="flex flex-wrap gap-1.5">
              {challenge.concepts.map((c) => (
                <ConceptBadge 
                  key={c} 
                  concept={c} 
                  onClick={onClickConcept ? () => onClickConcept(c) : undefined}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Metadata & Action Button */}
        <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 pt-2 lg:pt-0 shrink-0 border-t lg:border-t-0 border-white/[0.06]">
          {/* Metadata */}
          <div className="flex items-center space-x-3 text-xs text-[#86868b] tabular-nums">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-[#636366]" />
              <span>{challenge.estimatedMinutes}m</span>
            </span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#636366]" />
              <span>{challenge.testCases.length} tests</span>
            </span>
          </div>

          {/* Action CTA Button with Apple Pill Styling */}
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(challenge); }}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold tracking-[-0.01em] transition-all duration-100 active:scale-[0.96] min-w-[135px] cursor-pointer ${
              isLocked
                ? 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1]'
                : isSolved
                ? 'bg-white/[0.08] hover:bg-white/[0.14] text-[#30d158] border border-[#30d158]/30'
                : 'bg-[#30d158] hover:bg-[#34c759] text-black shadow-xs'
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="w-3.5 h-3.5 text-[#ffd60a]" />
                <span>Sign In to Unlock</span>
              </>
            ) : isFree && !user ? (
              <>
                <span>Try Demo</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </>
            ) : (
              <>
                <span>{isSolved ? 'View Solution' : isInProgress ? 'Resume' : 'Start'}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
