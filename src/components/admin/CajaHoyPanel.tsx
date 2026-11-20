'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Banknote,
  ArrowLeftRight,
  CreditCard,
  Landmark,
  Search,
  Plus,
  Minus,
  Trash2,
  Receipt,
  CheckCircle2,
  Package,
  PenLine,
  X,
  ShoppingBag,
  Sparkles,
  Pencil,
  Ban,
  RotateCcw,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  Info,
  Percent,
  Split,
  AlertTriangle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useAdminFeedback } from '@/context/AdminFeedbackContext';
import { ProductoAdmin } from '@/types/admin';
import { DEFAULT_BRAND_IMAGE } from '@/lib/mock-data';
import {
  CajaAbiertaState,
  CierreCaja,
  ItemVenta,
  MedioPagoCaja,
  MovimientoEfectivo,
  PagoDetalle,
  VentaTicket,
  calcularResumenCaja,
  formatearFechaClaveLegible,
  generarTextoResumenCierre,
  obtenerFechaClave,
  obtenerHoraActual,
  parsearMontoAR,
} from '@/lib/caja-diaria';

interface CajaHoyPanelProps {
  caja: CajaAbiertaState;
  onActualizarFondo: (nuevoFondo: number) => Promise<void>;
  onRegistrarVenta: (
    venta: Omit<VentaTicket, 'id' | 'numeroTicket' | 'fechaIso'>
  ) => Promise<void>;
  onEditarPagoVenta: (
    ventaId: string,
    totalCobrado: number,
    pagos: PagoDetalle[]
  ) => Promise<void>;
  onToggleAnularVenta: (venta: VentaTicket) => Promise<void>;
  onRegistrarMovimiento: (mov: Omit<MovimientoEfectivo, 'id'>) => Promise<void>;
  onEliminarMovimiento: (movId: string) => Promise<void>;
  onGuardarCierre: (
    cierre: CierreCaja,
    nuevoFondoManiana: number
  ) => Promise<void>;
}

const SUGERENCIAS_GENERICAS = [
  'Fotocopias',
  'Impresión color / B&N',
  'Anillado',
  'Lapicera / Lápiz suelto',
  'Folio / Separador',
  'Artículo de regalería',
];

const SUGERENCIAS_EGRESOS = [
  'Pago a repartidor / proveedor',
  'Gasto chico del local',
  'Retiro de efectivo',
  'Compra de insumos',
];

const RECARGOS_RAPIDOS = [0, 5, 10, 15, 20];
const LIMITE_VENTAS_VISIBLES = 3;

const CONFIG_MEDIOS: {
  id: MedioPagoCaja;
  nombre: string;
  corto: string;
  subtitulo: string;
  icono: React.ComponentType<{ className?: string }>;
  activa: string;
  badge: string;
}[] = [
  {
    id: 'efectivo',
    nombre: 'Efectivo',
    corto: 'Efectivo',
    subtitulo: 'Cajón físico',
    icono: Banknote,
    activa: 'bg-emerald-600 text-white border-emerald-600 shadow-xs',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    id: 'transferencia',
    nombre: 'Transferencia',
    corto: 'Transf.',
    subtitulo: 'MP / Banco',
    icono: Landmark,
    activa: 'bg-purple-800 text-white border-purple-800 shadow-xs',
    badge: 'bg-purple-50 text-purple-800 border-purple-200',
  },
  {
    id: 'debito',
    nombre: 'Débito',
    corto: 'Débito',
    subtitulo: 'Lote Posnet',
    icono: ArrowLeftRight,
    activa: 'bg-sky-700 text-white border-sky-700 shadow-xs',
    badge: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  {
    id: 'credito',
    nombre: 'Crédito',
    corto: 'Crédito',
    subtitulo: 'Posnet / cuotas',
    icono: CreditCard,
    activa: 'bg-amber-600 text-white border-amber-600 shadow-xs',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
  },
];

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

export function CajaHoyPanel({
  caja,
  onActualizarFondo,
  onRegistrarVenta,
  onEditarPagoVenta,
  onToggleAnularVenta,
  onRegistrarMovimiento,
  onEliminarMovimiento,
  onGuardarCierre,
}: CajaHoyPanelProps) {
  const { productos } = useAdmin();
  const { notificar, confirmar } = useAdminFeedback();

  const resumen = useMemo(() => calcularResumenCaja(caja), [caja]);

  // --- 1. Cambio inicial y salidas de efectivo ---
  const [editandoFondo, setEditandoFondo] = useState(false);
  const [fondoInput, setFondoInput] = useState<string>('');
  const [panelMovimientoAbierto, setPanelMovimientoAbierto] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState<'egreso' | 'ingreso_extra'>('egreso');
  const [conceptoMovimiento, setConceptoMovimiento] = useState('');
  const [montoMovimiento, setMontoMovimiento] = useState<string>('');

  // --- 2. Constructor de ticket multi-producto ---
  const [modoCarga, setModoCarga] = useState<'catalogo' | 'generico'>('catalogo');
  const [busquedaCatalogo, setBusquedaCatalogo] = useState('');
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [nombreGenerico, setNombreGenerico] = useState('');
  const [precioGenerico, setPrecioGenerico] = useState<string>('');
  const [cantidadGenerico, setCantidadGenerico] = useState(1);
  const [itemsTicket, setItemsTicket] = useState<ItemVenta[]>([]);

  // --- 3. Medios de pago, pago mixto, recargo y vuelto ---
  const [esPagoMixto, setEsPagoMixto] = useState(false);
  const [medioPrincipal, setMedioPrincipal] = useState<MedioPagoCaja>('efectivo');
  const [medioSecundario, setMedioSecundario] = useState<MedioPagoCaja>('transferencia');
  const [montoPrincipalMixto, setMontoPrincipalMixto] = useState<string>('');
  const [recargoPorcentaje, setRecargoPorcentaje] = useState<number>(0);
  const [montoFinalManual, setMontoFinalManual] = useState<string>('');
  const [pagaConInput, setPagaConInput] = useState<string>('');

  // --- 4. Ventas anotadas hoy (desplegable) + edición / anulación ---
  const [filtroVentasHoy, setFiltroVentasHoy] = useState<'todas' | 'validas' | 'anuladas'>('todas');
  const [ventasDesplegadas, setVentasDesplegadas] = useState(true);
  const [mostrarTodasVentas, setMostrarTodasVentas] = useState(false);
  const [ventaEditando, setVentaEditando] = useState<VentaTicket | null>(null);
  const [editEsMixto, setEditEsMixto] = useState(false);
  const [editMedio1, setEditMedio1] = useState<MedioPagoCaja>('efectivo');
  const [editMedio2, setEditMedio2] = useState<MedioPagoCaja>('transferencia');
  const [editMonto1, setEditMonto1] = useState<string>('');
  const [editTotalFinal, setEditTotalFinal] = useState<string>('');

  // --- 5. Modal de Arqueo y Cierre ---
  const [modalCierreAbierto, setModalCierreAbierto] = useState(false);
  const [efectivoContadoInput, setEfectivoContadoInput] = useState<string>('');
  const [observacionesCierre, setObservacionesCierre] = useState('');
  const [fondoParaProximoTurno, setFondoParaProximoTurno] = useState<string>('');
  const [copiadoPreview, setCopiadoPreview] = useState(false);

  const buscadorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickFuera = (e: MouseEvent) => {
      if (buscadorRef.current && !buscadorRef.current.contains(e.target as Node)) {
        setMostrarResultados(false);
      }
    };
    document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, []);

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

  // Cálculos en vivo del ticket actual
  const subtotalTicket = useMemo(
    () => itemsTicket.reduce((acc, it) => acc + it.precioUnitario * it.cantidad, 0),
    [itemsTicket]
  );

  const recargoCalculado = Math.round((subtotalTicket * recargoPorcentaje) / 100);
  const totalAutomatico = subtotalTicket + recargoCalculado;
  const totalACobrar =
    montoFinalManual.trim() !== '' && parsearMontoAR(montoFinalManual) >= 0
      ? parsearMontoAR(montoFinalManual)
      : totalAutomatico;

  // Cálculo claro y exacto para pago mixto (ej: total $7.400, paga $1.000 Efvo -> resta $6.400 Transf.)
  const monto1Raw = useMemo(() => parsearMontoAR(montoPrincipalMixto), [montoPrincipalMixto]);
  const monto1ExcedeTotal = esPagoMixto && totalACobrar > 0 && monto1Raw >= totalACobrar;
  const monto1Num = esPagoMixto ? Math.max(0, monto1Raw) : totalACobrar;
  const monto2Num = esPagoMixto ? Math.max(0, totalACobrar - monto1Num) : 0;

  // Cálculo de vuelto si interviene efectivo
  const montoEnEfectivoDelTicket = useMemo(() => {
    if (!esPagoMixto) return medioPrincipal === 'efectivo' ? totalACobrar : 0;
    let efvo = 0;
    if (medioPrincipal === 'efectivo') efvo += Math.min(monto1Num, totalACobrar);
    if (medioSecundario === 'efectivo') efvo += monto2Num;
    return efvo;
  }, [esPagoMixto, medioPrincipal, medioSecundario, totalACobrar, monto1Num, monto2Num]);

  const pagaConNum = parsearMontoAR(pagaConInput);
  const vueltoCalculado =
    montoEnEfectivoDelTicket > 0 && pagaConNum >= montoEnEfectivoDelTicket
      ? pagaConNum - montoEnEfectivoDelTicket
      : null;

  // --- Handlers de Fondo Inicial & Movimientos de Efectivo ---
  const abrirEdicionFondo = () => {
    setFondoInput(caja.fondoInicial > 0 ? String(caja.fondoInicial) : '');
    setEditandoFondo(true);
  };

  const guardarFondoInicial = async (e: React.FormEvent) => {
    e.preventDefault();
    const valor = fondoInput.trim() === '' ? 0 : parsearMontoAR(fondoInput);
    if (isNaN(valor) || valor < 0) {
      notificar({
        tipo: 'advertencia',
        titulo: 'Monto inválido',
        mensaje: 'Ingresá un valor igual o mayor a $0 para el cambio inicial.',
      });
      return;
    }
    await onActualizarFondo(valor);
    setEditandoFondo(false);
    notificar({
      tipo: 'exito',
      titulo: 'Cambio inicial actualizado',
      mensaje: `El cajón arranca con $ ${valor.toLocaleString('es-AR')} de cambio.`,
    });
  };

  const registrarMovimientoEfectivo = async (e: React.FormEvent) => {
    e.preventDefault();
    const concepto = conceptoMovimiento.trim();
    const monto = parsearMontoAR(montoMovimiento);
    if (!concepto) {
      notificar({
        tipo: 'advertencia',
        titulo: 'Falta el motivo',
        mensaje: 'Escribí para qué fue la salida o el ingreso de efectivo.',
      });
      return;
    }
    if (isNaN(monto) || monto <= 0) {
      notificar({
        tipo: 'advertencia',
        titulo: 'Monto inválido',
        mensaje: 'Ingresá un importe mayor a $0.',
      });
      return;
    }

    await onRegistrarMovimiento({
      hora: obtenerHoraActual(),
      tipo: tipoMovimiento,
      concepto,
      monto,
    });

    notificar({
      tipo: tipoMovimiento === 'egreso' ? 'info' : 'exito',
      titulo:
        tipoMovimiento === 'egreso'
          ? 'Salida de efectivo anotada'
          : 'Refuerzo de cambio anotado',
      mensaje: `${concepto}: ${tipoMovimiento === 'egreso' ? '-' : '+'}$ ${monto.toLocaleString('es-AR')}`,
    });

    setConceptoMovimiento('');
    setMontoMovimiento('');
    setPanelMovimientoAbierto(false);
  };

  const handleEliminarMovimiento = async (id: string) => {
    await onEliminarMovimiento(id);
    notificar({
      tipo: 'info',
      titulo: 'Movimiento quitado',
      mensaje: 'Se recalculó el efectivo esperado en cajón.',
    });
  };

  // --- Handlers del Ticket Multi-Ítem ---
  const agregarProductoCatalogoAlTicket = (prod: ProductoAdmin) => {
    const precio = precioEfectivoDeProducto(prod);
    setItemsTicket((prev) => {
      const existente = prev.find(
        (it) => it.origen === 'catalogo' && it.productoId === prod.idProducto
      );
      if (existente) {
        return prev.map((it) =>
          it.id === existente.id ? { ...it, cantidad: it.cantidad + 1 } : it
        );
      }
      return [
        ...prev,
        {
          id: `it-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          origen: 'catalogo',
          productoId: prod.idProducto,
          nombre: prod.nombreProducto,
          categoria: prod.categoriaNombre || undefined,
          precioUnitario: precio,
          cantidad: 1,
        },
      ];
    });
    setBusquedaCatalogo('');
    setMostrarResultados(false);
    setMontoFinalManual('');
  };

  const agregarGenericoAlTicket = () => {
    const nombre = nombreGenerico.trim();
    const precio = parsearMontoAR(precioGenerico);
    if (!nombre) {
      notificar({
        tipo: 'advertencia',
        titulo: 'Falta la descripción',
        mensaje: 'Escribí qué artículo o servicio lleva el cliente (ej: Fotocopias).',
      });
      return;
    }
    if (isNaN(precio) || precio <= 0) {
      notificar({
        tipo: 'advertencia',
        titulo: 'Ingresá el precio',
        mensaje: 'El monto unitario debe ser mayor a $0.',
      });
      return;
    }

    setItemsTicket((prev) => [
      ...prev,
      {
        id: `it-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        origen: 'generico',
        nombre,
        precioUnitario: precio,
        cantidad: Math.max(1, cantidadGenerico),
      },
    ]);
    setNombreGenerico('');
    setPrecioGenerico('');
    setCantidadGenerico(1);
    setMontoFinalManual('');
  };

  const actualizarCantidadItemTicket = (id: string, delta: number) => {
    setItemsTicket((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, cantidad: it.cantidad + delta } : it))
        .filter((it) => it.cantidad > 0)
    );
    setMontoFinalManual('');
  };

  const actualizarPrecioItemTicket = (id: string, nuevoPrecio: number) => {
    if (isNaN(nuevoPrecio) || nuevoPrecio < 0) return;
    setItemsTicket((prev) =>
      prev.map((it) => (it.id === id ? { ...it, precioUnitario: nuevoPrecio } : it))
    );
    setMontoFinalManual('');
  };

  const quitarItemTicket = (id: string) => {
    setItemsTicket((prev) => prev.filter((it) => it.id !== id));
    setMontoFinalManual('');
  };

  const handleCobrarTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    if (itemsTicket.length === 0) {
      notificar({
        tipo: 'advertencia',
        titulo: 'El ticket está vacío',
        mensaje: 'Agregá al menos un producto del catálogo o un artículo genérico antes de cobrar.',
      });
      return;
    }

    if (totalACobrar <= 0) {
      notificar({
        tipo: 'advertencia',
        titulo: 'Revisá el total',
        mensaje: 'El total a cobrar debe ser mayor a $0.',
      });
      return;
    }

    let pagos: PagoDetalle[] = [];
    if (!esPagoMixto) {
      pagos = [{ medio: medioPrincipal, monto: totalACobrar }];
    } else {
      if (medioPrincipal === medioSecundario) {
        notificar({
          tipo: 'advertencia',
          titulo: 'Elegí dos medios distintos',
          mensaje: 'En pago mixto seleccioná dos medios diferentes (por ejemplo Efectivo y Transferencia).',
        });
        return;
      }
      if (monto1Num <= 0 || monto1Num >= totalACobrar || monto2Num <= 0) {
        notificar({
          tipo: 'advertencia',
          titulo: 'Revisá la división del pago mixto',
          mensaje: `Ingresá un monto mayor a $0 y menor a $ ${totalACobrar.toLocaleString('es-AR')} en el primer medio.`,
        });
        return;
      }
      pagos = [
        { medio: medioPrincipal, monto: monto1Num },
        { medio: medioSecundario, monto: monto2Num },
      ];
    }

    const recargoFinalMonto = Math.max(0, totalACobrar - subtotalTicket);
    const totalUnidades = itemsTicket.reduce((a, b) => a + b.cantidad, 0);

    await onRegistrarVenta({
      hora: obtenerHoraActual(),
      items: itemsTicket,
      subtotalItems: subtotalTicket,
      recargoPorcentaje,
      recargoMonto: recargoFinalMonto,
      totalCobrado: totalACobrar,
      pagos,
      pagoConEfectivo:
        montoEnEfectivoDelTicket > 0 && pagaConNum >= montoEnEfectivoDelTicket
          ? pagaConNum
          : null,
      vueltoEntregado: vueltoCalculado,
    });

    notificar({
      tipo: 'exito',
      titulo: 'Venta registrada en caja',
      mensaje: `${totalUnidades} art. por $ ${totalACobrar.toLocaleString('es-AR')}${
        vueltoCalculado !== null && vueltoCalculado > 0
          ? ` • Vuelto: $ ${vueltoCalculado.toLocaleString('es-AR')}`
          : ''
      }`,
    });

    // Resetear constructor para el próximo cliente
    setItemsTicket([]);
    setRecargoPorcentaje(0);
    setMontoFinalManual('');
    setPagaConInput('');
    setMontoPrincipalMixto('');
    setEsPagoMixto(false);
  };

  // --- Handlers de Editar / Anular Venta ya registrada ---
  const abrirEditorVenta = (venta: VentaTicket) => {
    setVentaEditando(venta);
    const mixto = venta.pagos.length > 1;
    setEditEsMixto(mixto);
    setEditMedio1(venta.pagos[0]?.medio || 'efectivo');
    setEditMedio2(
      venta.pagos[1]?.medio ||
        (venta.pagos[0]?.medio === 'efectivo' ? 'transferencia' : 'efectivo')
    );
    setEditMonto1(mixto ? String(venta.pagos[0]?.monto || 0) : '');
    setEditTotalFinal(String(venta.totalCobrado));
  };

  const guardarEdicionVenta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ventaEditando) return;

    const totalEditado = parsearMontoAR(editTotalFinal);
    if (isNaN(totalEditado) || totalEditado <= 0) {
      notificar({
        tipo: 'advertencia',
        titulo: 'Monto inválido',
        mensaje: 'El total cobrado debe ser mayor a $0.',
      });
      return;
    }

    let nuevosPagos: PagoDetalle[] = [];
    if (!editEsMixto) {
      nuevosPagos = [{ medio: editMedio1, monto: totalEditado }];
    } else {
      if (editMedio1 === editMedio2) {
        notificar({
          tipo: 'advertencia',
          titulo: 'Elegí dos medios distintos',
          mensaje: 'En pago mixto los dos medios tienen que ser diferentes.',
        });
        return;
      }
      const m1 = parsearMontoAR(editMonto1);
      const m2 = totalEditado - m1;
      if (isNaN(m1) || m1 <= 0 || m2 <= 0) {
        notificar({
          tipo: 'advertencia',
          titulo: 'Revisá los importes',
          mensaje: 'Ambos montos deben ser mayores a $0 y sumar el total.',
        });
        return;
      }
      nuevosPagos = [
        { medio: editMedio1, monto: m1 },
        { medio: editMedio2, monto: m2 },
      ];
    }

    await onEditarPagoVenta(ventaEditando.id, totalEditado, nuevosPagos);

    notificar({
      tipo: 'exito',
      titulo: `Venta #${ventaEditando.numeroTicket} corregida`,
      mensaje: 'Se actualizaron los totales de caja automáticamente.',
    });
    setVentaEditando(null);
  };

  const handleToggleAnular = async (venta: VentaTicket) => {
    if (!venta.anulada) {
      const ok = await confirmar({
        titulo: `¿Anular la Venta #${venta.numeroTicket}?`,
        mensaje: `Se descontarán $ ${venta.totalCobrado.toLocaleString('es-AR')} de los totales del día, pero quedará registrada como anulada para mantener el control prolijo.`,
        textoConfirmar: 'Sí, anular venta',
        variante: 'peligro',
      });
      if (!ok) return;
      await onToggleAnularVenta(venta);
      notificar({
        tipo: 'advertencia',
        titulo: `Venta #${venta.numeroTicket} anulada`,
        mensaje: 'El monto se descontó de la caja de hoy.',
      });
    } else {
      await onToggleAnularVenta(venta);
      notificar({
        tipo: 'exito',
        titulo: `Venta #${venta.numeroTicket} restaurada`,
        mensaje: 'Volvió a sumarse a los totales del día.',
      });
    }
  };

  // --- Handlers de Arqueo y Cierre de Caja ---
  const abrirModalCierre = () => {
    setEfectivoContadoInput(String(Math.max(0, resumen.efectivoEsperadoEnCajon)));
    setFondoParaProximoTurno(caja.fondoInicial > 0 ? String(caja.fondoInicial) : '0');
    setObservacionesCierre('');
    setCopiadoPreview(false);
    setModalCierreAbierto(true);
  };

  const efectivoContadoNum =
    efectivoContadoInput.trim() === '' ? 0 : parsearMontoAR(efectivoContadoInput);
  const diferenciaArqueo = efectivoContadoNum - resumen.efectivoEsperadoEnCajon;

  const construirCierrePreview = (): CierreCaja => {
    const fechaClave = caja.fechaClave || obtenerFechaClave();
    return {
      id: `cierre-${Date.now()}`,
      fechaClave,
      fechaLegible: formatearFechaClaveLegible(fechaClave),
      horaCierre: obtenerHoraActual(),
      fondoInicial: resumen.fondoInicial,
      ventasEfectivo: resumen.ventasEfectivo,
      ventasTransferencia: resumen.ventasTransferencia,
      ventasDebito: resumen.ventasDebito,
      ventasCredito: resumen.ventasCredito,
      totalVentas: resumen.totalVentas,
      egresosEfectivo: resumen.egresosEfectivo,
      ingresosExtraEfectivo: resumen.ingresosExtraEfectivo,
      efectivoEsperadoEnCajon: resumen.efectivoEsperadoEnCajon,
      efectivoContadoReal: efectivoContadoNum,
      diferenciaArqueo,
      cantidadVentas: resumen.cantidadVentas,
      cantidadAnuladas: resumen.cantidadAnuladas,
      cantidadArticulos: resumen.cantidadArticulos,
      observaciones: observacionesCierre.trim() || undefined,
      ventasSnapshot: caja.ventas,
      movimientosSnapshot: caja.movimientosEfectivo,
    };
  };

  const handleCopiarAntesDeCerrar = async () => {
    try {
      await navigator.clipboard.writeText(generarTextoResumenCierre(construirCierrePreview()));
      setCopiadoPreview(true);
      setTimeout(() => setCopiadoPreview(false), 2200);
    } catch {
      notificar({
        tipo: 'advertencia',
        titulo: 'No se pudo copiar automáticamente',
        mensaje: 'Al guardar el cierre igual vas a poder descargarlo en Excel o PDF desde el Historial.',
      });
    }
  };

  const handleConfirmarCierre = async () => {
    const cierreFinal = construirCierrePreview();
    const nuevoFondo = Math.max(0, parsearMontoAR(fondoParaProximoTurno));
    await onGuardarCierre(cierreFinal, nuevoFondo);
    setModalCierreAbierto(false);
  };

  const ventasFiltradas = useMemo(() => {
    if (filtroVentasHoy === 'validas') return caja.ventas.filter((v) => !v.anulada);
    if (filtroVentasHoy === 'anuladas') return caja.ventas.filter((v) => v.anulada);
    return caja.ventas;
  }, [caja.ventas, filtroVentasHoy]);

  const ventasMostradas = mostrarTodasVentas
    ? ventasFiltradas
    : ventasFiltradas.slice(0, LIMITE_VENTAS_VISIBLES);
  const hayVentasOcultas = ventasFiltradas.length > LIMITE_VENTAS_VISIBLES;

  const nombreMedioPrincipal =
    CONFIG_MEDIOS.find((m) => m.id === medioPrincipal)?.nombre || 'Efectivo';
  const nombreMedioSecundario =
    CONFIG_MEDIOS.find((m) => m.id === medioSecundario)?.nombre || 'Transferencia';

  return (
    <div className="space-y-5">
      {/* 1. Aclaración de Stock + Botón Principal de Cierre */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-[#e5d6f2] shadow-2xs">
        <div className="flex items-start gap-2.5 text-xs text-slate-600">
          <Info className="w-4 h-4 text-[#d97786] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-purple-950">Solo control de caja y plata:</strong> registrar una venta aquí lleva la cuenta diaria del mostrador y{' '}
            <strong className="text-slate-800">no descuenta stock</strong> ni oculta productos de la página web.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirModalCierre}
          disabled={
            caja.ventas.length === 0 &&
            caja.movimientosEfectivo.length === 0 &&
            caja.fondoInicial === 0
          }
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed min-h-[44px] shrink-0"
        >
          <Receipt className="w-4 h-4 shrink-0" />
          <span>Hacer Arqueo y Cerrar Caja</span>
        </button>
      </div>

      {/* 2. 5 Tarjetas Financieras en Tiempo Real */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-[#58285f] to-[#8a3b58] text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-100/90">
              Total Vendido Hoy
            </span>
            <ShoppingBag className="w-4 h-4 text-rose-200" />
          </div>
          <p className="font-heading text-2xl font-black mt-1.5 tracking-tight">
            $ {resumen.totalVentas.toLocaleString('es-AR')}
          </p>
          <p className="text-[11px] text-rose-100/85 mt-1">
            {resumen.cantidadVentas} {resumen.cantidadVentas === 1 ? 'venta' : 'ventas'} • {resumen.cantidadArticulos} art.
          </p>
        </div>

        <div className="rounded-2xl p-4 bg-emerald-50/80 border border-emerald-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Efectivo en Cajón
              </span>
              <Banknote className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-heading text-2xl font-black text-emerald-950 mt-1.5 tracking-tight">
              $ {resumen.efectivoEsperadoEnCajon.toLocaleString('es-AR')}
            </p>
          </div>
          <p className="text-[10px] text-emerald-800/85 mt-1 leading-snug font-medium">
            Cambio ${resumen.fondoInicial.toLocaleString('es-AR')} + Efvo ${resumen.ventasEfectivo.toLocaleString('es-AR')}
            {resumen.egresosEfectivo > 0 ? ` − Sal. $${resumen.egresosEfectivo.toLocaleString('es-AR')}` : ''}
          </p>
        </div>

        <div className="rounded-2xl p-4 bg-purple-50/70 border border-purple-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900">
              Transferencia
            </span>
            <Landmark className="w-4 h-4 text-purple-700" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-black text-purple-950 mt-1.5 tracking-tight">
            $ {resumen.ventasTransferencia.toLocaleString('es-AR')}
          </p>
          <p className="text-[10px] text-purple-800/80 mt-1">Mercado Pago / Banco</p>
        </div>

        <div className="rounded-2xl p-4 bg-sky-50/80 border border-sky-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-900">
              Débito
            </span>
            <ArrowLeftRight className="w-4 h-4 text-sky-700" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-black text-sky-950 mt-1.5 tracking-tight">
            $ {resumen.ventasDebito.toLocaleString('es-AR')}
          </p>
          <p className="text-[10px] text-sky-800/80 mt-1">Lote de Posnet</p>
        </div>

        <div className="rounded-2xl p-4 bg-amber-50/80 border border-amber-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
              Crédito
            </span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-black text-amber-950 mt-1.5 tracking-tight">
            $ {resumen.ventasCredito.toLocaleString('es-AR')}
          </p>
          <p className="text-[10px] text-amber-800/80 mt-1">Posnet / cuotas</p>
        </div>
      </div>

      {/* 3. NUEVA VENTA DE MOSTRADOR (Ancho completo, protagonista y cómoda) */}
      <form
        onSubmit={handleCobrarTicket}
        className="bg-white rounded-3xl border border-[#ded0f2] shadow-sm p-5 sm:p-6 space-y-5"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-black text-purple-950">
              Nueva Venta de Mostrador
            </h3>
            <p className="text-xs text-slate-500">
              Sumá todos los artículos que lleva el cliente en un mismo cobro.
            </p>
          </div>

          {itemsTicket.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setItemsTicket([]);
                setMontoFinalManual('');
                setRecargoPorcentaje(0);
                setPagaConInput('');
                setMontoPrincipalMixto('');
              }}
              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Vaciar ticket
            </button>
          )}
        </div>

        {/* Selector de artículos: Del Catálogo vs Producto Genérico */}
        <div className="p-4 rounded-2xl bg-[#fbf9fd] border border-[#e8dcf3] space-y-3.5">
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
            <div ref={buscadorRef} className="relative">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Buscá y tocá un producto para sumarlo al ticket
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
                  }}
                  placeholder="Ej: Cuaderno, Mochila, Tablero, Marcadores..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#d97786] focus:ring-2 focus:ring-[#d97786]/15"
                />
                {busquedaCatalogo && (
                  <button
                    type="button"
                    onClick={() => setBusquedaCatalogo('')}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {mostrarResultados && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white rounded-2xl border border-purple-200 shadow-xl max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {resultadosBusqueda.length > 0 ? (
                    resultadosBusqueda.map((prod) => {
                      const foto = prod.fotoProducto || DEFAULT_BRAND_IMAGE;
                      const precio = precioEfectivoDeProducto(prod);
                      return (
                        <button
                          key={prod.idProducto}
                          type="button"
                          onClick={() => agregarProductoCatalogoAlTicket(prod)}
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
                            <div className="flex items-center gap-1.5">
                              <p className="font-heading text-xs font-bold text-slate-900 truncate">
                                {prod.nombreProducto}
                              </p>
                              {prod.visibleEnVitrina === false && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                                  Solo mostrador
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">
                              {prod.categoriaNombre ? `${prod.categoriaNombre} • ` : ''}
                              {prod.detalleProducto}
                            </p>
                          </div>
                          <span className="font-mono text-xs font-black text-purple-950 bg-[#f5eefb] px-2.5 py-1 rounded-lg shrink-0">
                            + $ {precio.toLocaleString('es-AR')}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center space-y-2">
                      <p className="text-xs text-slate-500">
                        No está cargado en el catálogo.
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
                        <span>Agregar como Producto Genérico</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  value={nombreGenerico}
                  onChange={(e) => setNombreGenerico(e.target.value)}
                  placeholder="Descripción (ej: Fotocopias, Plasticola, Lapicera...)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#d97786]"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {SUGERENCIAS_GENERICAS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setNombreGenerico(sug)}
                      className="px-2.5 py-1 rounded-full bg-white hover:bg-[#fef5f6] border border-purple-200/80 text-[11px] font-semibold text-slate-600 hover:text-[#8b4f58] cursor-pointer"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2.5 items-end">
                <div className="col-span-5">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Precio unitario ($)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={precioGenerico}
                    onChange={(e) => setPrecioGenerico(e.target.value)}
                    placeholder="Ej: 1500"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-mono text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:border-[#d97786]"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Cant.
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={cantidadGenerico}
                    onChange={(e) => setCantidadGenerico(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-mono text-xs sm:text-sm font-bold text-slate-900 text-center focus:outline-hidden focus:border-[#d97786]"
                  />
                </div>
                <div className="col-span-4">
                  <button
                    type="button"
                    onClick={agregarGenericoAlTicket}
                    className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-white text-xs font-bold cursor-pointer min-h-[40px]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Al ticket</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ticket en curso */}
        <div className="rounded-2xl border border-slate-200/90 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
            <span className="font-extrabold text-purple-950 uppercase tracking-wider">
              Artículos de esta venta ({itemsTicket.reduce((a, b) => a + b.cantidad, 0)})
            </span>
            <span className="font-mono font-bold text-slate-700">
              Subtotal: $ {subtotalTicket.toLocaleString('es-AR')}
            </span>
          </div>

          {itemsTicket.length > 0 ? (
            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
              {itemsTicket.map((item) => (
                <div
                  key={item.id}
                  className="px-3.5 py-2.5 flex items-center justify-between gap-2.5 bg-white"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                          item.origen === 'catalogo'
                            ? 'bg-[#fef5f6] text-[#8b4f58] border-[#f2d3d8]'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {item.origen === 'catalogo' ? 'Catálogo' : 'Genérico'}
                      </span>
                      <p className="font-heading text-xs font-bold text-slate-900 truncate">
                        {item.nombre}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[11px] text-slate-400">$</span>
                      <input
                        type="number"
                        min={0}
                        step="any"
                        value={item.precioUnitario}
                        onChange={(e) =>
                          actualizarPrecioItemTicket(item.id, Number(e.target.value))
                        }
                        aria-label={`Precio unitario de ${item.nombre}`}
                        className="w-20 px-1.5 py-0.5 rounded-md border border-slate-200 bg-slate-50 font-mono text-[11px] font-bold text-slate-800 focus:bg-white focus:border-[#d97786] focus:outline-hidden"
                      />
                      <span className="text-[11px] text-slate-400">c/u</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => actualizarCantidadItemTicket(item.id, -1)}
                        className="w-6 h-6 rounded-md hover:bg-white text-slate-700 flex items-center justify-center cursor-pointer"
                        aria-label="Restar"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-mono text-xs font-bold text-slate-900">
                        {item.cantidad}
                      </span>
                      <button
                        type="button"
                        onClick={() => actualizarCantidadItemTicket(item.id, 1)}
                        className="w-6 h-6 rounded-md hover:bg-white text-slate-700 flex items-center justify-center cursor-pointer"
                        aria-label="Sumar"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono text-xs font-black text-purple-950 min-w-[72px] text-right">
                      $ {(item.precioUnitario * item.cantidad).toLocaleString('es-AR')}
                    </span>

                    <button
                      type="button"
                      onClick={() => quitarItemTicket(item.id)}
                      className="p-1 text-rose-400 hover:text-rose-600 cursor-pointer"
                      aria-label={`Quitar ${item.nombre}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 text-center text-xs text-slate-400 bg-white">
              Tocá uno o varios productos arriba para armar la compra del cliente.
            </div>
          )}
        </div>

        {/* Forma de Pago: 5 opciones claras y bien diferenciadas (4 canales + Pago Mixto destacado) */}
        <div className="space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label className="text-xs sm:text-sm font-extrabold text-purple-950">
              ¿Cómo paga el cliente?
            </label>
            <span className="text-[11px] text-slate-500">
              Elegí un medio de pago o tocá <strong>Pago Mixto</strong> para dividir entre dos.
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {CONFIG_MEDIOS.map((mp) => {
              const Icono = mp.icono;
              const activo = !esPagoMixto && medioPrincipal === mp.id;
              return (
                <button
                  key={mp.id}
                  type="button"
                  onClick={() => {
                    setEsPagoMixto(false);
                    setMedioPrincipal(mp.id);
                    setMontoPrincipalMixto('');
                    if (mp.id !== 'credito') {
                      setRecargoPorcentaje(0);
                      setMontoFinalManual('');
                    }
                  }}
                  className={`flex flex-col items-center justify-center gap-0.5 px-3 py-3 rounded-2xl border-2 text-center transition-all cursor-pointer min-h-[68px] ${
                    activo
                      ? `${mp.activa} scale-[1.01]`
                      : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-slate-50/70'
                  }`}
                >
                  <Icono className="w-4.5 h-4.5 shrink-0 mb-0.5" />
                  <span className="text-xs font-extrabold leading-tight">{mp.nombre}</span>
                  <span
                    className={`text-[10px] leading-tight ${
                      activo ? 'text-white/85' : 'text-slate-400'
                    }`}
                  >
                    {mp.subtitulo}
                  </span>
                </button>
              );
            })}

            {/* 5° Botón Protagonista: Pago Mixto */}
            <button
              type="button"
              onClick={() => {
                setEsPagoMixto(true);
                setPagaConInput('');
                if (medioPrincipal === medioSecundario) {
                  setMedioSecundario(
                    medioPrincipal === 'efectivo' ? 'transferencia' : 'efectivo'
                  );
                }
              }}
              className={`col-span-2 sm:col-span-1 flex flex-col items-center justify-center gap-0.5 px-3 py-3 rounded-2xl border-2 text-center transition-all cursor-pointer min-h-[68px] ${
                esPagoMixto
                  ? 'bg-purple-950 text-white border-purple-950 shadow-sm scale-[1.01]'
                  : 'bg-[#fdf5f8] text-purple-950 border-[#e7b9c8] hover:border-[#d97786] hover:bg-[#fceaf0]'
              }`}
            >
              <Split className={`w-4.5 h-4.5 shrink-0 mb-0.5 ${esPagoMixto ? 'text-rose-200' : 'text-[#d97786]'}`} />
              <span className="text-xs font-extrabold leading-tight">Pago Mixto</span>
              <span
                className={`text-[10px] leading-tight ${
                  esPagoMixto ? 'text-purple-200' : 'text-[#8b4f58]'
                }`}
              >
                Combinar 2 medios
              </span>
            </button>
          </div>

          {esPagoMixto && (
            <div className="p-4 rounded-2xl bg-purple-50/70 border-2 border-purple-200 space-y-3 animate-in fade-in duration-150">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-extrabold text-purple-950 flex items-center gap-1.5">
                  <Split className="w-4 h-4 text-[#d97786]" />
                  <span>Pago dividido en 2 medios</span>
                </span>
                <span className="font-mono font-black text-purple-950 bg-white px-2.5 py-1 rounded-lg border border-purple-200">
                  Total a cubrir: $ {totalACobrar.toLocaleString('es-AR')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-purple-950">
                    1° Medio — ¿Cuánto paga con {nombreMedioPrincipal}?
                  </label>
                  <select
                    value={medioPrincipal}
                    onChange={(e) => setMedioPrincipal(e.target.value as MedioPagoCaja)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-xs font-bold text-slate-800"
                  >
                    {CONFIG_MEDIOS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre} ({m.subtitulo})
                      </option>
                    ))}
                  </select>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                      $
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={montoPrincipalMixto}
                      onChange={(e) => setMontoPrincipalMixto(e.target.value)}
                      placeholder="Ej: 6000"
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-purple-300 font-mono text-sm font-bold text-slate-900 focus:outline-hidden focus:border-purple-700"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-purple-950">
                    2° Medio — Resta pagar con {nombreMedioSecundario}
                  </label>
                  <select
                    value={medioSecundario}
                    onChange={(e) => setMedioSecundario(e.target.value as MedioPagoCaja)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-xs font-bold text-slate-800"
                  >
                    {CONFIG_MEDIOS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre} ({m.subtitulo})
                      </option>
                    ))}
                  </select>
                  <div
                    className={`w-full px-3 py-2 rounded-xl border font-mono text-sm font-black flex items-center justify-between ${
                      monto1ExcedeTotal
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-white border-dashed border-purple-300 text-purple-950'
                    }`}
                  >
                    <span>$ {monto2Num.toLocaleString('es-AR')}</span>
                    {!monto1ExcedeTotal && monto1Num > 0 && totalACobrar > 0 && (
                      <span className="text-[10px] font-sans font-semibold text-slate-500">
                        ({totalACobrar.toLocaleString('es-AR')} − {monto1Num.toLocaleString('es-AR')})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {monto1ExcedeTotal && (
                <p className="text-[11px] font-bold text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    El importe ingresado (${monto1Raw.toLocaleString('es-AR')}) debe ser menor al total ($
                    {totalACobrar.toLocaleString('es-AR')}) para dividir el pago.
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Recargo / Ajuste Final para Crédito */}
          {(medioPrincipal === 'credito' ||
            (esPagoMixto && medioSecundario === 'credito')) && (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-amber-600" />
                  <span>Recargo por cuotas / Crédito</span>
                </span>
                {recargoCalculado > 0 && (
                  <span className="text-[11px] font-mono font-bold text-amber-800">
                    +$ {recargoCalculado.toLocaleString('es-AR')}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {RECARGOS_RAPIDOS.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => {
                      setRecargoPorcentaje(pct);
                      setMontoFinalManual('');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer transition-colors ${
                      recargoPorcentaje === pct && montoFinalManual === ''
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-100/60'
                    }`}
                  >
                    {pct === 0 ? 'Sin recargo' : `+${pct}%`}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="text-[11px] font-semibold text-amber-950 shrink-0">
                  O editar monto final ($):
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={montoFinalManual}
                  onChange={(e) => setMontoFinalManual(e.target.value)}
                  placeholder={String(totalAutomatico)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-amber-300 font-mono text-xs font-bold text-slate-900 focus:outline-hidden focus:border-amber-600"
                />
              </div>
            </div>
          )}

          {/* Calculadora de Efectivo: siempre responde (Vuelto, Pago Exacto o Faltante con paso rápido a Pago Mixto) */}
          {montoEnEfectivoDelTicket > 0 && itemsTicket.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <label className="block text-xs font-bold text-emerald-950">
                  ¿Con cuánto efectivo paga el cliente?
                  <span className="font-normal text-emerald-800/80 ml-1">
                    (para calcular vuelto o detectar si falta plata)
                  </span>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                      $
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={pagaConInput}
                      onChange={(e) => setPagaConInput(e.target.value)}
                      placeholder={`Ej: ${montoEnEfectivoDelTicket}`}
                      className="w-36 pl-7 pr-3 py-2 rounded-xl bg-white border border-emerald-300 font-mono text-sm font-bold text-slate-900 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPagaConInput(String(montoEnEfectivoDelTicket))}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-900 cursor-pointer transition-colors"
                  >
                    Pago exacto ($ {montoEnEfectivoDelTicket.toLocaleString('es-AR')})
                  </button>
                </div>
              </div>

              {/* Respuesta visual inmediata según el monto escrito */}
              {pagaConInput.trim() !== '' && pagaConNum > 0 ? (
                pagaConNum >= montoEnEfectivoDelTicket ? (
                  <div className="px-4 py-2.5 rounded-xl bg-white border-2 border-emerald-300 text-right shrink-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                      {pagaConNum === montoEnEfectivoDelTicket
                        ? 'Pago exacto'
                        : 'Vuelto a entregar'}
                    </span>
                    <span className="font-heading text-lg font-black text-emerald-800">
                      $ {(pagaConNum - montoEnEfectivoDelTicket).toLocaleString('es-AR')}
                    </span>
                  </div>
                ) : (
                  <div className="px-4 py-2.5 rounded-xl bg-amber-50 border-2 border-amber-300 flex flex-col items-start md:items-end gap-1.5 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block">
                        Falta para completar
                      </span>
                      <span className="font-heading text-lg font-black text-amber-950">
                        $ {(montoEnEfectivoDelTicket - pagaConNum).toLocaleString('es-AR')}
                      </span>
                    </div>
                    {!esPagoMixto && (
                      <button
                        type="button"
                        onClick={() => {
                          setEsPagoMixto(true);
                          setMedioPrincipal('efectivo');
                          setMedioSecundario('transferencia');
                          setMontoPrincipalMixto(String(pagaConNum));
                          setPagaConInput('');
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 text-white text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        <Split className="w-3 h-3" />
                        <span>
                          Pagar los $ {(montoEnEfectivoDelTicket - pagaConNum).toLocaleString('es-AR')} con otro medio
                        </span>
                      </button>
                    )}
                  </div>
                )
              ) : (
                <div className="px-3.5 py-2 rounded-xl bg-white/70 border border-dashed border-emerald-300 text-[11px] text-emerald-800/80 shrink-0">
                  Escribí el billete recibido para ver el vuelto al instante
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botón de Cobro */}
        <button
          type="submit"
          disabled={itemsTicket.length === 0 || monto1ExcedeTotal}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#d97786] hover:bg-[#c46372] disabled:bg-slate-200 disabled:text-slate-400 active:scale-98 text-white font-extrabold text-sm shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed min-h-[50px]"
        >
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>
            Cobrar y Registrar Venta
            {totalACobrar > 0 ? ` — $ ${totalACobrar.toLocaleString('es-AR')}` : ''}
          </span>
        </button>
      </form>

      {/* 4. CAMBIO INICIAL Y SALIDAS / GASTOS EN EFECTIVO (Debajo de Nueva Venta de Mostrador) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs">
              <Wallet className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="text-slate-600 font-medium">Cambio inicial:</span>
              <span className="font-mono font-black text-emerald-950">
                $ {caja.fondoInicial.toLocaleString('es-AR')}
              </span>
              <button
                type="button"
                onClick={abrirEdicionFondo}
                className="text-[11px] font-bold text-emerald-700 hover:underline ml-1 cursor-pointer"
              >
                {caja.fondoInicial > 0 ? 'Editar' : 'Cargar cambio'}
              </button>
            </div>

            {resumen.egresosEfectivo > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">
                <ArrowDownCircle className="w-3.5 h-3.5 text-rose-600" />
                Salidas: -$ {resumen.egresosEfectivo.toLocaleString('es-AR')}
              </span>
            )}

            {resumen.ingresosExtraEfectivo > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-xs font-bold text-teal-800">
                <ArrowUpCircle className="w-3.5 h-3.5 text-teal-600" />
                Refuerzos: +$ {resumen.ingresosExtraEfectivo.toLocaleString('es-AR')}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setPanelMovimientoAbierto((prev) => !prev)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#fef5f6] hover:bg-[#fae6ea] text-[#7a3140] border border-[#f2d3d8] text-xs font-bold transition-colors cursor-pointer shrink-0 min-h-[40px]"
          >
            <ArrowDownCircle className="w-4 h-4 text-[#d97786]" />
            <span>
              {panelMovimientoAbierto
                ? 'Ocultar formulario'
                : 'Anotar salida / gasto en efectivo'}
            </span>
          </button>
        </div>

        {editandoFondo && (
          <form
            onSubmit={guardarFondoInicial}
            className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 flex flex-col sm:flex-row items-stretch sm:items-end gap-3 animate-in fade-in duration-150"
          >
            <div className="flex-1">
              <label className="block text-xs font-bold text-emerald-950 mb-1">
                ¿Con cuánto cambio en efectivo arrancás el turno? ($)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={fondoInput}
                onChange={(e) => setFondoInput(e.target.value)}
                placeholder="Ej: 20000"
                autoFocus
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-emerald-300 font-mono text-sm font-bold text-slate-900 focus:outline-hidden focus:border-emerald-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditandoFondo(false)}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold cursor-pointer min-h-[40px]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer min-h-[40px]"
              >
                Guardar Cambio
              </button>
            </div>
          </form>
        )}

        {panelMovimientoAbierto && (
          <form
            onSubmit={registrarMovimientoEfectivo}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3 animate-in fade-in duration-150"
          >
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTipoMovimiento('egreso')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                  tipoMovimiento === 'egreso'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                <ArrowDownCircle className="w-3.5 h-3.5" />
                Salida / Gasto / Retiro (-)
              </button>
              <button
                type="button"
                onClick={() => setTipoMovimiento('ingreso_extra')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                  tipoMovimiento === 'ingreso_extra'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                <ArrowUpCircle className="w-3.5 h-3.5" />
                Refuerzo de cambio (+)
              </button>
            </div>

            {tipoMovimiento === 'egreso' && (
              <div className="flex flex-wrap gap-1.5">
                {SUGERENCIAS_EGRESOS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setConceptoMovimiento(sug)}
                    className="px-2.5 py-1 rounded-full bg-white hover:bg-rose-50 border border-slate-200 text-[11px] font-semibold text-slate-600 hover:text-rose-700 cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-6">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Motivo / Concepto *
                </label>
                <input
                  type="text"
                  value={conceptoMovimiento}
                  onChange={(e) => setConceptoMovimiento(e.target.value)}
                  placeholder={
                    tipoMovimiento === 'egreso'
                      ? 'Ej: Pago a repartidor de librería'
                      : 'Ej: Agregué cambio chico al cajón'
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#d97786]"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Importe ($) *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={montoMovimiento}
                  onChange={(e) => setMontoMovimiento(e.target.value)}
                  placeholder="Ej: 15000"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-mono text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:border-[#d97786]"
                />
              </div>
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded-xl bg-[#d97786] hover:bg-[#c46372] text-white text-xs font-bold cursor-pointer min-h-[40px]"
                >
                  Guardar Movimiento
                </button>
              </div>
            </div>
          </form>
        )}

        {caja.movimientosEfectivo.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
            {caja.movimientosEfectivo.map((mov) => (
              <div
                key={mov.id}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
                  mov.tipo === 'egreso'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                    : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                }`}
              >
                <span className="font-mono text-[10px] opacity-70">{mov.hora}</span>
                <span className="font-semibold">{mov.concepto}</span>
                <span className="font-mono font-black">
                  {mov.tipo === 'egreso' ? '-' : '+'}$ {mov.monto.toLocaleString('es-AR')}
                </span>
                <button
                  type="button"
                  onClick={() => handleEliminarMovimiento(mov.id)}
                  aria-label={`Quitar movimiento ${mov.concepto}`}
                  className="text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. VENTAS ANOTADAS HOY (Debajo y Desplegable cuando son muchas) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 bg-slate-50/90 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setVentasDesplegadas((prev) => !prev)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-purple-950 uppercase tracking-wider cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#d97786]" />
            <span>Ventas Anotadas Hoy</span>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-[#ede4f6] text-purple-950 normal-case">
              {caja.ventas.length}
            </span>
            {ventasDesplegadas ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {ventasDesplegadas && (
            <div className="inline-flex rounded-lg bg-white p-0.5 border border-slate-200 text-[11px]">
              {(['todas', 'validas', 'anuladas'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFiltroVentasHoy(f)}
                  className={`px-2.5 py-1 rounded-md font-bold capitalize cursor-pointer ${
                    filtroVentasHoy === f
                      ? 'bg-[#ede4f6] text-purple-950'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        {ventasDesplegadas && (
          <>
            {ventasMostradas.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {ventasMostradas.map((venta) => (
                  <div
                    key={venta.id}
                    className={`px-4 sm:px-5 py-3.5 space-y-2 transition-colors ${
                      venta.anulada ? 'bg-rose-50/30 opacity-70' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs font-black text-purple-950">
                          #{venta.numeroTicket}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400">
                          {venta.hora}
                        </span>
                        {venta.anulada ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                            Anulada
                          </span>
                        ) : (
                          venta.pagos.map((p, idx) => {
                            const conf =
                              CONFIG_MEDIOS.find((m) => m.id === p.medio) || CONFIG_MEDIOS[0];
                            return (
                              <span
                                key={`${p.medio}-${idx}`}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${conf.badge}`}
                              >
                                {conf.corto}
                                {venta.pagos.length > 1
                                  ? ` $${p.monto.toLocaleString('es-AR')}`
                                  : ''}
                              </span>
                            );
                          })
                        )}
                        {venta.recargoMonto > 0 && !venta.anulada && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                            +${venta.recargoMonto.toLocaleString('es-AR')} rec.
                          </span>
                        )}
                      </div>

                      <span
                        className={`font-mono text-sm font-black shrink-0 ${
                          venta.anulada ? 'line-through text-slate-400' : 'text-purple-950'
                        }`}
                      >
                        $ {venta.totalCobrado.toLocaleString('es-AR')}
                      </span>
                    </div>

                    <ul
                      className={`text-xs space-y-0.5 ${
                        venta.anulada ? 'line-through text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {venta.items.map((it) => (
                        <li key={it.id} className="flex items-center justify-between gap-2">
                          <span className="truncate">
                            <strong className="text-slate-800">{it.cantidad}×</strong> {it.nombre}
                          </span>
                          <span className="font-mono text-[11px] text-slate-400 shrink-0">
                            $ {(it.precioUnitario * it.cantidad).toLocaleString('es-AR')}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {!venta.anulada && (
                        <button
                          type="button"
                          onClick={() => abrirEditorVenta(venta)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-950 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Editar pago</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleAnular(venta)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                          venta.anulada
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                        }`}
                      >
                        {venta.anulada ? (
                          <>
                            <RotateCcw className="w-3 h-3" />
                            <span>Restaurar</span>
                          </>
                        ) : (
                          <>
                            <Ban className="w-3 h-3" />
                            <span>Anular</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Botón desplegable cuando hay muchas ventas */}
                {hayVentasOcultas && (
                  <div className="p-3 bg-slate-50/70 text-center">
                    <button
                      type="button"
                      onClick={() => setMostrarTodasVentas((prev) => !prev)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-purple-50 text-purple-950 border border-purple-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {mostrarTodasVentas ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          <span>Mostrar solo las últimas {LIMITE_VENTAS_VISIBLES}</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          <span>
                            Ver todas las ventas ({ventasFiltradas.length - LIMITE_VENTAS_VISIBLES} más)
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center space-y-2">
                <div className="w-11 h-11 rounded-2xl bg-[#fef5f6] border border-[#f2d3d8] text-[#d97786] flex items-center justify-center mx-auto">
                  <Receipt className="w-5 h-5" />
                </div>
                <p className="font-heading text-sm font-bold text-slate-800">
                  {filtroVentasHoy === 'anuladas'
                    ? 'No hay ventas anuladas hoy'
                    : 'Todavía no cobraste ventas hoy'}
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  A medida que registres ventas arriba irán apareciendo acá con opción de corregir el medio de pago o anular.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL 1: Corregir Medio de Pago / Total */}
      {ventaEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#ded0f2] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-gradient-to-r from-[#fef5f6] to-[#ede4f6] border-b border-[#e8d9f3] flex items-center justify-between">
              <h4 className="font-heading text-sm sm:text-base font-black text-purple-950">
                Corregir Pago — Venta #{ventaEditando.numeroTicket}
              </h4>
              <button
                type="button"
                onClick={() => setVentaEditando(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-white/70 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={guardarEdicionVenta} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total cobrado ($)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={editTotalFinal}
                  onChange={(e) => setEditTotalFinal(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm font-bold text-slate-900"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Medio de pago</span>
                <button
                  type="button"
                  onClick={() => setEditEsMixto((prev) => !prev)}
                  className="text-xs font-bold text-purple-900 hover:underline cursor-pointer"
                >
                  {editEsMixto ? 'Cambiar a un solo medio' : 'Dividir en pago mixto'}
                </button>
              </div>

              {!editEsMixto ? (
                <div className="grid grid-cols-2 gap-2">
                  {CONFIG_MEDIOS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setEditMedio1(m.id)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer ${
                        editMedio1 === m.id
                          ? m.activa
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {m.nombre}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <select
                      value={editMedio1}
                      onChange={(e) => setEditMedio1(e.target.value as MedioPagoCaja)}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                    >
                      {CONFIG_MEDIOS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nombre}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editMonto1}
                      onChange={(e) => setEditMonto1(e.target.value)}
                      placeholder="Monto 1"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-mono text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <select
                      value={editMedio2}
                      onChange={(e) => setEditMedio2(e.target.value as MedioPagoCaja)}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                    >
                      {CONFIG_MEDIOS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nombre}
                        </option>
                      ))}
                    </select>
                    <div className="px-3 py-2 rounded-xl bg-slate-100 font-mono text-xs font-black text-purple-950">
                      $ {Math.max(0, parsearMontoAR(editTotalFinal) - parsearMontoAR(editMonto1)).toLocaleString('es-AR')}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVentaEditando(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#d97786] hover:bg-[#c46372] text-white text-xs font-bold cursor-pointer"
                >
                  Guardar Corrección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Arqueo Físico y Cierre de Caja al Historial */}
      {modalCierreAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#ded0f2] w-full max-w-lg max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-gradient-to-r from-[#fef5f6] to-[#ede4f6] border-b border-[#e8d9f3] flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-[#d97786]" />
                <h4 className="font-heading text-base font-black text-purple-950">
                  Arqueo y Cierre de Caja
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setModalCierreAbierto(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-white/70 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2 text-xs sm:text-sm">
                <p className="text-[11px] font-black uppercase tracking-wider text-purple-950 mb-1">
                  Ventas del día ({resumen.cantidadVentas} ventas • {resumen.cantidadArticulos} art.)
                </p>
                <div className="flex justify-between">
                  <span className="text-slate-600">Efectivo</span>
                  <span className="font-mono font-bold">$ {resumen.ventasEfectivo.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Transferencia (MP / Banco)</span>
                  <span className="font-mono font-bold">$ {resumen.ventasTransferencia.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Débito (Lote Posnet)</span>
                  <span className="font-mono font-bold">$ {resumen.ventasDebito.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Crédito (Posnet / cuotas)</span>
                  <span className="font-mono font-bold">$ {resumen.ventasCredito.toLocaleString('es-AR')}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-purple-950">
                  <span>TOTAL VENDIDO</span>
                  <span className="font-mono text-base">$ {resumen.totalVentas.toLocaleString('es-AR')}</span>
                </div>
              </div>

              <div className="rounded-2xl bg-emerald-50/50 border border-emerald-200 p-4 space-y-2.5 text-xs sm:text-sm">
                <p className="text-[11px] font-black uppercase tracking-wider text-emerald-900">
                  Conteo físico del cajón
                </p>
                <div className="space-y-1 text-xs text-emerald-950/90">
                  <div className="flex justify-between">
                    <span>Cambio inicial</span>
                    <span className="font-mono">$ {resumen.fondoInicial.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>+ Ventas en efectivo</span>
                    <span className="font-mono">+$ {resumen.ventasEfectivo.toLocaleString('es-AR')}</span>
                  </div>
                  {resumen.ingresosExtraEfectivo > 0 && (
                    <div className="flex justify-between">
                      <span>+ Refuerzos de cambio</span>
                      <span className="font-mono">+$ {resumen.ingresosExtraEfectivo.toLocaleString('es-AR')}</span>
                    </div>
                  )}
                  {resumen.egresosEfectivo > 0 && (
                    <div className="flex justify-between text-rose-700 font-semibold">
                      <span>− Salidas / gastos en efectivo</span>
                      <span className="font-mono">-$ {resumen.egresosEfectivo.toLocaleString('es-AR')}</span>
                    </div>
                  )}
                  <div className="pt-1.5 border-t border-emerald-200 flex justify-between font-black text-emerald-950 text-sm">
                    <span>Efectivo esperado en cajón</span>
                    <span className="font-mono">$ {resumen.efectivoEsperadoEnCajon.toLocaleString('es-AR')}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                    ¿Cuánto efectivo contaste físicamente en el cajón? ($)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={efectivoContadoInput}
                    onChange={(e) => setEfectivoContadoInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 font-mono text-base font-black text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
                    diferenciaArqueo === 0
                      ? 'bg-emerald-100/80 border-emerald-300 text-emerald-900'
                      : diferenciaArqueo > 0
                        ? 'bg-sky-50 border-sky-200 text-sky-900'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {diferenciaArqueo === 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    {diferenciaArqueo === 0
                      ? '¡Caja exacta! Coincide perfecto'
                      : diferenciaArqueo > 0
                        ? 'Sobrante en cajón'
                        : 'Faltante en cajón'}
                  </span>
                  <span className="font-mono">
                    {diferenciaArqueo > 0 ? '+' : ''}
                    $ {diferenciaArqueo.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Cambio que dejás para mañana ($)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={fondoParaProximoTurno}
                    onChange={(e) => setFondoParaProximoTurno(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs sm:text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Observación del día (opcional)
                  </label>
                  <input
                    type="text"
                    value={observacionesCierre}
                    onChange={(e) => setObservacionesCierre(e.target.value)}
                    placeholder="Ej: Día de mucho escolar"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopiarAntesDeCerrar}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-purple-950 border border-purple-200 text-xs font-bold transition-colors cursor-pointer min-h-[42px]"
              >
                {copiadoPreview ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">¡Resumen copiado para WhatsApp!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#d97786]" />
                    <span>Copiar resumen para WhatsApp</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setModalCierreAbierto(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 text-xs sm:text-sm cursor-pointer min-h-[42px]"
                >
                  Seguir trabajando
                </button>
                <button
                  type="button"
                  onClick={handleConfirmarCierre}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all cursor-pointer min-h-[42px]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Cierre en Historial</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
