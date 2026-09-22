'use client';

import React from 'react';
import { AppNavbar } from './AppNavbar';

interface Props {
  activeTab?: 'landing' | 'challenges' | 'progress' | 'feedback' | 'dashboard';
  onSelectTab?: (tab: 'landing' | 'challenges' | 'progress' | 'feedback' | 'dashboard') => void;
  solvedCount?: number;
  totalCount?: number;
  onOpenSearch?: () => void;
}

export const BackendRankNavbar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  solvedCount,
  totalCount
}) => {
  return (
    <AppNavbar
      activeTab={activeTab}
      onSelectTab={onSelectTab}
      solvedCount={solvedCount}
      totalCount={totalCount}
    />
  );
};
