'use client';

import React, { useEffect } from 'react';
import { Producto } from '@/types/catalogo';
import { DATOS_LIBRERIA_MOTIVOS } from '@/lib/mock-data';
import { getProductWhatsAppLink } from '@/lib/whatsapp';
import { X, Tag, BookOpen, PenTool, Palette, Briefcase, Ruler, Gift, ShieldCheck } from 'lucide-react';

interface ProductModalProps {
  producto: Producto | null;
  onCerrar: () => void;
}

export function ProductModal({ producto, onCerrar }: ProductModalProps) {
  // Manejo de tecla Escape y bloqueo de scroll de fondo
  useEffect(() => {
    if (!producto) return;

    const manejarTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', manejarTecla);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', manejarTecla);
    };
  }, [producto, onCerrar]);

  if (!producto) return null;

  const whatsappUrl = getProductWhatsAppLink(
    producto,
    DATOS_LIBRERIA_MOTIVOS.telefonoWhatsApp
  );

  const obtenerIcono = () => {
    switch (producto.categoriaId) {
      case 'escolar':
        return <BookOpen className="w-16 h-16 text-blue-600/70" />;
      case 'arte':
        return <Palette className="w-16 h-16 text-rose-500/70" />;
      case 'oficina':
        return <Briefcase className="w-16 h-16 text-slate-600/70" />;
      case 'tecnico':
        return <Ruler className="w-16 h-16 text-cyan-600/70" />;
      case 'regaleria':
        return <Gift className="w-16 h-16 text-emerald-600/70" />;
      default:
        return <PenTool className="w-16 h-16 text-indigo-600/70" />;
    }
  };

  const urlFoto = producto.fotoProducto || producto.foto;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-producto-titulo"
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onCerrar}
    >
      {/* Contenedor del Modal / Bottom Sheet en Mobile */}
      <div 
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado con Botón Cerrar */}
        <div className="relative w-full aspect-4/3 sm:aspect-16/10 bg-slate-100 overflow-hidden flex items-center justify-center">
          {urlFoto ? (
            <img 
              src={urlFoto} 
              alt={producto.nombre} 
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-100 flex flex-col items-center justify-center p-6">
              <div className="w-24 h-24 rounded-3xl bg-white/90 backdrop-blur-xs shadow-md border border-white/60 flex items-center justify-center mb-2">
                {obtenerIcono()}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Librería Motivos • Guaymallén
              </span>
            </div>
          )}

          {/* Botón Cerrar */}
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar detalle de producto"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges de Categoría y Oferta / Novedad */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            {producto.categoriaNombre && (
              <span className="bg-slate-900/85 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
                {producto.categoriaNombre}
              </span>
            )}
            {producto.badge === 'OFERTA' && (
              <span className="bg-rose-600 text-white text-xs font-black uppercase px-2.5 py-1 rounded-full shadow-xs">
                OFERTA
              </span>
            )}
            {producto.badge === 'NOVEDAD' && (
              <span className="bg-blue-600 text-white text-xs font-black uppercase px-2.5 py-1 rounded-full shadow-xs">
                NOVEDAD
              </span>
            )}
          </div>
        </div>

        {/* Cuerpo del Detalle */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div>
            <h3 
              id="modal-producto-titulo"
              className="font-heading text-lg sm:text-xl font-bold text-slate-900 leading-snug"
            >
              {producto.nombre}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {producto.detalle}
            </p>
          </div>

          {/* Beneficios de compra local */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Stock confirmado y retiro inmediato en Guaymallén.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Podés pagar en el local con efectivo, débito o transferencia.</span>
            </div>
          </div>

          {/* Bloque de Precio con Aclaración Detallada */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Precio de referencia:
              </span>
              <div className="flex items-baseline gap-2">
                {producto.precioAnterior && (
                  <span className="text-xs text-slate-400 line-through">
                    ${producto.precioAnterior.toLocaleString('es-AR')}
                  </span>
                )}
                <span className="font-heading text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  $ {producto.precio.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            {/* Aclaración de Precio contado / transferencia */}
            <div className="p-2.5 rounded-xl bg-pink-50/70 border border-pink-100 text-[11px] sm:text-xs text-pink-950 flex items-start gap-2">
              <span className="font-bold text-rose-700 shrink-0">ℹ️ Aclaración:</span>
              <span className="leading-relaxed">
                <strong>«Precio contado/transf.»</strong>: valor especial abonando en efectivo, tarjeta de débito o transferencia bancaria directa en nuestro local de Guaymallén.
              </span>
            </div>
          </div>

          {/* Botón CTA sin icono de WhatsApp, texto estricto 'Consultar producto' y fondo rosado suave natural */}
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Consultar disponibilidad de ${producto.nombre}`}
              className="w-full inline-flex items-center justify-center py-3.5 px-4 rounded-2xl bg-[#fcecef] hover:bg-[#f9dbe1] text-[#6e2e38] font-extrabold text-sm sm:text-base border border-pink-200/90 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 min-h-[48px] cursor-pointer select-none"
            >
              <span>Consultar producto</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
