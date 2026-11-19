'use client';

import React, { useState } from 'react';
import { Producto } from '@/types/catalogo';
import { DATOS_LIBRERIA_MOTIVOS, DEFAULT_BRAND_IMAGE } from '@/lib/mock-data';
import { getProductWhatsAppLink } from '@/lib/whatsapp';
import { useConsulta } from '@/context/ConsultaContext';
import { Card } from '@/components/ui/card';
import { Eye, Tag, AlertTriangle, Sparkles, Star, Plus, Check } from 'lucide-react';
import { AppIcon } from '@/lib/icon-registry';

interface ProductCardProps {
  producto: Producto;
  onVerDetalle?: (producto: Producto) => void;
  ocultarAccionLista?: boolean;
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

export function ProductCard({
  producto,
  onVerDetalle,
  ocultarAccionLista = false,
}: ProductCardProps) {
  const { estaEnLista, toggleProducto } = useConsulta();
  const enLista = !ocultarAccionLista && estaEnLista(producto.id);
  const [animacionSumado, setAnimacionSumado] = useState(false);

  const handleToggleLista = () => {
    const yaEstaba = enLista;
    toggleProducto(producto);
    if (!yaEstaba) {
      setAnimacionSumado(true);
      setTimeout(() => setAnimacionSumado(false), 1300);
    }
  };

  const urlFoto =
    producto.fotoProducto ||
    producto.foto ||
    DEFAULT_BRAND_IMAGE;
  const esLogoPorDefecto = urlFoto === DEFAULT_BRAND_IMAGE;

  const whatsappUrl = getProductWhatsAppLink(
    producto,
    DATOS_LIBRERIA_MOTIVOS.telefonoWhatsApp
  );

  const precioFormateado = producto.precio.toLocaleString('es-AR');
  const tieneDescuento = Boolean(
    producto.precioAnterior && producto.precioAnterior > producto.precio
  );
  const porcentajeDescuento =
    tieneDescuento && producto.precioAnterior
      ? Math.round(
          ((producto.precioAnterior - producto.precio) / producto.precioAnterior) *
            100
        )
      : null;

  const badgeTexto = producto.badge || producto.badgeProducto;
  const esUltimasUnidades = Boolean(
    producto.ultimasUnidades || producto.ultimasUnidadesProducto
  );
  const esNuevoIngreso = Boolean(
    producto.nuevoIngreso || producto.nuevoIngresoProducto
  );
  const esDestacado = Boolean(
    producto.destacado || producto.destacadoProducto
  );

  // Icono representativo del producto
  const iconoRepresentativo =
    producto.iconoProducto ||
    producto.icono ||
    (esDestacado
      ? 'star'
      : producto.enOferta || producto.enOfertaProducto || tieneDescuento
        ? 'tag'
        : esUltimasUnidades
          ? 'alert-triangle'
          : esNuevoIngreso
            ? 'sparkles'
            : null);

  // Máximo 1 etiqueta de destaque sobre la imagen para mantener la grilla limpia y sin ruido visual
  const renderHighlightBadge = () => {
    if (badgeTexto) {
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md animate-in fade-in ${obtenerEstiloBadge(badgeTexto)}`}
        >
          {iconoRepresentativo && (
            <AppIcon name={iconoRepresentativo} size={11} className="shrink-0" />
          )}
          <span>{badgeTexto}</span>
        </span>
      );
    }

    if (porcentajeDescuento) {
      return (
        <span className="inline-flex items-center gap-1 bg-[#d97786] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md animate-in fade-in">
          <Tag className="w-3 h-3 shrink-0" />
          <span>{porcentajeDescuento}% OFF</span>
        </span>
      );
    }

    if (esUltimasUnidades) {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-600/95 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          <span>Stock limitado</span>
        </span>
      );
    }

    if (esNuevoIngreso) {
      return (
        <span className="inline-flex items-center gap-1 bg-indigo-600/95 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
          <Sparkles className="w-3 h-3 shrink-0" />
          <span>Novedad</span>
        </span>
      );
    }

    if (esDestacado) {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-400/95 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
          <Star className="w-3 h-3 fill-slate-950 shrink-0" />
          <span>Destacado</span>
        </span>
      );
    }

    return null;
  };

  return (
    <Card
      className={`group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border transition-all duration-300 ease-out h-full ${
        enLista
          ? 'border-[#d97786] ring-2 ring-[#d97786]/25 shadow-md'
          : 'border-slate-200/90 hover:border-[#eed0d5] shadow-2xs hover:shadow-lg hover:-translate-y-1'
      }`}
    >
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
        {/* Contenedor de Imagen */}
        <div
          className={`relative w-full h-[200px] sm:h-[220px] lg:h-[245px] overflow-hidden shrink-0 ${
            esLogoPorDefecto ? 'bg-[#fdfbf7]' : 'bg-slate-100'
          }`}
        >
          <img
            src={urlFoto}
            alt={producto.nombre}
            loading="lazy"
            className={`w-full h-full object-center group-hover:scale-105 transition-transform duration-300 ease-out select-none ${
              esLogoPorDefecto ? 'object-contain p-3' : 'object-cover'
            }`}
          />

          {/* Única etiqueta destacada en esquina superior derecha */}
          <div className="absolute top-2.5 right-2.5 z-10">
            {renderHighlightBadge()}
          </div>

          {/* Animación flotante de confirmación al sumar a la lista */}
          {animacionSumado && (
            <div className="absolute inset-x-3 bottom-3 z-20 flex justify-center pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-lg animate-added-pop">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>¡Sumado a tu lista!</span>
              </span>
            </div>
          )}

          {/* Indicador sutil de vista rápida en hover para pantallas de escritorio */}
          <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-bold shadow-md">
              <Eye className="w-3.5 h-3.5" />
              Ver detalle
            </span>
          </div>
        </div>

        {/* Textos del Producto: Nombre y Detalle */}
        <div className="p-3 sm:p-4 space-y-1 flex-1">
          <h3 className="font-heading font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-[#b34f60] transition-colors">
            {producto.nombre}
          </h3>

          <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {producto.detalle}
          </p>
        </div>
      </div>

      {/* Contenedor Inferior Limpio: Precio + Acciones */}
      <div className="p-3 sm:p-4 pt-0 sm:pt-0 mt-auto">
        <div className="pt-2.5 border-t border-slate-100 flex flex-col gap-2.5">
          {/* Bloque de Precio y Modalidad Contado/Transf. única */}
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
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#8b4f58] tracking-tight">
              Contado / transf. en local
            </span>
          </div>

          {/* Fila de Acciones: Consultar Directo + Sumar a Lista */}
          <div className="flex items-center gap-1.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Consultar disponibilidad de ${producto.nombre}`}
              className="flex-1 inline-flex items-center justify-center py-2 px-2.5 sm:px-3 rounded-xl border border-[#eed0d5] bg-[#fbf0f2] hover:bg-[#f5dde2] text-[#6e2e38] font-bold text-[11px] sm:text-xs shadow-2xs hover:shadow-xs active:scale-95 transition-all duration-200 ease-out min-h-[40px] touch-manipulation cursor-pointer select-none truncate"
            >
              <span className="truncate">Consultar</span>
            </a>

            {!ocultarAccionLista && (
              <button
                type="button"
                onClick={handleToggleLista}
                aria-pressed={enLista}
                aria-label={
                  enLista
                    ? `Quitar ${producto.nombre} de la lista de consulta`
                    : `Sumar ${producto.nombre} a la lista de consulta`
                }
                title={enLista ? 'En tu lista de consulta' : 'Sumar a lista de consulta'}
                className={`inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl font-bold text-[11px] sm:text-xs min-h-[40px] min-w-[40px] active:scale-95 transition-all duration-200 ease-out touch-manipulation cursor-pointer select-none shrink-0 border ${
                  enLista
                    ? 'bg-[#d97786] text-white border-[#d97786] shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                } ${animacionSumado ? 'scale-105 ring-2 ring-emerald-400/50' : ''}`}
              >
                {enLista ? (
                  <>
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">En lista</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">Lista</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
