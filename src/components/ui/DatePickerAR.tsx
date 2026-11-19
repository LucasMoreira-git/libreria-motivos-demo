'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatearFechaLegible } from '@/lib/mock-data';

interface DatePickerARProps {
  value: string; // Formato interno ISO "YYYY-MM-DD"
  onChange: (nuevaFechaIso: string) => void;
  min?: string; // Formato ISO "YYYY-MM-DD"
  placeholder?: string;
  id?: string;
  required?: boolean;
  ariaLabel?: string;
}

const MESES_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const DIAS_SEMANA = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

function parseIso(iso?: string): { year: number; month: number; day: number } | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return { year: y, month: m - 1, day: d };
}

function toIso(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function DatePickerAR({
  value,
  onChange,
  min,
  placeholder = 'DD/MM/AAAA',
  id,
  required,
  ariaLabel,
}: DatePickerARProps) {
  const [abierto, setAbierto] = useState(false);
  const parsedValue = parseIso(value);

  const [vistaAnio, setVistaAnio] = useState<number>(() => parsedValue?.year || 2026);
  const [vistaMes, setVistaMes] = useState<number>(() => parsedValue?.month ?? 0);
  const contenedorRef = useRef<HTMLDivElement>(null);

  // Sincronizar mes visible al abrir o cambiar valor externo
  useEffect(() => {
    const p = parseIso(value);
    if (p) {
      setVistaAnio(p.year);
      setVistaMes(p.month);
    }
  }, [value, abierto]);

  // Cerrar al hacer clic afuera o presionar Escape
  useEffect(() => {
    if (!abierto) return;
    const handleClickAfuera = (e: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('mousedown', handleClickAfuera);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickAfuera);
      window.removeEventListener('keydown', handleKey);
    };
  }, [abierto]);

  const irMesAnterior = () => {
    if (vistaMes === 0) {
      setVistaMes(11);
      setVistaAnio((y) => y - 1);
    } else {
      setVistaMes((m) => m - 1);
    }
  };

  const irMesSiguiente = () => {
    if (vistaMes === 11) {
      setVistaMes(0);
      setVistaAnio((y) => y + 1);
    } else {
      setVistaMes((m) => m + 1);
    }
  };

  const seleccionarHoy = () => {
    const hoy = new Date();
    const hoyIso = toIso(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    if (min && hoyIso < min) return;
    onChange(hoyIso);
    setAbierto(false);
  };

  // Construir grilla del mes (lunes = columna 0)
  const primerDiaSemana = (new Date(vistaAnio, vistaMes, 1).getDay() + 6) % 7;
  const diasEnMes = new Date(vistaAnio, vistaMes + 1, 0).getDate();
  const celdas: (number | null)[] = [
    ...Array(primerDiaSemana).fill(null),
    ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
  ];

  const textoMostrado = value ? formatearFechaLegible(value) : '';

  return (
    <div ref={contenedorRef} className="relative">
      <button
        id={id}
        type="button"
        aria-label={ariaLabel}
        aria-required={required}
        aria-expanded={abierto}
        onClick={() => setAbierto((prev) => !prev)}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-900 font-mono text-xs sm:text-sm focus:outline-hidden focus:border-orange-600 focus:bg-white transition-all flex items-center justify-between gap-2 cursor-pointer"
      >
        <span className={textoMostrado ? 'font-bold text-slate-900' : 'text-slate-400'}>
          {textoMostrado || placeholder}
        </span>
        <Calendar className="w-4 h-4 text-orange-600 shrink-0" />
      </button>

      {abierto && (
        <div className="absolute left-0 top-full mt-2 z-[70] w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3.5 animate-in fade-in zoom-in-95 duration-150">
          {/* Cabecera Mes / Año */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={irMesAnterior}
              aria-label="Mes anterior"
              className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-heading text-xs sm:text-sm font-bold text-slate-900">
              {MESES_ES[vistaMes]} {vistaAnio}
            </span>

            <button
              type="button"
              onClick={irMesSiguiente}
              aria-label="Mes siguiente"
              className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Encabezado Días de Semana */}
          <div className="grid grid-cols-7 gap-1 mb-1.5 text-center">
            {DIAS_SEMANA.map((d) => (
              <span
                key={d}
                className="text-[10px] font-bold uppercase text-slate-400 py-1"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Grilla de Días */}
          <div className="grid grid-cols-7 gap-1">
            {celdas.map((dia, idx) => {
              if (dia === null) {
                return <span key={`empty-${idx}`} className="h-8" />;
              }

              const fechaIso = toIso(vistaAnio, vistaMes, dia);
              const seleccionado = fechaIso === value;
              const deshabilitado = Boolean(min && fechaIso < min);

              return (
                <button
                  key={fechaIso}
                  type="button"
                  disabled={deshabilitado}
                  onClick={() => {
                    onChange(fechaIso);
                    setAbierto(false);
                  }}
                  className={`h-8 rounded-lg text-xs font-semibold transition-all flex items-center justify-center ${
                    seleccionado
                      ? 'bg-orange-600 text-white font-bold shadow-xs'
                      : deshabilitado
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-700 hover:bg-orange-50 hover:text-orange-700 cursor-pointer'
                  }`}
                >
                  {dia}
                </button>
              );
            })}
          </div>

          {/* Pie rápido */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-mono">Día / Mes / Año</span>
            <button
              type="button"
              onClick={seleccionarHoy}
              className="font-bold text-orange-600 hover:text-orange-700 px-2 py-1 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
            >
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
