'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  ShieldCheck, 
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useAdminTheme, type AdminTheme } from '@/context/AdminThemeContext';

interface AdminNavbarProps {
  onToggleSidebarMovil: () => void;
}

const OPCIONES_TEMA: { id: AdminTheme; label: string; titulo: string; icono: React.ComponentType<{ className?: string }> }[] = [
  { id: 'claro', label: 'Claro', titulo: 'Tema Blanco (Claro)', icono: Sun },
  { id: 'oscuro', label: 'Oscuro', titulo: 'Tema Oscuro (Negro)', icono: Moon },
];

export function AdminNavbar({ onToggleSidebarMovil }: AdminNavbarProps) {
  const pathname = usePathname();
  const { logout, adminUser } = useAdmin();
  const { theme, setTheme } = useAdminTheme();

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

      {/* 2. Selector de Tema (discreto, tonos claros pastel), Identidad y Cierre de Sesión */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div
          role="group"
          aria-label="Cambiar tema del panel"
          className="admin-theme-switcher inline-flex items-center p-1 rounded-full border shadow-2xs gap-0.5"
        >
          {OPCIONES_TEMA.map((op) => {
            const Icono = op.icono;
            const activo = theme === op.id;
            return (
              <button
                key={op.id}
                type="button"
                onClick={(e) => setTheme(op.id, e)}
                title={op.titulo}
                aria-label={op.titulo}
                aria-pressed={activo}
                className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-bold transition-all duration-300 ease-out cursor-pointer active:scale-95 ${
                  activo
                    ? 'admin-theme-btn-active shadow-2xs scale-100'
                    : 'admin-theme-btn hover:bg-[#fbecee] opacity-80 hover:opacity-100'
                }`}
              >
                <Icono
                  className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 ${
                    activo ? 'rotate-12 scale-110' : 'rotate-0 scale-100'
                  }`}
                />
                <span className="hidden xl:inline">{op.label}</span>
              </button>
            );
          })}
        </div>

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
