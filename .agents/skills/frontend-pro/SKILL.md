---
name: frontend-pro
description: >-
  Estándar de arquitectura de software frontend y directrices de UI/UX profesional para 'Librería Motivos'.
  Aplica reglas obligatorias de maquetación Mobile First, paleta y utilidades Tailwind CSS, microinteracciones y
  transiciones suaves, y estricta separación modular entre la lógica de negocio y los componentes visuales de UI.
  Usar siempre que se cree, refactorice, maquete o audite cualquier componente o vista en el proyecto.
---

# Frontend Pro — Arquitectura de Software Frontend y Estándar UI/UX

Este documento establece las directrices de ingeniería y diseño frontend de nivel senior para el proyecto **Librería Motivos**. Todo componente, vista o módulo que se desarrolle debe adherirse obligatoriamente a estas 4 reglas arquitectónicas y articularse con la skill de dominio [**`libreria-motivos-ui`**](../libreria-motivos-ui/SKILL.md).

---

## 1. Reglas Obligatorias de Desarrollo

### Regla 1: Enfoque Mobile First Absoluto
El 80%+ del tráfico de la vitrina proviene de teléfonos inteligentes (familias, docentes y vecinos de Guaymallén). Por tanto:
1.  **Prioridad de estilos:** Toda clase utilitaria se escribe primero para móvil (`w-full`, `text-sm`, `p-3`) y solo se amplía con prefijos responsive ascendentes (`sm:`, `md:`, `lg:`).
2.  **Áreas táctiles mínimas (Ergonomía Thumb Zone):**
    *   Todo elemento interactivo (botones, badges clickeables, pills de categoría, enlaces) debe cumplir un área de contacto mínima de **44px x 44px** (o padding suficiente `py-2.5 px-4` con `min-h-[44px]`).
    *   Separación entre elementos interactivos táctiles de mínimo **8px** para evitar toques accidentales.
3.  **Prevención de desbordamiento horizontal:**
    *   Prohibido provocar scrollbars horizontales en el `<body>` o contenedor principal.
    *   Para componentes deslizables (ej: lista de categorías), encapsular en contenedor aislado con `overflow-x-auto no-scrollbar scroll-smooth` y `scroll-snap-x`.
4.  **Legibilidad sin zoom:** Tamaño de fuente base no inferior a `14px` (`text-sm`) en campos de entrada y textos clave para evitar zoom automático no deseado en iOS/Android.

---

### Regla 2: Tailwind CSS & Paleta Institucional Consistente
Todos los componentes deben emplear la paleta de tokens oficial del proyecto, garantizando coherencia de marca y accesibilidad (WCAG AA):

| Uso | Clase Tailwind / Valor HEX | Rol Visual |
| :--- | :--- | :--- |
| **Primario Institucional** | `text-slate-900`, `bg-blue-900`, `bg-indigo-950` | Encabezados, identidad de marca, navegación principal. |
| **Acento WhatsApp** | `bg-[#25D366]`, `hover:bg-[#1EBE5D]`, `text-white` | **Exclusivo para botones y CTAs hacia WhatsApp.** Máximo contraste y reconocimiento inmediato. |
| **Acento de Temporada** | `bg-orange-500`, `text-orange-600`, `bg-amber-400` | Promociones ("Vuelta al Cole"), ofertas destacadas. |
| **Estado "Abierto ahora"** | `bg-emerald-50`, `text-emerald-800`, `border-emerald-300` | Badge dinámico con punto pulsante (`animate-ping bg-emerald-400`). |
| **Estado "Cerrado"** | `bg-rose-50`, `text-rose-800`, `border-rose-300` | Badge dinámico rojo/carmesí con punto sólido indicador. |
| **Superficies** | `bg-slate-50` (fondo), `bg-white` (cards), `border-slate-200` | Jerarquía limpia, bordes sutiles y fondos descansados. |

---

### Regla 3: Microinteracciones, Transiciones y Estados Hápticos
La interfaz debe responder al usuario de manera viva, fluida y con feedback táctil inmediato:
1.  **Feedback en clics y toques:**
    *   Todos los botones y tarjetas clickeables deben incluir respuesta activa: `active:scale-95` o `active:translate-y-px`.
    *   Transición estándar: `transition-all duration-150 ease-out` o `transition-transform`.
2.  **Elevación y Hover en Desktop:**
    *   Tarjetas de productos y promociones: De `shadow-xs border-slate-200` a `hover:shadow-md hover:border-slate-300`.
3.  **Apertura de Modales y Desplegables:**
    *   Todo menú desplegable (ej: detalle de horarios) o modal de producto debe animarse suavemente: `animate-in fade-in-50 zoom-in-95 duration-150`.
4.  **Accesibilidad en Foco:**
    *   Navegación por teclado garantizada mediante `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden`.

---

### Regla 4: Separación Modular Estricta (Clean Architecture Frontend)
La lógica de negocio jamás debe acoplarse ni ensuciar la capa de presentación:
```text
src/
├── types/          # Modelos de dominio e interfaces puras (Horario, Producto, Promo)
├── lib/            # Servicios, evaluadores de turnos, generador de URLs de WhatsApp
├── components/
│   ├── ui/         # Componentes atómicos base (Button, Badge, Modal, Input)
│   ├── layout/     # Estructuras de página (Header, Footer, Navigation)
│   └── modules/    # Componentes de negocio visuales (ProductGrid, ScheduleWidget)
└── app/            # Rutas y páginas de Next.js (composición pura)
```

1.  **Cero lógica de cálculo en JSX:**
    *   Cálculos de horarios, formateo de precios en pesos argentinos (`$ 1.500`) o construcción de URLs de WhatsApp deben residir en funciones utilitarias en `src/lib/`.
2.  **Pureza y Compatibilidad SSR (Next.js):**
    *   Nunca invocar `new Date()` directamente en el cuerpo de un Client Component para evitar inconsistencias de prerenderizado SSR. Los valores basados en tiempo deben leerse dentro de `useEffect` o inicializarse con un estado seguro estático.
3.  **Componentes Reutilizables y Desacoplados:**
    *   Los componentes visuales reciben datos mediante `props` tipadas y emiten eventos limpios; no acceden directamente a almacenamiento global o dependencias ocultas.

---

## 2. Sinergia con la Skill `libreria-motivos-ui`

Esta skill (`frontend-pro`) define el **cómo técnico y arquitectónico** (estándares de código, Mobile First, Tailwind, microinteracciones, modularidad).

Se complementa directamente con la skill de negocio [**`libreria-motivos-ui`**](../libreria-motivos-ui/SKILL.md), la cual aporta el **qué del negocio**:
*   **Vitrina Web sin Transacciones:** Cero carritos, cero registro de usuarios.
*   **Conversión 100% WhatsApp:** Construcción de mensajes contextuales precargados.
*   **Modelo de Dominio:** Productos por categoría, Promociones de temporada con vigencia y Horarios por turnos independientes para Guaymallén, Mendoza.

---

## 3. Checklist Obligatorio para Todo Nuevo Componente

Antes de dar por concluida la maquetación de un componente, verificar:
- [ ] ¿Fue diseñado y probado primero en viewport móvil (360px - 390px)?
- [ ] ¿El área táctil es de al menos 44px x 44px en elementos interactivos?
- [ ] ¿Tiene respuesta táctil `active:scale-95` y transición suave?
- [ ] ¿Utiliza la paleta oficial (primarios azul/índigo, verde WhatsApp `#25D366` en CTAs, verde/rojo para horarios)?
- [ ] ¿La lógica de negocio está extraída en `src/lib/` o `src/types/` fuera del JSX?
- [ ] ¿Compila limpiamente con `npm run build` sin errores de SSR o hidratación?
