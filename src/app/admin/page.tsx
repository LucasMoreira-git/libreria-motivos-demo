'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  Bell,
  CheckCircle2,
  Calculator,
  Banknote,
  Package,
  Tag,
  Clock,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { evaluarAlertasNegocio } from '@/lib/admin-alertas';
import {
  ResumenCajaEnVivo,
  apiListarHistorialCierres,
  apiObtenerCajaActual,
  calcularResumenCaja,
  cargarCajaAbierta,
  cargarHistorialCierres,
} from '@/lib/caja-diaria';

export default function AdminDashboardPage() {
  const { productos, categorias, promociones, horarios } = useAdmin();
  const [fechaHoy, setFechaHoy] = useState<Date | null>(null);
  const [resumenCaja, setResumenCaja] = useState<ResumenCajaEnVivo | null>(null);
  const [totalCierresGuardados, setTotalCierresGuardados] = useState<number>(0);

  useEffect(() => {
    setFechaHoy(new Date());

    const cargarEstadoCaja = () => {
      setResumenCaja(calcularResumenCaja(cargarCajaAbierta()));
      setTotalCierresGuardados(cargarHistorialCierres().length);
    };

    cargarEstadoCaja();

    // Sincronizar con MySQL si el backend está en línea
    let cancelado = false;
    (async () => {
      const [cajaRemota, historialRemoto] = await Promise.all([
        apiObtenerCajaActual(),
        apiListarHistorialCierres(),
      ]);
      if (cancelado) return;
      if (cajaRemota) setResumenCaja(calcularResumenCaja(cajaRemota));
      if (historialRemoto) setTotalCierresGuardados(historialRemoto.length);
    })();

    window.addEventListener('motivos-caja-updated', cargarEstadoCaja);
    window.addEventListener('storage', cargarEstadoCaja);
    return () => {
      cancelado = true;
      window.removeEventListener('motivos-caja-updated', cargarEstadoCaja);
      window.removeEventListener('storage', cargarEstadoCaja);
    };
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
    <div className="space-y-6">
      {/* 1. Bienvenida limpia, breve y cercana */}
      <header className="bg-gradient-to-br from-[#fef5f6] via-[#fbf0f2] to-[#ede4f6] rounded-3xl p-6 sm:p-7 border border-[#f2d3d8] shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900/80 bg-white/80 px-2.5 py-0.5 rounded-full border border-purple-200/70">
              Librería Motivos
            </span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-purple-950 tracking-tight">
            ¡Hola! Bienvenido a tu librería
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Todo lo que necesitás para el día a día del local, en un solo lugar.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 border border-[#ded0f2] text-xs font-bold text-purple-950 shadow-2xs">
            <Calendar className="w-4 h-4 text-[#d97786]" />
            <span className="capitalize">{fechaFormateada}</span>
          </div>
        </div>
      </header>

      {/* 2. Resumen Rápido de Caja de Hoy */}
      <section className="bg-white rounded-3xl border border-[#ded0f2] shadow-sm p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#fef5f6] border border-[#f2d3d8] text-[#d97786] flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base sm:text-lg font-black text-purple-950 leading-tight">
                Caja de Hoy
              </h3>
              <p className="text-xs text-slate-500">
                {resumenCaja
                  ? `${resumenCaja.cantidadVentas} ${resumenCaja.cantidadVentas === 1 ? 'venta registrada' : 'ventas registradas'} • ${totalCierresGuardados} ${totalCierresGuardados === 1 ? 'cierre guardado' : 'cierres guardados'} en historial`
                  : 'Cargando resumen de caja...'}
              </p>
            </div>
          </div>

          {resumenCaja && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              <div className="rounded-2xl p-3.5 bg-gradient-to-br from-[#58285f] to-[#8a3b58] text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-100/90 block">
                  Total Vendido Hoy
                </span>
                <span className="font-heading text-2xl font-black tracking-tight mt-0.5 block">
                  $ {resumenCaja.totalVentas.toLocaleString('es-AR')}
                </span>
              </div>

              <div className="rounded-2xl p-3.5 bg-emerald-50/80 border border-emerald-200/90">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                  Efectivo Esperado en Cajón
                </span>
                <span className="font-heading text-2xl font-black text-emerald-950 tracking-tight mt-0.5 block">
                  $ {resumenCaja.efectivoEsperadoEnCajon.toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          )}
        </div>

        <Link
          href="/admin/caja"
          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#d97786] hover:bg-[#c46372] text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all active:scale-95 shrink-0 min-h-[48px]"
        >
          <Calculator className="w-4 h-4 shrink-0" />
          <span>Ir a Caja y Ventas</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </Link>
      </section>

      {/* 3. Avisos del Local */}
      {resumenAlertas && (
        <section className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        </section>
      )}

      {/* 4. Accesos Rápidos Livianos */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Link
          href="/admin/productos"
          className="group bg-white hover:bg-[#fdf8fc] rounded-2xl p-4 border border-slate-200/90 hover:border-[#ded0f2] shadow-2xs transition-all flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="font-heading text-xs sm:text-sm font-bold text-purple-950 truncate">
                Actualizar precios y fotos
              </p>
              <p className="text-[11px] text-slate-500 truncate">Ir a Productos</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#d97786] group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>

        <Link
          href="/admin/promociones"
          className="group bg-white hover:bg-[#fdf8fc] rounded-2xl p-4 border border-slate-200/90 hover:border-[#f2d3d8] shadow-2xs transition-all flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-[#fef5f6] text-[#d97786] border border-[#f2d3d8] flex items-center justify-center shrink-0">
              <Tag className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="font-heading text-xs sm:text-sm font-bold text-purple-950 truncate">
                Publicar una promo nueva
              </p>
              <p className="text-[11px] text-slate-500 truncate">Ir a Promociones</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#d97786] group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>

        <Link
          href="/admin/horarios"
          className="group bg-white hover:bg-[#fdf8fc] rounded-2xl p-4 border border-slate-200/90 hover:border-emerald-200 shadow-2xs transition-all flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="font-heading text-xs sm:text-sm font-bold text-purple-950 truncate">
                Ajustar turnos y feriados
              </p>
              <p className="text-[11px] text-slate-500 truncate">Ir a Horarios</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>
      </section>
    </div>
  );
}
