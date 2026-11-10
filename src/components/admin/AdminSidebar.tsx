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
  Store
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

interface AdminSidebarProps {
  onCerrarMovil?: () => void;
}

export function AdminSidebar({ onCerrarMovil }: AdminSidebarProps) {
  const pathname = usePathname();
  const { productos, categorias, promociones, horarios } = useAdmin();

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
    <aside className="w-64 lg:w-72 bg-slate-900 text-slate-100 flex flex-col h-full border-r border-slate-800 select-none shadow-xl">
      {/* 1. Encabezado de Identidad del Dashboard */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white flex items-center justify-center font-black text-xl shadow-md border border-blue-400/30 shrink-0">
            M
          </div>
          <div className="min-w-0">
            <h2 className="font-heading text-sm font-black tracking-tight text-white truncate">
              Librería Motivos
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Panel Administrador
              </span>
            </div>
          </div>
        </div>

        {/* Badge de Rol */}
        <div className="mt-3.5 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Rol de Usuario:
          </span>
          <span className="font-bold text-amber-300 text-[11px]">
            Admin Sistema
          </span>
        </div>
      </div>

      {/* 2. Enlaces de Navegación del Dashboard */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto no-scrollbar">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
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
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icono className={`w-4 h-4 shrink-0 transition-colors ${
                  esActivo ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                }`} />
                <span>{item.titulo}</span>
              </div>

              {item.badge !== null && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  esActivo 
                    ? 'bg-blue-800 text-white' 
                    : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* 3. Pie de la Barra Lateral: Acceso a la Vitrina Pública */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all duration-200 active:scale-95 group shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Ver Vitrina Pública</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
        </Link>
      </div>
    </aside>
  );
}
