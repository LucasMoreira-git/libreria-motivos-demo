'use client';

import React, { useState } from 'react';
import { AdminProvider } from '@/context/AdminContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { X } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarMovilAbierta, setSidebarMovilAbierta] = useState(false);

  return (
    <AdminProvider>
      <div className="min-h-screen bg-slate-100/80 flex text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
        
        {/* 1. Barra Lateral de Navegación (Desktop) */}
        <div className="hidden lg:block shrink-0 sticky top-0 h-screen">
          <AdminSidebar />
        </div>

        {/* 2. Barra Lateral Móvil con Telón Semitransparente */}
        {sidebarMovilAbierta && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
              onClick={() => setSidebarMovilAbierta(false)}
              aria-hidden="true"
            />

            {/* Contenedor Sidebar Móvil */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 animate-in slide-in-from-left duration-200 z-10">
              <div className="absolute top-3 right-3">
                <button
                  type="button"
                  onClick={() => setSidebarMovilAbierta(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Cerrar barra lateral"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <AdminSidebar onCerrarMovil={() => setSidebarMovilAbierta(false)} />
            </div>
          </div>
        )}

        {/* 3. Área Principal del Dashboard */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminNavbar onToggleSidebarMovil={() => setSidebarMovilAbierta(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>

      </div>
    </AdminProvider>
  );
}
