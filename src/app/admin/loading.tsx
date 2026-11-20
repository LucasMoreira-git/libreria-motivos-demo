import React from 'react';

/**
 * Skeleton Screen automático de Next.js App Router para las transiciones
 * entre secciones del Panel de Administración (/admin/*).
 */
export default function AdminLoadingSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando sección del panel"
      className="space-y-6 animate-pulse"
    >
      {/* Cabecera skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-52 rounded-xl bg-[#eadff3]" />
          <div className="h-4 w-80 max-w-full rounded-lg bg-[#f3ecf8]" />
        </div>
        <div className="h-11 w-40 rounded-xl bg-[#f4d7de]" />
      </div>

      {/* Tarjetas de resumen skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="h-24 rounded-2xl bg-white border border-[#eadff3] p-4 space-y-2.5"
          >
            <div className="h-3 w-24 rounded-md bg-[#f1e7f7]" />
            <div className="h-7 w-32 rounded-lg bg-[#e6d6f2]" />
            <div className="h-2.5 w-20 rounded-md bg-[#f5eef9]" />
          </div>
        ))}
      </div>

      {/* Panel principal / Tabla skeleton */}
      <div className="bg-white rounded-3xl border border-[#eadff3] p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="h-10 flex-1 max-w-md rounded-xl bg-[#f5eef9]" />
          <div className="h-9 w-44 rounded-xl bg-[#f5eef9]" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="h-14 rounded-xl bg-[#faf7fc] border border-[#f2e9f7]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
