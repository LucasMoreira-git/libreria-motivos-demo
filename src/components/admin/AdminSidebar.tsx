'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Tag, 
  Clock, 
  ExternalLink, 
  ShieldCheck,
  Store,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

interface AdminSidebarProps {
  onCerrarMovil?: () => void;
}

export function AdminSidebar({ onCerrarMovil }: AdminSidebarProps) {
  const pathname = usePathname();
  const { productos, categorias, promociones, horarios, logout, adminUser } = useAdmin();

  // Contadores activos para badges en el menú
  const totalCatActivas = categorias.filter((c) => !c.fechaHoraBajaCategoria).length;
  const totalPromoActivas = promociones.filter((pr) => !pr.fechaHoraBajaPromocion).length;
  const totalProdActivos = productos.filter((p) => !p.fechaHoraBajaProducto).length;
  const totalHorariosActivos = horarios.filter((h) => !h.fechaHoraBajaHA).length;

  const NAV_ITEMS = [
    {
      titulo: 'Dashboard',
      href: '/admin',
      icono: LayoutDashboard,
      badge: null,
    },
    {
      titulo: 'ABM Categorías',
      href: '/admin/categorias',
      icono: FolderTree,
      badge: totalCatActivas,
    },
    {
      titulo: 'ABM Promociones',
      href: '/admin/promociones',
      icono: Tag,
      badge: totalPromoActivas,
    },
    {
      titulo: 'ABM Producto',
      href: '/admin/productos',
      icono: Package,
      badge: totalProdActivos,
    },
    {
      titulo: 'ABM Horarios',
      href: '/admin/horarios',
      icono: Clock,
      badge: totalHorariosActivos,
    },
  ];

  return (
    <aside className="w-64 lg:w-72 bg-white text-slate-800 flex flex-col h-full border-r border-[#ded0f2] select-none shadow-sm">
      
      {/* 1. Encabezado de Identidad del Dashboard con el logo oficial de la marca */}
      <div className="p-5 border-b border-[#ded0f2]/80 bg-[#fdf8f9]">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo-motivos.jpg"
            alt="Logo oficial de Librería Motivos"
            className="w-11 h-11 rounded-full object-cover shadow-xs border border-[#f3cad2] bg-[#fdfbf7] shrink-0"
          />
          <div className="min-w-0">
            <h2 className="font-heading text-sm font-black tracking-tight text-purple-950 truncate">
              Librería Motivos
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Panel Administrador
              </span>
            </div>
          </div>
        </div>

        {/* Badge de Rol con estilo lila suave */}
        <div className="mt-3 px-3 py-1.5 rounded-xl bg-[#ede4f6]/80 border border-[#ded0f2] flex items-center justify-between text-xs">
          <span className="text-purple-950 text-[11px] font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d97786]" />
            {adminUser?.nombre || 'Administrador'}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#d97786] text-white">
            Admin
          </span>
        </div>
      </div>

      {/* 2. Enlaces de Navegación del Dashboard */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900/60 px-3 block mb-2">
          Módulos de Gestión
        </span>

        {NAV_ITEMS.map((item) => {
          const esActivo = pathname === item.href;
          const Icono = item.icono;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCerrarMovil}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 group active:scale-98 ${
                esActivo
                  ? 'bg-[#ede4f6] text-purple-950 font-bold shadow-2xs border-l-4 border-[#d97786]'
                  : 'text-slate-600 hover:text-purple-950 hover:bg-[#fbf7fd]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icono className={`w-4 h-4 shrink-0 transition-colors ${
                  esActivo ? 'text-[#d97786]' : 'text-slate-400 group-hover:text-purple-700'
                }`} />
                <span>{item.titulo}</span>
              </div>

              {item.badge !== null && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  esActivo 
                    ? 'bg-[#d97786] text-white' 
                    : 'bg-[#fef5f6] text-[#6e2e38] border border-[#f4d0d6]'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* 3. Pie de la Barra Lateral: Acceso a la Vitrina y Cerrar Sesión */}
      <div className="p-3 border-t border-[#ded0f2]/80 bg-[#fdf8f9] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl bg-[#ede4f6] hover:bg-[#ded0f2] text-purple-950 text-xs font-bold transition-all duration-200 active:scale-95 group shadow-2xs border border-[#ded0f2]"
        >
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#d97786]" />
            <span>Ver Vitrina Pública</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-purple-700 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <button
          type="button"
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full px-3.5 py-2 rounded-xl text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-rose-200/80 text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
