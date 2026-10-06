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
        transition: tilt.isHovered ? 'transform 0.12s var(--ease-out)' : 'transform 0.35s var(--ease-out), border-color 0.2s var(--ease-out)',
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
      className={`group relative rounded-2xl bg-[#111622] border p-5 sm:p-6 mb-3 cursor-pointer select-none overflow-hidden active:scale-[0.99] transition-all ${
        isSolved 
          ? 'border-emerald-500/30 hover:border-emerald-500/50 shadow-md' 
          : isInProgress 
          ? 'border-amber-500/30 hover:border-amber-500/50 shadow-md' 
          : 'border-slate-800/80 hover:border-slate-700/90 shadow-sm'
      }`}
    >
      {/* Dynamic 3D Specular Spotlight Reflection */}
      {tilt.isHovered && (
        <div 
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-25 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${tilt.spotlightX}% ${tilt.spotlightY}%, rgba(255, 255, 255, 0.05), transparent 70%)`
          }}
        />
      )}

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Column: Title, Category, Summary, Endpoints & Concepts */}
        <div className="flex-1 space-y-2.5">
          {/* Header Row: Title & Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors flex items-center tracking-tight font-sans">
              {challenge.title}
            </h3>

            <span className="text-xs font-sans font-medium text-slate-400 py-1 px-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              {challenge.category}
            </span>

            <DifficultyBadge difficulty={challenge.difficulty} />
            
            {isSolved && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#00b8a3]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00b8a3]" />
                <span>Solved</span>
              </span>
            )}

            {isInProgress && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#ffc01e]">
                <span>In Progress</span>
              </span>
            )}
          </div>

          {/* Challenge Summary */}
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 max-w-3xl font-normal leading-relaxed font-sans">
            {challenge.summary}
          </p>

          {/* Endpoint Route Pill & Tags */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {/* Main Endpoint Pill */}
            <div className="flex items-center rounded-lg bg-slate-900/70 border border-slate-800 px-3 py-1.5 text-xs sm:text-sm">
              <span className={`font-mono font-bold mr-2 text-xs ${
                challenge.endpoints[0]?.method === 'POST' ? 'text-emerald-400' :
                challenge.endpoints[0]?.method === 'GET' ? 'text-sky-400' :
                challenge.endpoints[0]?.method === 'DELETE' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {challenge.endpoints[0]?.method}
              </span>
              <span className="font-mono text-slate-200 text-xs sm:text-sm">{challenge.endpoints[0]?.path}</span>
              {challenge.endpoints.length > 1 && (
                <span className="text-slate-400 ml-2 text-xs font-mono font-medium">+{challenge.endpoints.length - 1} routes</span>
              )}
            </div>

            <div className="hidden sm:block h-4 bg-slate-800 w-px" />

            {/* Concept Pills */}
            <div className="flex flex-wrap gap-2">
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
        <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3.5 pt-2.5 lg:pt-0 shrink-0 border-t lg:border-t-0 border-slate-800/80">
          {/* Estimated Time & Test Count */}
          <div className="flex items-center space-x-3.5 text-xs sm:text-sm text-slate-400 font-mono">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{challenge.estimatedMinutes}m</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>{challenge.testCases.length} tests</span>
            </span>
          </div>

          {/* Action CTA Button with Tactile Press */}
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(challenge); }}
            className={`flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all duration-150 active:scale-95 min-w-[145px] ${
              isSolved
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 hover:bg-slate-700/60 shadow-sm'
                : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-md shadow-emerald-500/10'
            }`}
          >
            <span>{isSolved ? 'View Solution' : isInProgress ? 'Resume Lab' : 'Start Challenge'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
