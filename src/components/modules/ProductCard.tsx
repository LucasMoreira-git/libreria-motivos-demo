'use client';

import React from 'react';
import { Producto } from '@/types/catalogo';
import { DATOS_LIBRERIA_MOTIVOS } from '@/lib/mock-data';
import { getProductWhatsAppLink } from '@/lib/whatsapp';
import { Card } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface ProductCardProps {
  producto: Producto;
  onVerDetalle?: (producto: Producto) => void;
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

  return (
    <Card className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200/90 hover:border-rose-300 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out h-full">
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
        {/* Contenedor con altura fija h-[220px] lg:h-[260px] y foto real simulada con object-cover */}
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

          {/* Badges absolutos superpuestos (OFERTA / NOVEDAD) en la esquina superior derecha */}
          {producto.badge === 'OFERTA' && (
            <span className="absolute top-2.5 right-2.5 z-10 bg-rose-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md animate-in fade-in">
              OFERTA
            </span>
          )}
          {producto.badge === 'NOVEDAD' && (
            <span className="absolute top-2.5 right-2.5 z-10 bg-blue-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md animate-in fade-in">
              NOVEDAD
            </span>
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
        <div className="p-3 sm:p-4 space-y-1.5 flex-1">
          <h3 className="font-heading font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-rose-600 transition-colors">
            {producto.nombre}
          </h3>

          <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {producto.detalle}
          </p>
        </div>
      </div>

      {/* Contenedor Inferior: Precio + Aclaración y Botón de Consulta */}
      <div className="p-3 sm:p-4 pt-0 sm:pt-0 mt-auto">
        <div className="pt-2.5 border-t border-slate-100 flex flex-col gap-2.5">
          
          {/* Bloque de Precio con Aclaración Contextual */}
          <div className="flex flex-col">
            <div className="flex items-baseline justify-between gap-1.5">
              <span className="font-heading text-base sm:text-lg lg:text-xl font-black text-slate-900 tracking-tight">
                $ {precioFormateado}
              </span>
              {producto.precioAnterior && (
                <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                  ${producto.precioAnterior.toLocaleString('es-AR')}
                </span>
              )}
            </div>

            {/* Aclaración de qué significa Precio contado/transf. */}
            <div className="mt-1 flex items-start gap-1 text-[10px] sm:text-[11px] text-slate-500 leading-tight">
              <span className="font-semibold text-slate-700 shrink-0">Precio contado/transf.:</span>
              <span>Abonando en efectivo, débito o transferencia bancaria en el local.</span>
            </div>
          </div>

          {/* Botón CTA sin icono de WhatsApp, texto estricto 'Consultar producto' y fondo rosado suave natural */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Consultar disponibilidad de ${producto.nombre}`}
            className="w-full inline-flex items-center justify-center py-2.5 px-3 rounded-xl border border-pink-200/90 bg-[#fcecef] hover:bg-[#f9dbe1] text-[#6e2e38] font-bold text-xs sm:text-sm shadow-2xs hover:shadow-xs hover:scale-[1.01] active:scale-95 transition-all duration-200 ease-out min-h-[44px] touch-manipulation relative z-10 cursor-pointer select-none"
          >
            <span>Consultar producto</span>
          </a>

        </div>
      </div>
    </Card>
  );
}
