import React from 'react';
import { BackendConcept } from '../types';

interface Props {
  concept: BackendConcept | string;
  size?: 'sm' | 'md';
  active?: boolean;
  onClick?: () => void;
}

export const ConceptBadge: React.FC<Props> = ({
  concept,
  size = 'sm',
  active = false,
  onClick
}) => {
  const isClickable = !!onClick;
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2.5 py-0.5 rounded-full' : 'text-xs px-3 py-1 rounded-full';
  
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center font-sans font-medium border transition-all duration-100 ${sizeClasses} ${
        active 
          ? 'bg-[#30d158]/15 text-[#30d158] border-[#30d158]/35 font-semibold'
          : 'bg-white/[0.04] text-[#86868b] border-white/[0.06] hover:text-white hover:border-white/10'
      } ${isClickable ? 'cursor-pointer select-none active:scale-[0.96]' : ''}`}
    >
      <span className="text-[#30d158] mr-1 text-[11px] opacity-75 font-semibold">#</span>
      {concept}
    </span>
  );
};
