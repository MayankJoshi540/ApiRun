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
    bg: string;
    text: string;
  }> = {
    BEGINNER: {
      label: 'Beginner',
      bg: 'bg-[#1b2a24]',
      text: 'text-[#00b8a3]'
    },
    INTERMEDIATE: {
      label: 'Intermediate',
      bg: 'bg-[#2b2518]',
      text: 'text-[#ffc01e]'
    },
    ADVANCED: {
      label: 'Advanced',
      bg: 'bg-[#2f1b1d]',
      text: 'text-[#ff375f]'
    }
  };

  const current = configs[difficulty] || configs.BEGINNER;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium select-none ${current.bg} ${current.text} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } ${className}`}
    >
      {current.label}
    </span>
  );
};
