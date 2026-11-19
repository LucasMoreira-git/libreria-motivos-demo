'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Tag,
  Package,
  FolderTree,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Percent,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { evaluarAlertasNegocio } from '@/lib/admin-alertas';
import { formatearFechaLegible } from '@/lib/mock-data';

export default function AdminAlertasPage() {
  const { productos, categorias, promociones, horarios } = useAdmin();
  const [fechaHoy, setFechaHoy] = useState<Date | null>(null);

  useEffect(() => {
    setFechaHoy(new Date());
  }, []);

  const resumen = useMemo(() => {
    const ref = fechaHoy || new Date(2026, 10, 19);
    return evaluarAlertasNegocio({
      productos,
      categorias,
      promociones,
      horarios,
      fechaReferencia: ref,
    });
  }, [productos, categorias, promociones, horarios, fechaHoy]);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#d97786]" />
            <span>Avisos del Local</span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                resumen.totalAlertas > 0
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {resumen.totalAlertas > 0
                ? `${resumen.totalAlertas} para revisar`
                : 'Todo al día'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Control automático de promociones por vencer, productos con pocas unidades, categorías y horarios.
          </p>
        </div>
      </div>

      {/* Grilla de 4 Tarjetas de Control Real */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Promociones por vencer o vencidas */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#f4d0d6] shadow-2xs flex flex-col justify-between gap-4">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#fef5f6] text-[#d97786] flex items-center justify-center border border-[#f4d0d6]">
                  <Tag className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    Promociones por vencer o vencidas
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Detecta campañas cuya fecha de fin ya pasó o termina en los próximos 10 días
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                  resumen.promosAlerta.length > 0
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {resumen.promosAlerta.length}
              </span>
            </div>

            {resumen.promosAlerta.length > 0 ? (
              <div className="space-y-2">
                {resumen.promosAlerta.map(({ promocion, diasRestantes, vencida }) => (
                  <div
                    key={promocion.idPromocion}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                      vencida
                        ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                        : 'bg-amber-50/70 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-bold truncate">{promocion.nombrePromocion}</p>
                      <p className="text-[11px] opacity-80">
                        Termina el {formatearFechaLegible(promocion.fechaFinPromocion)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                        vencida ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                      }`}
                    >
                      {vencida
                        ? `Venció hace ${Math.abs(diasRestantes)} día${Math.abs(diasRestantes) === 1 ? '' : 's'}`
                        : diasRestantes === 0
                          ? 'Vence hoy'
                          : `Faltan ${diasRestantes} día${diasRestantes === 1 ? '' : 's'}`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No hay promociones vencidas ni próximas a vencer en los próximos 10 días.</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <Link
              href="/admin/promociones"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d97786] hover:text-[#c46372]"
            >
              <span>Revisar promociones</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2. Productos con pocas unidades o descuentos por finalizar */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200/80 shadow-2xs flex flex-col justify-between gap-4">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                  <Package className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    Pocas unidades y descuentos por vencer
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Artículos marcados con stock limitado o descuentos que terminan pronto
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                  resumen.productosStockLimitado.length + resumen.descuentosPorVencer.length > 0
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {resumen.productosStockLimitado.length + resumen.descuentosPorVencer.length}
              </span>
            </div>

            {resumen.productosStockLimitado.length > 0 || resumen.descuentosPorVencer.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {resumen.productosStockLimitado.map((prod) => (
                  <div
                    key={`stock-${prod.idProducto}`}
                    className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-bold text-slate-900 truncate">{prod.nombreProducto}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shrink-0">
                      Pocas unidades
                    </span>
                  </div>
                ))}

                {resumen.descuentosPorVencer.map(({ producto, diasRestantes }) => (
                  <div
                    key={`desc-${producto.idProducto}`}
                    className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Percent className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="font-bold text-slate-900 truncate">{producto.nombreProducto}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shrink-0">
                      {diasRestantes === 0
                        ? 'Descuento termina hoy'
                        : `Descuento: ${diasRestantes}d`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ningún artículo tiene aviso de pocas unidades ni descuentos por finalizar.</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <Link
              href="/admin/productos"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900"
            >
              <span>Ver productos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3. Productos sin categoría visible */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#ded0f2] shadow-2xs flex flex-col justify-between gap-4">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#ede4f6] text-purple-800 flex items-center justify-center border border-[#ded0f2]">
                  <FolderTree className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    Productos sin categoría visible
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Asegura que todos los artículos aparezcan dentro de un rubro visible en la página
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                  resumen.productosSinCategoria.length > 0
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {resumen.productosSinCategoria.length}
              </span>
            </div>

            {resumen.productosSinCategoria.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {resumen.productosSinCategoria.map((prod) => (
                  <div
                    key={prod.idProducto}
                    className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs flex items-center justify-between gap-3"
                  >
                    <span className="font-bold text-slate-900 truncate">{prod.nombreProducto}</span>
                    <span className="text-[11px] text-rose-700 font-semibold shrink-0">
                      Sin rubro activo
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Todos los productos visibles tienen asignada una categoría activa.</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <Link
              href="/admin/categorias"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 hover:text-purple-700"
            >
              <span>Revisar categorías</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4. Revisión de horarios de atención */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-200/80 shadow-2xs flex flex-col justify-between gap-4">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Clock className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    Control de horarios de atención
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Verifica que haya turnos abiertos activos y con horas de apertura y cierre válidas
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                  resumen.sinHorariosAbiertos || resumen.horariosInvalidos.length > 0
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {resumen.horariosInvalidos.length + (resumen.sinHorariosAbiertos ? 1 : 0)}
              </span>
            </div>

            {resumen.sinHorariosAbiertos || resumen.horariosInvalidos.length > 0 ? (
              <div className="space-y-2">
                {resumen.sinHorariosAbiertos && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>No hay ningún turno de atención abierto configurado en este momento.</span>
                  </div>
                )}
                {resumen.horariosInvalidos.map((h) => (
                  <div
                    key={h.idHorarioAtencion}
                    className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-2"
                  >
                    <span className="font-bold">
                      {h.diasTextoHA} — {h.nombreTurnoHA}
                    </span>
                    <span className="font-mono text-[11px]">
                      {h.horaInicioHA} a {h.horaFinHA} (revisar rango)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Todos los turnos activos están configurados correctamente y se muestran en la web.</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <Link
              href="/admin/horarios"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900"
            >
              <span>Editar horarios</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
