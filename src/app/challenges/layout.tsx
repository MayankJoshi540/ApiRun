'use client';

import React from 'react';
import { AuthGuard } from '@/components/AuthGuard';

export default function ChallengesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
