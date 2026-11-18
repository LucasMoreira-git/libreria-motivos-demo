'use client';

import React from 'react';
import { Producto } from '@/types/catalogo';
import { DATOS_LIBRERIA_MOTIVOS } from '@/lib/mock-data';
import { getProductWhatsAppLink } from '@/lib/whatsapp';
import { Card } from '@/components/ui/card';
import { Eye, Star, Tag, AlertTriangle, Sparkles, Info } from 'lucide-react';
import { AppIcon } from '@/lib/icon-registry';

interface ProductCardProps {
  producto: Producto;
  onVerDetalle?: (producto: Producto) => void;
}

function obtenerEstiloBadge(textoBadge: string): string {
  const t = textoBadge.toUpperCase();
  if (t.includes('OFERTA') || t.includes('DESCUENTO')) {
    return 'bg-[#d97786] text-white';
  }
  if (t.includes('VENDIDO') || t.includes('TOP')) {
    return 'bg-amber-500 text-slate-950 font-black';
  }
  if (t.includes('NOVEDAD') || t.includes('NUEVO')) {
    return 'bg-blue-600 text-white';
  }
  if (t.includes('STOCK') || t.includes('UNIDADES') || t.includes('LIMITAD')) {
    return 'bg-orange-600 text-white';
  }
  if (t.includes('ESCOLAR')) {
    return 'bg-indigo-600 text-white';
  }
  if (t.includes('PREMIUM') || t.includes('EDICIÓN') || t.includes('EDICION')) {
    return 'bg-slate-900 text-amber-300 border border-amber-300/40';
  }
  if (t.includes('TÉCNICO') || t.includes('TECNICO')) {
    return 'bg-cyan-700 text-white';
  }
  if (t.includes('AMIGO') || t.includes('AHORRO') || t.includes('IMPERDIBLE')) {
    return 'bg-emerald-600 text-white';
  }
  return 'bg-slate-900/90 text-white';
}

export function ProductCard({ producto, onVerDetalle }: ProductCardProps) {
  const urlFoto =
    producto.fotoProducto ||
    producto.foto ||
    'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=700&q=80';

  const whatsappUrl = getProductWhatsAppLink(
    producto,
    DATOS_LIBRERIA_MOTIVOS.telefonoWhatsApp
  );

  const precioFormateado = producto.precio.toLocaleString('es-AR');
  const tieneDescuento = Boolean(
    producto.precioAnterior && producto.precioAnterior > producto.precio
  );
  const porcentajeDescuento = tieneDescuento && producto.precioAnterior
    ? Math.round(((producto.precioAnterior - producto.precio) / producto.precioAnterior) * 100)
    : null;

  const badgeTexto = producto.badge || producto.badgeProducto;
  const esUltimasUnidades = Boolean(producto.ultimasUnidades || producto.ultimasUnidadesProducto);
  const esNuevoIngreso = Boolean(producto.nuevoIngreso || producto.nuevoIngresoProducto);
  const esDestacado = Boolean(producto.destacado || producto.destacadoProducto);

  // Icono representativo del producto
  const iconoRepresentativo = producto.iconoProducto || producto.icono || (
    esDestacado ? 'star' :
    (producto.enOferta || producto.enOfertaProducto || tieneDescuento) ? 'tag' :
    esUltimasUnidades ? 'alert-triangle' :
    esNuevoIngreso ? 'sparkles' : null
  );

  return (
    <Card className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200/90 hover:border-[#eed0d5] shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out h-full">
      {/* Zona Superior Clickeable para abrir el Modal de Detalle */}
      <div 
        onClick={() => onVerDetalle && onVerDetalle(producto)}
        className="cursor-pointer flex flex-col flex-1 touch-manipulation"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onVerDetalle && onVerDetalle(producto);
          }
        }}
        aria-label={`Ver detalles de ${producto.nombre}`}
      >
        {/* Contenedor con altura fija h-[220px] lg:h-[260px] y foto real con object-cover */}
        <div className="relative w-full h-[220px] lg:h-[260px] overflow-hidden bg-slate-100 shrink-0">
          <img
            src={urlFoto}
            alt={producto.nombre}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out select-none"
          />

          {/* Badge de Categoría en la esquina superior izquierda */}
          {producto.categoriaNombre && (
            <span className="absolute top-2.5 left-2.5 z-10 bg-slate-900/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
              {producto.categoriaNombre}
            </span>
          )}

          {/* Badges en la esquina superior derecha */}
          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1">
            {badgeTexto && (
              <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md animate-in fade-in ${obtenerEstiloBadge(badgeTexto)}`}>
                {iconoRepresentativo && (
                  <AppIcon name={iconoRepresentativo} size={11} className="shrink-0" />
                )}
                <span>{badgeTexto}</span>
              </span>
            )}
            {porcentajeDescuento && !badgeTexto && (
              <span className="inline-flex items-center gap-1 bg-[#d97786] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md animate-in fade-in">
                <Tag className="w-3 h-3 shrink-0" />
                <span>{porcentajeDescuento}% OFF</span>
              </span>
            )}
            {esUltimasUnidades && (
              <span className="inline-flex items-center gap-1 bg-amber-600/90 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span>Últimas unid.</span>
              </span>
            )}
            {esNuevoIngreso && !badgeTexto && (
              <span className="inline-flex items-center gap-1 bg-indigo-600/90 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                <Sparkles className="w-3 h-3 shrink-0" />
                <span>Nuevo ingreso</span>
              </span>
            )}
          </div>

          {/* Indicador sutil de vista rápida en hover para pantallas de escritorio */}
          <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-bold shadow-md">
              <Eye className="w-3.5 h-3.5" />
              Ver detalle
            </span>
          </div>
        </div>

        {/* Textos del Producto: Nombre y Detalle */}
        <div className="p-3 sm:p-4 space-y-1.5 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {esDestacado && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500 shrink-0" />
                <span>Destacado</span>
              </span>
            )}
            {esNuevoIngreso && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-1.5 py-0.5 rounded">
                <Sparkles className="w-3 h-3 text-indigo-600 shrink-0" />
                <span>Novedad</span>
              </span>
            )}
            {esUltimasUnidades && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded">
                <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                <span>Stock limitado</span>
              </span>
            )}
          </div>

          <h3 className="font-heading font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-[#b34f60] transition-colors">
            {producto.nombre}
          </h3>

          <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {producto.detalle}
          </p>
        </div>
      </div>

      {/* Contenedor Inferior: Precio + Aclaración y Botón de Consulta */}
      <div className="p-3 sm:p-4 pt-0 sm:pt-0 mt-auto">
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
          
          {/* Fila de Precio y Botón CTA */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-heading text-base sm:text-lg lg:text-xl font-black text-slate-900 tracking-tight">
                  $ {precioFormateado}
                </span>
                {producto.precioAnterior && (
                  <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                    ${producto.precioAnterior.toLocaleString('es-AR')}
                  </span>
                )}
                {porcentajeDescuento && (
                  <span className="text-[10px] font-black text-[#b34f60] bg-rose-50 px-1 py-0.2 rounded">
                    -{porcentajeDescuento}%
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#8b4f58] tracking-tight">
                Precio contado/transf.
              </span>
            </div>

            {/* Botón CTA sin icono de WhatsApp, texto estricto 'Consultar producto' y fondo rosado suave natural */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Consultar disponibilidad de ${producto.nombre}`}
              className="inline-flex items-center justify-center py-2 px-3 sm:px-3.5 rounded-xl border border-[#eed0d5] bg-[#fbf0f2] hover:bg-[#f5dde2] text-[#6e2e38] font-bold text-[11px] sm:text-xs shadow-2xs hover:shadow-xs hover:scale-[1.02] active:scale-95 transition-all duration-200 ease-out min-h-[40px] touch-manipulation relative z-10 cursor-pointer select-none shrink-0"
            >
              <span>Consultar producto</span>
            </a>
          </div>

          {/* Aclaración con icono vectorial Info */}
          <div className="p-1.5 px-2 rounded-lg bg-slate-50 border border-slate-100/80 text-[10px] text-slate-500 leading-tight flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Abonando en efectivo, débito o transferencia bancaria en el local.</span>
          </div>

        </div>
      </div>
    </Card>
  );
}

