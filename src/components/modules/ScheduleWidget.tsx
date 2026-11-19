'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { gestorHorarios } from '@/lib/mock-data';
import { EstadoAtencion } from '@/types/horario';
import { HorarioAtencionAdmin } from '@/types/admin';
import { Clock, MapPin, Sparkles, CreditCard, CheckCircle2 } from 'lucide-react';

interface ScheduleWidgetProps {
  horarios?: HorarioAtencionAdmin[];
}

interface GrupoHorario {
  clave: string;
  diasTexto: string;
  diasSemana: number[];
  subtitulo: string;
  franjas: { inicio: string; fin: string }[];
  esCerrado: boolean;
}

const ESTADO_FALLBACK: EstadoAtencion = {
  estaAbierto: true,
  estadoTexto: 'Abierto ahora',
  mensajeDetalle: 'Horario: 09:30 a 13:30 hs y 17:00 a 20:30 hs',
  badgeVariant: 'success',
};

const GRUPOS_DEFAULT: GrupoHorario[] = [
  {
    clave: 'lunes-viernes',
    diasTexto: 'Lunes a Viernes',
    diasSemana: [1, 2, 3, 4, 5],
    subtitulo: 'Turno mañana y turno tarde',
    franjas: [
      { inicio: '09:30', fin: '13:30' },
      { inicio: '17:00', fin: '20:30' },
    ],
    esCerrado: false,
  },
  {
    clave: 'sabados',
    diasTexto: 'Sábados',
    diasSemana: [6],
    subtitulo: 'Turno mañana',
    franjas: [{ inicio: '10:00', fin: '13:30' }],
    esCerrado: false,
  },
  {
    clave: 'domingos-feriados',
    diasTexto: 'Domingos y Feriados',
    diasSemana: [0],
    subtitulo: 'Sin atención presencial',
    franjas: [],
    esCerrado: true,
  },
];

function inferirDiasSemana(diasTexto: string, fallback?: number[]): number[] {
  if (fallback && fallback.length > 0) return fallback;
  const t = diasTexto.toLowerCase();
  if (t.includes('lunes') && t.includes('viernes')) return [1, 2, 3, 4, 5];
  if (t.includes('sábado') || t.includes('sabado')) return [6];
  if (t.includes('domingo')) return [0];
  return [];
}

function agruparTurnosPorDia(turnos: HorarioAtencionAdmin[]): GrupoHorario[] {
  const mapa = new Map<string, GrupoHorario>();

  for (const t of turnos) {
    const clave = t.diasTextoHA.trim().toLowerCase();
    const dias = inferirDiasSemana(t.diasTextoHA, t.diasSemanaHA);
    const existente = mapa.get(clave);

    if (!existente) {
      mapa.set(clave, {
        clave,
        diasTexto: t.diasTextoHA,
        diasSemana: dias,
        subtitulo: t.esCerradoHA ? 'Sin atención presencial' : t.nombreTurnoHA,
        franjas: t.esCerradoHA
          ? []
          : [{ inicio: t.horaInicioHA?.slice(0, 5) || '', fin: t.horaFinHA?.slice(0, 5) || '' }],
        esCerrado: t.esCerradoHA,
      });
    } else {
      const diasCombinados = Array.from(new Set([...existente.diasSemana, ...dias]));
      existente.diasSemana = diasCombinados;

      if (!t.esCerradoHA) {
        existente.esCerrado = false;
        existente.franjas.push({
          inicio: t.horaInicioHA?.slice(0, 5) || '',
          fin: t.horaFinHA?.slice(0, 5) || '',
        });
        if (existente.franjas.length > 1) {
          existente.subtitulo = 'Turno mañana y turno tarde';
        }
      }
    }
  }

  return Array.from(mapa.values());
}

export function ScheduleWidget({ horarios }: ScheduleWidgetProps = {}) {
  const [estado, setEstado] = useState<EstadoAtencion>(ESTADO_FALLBACK);
  const [diaActual, setDiaActual] = useState<number | null>(null);
  const [turnosVisibles, setTurnosVisibles] = useState<boolean>(false);
  const turnosRef = useRef<HTMLDivElement>(null);

  const gruposHorarios = useMemo(() => {
    if (!horarios) return GRUPOS_DEFAULT;
    const activos = horarios.filter((h) => !h.fechaHoraBajaHA);
    if (activos.length === 0) return GRUPOS_DEFAULT;
    return agruparTurnosPorDia(activos);
  }, [horarios]);

  useEffect(() => {
    const actualizar = () => {
      const ahora = new Date();
      setEstado(gestorHorarios.evaluarEstado(ahora));
      setDiaActual(ahora.getDay());
    };
    actualizar();
    const interval = setInterval(actualizar, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setTurnosVisibles(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTurnosVisibles(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    if (turnosRef.current) {
      observer.observe(turnosRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="horarios"
      aria-label="Horarios de atención y ubicación"
      className="w-full my-8 sm:my-10 scroll-mt-24"
    >
      <div className="w-full bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm overflow-hidden relative">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#d97786] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d97786]" />
              Atención Presencial en Guaymallén
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Horarios de Atención & Local
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Atención personalizada con turnos independientes adaptados al barrio.
            </p>
          </div>

          {/* Badge en Vivo */}
          <div className="shrink-0">
            {estado.estaAbierto ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                <span className="font-heading text-xs font-bold">Abierto ahora</span>
                <span className="text-[11px] text-emerald-700 font-medium hidden sm:inline">
                  • {estado.mensajeDetalle}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <span className="font-heading text-xs font-bold">Cerrado</span>
                <span className="text-[11px] text-rose-700 font-medium hidden sm:inline">
                  • {estado.mensajeDetalle}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Cuadrícula Equilibrada de 2 Columnas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* Columna Izquierda: Turnos Agrupados + Resaltado del Día Actual */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Turnos Semanales
            </h4>

            <div ref={turnosRef} className="flex-1 flex flex-col justify-between gap-2.5 text-xs sm:text-sm">
              {gruposHorarios.map((grupo, idx) => {
                const esHoy = diaActual !== null && grupo.diasSemana.includes(diaActual);

                return (
                  <div
                    key={grupo.clave}
                    style={{ transitionDelay: `${Math.min(idx * 100, 300)}ms` }}
                    className={`p-3.5 sm:p-4 rounded-2xl border flex justify-between items-center gap-3 transition-all duration-400 ease-out flex-1 ${
                      turnosVisibles ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                    } ${
                      esHoy
                        ? 'bg-[#fef5f6]/80 border-[#d97786] ring-1 ring-[#d97786]/25 shadow-2xs'
                        : grupo.esCerrado
                          ? 'bg-slate-50/60 border-slate-100 text-slate-400'
                          : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-heading font-bold ${
                            grupo.esCerrado && !esHoy ? 'text-slate-500' : 'text-slate-900'
                          }`}
                        >
                          {grupo.diasTexto}
                        </span>
                        {esHoy && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#d97786] text-white shadow-2xs">
                            Hoy
                          </span>
                        )}
                      </div>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        {grupo.subtitulo}
                      </span>
                    </div>

                    <div className="text-right font-medium text-slate-700 shrink-0">
                      {grupo.esCerrado || grupo.franjas.length === 0 ? (
                        <span className="text-xs italic text-slate-400">Cerrado</span>
                      ) : (
                        <div className="space-y-0.5 font-mono text-xs sm:text-sm font-semibold text-slate-800">
                          {grupo.franjas.map((f, fIdx) => (
                            <p key={fIdx}>
                              {f.inicio} a {f.fin} hs
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha Equilibrada: 2 Tarjetas (Retiro + Medios de Pago Clarificados) */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-slate-500" />
              Modalidad de Retiro & Pagos
            </h4>

            <div className="flex-1 flex flex-col justify-between gap-3 text-xs sm:text-sm">
              {/* Tarjeta 1: Retiro de Pedidos */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-heading font-bold text-slate-900">
                    Retiro Inmediato de Pedidos
                  </p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    Armado en el turno
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Enviá tu lista de útiles o pedido de oficina por WhatsApp y retiralo preparado dentro del mismo turno comercial sin hacer fila.
                </p>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-3">
                  <a
                    href="#ubicacion"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs hover:-translate-y-0.5 active:scale-95 transition-all duration-200 min-h-[40px]"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-300" />
                    <span>Ver mapa y cómo llegar</span>
                  </a>

                  <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                    Guaymallén, Mendoza
                  </span>
                </div>
              </div>

              {/* Tarjeta 2: Aclaración Unificada de Medios de Pago y Crédito */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-1.5">
                <div className="flex items-center gap-2 font-heading font-bold text-slate-900">
                  <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Medios de Pago Aceptados</span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">
                  Los precios publicados en la web son de <strong>pago contado/transf.</strong> (efectivo, débito o transferencia bancaria en el local, sin recargo).
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>Tarjetas de crédito:</strong> también aceptamos en el local (consultanos cuotas o recargo vigente por WhatsApp antes de retirar).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
