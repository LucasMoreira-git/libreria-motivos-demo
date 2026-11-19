'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { AdminSimulationToolbar } from '@/components/admin/AdminSimulationToolbar';
import { CajaDiariaWidget } from '@/components/admin/CajaDiariaWidget';
import { evaluarAlertasNegocio } from '@/lib/admin-alertas';

export default function AdminDashboardPage() {
  const { productos, categorias, promociones, horarios } = useAdmin();
  const [fechaHoy, setFechaHoy] = useState<Date | null>(null);

  useEffect(() => {
    setFechaHoy(new Date());
  }, []);

  const fechaFormateada = useMemo(() => {
    if (!fechaHoy) return 'Hoy';
    return new Intl.DateTimeFormat('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(fechaHoy);
  }, [fechaHoy]);

  const resumenAlertas = useMemo(() => {
    if (!fechaHoy) return null;
    return evaluarAlertasNegocio({
      productos,
      categorias,
      promociones,
      horarios,
      fechaReferencia: fechaHoy,
    });
  }, [productos, categorias, promociones, horarios, fechaHoy]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Cabecera Principal */}
      <header className="bg-gradient-to-br from-[#fef5f6] via-[#fbf0f2] to-[#ede4f6] rounded-3xl p-6 sm:p-7 border border-[#f2d3d8] shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900/80 bg-white/80 px-2.5 py-0.5 rounded-full border border-purple-200/70">
              Librería Motivos • Panel de Gestión
            </span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-purple-950 tracking-tight">
            ¡Bienvenido al Panel de tu Librería!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Usá el menú de la izquierda para administrar categorías, promociones, productos y horarios del local.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-start md:self-center shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 border border-[#ded0f2] text-xs font-bold text-purple-950 shadow-2xs">
            <Calendar className="w-4 h-4 text-[#d97786]" />
            <span className="capitalize">{fechaFormateada}</span>
          </div>
        </div>
      </header>

      {/* Herramienta de Sincronización */}
      <AdminSimulationToolbar />

      {/* 2. Ventas del Día y Conteo Rápido de Caja */}
      <CajaDiariaWidget />

      {/* 3. Acceso a la Sección de Avisos del Local */}
      {resumenAlertas && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                resumenAlertas.totalAlertas > 0
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              }`}
            >
              {resumenAlertas.totalAlertas > 0 ? (
                <Bell className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                {resumenAlertas.totalAlertas > 0
                  ? `Tenés ${resumenAlertas.totalAlertas} ${resumenAlertas.totalAlertas === 1 ? 'aviso pendiente' : 'avisos pendientes'} para revisar`
                  : 'Todo está al día en tu librería'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {resumenAlertas.totalAlertas > 0
                  ? 'Revisá vencimientos de promociones, productos con pocas unidades o categorías desde la sección de avisos.'
                  : 'Las promociones vigentes, productos y horarios de atención no presentan inconvenientes.'}
              </p>
            </div>
          </div>

          <Link
            href="/admin/alertas"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-white text-xs font-bold transition-all active:scale-95 shrink-0 min-h-[42px]"
          >
            <span>Ir a Avisos del Local</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
