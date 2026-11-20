'use client';

import React, { useEffect, useState } from 'react';
import { Calculator, History, Receipt } from 'lucide-react';
import { useAdminFeedback } from '@/context/AdminFeedbackContext';
import {
  CajaAbiertaState,
  CierreCaja,
  cargarCajaAbierta,
  cargarHistorialCierres,
  crearCajaVacia,
  guardarCajaAbierta,
  guardarHistorialCierres,
  obtenerFechaClave,
} from '@/lib/caja-diaria';
import { CajaHoyPanel } from '@/components/admin/CajaHoyPanel';
import { HistorialCierresPanel } from '@/components/admin/HistorialCierresPanel';

export default function CajaAdminPage() {
  const { notificar } = useAdminFeedback();
  const [solapa, setSolapa] = useState<'hoy' | 'historial'>('hoy');
  const [caja, setCaja] = useState<CajaAbiertaState>(() => crearCajaVacia('2026-01-01'));
  const [historial, setHistorial] = useState<CierreCaja[]>([]);
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    setCaja(cargarCajaAbierta());
    setHistorial(cargarHistorialCierres());
    setHidratado(true);
  }, []);

  const handleActualizarCaja = (nuevaCaja: CajaAbiertaState) => {
    setCaja(nuevaCaja);
    guardarCajaAbierta(nuevaCaja);
  };

  const handleGuardarCierre = (cierre: CierreCaja, nuevoFondoManiana: number) => {
    const nuevoHistorial = [cierre, ...historial];
    setHistorial(nuevoHistorial);
    guardarHistorialCierres(nuevoHistorial);

    const nuevaCajaLimpia: CajaAbiertaState = {
      fechaClave: obtenerFechaClave(),
      fondoInicial: nuevoFondoManiana,
      ventas: [],
      movimientosEfectivo: [],
    };
    setCaja(nuevaCajaLimpia);
    guardarCajaAbierta(nuevaCajaLimpia);

    notificar({
      tipo: 'exito',
      titulo: 'Cierre guardado en el Historial',
      mensaje: `Jornada del ${cierre.fechaLegible} cerrada por $ ${cierre.totalVentas.toLocaleString('es-AR')}. Ya podés verla o bajarla a Excel/PDF.`,
    });
    setSolapa('historial');
  };

  const handleEliminarCierre = (id: string) => {
    const actualizado = historial.filter((c) => c.id !== id);
    setHistorial(actualizado);
    guardarHistorialCierres(actualizado);
  };

  const ventasValidasHoy = caja.ventas.filter((v) => !v.anulada).length;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Encabezado y Selector de Solapas: Caja de Hoy | Historial de Cierres */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-purple-950 tracking-tight flex items-center gap-2.5">
            <Calculator className="w-6 h-6 text-[#d97786]" />
            <span>Caja y Ventas</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Registrá cobros del mostrador con varios artículos, controlá el cambio del cajón y consultá tus cierres anteriores.
          </p>
        </div>

        <div className="inline-flex rounded-2xl bg-white p-1.5 border border-[#ded0f2] shadow-2xs self-start md:self-center">
          <button
            type="button"
            onClick={() => setSolapa('hoy')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[42px] ${
              solapa === 'hoy'
                ? 'bg-[#d97786] text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-950 hover:bg-purple-50/70'
            }`}
          >
            <Receipt className="w-4 h-4 shrink-0" />
            <span>Caja de Hoy</span>
            {hidratado && ventasValidasHoy > 0 && (
              <span
                className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                  solapa === 'hoy'
                    ? 'bg-white/25 text-white'
                    : 'bg-[#fef5f6] text-[#8b4f58]'
                }`}
              >
                {ventasValidasHoy}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSolapa('historial')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[42px] ${
              solapa === 'historial'
                ? 'bg-purple-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-950 hover:bg-purple-50/70'
            }`}
          >
            <History className="w-4 h-4 shrink-0" />
            <span>Historial de Cierres</span>
            {hidratado && historial.length > 0 && (
              <span
                className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                  solapa === 'historial'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#ede4f6] text-purple-950'
                }`}
              >
                {historial.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Contenido de la solapa activa */}
      {hidratado &&
        (solapa === 'hoy' ? (
          <CajaHoyPanel
            caja={caja}
            onActualizarCaja={handleActualizarCaja}
            onGuardarCierre={handleGuardarCierre}
          />
        ) : (
          <HistorialCierresPanel
            cierres={historial}
            onEliminarCierre={handleEliminarCierre}
          />
        ))}
    </div>
  );
}
