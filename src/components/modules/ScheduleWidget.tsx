'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { gestorHorarios, parsearDiasSemanaDesdeTexto } from '@/lib/mock-data';
import { EstadoAtencion } from '@/types/horario';
import { HorarioAtencionAdmin } from '@/types/admin';
import { Clock, Sparkles, Sun, CalendarDays, Moon } from 'lucide-react';

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
  const parseados = parsearDiasSemanaDesdeTexto(diasTexto);
  if (parseados.length > 0) return parseados;
  if (fallback && fallback.length > 0) return fallback;
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
          : [
              {
                inicio: t.horaInicioHA?.slice(0, 5) || '',
                fin: t.horaFinHA?.slice(0, 5) || '',
              },
            ],
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

  const obtenerIconoGrupo = (grupo: GrupoHorario, esHoy: boolean) => {
    if (grupo.esCerrado) {
      return <Moon className={`w-5 h-5 ${esHoy ? 'text-[#d97786]' : 'text-slate-400'}`} />;
    }
    if (grupo.diasSemana.includes(6) && grupo.diasSemana.length === 1) {
      return <CalendarDays className={`w-5 h-5 ${esHoy ? 'text-white' : 'text-purple-700'}`} />;
    }
    return <Sun className={`w-5 h-5 ${esHoy ? 'text-white' : 'text-amber-500'}`} />;
  };

  return (
    <section
      id="horarios"
      aria-label="Horarios de atención"
      className="w-full my-8 sm:my-12 scroll-mt-24"
    >
      <div className="w-full bg-gradient-to-br from-white via-[#fffafc] to-[#f8f4fd] rounded-3xl border border-[#eed8e2] p-6 sm:p-8 lg:p-10 shadow-sm overflow-hidden relative">
        {/* Decoración ambiental sutil */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#f4d0d6]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[#ded0f2]/35 blur-3xl pointer-events-none" />

        {/* Encabezado Llamativo con Estado en Vivo */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-purple-100/90 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#d97786] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d97786]" />
              Atención Presencial en Guaymallén
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Horarios de Atención
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Te esperamos en nuestro local durante nuestros turnos semanales de atención.
            </p>
          </div>

          {/* Badge en Vivo Destacado */}
          <div className="shrink-0">
            {estado.estaAbierto ? (
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
                </span>
                <div className="text-left">
                  <span className="font-heading text-xs sm:text-sm font-extrabold block leading-none">
                    Abierto ahora
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">
                    {estado.mensajeDetalle}
                  </span>
                </div>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-rose-50 text-rose-800 border border-rose-300 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <div className="text-left">
                  <span className="font-heading text-xs sm:text-sm font-extrabold block leading-none">
                    Cerrado ahora
                  </span>
                  <span className="text-[11px] text-rose-700 font-medium block mt-0.5">
                    {estado.mensajeDetalle}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grilla Protagonista a Ancho Completo */}
        <div
          ref={turnosRef}
          className="relative z-10 mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5"
        >
          {gruposHorarios.map((grupo, idx) => {
            const esHoy = diaActual !== null && grupo.diasSemana.includes(diaActual);

            return (
              <div
                key={grupo.clave}
                style={{ transitionDelay: `${Math.min(idx * 110, 330)}ms` }}
                className={`rounded-2xl p-5 sm:p-6 border flex flex-col justify-between gap-4 transition-all duration-500 ease-out ${
                  turnosVisibles
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                } ${
                  esHoy
                    ? 'bg-gradient-to-br from-[#fef5f6] via-white to-[#fdf0f3] border-2 border-[#d97786] shadow-md ring-4 ring-[#d97786]/10'
                    : grupo.esCerrado
                      ? 'bg-slate-50/80 border-slate-200/80 text-slate-500'
                      : 'bg-white border-slate-200/90 shadow-2xs hover:shadow-md hover:border-purple-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        esHoy && !grupo.esCerrado
                          ? 'bg-[#d97786] shadow-sm'
                          : esHoy && grupo.esCerrado
                            ? 'bg-rose-100 border border-rose-200'
                            : grupo.esCerrado
                              ? 'bg-slate-100 border border-slate-200'
                              : 'bg-[#f4eefb] border border-[#e5d9f5]'
                      }`}
                    >
                      {obtenerIconoGrupo(grupo, esHoy)}
                    </div>

                    {esHoy && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#d97786] text-white shadow-xs">
                        Hoy
                      </span>
                    )}
                  </div>

                  <div>
                    <h4
                      className={`font-heading text-lg font-extrabold tracking-tight ${
                        grupo.esCerrado && !esHoy ? 'text-slate-600' : 'text-slate-900'
                      }`}
                    >
                      {grupo.diasTexto}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{grupo.subtitulo}</p>
                  </div>
                </div>

                {/* Franjas Horarias Destacadas */}
                <div className="pt-3 border-t border-slate-100/90">
                  {grupo.esCerrado || grupo.franjas.length === 0 ? (
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100/90 text-slate-500 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>Local cerrado</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {grupo.franjas.map((f, fIdx) => (
                        <div
                          key={fIdx}
                          className={`inline-flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl font-mono text-xs sm:text-sm font-bold ${
                            esHoy
                              ? 'bg-[#fef5f6] text-[#6e2e38] border border-[#f2d3d8]'
                              : 'bg-slate-50 text-slate-800 border border-slate-200/70'
                          }`}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Clock
                              className={`w-3.5 h-3.5 shrink-0 ${
                                esHoy ? 'text-[#d97786]' : 'text-slate-400'
                              }`}
                            />
                            <span>
                              {f.inicio} a {f.fin} hs
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
