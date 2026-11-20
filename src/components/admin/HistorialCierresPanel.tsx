'use client';

import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Download,
  FileText,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Banknote,
  Landmark,
  ArrowLeftRight,
  CreditCard,
  History,
  Trash2,
} from 'lucide-react';
import { useAdminFeedback } from '@/context/AdminFeedbackContext';
import {
  CierreCaja,
  ETIQUETAS_MEDIO_PAGO,
  exportarCierreExcelCSV,
  exportarHistorialExcelCSV,
  filtrarHistorialPorPeriodo,
  generarTextoResumenCierre,
  imprimirResumenCierrePDF,
} from '@/lib/caja-diaria';

interface HistorialCierresPanelProps {
  cierres: CierreCaja[];
  onEliminarCierre: (id: string) => void;
}

type PeriodoFiltro = 'todos' | 'hoy' | 'semana' | 'mes';

const PERIODOS: { id: PeriodoFiltro; etiqueta: string }[] = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'hoy', etiqueta: 'Hoy' },
  { id: 'semana', etiqueta: 'Últimos 7 días' },
  { id: 'mes', etiqueta: 'Este mes' },
];

export function HistorialCierresPanel({
  cierres,
  onEliminarCierre,
}: HistorialCierresPanelProps) {
  const { notificar, confirmar } = useAdminFeedback();
  const [periodo, setPeriodo] = useState<PeriodoFiltro>('todos');
  const [expandidoId, setExpandidoId] = useState<string | null>(null);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  const cierresFiltrados = useMemo(
    () => filtrarHistorialPorPeriodo(cierres, periodo),
    [cierres, periodo]
  );

  const totalesPeriodo = useMemo(() => {
    return cierresFiltrados.reduce(
      (acc, c) => ({
        totalVentas: acc.totalVentas + c.totalVentas,
        efectivo: acc.efectivo + c.ventasEfectivo,
        transferencia: acc.transferencia + c.ventasTransferencia,
        debito: acc.debito + c.ventasDebito,
        credito: acc.credito + c.ventasCredito,
        cantidadVentas: acc.cantidadVentas + c.cantidadVentas,
      }),
      {
        totalVentas: 0,
        efectivo: 0,
        transferencia: 0,
        debito: 0,
        credito: 0,
        cantidadVentas: 0,
      }
    );
  }, [cierresFiltrados]);

  const handleCopiarCierre = async (cierre: CierreCaja) => {
    try {
      await navigator.clipboard.writeText(generarTextoResumenCierre(cierre));
      setCopiadoId(cierre.id);
      setTimeout(() => setCopiadoId(null), 2000);
    } catch {
      notificar({
        tipo: 'advertencia',
        titulo: 'No se pudo copiar',
        mensaje: 'Podés descargarlo en Excel o abrir la versión PDF.',
      });
    }
  };

  const handleExportarPeriodo = () => {
    if (cierresFiltrados.length === 0) return;
    exportarHistorialExcelCSV(cierresFiltrados, periodo);
    notificar({
      tipo: 'exito',
      titulo: 'Excel descargado',
      mensaje: `Se exportaron ${cierresFiltrados.length} ${
        cierresFiltrados.length === 1 ? 'cierre' : 'cierres'
      } en formato compatible con Excel.`,
    });
  };

  const handleEliminar = async (cierre: CierreCaja) => {
    const ok = await confirmar({
      titulo: `¿Eliminar el cierre del ${cierre.fechaLegible}?`,
      mensaje: 'Esta acción borra el registro del historial en este navegador.',
      textoConfirmar: 'Sí, eliminar',
      variante: 'peligro',
    });
    if (ok) {
      onEliminarCierre(cierre.id);
      notificar({
        tipo: 'info',
        titulo: 'Cierre eliminado',
        mensaje: `Se quitó el cierre del ${cierre.fechaLegible} del historial.`,
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Barra de Filtros de Período + Botón Exportar Excel */}
      <div className="bg-white rounded-2xl border border-[#ded0f2] p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {PERIODOS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriodo(p.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[38px] ${
                periodo === p.id
                  ? 'bg-purple-950 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-purple-50 hover:text-purple-950 border border-slate-200'
              }`}
            >
              {p.etiqueta}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleExportarPeriodo}
          disabled={cierresFiltrados.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed min-h-[40px] shrink-0"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>Exportar Período a Excel (.csv)</span>
        </button>
      </div>

      {/* Tarjetas Acumuladas del Período */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-[#58285f] to-[#8a3b58] text-white shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-100/90">
            Acumulado del Período
          </span>
          <p className="font-heading text-2xl font-black mt-1">
            $ {totalesPeriodo.totalVentas.toLocaleString('es-AR')}
          </p>
          <p className="text-[11px] text-rose-100/85 mt-1">
            {cierresFiltrados.length} {cierresFiltrados.length === 1 ? 'cierre' : 'cierres'} • {totalesPeriodo.cantidadVentas} ventas
          </p>
        </div>

        <div className="rounded-2xl p-4 bg-emerald-50/70 border border-emerald-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" /> Efectivo
          </span>
          <p className="font-heading text-xl font-black text-emerald-950 mt-1">
            $ {totalesPeriodo.efectivo.toLocaleString('es-AR')}
          </p>
        </div>

        <div className="rounded-2xl p-4 bg-purple-50/70 border border-purple-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1">
            <Landmark className="w-3.5 h-3.5 text-purple-700" /> Transferencia
          </span>
          <p className="font-heading text-xl font-black text-purple-950 mt-1">
            $ {totalesPeriodo.transferencia.toLocaleString('es-AR')}
          </p>
        </div>

        <div className="rounded-2xl p-4 bg-sky-50/80 border border-sky-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1">
            <ArrowLeftRight className="w-3.5 h-3.5 text-sky-700" /> Débito
          </span>
          <p className="font-heading text-xl font-black text-sky-950 mt-1">
            $ {totalesPeriodo.debito.toLocaleString('es-AR')}
          </p>
        </div>

        <div className="rounded-2xl p-4 bg-amber-50/80 border border-amber-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-amber-600" /> Crédito
          </span>
          <p className="font-heading text-xl font-black text-amber-950 mt-1">
            $ {totalesPeriodo.credito.toLocaleString('es-AR')}
          </p>
        </div>
      </div>

      {/* Lista de Cierres Guardados */}
      {cierresFiltrados.length > 0 ? (
        <div className="space-y-3">
          {cierresFiltrados.map((cierre) => {
            const abierto = expandidoId === cierre.id;
            const diffBadge =
              cierre.diferenciaArqueo === 0
                ? {
                    clase: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                    texto: 'Arqueo exacto',
                    ok: true,
                  }
                : cierre.diferenciaArqueo > 0
                  ? {
                      clase: 'bg-sky-50 text-sky-800 border-sky-200',
                      texto: `Sobrante +$${cierre.diferenciaArqueo.toLocaleString('es-AR')}`,
                      ok: false,
                    }
                  : {
                      clase: 'bg-rose-50 text-rose-800 border-rose-200',
                      texto: `Faltante -$${Math.abs(cierre.diferenciaArqueo).toLocaleString('es-AR')}`,
                      ok: false,
                    };

            return (
              <article
                key={cierre.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden"
              >
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 font-heading text-sm sm:text-base font-black text-purple-950">
                        <Calendar className="w-4 h-4 text-[#d97786]" />
                        {cierre.fechaLegible}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Cierre {cierre.horaCierre} hs
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${diffBadge.clase}`}
                      >
                        {diffBadge.ok ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {diffBadge.texto}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span>
                        <strong className="text-purple-950 font-mono text-sm">
                          $ {cierre.totalVentas.toLocaleString('es-AR')}
                        </strong>{' '}
                        ({cierre.cantidadVentas} ventas • {cierre.cantidadArticulos} art.)
                      </span>
                      <span className="text-emerald-700 font-semibold">
                        Efvo: ${cierre.ventasEfectivo.toLocaleString('es-AR')}
                      </span>
                      <span className="text-purple-800 font-semibold">
                        Transf: ${cierre.ventasTransferencia.toLocaleString('es-AR')}
                      </span>
                      <span className="text-sky-800 font-semibold">
                        Débito: ${cierre.ventasDebito.toLocaleString('es-AR')}
                      </span>
                      <span className="text-amber-800 font-semibold">
                        Crédito: ${cierre.ventasCredito.toLocaleString('es-AR')}
                      </span>
                    </div>

                    {cierre.observaciones && (
                      <p className="text-xs text-slate-500 italic">
                        Nota: {cierre.observaciones}
                      </p>
                    )}
                  </div>

                  {/* Acciones del cierre */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => exportarCierreExcelCSV(cierre)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold cursor-pointer"
                      title="Descargar Excel (.csv)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Excel</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => imprimirResumenCierrePDF(cierre)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold cursor-pointer"
                      title="Abrir resumen para guardar como PDF o imprimir"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopiarCierre(cierre)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold cursor-pointer"
                      title="Copiar resumen para WhatsApp"
                    >
                      {copiadoId === cierre.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandidoId(abierto ? null : cierre.id)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#fef5f6] hover:bg-[#fae6ea] text-[#7a3140] border border-[#f2d3d8] text-xs font-bold cursor-pointer"
                    >
                      <span>{abierto ? 'Ocultar detalle' : 'Ver detalle'}</span>
                      {abierto ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEliminar(cierre)}
                      aria-label="Eliminar cierre"
                      title="Eliminar cierre del historial"
                      className="p-2 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Detalle Expandido del Cierre */}
                {abierto && (
                  <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/60 space-y-4 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Detalle del Arqueo */}
                      <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-1.5">
                        <p className="font-bold text-purple-950 uppercase text-[11px] tracking-wider mb-1">
                          Arqueo de Efectivo
                        </p>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Cambio inicial</span>
                          <span className="font-mono font-semibold">$ {cierre.fondoInicial.toLocaleString('es-AR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Ventas en efectivo</span>
                          <span className="font-mono font-semibold">+$ {cierre.ventasEfectivo.toLocaleString('es-AR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Salidas / gastos en efectivo</span>
                          <span className="font-mono font-semibold text-rose-700">-$ {cierre.egresosEfectivo.toLocaleString('es-AR')}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-100 font-bold">
                          <span>Esperado en cajón</span>
                          <span className="font-mono">$ {cierre.efectivoEsperadoEnCajon.toLocaleString('es-AR')}</span>
                        </div>
                        <div className="flex justify-between font-bold text-emerald-800">
                          <span>Contado físicamente</span>
                          <span className="font-mono">$ {cierre.efectivoContadoReal.toLocaleString('es-AR')}</span>
                        </div>
                      </div>

                      {/* Salidas / Movimientos del día */}
                      <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-1.5">
                        <p className="font-bold text-purple-950 uppercase text-[11px] tracking-wider mb-1">
                          Salidas y Refuerzos de Efectivo ({cierre.movimientosSnapshot.length})
                        </p>
                        {cierre.movimientosSnapshot.length > 0 ? (
                          <ul className="space-y-1">
                            {cierre.movimientosSnapshot.map((m) => (
                              <li key={m.id} className="flex justify-between gap-2">
                                <span className="text-slate-600 truncate">
                                  <span className="font-mono text-slate-400 mr-1">{m.hora}</span>
                                  {m.concepto}
                                </span>
                                <span
                                  className={`font-mono font-bold shrink-0 ${
                                    m.tipo === 'egreso' ? 'text-rose-700' : 'text-emerald-700'
                                  }`}
                                >
                                  {m.tipo === 'egreso' ? '-' : '+'}$ {m.monto.toLocaleString('es-AR')}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-400">Sin salidas ni retiros de efectivo en este turno.</p>
                        )}
                      </div>
                    </div>

                    {/* Ventas individuales guardadas */}
                    {cierre.ventasSnapshot.length > 0 && (
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                          Detalle de Ventas del Turno ({cierre.ventasSnapshot.length})
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-100">
                              <tr>
                                <th className="py-2 px-3">Ticket</th>
                                <th className="py-2 px-3">Hora</th>
                                <th className="py-2 px-3">Artículos</th>
                                <th className="py-2 px-3">Medios de pago</th>
                                <th className="py-2 px-3 text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {cierre.ventasSnapshot.map((v) => (
                                <tr
                                  key={v.id}
                                  className={v.anulada ? 'opacity-50 line-through bg-rose-50/30' : ''}
                                >
                                  <td className="py-2 px-3 font-mono font-bold">#{v.numeroTicket}</td>
                                  <td className="py-2 px-3 font-mono text-slate-500">{v.hora}</td>
                                  <td className="py-2 px-3">
                                    {v.items.map((it) => `${it.cantidad}× ${it.nombre}`).join(', ')}
                                  </td>
                                  <td className="py-2 px-3">
                                    {v.pagos
                                      .map(
                                        (p) =>
                                          `${ETIQUETAS_MEDIO_PAGO[p.medio].corto} $${p.monto.toLocaleString('es-AR')}`
                                      )
                                      .join(' + ')}
                                  </td>
                                  <td className="py-2 px-3 text-right font-mono font-bold text-purple-950">
                                    $ {v.totalCobrado.toLocaleString('es-AR')}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-10 text-center space-y-2.5">
          <div className="w-14 h-14 rounded-2xl bg-[#fef5f6] border border-[#f2d3d8] text-[#d97786] flex items-center justify-center mx-auto">
            <History className="w-7 h-7" />
          </div>
          <h4 className="font-heading text-base font-black text-purple-950">
            Todavía no hay cierres guardados en este período
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Cuando termines el día en la solapa <strong>Caja de Hoy</strong> y toques <strong>Hacer Arqueo y Cerrar Caja</strong>, cada jornada quedará archivada acá para consultarla cuando quieras o bajarla a Excel y PDF.
          </p>
        </div>
      )}
    </div>
  );
}
