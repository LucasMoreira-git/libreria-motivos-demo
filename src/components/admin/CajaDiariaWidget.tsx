'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Banknote,
  ArrowLeftRight,
  CreditCard,
  Search,
  Plus,
  Minus,
  Trash2,
  Receipt,
  CheckCircle2,
  Package,
  PenLine,
  Copy,
  Check,
  X,
  ShoppingBag,
  Sparkles,
  Calculator,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useAdminFeedback } from '@/context/AdminFeedbackContext';
import { ProductoAdmin } from '@/types/admin';
import { DEFAULT_BRAND_IMAGE } from '@/lib/mock-data';

type MedioPago = 'efectivo' | 'transferencia' | 'credito';

interface VentaDiaria {
  id: string;
  hora: string;
  origen: 'catalogo' | 'generico';
  productoId?: string;
  nombre: string;
  detalle?: string;
  precioUnitario: number;
  cantidad: number;
  medioPago: MedioPago;
}

const STORAGE_KEY = 'motivos_caja_diaria_v1';

const SUGERENCIAS_GENERICAS = [
  'Fotocopias',
  'Impresión color / B&N',
  'Anillado',
  'Lapicera / Lápiz suelto',
  'Folio / Separador',
  'Artículo de regalería',
];

const MEDIOS_PAGO: {
  id: MedioPago;
  etiqueta: string;
  etiquetaCorta: string;
  icono: React.ComponentType<{ className?: string }>;
  claseActiva: string;
  claseBadge: string;
}[] = [
  {
    id: 'efectivo',
    etiqueta: 'Efectivo',
    etiquetaCorta: 'Efectivo',
    icono: Banknote,
    claseActiva: 'bg-emerald-600 text-white border-emerald-600 shadow-sm',
    claseBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    id: 'transferencia',
    etiqueta: 'Transf. / Débito',
    etiquetaCorta: 'Transf. / Débito',
    icono: ArrowLeftRight,
    claseActiva: 'bg-purple-800 text-white border-purple-800 shadow-sm',
    claseBadge: 'bg-purple-50 text-purple-800 border-purple-200',
  },
  {
    id: 'credito',
    etiqueta: 'Crédito',
    etiquetaCorta: 'Crédito',
    icono: CreditCard,
    claseActiva: 'bg-amber-600 text-white border-amber-600 shadow-sm',
    claseBadge: 'bg-amber-50 text-amber-800 border-amber-200',
  },
];

function obtenerFechaClave(fecha: Date): string {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function obtenerHoraActual(): string {
  const ahora = new Date();
  const h = String(ahora.getHours()).padStart(2, '0');
  const m = String(ahora.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function precioEfectivoDeProducto(prod: ProductoAdmin): number {
  const tieneDesc = Boolean(
    prod.precioDescuentoProducto &&
      prod.precioDescuentoProducto > 0 &&
      prod.fechaFinDescuento &&
      new Date(prod.fechaFinDescuento).getTime() > Date.now()
  );
  return tieneDesc && prod.precioDescuentoProducto
    ? prod.precioDescuentoProducto
    : prod.precioProducto;
}

export function CajaDiariaWidget() {
  const { productos } = useAdmin();
  const { notificar } = useAdminFeedback();

  // Estado persistente de las ventas del día
  const [ventas, setVentas] = useState<VentaDiaria[]>([]);
  const [hidratado, setHidratado] = useState(false);

  // Modo de carga: producto del catálogo vs genérico
  const [modoCarga, setModoCarga] = useState<'catalogo' | 'generico'>('catalogo');

  // Campos modo Catálogo
  const [busquedaCatalogo, setBusquedaCatalogo] = useState('');
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoAdmin | null>(null);
  const [precioCatalogoEditable, setPrecioCatalogoEditable] = useState<number | ''>('');
  const [cantidadCatalogo, setCantidadCatalogo] = useState(1);

  // Campos modo Genérico
  const [nombreGenerico, setNombreGenerico] = useState('');
  const [precioGenerico, setPrecioGenerico] = useState<number | ''>('');
  const [cantidadGenerico, setCantidadGenerico] = useState(1);

  // Medio de pago común
  const [medioPago, setMedioPago] = useState<MedioPago>('efectivo');

  // Modal de cierre de caja del día
  const [modalCierreAbierto, setModalCierreAbierto] = useState(false);
  const [resumenCopiado, setResumenCopiado] = useState(false);

  const buscadorRef = useRef<HTMLDivElement>(null);

  // Cargar ventas guardadas del día actual
  useEffect(() => {
    try {
      const hoyClave = obtenerFechaClave(new Date());
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) {
        const parsed = JSON.parse(guardado) as { fecha?: string; ventas?: VentaDiaria[] };
        if (parsed.fecha === hoyClave && Array.isArray(parsed.ventas)) {
          setVentas(parsed.ventas);
        }
      }
    } catch {
      // Ignorar errores de lectura local
    } finally {
      setHidratado(true);
    }
  }, []);

  // Guardar automáticamente cada vez que cambian las ventas
  useEffect(() => {
    if (!hidratado) return;
    try {
      const hoyClave = obtenerFechaClave(new Date());
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ fecha: hoyClave, ventas })
      );
    } catch {
      // Ignorar errores de cuota
    }
  }, [ventas, hidratado]);

  // Cerrar desplegable de búsqueda al hacer clic fuera
  useEffect(() => {
    const handleClickFuera = (e: MouseEvent) => {
      if (buscadorRef.current && !buscadorRef.current.contains(e.target as Node)) {
        setMostrarResultados(false);
      }
    };
    document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, []);

  // Productos activos del catálogo para búsqueda rápida
  const productosActivos = useMemo(
    () => productos.filter((p) => !p.fechaHoraBajaProducto),
    [productos]
  );

  const resultadosBusqueda = useMemo(() => {
    const q = busquedaCatalogo.trim().toLowerCase();
    if (!q) return productosActivos.slice(0, 6);
    return productosActivos
      .filter(
        (p) =>
          p.nombreProducto.toLowerCase().includes(q) ||
          (p.categoriaNombre && p.categoriaNombre.toLowerCase().includes(q)) ||
          (p.detalleProducto && p.detalleProducto.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [productosActivos, busquedaCatalogo]);

  // Totales discriminados por medio de pago
  const resumen = useMemo(() => {
    let efectivo = 0;
    let transferencia = 0;
    let credito = 0;
    let unidades = 0;

    for (const v of ventas) {
      const subtotal = v.precioUnitario * v.cantidad;
      unidades += v.cantidad;
      if (v.medioPago === 'efectivo') efectivo += subtotal;
      else if (v.medioPago === 'transferencia') transferencia += subtotal;
      else credito += subtotal;
    }

    return {
      totalGeneral: efectivo + transferencia + credito,
      efectivo,
      transferencia,
      credito,
      unidades,
      cantidadVentas: ventas.length,
    };
  }, [ventas]);

  const seleccionarProductoCatalogo = (prod: ProductoAdmin) => {
    setProductoSeleccionado(prod);
    setBusquedaCatalogo(prod.nombreProducto);
    setPrecioCatalogoEditable(precioEfectivoDeProducto(prod));
    setCantidadCatalogo(1);
    setMostrarResultados(false);
  };

  const limpiarSeleccionCatalogo = () => {
    setProductoSeleccionado(null);
    setBusquedaCatalogo('');
    setPrecioCatalogoEditable('');
    setCantidadCatalogo(1);
  };

  const handleRegistrarVenta = (e: React.FormEvent) => {
    e.preventDefault();

    if (modoCarga === 'catalogo') {
      if (!productoSeleccionado) {
        notificar({
          tipo: 'advertencia',
          titulo: 'Elegí un producto del catálogo',
          mensaje: 'Buscá y tocá un artículo de la lista, o pasá a la pestaña Producto Genérico.',
        });
        return;
      }

      const precio = Number(precioCatalogoEditable);
      if (isNaN(precio) || precio <= 0) {
        notificar({
          tipo: 'advertencia',
          titulo: 'Revisá el precio',
          mensaje: 'Ingresá un monto mayor a $0 para registrar la venta.',
        });
        return;
      }

      const nuevaVenta: VentaDiaria = {
        id: `venta-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        hora: obtenerHoraActual(),
        origen: 'catalogo',
        productoId: productoSeleccionado.idProducto,
        nombre: productoSeleccionado.nombreProducto,
        detalle: productoSeleccionado.categoriaNombre || undefined,
        precioUnitario: precio,
        cantidad: Math.max(1, cantidadCatalogo),
        medioPago,
      };

      setVentas((prev) => [nuevaVenta, ...prev]);
      notificar({
        tipo: 'exito',
        titulo: 'Venta anotada en caja',
        mensaje: `${nuevaVenta.cantidad}× ${nuevaVenta.nombre} ($${(
          nuevaVenta.precioUnitario * nuevaVenta.cantidad
        ).toLocaleString('es-AR')})`,
      });
      limpiarSeleccionCatalogo();
      return;
    }

    // Modo Producto Genérico
    const nombreLimpio = nombreGenerico.trim();
    const precioNum = Number(precioGenerico);
    if (!nombreLimpio) {
      notificar({
        tipo: 'advertencia',
        titulo: 'Falta la descripción',
        mensaje: 'Escribí qué se vendió (por ejemplo: Fotocopias, Lapicera suelta...).',
      });
      return;
    }
    if (isNaN(precioNum) || precioNum <= 0) {
      notificar({
        tipo: 'advertencia',
        titulo: 'Ingresá un monto válido',
        mensaje: 'El precio debe ser mayor a $0 para sumarlo a la caja del día.',
      });
      return;
    }

    const nuevaGenerica: VentaDiaria = {
      id: `venta-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      hora: obtenerHoraActual(),
      origen: 'generico',
      nombre: nombreLimpio,
      precioUnitario: precioNum,
      cantidad: Math.max(1, cantidadGenerico),
      medioPago,
    };

    setVentas((prev) => [nuevaGenerica, ...prev]);
    notificar({
      tipo: 'exito',
      titulo: 'Venta rápida anotada',
      mensaje: `${nuevaGenerica.cantidad}× ${nuevaGenerica.nombre} ($${(
        nuevaGenerica.precioUnitario * nuevaGenerica.cantidad
      ).toLocaleString('es-AR')})`,
    });
    setNombreGenerico('');
    setPrecioGenerico('');
    setCantidadGenerico(1);
  };

  const cambiarCantidadVenta = (id: string, delta: number) => {
    setVentas((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, cantidad: Math.max(1, v.cantidad + delta) } : v
      )
    );
  };

  const eliminarVenta = (id: string) => {
    setVentas((prev) => prev.filter((v) => v.id !== id));
    notificar({
      tipo: 'info',
      titulo: 'Venta quitada',
      mensaje: 'Se descontó del total de la caja del día.',
    });
  };

  const generarTextoResumen = () => {
    const fechaTexto = new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date());

    const lineas = [
      `CIERRE DE CAJA — LIBRERÍA MOTIVOS (${fechaTexto})`,
      `Ventas anotadas: ${resumen.cantidadVentas} (${resumen.unidades} ${resumen.unidades === 1 ? 'unidad' : 'unidades'})`,
      `--------------------------------`,
      `Efectivo (en caja): $ ${resumen.efectivo.toLocaleString('es-AR')}`,
      `Transferencia / Débito: $ ${resumen.transferencia.toLocaleString('es-AR')}`,
      `Crédito: $ ${resumen.credito.toLocaleString('es-AR')}`,
      `--------------------------------`,
      `TOTAL DEL DÍA: $ ${resumen.totalGeneral.toLocaleString('es-AR')}`,
    ];
    return lineas.join('\n');
  };

  const handleCopiarResumen = async () => {
    try {
      await navigator.clipboard.writeText(generarTextoResumen());
      setResumenCopiado(true);
      setTimeout(() => setResumenCopiado(false), 2200);
    } catch {
      notificar({
        tipo: 'advertencia',
        titulo: 'No se pudo copiar automáticamente',
        mensaje: 'Podés anotar los totales directamente desde esta pantalla.',
      });
    }
  };

  const handleConfirmarCierreDia = () => {
    const totalCerrado = resumen.totalGeneral;
    const cantidadCerrada = resumen.cantidadVentas;
    setVentas([]);
    setModalCierreAbierto(false);
    setResumenCopiado(false);
    notificar({
      tipo: 'exito',
      titulo: 'Caja del día cerrada',
      mensaje: `Se cerró la jornada con ${cantidadCerrada} ventas por $ ${totalCerrado.toLocaleString('es-AR')}. La caja quedó en $0 para el próximo turno.`,
    });
  };

  const subtotalActual =
    modoCarga === 'catalogo'
      ? (Number(precioCatalogoEditable) || 0) * Math.max(1, cantidadCatalogo)
      : (Number(precioGenerico) || 0) * Math.max(1, cantidadGenerico);

  return (
    <section
      aria-label="Caja rápida y ventas del día"
      className="bg-white rounded-3xl border border-[#ded0f2] shadow-sm overflow-hidden"
    >
      {/* Cabecera de la Caja Diaria */}
      <div className="px-5 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-[#fdf5f7] via-[#f7f0fc] to-[#fdf5f7] border-b border-[#e8d9f3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white border border-[#f2d3d8] text-[#d97786] shadow-2xs flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base sm:text-lg font-black text-purple-950 tracking-tight">
              Ventas del Día y Conteo de Caja
            </h3>
            <p className="text-xs text-slate-600">
              Anotá cada venta del mostrador (del catálogo o genérica) y cerrá la caja al final del día sin usar papel.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModalCierreAbierto(true)}
          disabled={ventas.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed min-h-[44px] shrink-0"
        >
          <Receipt className="w-4 h-4 shrink-0" />
          <span>Cerrar Caja del Día</span>
        </button>
      </div>

      {/* Tarjetas de Totales en Tiempo Real por Medio de Pago */}
      <div className="p-5 sm:p-6 pb-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* Total General */}
        <div className="rounded-2xl p-4 bg-gradient-to-br from-[#58285f] to-[#8a3b58] text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-100/90">
              Total del Día
            </span>
            <ShoppingBag className="w-4 h-4 text-rose-200" />
          </div>
          <p className="font-heading text-2xl font-black mt-1.5 tracking-tight">
            $ {resumen.totalGeneral.toLocaleString('es-AR')}
          </p>
          <p className="text-[11px] text-rose-100/85 mt-1">
            {resumen.cantidadVentas} {resumen.cantidadVentas === 1 ? 'venta' : 'ventas'} • {resumen.unidades}{' '}
            {resumen.unidades === 1 ? 'artículo' : 'artículos'}
          </p>
        </div>

        {/* Efectivo */}
        <div className="rounded-2xl p-4 bg-emerald-50/70 border border-emerald-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Efectivo (en caja)
            </span>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-black text-emerald-950 mt-1.5 tracking-tight">
            $ {resumen.efectivo.toLocaleString('es-AR')}
          </p>
          <p className="text-[11px] text-emerald-700/85 mt-1">
            Plata física para contar en cajón
          </p>
        </div>

        {/* Transferencia / Débito */}
        <div className="rounded-2xl p-4 bg-purple-50/70 border border-purple-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900">
              Transf. / Débito
            </span>
            <ArrowLeftRight className="w-4 h-4 text-purple-700" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-black text-purple-950 mt-1.5 tracking-tight">
            $ {resumen.transferencia.toLocaleString('es-AR')}
          </p>
          <p className="text-[11px] text-purple-700/85 mt-1">
            Ingresos por banco o billetera
          </p>
        </div>

        {/* Crédito */}
        <div className="rounded-2xl p-4 bg-amber-50/70 border border-amber-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
              Tarjeta de Crédito
            </span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-black text-amber-950 mt-1.5 tracking-tight">
            $ {resumen.credito.toLocaleString('es-AR')}
          </p>
          <p className="text-[11px] text-amber-800/80 mt-1">
            Cobros con posnet / cuotas
          </p>
        </div>
      </div>

      {/* Cuerpo: Formulario de Carga Rápida (Izq) + Listado de Ventas de Hoy (Der) */}
      <div className="px-5 sm:px-6 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Columna Izquierda: Registrar nueva venta */}
        <form
          onSubmit={handleRegistrarVenta}
          className="lg:col-span-6 rounded-2xl bg-[#fbf9fd] border border-[#e8dcf3] p-4 sm:p-5 space-y-4 flex flex-col justify-between"
        >
          <div className="space-y-4">
            {/* Selector de Pestaña: Del Catálogo vs Producto Genérico */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white border border-purple-200/80">
              <button
                type="button"
                onClick={() => setModoCarga('catalogo')}
                className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[40px] ${
                  modoCarga === 'catalogo'
                    ? 'bg-[#d97786] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-purple-950 hover:bg-purple-50/60'
                }`}
              >
                <Package className="w-3.5 h-3.5 shrink-0" />
                <span>Del Catálogo</span>
              </button>
              <button
                type="button"
                onClick={() => setModoCarga('generico')}
                className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[40px] ${
                  modoCarga === 'generico'
                    ? 'bg-[#d97786] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-purple-950 hover:bg-purple-50/60'
                }`}
              >
                <PenLine className="w-3.5 h-3.5 shrink-0" />
                <span>Producto Genérico</span>
              </button>
            </div>

            {modoCarga === 'catalogo' ? (
              <div className="space-y-3.5">
                {/* Buscador instantáneo de productos cargados */}
                <div ref={buscadorRef} className="relative">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Buscar producto cargado en el sistema
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={busquedaCatalogo}
                      onFocus={() => setMostrarResultados(true)}
                      onChange={(e) => {
                        setBusquedaCatalogo(e.target.value);
                        setMostrarResultados(true);
                        if (productoSeleccionado) setProductoSeleccionado(null);
                      }}
                      placeholder="Ej: Cuaderno, Mochila, Tablero, Marcadores..."
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#d97786] focus:ring-2 focus:ring-[#d97786]/15 transition-all"
                    />
                    {busquedaCatalogo && (
                      <button
                        type="button"
                        onClick={limpiarSeleccionCatalogo}
                        aria-label="Limpiar búsqueda"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Lista desplegable de resultados en vivo */}
                  {mostrarResultados && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white rounded-2xl border border-purple-200 shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100">
                      {resultadosBusqueda.length > 0 ? (
                        resultadosBusqueda.map((prod) => {
                          const foto = prod.fotoProducto || DEFAULT_BRAND_IMAGE;
                          const precio = precioEfectivoDeProducto(prod);
                          return (
                            <button
                              key={prod.idProducto}
                              type="button"
                              onClick={() => seleccionarProductoCatalogo(prod)}
                              className="w-full px-3 py-2.5 flex items-center gap-3 text-left hover:bg-[#fef5f6] transition-colors cursor-pointer"
                            >
                              <img
                                src={foto}
                                alt={prod.nombreProducto}
                                className={`w-10 h-10 rounded-xl border border-slate-200 shrink-0 ${
                                  foto === DEFAULT_BRAND_IMAGE
                                    ? 'object-contain bg-[#fdfbf7] p-0.5'
                                    : 'object-cover'
                                }`}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="font-heading text-xs font-bold text-slate-900 truncate">
                                  {prod.nombreProducto}
                                </p>
                                <p className="text-[11px] text-slate-500 truncate">
                                  {prod.categoriaNombre ? `${prod.categoriaNombre} • ` : ''}
                                  {prod.detalleProducto}
                                </p>
                              </div>
                              <span className="font-mono text-xs font-black text-purple-950 bg-[#f5eefb] px-2 py-1 rounded-lg shrink-0">
                                $ {precio.toLocaleString('es-AR')}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-4 text-center space-y-2">
                          <p className="text-xs text-slate-500">
                            No encontramos ese artículo en el catálogo.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setNombreGenerico(busquedaCatalogo.trim());
                              setMostrarResultados(false);
                              setModoCarga('generico');
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d97786] hover:underline cursor-pointer"
                          >
                            <PenLine className="w-3.5 h-3.5" />
                            <span>Cargar como Producto Genérico</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Tarjeta del Producto Seleccionado con precio, detalle y cantidad */}
                {productoSeleccionado && (
                  <div className="p-3.5 rounded-2xl bg-white border border-[#f2d3d8] shadow-2xs space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-start gap-3">
                      <img
                        src={productoSeleccionado.fotoProducto || DEFAULT_BRAND_IMAGE}
                        alt={productoSeleccionado.nombreProducto}
                        className={`w-12 h-12 rounded-xl border border-slate-200 shrink-0 ${
                          (productoSeleccionado.fotoProducto || DEFAULT_BRAND_IMAGE) ===
                          DEFAULT_BRAND_IMAGE
                            ? 'object-contain bg-[#fdfbf7] p-0.5'
                            : 'object-cover'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-heading text-xs sm:text-sm font-extrabold text-purple-950 leading-snug">
                            {productoSeleccionado.nombreProducto}
                          </p>
                          <button
                            type="button"
                            onClick={limpiarSeleccionCatalogo}
                            className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                            title="Cambiar producto"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {productoSeleccionado.categoriaNombre && (
                          <span className="inline-block text-[10px] font-bold text-[#8b4f58] bg-[#fef5f6] px-2 py-0.5 rounded-full mt-0.5">
                            {productoSeleccionado.categoriaNombre}
                          </span>
                        )}
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                          {productoSeleccionado.detalleProducto}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Precio unitario ($)
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={1000000}
                          step="any"
                          value={precioCatalogoEditable}
                          onChange={(e) =>
                            setPrecioCatalogoEditable(
                              e.target.value === '' ? '' : Number(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:border-[#d97786]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Cantidad
                        </label>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setCantidadCatalogo((c) => Math.max(1, c - 1))}
                            className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                            aria-label="Restar unidad"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="flex-1 text-center font-mono text-sm font-black text-slate-900">
                            {cantidadCatalogo}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCantidadCatalogo((c) => c + 1)}
                            className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                            aria-label="Sumar unidad"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Modo Producto Genérico (no cargado en el catálogo) */
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Descripción del artículo o servicio *
                  </label>
                  <input
                    type="text"
                    value={nombreGenerico}
                    onChange={(e) => setNombreGenerico(e.target.value)}
                    placeholder="Ej: Fotocopias, Anillado, Lapicera azul..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#d97786] focus:ring-2 focus:ring-[#d97786]/15"
                  />
                  {/* Atajos rápidos de mostrador */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {SUGERENCIAS_GENERICAS.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setNombreGenerico(sug)}
                        className="px-2.5 py-1 rounded-full bg-white hover:bg-[#fef5f6] border border-purple-200/80 hover:border-[#f2d3d8] text-[11px] font-semibold text-slate-600 hover:text-[#8b4f58] transition-colors cursor-pointer"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Precio unitario ($) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={1000000}
                      step="any"
                      value={precioGenerico}
                      onChange={(e) =>
                        setPrecioGenerico(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      placeholder="Ej: 1500"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 font-mono text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:border-[#d97786]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cantidad
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCantidadGenerico((c) => Math.max(1, c - 1))}
                        className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer"
                        aria-label="Restar unidad"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="flex-1 text-center font-mono text-sm font-black text-slate-900">
                        {cantidadGenerico}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCantidadGenerico((c) => c + 1)}
                        className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer"
                        aria-label="Sumar unidad"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Selector de Medio de Pago */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ¿Cómo pagó el cliente?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {MEDIOS_PAGO.map((mp) => {
                  const Icono = mp.icono;
                  const activo = medioPago === mp.id;
                  return (
                    <button
                      key={mp.id}
                      type="button"
                      onClick={() => setMedioPago(mp.id)}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer min-h-[42px] ${
                        activo
                          ? mp.claseActiva
                          : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <Icono className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{mp.etiquetaCorta}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Botón de Registrar Venta */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#d97786] hover:bg-[#c46372] active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all cursor-pointer min-h-[46px]"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>
              Registrar Venta
              {subtotalActual > 0 ? ` — $ ${subtotalActual.toLocaleString('es-AR')}` : ''}
            </span>
          </button>
        </form>

        {/* Columna Derecha: Lista de Ventas Registradas Hoy */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/90 bg-white flex flex-col overflow-hidden min-h-[300px]">
          <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d97786]" />
              <span>Ventas Anotadas Hoy</span>
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#ede4f6] text-purple-950">
              {ventas.length} {ventas.length === 1 ? 'movimiento' : 'movimientos'}
            </span>
          </div>

          {ventas.length > 0 ? (
            <div className="flex-1 max-h-[360px] overflow-y-auto divide-y divide-slate-100">
              {ventas.map((venta) => {
                const mpInfo = MEDIOS_PAGO.find((m) => m.id === venta.medioPago) || MEDIOS_PAGO[0];
                const subtotal = venta.precioUnitario * venta.cantidad;
                return (
                  <div
                    key={venta.id}
                    className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors animate-in fade-in duration-150"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[10px] font-bold text-slate-400">
                          {venta.hora}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                            venta.origen === 'catalogo'
                              ? 'bg-[#fef5f6] text-[#8b4f58] border-[#f2d3d8]'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {venta.origen === 'catalogo' ? 'Catálogo' : 'Genérico'}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${mpInfo.claseBadge}`}
                        >
                          {mpInfo.etiquetaCorta}
                        </span>
                      </div>
                      <p className="font-heading text-xs sm:text-sm font-bold text-slate-900 truncate mt-1">
                        {venta.nombre}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        $ {venta.precioUnitario.toLocaleString('es-AR')} c/u
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Ajuste rápido de cantidad */}
                      <div className="inline-flex items-center gap-1 bg-slate-50 rounded-lg border border-slate-200 p-0.5">
                        <button
                          type="button"
                          onClick={() => cambiarCantidadVenta(venta.id, -1)}
                          aria-label="Restar una unidad"
                          className="w-6 h-6 rounded-md hover:bg-white text-slate-600 flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-mono text-xs font-bold text-slate-900">
                          {venta.cantidad}
                        </span>
                        <button
                          type="button"
                          onClick={() => cambiarCantidadVenta(venta.id, 1)}
                          aria-label="Sumar una unidad"
                          className="w-6 h-6 rounded-md hover:bg-white text-slate-600 flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right min-w-[74px]">
                        <p className="font-mono text-xs sm:text-sm font-black text-purple-950">
                          $ {subtotal.toLocaleString('es-AR')}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => eliminarVenta(venta.id)}
                        aria-label={`Quitar venta ${venta.nombre}`}
                        title="Quitar de la lista"
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#fef5f6] border border-[#f2d3d8] text-[#d97786] flex items-center justify-center">
                <Receipt className="w-6 h-6" />
              </div>
              <p className="font-heading text-sm font-bold text-slate-800">
                Todavía no anotaste ventas hoy
              </p>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Buscá un producto del catálogo o usá la pestaña <strong>Producto Genérico</strong> para ir sumando las ventas del día y facilitar el conteo de caja.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Cierre de Caja del Día */}
      {modalCierreAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#ded0f2] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-gradient-to-r from-[#fef5f6] to-[#ede4f6] border-b border-[#e8d9f3] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-[#d97786]" />
                <h4 className="font-heading text-base font-black text-purple-950">
                  Resumen para Cerrar Caja
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setModalCierreAbierto(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white/70 cursor-pointer"
                aria-label="Cerrar ventana"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Este es el conteo total de las <strong>{resumen.cantidadVentas} ventas</strong> ({resumen.unidades}{' '}
                {resumen.unidades === 1 ? 'unidad' : 'unidades'}) registradas hoy, separado por medio de pago:
              </p>

              <div className="space-y-2 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-semibold text-emerald-800">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    Efectivo (en cajón)
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    $ {resumen.efectivo.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-semibold text-purple-900">
                    <ArrowLeftRight className="w-4 h-4 text-purple-700" />
                    Transferencia / Débito
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    $ {resumen.transferencia.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-semibold text-amber-900">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    Tarjeta de Crédito
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    $ {resumen.credito.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="pt-2.5 mt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-heading font-black text-purple-950 uppercase text-xs tracking-wider">
                    Total General del Día
                  </span>
                  <span className="font-heading text-lg font-black text-purple-950">
                    $ {resumen.totalGeneral.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopiarResumen}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-purple-950 border border-purple-200 text-xs font-bold transition-colors cursor-pointer min-h-[42px]"
              >
                {resumenCopiado ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">¡Resumen copiado! Podés pegarlo en WhatsApp</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#d97786]" />
                    <span>Copiar resumen del día</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                Al confirmar el cierre, el listado de hoy se limpiará para empezar en $0 mañana.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setModalCierreAbierto(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 text-xs sm:text-sm cursor-pointer min-h-[42px]"
                >
                  Seguir anotando
                </button>
                <button
                  type="button"
                  onClick={handleConfirmarCierreDia}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all cursor-pointer min-h-[42px]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Cierre del Día</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
