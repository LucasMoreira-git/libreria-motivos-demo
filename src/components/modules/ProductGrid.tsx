'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Producto, TipoCategoria } from '@/types/catalogo';
import { PRODUCTOS_MOCK, CATEGORIAS_MOCK } from '@/lib/mock-catalogo';
import { CategoryChips } from '@/components/modules/CategoryChips';
import { ProductCard } from '@/components/modules/ProductCard';
import { ProductModal } from '@/components/modules/ProductModal';
import { Search, PackageSearch, X } from 'lucide-react';

interface ProductGridProps {
  productosIniciales?: Producto[];
  categorias?: TipoCategoria[];
}

export function ProductGrid({
  productosIniciales = PRODUCTOS_MOCK,
  categorias = CATEGORIAS_MOCK,
}: ProductGridProps) {
  const [categoriaSeleccionadaId, setCategoriaSeleccionadaId] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState<string>('');
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  // Mapa de referencias a los elementos de tarjeta para el IntersectionObserver de scroll
  const cardElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  // Manejo de cambio de categoría con transición fluida (fade out -> actualización -> fade in)
  const handleSeleccionarCategoria = (nuevaCategoriaId: string) => {
    if (nuevaCategoriaId === categoriaSeleccionadaId) return;
    setIsFiltering(true);
    setTimeout(() => {
      setCategoriaSeleccionadaId(nuevaCategoriaId);
      setIsFiltering(false);
    }, 180);
  };

  // Filtrado reactivo de productos
  const productosFiltrados = useMemo(() => {
    return productosIniciales.filter((producto) => {
      const coincideCategoria =
        categoriaSeleccionadaId === 'todos' ||
        producto.categoriaId === categoriaSeleccionadaId;

      const terminoLimpio = busqueda.trim().toLowerCase();
      const coincideBusqueda =
        terminoLimpio === '' ||
        producto.nombre.toLowerCase().includes(terminoLimpio) ||
        producto.detalle.toLowerCase().includes(terminoLimpio) ||
        (producto.categoriaNombre && producto.categoriaNombre.toLowerCase().includes(terminoLimpio));

      return coincideCategoria && coincideBusqueda;
    });
  }, [productosIniciales, categoriaSeleccionadaId, busqueda]);

  // IntersectionObserver: Revelación progresiva al hacer scroll
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // Fallback si el navegador no soporta IntersectionObserver: marcar todas como revealed
      cardElementsRef.current.forEach((el) => {
        if (el) el.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    cardElementsRef.current.forEach((element) => {
      if (element) {
        // Si el elemento ya está dentro de la vista inicial, se revela rápidamente
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
          element.classList.add('revealed');
        } else {
          observer.observe(element);
        }
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [productosFiltrados, isFiltering]);

  return (
    <section 
      id="catalogo"
      aria-label="Catálogo de Productos"
      className="w-full my-6 sm:my-8 space-y-5 scroll-mt-24"
    >
      {/* Encabezado del Catálogo: Título con Poppins + Buscador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Catálogo de Artículos
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#fbecee] text-[#6e2e38] border border-[#f4d0d6]">
              {productosFiltrados.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Precios y disponibilidad directa de nuestro local en Guaymallén.
          </p>
        </div>

        {/* Campo de Búsqueda Rápida con registro táctil y z-index optimizado para móviles */}
        <div className="relative w-full sm:w-72 z-10 pointer-events-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar cuaderno, lápiz, resma..."
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#d97786]/30 focus:border-[#d97786] shadow-2xs transition-all duration-200 ease-out touch-manipulation pointer-events-auto relative z-1"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 active:scale-95 transition-transform touch-manipulation cursor-pointer pointer-events-auto z-20"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Fila Horizontal de Filtro por Categorías (CategoryChips) */}
      <div className="relative z-10 pointer-events-auto">
        <CategoryChips
          categorias={categorias}
          categoriaSeleccionadaId={categoriaSeleccionadaId}
          onSeleccionarCategoria={handleSeleccionarCategoria}
        />
      </div>

      {/* Grilla Responsive de Productos con reorganización y fade fluido */}
      <div 
        className={`catalog-grid-fluid transition-opacity duration-200 ease-out ${
          isFiltering ? 'opacity-20 scale-[0.995]' : 'opacity-100 scale-100'
        }`}
      >
        {productosFiltrados.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {productosFiltrados.map((producto, idx) => (
              <div
                key={producto.id}
                ref={(el) => {
                  if (el) {
                    cardElementsRef.current.set(producto.id, el);
                  } else {
                    cardElementsRef.current.delete(producto.id);
                  }
                }}
                className="scroll-reveal-card h-full"
                style={{
                  transitionDelay: `${Math.min(idx * 35, 280)}ms`,
                }}
              >
                <ProductCard 
                  producto={producto} 
                  onVerDetalle={setProductoSeleccionado}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Estado vacío si no hay coincidencias */
          <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center shadow-2xs animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-[#fef5f6] text-[#d97786] border border-[#f4d0d6] flex items-center justify-center mb-3">
              <PackageSearch className="w-7 h-7" />
            </div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900">
              No encontramos productos con ese criterio
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">
              {busqueda
                ? `No hay artículos que coincidan con "${busqueda}". Probá con otro término o limpiá el filtro.`
                : 'No hay artículos en esta categoría en este momento.'}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setBusqueda('');
                  handleSeleccionarCategoria('todos');
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#d97786] text-white hover:bg-[#c46372] active:scale-95 transition-all duration-200 ease-out shadow-xs cursor-pointer touch-manipulation"
              >
                Ver todos los productos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalle Rápido de Producto */}
      <ProductModal 
        producto={productoSeleccionado} 
        onCerrar={() => setProductoSeleccionado(null)} 
      />
    </section>
  );
}
