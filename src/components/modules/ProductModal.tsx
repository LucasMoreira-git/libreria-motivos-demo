'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Producto } from '@/types/catalogo';
import { DATOS_LIBRERIA_MOTIVOS } from '@/lib/mock-data';
import { getProductWhatsAppLink } from '@/lib/whatsapp';
import { useConsulta } from '@/context/ConsultaContext';
import {
  X,
  Tag,
  BookOpen,
  PenTool,
  Palette,
  Briefcase,
  Ruler,
  Gift,
  ShieldCheck,
  Star,
  AlertTriangle,
  Sparkles,
  CreditCard,
  Plus,
  Check,
  ArrowRight,
} from 'lucide-react';
import { AppIcon } from '@/lib/icon-registry';

interface ProductModalProps {
  producto: Producto | null;
  onCerrar: () => void;
}

export function ProductModal({ producto, onCerrar }: ProductModalProps) {
  const { estaEnLista, toggleProducto } = useConsulta();
  const [montado, setMontado] = useState(false);
  const [recienSumado, setRecienSumado] = useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  // Reset microconfirmación al abrir/cambiar de producto
  useEffect(() => {
    setRecienSumado(false);
  }, [producto?.id]);

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

  if (!montado || !producto) return null;

  const enLista = estaEnLista(producto.id);

  const handleToggleLista = () => {
    const estabaEnLista = enLista;
    toggleProducto(producto);
    setRecienSumado(!estabaEnLista);
  };

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

  const renderBadgeDestaque = () => {
    if (badgeTexto) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-[#d97786] text-white text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
          <AppIcon
            name={producto.iconoProducto || producto.icono || 'tag'}
            size={12}
            className="shrink-0"
          />
          <span>{badgeTexto}</span>
        </span>
      );
    }
    if (porcentajeDescuento) {
      return (
        <span className="inline-flex items-center gap-1 bg-[#d97786] text-white text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
          <Tag className="w-3.5 h-3.5 shrink-0" />
          <span>{porcentajeDescuento}% OFF</span>
        </span>
      );
    }
    if (esUltimasUnidades) {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-600/95 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Stock limitado</span>
        </span>
      );
    }
    if (esNuevoIngreso) {
      return (
        <span className="inline-flex items-center gap-1 bg-indigo-600/95 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>Novedad</span>
        </span>
      );
    }
    if (esDestacado) {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
          <Star className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
          <span>Destacado</span>
        </span>
      );
    }
    return null;
  };

  const modalMarkup = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-producto-titulo"
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 lg:p-8 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onCerrar}
    >
      {/* Contenedor Horizontal 2 Columnas en Desktop / Bottom Sheet en Móvil */}
      <div
        className="w-full md:max-w-3xl lg:max-w-4xl bg-white rounded-t-3xl md:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[92vh] md:max-h-[85vh] animate-in slide-in-from-bottom md:slide-in-from-bottom-0 md:fade-in md:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Columna Izquierda: Foto del Producto */}
        <div className="md:col-span-5 relative w-full h-56 sm:h-64 md:h-auto md:min-h-[380px] bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
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

          {/* Botón Cerrar en Móvil */}
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar detalle de producto"
            className="md:hidden absolute top-3 right-3 w-10 h-10 rounded-full bg-slate-900/65 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges limpios sobre la imagen */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-1.5">
            {producto.categoriaNombre && (
              <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
                {producto.categoriaNombre}
              </span>
            )}
            {renderBadgeDestaque()}
          </div>
        </div>

        {/* Columna Derecha: Información Completa y Acciones */}
        <div className="md:col-span-7 p-5 sm:p-6 md:p-7 overflow-y-auto flex flex-col justify-between gap-4">
          <div className="space-y-4">
            {/* Encabezado: Título + Botón Cerrar Desktop */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3
                  id="modal-producto-titulo"
                  className="font-heading text-lg sm:text-xl md:text-2xl font-bold text-slate-900 leading-snug"
                >
                  {producto.nombre}
                </h3>
              </div>

              <button
                type="button"
                onClick={onCerrar}
                aria-label="Cerrar detalle de producto"
                className="hidden md:flex w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 items-center justify-center transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Descripción completa sin recorte */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {producto.detalle}
            </p>

            {/* Bloque único conciso (Retiro + Medios de Pago) */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Retiro en el día en Guaymallén{' '}
                  <span className="text-slate-500">(sujeto a disponibilidad)</span>.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CreditCard className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Precio contado/transf. válido en efectivo, débito o transferencia.
                  Crédito en el local (consultar cuotas por WhatsApp).
                </span>
              </div>
            </div>
          </div>

          {/* Bloque Inferior: Precio + Botones equilibrados lado a lado */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <div>
                <span className="block text-xs text-slate-500 font-medium">
                  Precio contado / transf.
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                {producto.precioAnterior && (
                  <span className="text-xs sm:text-sm text-slate-400 line-through">
                    ${producto.precioAnterior.toLocaleString('es-AR')}
                  </span>
                )}
                <span className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  $ {producto.precio.toLocaleString('es-AR')}
                </span>
                {porcentajeDescuento && (
                  <span className="text-xs font-black text-[#b34f60] bg-rose-50 px-2 py-0.5 rounded-md">
                    -{porcentajeDescuento}%
                  </span>
                )}
              </div>
            </div>

            {/* Botones lado a lado: Protagonista rosa de marca + Secundario outline */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Consultar disponibilidad de ${producto.nombre}`}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#d97786] hover:bg-[#c46372] text-white font-extrabold text-sm shadow-sm hover:shadow-md active:scale-95 transition-all duration-150 min-h-[46px] cursor-pointer select-none"
              >
                <span>Consultar producto</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>

              <button
                type="button"
                onClick={handleToggleLista}
                aria-pressed={enLista}
                className={`inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-bold text-sm border active:scale-95 transition-all duration-150 min-h-[46px] cursor-pointer select-none shrink-0 ${
                  enLista
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100/70'
                    : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {enLista ? (
                  <>
                    <Check className="w-4 h-4 shrink-0" />
                    <span>En lista</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>Sumar a lista</span>
                  </>
                )}
              </button>
            </div>

            {/* Microconfirmación al sumar desde el modal */}
            {recienSumado && enLista && (
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-800 animate-in fade-in slide-in-from-top-1 duration-150">
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Sumado a tu lista de consulta</span>
                </span>
                <button
                  type="button"
                  onClick={onCerrar}
                  className="font-bold underline hover:text-emerald-950 cursor-pointer shrink-0"
                >
                  Seguir viendo productos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalMarkup, document.body);
}
