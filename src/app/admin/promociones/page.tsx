'use client';

import React, { useState, useRef } from 'react';
import { 
  Tag, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  RotateCcw, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Eye,
  Percent,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { PromocionAdmin } from '@/types/admin';
import { DEFAULT_BRAND_IMAGE } from '@/lib/mock-data';

export default function ABMPromocionesPage() {
  const { promociones, crearPromocion, editarPromocion, bajaLogicaPromocion, reactivarPromocion } = useAdmin();

  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<'todos' | 'activos' | 'bajas'>('todos');

  // Modal Formulario
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [promocionSeleccionadaId, setPromocionSeleccionadaId] = useState<string | null>(null);

  // Campos estrictos del Modelo de Dominio
  const [nombrePromocion, setNombrePromocion] = useState('');
  const [detallePromocion, setDetallePromocion] = useState('');
  const [temporadaPromocion, setTemporadaPromocion] = useState('Especial Primavera 2026');
  const [fechaInicioPromocion, setFechaInicioPromocion] = useState('01/10/2026');
  const [fechaFinPromocion, setFechaFinPromocion] = useState('31/10/2026');
  const [descuentoTextoPromocion, setDescuentoTextoPromocion] = useState('20% OFF llevando el combo');
  const [condicionPromocion, setCondicionPromocion] = useState('');
  const [fotoComboPromocion, setFotoComboPromocion] = useState('');
  const [badgeTextoPromocion, setBadgeTextoPromocion] = useState('');
  const [mostrarUrlExterna, setMostrarUrlExterna] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  const mostrarExito = (msg: string) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setPromocionSeleccionadaId(null);
    setNombrePromocion('');
    setDetallePromocion('');
    setTemporadaPromocion('Especial Primavera 2026');
    setFechaInicioPromocion('01/10/2026');
    setFechaFinPromocion('31/10/2026');
    setDescuentoTextoPromocion('20% OFF llevando el combo');
    setCondicionPromocion('Válido en efectivo o transferencia hasta agotar stock.');
    setFotoComboPromocion('');
    setBadgeTextoPromocion('Promo Destacada');
    setMostrarUrlExterna(false);
    setErrorValidacion(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (promo: PromocionAdmin) => {
    setModoEdicion(true);
    setPromocionSeleccionadaId(promo.idPromocion);
    setNombrePromocion(promo.nombrePromocion);
    setDetallePromocion(promo.detallePromocion);
    setTemporadaPromocion(promo.temporadaPromocion);
    setFechaInicioPromocion(promo.fechaInicioPromocion);
    setFechaFinPromocion(promo.fechaFinPromocion);
    setDescuentoTextoPromocion(promo.descuentoTextoPromocion);
    setCondicionPromocion(promo.condicionPromocion || '');
    setFotoComboPromocion(promo.fotoComboPromocion || '');
    setBadgeTextoPromocion(promo.badgeTextoPromocion || '');
    setMostrarUrlExterna(Boolean(promo.fotoComboPromocion?.startsWith('http') && !promo.fotoComboPromocion?.startsWith('data:image')));
    setErrorValidacion(null);
    setModalAbierto(true);
  };

  const handleCargarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorValidacion('Por favor seleccioná un archivo de imagen válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawData = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

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
      setErrorValidacion('El nombre de la promoción es obligatorio.');
      return;
    }

    const fotoFinal = fotoComboPromocion.trim() || DEFAULT_BRAND_IMAGE;

    if (modoEdicion && promocionSeleccionadaId) {
      const promoOriginal = promociones.find((p) => p.idPromocion === promocionSeleccionadaId);
      editarPromocion({
        idPromocion: promocionSeleccionadaId,
        nombrePromocion: nombrePromocion.trim(),
        detallePromocion: detallePromocion.trim(),
        temporadaPromocion: temporadaPromocion.trim(),
        fechaInicioPromocion: fechaInicioPromocion.trim(),
        fechaFinPromocion: fechaFinPromocion.trim(),
        descuentoTextoPromocion: descuentoTextoPromocion.trim(),
        condicionPromocion: condicionPromocion.trim(),
        fotoComboPromocion: fotoFinal,
        badgeTextoPromocion: badgeTextoPromocion.trim(),
        fechaHoraBajaPromocion: promoOriginal?.fechaHoraBajaPromocion || null,
      });
      mostrarExito('¡Promoción actualizada correctamente!');
    } else {
      crearPromocion({
        nombrePromocion: nombrePromocion.trim(),
        detallePromocion: detallePromocion.trim(),
        temporadaPromocion: temporadaPromocion.trim(),
        fechaInicioPromocion: fechaInicioPromocion.trim(),
        fechaFinPromocion: fechaFinPromocion.trim(),
        descuentoTextoPromocion: descuentoTextoPromocion.trim(),
        condicionPromocion: condicionPromocion.trim(),
        fotoComboPromocion: fotoFinal,
        badgeTextoPromocion: badgeTextoPromocion.trim(),
      });
      mostrarExito('¡Nueva promoción dada de alta exitosamente!');
    }

    setModalAbierto(false);
  };

  const promocionesFiltradas = promociones.filter((pr) => {
    if (estadoFiltro === 'activos' && pr.fechaHoraBajaPromocion) return false;
    if (estadoFiltro === 'bajas' && !pr.fechaHoraBajaPromocion) return false;

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
            <span>ABM Promociones</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
              {promocionesFiltradas.length} registros
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mapeo de atributos: <code className="font-mono text-orange-600 font-semibold">nombrePromocion</code>, <code className="font-mono text-orange-600 font-semibold">temporadaPromocion</code>, <code className="font-mono text-orange-600 font-semibold">descuentoTexto</code> y fotos reales del combo.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirModalCrear}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 touch-manipulation cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Promoción</span>
        </button>
      </div>

      {/* Banner de Feedback */}
      {mensajeExito && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* 2. Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
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
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Selector de Estado */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setEstadoFiltro('todos')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              estadoFiltro === 'todos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setEstadoFiltro('activos')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              estadoFiltro === 'activos' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Activos
          </button>
          <button
            type="button"
            onClick={() => setEstadoFiltro('bajas')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              estadoFiltro === 'bajas' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Bajas
          </button>
        </div>
      </div>

      {/* 3. Tabla DataGrid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/90 text-slate-500 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Promoción & Combo</th>
                <th className="py-3 px-4">Temporada</th>
                <th className="py-3 px-4">Beneficio / Descuento</th>
                <th className="py-3 px-4">Vigencia</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {promocionesFiltradas.length > 0 ? (
                promocionesFiltradas.map((promo) => {
                  const estaDadaDeBaja = !!promo.fechaHoraBajaPromocion;

                  return (
                    <tr 
                      key={promo.idPromocion}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        estaDadaDeBaja ? 'bg-rose-50/20 text-slate-500' : 'text-slate-800'
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
                            } ${estaDadaDeBaja ? 'grayscale opacity-60' : ''}`}
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
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 border border-purple-200/60 text-xs font-semibold">
                          <Sparkles className="w-3 h-3 text-purple-600 shrink-0" />
                          <span>{promo.temporadaPromocion}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-orange-600 text-xs sm:text-sm">
                        <span className="inline-flex items-center gap-1">
                          <Percent className="w-3.5 h-3.5 shrink-0" />
                          <span>{promo.descuentoTextoPromocion}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{promo.fechaInicioPromocion} al {promo.fechaFinPromocion}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {estaDadaDeBaja ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              Baja Lógica
                            </span>
                            <p className="text-[10px] font-mono text-slate-500">
                              {promo.fechaHoraBajaPromocion}
                            </p>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Activo
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => abrirModalEditar(promo)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Editar promoción"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {estaDadaDeBaja ? (
                            <button
                              type="button"
                              onClick={() => {
                                reactivarPromocion(promo.idPromocion);
                                mostrarExito(`¡Promoción "${promo.nombrePromocion}" reactivada con éxito!`);
                              }}
                              className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                              title="Reactivar promoción"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`¿Dar de baja lógica a la promoción "${promo.nombrePromocion}"?`)) {
                                  bajaLogicaPromocion(promo.idPromocion);
                                  mostrarExito(`Promoción "${promo.nombrePromocion}" marcada con baja lógica.`);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Dar de baja lógica"
                            >
                              <Trash2 className="w-4 h-4" />
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
                    No se encontraron promociones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal con Vista Previa en Vivo */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            
            {/* Cabecera */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-orange-600" />
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {modoEdicion ? 'Modificar Promoción' : 'Nueva Promoción de Temporada'}
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

            {/* Grid 2 Columnas: Formulario + Vista Previa en Vivo */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              
              {/* Formulario */}
              <form onSubmit={handleGuardar} id="form-promocion" className="lg:col-span-7 p-6 space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nombre de la Promoción (nombrePromocion) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nombrePromocion}
                    onChange={(e) => setNombrePromocion(e.target.value)}
                    placeholder="Ej: Combo Creativo Especial Primavera"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-orange-600 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Detalle de Productos Incluidos (detallePromocion) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={detallePromocion}
                    onChange={(e) => setDetallePromocion(e.target.value)}
                    placeholder="Ej: Mochila 18 + Cartuchera Canopla 2 pisos + Cuadernos tapa dura..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-orange-600 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Temporada (temporadaPromocion) *
                    </label>
                    <input
                      type="text"
                      required
                      value={temporadaPromocion}
                      onChange={(e) => setTemporadaPromocion(e.target.value)}
                      placeholder="Especial Primavera 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-orange-600 focus:bg-white transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Texto de Descuento (descuentoTextoPromocion) *
                    </label>
                    <input
                      type="text"
                      required
                      value={descuentoTextoPromocion}
                      onChange={(e) => setDescuentoTextoPromocion(e.target.value)}
                      placeholder="25% OFF llevando el combo"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-orange-600 focus:bg-white transition-all font-bold text-orange-600"
                    />
                  </div>
                </div>

                {/* Vigencia */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Fecha Inicio (fechaInicioPromocion)
                    </label>
                    <input
                      type="text"
                      value={fechaInicioPromocion}
                      onChange={(e) => setFechaInicioPromocion(e.target.value)}
                      placeholder="01/10/2026"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono focus:outline-hidden focus:border-orange-600 focus:bg-white transition-all text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Fecha Fin (fechaFinPromocion)
                    </label>
                    <input
                      type="text"
                      value={fechaFinPromocion}
                      onChange={(e) => setFechaFinPromocion(e.target.value)}
                      placeholder="31/10/2026"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono focus:outline-hidden focus:border-orange-600 focus:bg-white transition-all text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Condición Comercial (condicionPromocion)
                  </label>
                  <input
                    type="text"
                    value={condicionPromocion}
                    onChange={(e) => setCondicionPromocion(e.target.value)}
                    placeholder="Válido en efectivo, transferencia o débito hasta agotar stock."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-orange-600 focus:bg-white transition-all"
                  />
                </div>

                {/* Carga de Foto Real del Combo */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-orange-600" />
                      <span>Foto Real del Combo (Subir Archivo / Cámara)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setMostrarUrlExterna(!mostrarUrlExterna)}
                      className="text-[11px] text-orange-600 hover:underline font-semibold cursor-pointer"
                    >
                      {mostrarUrlExterna ? 'Usar archivo de foto' : 'O usar enlace externo'}
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

                      {fotoComboPromocion ? (
                        <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
                          <img 
                            src={fotoComboPromocion} 
                            alt="Previsualización del combo" 
                            className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">Foto del combo cargada</p>
                            <p className="text-[11px] text-slate-500">Optimizada para el Hero promocional</p>
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
                                onClick={() => setFotoComboPromocion('')}
                                className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                              >
                                Quitar foto
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-200 hover:border-orange-500 bg-white hover:bg-orange-50/20 rounded-xl p-5 text-center cursor-pointer transition-all duration-200"
                          >
                            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-2">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-bold text-slate-800">
                              Hacé clic para subir la foto real del combo promocional
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Si no subís una foto, se mostrará el logo oficial de Librería Motivos
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setFotoComboPromocion(DEFAULT_BRAND_IMAGE)}
                            className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-[#fdfbf7] border border-slate-200 hover:border-orange-400 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                          >
                            <img
                              src={DEFAULT_BRAND_IMAGE}
                              alt="Logo Motivos"
                              className="w-5 h-5 rounded-full object-cover border border-slate-200"
                            />
                            <span>Usar imagen oficial de Librería Motivos</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        value={fotoComboPromocion}
                        onChange={(e) => setFotoComboPromocion(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:border-orange-600 transition-all text-xs font-mono"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">Si se omite, se asignará automáticamente el logo oficial de Librería Motivos.</p>
                    </div>
                  )}
                </div>
              </form>

              {/* Vista Previa en Vivo (Columna Derecha) */}
              <div className="lg:col-span-5 p-6 bg-slate-50/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-heading font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-orange-600" />
                      <span>Vista Previa en Hero de la Vitrina</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      ● En Vivo
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-4">
                    Así observarán los visitantes este banner principal en la portada de la web:
                  </p>

                  {/* Banner Simulado */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#fcf7f8] via-white to-[#fbf0f2] border border-[#eed0d5] shadow-sm space-y-3">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white text-[#d97786] border border-[#eed0d5]">
                        <Sparkles className="w-3 h-3 text-[#d97786]" />
                        <span>{temporadaPromocion || 'Especial Temporada'}</span>
                      </span>
                    </div>

                    <h4 className="font-heading font-black text-slate-900 text-sm leading-tight">
                      {nombrePromocion.trim() || 'Título de la Promoción'}
                    </h4>

                    <div className="p-2 rounded-xl bg-white border border-[#eed0d5]/80 text-[#b34f60] font-black text-xs inline-flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5 text-[#d97786]" />
                      <span>{descuentoTextoPromocion.trim() || 'Descuento especial'}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {detallePromocion.trim() || 'Detalle de los artículos que componen el combo...'}
                    </p>

                    {/* Foto Combo */}
                    <div
                      className={`relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 ${
                        (fotoComboPromocion || DEFAULT_BRAND_IMAGE) === DEFAULT_BRAND_IMAGE
                          ? 'bg-[#fdfbf7]'
                          : 'bg-slate-100'
                      }`}
                    >
                      <img 
                        src={fotoComboPromocion || DEFAULT_BRAND_IMAGE} 
                        alt="Combo preview"
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
                      <span>Vigencia: {fechaInicioPromocion} al {fechaFinPromocion}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Condición:</span>
                    <span className="font-medium text-slate-800 truncate max-w-xs">{condicionPromocion || 'Sin condición especial'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Modal */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 cursor-pointer text-xs sm:text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="form-promocion"
                className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer text-xs sm:text-sm"
              >
                {modoEdicion ? 'Guardar Cambios' : 'Registrar Promoción'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
