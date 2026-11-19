'use client';

import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Pencil,
  EyeOff,
  RotateCcw,
  X,
  CalendarDays,
  Store,
  Eye,
  Info,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useAdminFeedback } from '@/context/AdminFeedbackContext';
import { HorarioAtencionAdmin } from '@/types/admin';

export default function HorariosAdminPage() {
  const { horarios, crearHorario, editarHorario, bajaLogicaHorario, reactivarHorario } = useAdmin();
  const { notificar, confirmar } = useAdminFeedback();

  const [estadoFiltro, setEstadoFiltro] = useState<'todos' | 'visibles' | 'ocultos'>('todos');

  // Modal Formulario
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [horarioSeleccionadoId, setHorarioSeleccionadoId] = useState<string | null>(null);

  const [diasTextoHA, setDiasTextoHA] = useState('Lunes a Viernes');
  const [nombreTurnoHA, setNombreTurnoHA] = useState('Turno Mañana');
  const [horaInicioHA, setHoraInicioHA] = useState('09:30');
  const [horaFinHA, setHoraFinHA] = useState('13:30');
  const [esCerradoHA, setEsCerradoHA] = useState(false);

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

  const aplicarPlantilla = (
    dias: string,
    turno: string,
    inicio: string,
    fin: string,
    cerrado: boolean
  ) => {
    setDiasTextoHA(dias);
    setNombreTurnoHA(turno);
    setHoraInicioHA(inicio);
    setHoraFinHA(fin);
    setEsCerradoHA(cerrado);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!diasTextoHA.trim()) {
      notificar({
        tipo: 'error',
        titulo: 'Faltan los días de atención',
        mensaje: 'Completá qué días corresponde este turno (por ejemplo: Lunes a Viernes).',
      });
      return;
    }

    if (!nombreTurnoHA.trim()) {
      notificar({
        tipo: 'error',
        titulo: 'Falta el nombre del turno',
        mensaje: 'Indicá un nombre como Turno Mañana, Turno Tarde o Horario Corrido.',
      });
      return;
    }

    if (!esCerradoHA && horaInicioHA >= horaFinHA) {
      notificar({
        tipo: 'advertencia',
        titulo: 'Revisá el rango horario',
        mensaje: 'La hora de cierre debe ser posterior a la hora de apertura.',
      });
      return;
    }

    if (modoEdicion && horarioSeleccionadoId) {
      const hOriginal = horarios.find((h) => h.idHorarioAtencion === horarioSeleccionadoId);
      editarHorario({
        idHorarioAtencion: horarioSeleccionadoId,
        diasTextoHA: diasTextoHA.trim(),
        diasSemanaHA: hOriginal?.diasSemanaHA || [1, 2, 3, 4, 5],
        nombreTurnoHA: nombreTurnoHA.trim(),
        horaInicioHA,
        horaFinHA,
        esCerradoHA,
        fechaHoraBajaHA: hOriginal?.fechaHoraBajaHA || null,
      });
      notificar({
        tipo: 'exito',
        titulo: 'Horario actualizado',
        mensaje: `Se guardó el turno "${diasTextoHA.trim()} — ${nombreTurnoHA.trim()}".`,
      });
    } else {
      crearHorario({
        diasTextoHA: diasTextoHA.trim(),
        diasSemanaHA: [1, 2, 3, 4, 5],
        nombreTurnoHA: nombreTurnoHA.trim(),
        horaInicioHA,
        horaFinHA,
        esCerradoHA,
      });
      notificar({
        tipo: 'exito',
        titulo: 'Nuevo turno agregado',
        mensaje: `El horario "${diasTextoHA.trim()}" ya se muestra en tu página.`,
      });
    }

    setModalAbierto(false);
  };

  const handleOcultar = async (h: HorarioAtencionAdmin) => {
    const ok = await confirmar({
      titulo: '¿Ocultar este horario?',
      mensaje: `El turno "${h.diasTextoHA} — ${h.nombreTurnoHA}" dejará de aparecer en la web, pero podrás volver a mostrarlo cuando quieras.`,
      textoConfirmar: 'Sí, ocultar',
      variante: 'peligro',
    });
    if (ok) {
      bajaLogicaHorario(h.idHorarioAtencion);
      notificar({
        tipo: 'advertencia',
        titulo: 'Horario oculto',
        mensaje: `"${h.diasTextoHA}" ya no aparece en la sección de horarios.`,
      });
    }
  };

  const horariosFiltrados = horarios.filter((h) => {
    if (estadoFiltro === 'visibles' && h.fechaHoraBajaHA) return false;
    if (estadoFiltro === 'ocultos' && !h.fechaHoraBajaHA) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-700" />
            <span>Horarios de Atención</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
              {horariosFiltrados.length} turnos
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configurá los días y horarios de apertura que verán tus clientes en la página.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirModalCrear}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 touch-manipulation cursor-pointer shrink-0 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Turno</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
          <Store className="w-4 h-4 text-slate-400" />
          <span>Turnos del local en Guaymallén</span>
        </span>

        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setEstadoFiltro('todos')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all min-h-[36px] cursor-pointer ${
              estadoFiltro === 'todos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Todos ({horarios.length})
          </button>
          <button
            type="button"
            onClick={() => setEstadoFiltro('visibles')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all min-h-[36px] cursor-pointer ${
              estadoFiltro === 'visibles' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Visibles ({horarios.filter((h) => !h.fechaHoraBajaHA).length})
          </button>
          <button
            type="button"
            onClick={() => setEstadoFiltro('ocultos')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all min-h-[36px] cursor-pointer ${
              estadoFiltro === 'ocultos' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Ocultos ({horarios.filter((h) => !!h.fechaHoraBajaHA).length})
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/90 text-slate-500 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Días de Atención</th>
                <th className="py-3 px-4">Turno</th>
                <th className="py-3 px-4">Apertura</th>
                <th className="py-3 px-4">Cierre</th>
                <th className="py-3 px-4">Visibilidad</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {horariosFiltrados.length > 0 ? (
                horariosFiltrados.map((h) => {
                  const estaOculto = !!h.fechaHoraBajaHA;

                  return (
                    <tr
                      key={h.idHorarioAtencion}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        estaOculto ? 'bg-rose-50/20 text-slate-500' : 'text-slate-800'
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{h.diasTextoHA}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${
                            h.esCerradoHA
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
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
                        {estaOculto ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            Oculto
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
                            onClick={() => abrirModalEditar(h)}
                            className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                            title="Editar horario"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {estaOculto ? (
                            <button
                              type="button"
                              onClick={() => {
                                reactivarHorario(h.idHorarioAtencion);
                                notificar({
                                  tipo: 'exito',
                                  titulo: 'Horario visible nuevamente',
                                  mensaje: `"${h.diasTextoHA} — ${h.nombreTurnoHA}" volvió a mostrarse en la web.`,
                                });
                              }}
                              className="p-2 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                              title="Volver a mostrar en la web"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOcultar(h)}
                              className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
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
                    No se encontraron turnos para el filtro seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 2 Columnas con Vista Previa en Vivo */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    {modoEdicion ? 'Editar Turno de Atención' : 'Nuevo Turno de Horario'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Definí los días y la franja horaria que verán tus clientes
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleGuardar} className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-4">
                  {/* Plantillas rápidas */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Plantillas rápidas</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          aplicarPlantilla('Lunes a Viernes', 'Turno Mañana', '09:30', '13:30', false)
                        }
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-600 hover:text-emerald-700 transition-colors shadow-2xs cursor-pointer"
                      >
                        Mañana (09:30 - 13:30)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          aplicarPlantilla('Lunes a Viernes', 'Turno Tarde', '17:00', '20:30', false)
                        }
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-600 hover:text-emerald-700 transition-colors shadow-2xs cursor-pointer"
                      >
                        Tarde (17:00 - 20:30)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          aplicarPlantilla('Sábados', 'Turno Mañana', '10:00', '13:30', false)
                        }
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-600 hover:text-emerald-700 transition-colors shadow-2xs cursor-pointer"
                      >
                        Sábado (10:00 - 13:30)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          aplicarPlantilla('Domingos y Feriados', 'Cerrado', '00:00', '00:00', true)
                        }
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white border border-slate-200 text-rose-600 hover:border-rose-400 transition-colors shadow-2xs cursor-pointer"
                      >
                        Domingo (Cerrado)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Días de Atención *
                    </label>
                    <input
                      type="text"
                      required
                      value={diasTextoHA}
                      onChange={(e) => setDiasTextoHA(e.target.value)}
                      placeholder="Ej: Lunes a Viernes / Sábados / Feriados"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre del Turno *
                    </label>
                    <input
                      type="text"
                      required
                      value={nombreTurnoHA}
                      onChange={(e) => setNombreTurnoHA(e.target.value)}
                      placeholder="Ej: Turno Mañana / Turno Tarde / Horario Corrido"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Hora de Apertura *
                      </label>
                      <input
                        type="time"
                        required
                        disabled={esCerradoHA}
                        value={horaInicioHA}
                        onChange={(e) => setHoraInicioHA(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono font-bold focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all text-xs sm:text-sm disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Hora de Cierre *
                      </label>
                      <input
                        type="time"
                        required
                        disabled={esCerradoHA}
                        value={horaFinHA}
                        onChange={(e) => setHoraFinHA(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono font-bold focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all text-xs sm:text-sm disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={esCerradoHA}
                        onChange={(e) => setEsCerradoHA(e.target.checked)}
                        className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span>El local permanece cerrado en este período</span>
                    </label>
                  </div>
                </div>

                {/* Columna Derecha: Vista Previa */}
                <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Vista Previa</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Página Web
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-[#d97786] uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#d97786]" />
                        <span>Horario del Local</span>
                      </span>

                      {esCerradoHA ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold">
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                          <span>Cerrado</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span>Abierto</span>
                        </div>
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-xl border ${
                        esCerradoHA
                          ? 'bg-rose-50/40 border-rose-100 text-slate-400'
                          : 'bg-emerald-50/30 border-emerald-100 text-slate-800'
                      } flex justify-between items-center transition-all`}
                    >
                      <div>
                        <span className="font-heading font-bold text-xs sm:text-sm text-slate-900 block">
                          {diasTextoHA.trim() || 'Días de atención'}
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {nombreTurnoHA.trim() || 'Nombre del turno'}
                        </span>
                      </div>
                      <div className="text-right font-medium text-xs font-mono">
                        {esCerradoHA ? (
                          <span className="text-xs italic text-rose-500 font-sans font-bold">
                            Cerrado
                          </span>
                        ) : (
                          <span className="text-emerald-800 font-bold">
                            {horaInicioHA || '--:--'} a {horaFinHA || '--:--'} hs
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        Los turnos con el mismo día se agrupan automáticamente para que el cliente los lea en un solo vistazo.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition-colors text-xs sm:text-sm cursor-pointer min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-md active:scale-95 text-xs sm:text-sm cursor-pointer min-h-[44px]"
                >
                  {modoEdicion ? 'Guardar Cambios' : 'Guardar Turno'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
