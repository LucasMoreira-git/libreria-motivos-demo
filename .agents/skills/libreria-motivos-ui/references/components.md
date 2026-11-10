# Especificación de Componentes — Librería Motivos

Componentes clave de la interfaz de la vitrina web, diseñados para máxima velocidad, legibilidad y conversión vía WhatsApp.

---

## 1. Tarjeta de Producto (`ProductCard`)

Optimizado para visualización en grilla de 2 columnas en teléfonos móviles.

```html
<article class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
  <!-- Contenedor Imagen -->
  <div class="relative w-full aspect-square bg-slate-100 overflow-hidden">
    <img 
      src="/images/repuesto-rivadavia.webp" 
      alt="Repuesto Rivadavia N°3 x 480 hojas"
      loading="lazy"
      class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
    />
    <span class="absolute top-2 left-2 bg-blue-900/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
      Escolar
    </span>
  </div>

  <!-- Contenido -->
  <div class="p-3 flex-1 flex flex-col justify-between">
    <div>
      <h3 class="font-semibold text-slate-800 text-sm line-clamp-2 leading-snug">
        Repuesto Escolar Rivadavia N°3
      </h3>
      <p class="text-xs text-slate-500 mt-1 line-clamp-1">
        480 hojas rayadas con banda protectora
      </p>
    </div>

    <div class="mt-3 pt-2 border-t border-slate-100">
      <div class="flex items-baseline justify-between mb-2">
        <span class="text-xs text-slate-400">Precio</span>
        <span class="text-base font-bold text-slate-900">$ 24.500</span>
      </div>

      <!-- CTA WhatsApp -->
      <a 
        href="https://wa.me/549261XXXXXXX?text=Hola%20Librer%C3%ADa%20Motivos!%20Quisiera%20consultar%20por:%20Repuesto%20Escolar%20Rivadavia%20N3%20($24.500)"
        target="_blank"
        rel="noopener noreferrer"
        class="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs rounded-xl transition-colors active:scale-95"
      >
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <!-- Ícono WhatsApp -->
        </svg>
        <span>Consultar</span>
      </a>
    </div>
  </div>
</article>
```

---

## 2. Barra de Categorías Horizontal (`CategoryPillList`)

Permite filtrar al instante por categoría mediante deslizamiento táctil horizontal sin entorpecer el scroll vertical.

```html
<nav class="w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2">
  <button class="whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold bg-blue-900 text-white shadow-sm transition-all">
    Todos los artículos
  </button>
  <button class="whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all">
    🎒 Útiles Escolares
  </button>
  <button class="whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all">
    📁 Oficina y Papelería
  </button>
  <button class="whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all">
    🎨 Arte y Manualidades
  </button>
  <button class="whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all">
    🎁 Regalería y Merchandising
  </button>
</nav>
```

---

## 3. Banner de Promociones (`PromoBanner`)

Resalta campañas de temporada ("Vuelta al Cole", "Día del Niño", "Fin de Año") con fechas claras de vigencia.

```html
<div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white p-5 shadow-sm">
  <div class="relative z-10 max-w-md">
    <span class="inline-block bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2">
      Temporada: Vuelta al Cole 2026 📚
    </span>
    <h2 class="text-xl font-extrabold leading-tight">
      Kit Escolar Primaria Completo
    </h2>
    <p class="text-white/90 text-xs mt-1">
      Mochila + Cartuchera completa + Cuadernos tapa dura. ¡Ahorrá un 20% llevando el combo!
    </p>
    <div class="mt-3 flex items-center justify-between">
      <span class="text-[11px] text-white/80 bg-black/15 px-2 py-1 rounded-lg">
        ⏳ Válido: 15 Feb - 15 Mar
      </span>
      <a 
        href="https://wa.me/549261XXXXXXX?text=Hola!%20Me%20interesa%20la%20promo%20Kit%20Escolar%20Primaria%20Completo"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 bg-white text-orange-600 font-bold text-xs px-3 py-2 rounded-xl shadow hover:bg-orange-50 transition-colors"
      >
        Pedir Promo
      </a>
    </div>
  </div>
</div>
```

---

## 4. Widget de Horarios y Ubicación (`ScheduleWidget`)

Informa con claridad los turnos de atención y el estado actual del local en Guaymallén.

```html
<div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
  <div class="flex items-center justify-between pb-3 border-b border-slate-100">
    <div class="flex items-center gap-2">
      <span class="relative flex h-3 w-3">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
      </span>
      <span class="text-xs font-bold text-emerald-700 uppercase tracking-wide">
        Abierto Ahora
      </span>
    </div>
    <span class="text-xs text-slate-500">
      Turno mañana hasta 13:30 hs
    </span>
  </div>

  <div class="mt-3 space-y-2 text-xs text-slate-600">
    <div class="flex justify-between">
      <span class="font-medium text-slate-800">Lunes a Viernes:</span>
      <span class="text-right">09:30 a 13:30 | 17:00 a 20:30 hs</span>
    </div>
    <div class="flex justify-between">
      <span class="font-medium text-slate-800">Sábados:</span>
      <span>10:00 a 13:30 hs</span>
    </div>
    <div class="flex justify-between text-slate-400">
      <span>Domingos y Feriados:</span>
      <span>Cerrado</span>
    </div>
  </div>

  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
    <div class="text-xs text-slate-500">
      📍 Guaymallén, Mendoza
    </div>
    <a 
      href="https://maps.google.com/?q=Libreria+Motivos+Guaymallen" 
      target="_blank" 
      rel="noopener noreferrer"
      class="text-xs font-semibold text-blue-800 hover:underline"
    >
      Cómo llegar →
    </a>
  </div>
</div>
```

---

## 5. Botón Flotante de WhatsApp (`WhatsAppFloatingCTA`)

Siempre visible en mobile, optimizado para una interacción con el pulgar sin tapar elementos esenciales.

```html
<aside class="fixed bottom-4 right-4 z-50">
  <a 
    href="https://wa.me/549261XXXXXXX?text=Hola%20Librer%C3%ADa%20Motivos!%20Tengo%20una%20consulta"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Contactar por WhatsApp a Librería Motivos"
    class="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 group"
  >
    <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
      <path d="...WhatsApp SVG..."/>
    </svg>
    <span class="text-xs font-bold pr-1 hidden sm:inline">
      ¿En qué te ayudamos?
    </span>
  </a>
</aside>
```
