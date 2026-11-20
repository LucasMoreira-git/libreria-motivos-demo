'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { AdminFeedbackProvider } from '@/context/AdminFeedbackContext';
import { X } from 'lucide-react';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdmin();
  const pathname = usePathname();
  const [sidebarMovilAbierta, setSidebarMovilAbierta] = useState(false);

  // Si no está autenticado, conecta directamente la vista de Login en /admin
  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return (
    <div className="min-h-screen bg-[#fcf8f9] flex text-slate-800 font-sans selection:bg-[#fbecee] selection:text-[#6e2e38]">
      
      {/* 1. Barra Lateral de Navegación (Desktop) */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-20">
        <AdminSidebar />
      </div>

      {/* 2. Barra Lateral Móvil con Telón Semitransparente */}
      {sidebarMovilAbierta && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-purple-950/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setSidebarMovilAbierta(false)}
            aria-hidden="true"
          />

          {/* Contenedor Sidebar Móvil */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white animate-in slide-in-from-left duration-200 z-10 shadow-2xl">
            <div className="absolute top-3 right-3 z-20">
              <button
                type="button"
                onClick={() => setSidebarMovilAbierta(false)}
                className="p-1.5 rounded-xl text-purple-950 hover:bg-[#ede4f6] transition-colors cursor-pointer"
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
          <div key={pathname} className="animate-in fade-in duration-200">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminFeedbackProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminFeedbackProvider>
  );
}
