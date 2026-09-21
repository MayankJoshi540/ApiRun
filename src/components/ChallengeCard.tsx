import React from 'react';
import { CheckCircle2, ArrowRight, Clock, ShieldCheck } from '@/components/ui/GoogleIcon';
import { Challenge } from '../types';
import { DifficultyBadge } from './DifficultyBadge';
import { ConceptBadge } from './ConceptBadge';

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
    
    // Subtly tilt within [-3deg, 3deg] for natural physical depth
    const rotateY = ((x - centerX) / centerX) * 3;
    const rotateX = -((y - centerY) / centerY) * 3;
    
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
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-2px) scale3d(1.006, 1.006, 1.006)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)',
        transition: tilt.isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
      className={`group relative rounded-2xl bg-[#0b0f17] border p-5 sm:p-6 mb-3 cursor-pointer select-none overflow-hidden shadow-lg ${
        isSolved 
          ? 'border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-[0_15px_35px_rgba(16,185,129,0.12)]' 
          : isInProgress 
          ? 'border-amber-500/30 hover:border-amber-500/60 hover:shadow-[0_15px_35px_rgba(245,158,11,0.12)]' 
          : 'border-white/[0.08] hover:border-emerald-500/40 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)]'
      }`}
    >
      {/* Dynamic 3D Specular Spotlight Reflection */}
      {tilt.isHovered && (
        <div 
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-60 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${tilt.spotlightX}% ${tilt.spotlightY}%, rgba(16, 185, 129, 0.12), transparent 70%)`
          }}
        />
      )}

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Column: Title, Category, Summary, Endpoints & Concepts */}
        <div className="flex-1 space-y-2.5">
          {/* Header Row: Title & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center tracking-tight font-sans">
              {challenge.title}
            </h3>

            <span className="text-[11px] font-mono text-slate-400 py-0.5 px-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              {challenge.category}
            </span>

            <DifficultyBadge difficulty={challenge.difficulty} />
            
            {isSolved && (
              <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded-lg">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>SOLVED</span>
              </span>
            )}

            {isInProgress && (
              <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-amber-400 bg-amber-950/40 border border-amber-800/50 px-2 py-0.5 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1 animate-pulse" />
                <span>IN PROGRESS</span>
              </span>
            )}
          </div>

          {/* Challenge Summary */}
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 max-w-3xl font-normal leading-relaxed font-sans">
            {challenge.summary}
          </p>

          {/* Endpoint Route Pill & Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {/* Main Endpoint Pill */}
            <div className="flex items-center rounded-lg bg-black/50 border border-white/[0.08] px-2.5 py-1 text-xs">
              <span className={`font-mono font-bold mr-1.5 text-[11px] ${
                challenge.endpoints[0]?.method === 'POST' ? 'text-emerald-400' :
                challenge.endpoints[0]?.method === 'GET' ? 'text-sky-400' :
                challenge.endpoints[0]?.method === 'DELETE' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {challenge.endpoints[0]?.method}
              </span>
              <span className="font-mono text-slate-200 text-[11px]">{challenge.endpoints[0]?.path}</span>
              {challenge.endpoints.length > 1 && (
                <span className="text-slate-500 ml-1.5 text-[10px] font-mono">+{challenge.endpoints.length - 1} routes</span>
              )}
            </div>

            <div className="hidden sm:block h-3.5 bg-white/[0.08] w-px" />

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

        {/* Right Column: Metadata & CTA Button */}
        <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 pt-2 lg:pt-0 shrink-0 border-t lg:border-t-0 border-white/[0.06]">
          {/* Estimated Time & Test Count */}
          <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{challenge.estimatedMinutes}m</span>
            </span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>{challenge.testCases.length} tests</span>
            </span>
          </div>

          {/* Action CTA Button with Tactile Press */}
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(challenge); }}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold tracking-tight transition-all duration-150 active:scale-95 ${
              isSolved
                ? 'bg-white/[0.06] text-emerald-400 border border-emerald-500/40 hover:bg-white/[0.1] shadow-sm'
                : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/15'
            }`}
          >
            <span>{isSolved ? 'View Solution' : isInProgress ? 'Resume Lab' : 'Start Challenge'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
