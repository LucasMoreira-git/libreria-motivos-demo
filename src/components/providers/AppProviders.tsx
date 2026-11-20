'use client';

import React from 'react';
import { AdminProvider } from '@/context/AdminContext';
import { ConsultaProvider } from '@/context/ConsultaContext';
import { TopLoadingBar } from '@/components/ui/TopLoadingBar';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <ConsultaProvider>
        <TopLoadingBar />
        {children}
      </ConsultaProvider>
    </AdminProvider>
  );
}
