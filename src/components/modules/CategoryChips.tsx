'use client';

import React from 'react';
import { TipoCategoria } from '@/types/catalogo';
import { CATEGORIAS_MOCK } from '@/lib/mock-catalogo';
import {
  LayoutGrid,
  Backpack,
  Briefcase,
  Palette,
  Gift,
  Ruler,
  type LucideIcon,
} from 'lucide-react';

interface CategoryChipsProps {
  categorias?: TipoCategoria[];
  categoriaSeleccionadaId: string;
  onSeleccionarCategoria: (id: string) => void;
}

/**
 * Mapeo directo y semántico de categorías a íconos SVG de Lucide React
 */
const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  todos: LayoutGrid,
  escolar: Backpack,
  oficina: Briefcase,
  arte: Palette,
  regaleria: Gift,
  tecnico: Ruler,
};

/**
 * Resuelve el ícono semántico para una entidad TipoCategoria dada,
 * soportando búsqueda por ID, iconoLucide o análisis de texto de respaldo.
 */
function getCategoryIcon(cat: TipoCategoria): LucideIcon {
  // 1. Coincidencia por ID o slug
  const key = (cat.id || cat.slug || '').toLowerCase();
  if (CATEGORY_ICON_MAP[key]) {
    return CATEGORY_ICON_MAP[key];
  }

  // 2. Coincidencia por iconoLucide explícito
  if (cat.iconoLucide && CATEGORY_ICON_MAP[cat.iconoLucide.toLowerCase()]) {
    return CATEGORY_ICON_MAP[cat.iconoLucide.toLowerCase()];
  }

  // 3. Coincidencia semántica inteligente por nombre de categoría
  const nombre = cat.nombre.toLowerCase();
  if (nombre.includes('escolar') || nombre.includes('colegio') || nombre.includes('útil')) {
    return Backpack;
  }
  if (nombre.includes('oficina') || nombre.includes('comercial') || nombre.includes('empresa')) {
    return Briefcase;
  }
  if (nombre.includes('arte') || nombre.includes('diseño') || nombre.includes('pintura')) {
    return Palette;
  }
  if (nombre.includes('regal') || nombre.includes('didáctico') || nombre.includes('juego')) {
    return Gift;
  }
  if (nombre.includes('técnico') || nombre.includes('tecnico') || nombre.includes('dibujo') || nombre.includes('geometría')) {
    return Ruler;
  }

  return LayoutGrid;
}

export function CategoryChips({
  categorias = CATEGORIAS_MOCK,
  categoriaSeleccionadaId,
  onSeleccionarCategoria,
}: CategoryChipsProps) {
  return (
    <nav 
      aria-label="Filtro de categorías de productos"
      className="w-full relative z-10 pointer-events-auto"
    >
      {/* Contenedor con deslizamiento horizontal táctil optimizado y scrollbar-hide para móviles */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide no-scrollbar scroll-smooth py-1.5 -mx-4 px-4 sm:mx-0 sm:px-0 touch-pan-x overscroll-x-contain relative z-10 pointer-events-auto">
        {categorias.map((cat) => {
          const esActiva = cat.id === categoriaSeleccionadaId;
          const IconComponent = getCategoryIcon(cat);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSeleccionarCategoria(cat.id)}
              aria-pressed={esActiva}
              className={`group shrink-0 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ease-out active:scale-95 min-h-[44px] select-none touch-manipulation cursor-pointer pointer-events-auto shadow-2xs focus-visible:ring-2 focus-visible:ring-[#d97786] focus-visible:outline-hidden ${
                esActiva
                  ? 'bg-[#d97786] hover:bg-[#c46372] text-white shadow-sm ring-1 ring-[#c46372]/30'
                  : 'bg-white hover:bg-[#fef5f6] text-slate-700 border border-slate-200/90 hover:border-[#f4d0d6] hover:text-[#6e2e38]'
              }`}
            >
              {/* Ícono semántico Lucide SVG de 20px (w-5 h-5), stroke-width unificado y color armónico */}
              <IconComponent 
                aria-hidden="true"
                strokeWidth={2}
                className={`w-5 h-5 shrink-0 transition-all duration-200 pointer-events-none ${
                  esActiva 
                    ? 'text-pink-100 group-hover:scale-105' 
                    : 'text-slate-500 group-hover:text-[#d97786] group-hover:scale-105'
                }`}
              />
              <span className="whitespace-nowrap font-heading tracking-tight pointer-events-none">{cat.nombre}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
