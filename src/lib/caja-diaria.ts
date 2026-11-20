export type MedioPagoCaja = 'efectivo' | 'transferencia' | 'debito' | 'credito';

export interface ItemVenta {
  id: string;
  origen: 'catalogo' | 'generico';
  productoId?: string;
  nombre: string;
  categoria?: string;
  precioUnitario: number;
  cantidad: number;
}

export interface PagoDetalle {
  medio: MedioPagoCaja;
  monto: number;
}

export interface VentaTicket {
  id: string;
  numeroTicket: number;
  fechaIso: string;
  hora: string;
  items: ItemVenta[];
  subtotalItems: number;
  recargoPorcentaje: number;
  recargoMonto: number;
  totalCobrado: number;
  pagos: PagoDetalle[];
  pagoConEfectivo?: number | null;
  vueltoEntregado?: number | null;
  nota?: string;
  anulada?: boolean;
  motivoAnulacion?: string;
  fechaAnulacion?: string;
}

export interface MovimientoEfectivo {
  id: string;
  hora: string;
  tipo: 'egreso' | 'ingreso_extra';
  concepto: string;
  monto: number;
  anulado?: boolean;
}

export interface CajaAbiertaState {
  fechaClave: string; // YYYY-MM-DD
  fondoInicial: number;
  ventas: VentaTicket[];
  movimientosEfectivo: MovimientoEfectivo[];
}

export interface CierreCaja {
  id: string;
  fechaClave: string; // YYYY-MM-DD
  fechaLegible: string; // DD/MM/AAAA
  horaCierre: string; // HH:mm
  fondoInicial: number;
  ventasEfectivo: number;
  ventasTransferencia: number;
  ventasDebito: number;
  ventasCredito: number;
  totalVentas: number;
  egresosEfectivo: number;
  ingresosExtraEfectivo: number;
  efectivoEsperadoEnCajon: number;
  efectivoContadoReal: number;
  diferenciaArqueo: number;
  cantidadVentas: number;
  cantidadAnuladas: number;
  cantidadArticulos: number;
  observaciones?: string;
  ventasSnapshot: VentaTicket[];
  movimientosSnapshot: MovimientoEfectivo[];
}

export interface ResumenCajaEnVivo {
  fondoInicial: number;
  ventasEfectivo: number;
  ventasTransferencia: number;
  ventasDebito: number;
  ventasCredito: number;
  totalVentas: number;
  egresosEfectivo: number;
  ingresosExtraEfectivo: number;
  efectivoEsperadoEnCajon: number;
  cantidadVentas: number;
  cantidadAnuladas: number;
  cantidadArticulos: number;
}

export const STORAGE_KEY_CAJA_ABIERTA = 'motivos_caja_abierta_v2';
export const STORAGE_KEY_HISTORIAL = 'motivos_caja_historial_v2';
const LEGACY_STORAGE_KEY_V1 = 'motivos_caja_diaria_v1';
const API_CAJA_BASE = 'http://localhost:8080/api/caja';

/**
 * Parsea importes escritos por usuarios en Argentina:
 * - "1000" -> 1000
 * - "1.000" -> 1000 (separador de miles)
 * - "1.500,50" -> 1500.5
 * - "1500.50" -> 1500.5
 */
export function parsearMontoAR(valor: string): number {
  const limpio = valor.trim().replace(/\$/g, '').replace(/\s+/g, '');
  if (!limpio) return 0;

  // Caso con coma decimal (ej: "1.500,50" o "1500,5")
  if (limpio.includes(',')) {
    const normalizado = limpio.replace(/\./g, '').replace(',', '.');
    const n = Number(normalizado);
    return isNaN(n) ? 0 : n;
  }

  // Caso con puntos de miles argentinos (ej: "1.000" o "12.500")
  if (/^\d{1,3}(\.\d{3})+$/.test(limpio)) {
    const n = Number(limpio.replace(/\./g, ''));
    return isNaN(n) ? 0 : n;
  }

  const n = Number(limpio);
  return isNaN(n) ? 0 : n;
}

export const ETIQUETAS_MEDIO_PAGO: Record<
  MedioPagoCaja,
  { nombre: string; corto: string; descripcion: string }
> = {
  efectivo: {
    nombre: 'Efectivo',
    corto: 'Efectivo',
    descripcion: 'Billetes en cajón físico',
  },
  transferencia: {
    nombre: 'Transferencia',
    corto: 'Transf.',
    descripcion: 'Mercado Pago / Banco',
  },
  debito: {
    nombre: 'Débito',
    corto: 'Débito',
    descripcion: 'Lote de Posnet',
  },
  credito: {
    nombre: 'Crédito',
    corto: 'Crédito',
    descripcion: 'Posnet / cuotas',
  },
};

export function obtenerFechaClave(fecha: Date = new Date()): string {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatearFechaClaveLegible(fechaClave: string): string {
  const partes = fechaClave.split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return fechaClave;
}

export function obtenerHoraActual(fecha: Date = new Date()): string {
  const h = String(fecha.getHours()).padStart(2, '0');
  const m = String(fecha.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function crearCajaVacia(fechaClave: string = obtenerFechaClave()): CajaAbiertaState {
  return {
    fechaClave,
    fondoInicial: 0,
    ventas: [],
    movimientosEfectivo: [],
  };
}

export function calcularResumenCaja(caja: CajaAbiertaState): ResumenCajaEnVivo {
  let ventasEfectivo = 0;
  let ventasTransferencia = 0;
  let ventasDebito = 0;
  let ventasCredito = 0;
  let cantidadVentas = 0;
  let cantidadAnuladas = 0;
  let cantidadArticulos = 0;

  for (const venta of caja.ventas) {
    if (venta.anulada) {
      cantidadAnuladas += 1;
      continue;
    }

    cantidadVentas += 1;
    for (const item of venta.items) {
      cantidadArticulos += item.cantidad;
    }

    for (const pago of venta.pagos) {
      if (pago.medio === 'efectivo') ventasEfectivo += pago.monto;
      else if (pago.medio === 'transferencia') ventasTransferencia += pago.monto;
      else if (pago.medio === 'debito') ventasDebito += pago.monto;
      else if (pago.medio === 'credito') ventasCredito += pago.monto;
    }
  }

  let egresosEfectivo = 0;
  let ingresosExtraEfectivo = 0;

  for (const mov of caja.movimientosEfectivo) {
    if (mov.anulado) continue;
    if (mov.tipo === 'egreso') egresosEfectivo += mov.monto;
    else ingresosExtraEfectivo += mov.monto;
  }

  const totalVentas = ventasEfectivo + ventasTransferencia + ventasDebito + ventasCredito;
  const efectivoEsperadoEnCajon =
    (caja.fondoInicial || 0) + ventasEfectivo + ingresosExtraEfectivo - egresosEfectivo;

  return {
    fondoInicial: caja.fondoInicial || 0,
    ventasEfectivo,
    ventasTransferencia,
    ventasDebito,
    ventasCredito,
    totalVentas,
    egresosEfectivo,
    ingresosExtraEfectivo,
    efectivoEsperadoEnCajon,
    cantidadVentas,
    cantidadAnuladas,
    cantidadArticulos,
  };
}

export function cargarCajaAbierta(): CajaAbiertaState {
  if (typeof window === 'undefined') return crearCajaVacia();

  try {
    const raw = localStorage.getItem(STORAGE_KEY_CAJA_ABIERTA);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CajaAbiertaState>;
      return {
        fechaClave: parsed.fechaClave || obtenerFechaClave(),
        fondoInicial: typeof parsed.fondoInicial === 'number' ? parsed.fondoInicial : 0,
        ventas: Array.isArray(parsed.ventas) ? parsed.ventas : [],
        movimientosEfectivo: Array.isArray(parsed.movimientosEfectivo)
          ? parsed.movimientosEfectivo
          : [],
      };
    }

    // Migración suave desde v1 si había ventas anotadas hoy
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY_V1);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw) as {
        fecha?: string;
        ventas?: Array<{
          id: string;
          hora: string;
          origen: 'catalogo' | 'generico';
          productoId?: string;
          nombre: string;
          detalle?: string;
          precioUnitario: number;
          cantidad: number;
          medioPago: 'efectivo' | 'transferencia' | 'credito';
        }>;
      };
      if (Array.isArray(legacy.ventas) && legacy.ventas.length > 0) {
        const tickets: VentaTicket[] = legacy.ventas.map((v, idx) => {
          const total = v.precioUnitario * v.cantidad;
          return {
            id: v.id,
            numeroTicket: legacy.ventas!.length - idx,
            fechaIso: new Date().toISOString(),
            hora: v.hora,
            items: [
              {
                id: `${v.id}-item`,
                origen: v.origen,
                productoId: v.productoId,
                nombre: v.nombre,
                categoria: v.detalle,
                precioUnitario: v.precioUnitario,
                cantidad: v.cantidad,
              },
            ],
            subtotalItems: total,
            recargoPorcentaje: 0,
            recargoMonto: 0,
            totalCobrado: total,
            pagos: [{ medio: v.medioPago, monto: total }],
          };
        });
        return {
          fechaClave: legacy.fecha || obtenerFechaClave(),
          fondoInicial: 0,
          ventas: tickets,
          movimientosEfectivo: [],
        };
      }
    }
  } catch {
    // Ignorar errores de parseo
  }

  return crearCajaVacia();
}

export function guardarCajaAbierta(caja: CajaAbiertaState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CAJA_ABIERTA, JSON.stringify(caja));
    window.dispatchEvent(new Event('motivos-caja-updated'));
  } catch {
    // Ignorar errores de cuota
  }
}

export function cargarHistorialCierres(): CierreCaja[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORIAL);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function guardarHistorialCierres(cierres: CierreCaja[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_HISTORIAL, JSON.stringify(cierres));
    window.dispatchEvent(new Event('motivos-caja-updated'));
  } catch {
    // Ignorar errores de cuota
  }
}

export function filtrarHistorialPorPeriodo(
  cierres: CierreCaja[],
  periodo: 'todos' | 'hoy' | 'semana' | 'mes',
  fechaReferencia: Date = new Date()
): CierreCaja[] {
  if (periodo === 'todos') return cierres;

  const hoyClave = obtenerFechaClave(fechaReferencia);

  if (periodo === 'hoy') {
    return cierres.filter((c) => c.fechaClave === hoyClave);
  }

  if (periodo === 'semana') {
    const hace7Dias = new Date(fechaReferencia);
    hace7Dias.setDate(hace7Dias.getDate() - 6);
    const limiteClave = obtenerFechaClave(hace7Dias);
    return cierres.filter((c) => c.fechaClave >= limiteClave && c.fechaClave <= hoyClave);
  }

  // Este mes
  const prefijoMes = hoyClave.slice(0, 7); // YYYY-MM
  return cierres.filter((c) => c.fechaClave.startsWith(prefijoMes));
}

export function generarTextoResumenCierre(cierre: CierreCaja): string {
  const diffTexto =
    cierre.diferenciaArqueo === 0
      ? 'Exacta ($ 0)'
      : cierre.diferenciaArqueo > 0
        ? `Sobrante (+$ ${cierre.diferenciaArqueo.toLocaleString('es-AR')})`
        : `Faltante (-$ ${Math.abs(cierre.diferenciaArqueo).toLocaleString('es-AR')})`;

  const lineas = [
    `CIERRE DE CAJA — LIBRERÍA MOTIVOS`,
    `Fecha: ${cierre.fechaLegible} • Hora cierre: ${cierre.horaCierre} hs`,
    `Ventas válidas: ${cierre.cantidadVentas} (${cierre.cantidadArticulos} artículos)${
      cierre.cantidadAnuladas > 0 ? ` • Anuladas: ${cierre.cantidadAnuladas}` : ''
    }`,
    `--------------------------------`,
    `VENTAS POR MEDIO DE PAGO`,
    `Efectivo: $ ${cierre.ventasEfectivo.toLocaleString('es-AR')}`,
    `Transferencia (MP / Banco): $ ${cierre.ventasTransferencia.toLocaleString('es-AR')}`,
    `Débito (Posnet): $ ${cierre.ventasDebito.toLocaleString('es-AR')}`,
    `Crédito (Posnet): $ ${cierre.ventasCredito.toLocaleString('es-AR')}`,
    `TOTAL VENDIDO: $ ${cierre.totalVentas.toLocaleString('es-AR')}`,
    `--------------------------------`,
    `ARQUEO DE EFECTIVO EN CAJÓN`,
    `Cambio inicial: $ ${cierre.fondoInicial.toLocaleString('es-AR')}`,
    `Ventas en efectivo: +$ ${cierre.ventasEfectivo.toLocaleString('es-AR')}`,
    ...(cierre.ingresosExtraEfectivo > 0
      ? [`Refuerzos de cambio: +$ ${cierre.ingresosExtraEfectivo.toLocaleString('es-AR')}`]
      : []),
    ...(cierre.egresosEfectivo > 0
      ? [`Salidas / Gastos en efectivo: -$ ${cierre.egresosEfectivo.toLocaleString('es-AR')}`]
      : []),
    `Efectivo esperado: $ ${cierre.efectivoEsperadoEnCajon.toLocaleString('es-AR')}`,
    `Efectivo contado: $ ${cierre.efectivoContadoReal.toLocaleString('es-AR')}`,
    `Diferencia de arqueo: ${diffTexto}`,
  ];

  if (cierre.observaciones?.trim()) {
    lineas.push(`--------------------------------`, `Nota: ${cierre.observaciones.trim()}`);
  }

  return lineas.join('\n');
}

function escaparCSV(valor: string | number | undefined | null): string {
  const str = String(valor ?? '');
  if (str.includes(';') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function descargarArchivo(contenido: string, nombreArchivo: string, tipoMime: string) {
  const blob = new Blob([contenido], { type: tipoMime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exporta un cierre individual a CSV compatible con Excel (UTF-8 con BOM y separador ;)
 */
export function exportarCierreExcelCSV(cierre: CierreCaja): void {
  const filas: (string | number)[][] = [
    ['LIBRERÍA MOTIVOS — CIERRE DE CAJA', cierre.fechaLegible, `Hora: ${cierre.horaCierre}`],
    [],
    ['RESUMEN DE VENTAS', 'MONTO (ARS)'],
    ['Efectivo', cierre.ventasEfectivo],
    ['Transferencia (Banco / MP)', cierre.ventasTransferencia],
    ['Débito (Posnet)', cierre.ventasDebito],
    ['Crédito (Posnet)', cierre.ventasCredito],
    ['TOTAL VENDIDO', cierre.totalVentas],
    [],
    ['ARQUEO DE CAJÓN FÍSICO', 'MONTO (ARS)'],
    ['Cambio inicial', cierre.fondoInicial],
    ['Ventas en efectivo', cierre.ventasEfectivo],
    ['Refuerzos de cambio', cierre.ingresosExtraEfectivo],
    ['Salidas y gastos en efectivo', -cierre.egresosEfectivo],
    ['Efectivo esperado en cajón', cierre.efectivoEsperadoEnCajon],
    ['Efectivo contado real', cierre.efectivoContadoReal],
    ['Diferencia de arqueo', cierre.diferenciaArqueo],
    [],
    ['DETALLE DE VENTAS DEL DÍA'],
    ['Ticket', 'Hora', 'Estado', 'Artículos', 'Medios de Pago', 'Recargo', 'Total Cobrado'],
    ...cierre.ventasSnapshot.map((v) => [
      `#${v.numeroTicket}`,
      v.hora,
      v.anulada ? `ANULADA (${v.motivoAnulacion || 'Sin motivo'})` : 'Válida',
      v.items.map((it) => `${it.cantidad}x ${it.nombre}`).join(' + '),
      v.pagos
        .map((p) => `${ETIQUETAS_MEDIO_PAGO[p.medio].nombre}: $${p.monto}`)
        .join(' / '),
      v.recargoMonto,
      v.totalCobrado,
    ]),
  ];

  if (cierre.movimientosSnapshot.length > 0) {
    filas.push(
      [],
      ['MOVIMIENTOS DE EFECTIVO (SALIDAS / REFUERZOS)'],
      ['Hora', 'Tipo', 'Concepto', 'Estado', 'Monto'],
      ...cierre.movimientosSnapshot.map((m) => [
        m.hora,
        m.tipo === 'egreso' ? 'Salida / Gasto' : 'Refuerzo de cambio',
        m.concepto,
        m.anulado ? 'Anulado' : 'Válido',
        m.tipo === 'egreso' ? -m.monto : m.monto,
      ])
    );
  }

  const csv = '\uFEFF' + filas.map((f) => f.map(escaparCSV).join(';')).join('\r\n');
  descargarArchivo(
    csv,
    `cierre-caja-motivos-${cierre.fechaClave}.csv`,
    'text/csv;charset=utf-8;'
  );
}

/**
 * Exporta múltiples cierres filtrados (semana, mes o todos) a un Excel CSV consolidado
 */
export function exportarHistorialExcelCSV(cierres: CierreCaja[], sufijo: string): void {
  const filas: (string | number)[][] = [
    ['LIBRERÍA MOTIVOS — HISTORIAL DE CIERRES DE CAJA'],
    [],
    [
      'Fecha',
      'Hora Cierre',
      'Cant. Ventas',
      'Artículos',
      'Efectivo',
      'Transferencia',
      'Débito',
      'Crédito',
      'Total Vendido',
      'Cambio Inicial',
      'Salidas Efectivo',
      'Efectivo Esperado',
      'Efectivo Contado',
      'Diferencia Arqueo',
      'Observaciones',
    ],
    ...cierres.map((c) => [
      c.fechaLegible,
      c.horaCierre,
      c.cantidadVentas,
      c.cantidadArticulos,
      c.ventasEfectivo,
      c.ventasTransferencia,
      c.ventasDebito,
      c.ventasCredito,
      c.totalVentas,
      c.fondoInicial,
      c.egresosEfectivo,
      c.efectivoEsperadoEnCajon,
      c.efectivoContadoReal,
      c.diferenciaArqueo,
      c.observaciones || '',
    ]),
  ];

  const csv = '\uFEFF' + filas.map((f) => f.map(escaparCSV).join(';')).join('\r\n');
  descargarArchivo(
    csv,
    `historial-caja-motivos-${sufijo}.csv`,
    'text/csv;charset=utf-8;'
  );
}

/**
 * Abre una vista limpia lista para guardar como PDF o imprimir desde el navegador
 */
export function imprimirResumenCierrePDF(cierre: CierreCaja): void {
  if (typeof window === 'undefined') return;
  const ventana = window.open('', '_blank', 'width=820,height=920');
  if (!ventana) return;

  const diffColor =
    cierre.diferenciaArqueo === 0
      ? '#047857'
      : cierre.diferenciaArqueo > 0
        ? '#0369a1'
        : '#be123c';
  const diffLabel =
    cierre.diferenciaArqueo === 0
      ? 'Caja exacta ($ 0)'
      : cierre.diferenciaArqueo > 0
        ? `Sobrante (+$ ${cierre.diferenciaArqueo.toLocaleString('es-AR')})`
        : `Faltante (-$ ${Math.abs(cierre.diferenciaArqueo).toLocaleString('es-AR')})`;

  const filasVentasHtml = cierre.ventasSnapshot
    .map(
      (v) => `
      <tr style="${v.anulada ? 'opacity:0.55;text-decoration:line-through;' : ''}">
        <td>#${v.numeroTicket}</td>
        <td>${v.hora}</td>
        <td>${v.items.map((it) => `${it.cantidad}× ${it.nombre}`).join(', ')}</td>
        <td>${v.pagos
          .map((p) => `${ETIQUETAS_MEDIO_PAGO[p.medio].corto} $${p.monto.toLocaleString('es-AR')}`)
          .join(' + ')}</td>
        <td style="text-align:right;font-weight:700;">$ ${v.totalCobrado.toLocaleString('es-AR')}</td>
      </tr>`
    )
    .join('');

  ventana.document.write(`<!doctype html>
  <html lang="es">
    <head>
      <meta charset="utf-8" />
      <title>Cierre de Caja ${cierre.fechaLegible} — Librería Motivos</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; padding: 28px; max-width: 780px; margin: 0 auto; }
        h1 { margin: 0; font-size: 20px; color: #4c1d52; }
        .sub { color: #64748b; font-size: 13px; margin-top: 4px; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 20px 0; }
        .box { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; background: #f8fafc; }
        .box .lbl { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; }
        .box .val { font-size: 17px; font-weight: 800; color: #0f172a; margin-top: 4px; }
        .arqueo { border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; margin-bottom: 20px; }
        .row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
        .row.total { border-top: 1px solid #cbd5e1; margin-top: 6px; padding-top: 8px; font-weight: 800; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
        th, td { border-bottom: 1px solid #e2e8f0; padding: 7px 6px; text-align: left; }
        th { background: #f8fafc; color: #475569; font-size: 11px; text-transform: uppercase; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #d97786;padding-bottom:12px;">
        <div>
          <h1>Librería Motivos — Cierre de Caja</h1>
          <div class="sub">Fecha: ${cierre.fechaLegible} • Cierre: ${cierre.horaCierre} hs • ${cierre.cantidadVentas} ventas (${cierre.cantidadArticulos} artículos)</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;">Total Vendido</div>
          <div style="font-size:22px;font-weight:900;color:#4c1d52;">$ ${cierre.totalVentas.toLocaleString('es-AR')}</div>
        </div>
      </div>

      <div class="grid">
        <div class="box"><div class="lbl">Efectivo</div><div class="val">$ ${cierre.ventasEfectivo.toLocaleString('es-AR')}</div></div>
        <div class="box"><div class="lbl">Transferencia</div><div class="val">$ ${cierre.ventasTransferencia.toLocaleString('es-AR')}</div></div>
        <div class="box"><div class="lbl">Débito</div><div class="val">$ ${cierre.ventasDebito.toLocaleString('es-AR')}</div></div>
        <div class="box"><div class="lbl">Crédito</div><div class="val">$ ${cierre.ventasCredito.toLocaleString('es-AR')}</div></div>
      </div>

      <div class="arqueo">
        <div style="font-size:12px;font-weight:800;text-transform:uppercase;color:#4c1d52;margin-bottom:8px;">Arqueo de Efectivo en Cajón</div>
        <div class="row"><span>Cambio inicial</span><span>$ ${cierre.fondoInicial.toLocaleString('es-AR')}</span></div>
        <div class="row"><span>Ventas en efectivo</span><span>+$ ${cierre.ventasEfectivo.toLocaleString('es-AR')}</span></div>
        <div class="row"><span>Refuerzos de cambio</span><span>+$ ${cierre.ingresosExtraEfectivo.toLocaleString('es-AR')}</span></div>
        <div class="row"><span>Salidas / gastos en efectivo</span><span>-$ ${cierre.egresosEfectivo.toLocaleString('es-AR')}</span></div>
        <div class="row total"><span>Efectivo esperado en cajón</span><span>$ ${cierre.efectivoEsperadoEnCajon.toLocaleString('es-AR')}</span></div>
        <div class="row"><span>Efectivo contado físicamente</span><span><strong>$ ${cierre.efectivoContadoReal.toLocaleString('es-AR')}</strong></span></div>
        <div class="row"><span>Resultado del arqueo</span><span style="font-weight:800;color:${diffColor};">${diffLabel}</span></div>
        ${cierre.observaciones ? `<div style="margin-top:8px;font-size:12px;color:#475569;"><strong>Observaciones:</strong> ${cierre.observaciones}</div>` : ''}
      </div>

      <div style="font-size:12px;font-weight:800;text-transform:uppercase;color:#4c1d52;">Detalle de Ventas del Día</div>
      <table>
        <thead>
          <tr><th>#</th><th>Hora</th><th>Artículos</th><th>Pago</th><th style="text-align:right;">Total</th></tr>
        </thead>
        <tbody>${filasVentasHtml || '<tr><td colspan="5">Sin ventas registradas.</td></tr>'}</tbody>
      </table>

      <script>window.onload = function(){ window.print(); };</script>
    </body>
  </html>`);
  ventana.document.close();
}


// =====================================================================
// Integración con Backend Spring Boot + MySQL (/api/caja)
// Si el backend no está activo (ej. demo estática), se usa localStorage.
// =====================================================================

interface CajaDiariaApiDTO {
  id: string;
  fechaClave: string;
  fechaLegible: string;
  estado: string;
  horaCierre?: string | null;
  fondoInicial: number;
  ventasEfectivo: number;
  ventasTransferencia: number;
  ventasDebito: number;
  ventasCredito: number;
  totalVentas: number;
  egresosEfectivo: number;
  ingresosExtraEfectivo: number;
  efectivoEsperadoEnCajon: number;
  efectivoContadoReal: number;
  diferenciaArqueo: number;
  cantidadVentas: number;
  cantidadAnuladas: number;
  cantidadArticulos: number;
  observaciones?: string | null;
  ventas: VentaTicket[];
  movimientosEfectivo: MovimientoEfectivo[];
}

export function dtoACajaAbierta(dto: CajaDiariaApiDTO): CajaAbiertaState {
  return {
    fechaClave: dto.fechaClave || obtenerFechaClave(),
    fondoInicial: Number(dto.fondoInicial || 0),
    ventas: Array.isArray(dto.ventas) ? dto.ventas : [],
    movimientosEfectivo: Array.isArray(dto.movimientosEfectivo)
      ? dto.movimientosEfectivo
      : [],
  };
}

export function dtoACierreCaja(dto: CajaDiariaApiDTO): CierreCaja {
  return {
    id: String(dto.id),
    fechaClave: dto.fechaClave || obtenerFechaClave(),
    fechaLegible: dto.fechaLegible || formatearFechaClaveLegible(dto.fechaClave || ''),
    horaCierre: dto.horaCierre || '00:00',
    fondoInicial: Number(dto.fondoInicial || 0),
    ventasEfectivo: Number(dto.ventasEfectivo || 0),
    ventasTransferencia: Number(dto.ventasTransferencia || 0),
    ventasDebito: Number(dto.ventasDebito || 0),
    ventasCredito: Number(dto.ventasCredito || 0),
    totalVentas: Number(dto.totalVentas || 0),
    egresosEfectivo: Number(dto.egresosEfectivo || 0),
    ingresosExtraEfectivo: Number(dto.ingresosExtraEfectivo || 0),
    efectivoEsperadoEnCajon: Number(dto.efectivoEsperadoEnCajon || 0),
    efectivoContadoReal: Number(dto.efectivoContadoReal ?? dto.efectivoEsperadoEnCajon ?? 0),
    diferenciaArqueo: Number(dto.diferenciaArqueo || 0),
    cantidadVentas: Number(dto.cantidadVentas || 0),
    cantidadAnuladas: Number(dto.cantidadAnuladas || 0),
    cantidadArticulos: Number(dto.cantidadArticulos || 0),
    observaciones: dto.observaciones || undefined,
    ventasSnapshot: Array.isArray(dto.ventas) ? dto.ventas : [],
    movimientosSnapshot: Array.isArray(dto.movimientosEfectivo)
      ? dto.movimientosEfectivo
      : [],
  };
}

export async function apiObtenerCajaActual(): Promise<CajaAbiertaState | null> {
  try {
    const res = await fetch(`${API_CAJA_BASE}/actual`, { cache: 'no-store' });
    if (!res.ok) return null;
    const dto = (await res.json()) as CajaDiariaApiDTO;
    const caja = dtoACajaAbierta(dto);
    guardarCajaAbierta(caja);
    return caja;
  } catch {
    return null;
  }
}

export async function apiActualizarFondo(fondoInicial: number): Promise<CajaAbiertaState | null> {
  try {
    const res = await fetch(`${API_CAJA_BASE}/actual/fondo`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fondoInicial }),
    });
    if (!res.ok) return null;
    const dto = (await res.json()) as CajaDiariaApiDTO;
    const caja = dtoACajaAbierta(dto);
    guardarCajaAbierta(caja);
    return caja;
  } catch {
    return null;
  }
}

export async function apiRegistrarVenta(venta: Omit<VentaTicket, 'id' | 'numeroTicket' | 'fechaIso'>): Promise<CajaAbiertaState | null> {
  try {
    const res = await fetch(`${API_CAJA_BASE}/actual/ventas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venta),
    });
    if (!res.ok) return null;
    const dto = (await res.json()) as CajaDiariaApiDTO;
    const caja = dtoACajaAbierta(dto);
    guardarCajaAbierta(caja);
    return caja;
  } catch {
    return null;
  }
}

export async function apiEditarPagoVenta(
  ventaId: string,
  totalCobrado: number,
  pagos: PagoDetalle[]
): Promise<CajaAbiertaState | null> {
  const numericId = Number(ventaId);
  if (isNaN(numericId) || numericId <= 0) return null;
  try {
    const res = await fetch(`${API_CAJA_BASE}/actual/ventas/${numericId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalCobrado, pagos }),
    });
    if (!res.ok) return null;
    const dto = (await res.json()) as CajaDiariaApiDTO;
    const caja = dtoACajaAbierta(dto);
    guardarCajaAbierta(caja);
    return caja;
  } catch {
    return null;
  }
}

export async function apiToggleAnularVenta(
  ventaId: string,
  motivo?: string
): Promise<CajaAbiertaState | null> {
  const numericId = Number(ventaId);
  if (isNaN(numericId) || numericId <= 0) return null;
  try {
    const res = await fetch(`${API_CAJA_BASE}/actual/ventas/${numericId}/anular`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ motivo: motivo || 'Anulada por operador' }),
    });
    if (!res.ok) return null;
    const dto = (await res.json()) as CajaDiariaApiDTO;
    const caja = dtoACajaAbierta(dto);
    guardarCajaAbierta(caja);
    return caja;
  } catch {
    return null;
  }
}

export async function apiRegistrarMovimiento(
  mov: Omit<MovimientoEfectivo, 'id'>
): Promise<CajaAbiertaState | null> {
  try {
    const res = await fetch(`${API_CAJA_BASE}/actual/movimientos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mov),
    });
    if (!res.ok) return null;
    const dto = (await res.json()) as CajaDiariaApiDTO;
    const caja = dtoACajaAbierta(dto);
    guardarCajaAbierta(caja);
    return caja;
  } catch {
    return null;
  }
}

export async function apiEliminarMovimiento(movId: string): Promise<CajaAbiertaState | null> {
  const numericId = Number(movId);
  if (isNaN(numericId) || numericId <= 0) return null;
  try {
    const res = await fetch(`${API_CAJA_BASE}/actual/movimientos/${numericId}`, {
      method: 'DELETE',
    });
    if (!res.ok) return null;
    const dto = (await res.json()) as CajaDiariaApiDTO;
    const caja = dtoACajaAbierta(dto);
    guardarCajaAbierta(caja);
    return caja;
  } catch {
    return null;
  }
}

export async function apiCerrarCaja(payload: {
  efectivoContadoReal: number;
  nuevoFondoManiana: number;
  observaciones?: string;
}): Promise<{ cierreGuardado: CierreCaja; nuevaCajaAbierta: CajaAbiertaState } | null> {
  try {
    const res = await fetch(`${API_CAJA_BASE}/actual/cerrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      cierreGuardado: CajaDiariaApiDTO;
      nuevaCajaAbierta: CajaDiariaApiDTO;
    };
    const cierreGuardado = dtoACierreCaja(data.cierreGuardado);
    const nuevaCajaAbierta = dtoACajaAbierta(data.nuevaCajaAbierta);
    guardarCajaAbierta(nuevaCajaAbierta);
    return { cierreGuardado, nuevaCajaAbierta };
  } catch {
    return null;
  }
}

export async function apiListarHistorialCierres(): Promise<CierreCaja[] | null> {
  try {
    const res = await fetch(`${API_CAJA_BASE}/historial`, { cache: 'no-store' });
    if (!res.ok) return null;
    const dtos = (await res.json()) as CajaDiariaApiDTO[];
    const cierres = Array.isArray(dtos) ? dtos.map(dtoACierreCaja) : [];
    guardarHistorialCierres(cierres);
    return cierres;
  } catch {
    return null;
  }
}

export async function apiEliminarCierre(cierreId: string): Promise<boolean> {
  const numericId = Number(cierreId);
  if (isNaN(numericId) || numericId <= 0) return false;
  try {
    const res = await fetch(`${API_CAJA_BASE}/historial/${numericId}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch {
    return false;
  }
}
