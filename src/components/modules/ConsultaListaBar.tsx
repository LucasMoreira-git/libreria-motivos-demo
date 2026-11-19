'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useConsulta } from '@/context/ConsultaContext';
import { DATOS_LIBRERIA_MOTIVOS, DEFAULT_BRAND_IMAGE } from '@/lib/mock-data';
import { getMultiProductWhatsAppLink } from '@/lib/whatsapp';
import {
  ClipboardList,
  Trash2,
  Plus,
  Minus,
  Send,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

export function ConsultaListaBar() {
  const {
    items,
    totalUnidades,
    actualizarCantidad,
    quitarProducto,
    limpiarLista,
  } = useConsulta();

  // Abierto por defecto para mostrar los productos de una sin necesidad de desplegar
  const [minimizado, setMinimizado] = useState(false);
  const [pulsoNuevo, setPulsoNuevo] = useState(false);
  const prevTotalRef = useRef(totalUnidades);

  useEffect(() => {
    if (totalUnidades > prevTotalRef.current) {
      setMinimizado(false);
      setPulsoNuevo(true);
      const t = setTimeout(() => setPulsoNuevo(false), 500);
      prevTotalRef.current = totalUnidades;
      return () => clearTimeout(t);
    }
    prevTotalRef.current = totalUnidades;
  }, [totalUnidades]);

  if (items.length === 0) return null;

  const totalEstimado = items.reduce(
    (acc, { producto, cantidad }) => acc + producto.precio * cantidad,
    0
  );

  const whatsappUrl = getMultiProductWhatsAppLink(
    items,
    DATOS_LIBRERIA_MOTIVOS.telefonoWhatsApp
  );

  return (
    <aside
      aria-label="Lista de consulta rápida por WhatsApp"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:bottom-5 sm:right-5 sm:w-[360px] z-40 animate-in slide-in-from-bottom-4 fade-in duration-200"
    >
      <div
        className={`bg-white/95 backdrop-blur-md rounded-3xl border border-[#f2d3d8] shadow-xl shadow-purple-950/10 overflow-hidden transition-transform duration-200 ${
          pulsoNuevo ? 'scale-[1.02] ring-2 ring-[#d97786]/35' : 'scale-100'
        }`}
      >
        {/* Cabecera Clara en Paleta Pastel de la Librería */}
        <div className="px-4 py-3 bg-gradient-to-r from-[#fef5f6] via-[#fbf0f2] to-[#f3ecfa] border-b border-[#f2d3d8]/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-9 h-9 rounded-2xl bg-white text-[#d97786] border border-[#f2d3d8] shadow-2xs flex items-center justify-center shrink-0">
              <ClipboardList className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#d97786] text-white font-black text-[10px] flex items-center justify-center border-2 border-white shadow-2xs">
                {totalUnidades}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-heading text-xs sm:text-sm font-extrabold text-purple-950 leading-tight truncate flex items-center gap-1">
                <span>Tu Lista de Consulta</span>
                <Sparkles className="w-3 h-3 text-[#d97786] shrink-0" />
              </p>
              <p className="text-[11px] text-slate-500 leading-tight">
                {items.length} {items.length === 1 ? 'artículo elegido' : 'artículos elegidos'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={limpiarLista}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
              title="Vaciar lista"
            >
              Vaciar
            </button>
            <button
              type="button"
              onClick={() => setMinimizado(!minimizado)}
              aria-label={minimizado ? 'Expandir lista' : 'Minimizar lista'}
              className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white border border-purple-200/70 text-purple-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              {minimizado ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Detalle Visible Directamente (Sin tener que tocar ninguna flecha) */}
        {!minimizado && (
          <div className="max-h-56 sm:max-h-64 overflow-y-auto divide-y divide-slate-100 bg-white">
            {items.map(({ producto, cantidad }) => {
              const foto = producto.fotoProducto || producto.foto || DEFAULT_BRAND_IMAGE;
              return (
                <div
                  key={producto.id}
                  className="px-3.5 py-2.5 flex items-center justify-between gap-2.5 hover:bg-[#fef5f6]/40 transition-colors animate-in slide-in-from-right-4 fade-in duration-200"
                >
                  <img
                    src={foto}
                    alt={producto.nombre}
                    className={`w-10 h-10 rounded-xl border border-slate-200/80 shrink-0 ${
                      foto === DEFAULT_BRAND_IMAGE ? 'object-contain bg-[#fdfbf7] p-0.5' : 'object-cover'
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-heading font-bold text-xs text-slate-900 truncate leading-snug">
                      {producto.nombre}
                    </p>
                    <p className="text-[11px] text-[#8b4f58] font-mono font-semibold">
                      $ {producto.precio.toLocaleString('es-AR')}
                      {cantidad > 1 && (
                        <span className="text-slate-400 font-normal ml-1">
                          × {cantidad} = $ {(producto.precio * cantidad).toLocaleString('es-AR')}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => actualizarCantidad(producto.id, -1)}
                      aria-label={`Restar cantidad de ${producto.nombre}`}
                      className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-mono text-xs font-bold text-slate-900">
                      {cantidad}
                    </span>
                    <button
                      type="button"
                      onClick={() => actualizarCantidad(producto.id, 1)}
                      aria-label={`Sumar cantidad de ${producto.nombre}`}
                      className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => quitarProducto(producto.id)}
                      aria-label={`Quitar ${producto.nombre}`}
                      className="w-7 h-7 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors ml-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Total Estimado + Acción Principal de Envío por WhatsApp */}
        <div className="p-3 bg-slate-50/80 border-t border-slate-100 space-y-2.5">
          <div className="flex items-baseline justify-between px-1">
            <span className="text-xs font-semibold text-slate-600">
              Total estimado{' '}
              <span className="text-[10px] font-normal text-slate-400">(contado / transf.)</span>
            </span>
            <span className="font-heading text-sm sm:text-base font-black text-purple-950 tracking-tight">
              $ {totalEstimado.toLocaleString('es-AR')}
            </span>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Enviar consulta de ${items.length} productos por WhatsApp`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs sm:text-sm shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 min-h-[44px] touch-manipulation cursor-pointer"
          >
            <Send className="w-4 h-4 shrink-0" />
            <span>Consultar todo por WhatsApp ({totalUnidades})</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
