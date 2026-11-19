'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FolderTree,
  Tag,
  Package,
  Clock,
  ArrowRight,
  Calendar,
  ExternalLink,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { AdminSimulationToolbar } from '@/components/admin/AdminSimulationToolbar';
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

  const catVisibles = categorias.filter((c) => !c.fechaHoraBajaCategoria).length;
  const catOcultas = categorias.filter((c) => c.fechaHoraBajaCategoria).length;

  const promoVisibles = promociones.filter((pr) => !pr.fechaHoraBajaPromocion).length;
  const promoOcultas = promociones.filter((pr) => pr.fechaHoraBajaPromocion).length;

  const prodVisibles = productos.filter((p) => !p.fechaHoraBajaProducto).length;
  const prodOcultos = productos.filter((p) => p.fechaHoraBajaProducto).length;

  const horVisibles = horarios.filter((h) => !h.fechaHoraBajaHA).length;
  const horOcultos = horarios.filter((h) => h.fechaHoraBajaHA).length;

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
            Desde acá podés cargar nuevos artículos, actualizar precios, publicar promociones de temporada y modificar los horarios del local.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-start md:self-center shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 border border-[#ded0f2] text-xs font-bold text-purple-950 shadow-2xs">
            <Calendar className="w-4 h-4 text-[#d97786]" />
            <span className="capitalize">{fechaFormateada}</span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d97786] hover:bg-[#c46372] text-white text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm"
          >
            <span>Ver Página Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Herramienta de Sincronización */}
      <AdminSimulationToolbar />

      {/* 2. Accesos Directos a las 4 Secciones de Gestión */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Categorías */}
        <div className="bg-white rounded-2xl p-5 border border-[#ded0f2] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-[#ede4f6] text-purple-950 flex items-center justify-center font-bold">
                <FolderTree className="w-5 h-5 text-purple-800" />
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#ede4f6] text-purple-950">
                {categorias.length} en total
              </span>
            </div>
            <h3 className="font-heading text-base font-bold text-purple-950 mt-3">
              Categorías
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rubros y secciones de tu catálogo
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-emerald-600">{catVisibles} visibles</span>
              {catOcultas > 0 && (
                <span className="text-slate-400 ml-1.5 font-medium">({catOcultas} ocultas)</span>
              )}
            </div>
            <Link
              href="/admin/categorias"
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-950 hover:text-purple-700 transition-colors group-hover:translate-x-0.5"
            >
              <span>Administrar</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#d97786]" />
            </Link>
          </div>
        </div>

        {/* Promociones */}
        <div className="bg-white rounded-2xl p-5 border border-[#f4d0d6] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-[#fef5f6] text-[#6e2e38] flex items-center justify-center font-bold border border-[#f3cad2]">
                <Tag className="w-5 h-5 text-[#d97786]" />
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#fef5f6] text-[#6e2e38] border border-[#f4d0d6]">
                {promociones.length} en total
              </span>
            </div>
            <h3 className="font-heading text-base font-bold text-purple-950 mt-3">
              Promociones
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Combos de temporada y banners
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#fbecee] flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-emerald-600">{promoVisibles} visibles</span>
              {promoOcultas > 0 && (
                <span className="text-slate-400 ml-1.5 font-medium">({promoOcultas} ocultas)</span>
              )}
            </div>
            <Link
              href="/admin/promociones"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#d97786] hover:text-[#c46372] transition-colors group-hover:translate-x-0.5"
            >
              <span>Administrar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Productos */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold border border-amber-200/60">
                <Package className="w-5 h-5" />
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                {productos.length} en total
              </span>
            </div>
            <h3 className="font-heading text-base font-bold text-purple-950 mt-3">
              Productos
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Artículos escolares, oficina y regalería
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-emerald-600">{prodVisibles} visibles</span>
              {prodOcultos > 0 && (
                <span className="text-slate-400 ml-1.5 font-medium">({prodOcultos} ocultos)</span>
              )}
            </div>
            <Link
              href="/admin/productos"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 transition-colors group-hover:translate-x-0.5"
            >
              <span>Administrar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Horarios */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold border border-emerald-200/60">
                <Clock className="w-5 h-5" />
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                {horarios.length} turnos
              </span>
            </div>
            <h3 className="font-heading text-base font-bold text-purple-950 mt-3">
              Horarios
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Turnos de atención mañana y tarde
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-emerald-600">{horVisibles} visibles</span>
              {horOcultos > 0 && (
                <span className="text-slate-400 ml-1.5 font-medium">({horOcultos} ocultos)</span>
              )}
            </div>
            <Link
              href="/admin/horarios"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900 transition-colors group-hover:translate-x-0.5"
            >
              <span>Administrar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Tarjeta Compacta de Acceso a la Sección Independiente de Avisos */}
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
