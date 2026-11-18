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
  CalendarDays,
  Store,
  Eye,
  Info,
  Sparkles
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

  // Campos del Modelo de Dominio
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

  const aplicarPlantilla = (dias: string, turno: string, inicio: string, fin: string, cerrado: boolean) => {
    setDiasTextoHA(dias);
    setNombreTurnoHA(turno);
    setHoraInicioHA(inicio);
    setHoraFinHA(fin);
    setEsCerradoHA(cerrado);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!diasTextoHA.trim()) {
      alert('Los días de atención son obligatorios');
      return;
    }

    if (!nombreTurnoHA.trim()) {
      alert('El nombre del turno es obligatorio');
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
      mostrarExito('¡Turno de horario actualizado correctamente!');
    } else {
      crearHorario({
        diasTextoHA: diasTextoHA.trim(),
        diasSemanaHA: [1, 2, 3, 4, 5],
        nombreTurnoHA: nombreTurnoHA.trim(),
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
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 touch-manipulation cursor-pointer shrink-0 min-h-[44px]"
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
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
          <Store className="w-4 h-4 text-slate-400" />
          <span>Turnos Independientes del Local en Guaymallén</span>
        </span>

        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setEstadoFiltro('todos')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all min-h-[36px] ${
              estadoFiltro === 'todos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Todos ({horarios.length})
          </button>
          <button
            type="button"
            onClick={() => setEstadoFiltro('activos')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all min-h-[36px] ${
              estadoFiltro === 'activos' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Activos ({horarios.filter(h => !h.fechaHoraBajaHA).length})
          </button>
          <button
            type="button"
            onClick={() => setEstadoFiltro('bajas')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all min-h-[36px] ${
              estadoFiltro === 'bajas' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Bajas ({horarios.filter(h => !!h.fechaHoraBajaHA).length})
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
                          <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
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
                            className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
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
                              className="p-2 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
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
                              className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
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
                    No se encontraron turnos configurados para el filtro seleccionado.
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
                    {modoEdicion ? 'Modificar Turno de Atención' : 'Nuevo Turno de Horario'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Configuración de días y franja horaria para la vitrina pública
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

            {/* Modal Body: 2 Columnas */}
            <form onSubmit={handleGuardar} className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Columna Izquierda: Formulario (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* Plantillas rápidas */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Plantillas de turnos frecuentes</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => aplicarPlantilla('Lunes a Viernes', 'Turno Mañana', '09:30', '13:30', false)}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-600 hover:text-emerald-700 transition-colors shadow-2xs"
                      >
                        Mañana (09:30 - 13:30)
                      </button>
                      <button
                        type="button"
                        onClick={() => aplicarPlantilla('Lunes a Viernes', 'Turno Tarde', '17:00', '20:30', false)}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-600 hover:text-emerald-700 transition-colors shadow-2xs"
                      >
                        Tarde (17:00 - 20:30)
                      </button>
                      <button
                        type="button"
                        onClick={() => aplicarPlantilla('Sábados', 'Turno Mañana', '09:30', '13:30', false)}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-600 hover:text-emerald-700 transition-colors shadow-2xs"
                      >
                        Sábado (09:30 - 13:30)
                      </button>
                      <button
                        type="button"
                        onClick={() => aplicarPlantilla('Domingos', 'Cerrado', '00:00', '00:00', true)}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white border border-slate-200 text-rose-600 hover:border-rose-400 transition-colors shadow-2xs"
                      >
                        Domingo (Cerrado)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Días de Atención (diasTextoHA) *
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
                      Nombre del Turno (nombreTurnoHA) *
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
                        Hora Apertura (horaInicioHA) *
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
                        Hora Cierre (horaFinHA) *
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
                      <span>Turno no operativo / Local cerrado durante este período</span>
                    </label>
                  </div>
                </div>

                {/* Columna Derecha: Vista Previa en Vivo (5 cols) */}
                <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Vista Previa en Vivo</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Vitrina Web
                    </span>
                  </div>

                  {/* Simulación del Widget de la Vitrina */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-[#d97786] uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#d97786]" />
                        <span>Atención en Local</span>
                      </span>

                      {/* Badge dinámico de simulación */}
                      {esCerradoHA ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold">
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                          <span>Cerrado</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span>Turno Activo</span>
                        </div>
                      )}
                    </div>

                    {/* Fila del turno tal como aparece en la vitrina */}
                    <div className={`p-3 rounded-xl border ${
                      esCerradoHA 
                        ? 'bg-rose-50/40 border-rose-100 text-slate-400' 
                        : 'bg-emerald-50/30 border-emerald-100 text-slate-800'
                    } flex justify-between items-center transition-all`}>
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
                          <span className="text-xs italic text-rose-500 font-sans font-bold">Cerrado</span>
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
                        Los clientes verán este turno reflejado de forma inmediata en el banner de horarios de la página principal.
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Botones de Acción */}
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
