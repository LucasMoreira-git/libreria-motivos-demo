# Motor de Enlaces de WhatsApp — Librería Motivos

Guía técnica y funciones utilitarias en JavaScript/TypeScript para generar URLs contextuales hacia WhatsApp.

---

## 1. Reglas de Formato Telefónico

*   **País:** Argentina (`+54`).
*   **Prefijo móvil internacional:** Requiere el dígito `9` antes del código de área.
*   **Código de área Mendoza:** `261`.
*   **Número de ejemplo:** `+54 9 261 123 4567` -> En la URL se escribe sin signos ni espacios: `5492611234567`.

---

## 2. Funciones Utilitarias (TypeScript / JavaScript)

```typescript
const WHATSAPP_PHONE = '549261XXXXXXX'; // Configurar con el teléfono real del local

/**
 * Genera la URL codificada hacia la API de WhatsApp
 */
export function buildWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Genera el mensaje precargado para consulta por un producto específico
 */
export function createProductInquiryUrl(productName: string, price?: number): string {
  const priceText = price ? ` ($ ${price.toLocaleString('es-AR')})` : '';
  const message = `¡Hola Librería Motivos! 👋 Quisiera consultar disponibilidad por el producto: *${productName}*${priceText}. ¿Tienen stock?`;
  return buildWhatsAppUrl(WHATSAPP_PHONE, message);
}

/**
 * Genera el mensaje precargado para una promoción de temporada
 */
export function createPromoInquiryUrl(promoName: string, season?: string): string {
  const seasonText = season ? ` de la temporada *${season}*` : '';
  const message = `¡Hola! Me interesó la promoción: *${promoName}*${seasonText}. ¿Me podrían dar más detalles sobre vigencia y productos incluidos?`;
  return buildWhatsAppUrl(WHATSAPP_PHONE, message);
}

/**
 * Genera el mensaje para el botón flotante general
 */
export function createGeneralInquiryUrl(): string {
  const message = `¡Hola Librería Motivos! 👋 Visité su vitrina web y quisiera hacerles una consulta.`;
  return buildWhatsAppUrl(WHATSAPP_PHONE, message);
}
```

---

## 3. Consideraciones de UX
*   **Atributos de enlace recomendados:** `target="_blank" rel="noopener noreferrer"`.
*   **Feedback visual en móvil:** El botón debe aplicar `active:scale-95` o un efecto visual inmediato para que el usuario sienta la respuesta táctil antes de que se abra la aplicación de WhatsApp.
*   **Codificación UTF-8:** Asegurarse siempre de utilizar `encodeURIComponent` para preservar tildes, signos de interrogación (`¿`) y emojis sin romper el enlace en navegadores antiguos de Android/iOS.
