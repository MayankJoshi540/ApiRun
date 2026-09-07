import React from 'react';
import { Difficulty } from '../types';

interface Props {
  difficulty: Difficulty;
  size?: 'sm' | 'md';
}

export const DifficultyBadge: React.FC<Props> = ({ difficulty, size = 'sm' }) => {
  const styles: Record<Difficulty, { bg: string; text: string; border: string; label: string }> = {
    BEGINNER: {
      bg: 'bg-emerald-950/50',
      text: 'text-emerald-400',
      border: 'border-emerald-800/60',
      label: 'Beginner'
    },
    INTERMEDIATE: {
      bg: 'bg-amber-950/50',
      text: 'text-amber-400',
      border: 'border-amber-800/60',
      label: 'Intermediate'
    },
    ADVANCED: {
      bg: 'bg-red-950/50',
      text: 'text-red-400',
      border: 'border-red-800/60',
      label: 'Advanced'
    }
  };

  const current = styles[difficulty] || styles.BEGINNER;
  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2.5 py-0.5' 
    : 'text-xs px-3 py-1 font-semibold';

  return (
    <span
      className={`inline-flex items-center font-sans font-medium rounded-md border ${current.bg} ${current.text} ${current.border} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-90" />
      {current.label}
    </span>
  );
};
