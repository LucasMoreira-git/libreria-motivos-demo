/**
 * Motor de generación de URLs contextuales para WhatsApp
 * Formato internacional para Mendoza, Argentina: +54 9 261 XXXXXXX
 */

import { Producto, Promocion } from '@/types/catalogo';

/**
 * Normaliza cualquier número local argentino (ej: 02615635813)
 * al estándar internacional oficial para WhatsApp de Argentina: 5492615635813
 */
export function formatWhatsAppNumber(telefono: string): string {
  let limpio = telefono.replace(/[^0-9]/g, '');
  if (limpio.startsWith('0')) {
    limpio = limpio.substring(1);
  }
  if (!limpio.startsWith('549')) {
    if (limpio.startsWith('54')) {
      limpio = '549' + limpio.substring(2);
    } else {
      limpio = '549' + limpio;
    }
  }
  return limpio;
}

export function buildWhatsAppLink(telefono: string, mensaje: string): string {
  const numeroLimpio = formatWhatsAppNumber(telefono);
  const textoCodificado = encodeURIComponent(mensaje);
  return `https://wa.me/${numeroLimpio}?text=${textoCodificado}`;
}

export function getGeneralWhatsAppLink(telefono: string): string {
  return buildWhatsAppLink(
    telefono,
    '¡Hola Librería Motivos! 👋 Visité su vitrina web y quisiera hacerles una consulta.'
  );
}

export function getProductWhatsAppLink(producto: Producto, telefono: string): string {
  const mensaje = `¡Hola! ¿Qué tal? Quería hacerles una consulta sobre ${producto.nombre}. ¡Gracias!`;
  return buildWhatsAppLink(telefono, mensaje);
}

export function getPromoWhatsAppLink(promo: Promocion, telefono: string): string {
  const temporada = promo.temporadaPromocion || promo.temporada || 'Especial Primavera 2026';
  const mensaje = `¡Hola Librería Motivos! 👋 Me interesa la promoción: *${promo.nombre}* (Temporada: ${temporada}). ¿Me podrían brindar más información sobre cómo aprovecharla?`;
  return buildWhatsAppLink(telefono, mensaje);
}
