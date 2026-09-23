'use client';

import React from 'react';
import { AppNavbar } from './AppNavbar';

interface Props {
  onNavigate?: (route: 'landing' | 'challenges' | 'progress' | 'feedback') => void;
  onStartBuilding?: () => void;
}

export const LandingNavbar: React.FC<Props> = ({ onNavigate }) => {
  return <AppNavbar onNavigate={onNavigate} />;
};
