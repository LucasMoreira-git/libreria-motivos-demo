'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  ShieldCheck, 
  Store, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

interface AdminNavbarProps {
  onToggleSidebarMovil: () => void;
}

export function AdminNavbar({ onToggleSidebarMovil }: AdminNavbarProps) {
  const pathname = usePathname();
  const { restablecerDatos } = useAdmin();

  const obtenerTituloModulo = () => {
    switch (pathname) {
      case '/admin':
        return 'Panel de Control Principal';
      case '/admin/productos':
        return 'Gestión de Productos (ABM)';
      case '/admin/categorias':
        return 'Gestión de Categorías (ABM)';
      case '/admin/promociones':
        return 'Gestión de Promociones (ABM)';
      case '/admin/horarios':
        return 'Gestión de Horarios y Turnos (ABM)';
      default:
        return 'Administración del Sistema';
    }
  };

  const handleRestablecer = () => {
    if (confirm('¿Deseas restablecer todos los datos iniciales de prueba? Se restaurarán los productos, promociones y horarios.')) {
      restablecerDatos();
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/90 shadow-xs h-16 sm:h-18 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* 1. Botón Móvil y Título */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebarMovil}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors touch-manipulation"
          aria-label="Abrir barra lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden sm:block">
            Módulo Administrativo
          </span>
          <h1 className="font-heading text-base sm:text-lg lg:text-xl font-black text-slate-900 tracking-tight leading-none">
            {obtenerTituloModulo()}
          </h1>
        </div>
      </div>

      {/* 2. Acciones Rápidas del Navbar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Botón Restablecer Datos de Prueba */}
        <button
          type="button"
          onClick={handleRestablecer}
          title="Restablecer datos de prueba a su estado original"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Restablecer Datos</span>
        </button>

        {/* Badge de Rol Exclusivo */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Administrador del sistema</span>
        </div>

        {/* Enlace directo a la Vitrina */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-900 text-white text-xs font-bold shadow-xs transition-all duration-200 active:scale-95"
        >
          <Store className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden xs:inline">Vitrina Web</span>
        </Link>
      </div>
    </header>
  );
}
