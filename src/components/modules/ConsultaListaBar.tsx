'use client';

import React, { useState } from 'react';
import { useConsulta } from '@/context/ConsultaContext';
import { DATOS_LIBRERIA_MOTIVOS } from '@/lib/mock-data';
import { getMultiProductWhatsAppLink } from '@/lib/whatsapp';
import {
  ClipboardList,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Minus,
  Send,
  X,
} from 'lucide-react';

export function ConsultaListaBar() {
  const {
    items,
    totalUnidades,
    actualizarCantidad,
    quitarProducto,
    limpiarLista,
  } = useConsulta();

  const [expandido, setExpandido] = useState(false);

  if (items.length === 0) return null;

  const whatsappUrl = getMultiProductWhatsAppLink(
    items,
    DATOS_LIBRERIA_MOTIVOS.telefonoWhatsApp
  );

  return (
    <aside
      aria-label="Lista rápida de consulta por WhatsApp"
      className="fixed bottom-4 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:w-full sm:max-w-xl z-50 animate-in slide-in-from-bottom-4 fade-in duration-200"
    >
      {/* Panel Expandible de Artículos Seleccionados */}
      {expandido && (
        <div className="mb-2.5 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#b34f60]" />
              <span className="font-heading text-xs sm:text-sm font-bold text-slate-900">
                Tu lista de consulta ({items.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  limpiarLista();
                  setExpandido(false);
                }}
                className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              >
                Vaciar todo
              </button>
              <button
                type="button"
                onClick={() => setExpandido(false)}
                aria-label="Cerrar detalle de lista"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
            {items.map(({ producto, cantidad }) => (
              <div
                key={producto.id}
                className="px-4 py-2.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-heading font-bold text-xs text-slate-900 truncate">
                    {producto.nombre}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Ref: $ {producto.precio.toLocaleString('es-AR')} c/u
                  </p>
                </div>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => actualizarCantidad(producto.id, -1)}
                    aria-label={`Restar cantidad de ${producto.nombre}`}
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-mono text-xs font-bold text-slate-900">
                    {cantidad}
                  </span>
                  <button
                    type="button"
                    onClick={() => actualizarCantidad(producto.id, 1)}
                    aria-label={`Sumar cantidad de ${producto.nombre}`}
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => quitarProducto(producto.id)}
                    aria-label={`Quitar ${producto.nombre} de la lista`}
                    className="w-8 h-8 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 flex items-center justify-center transition-colors ml-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Barra Flotante Compacta */}
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-2.5 sm:px-4 sm:py-3 shadow-2xl border border-slate-700/80 flex items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => setExpandido(!expandido)}
          className="flex items-center gap-2.5 text-left min-w-0 flex-1 py-1 px-1.5 rounded-xl hover:bg-white/10 transition-colors min-h-[44px] cursor-pointer"
        >
          <div className="relative w-9 h-9 rounded-xl bg-[#d97786] text-white flex items-center justify-center shrink-0 shadow-xs">
            <ClipboardList className="w-4 h-4" />
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center border-2 border-slate-900">
              {totalUnidades}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-heading text-xs sm:text-sm font-bold text-white leading-tight truncate">
              Lista de consulta
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-300 flex items-center gap-1">
              <span>{items.length} {items.length === 1 ? 'producto' : 'productos'}</span>
              {expandido ? (
                <ChevronDown className="w-3 h-3 shrink-0" />
              ) : (
                <ChevronUp className="w-3 h-3 shrink-0" />
              )}
            </p>
          </div>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Consultar ${items.length} productos juntos por WhatsApp`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 min-h-[44px] shrink-0 touch-manipulation cursor-pointer"
        >
          <Send className="w-4 h-4 shrink-0" />
          <span className="hidden xs:inline">Consultar lista</span>
          <span className="xs:hidden">Enviar ({totalUnidades})</span>
        </a>
      </div>
    </aside>
  );
}
