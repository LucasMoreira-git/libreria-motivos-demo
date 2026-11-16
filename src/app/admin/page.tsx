'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FolderTree, 
  Tag, 
  Package, 
  Clock, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Info,
  CalendarCheck,
  ExternalLink
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { AdminSimulationToolbar } from '@/components/admin/AdminSimulationToolbar';

// Función para calcular los días restantes de una vigencia respecto a la fecha simulada (26 de octubre de 2026)
function calcularDiasRestantes(fechaStr?: string): number | null {
  if (!fechaStr) return null;
  if (fechaStr.includes('/')) {
    const [d, m, y] = fechaStr.split('/').map(Number);
    if (!d || !m || !y) return null;
    const fechaFin = new Date(y, m - 1, d);
    const fechaRef = new Date(2026, 9, 26); // 26/10/2026
    const diffMs = fechaFin.getTime() - fechaRef.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }
  const fechaFin = new Date(fechaStr);
  if (isNaN(fechaFin.getTime())) return null;
  const fechaRef = new Date(2026, 9, 26);
  const diffMs = fechaFin.getTime() - fechaRef.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export default function AdminDashboardPage() {
  const { productos, categorias, promociones, horarios } = useAdmin();

  // Métricas de módulos (ABMs)
  const catActivas = categorias.filter((c) => !c.fechaHoraBajaCategoria).length;
  const catBajas = categorias.filter((c) => c.fechaHoraBajaCategoria).length;

  const promoActivas = promociones.filter((pr) => !pr.fechaHoraBajaPromocion).length;
  const promoBajas = promociones.filter((pr) => pr.fechaHoraBajaPromocion).length;

  const prodActivos = productos.filter((p) => !p.fechaHoraBajaProducto).length;
  const prodBajas = productos.filter((p) => p.fechaHoraBajaProducto).length;

  const horActivos = horarios.filter((h) => !h.fechaHoraBajaHA).length;
  const horBajas = horarios.filter((h) => h.fechaHoraBajaHA).length;

  // 1. Alerta Operativa: Promociones próximas a vencer (evaluando fechaHoraFinPromocion)
  const promosProximasAVencer = promociones
    .filter((pr) => !pr.fechaHoraBajaPromocion)
    .map((pr) => ({
      ...pr,
      diasRestantes: calcularDiasRestantes(pr.fechaHoraFinPromocion || pr.fechaFinPromocion),
    }))
    .filter((pr) => pr.diasRestantes !== null && pr.diasRestantes >= 0 && pr.diasRestantes <= 10)
    .sort((a, b) => (a.diasRestantes ?? 0) - (b.diasRestantes ?? 0));

  // 2. Alerta Operativa: Productos sin categoría asignada (evaluando codTC nulo o vacío)
  const prodsSinCategoria = productos.filter(
    (p) => !p.fechaHoraBajaProducto && (!p.codTC || p.codTC.trim() === '')
  );

  // 3. Alerta Operativa: Horarios de atención que requieren revisión
  // Domingo y feriados requiere revisión estacional según relevamiento comercial
  const horariosRevision = horarios.filter(
    (h) => !h.fechaHoraBajaHA && (h.esCerradoHA || h.horaInicioHA === '00:00' || h.diasSemanaHA.includes(0))
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* 1. Cabecera con Paleta de la Marca (Rosa Suave + Lila Pastel) */}
      <header className="bg-gradient-to-br from-[#fef5f6] via-[#fbf0f2] to-[#ede4f6] rounded-3xl p-6 sm:p-7 border border-[#f2d3d8] shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900/80 bg-white/80 px-2.5 py-0.5 rounded-full border border-purple-200/70">
              Sistema Operativo • Librería Motivos
            </span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-purple-950 tracking-tight">
            Panel de Control Operativo
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Supervisión del catálogo de productos, promociones comerciales de temporada y turnos de atención.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-start md:self-center shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 border border-[#ded0f2] text-xs font-bold text-purple-950 shadow-2xs">
            <Calendar className="w-4 h-4 text-[#d97786]" />
            <span>26 de octubre de 2026</span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d97786] hover:bg-[#c46372] text-white text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm"
          >
            <span>Ver Vitrina</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Barra de Simulación y Sincronización con BD (Removible para Producción) */}
      <AdminSimulationToolbar />

      {/* 2. Tarjetas Resumen de los 4 Módulos de Gestión (ABMs) con Colores de la Marca */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Módulo 1: Categorías (Lila / Morado) */}
        <div className="bg-white rounded-2xl p-5 border border-[#ded0f2] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-[#ede4f6] text-purple-950 flex items-center justify-center font-bold">
                <FolderTree className="w-5 h-5 text-purple-800" />
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#ede4f6] text-purple-950">
                {categorias.length} Total
              </span>
            </div>
            <h3 className="font-heading text-base font-bold text-purple-950 mt-3">
              ABM Categorías
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Clasificación y slugs del catálogo
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-emerald-600">{catActivas} activas</span>
              {catBajas > 0 && (
                <span className="text-rose-500 ml-1.5 font-medium">({catBajas} bajas)</span>
              )}
            </div>
            <Link
              href="/admin/categorias"
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-950 hover:text-purple-700 transition-colors group-hover:translate-x-0.5"
            >
              <span>Gestionar</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#d97786]" />
            </Link>
          </div>
        </div>

        {/* Módulo 2: Promociones (Rosado Suave / Blush Rose) */}
        <div className="bg-white rounded-2xl p-5 border border-[#f4d0d6] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-[#fef5f6] text-[#6e2e38] flex items-center justify-center font-bold border border-[#f3cad2]">
                <Tag className="w-5 h-5 text-[#d97786]" />
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#fef5f6] text-[#6e2e38] border border-[#f4d0d6]">
                {promociones.length} Total
              </span>
            </div>
            <h3 className="font-heading text-base font-bold text-purple-950 mt-3">
              ABM Promociones
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Combos, temporadas y vigencias
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#fbecee] flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-emerald-600">{promoActivas} activas</span>
              {promoBajas > 0 && (
                <span className="text-rose-500 ml-1.5 font-medium">({promoBajas} bajas)</span>
              )}
            </div>
            <Link
              href="/admin/promociones"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#d97786] hover:text-[#c46372] transition-colors group-hover:translate-x-0.5"
            >
              <span>Gestionar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Módulo 3: Productos (Ámbar / Nude Cálido) */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold border border-amber-200/60">
                <Package className="w-5 h-5" />
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                {productos.length} Total
              </span>
            </div>
            <h3 className="font-heading text-base font-bold text-purple-950 mt-3">
              ABM Producto
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Artículos escolares, oficina y regalería
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-emerald-600">{prodActivos} activos</span>
              {prodBajas > 0 && (
                <span className="text-rose-500 ml-1.5 font-medium">({prodBajas} bajas)</span>
              )}
            </div>
            <Link
              href="/admin/productos"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 transition-colors group-hover:translate-x-0.5"
            >
              <span>Gestionar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Módulo 4: Horarios (Verde Sabia / Esmeralda) */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold border border-emerald-200/60">
                <Clock className="w-5 h-5" />
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                {horarios.length} Turnos
              </span>
            </div>
            <h3 className="font-heading text-base font-bold text-purple-950 mt-3">
              ABM Horarios
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Turnos mañana, tarde y guardias
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-emerald-600">{horActivos} activos</span>
              {horBajas > 0 && (
                <span className="text-rose-500 ml-1.5 font-medium">({horBajas} bajas)</span>
              )}
            </div>
            <Link
              href="/admin/horarios"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900 transition-colors group-hover:translate-x-0.5"
            >
              <span>Gestionar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* 3. Sección de Alertas Operativas (3 Indicadores del Modelo de Dominio) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-black text-purple-950 tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Alertas Operativas del Negocio</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Supervisión de vigencias, integridad del catálogo y turnos comerciales según el modelo de dominio.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Indicador 1: Promociones Próximas a Vencer */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#ded0f2]/80 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-[#fef5f6] text-[#6e2e38] flex items-center justify-center font-bold border border-[#f4d0d6]">
                  <Tag className="w-5 h-5 text-[#d97786]" />
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fef5f6] text-[#6e2e38] border border-[#f4d0d6]">
                  {promosProximasAVencer.length} por vencer
                </span>
              </div>

              <div>
                <h4 className="font-heading text-base font-bold text-purple-950">
                  Promociones Próximas a Vencer
                </h4>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                  <span className="text-slate-400">Atributo:</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#ede4f6] text-purple-950 font-semibold">
                    fechaHoraFinPromocion
                  </span>
                </div>
              </div>

              {promosProximasAVencer.length > 0 ? (
                <div className="space-y-2 pt-1">
                  <p className="text-xs text-slate-600">
                    Vigencias activas con fecha límite el <strong>31/10/2026</strong> (5 días restantes):
                  </p>
                  <ul className="space-y-2">
                    {promosProximasAVencer.map((pr) => (
                      <li 
                        key={pr.idPromocion}
                        className="p-2.5 rounded-xl bg-[#fef5f6] border border-[#f4d0d6] text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-900 leading-snug">
                            {pr.nombrePromocion}
                          </span>
                          <span className="text-[10px] font-bold text-[#6e2e38] bg-[#fbecee] px-2 py-0.5 rounded-full shrink-0 border border-[#f4d0d6]">
                            {pr.diasRestantes} días
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                          <span>{pr.temporadaPromocion}</span>
                          <span className="font-mono text-slate-600">Fin: {pr.fechaHoraFinPromocion || pr.fechaFinPromocion}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Sin vencimientos urgentes</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    No existen promociones activas con fechaHoraFinPromocion en los próximos 10 días.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <Link
                href="/admin/promociones"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#fef5f6] hover:bg-[#fbecee] text-[#6e2e38] text-xs font-bold transition-all active:scale-98 border border-[#f4d0d6]"
              >
                <span>Gestionar Promociones</span>
                <ArrowRight className="w-4 h-4 text-[#d97786]" />
              </Link>
            </div>
          </div>

          {/* Indicador 2: Productos sin Categoría Asignada */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#ded0f2]/80 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  prodsSinCategoria.length > 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  <FolderTree className="w-5 h-5" />
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  prodsSinCategoria.length > 0
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {prodsSinCategoria.length > 0 ? `${prodsSinCategoria.length} huérfanos` : 'Catálogo Íntegro'}
                </span>
              </div>

              <div>
                <h4 className="font-heading text-base font-bold text-purple-950">
                  Productos sin Categoría Asignada
                </h4>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                  <span className="text-slate-400">Atributo:</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#ede4f6] text-purple-950 font-semibold">
                    codTC (TipoCategoria)
                  </span>
                </div>
              </div>

              {prodsSinCategoria.length > 0 ? (
                <div className="space-y-2 pt-1">
                  <p className="text-xs text-rose-700">
                    Se detectaron artículos con <code>codTC</code> nulo o sin asignar que no se reflejarán correctamente en los filtros de la vitrina:
                  </p>
                  <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {prodsSinCategoria.map((p) => (
                      <li 
                        key={p.idProducto}
                        className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80 text-xs"
                      >
                        <span className="font-bold text-slate-900 block truncate">
                          {p.nombreProducto}
                        </span>
                        <span className="text-[11px] text-rose-600">
                          ID: {p.idProducto} • Falta vincular categoría
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Integridad referencial validada</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    El 100% de los <strong>{prodActivos} productos activos</strong> posee un código de categoría (<code>codTC</code>) asignado. La vitrina pública filtra el catálogo completo sin errores.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <Link
                href="/admin/productos"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#ede4f6] hover:bg-[#ded0f2] text-purple-950 text-xs font-bold transition-all active:scale-98 border border-[#ded0f2]"
              >
                <span>Gestionar Productos</span>
                <ArrowRight className="w-4 h-4 text-[#d97786]" />
              </Link>
            </div>
          </div>

          {/* Indicador 3: Horarios de Atención que Requieren Revisión */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#ded0f2]/80 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold border border-emerald-200">
                  <Clock className="w-5 h-5" />
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {horariosRevision.length} en revisión
                </span>
              </div>

              <div>
                <h4 className="font-heading text-base font-bold text-purple-950">
                  Horarios en Revisión Estacional
                </h4>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                  <span className="text-slate-400">Atributos:</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#ede4f6] text-purple-950 font-semibold">
                    horaInicioHA • horaFinHA
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CalendarCheck className="w-3.5 h-3.5 text-[#d97786]" />
                      Turno Domingos y Feriados
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      Cerrado (00:00 - 00:00)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Sujeto a verificación estacional. En demanda alta (inicio de clases y fechas festivas) se evalúa habilitar guardia vespertina de <strong>14:00/19:00 a 21:00 hs</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#ede4f6]/60 border border-[#ded0f2] text-[11px] text-purple-950">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-purple-700" />
                  <span>
                    El widget en vivo de la vitrina sincroniza en tiempo real según estos turnos.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <Link
                href="/admin/horarios"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-all active:scale-98 border border-emerald-200"
              >
                <span>Gestionar Horarios</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
