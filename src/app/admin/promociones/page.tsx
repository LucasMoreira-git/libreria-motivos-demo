'use client';

import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  RotateCcw, 
  X, 
  CheckCircle2, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { PromocionAdmin } from '@/types/admin';

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

  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

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
    setBadgeTextoPromocion('Promo Destacada 🌸');
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
    setModalAbierto(true);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombrePromocion.trim()) {
      alert('El nombre de la promoción es obligatorio');
      return;
    }

    if (modoEdicion && promocionSeleccionadaId) {
      const promoOriginal = promociones.find((p) => p.idPromocion === promocionSeleccionadaId);
      editarPromocion({
        idPromocion: promocionSeleccionadaId,
        nombrePromocion,
        detallePromocion,
        temporadaPromocion,
        fechaInicioPromocion,
        fechaFinPromocion,
        descuentoTextoPromocion,
        condicionPromocion,
        fotoComboPromocion: fotoComboPromocion.trim() || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
        badgeTextoPromocion,
        fechaHoraBajaPromocion: promoOriginal?.fechaHoraBajaPromocion || null,
      });
      mostrarExito('¡Promoción actualizada correctamente!');
    } else {
      crearPromocion({
        nombrePromocion,
        detallePromocion,
        temporadaPromocion,
        fechaInicioPromocion,
        fechaFinPromocion,
        descuentoTextoPromocion,
        condicionPromocion,
        fotoComboPromocion: fotoComboPromocion.trim() || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
        badgeTextoPromocion,
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
      pr.detallePromocion.toLowerCase().includes(q) ||
      pr.temporadaPromocion.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Encabezado */}
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
            Mapeo de atributos: <code className="font-mono text-orange-600 font-semibold">temporadaPromocion</code>, <code className="font-mono text-orange-600 font-semibold">fechaInicioPromocion</code>, <code className="font-mono text-orange-600 font-semibold">fechaHoraBajaPromocion</code>.
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

      {mensajeExito && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, temporada o detalle..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-orange-600 transition-all"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setEstadoFiltro('todos')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              estadoFiltro === 'todos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setEstadoFiltro('activos')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              estadoFiltro === 'activos' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Activas
          </button>
          <button
            type="button"
            onClick={() => setEstadoFiltro('bajas')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              estadoFiltro === 'bajas' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Bajas
          </button>
        </div>
      </div>

      {/* Tabla DataGrid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/90 text-slate-500 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Combo / Promoción</th>
                <th className="py-3 px-4">temporadaPromocion</th>
                <th className="py-3 px-4">Vigencia (Inicio - Fin)</th>
                <th className="py-3 px-4">Descuento</th>
                <th className="py-3 px-4">Estado (Baja Lógica)</th>
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
                          {promo.fotoComboPromocion && (
                            <img
                              src={promo.fotoComboPromocion}
                              alt={promo.nombrePromocion}
                              className={`w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 ${
                                estaDadaDeBaja ? 'grayscale opacity-60' : ''
                              }`}
                            />
                          )}
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
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 font-bold text-xs border border-orange-200/80">
                          <Sparkles className="w-3 h-3" />
                          <span>{promo.temporadaPromocion}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-xs font-mono text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{promo.fechaInicioPromocion} al {promo.fechaFinPromocion}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold text-emerald-700 text-xs">
                        {promo.descuentoTextoPromocion}
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
                            Activa
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => abrirModalEditar(promo)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-slate-100 transition-colors"
                            title="Editar promoción"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {estaDadaDeBaja ? (
                            <button
                              type="button"
                              onClick={() => {
                                reactivarPromocion(promo.idPromocion);
                                mostrarExito(`¡Promoción "${promo.nombrePromocion}" reactivada exitosamente!`);
                              }}
                              className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
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
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
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

      {/* Modal Formulario */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
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
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGuardar} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-orange-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Rango de Vigencia */}
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Foto Representativa del Combo (fotoComboPromocion)
                </label>
                <input
                  type="url"
                  value={fotoComboPromocion}
                  onChange={(e) => setFotoComboPromocion(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-orange-600 focus:bg-white transition-all text-xs font-mono"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all shadow-md active:scale-95"
                >
                  {modoEdicion ? 'Guardar Cambios' : 'Registrar Promoción'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
