# Sistema de Diseño — Librería Motivos

Guía de estilos, tokens de diseño y directrices de maquetación Mobile First para la vitrina web de **Librería Motivos** en Guaymallén, Mendoza.

---

## 1. Paleta de Colores

La identidad visual combina la seriedad y confiabilidad del comercio tradicional con toques vivos y creativos característicos de los artículos escolares y de librería.

| Token | Nombre | Valor HEX | Uso Principal |
| :--- | :--- | :--- | :--- |
| `--color-primary-900` | Azul Tinta Profundo | `#0F172A` | Encabezados principales, textos de alta jerarquía |
| `--color-primary-700` | Azul Índigo | `#1E3A8A` | Color de marca, botones secundarios, badges activos |
| `--color-accent-500` | Naranja Coral | `#F97316` | Ofertas, badges de temporada ("Vuelta al cole"), llamadas de atención |
| `--color-accent-600` | Naranja Intenso | `#EA580C` | Hover / Focus en elementos de acento |
| `--color-whatsapp` | Verde WhatsApp | `#25D366` | Botones de consulta, llamadas directas a WhatsApp, estado "Abierto ahora" |
| `--color-whatsapp-hover` | Verde Oscuro WA | `#1EBE5D` | Hover del botón de WhatsApp |
| `--color-surface-bg` | Fondo Claro Neutro | `#F8FAFC` | Fondo general de la página |
| `--color-surface-card`| Blanco Puro | `#FFFFFF` | Fondo de tarjetas de producto, modales, barras |
| `--color-text-body` | Gris Oscuro Texto | `#334155` | Descripciones, detalles técnicos, párrafos |
| `--color-text-muted`| Gris Medio | `#64748B` | Textos secundarios, vigencias, subtítulos |
| `--color-border` | Borde Sutil | `#E2E8F0` | Separadores, bordes de tarjetas y filtros |

---

## 2. Tipografía

Se recomienda utilizar familias sans-serif modernas con excelente legibilidad en pantallas móviles pequeñas:

*   **Familia Principal:** `Plus Jakarta Sans`, `Inter` o `system-ui, -apple-system, sans-serif`.
*   **Escala Tipográfica (Mobile First):**
    *   **Hero / Display:** `24px - 28px` (Font-weight: 700 o 800)
    *   **H1 (Secciones):** `20px - 22px` (Font-weight: 700)
    *   **H2 (Títulos de tarjeta):** `16px - 18px` (Font-weight: 600)
    *   **Precio destacado:** `18px - 20px` (Font-weight: 700, color primario o acento)
    *   **Cuerpo (Body):** `14px - 15px` (Line-height: 1.5, regular 400)
    *   **Textos secundarios / Badges:** `12px - 13px` (Font-weight: 500 o 600)

---

## 3. Espaciado y Cuadrícula Responsive

*   **Enfoque:** Mobile First (diseñado primero para anchos de `360px` a `420px`).
*   **Contenedor Central:**
    *   Móvil: `w-full px-4` (padding lateral de 16px).
    *   Tablet (`min-width: 640px`): `max-w-2xl mx-auto px-6`.
    *   Desktop (`min-width: 1024px`): `max-w-6xl mx-auto px-8`.
*   **Grilla de Productos:**
    *   Móvil: 2 columnas (`grid grid-cols-2 gap-3`).
    *   Tablet: 3 columnas (`sm:grid-cols-3 gap-4`).
    *   Desktop: 4 columnas (`lg:grid-cols-4 gap-6`).

---

## 4. Elevaciones y Sombras

*   **Cards:** `box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08);` (Tailwind: `shadow-sm`).
*   **Cards en Hover/Active:** `box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);` (Tailwind: `shadow-md`).
*   **Modales y Botón Flotante:** `box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.15), 0 4px 6px -4px rgb(0 0 0 / 0.15);` (Tailwind: `shadow-lg`).

---

## 5. Radios de Borde (Border Radius)

*   **Pills de Categoría:** `rounded-full` (`9999px`).
*   **Botones y Badges:** `rounded-xl` (`12px`).
*   **Tarjetas de Producto y Banners:** `rounded-2xl` (`16px`).
*   **Modales / Hojas inferiores (Bottom Sheets):** `rounded-t-3xl` (`24px`).
