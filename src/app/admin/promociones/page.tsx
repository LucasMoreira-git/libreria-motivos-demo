'use client';

import React, { useState, useRef } from 'react';
import {
  Tag,
  Plus,
  Search,
  Pencil,
  EyeOff,
  RotateCcw,
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Calendar,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Eye,
  Percent,
  Clock,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useAdminFeedback } from '@/context/AdminFeedbackContext';
import { PromocionAdmin } from '@/types/admin';
import {
  DEFAULT_BRAND_IMAGE,
  aFormatoFechaInput,
  formatearFechaLegible,
} from '@/lib/mock-data';
import { DatePickerAR } from '@/components/ui/DatePickerAR';

interface AvisoImagen {
  tipo: 'optimo' | 'advertencia';
  mensaje: string;
}

function obtenerFechaHoyIso(sumarDias = 0): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + sumarDias);
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function PromocionesAdminPage() {
  const {
    promociones,
    crearPromocion,
    editarPromocion,
    bajaLogicaPromocion,
    reactivarPromocion,
  } = useAdmin();
  const { notificar, confirmar } = useAdminFeedback();

  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<'todos' | 'visibles' | 'ocultas'>('todos');

  // Modal Formulario
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [promocionSeleccionadaId, setPromocionSeleccionadaId] = useState<string | null>(null);

  // Campos de la promoción
  const [nombrePromocion, setNombrePromocion] = useState('');
  const [detallePromocion, setDetallePromocion] = useState('');
  const [temporadaPromocion, setTemporadaPromocion] = useState('Especial Primavera 2026');
  const [fechaInicioPromocion, setFechaInicioPromocion] = useState('');
  const [fechaFinPromocion, setFechaFinPromocion] = useState('');
  const [descuentoTextoPromocion, setDescuentoTextoPromocion] = useState('20% OFF llevando el combo');
  const [condicionPromocion, setCondicionPromocion] = useState('');
  const [fotoComboPromocion, setFotoComboPromocion] = useState('');
  const [badgeTextoPromocion, setBadgeTextoPromocion] = useState('');
  const [mostrarUrlExterna, setMostrarUrlExterna] = useState(false);
  const [avisoFormatoFoto, setAvisoFormatoFoto] = useState<AvisoImagen | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setPromocionSeleccionadaId(null);
    setNombrePromocion('');
    setDetallePromocion('');
    setTemporadaPromocion('Temporada Escolar');
    setFechaInicioPromocion(obtenerFechaHoyIso(0));
    setFechaFinPromocion(obtenerFechaHoyIso(30));
    setDescuentoTextoPromocion('20% OFF llevando el combo');
    setCondicionPromocion('Válido en efectivo o transferencia hasta agotar stock.');
    setFotoComboPromocion('');
    setBadgeTextoPromocion('Promo Destacada');
    setMostrarUrlExterna(false);
    setAvisoFormatoFoto(null);
    setErrorValidacion(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (promo: PromocionAdmin) => {
    setModoEdicion(true);
    setPromocionSeleccionadaId(promo.idPromocion);
    setNombrePromocion(promo.nombrePromocion);
    setDetallePromocion(promo.detallePromocion);
    setTemporadaPromocion(promo.temporadaPromocion);
    setFechaInicioPromocion(aFormatoFechaInput(promo.fechaInicioPromocion) || obtenerFechaHoyIso(0));
    setFechaFinPromocion(aFormatoFechaInput(promo.fechaFinPromocion) || obtenerFechaHoyIso(30));
    setDescuentoTextoPromocion(promo.descuentoTextoPromocion);
    setCondicionPromocion(promo.condicionPromocion || '');
    setFotoComboPromocion(
      promo.fotoComboPromocion === DEFAULT_BRAND_IMAGE ? '' : (promo.fotoComboPromocion || '')
    );
    setBadgeTextoPromocion(promo.badgeTextoPromocion || '');
    setMostrarUrlExterna(
      Boolean(
        promo.fotoComboPromocion &&
          promo.fotoComboPromocion !== DEFAULT_BRAND_IMAGE &&
          promo.fotoComboPromocion.startsWith('http') &&
          !promo.fotoComboPromocion.startsWith('data:image')
      )
    );
    setAvisoFormatoFoto(null);
    setErrorValidacion(null);
    setModalAbierto(true);
  };

  const handleCargarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorValidacion('Por favor seleccioná un archivo de imagen válido (JPG, PNG o WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawData = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const naturalW = img.naturalWidth || img.width;
        const naturalH = img.naturalHeight || img.height;
        const ratio = naturalW / Math.max(naturalH, 1);

        // Evaluación informativa no bloqueante del formato para el banner horizontal
        if (naturalW < 500 || naturalH < 300) {
          setAvisoFormatoFoto({
            tipo: 'advertencia',
            mensaje: `Aviso (${naturalW}×${naturalH} px): la foto tiene baja resolución y podría verse borrosa en pantallas grandes. Podés subirla igual o elegir una más nítida (ideal: 1200×800 px).`,
          });
        } else if (ratio < 1.1) {
          setAvisoFormatoFoto({
            tipo: 'advertencia',
            mensaje: `Aviso (${naturalW}×${naturalH} px): la imagen es vertical o cuadrada y puede recortarse arriba/abajo en el banner horizontal. Podés subirla igual, aunque una foto apaisada luce mejor.`,
          });
        } else if (ratio > 2.4) {
          setAvisoFormatoFoto({
            tipo: 'advertencia',
            mensaje: `Aviso (${naturalW}×${naturalH} px): la imagen es muy ancha y podría recortarse a los costados. Podés usarla igual si te gusta cómo queda en la vista previa.`,
          });
        } else {
          setAvisoFormatoFoto({
            tipo: 'optimo',
            mensaje: `Formato ideal para la portada (${naturalW}×${naturalH} px). Se verá nítida y bien encuadrada.`,
          });
        }

        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = naturalW;
        let height = naturalH;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setFotoComboPromocion(compressed);
        } else {
          setFotoComboPromocion(rawData);
        }
        setErrorValidacion(null);
      };
      img.src = rawData;
    };
    reader.readAsDataURL(file);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    if (!nombrePromocion.trim()) {
      setErrorValidacion('Ingresá un nombre para la promoción.');
      return;
    }

    if (!fechaInicioPromocion || !fechaFinPromocion) {
      setErrorValidacion('Seleccioná las fechas de inicio y fin desde el calendario.');
      return;
    }

    if (fechaFinPromocion < fechaInicioPromocion) {
      setErrorValidacion('La fecha de finalización no puede ser anterior a la fecha de inicio.');
      return;
    }

    const fotoTrim = fotoComboPromocion.trim();
    if (fotoTrim) {
      const lower = fotoTrim.toLowerCase();
      const urlSegura =
        lower.startsWith('https://') ||
        lower.startsWith('http://') ||
        lower.startsWith('/images/') ||
        lower.startsWith('data:image/jpeg;base64,') ||
        lower.startsWith('data:image/png;base64,') ||
        lower.startsWith('data:image/webp;base64,');
      if (!urlSegura) {
        setErrorValidacion('El enlace de la imagen debe comenzar con https:// o cargarse desde tu dispositivo.');
        return;
      }
    }

    const fotoFinal = fotoTrim || DEFAULT_BRAND_IMAGE;

    if (modoEdicion && promocionSeleccionadaId) {
      const promoOriginal = promociones.find((p) => p.idPromocion === promocionSeleccionadaId);
      editarPromocion({
        idPromocion: promocionSeleccionadaId,
        nombrePromocion: nombrePromocion.trim(),
        detallePromocion: detallePromocion.trim(),
        temporadaPromocion: temporadaPromocion.trim(),
        fechaInicioPromocion,
        fechaFinPromocion,
        fechaHoraFinPromocion: fechaFinPromocion,
        descuentoTextoPromocion: descuentoTextoPromocion.trim(),
        condicionPromocion: condicionPromocion.trim(),
        fotoComboPromocion: fotoFinal,
        badgeTextoPromocion: badgeTextoPromocion.trim(),
        fechaHoraBajaPromocion: promoOriginal?.fechaHoraBajaPromocion || null,
      });
      notificar({
        tipo: 'exito',
        titulo: 'Promoción actualizada',
        mensaje: `"${nombrePromocion.trim()}" ya se actualizó en la portada.`,
      });
    } else {
      crearPromocion({
        nombrePromocion: nombrePromocion.trim(),
        detallePromocion: detallePromocion.trim(),
        temporadaPromocion: temporadaPromocion.trim(),
        fechaInicioPromocion,
        fechaFinPromocion,
        fechaHoraFinPromocion: fechaFinPromocion,
        descuentoTextoPromocion: descuentoTextoPromocion.trim(),
        condicionPromocion: condicionPromocion.trim(),
        fotoComboPromocion: fotoFinal,
        badgeTextoPromocion: badgeTextoPromocion.trim(),
      });
      notificar({
        tipo: 'exito',
        titulo: 'Promoción publicada',
        mensaje: `"${nombrePromocion.trim()}" ya está visible en la página principal.`,
      });
    }

    setModalAbierto(false);
  };

  const handleOcultar = async (promo: PromocionAdmin) => {
    const ok = await confirmar({
      titulo: '¿Ocultar esta promoción?',
      mensaje: `"${promo.nombrePromocion}" dejará de verse en la portada, pero podrás volver a mostrarla cuando quieras desde la pestaña Ocultas.`,
      textoConfirmar: 'Sí, ocultar',
      variante: 'peligro',
    });
    if (ok) {
      bajaLogicaPromocion(promo.idPromocion);
      notificar({
        tipo: 'advertencia',
        titulo: 'Promoción oculta',
        mensaje: `"${promo.nombrePromocion}" ya no aparece en la web.`,
      });
    }
  };

  const handleMostrarNuevamente = (promo: PromocionAdmin) => {
    reactivarPromocion(promo.idPromocion);
    notificar({
      tipo: 'exito',
      titulo: 'Promoción visible nuevamente',
      mensaje: `"${promo.nombrePromocion}" volvió a publicarse en la portada.`,
    });
  };

  const promocionesFiltradas = promociones.filter((pr) => {
    if (estadoFiltro === 'visibles' && pr.fechaHoraBajaPromocion) return false;
    if (estadoFiltro === 'ocultas' && !pr.fechaHoraBajaPromocion) return false;

    const q = busqueda.toLowerCase().trim();
    if (!q) return true;
    return (
      pr.nombrePromocion.toLowerCase().includes(q) ||
      pr.temporadaPromocion.toLowerCase().includes(q) ||
      pr.descuentoTextoPromocion.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* 1. Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-orange-600" />
            <span>Promociones</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
              {promocionesFiltradas.length}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Creá, editá y programá los combos y campañas que rotan en la portada de tu página web.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirModalCrear}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 touch-manipulation cursor-pointer shrink-0 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Promoción</span>
        </button>
      </div>

      {/* 2. Barra de Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, temporada o descuento..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 transition-all"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setEstadoFiltro('todos')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              estadoFiltro === 'todos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setEstadoFiltro('visibles')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              estadoFiltro === 'visibles' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Visibles
          </button>
          <button
            type="button"
            onClick={() => setEstadoFiltro('ocultas')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              estadoFiltro === 'ocultas' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Ocultas
          </button>
        </div>
      </div>

      {/* 3. Tabla de Promociones */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/90 text-slate-500 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Promoción</th>
                <th className="py-3 px-4">Temporada</th>
                <th className="py-3 px-4">Descuento</th>
                <th className="py-3 px-4">Vigencia</th>
                <th className="py-3 px-4">Visibilidad</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {promocionesFiltradas.length > 0 ? (
                promocionesFiltradas.map((promo) => {
                  const estaOculta = !!promo.fechaHoraBajaPromocion;

                  return (
                    <tr
                      key={promo.idPromocion}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        estaOculta ? 'bg-rose-50/20 text-slate-500' : 'text-slate-800'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={promo.fotoComboPromocion || DEFAULT_BRAND_IMAGE}
                            alt={promo.nombrePromocion}
                            className={`w-12 h-12 rounded-xl border border-slate-200 shrink-0 ${
                              (promo.fotoComboPromocion || DEFAULT_BRAND_IMAGE) === DEFAULT_BRAND_IMAGE
                                ? 'object-contain bg-[#fdfbf7] p-0.5'
                                : 'object-cover'
                            } ${estaOculta ? 'grayscale opacity-60' : ''}`}
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-heading font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {promo.nombrePromocion}
                            </p>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {promo.detallePromocion}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-xs font-semibold">
                          <Sparkles className="w-3 h-3 text-orange-500" />
                          <span>{promo.temporadaPromocion}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-orange-600">
                        {promo.descuentoTextoPromocion}
                      </td>

                      <td className="py-3 px-4 text-xs font-mono text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {formatearFechaLegible(promo.fechaInicioPromocion) || 'Sin fecha'} al{' '}
                            {formatearFechaLegible(promo.fechaFinPromocion) || 'Sin fecha'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {estaOculta ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            Oculta
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Visible en web
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => abrirModalEditar(promo)}
                            className="p-2 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Editar promoción"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {estaOculta ? (
                            <button
                              type="button"
                              onClick={() => handleMostrarNuevamente(promo)}
                              className="p-2 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                              title="Volver a mostrar en la web"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOcultar(promo)}
                              className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Ocultar de la web"
                            >
                              <EyeOff className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No hay promociones que coincidan con tu búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal con Selector de Fechas, Aviso de Imagen y Vista Previa */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* Cabecera */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-orange-600" />
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {modoEdicion ? 'Editar Promoción' : 'Nueva Promoción de Temporada'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorValidacion && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorValidacion}</span>
              </div>
            )}

            {/* Grid 2 Columnas */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              {/* Formulario */}
              <form
                onSubmit={handleGuardar}
                id="form-promocion"
                className="lg:col-span-7 p-6 space-y-4 text-xs sm:text-sm"
              >
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nombre de la Promoción *
                  </label>
                  <input
                    type="text"
                    required
                    value={nombrePromocion}
                    onChange={(e) => setNombrePromocion(e.target.value)}
                    placeholder="Ej: Combo Escolar Completo 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-orange-600 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Detalle de lo que incluye *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={detallePromocion}
                    onChange={(e) => setDetallePromocion(e.target.value)}
                    placeholder="Ej: Mochila reforzada + cartuchera 2 pisos + cuadernos tapa dura..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-orange-600 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Temporada o Campaña *
                    </label>
                    <input
                      type="text"
                      required
                      value={temporadaPromocion}
                      onChange={(e) => setTemporadaPromocion(e.target.value)}
                      placeholder="Ej: Vuelta al Cole 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-orange-600 focus:bg-white transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Beneficio o Descuento *
                    </label>
                    <input
                      type="text"
                      required
                      value={descuentoTextoPromocion}
                      onChange={(e) => setDescuentoTextoPromocion(e.target.value)}
                      placeholder="Ej: 20% OFF llevando el combo"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-orange-600 focus:bg-white transition-all font-bold text-orange-600"
                    />
                  </div>
                </div>

                {/* Fechas con Calendario Desplegable en formato DIA/MES/AÑO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-orange-600" />
                      <span>Válida desde (dd/mm/aaaa) *</span>
                    </label>
                    <DatePickerAR
                      value={fechaInicioPromocion}
                      onChange={setFechaInicioPromocion}
                      required
                      ariaLabel="Fecha de inicio de la promoción"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-orange-600" />
                      <span>Válida hasta (dd/mm/aaaa) *</span>
                    </label>
                    <DatePickerAR
                      value={fechaFinPromocion}
                      onChange={setFechaFinPromocion}
                      min={fechaInicioPromocion || undefined}
                      required
                      ariaLabel="Fecha de fin de la promoción"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Condiciones (opcional)
                  </label>
                  <input
                    type="text"
                    value={condicionPromocion}
                    onChange={(e) => setCondicionPromocion(e.target.value)}
                    placeholder="Ej: Válido en efectivo o transferencia hasta agotar stock."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-orange-600 focus:bg-white transition-all"
                  />
                </div>

                {/* Foto del Combo con Aviso de Formato No Bloqueante */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-orange-600" />
                      <span>Foto de la Promoción</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setMostrarUrlExterna(!mostrarUrlExterna)}
                      className="text-[11px] text-orange-600 hover:underline font-semibold cursor-pointer"
                    >
                      {mostrarUrlExterna ? 'Subir desde archivo' : 'O pegar enlace de foto'}
                    </button>
                  </div>

                  {!mostrarUrlExterna ? (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCargarFoto}
                        className="hidden"
                      />

                      {fotoComboPromocion && fotoComboPromocion !== DEFAULT_BRAND_IMAGE ? (
                        <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
                          <img
                            src={fotoComboPromocion}
                            alt="Previsualización del combo"
                            className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">
                              Foto lista para publicar
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Ajustada automáticamente para cargar rápido en la web
                            </p>
                            <div className="flex gap-2 mt-1.5">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                              >
                                Cambiar foto
                              </button>
                              <span className="text-slate-300">•</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setFotoComboPromocion('');
                                  setAvisoFormatoFoto(null);
                                }}
                                className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                              >
                                Quitar foto
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-200 hover:border-orange-500 bg-white hover:bg-orange-50/20 rounded-xl p-5 text-center cursor-pointer transition-all duration-200"
                          >
                            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-2">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-bold text-slate-800">
                              Hacé clic para subir una foto de la promoción
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Opcional: si no cargás una foto, siempre se asignará la imagen oficial de la librería
                            </p>
                          </div>

                          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#fdfbf7] border border-[#f2d3d8]/80 text-[11px] text-slate-600">
                            <img
                              src={DEFAULT_BRAND_IMAGE}
                              alt="Logo oficial de Librería Motivos"
                              className="w-8 h-8 rounded-full object-cover border border-[#f2d3d8] shrink-0"
                            />
                            <span className="leading-snug">
                              <strong className="text-purple-950">Imagen oficial automática:</strong> sin foto propia se mostrará siempre el logo de Librería Motivos.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        value={fotoComboPromocion}
                        onChange={(e) => {
                          setFotoComboPromocion(e.target.value);
                          setAvisoFormatoFoto(null);
                        }}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:border-orange-600 transition-all text-xs font-mono"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Si lo dejás vacío, se usará el logo oficial de Librería Motivos.
                      </p>
                    </div>
                  )}

                  {/* Aviso informativo de formato/resolución (NO bloqueante) */}
                  {avisoFormatoFoto && (
                    <div
                      className={`p-3 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 animate-in fade-in duration-200 ${
                        avisoFormatoFoto.tipo === 'optimo'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      {avisoFormatoFoto.tipo === 'optimo' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <span>{avisoFormatoFoto.mensaje}</span>
                    </div>
                  )}
                </div>
              </form>

              {/* Vista Previa en Vivo (Columna Derecha) */}
              <div className="lg:col-span-5 p-6 bg-slate-50/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-orange-600" />
                      <span>Vista Previa en Portada</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      • En Vivo
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
                    Así verán tus clientes esta promoción en el banner principal de la web:
                  </p>

                  {/* Tarjeta Simulación Hero Banner */}
                  <div className="bg-gradient-to-br from-[#fef5f6] via-[#fbf0f2] to-[#f7e6e9] rounded-2xl border border-[#f2d3d8] p-4 shadow-sm space-y-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/90 text-[#6e2e38] border border-[#f3cad2]">
                        <Sparkles className="w-3 h-3 text-[#d97786]" />
                        <span>{temporadaPromocion.trim() || 'Temporada'}</span>
                      </span>
                    </div>

                    <h4 className="font-heading text-base font-black text-slate-900 leading-tight">
                      {nombrePromocion.trim() || 'Título de la Promoción'}
                    </h4>

                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#d97786] text-xs font-black shadow-2xs border border-[#f3cad2]">
                      <Percent className="w-3.5 h-3.5 text-[#d97786]" />
                      <span>{descuentoTextoPromocion.trim() || 'Descuento especial'}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {detallePromocion.trim() || 'Detalle de los artículos incluidos en esta promoción...'}
                    </p>

                    {/* Foto Combo */}
                    <div
                      className={`relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 ${
                        (fotoComboPromocion || DEFAULT_BRAND_IMAGE) === DEFAULT_BRAND_IMAGE
                          ? 'bg-[#fdfbf7]'
                          : 'bg-slate-100'
                      }`}
                    >
                      <img
                        src={fotoComboPromocion || DEFAULT_BRAND_IMAGE}
                        alt="Vista previa de promoción"
                        className={`w-full h-full object-center ${
                          (fotoComboPromocion || DEFAULT_BRAND_IMAGE) === DEFAULT_BRAND_IMAGE
                            ? 'object-contain p-2'
                            : 'object-cover'
                        }`}
                      />
                      <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#d97786]" />
                        <span>Combo Especial</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        Vigencia: {formatearFechaLegible(fechaInicioPromocion) || '--/--/----'} al{' '}
                        {formatearFechaLegible(fechaFinPromocion) || '--/--/----'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-400 shrink-0">Condición:</span>
                    <span className="font-medium text-slate-800 truncate">
                      {condicionPromocion || 'Sin condición especial'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 cursor-pointer text-xs sm:text-sm min-h-[42px]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="form-promocion"
                className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer text-xs sm:text-sm min-h-[42px]"
              >
                {modoEdicion ? 'Guardar Cambios' : 'Publicar Promoción'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
