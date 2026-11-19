import {
  CategoriaAdmin,
  HorarioAtencionAdmin,
  ProductoAdmin,
  PromocionAdmin,
} from '@/types/admin';
import { aFormatoFechaInput } from '@/lib/mock-data';

export interface AlertaPromocion {
  promocion: PromocionAdmin;
  diasRestantes: number;
  vencida: boolean;
}

export interface AlertaProductoDescuento {
  producto: ProductoAdmin;
  diasRestantes: number;
}

export interface ResumenAlertasNegocio {
  promosAlerta: AlertaPromocion[];
  productosStockLimitado: ProductoAdmin[];
  descuentosPorVencer: AlertaProductoDescuento[];
  productosSinCategoria: ProductoAdmin[];
  horariosInvalidos: HorarioAtencionAdmin[];
  sinHorariosAbiertos: boolean;
  totalAlertas: number;
}

function inicioDelDia(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}

function parsearFechaLocal(fechaStr?: string | null): Date | null {
  const iso = aFormatoFechaInput(fechaStr);
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function evaluarAlertasNegocio(params: {
  productos: ProductoAdmin[];
  categorias: CategoriaAdmin[];
  promociones: PromocionAdmin[];
  horarios: HorarioAtencionAdmin[];
  fechaReferencia: Date;
}): ResumenAlertasNegocio {
  const { productos, categorias, promociones, horarios, fechaReferencia } = params;
  const hoy = inicioDelDia(fechaReferencia);

  // 1. Promociones activas próximas a vencer (<= 10 días) o ya vencidas
  const promosAlerta: AlertaPromocion[] = promociones
    .filter((pr) => !pr.fechaHoraBajaPromocion)
    .map((pr) => {
      const fechaFin = parsearFechaLocal(pr.fechaFinPromocion || pr.fechaHoraFinPromocion);
      if (!fechaFin) return null;
      const diffDias = Math.round((fechaFin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDias <= 10) {
        return {
          promocion: pr,
          diasRestantes: diffDias,
          vencida: diffDias < 0,
        };
      }
      return null;
    })
    .filter((item): item is AlertaPromocion => item !== null)
    .sort((a, b) => a.diasRestantes - b.diasRestantes);

  // 2. Productos visibles con pocas unidades o descuentos especiales por terminar (<= 7 días)
  const productosActivos = productos.filter((p) => !p.fechaHoraBajaProducto);

  const productosStockLimitado = productosActivos.filter((p) => Boolean(p.ultimasUnidadesProducto));

  const descuentosPorVencer: AlertaProductoDescuento[] = productosActivos
    .map((p) => {
      if (!p.precioDescuentoProducto || p.precioDescuentoProducto <= 0 || !p.fechaFinDescuento) {
        return null;
      }
      const fin = new Date(p.fechaFinDescuento);
      if (isNaN(fin.getTime())) return null;
      const diffDias = Math.ceil((fin.getTime() - fechaReferencia.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDias >= 0 && diffDias <= 7) {
        return { producto: p, diasRestantes: diffDias };
      }
      return null;
    })
    .filter((item): item is AlertaProductoDescuento => item !== null)
    .sort((a, b) => a.diasRestantes - b.diasRestantes);

  // 3. Productos visibles sin categoría asignada o cuya categoría está oculta
  const categoriasActivasIds = new Set(
    categorias
      .filter((c) => !c.fechaHoraBajaCategoria)
      .map((c) => String(c.idCategoria))
  );

  const productosSinCategoria = productosActivos.filter((p) => {
    const catId = p.categoriaId ? String(p.categoriaId).trim() : '';
    if (!catId) return true;
    return !categoriasActivasIds.has(catId);
  });

  // 4. Horarios de atención visibles con rangos inválidos o ausencia de turnos abiertos
  const horariosActivos = horarios.filter((h) => !h.fechaHoraBajaHA);
  const horariosAbiertos = horariosActivos.filter((h) => !h.esCerradoHA);
  const sinHorariosAbiertos = horariosAbiertos.length === 0;

  const horariosInvalidos = horariosAbiertos.filter((h) => {
    const ini = h.horaInicioHA?.slice(0, 5) || '';
    const fin = h.horaFinHA?.slice(0, 5) || '';
    return !ini || !fin || ini >= fin;
  });

  const totalAlertas =
    promosAlerta.length +
    productosStockLimitado.length +
    descuentosPorVencer.length +
    productosSinCategoria.length +
    horariosInvalidos.length +
    (sinHorariosAbiertos ? 1 : 0);

  return {
    promosAlerta,
    productosStockLimitado,
    descuentosPorVencer,
    productosSinCategoria,
    horariosInvalidos,
    sinHorariosAbiertos,
    totalAlertas,
  };
}
