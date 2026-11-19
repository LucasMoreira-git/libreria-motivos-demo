'use client';

import React from 'react';
import { AdminProvider } from '@/context/AdminContext';
import { ConsultaProvider } from '@/context/ConsultaContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <ConsultaProvider>{children}</ConsultaProvider>
    </AdminProvider>
  );
}
