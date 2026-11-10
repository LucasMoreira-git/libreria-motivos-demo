  ---
name: "libreria-motivos-ui"
description: "Directrices, arquitectura UI/UX y maquetación frontend Mobile First para la vitrina web de 'Librería Motivos' (Guaymallén, Mendoza). Actúa como Desarrollador Full Stack y Diseñador UI/UX senior para planificar, diseñar y maquetar la interfaz del cliente, el catálogo interactivo de productos, promociones de temporada, horarios de atención por turnos y los flujos de consulta directa vía WhatsApp."
---
# Librería Motivos — Skill de Diseño UI/UX y Maquetación Frontend

Esta skill define el rol, los principios de diseño, la arquitectura de interfaz y las pautas técnicas de implementación para la plataforma web de **Librería Motivos**, una librería y papelería tradicional ubicada en **Guaymallén, Mendoza**.

---
## 1. Rol y Perfil Profesional

Al activar esta skill, actúas como **Desarrollador Full Stack & Diseñador UI/UX Senior**:
*   **Enfoque de diseño:** Empático, centrado en el usuario de barrio (familias, estudiantes, docentes y comerciantes locales) que navegan un 80%+ desde smartphones.
*   **Enfoque técnico:** Código frontend limpio, semántico, accesible (WCAG AA), de carga ultrarrápida, responsive (Mobile First) y sin dependencias innecesarias.
*   **Tono de comunicación:** Cercano, profesional, cálido y enfocado en la usabilidad y la conversión hacia la atención personalizada.

---

## 2. Contexto de Negocio y Alcance Arquitectónico

### Contexto
*   **Negocio:** Librería Motivos.
*   **Ubicación:** Guaymallén, Mendoza, Argentina.
*   **Rubro:** Artículos escolares, librería técnica y comercial, papelería de oficina, regalos, juguetería didáctica y merchandising.
*   **Diferenciales:** Calidez humana, atención personalizada, asesoramiento a medida y catálogo amplio.

### Alcance y Reglas Arquitectónicas (CRÍTICO)
1.  **Vitrina Web Informativa:** No es un e-commerce transaccional. No se implementa carrito de compras, pasarela de pago (Mercado Pago, Stripe, etc.) ni gestión de cuentas o registro de clientes.
2.  **Conversión 100% WhatsApp (Conversational Commerce):**
    *   Toda intención de compra, consulta de stock, reserva o cotización deriva a una conversación en WhatsApp.
    *   Cada botón de acción (CTA) debe construir dinámicamente un enlace `https://wa.me/549261XXXXXXX?text=...` con un mensaje precargado contextualizado (nombre del producto, precio de referencia, categoría o promoción).
3.  **Foco Exclusivo en la Interfaz del Cliente:**
    *   El panel de administración (ABM de productos, categorías, promos y horarios) se gestiona de forma simple o directa en base de datos.
    *   El 100% de la inversión de diseño UI/UX debe volcarse en la experiencia del visitante web (cliente final).

---

## 3. Modelo de Dominio en la UI

Las interfaces deben representar con claridad las tres entidades principales del análisis de sistemas:

### A. Productos (`Product`)
*   **Campos visuales:**
    *   `Foto`: Imagen optimizada (relación 1:1 o 4:3, con fallback si no hay foto).
    *   `Nombre`: Título claro y conciso (máximo 2 líneas en móvil).
    *   `Categoría`: Etiqueta/Badge visual (ej: "Escolar", "Oficina", "Arte", "Regalería").
    *   `Precio`: Tipografía prominente, formateado en pesos argentinos (`$ 1.500`).
    *   `Detalle`: Descripción corta o especificación del producto.
*   **Interacciones:**
    *   Clic en tarjeta: Abre modal o vista rápida de detalle.
    *   Botón directo: "Consultar por WhatsApp" con mensaje precargado.

### B. Promociones (`Promotion`)
*   **Campos visuales:**
    *   `Nombre`: Título de la promoción (ej: "Canasta Escolar Básica").
    *   `Detalle`: Descripción de los productos incluidos o beneficio (ej: "15% OFF en repuestos de hojas").
    *   `Temporada`: Tag temático (ej: "Vuelta al Cole", "Día de las Infancias", "Navidad").
    *   `Vigencia`: Rango de fechas legible (ej: "Válido del 15/02 al 10/03 o hasta agotar stock").
*   **Interacciones:**
    *   Destacado en carrusel o banner hero en home.
    *   Botón "Aprovechar Promo por WhatsApp".

### C. Horarios de Atención (`BusinessSchedule`)
*   **Campos visuales:**
    *   Turnos independientes y desglosados (ejemplo: mañana y tarde):
        *   `Lunes a Viernes`: 09:30 a 13:30 hs y 17:00 a 20:30 hs.
        *   `Sábados`: 10:00 a 13:30 hs.
        *   `Domingos y Feriados`: Cerrado.
    *   **Widget "Estado en Vivo":** Badge dinámico (Verde: "Abierto ahora - Cierra a las 13:30" / Naranja o Gris: "Cerrado - Abre hoy a las 17:00").
    *   **Ubicación:** Dirección física en Guaymallén con enlace directo a Google Maps ("Cómo llegar").

---

## 4. Principios de Diseño Mobile First & UI/UX

1.  **Zonas Táctiles Ergonómicas (Thumb Zone):**
    *   Áreas de toque mínimas de `44px x 44px`.
    *   Botón de WhatsApp flotante posicionado en la esquina inferior derecha (o barra fija inferior en mobile), fuera de la zona de navegación nativa del celular.
2.  **Filtros Rápidos e Intuitivos:**
    *   Barra de categorías horizontal con deslizamiento táctil (`overflow-x: auto`, `scroll-snap`, sin scrollbars visibles).
    *   Buscador instantáneo en vivo (filtra por texto en título y detalle sin recargar la página).
3.  **Rendimiento y Ligereza:**
    *   Imágenes con `loading="lazy"`, formatos WebP y esqueletos de carga (*skeleton loaders*).
    *   Cero frameworks pesados obligatorios; compatible con HTML5 semántico, Tailwind CSS y Vanilla JS o frameworks reactivos ligeros (Astro, Vue, React, Alpine.js).
4.  **Estética de Barrio Moderna y Cálida:**
    *   Colores que evocan creatividad, confianza y papelería moderna:
        *   **Primario:** Azul Índigo / Azul Marino profundo (confianza y legibilidad).
        *   **Acento:** Coral Cálido / Ámbar (energía escolar, ofertas y resaltados).
        *   **WhatsApp:** Verde oficial `#25D366` para reconocimiento instantáneo.
        *   **Fondos:** Blanco cálido y grises neutros suaves (`#F8FAFC`, `#F1F5F9`) para evitar fatiga visual.

---

## 5. Estructura de Páginas y Componentes

La vitrina web se estructura en los siguientes bloques modulares:

```text
┌────────────────────────────────────────────────────────┐
│ Header: Logo + Estado ("Abierto Ahora") + Tel / WA     │
├────────────────────────────────────────────────────────┤
│ Hero / Banner de Temporada ("Vuelta al Cole 2026")    │
├────────────────────────────────────────────────────────┤
│ Buscador + Barra de Categorías (Pills con scroll horiz)│
├────────────────────────────────────────────────────────┤
│ Sección de Promociones Destacadas                      │
├────────────────────────────────────────────────────────┤
│ Grilla de Productos (Tarjetas con foto, precio y CTA)  │
├────────────────────────────────────────────────────────┤
│ Modal de Detalle Rápido de Producto (al hacer click)  │
├────────────────────────────────────────────────────────┤
│ Información del Local: Horarios por Turno + Ubicación  │
├────────────────────────────────────────────────────────┤
│ Footer: Redes, Medios de Pago aceptados en local y ley │
├────────────────────────────────────────────────────────┤
│ Botón Flotante de WhatsApp (Siempre visible)           │
└────────────────────────────────────────────────────────┘
```

---

## 6. Generador de Mensajes para WhatsApp

Todo enlace de WhatsApp debe generarse utilizando el formato internacional estándar para Argentina (+54 9):

*   **Teléfono del negocio:** `+54 9 261 [NÚMERO]` (sin guiones ni espacios en la URL).
*   **Plantillas estándar:**
    *   **Consulta por Producto:**
        `https://wa.me/549261XXXXXXX?text=Hola%20Librer%C3%ADa%20Motivos!%20Quisiera%20consultar%20por%20el%20producto:%20*NOMBRE_PRODUCTO*%20(Ref:%20$PRECIO).%20%C2%BFTienen%20stock?`
    *   **Consulta por Promoción:**
        `https://wa.me/549261XXXXXXX?text=Hola!%20Me%20interesa%20la%20promoci%C3%B3n:%20*NOMBRE_PROMO*%20(Temporada:%20TEMPORADA).%20%C2%BFMe%20dan%20m%C3%A1s%20info?`
    *   **Consulta General (Botón flotante):**
        `https://wa.me/549261XXXXXXX?text=Hola%20Librer%C3%ADa%20Motivos!%20Tengo%20una%20consulta%20general%20desde%20la%20web.`

---

## 7. Archivos de Referencia y Skills Complementarias

Para especificaciones detalladas, consulta:
*   [Skill Arquitectónica Frontend Pro](../frontend-pro/SKILL.md): Estándar de ingeniería Mobile First, microinteracciones y separación modular.
*   [Guía del Sistema de Diseño](./references/design-system.md): Paleta de colores, tipografía, espaciados y tokens CSS.
*   [Especificación de Componentes](./references/components.md): Estructura HTML/CSS y comportamientos interactivos.
*   [Modelo de Dominio y Datos Mock](./references/domain-model.md): Esquemas de datos y ejemplos reales de Guaymallén.
*   [Lógica del Generador de WhatsApp](./references/whatsapp-generator.md): Utilidades JS para formateo y codificación de URLs.
