/**
 * Definición de tipos y entidades del Modelo de Dominio para el Panel Administrador
 * Mapeo estricto con los atributos y entidades del negocio
 */

export interface CategoriaAdmin {
  idCategoria: string;
  nombreCategoria: string;
  slugCategoria: string;
  iconoCategoria: string;
  descripcionCategoria?: string;
  ordenCategoria: number;
  fechaHoraBajaCategoria: string | null; // Null si activa, ISO / Timestamp si dada de baja
}

export interface ProductoAdmin {
  idProducto: string;
  nombreProducto: string;
  detalleProducto: string;
  precioProducto: number;
  fotoProducto: string;
  categoriaId: string;
  codTC?: string; // Código de TipoCategoria (dominio)
  categoriaNombre?: string;
  destacadoProducto: boolean;
  enOfertaProducto: boolean;
  badgeProducto: 'OFERTA' | 'NOVEDAD' | null;
  fechaHoraBajaProducto: string | null; // Null si activa, ISO / Timestamp si dada de baja
}

export interface PromocionAdmin {
  idPromocion: string;
  nombrePromocion: string;
  detallePromocion: string;
  temporadaPromocion: string; // ej: 'Especial Primavera 2026'
  fechaInicioPromocion: string; // '01/10/2026'
  fechaFinPromocion: string; // '31/10/2026'
  fechaHoraFinPromocion?: string; // Atributo de dominio para vigencia
  descuentoTextoPromocion: string; // '25% OFF llevando el combo'
  condicionPromocion?: string;
  badgeTextoPromocion?: string;
  fotoComboPromocion?: string;
  fechaHoraBajaPromocion: string | null; // Null si activa, ISO / Timestamp si dada de baja
}

export interface HorarioAtencionAdmin {
  idHorarioAtencion: string;
  diasTextoHA: string; // ej: 'Lunes a Viernes'
  diasSemanaHA: number[]; // [1, 2, 3, 4, 5]
  nombreTurnoHA: string; // ej: 'Turno Mañana'
  horaInicioHA: string; // ej: '09:30'
  horaFinHA: string; // ej: '13:30'
  esCerradoHA: boolean;
  fechaHoraBajaHA: string | null; // Null si activo, ISO / Timestamp si dado de baja
}
