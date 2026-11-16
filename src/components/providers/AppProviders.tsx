'use client';

import React from 'react';
import { AdminProvider } from '@/context/AdminContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <AdminProvider>{children}</AdminProvider>;
}
