'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Pencil, 
  Trash2, 
  RotateCcw, 
  X, 
  CheckCircle2, 
  AlertCircle,
  CalendarDays
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { HorarioAtencionAdmin } from '@/types/admin';

export default function ABMHorariosPage() {
  const { horarios, crearHorario, editarHorario, bajaLogicaHorario, reactivarHorario } = useAdmin();

  const [estadoFiltro, setEstadoFiltro] = useState<'todos' | 'activos' | 'bajas'>('todos');

  // Modal Formulario
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [horarioSeleccionadoId, setHorarioSeleccionadoId] = useState<string | null>(null);

  // Campos estrictos del Modelo de Dominio
  const [diasTextoHA, setDiasTextoHA] = useState('Lunes a Viernes');
  const [nombreTurnoHA, setNombreTurnoHA] = useState('Turno Mañana');
  const [horaInicioHA, setHoraInicioHA] = useState('09:30');
  const [horaFinHA, setHoraFinHA] = useState('13:30');
  const [esCerradoHA, setEsCerradoHA] = useState(false);

  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const mostrarExito = (msg: string) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setHorarioSeleccionadoId(null);
    setDiasTextoHA('Lunes a Viernes');
    setNombreTurnoHA('Turno Tarde');
    setHoraInicioHA('17:00');
    setHoraFinHA('20:30');
    setEsCerradoHA(false);
    setModalAbierto(true);
  };

  const abrirModalEditar = (h: HorarioAtencionAdmin) => {
    setModoEdicion(true);
    setHorarioSeleccionadoId(h.idHorarioAtencion);
    setDiasTextoHA(h.diasTextoHA);
    setNombreTurnoHA(h.nombreTurnoHA);
    setHoraInicioHA(h.horaInicioHA);
    setHoraFinHA(h.horaFinHA);
    setEsCerradoHA(h.esCerradoHA);
    setModalAbierto(true);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!diasTextoHA.trim()) {
      alert('Los días de atención son obligatorios');
      return;
    }

    if (modoEdicion && horarioSeleccionadoId) {
      const hOriginal = horarios.find((h) => h.idHorarioAtencion === horarioSeleccionadoId);
      editarHorario({
        idHorarioAtencion: horarioSeleccionadoId,
        diasTextoHA,
        diasSemanaHA: hOriginal?.diasSemanaHA || [1, 2, 3, 4, 5],
        nombreTurnoHA,
        horaInicioHA,
        horaFinHA,
        esCerradoHA,
        fechaHoraBajaHA: hOriginal?.fechaHoraBajaHA || null,
      });
      mostrarExito('¡Turno de horario actualizado correctamente!');
    } else {
      crearHorario({
        diasTextoHA,
        diasSemanaHA: [1, 2, 3, 4, 5],
        nombreTurnoHA,
        horaInicioHA,
        horaFinHA,
        esCerradoHA,
      });
      mostrarExito('¡Nuevo turno de horario registrado con éxito!');
    }

    setModalAbierto(false);
  };

  const horariosFiltrados = horarios.filter((h) => {
    if (estadoFiltro === 'activos' && h.fechaHoraBajaHA) return false;
    if (estadoFiltro === 'bajas' && !h.fechaHoraBajaHA) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-700" />
            <span>ABM Horarios de Atención</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
              {horariosFiltrados.length} turnos
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mapeo de atributos: <code className="font-mono text-emerald-800 font-semibold">horaInicioHA</code>, <code className="font-mono text-emerald-800 font-semibold">horaFinHA</code>, <code className="font-mono text-emerald-800 font-semibold">fechaHoraBajaHA</code>.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirModalCrear}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 touch-manipulation cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Turno de Horario</span>
        </button>
      </div>

      {mensajeExito && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
        <span className="text-xs font-bold text-slate-600">
          Turnos Independientes del Local en Guaymallén
        </span>

        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setEstadoFiltro('todos')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              estadoFiltro === 'todos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setEstadoFiltro('activos')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              estadoFiltro === 'activos' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Activos
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
                <th className="py-3 px-4">Días de Atención (diasTextoHA)</th>
                <th className="py-3 px-4">nombreTurnoHA</th>
                <th className="py-3 px-4">horaInicioHA</th>
                <th className="py-3 px-4">horaFinHA</th>
                <th className="py-3 px-4">Estado (Baja Lógica)</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {horariosFiltrados.length > 0 ? (
                horariosFiltrados.map((h) => {
                  const estaDadoDeBaja = !!h.fechaHoraBajaHA;

                  return (
                    <tr 
                      key={h.idHorarioAtencion}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        estaDadoDeBaja ? 'bg-rose-50/20 text-slate-500' : 'text-slate-800'
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-slate-400" />
                          <span>{h.diasTextoHA}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${
                          h.esCerradoHA 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {h.nombreTurnoHA}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {h.esCerradoHA ? '-' : `${h.horaInicioHA} hs`}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {h.esCerradoHA ? '-' : `${h.horaFinHA} hs`}
                      </td>

                      <td className="py-3 px-4">
                        {estaDadoDeBaja ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              Baja Lógica
                            </span>
                            <p className="text-[10px] font-mono text-slate-500">
                              {h.fechaHoraBajaHA}
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
                            onClick={() => abrirModalEditar(h)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                            title="Editar horario"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {estaDadoDeBaja ? (
                            <button
                              type="button"
                              onClick={() => {
                                reactivarHorario(h.idHorarioAtencion);
                                mostrarExito(`¡Turno "${h.diasTextoHA} - ${h.nombreTurnoHA}" reactivado exitosamente!`);
                              }}
                              className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                              title="Reactivar turno"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`¿Dar de baja lógica al turno "${h.diasTextoHA} - ${h.nombreTurnoHA}"?`)) {
                                  bajaLogicaHorario(h.idHorarioAtencion);
                                  mostrarExito(`Turno "${h.diasTextoHA}" marcado con baja lógica.`);
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
                    No se encontraron turnos configurados.
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
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-700" />
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {modoEdicion ? 'Modificar Turno de Atención' : 'Nuevo Turno de Horario'}
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
                  Días de Atención (diasTextoHA) *
                </label>
                <input
                  type="text"
                  required
                  value={diasTextoHA}
                  onChange={(e) => setDiasTextoHA(e.target.value)}
                  placeholder="Ej: Lunes a Viernes / Sábados / Domingos"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nombre del Turno (nombreTurnoHA) *
                </label>
                <input
                  type="text"
                  required
                  value={nombreTurnoHA}
                  onChange={(e) => setNombreTurnoHA(e.target.value)}
                  placeholder="Ej: Turno Mañana / Turno Tarde / Horario Corrido"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Hora Apertura (horaInicioHA) *
                  </label>
                  <input
                    type="time"
                    required
                    disabled={esCerradoHA}
                    value={horaInicioHA}
                    onChange={(e) => setHoraInicioHA(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono font-bold focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Hora Cierre (horaFinHA) *
                  </label>
                  <input
                    type="time"
                    required
                    disabled={esCerradoHA}
                    value={horaFinHA}
                    onChange={(e) => setHoraFinHA(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono font-bold focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={esCerradoHA}
                    onChange={(e) => setEsCerradoHA(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-500"
                  />
                  <span>Turno no operativo / Local cerrado durante este período</span>
                </label>
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
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-md active:scale-95"
                >
                  {modoEdicion ? 'Guardar Cambios' : 'Registrar Turno'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
