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
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  
  return (
    <span
      onClick={onClick}
      className={'inline-flex items-center font-sans font-medium rounded-md border transition-colors ' + sizeClasses + ' ' + (
        active 
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 font-medium'
          : 'bg-[#12161f] text-[#8b949e] border-[#262d3a] hover:text-[#e6edf3] hover:border-[#374151]'
      ) + (isClickable ? ' cursor-pointer select-none' : '')}
    >
      <span className="text-[#10b981] mr-1 text-[10px] opacity-70 font-semibold">#</span>
      {concept}
    </span>
  );
};
