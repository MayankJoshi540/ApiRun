import React from 'react';
import { Difficulty } from '../types';

interface Props {
  difficulty: Difficulty;
  size?: 'sm' | 'md';
  className?: string;
}

export const DifficultyBadge: React.FC<Props> = ({ 
  difficulty, 
  size = 'sm', 
  className = '' 
}) => {
  const configs: Record<Difficulty, { 
    label: string;
    style: string;
  }> = {
    BEGINNER: {
      label: 'Beginner',
      style: 'bg-[#30d158]/15 text-[#30d158] border-[#30d158]/25'
    },
    INTERMEDIATE: {
      label: 'Intermediate',
      style: 'bg-[#ffd60a]/15 text-[#ffd60a] border-[#ffd60a]/25'
    },
    ADVANCED: {
      label: 'Advanced',
      style: 'bg-[#ff453a]/15 text-[#ff453a] border-[#ff453a]/25'
    }
  };

  const current = configs[difficulty] || configs.BEGINNER;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border select-none ${current.style} ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      } ${className}`}
    >
      {current.label}
    </span>
  );
};
