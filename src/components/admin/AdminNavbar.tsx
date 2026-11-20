'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  ShieldCheck, 
  LogOut
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

interface AdminNavbarProps {
  onToggleSidebarMovil: () => void;
}

export function AdminNavbar({ onToggleSidebarMovil }: AdminNavbarProps) {
  const pathname = usePathname();
  const { logout, adminUser } = useAdmin();

  const obtenerTituloModulo = () => {
    switch (pathname) {
      case '/admin':
        return 'Inicio del Panel';
      case '/admin/caja':
        return 'Caja y Ventas';
      case '/admin/productos':
        return 'Productos del Catálogo';
      case '/admin/categorias':
        return 'Categorías y Rubros';
      case '/admin/promociones':
        return 'Promociones de Temporada';
      case '/admin/horarios':
        return 'Horarios de Atención';
      case '/admin/alertas':
        return 'Avisos del Local';
      default:
        return 'Administración de la Librería';
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#ede4f6]/90 backdrop-blur-md border-b border-[#ded0f2] shadow-xs h-16 sm:h-18 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      
      {/* 1. Botón Móvil y Título */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebarMovil}
          className="lg:hidden p-2 rounded-xl text-purple-950 hover:bg-white/70 transition-colors touch-manipulation cursor-pointer border border-purple-200"
          aria-label="Abrir barra lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900/70 hidden sm:block">
            Librería Motivos
          </span>
          <h1 className="font-heading text-base sm:text-lg lg:text-xl font-black text-purple-950 tracking-tight leading-none">
            {obtenerTituloModulo()}
          </h1>
        </div>
      </div>

      {/* 2. Identidad y Cierre de Sesión */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-purple-200 text-purple-950 text-xs font-bold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#d97786]" />
          <span>{adminUser?.nombre || 'Administrador'}</span>
        </div>

        <button
          type="button"
          onClick={logout}
          title="Cerrar Sesión de Administrador"
          className="inline-flex items-center justify-center p-2 rounded-xl bg-white/80 hover:bg-rose-50 text-rose-600 border border-rose-200 transition-all duration-200 active:scale-95 cursor-pointer"
          aria-label="Cerrar Sesión"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
