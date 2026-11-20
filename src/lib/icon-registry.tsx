'use client';

import React from 'react';
import {
  Star,
  Tag,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Flame,
  Award,
  Heart,
  Percent,
  Zap,
  Package,
  Backpack,
  Ruler,
  Palette,
  Briefcase,
  Gift,
  Bookmark,
  Clock,
  ShieldCheck,
  CheckCircle2,
  LayoutGrid,
  BookOpen,
  PenTool,
  Scissors,
  Compass,
  FileText,
  BadgeCheck,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';

/**
 * Registro centralizado de iconos vectoriales permitidos en Librería Motivos.
 * Mapea identificadores alfanuméricos simples (guardados en BD o estado)
 * con componentes vectoriales oficiales de Lucide React.
 * 
 * Regla de arquitectura: NUNCA guardar JSX ni componentes en la base de datos,
 * únicamente su identificador en minúsculas (ej: 'star', 'tag', 'sparkles').
 */
export const ICON_REGISTRY: Record<string, LucideIcon> = {
  // Opciones visuales de producto
  star: Star,
  tag: Tag,
  'alert-triangle': AlertTriangle,
  'alert-circle': AlertCircle,
  sparkles: Sparkles,
  flame: Flame,
  award: Award,
  heart: Heart,
  percent: Percent,
  zap: Zap,
  package: Package,
  backpack: Backpack,
  ruler: Ruler,
  palette: Palette,
  briefcase: Briefcase,
  gift: Gift,
  bookmark: Bookmark,
  clock: Clock,
  'shield-check': ShieldCheck,
  'check-circle': CheckCircle2,
  'layout-grid': LayoutGrid,
  'book-open': BookOpen,
  'pen-tool': PenTool,
  scissors: Scissors,
  compass: Compass,
  'file-text': FileText,
  'badge-check': BadgeCheck,
  'shopping-bag': ShoppingBag,

  // Aliases en PascalCase para compatibilidad hacia atrás
  LayoutGrid: LayoutGrid,
  Backpack: Backpack,
  Briefcase: Briefcase,
  Palette: Palette,
  Gift: Gift,
  Ruler: Ruler,
  Star: Star,
  Tag: Tag,
  Sparkles: Sparkles,
  AlertTriangle: AlertTriangle,
  Clock: Clock,
  Package: Package,
};

/**
 * Normaliza y valida un identificador de icono, retornando el componente Lucide correspondiente.
 * Si el identificador no existe o es inválido, retorna el componente de respaldo por defecto.
 */
export function getLucideIcon(
  id: string | null | undefined,
  fallbackId: string = 'package'
): LucideIcon {
  if (!id) {
    return ICON_REGISTRY[fallbackId] || Package;
  }

  // 1. Coincidencia directa
  if (ICON_REGISTRY[id]) {
    return ICON_REGISTRY[id];
  }

  // 2. Coincidencia normalizada en minúsculas
  const keyMin = id.toLowerCase().trim();
  if (ICON_REGISTRY[keyMin]) {
    return ICON_REGISTRY[keyMin];
  }

  // 3. Fallback seguro
  return ICON_REGISTRY[fallbackId] || Package;
}

/**
 * Componente declarativo para renderizar cualquier icono del registro centralizado
 * con trazo, tamaño y estilos consistentes.
 */
export interface AppIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: string | null | undefined;
  size?: number;
  className?: string;
  strokeWidth?: number;
  fallback?: string;
}

export function AppIcon({
  name,
  size = 16,
  className = '',
  strokeWidth = 2,
  fallback = 'package',
  ...props
}: AppIconProps) {
  const IconComponent = getLucideIcon(name, fallback);
  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * Definición estructurada para las opciones del selector de iconos en el administrador
 */
export interface VisualIconOption {
  id: string;
  label: string;
  descripcion: string;
  Icon: LucideIcon;
  colorClase: string;
}

/**
 * Opciones seleccionables para los productos en el administrador
 */
export const PRODUCT_ICON_OPTIONS: VisualIconOption[] = [
  { id: 'star', label: 'Estrella', descripcion: 'Destacado en Portada', Icon: Star, colorClase: 'text-amber-500' },
  { id: 'tag', label: 'Etiqueta', descripcion: 'Oferta Especial', Icon: Tag, colorClase: 'text-[#d97786]' },
  { id: 'alert-triangle', label: 'Alerta', descripcion: 'Stock Crítico / Pocas Unidades', Icon: AlertTriangle, colorClase: 'text-orange-500' },
  { id: 'sparkles', label: 'Destellos', descripcion: 'Nuevo Ingreso / Novedad', Icon: Sparkles, colorClase: 'text-indigo-500' },
  { id: 'flame', label: 'Fuego', descripcion: 'Más Vendido / Popular', Icon: Flame, colorClase: 'text-rose-500' },
  { id: 'award', label: 'Medalla', descripcion: 'Línea Premium / Calidad', Icon: Award, colorClase: 'text-purple-600' },
  { id: 'heart', label: 'Corazón', descripcion: 'Recomendado del Local', Icon: Heart, colorClase: 'text-red-500' },
  { id: 'percent', label: 'Porcentaje', descripcion: 'Liquidación / Ahorro', Icon: Percent, colorClase: 'text-emerald-600' },
  { id: 'zap', label: 'Rayo', descripcion: 'Oportunidad Relámpago', Icon: Zap, colorClase: 'text-amber-600' },
  { id: 'gift', label: 'Regalo', descripcion: 'Ideal para Regalar', Icon: Gift, colorClase: 'text-pink-500' },
  { id: 'backpack', label: 'Mochila', descripcion: 'Línea Escolar 2027', Icon: Backpack, colorClase: 'text-blue-600' },
  { id: 'package', label: 'Caja', descripcion: 'Combo / Pack Ahorro', Icon: Package, colorClase: 'text-slate-700' },
];

/**
 * Opciones seleccionables para las categorías en el administrador
 */
export const CATEGORY_ICON_OPTIONS: VisualIconOption[] = [
  { id: 'backpack', label: 'Mochila', descripcion: 'Escolar y Colegial', Icon: Backpack, colorClase: 'text-blue-600' },
  { id: 'briefcase', label: 'Maletín', descripcion: 'Oficina y Comercial', Icon: Briefcase, colorClase: 'text-slate-700' },
  { id: 'palette', label: 'Paleta', descripcion: 'Arte y Creatividad', Icon: Palette, colorClase: 'text-rose-500' },
  { id: 'gift', label: 'Regalo', descripcion: 'Regalería y Didácticos', Icon: Gift, colorClase: 'text-emerald-600' },
  { id: 'ruler', label: 'Regla', descripcion: 'Dibujo Técnico', Icon: Ruler, colorClase: 'text-cyan-600' },
  { id: 'book-open', label: 'Libro', descripcion: 'Lectura y Textos', Icon: BookOpen, colorClase: 'text-indigo-600' },
  { id: 'pen-tool', label: 'Pluma', descripcion: 'Escritura Fina', Icon: PenTool, colorClase: 'text-purple-600' },
  { id: 'scissors', label: 'Tijeras', descripcion: 'Manualidades y Cortes', Icon: Scissors, colorClase: 'text-amber-600' },
  { id: 'compass', label: 'Compás', descripcion: 'Geometría y Precisión', Icon: Compass, colorClase: 'text-teal-600' },
  { id: 'layout-grid', label: 'Cuadrícula', descripcion: 'General / Todos', Icon: LayoutGrid, colorClase: 'text-slate-800' },
  { id: 'sparkles', label: 'Destellos', descripcion: 'Especiales / Novedad', Icon: Sparkles, colorClase: 'text-pink-500' },
  { id: 'shopping-bag', label: 'Bolsa', descripcion: 'Comercial y Accesorios', Icon: ShoppingBag, colorClase: 'text-slate-700' },
];

/**
 * Selector visual de iconos para el panel administrativo.
 * Muestra una cuadrícula organizada, previsualización en vivo,
 * nombre / significado y estado activo destacado.
 */
interface VisualIconPickerProps {
  selectedIcon: string | null | undefined;
  onSelect: (iconId: string) => void;
  options?: VisualIconOption[];
  titulo?: string;
  permiteDesmarcar?: boolean;
}

export function VisualIconPicker({
  selectedIcon,
  onSelect,
  options = PRODUCT_ICON_OPTIONS,
  titulo = 'Selector de Icono Vectorial Representativo',
  permiteDesmarcar = true,
}: VisualIconPickerProps) {
  const currentKey = (selectedIcon || '').toLowerCase();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {titulo}
        </label>
        {selectedIcon && permiteDesmarcar && (
          <button
            type="button"
            onClick={() => onSelect('')}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
          >
            Restablecer por defecto
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {options.map((opt) => {
          const isSelected = currentKey === opt.id.toLowerCase();
          const IconComp = opt.Icon;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(isSelected && permiteDesmarcar ? '' : opt.id)}
              className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer min-h-[58px] touch-manipulation select-none ${
                isSelected
                  ? 'border-blue-900 bg-blue-50/80 ring-2 ring-blue-900/30 text-blue-950 font-bold shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
              title={`${opt.label}: ${opt.descripcion}`}
              aria-pressed={isSelected}
            >
              <IconComp className={`w-4 h-4 ${isSelected ? 'text-blue-900' : opt.colorClase} shrink-0`} />
              <span className="text-[10px] leading-tight truncate w-full px-0.5">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
