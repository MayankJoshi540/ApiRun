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
  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-1 rounded-lg' : 'text-xs sm:text-sm px-3 py-1.5 rounded-lg';
  
  return (
    <span
      onClick={onClick}
      className={'inline-flex items-center font-sans font-medium border transition-colors ' + sizeClasses + ' ' + (
        active 
          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-semibold'
          : 'bg-[#141a27] text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
      ) + (isClickable ? ' cursor-pointer select-none active:scale-95' : '')}
    >
      <span className="text-emerald-400 mr-1 text-xs opacity-80 font-bold">#</span>
      {concept}
    </span>
  );
};
