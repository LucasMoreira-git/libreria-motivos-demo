'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gestorHorarios, DATOS_LIBRERIA_MOTIVOS, TURNOS_MOCK } from '@/lib/mock-data';
import { EstadoAtencion } from '@/types/horario';
import { Clock, MapPin, ExternalLink, Calendar, Phone, Sparkles } from 'lucide-react';

const ESTADO_FALLBACK: EstadoAtencion = {
  estaAbierto: true,
  estadoTexto: 'Abierto ahora',
  mensajeDetalle: 'Horario: 09:30 a 13:30 hs y 17:00 a 20:30 hs',
  badgeVariant: 'success',
};

export function ScheduleWidget() {
  const [estado, setEstado] = useState<EstadoAtencion>(ESTADO_FALLBACK);
  const [turnosVisibles, setTurnosVisibles] = useState<boolean>(false);
  const turnosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const actualizar = () => {
      setEstado(gestorHorarios.evaluarEstado(new Date()));
    };
    actualizar();
    const interval = setInterval(actualizar, 60000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer para detonar suavemente la entrada escalonada de las filas de turnos
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
      className="w-full my-8 sm:my-12 scroll-mt-24"
    >
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm overflow-hidden relative">
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

          {/* Badge en Vivo (sin efectos pulsantes ni rebotes) */}
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

        {/* Cuadrícula de Turnos + Ubicación */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
          
          {/* Columna Izquierda: Desglose de Turnos Independientes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Turnos Semanales
            </h4>

            <div ref={turnosRef} className="space-y-2 text-xs sm:text-sm">
              {/* Fila 1: Lunes a Viernes (Slide-up escalonado 1) */}
              <div
                className={`p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-start transition-all duration-400 ease-out delay-[100ms] ${
                  turnosVisibles ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
              >
                <div>
                  <span className="font-heading font-bold text-slate-900">Lunes a Viernes</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">Turno mañana y turno tarde</span>
                </div>
                <div className="text-right font-medium text-slate-700">
                  <p>09:30 a 13:30 hs</p>
                  <p>17:00 a 20:30 hs</p>
                </div>
              </div>

              {/* Fila 2: Sábados (Slide-up escalonado 2) */}
              <div
                className={`p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center transition-all duration-400 ease-out delay-[220ms] ${
                  turnosVisibles ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
              >
                <div>
                  <span className="font-heading font-bold text-slate-900">Sábados</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">Turno mañana</span>
                </div>
                <span className="font-medium text-slate-700">10:00 a 13:30 hs</span>
              </div>

              {/* Fila 3: Domingos y Feriados (Slide-up escalonado 3) */}
              <div
                className={`p-3 rounded-2xl bg-slate-50/50 border border-slate-100/60 flex justify-between items-center text-slate-400 transition-all duration-400 ease-out delay-[340ms] ${
                  turnosVisibles ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
              >
                <span className="font-medium">Domingos y Feriados</span>
                <span className="text-xs italic">Cerrado</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Modalidad de Atención y Retiro en Local */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-slate-500" />
              Retiro y Atención en Local
            </h4>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 text-xs sm:text-sm">
              <div>
                <p className="font-heading font-bold text-slate-900">
                  Retiro Inmediato de Pedidos
                </p>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  Podés enviar tu lista de útiles o pedido de oficina por WhatsApp y pasar a retirarlo preparado durante cualquiera de nuestros turnos de atención.
                </p>
                <p className="text-slate-500 text-[11px] mt-1">
                  Aceptamos efectivo, tarjetas de débito/crédito y transferencias bancarias directas.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-3">
                <a
                  href="#ubicacion"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ver mapa y cómo llegar</span>
                </a>

                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  Guaymallén, Mendoza
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
