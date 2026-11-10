export interface TipoCategoria {
  id: string;
  nombre: string;
  slug: string;
  icono?: string;
  iconoLucide?: string;
  descripcion?: string;
  orden: number;
}

export interface Producto {
  id: string;
  nombre: string;
  detalle: string;
  precio: number;
  foto?: string;           // URL de foto simulada
  fotoProducto?: string;   // Alias de modelo de dominio
  fotoPlaceholder?: string;
  categoriaId: string;
  categoriaNombre?: string;
  destacado?: boolean;
  enOferta?: boolean;
  precioAnterior?: number;
  badge?: 'OFERTA' | 'NOVEDAD' | null; // Badges absolutos superpuestos
}

export interface Promocion {
  id: string;
  nombre: string;
  detalle: string;
  temporadaPromocion: string; // 'Especial Primavera 2026'
  temporada?: string;          // Alias de compatibilidad
  fechaInicio: string;         // '01/10/2026'
  fechaFin: string;            // '31/10/2026'
  descuentoTexto: string;      // '25% OFF llevando el combo'
  condicion?: string;          // 'Válido en efectivo o transferencia'
  badgeTexto?: string;         // 'Promo Destacada'
  fotoCombo?: string;          // Foto representativa del combo para el Hero
}
