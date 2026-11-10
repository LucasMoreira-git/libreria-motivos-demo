# Modelo de Dominio — Librería Motivos

Esquemas de datos TypeScript/JSON y ejemplos concretos orientados a la visualización de la vitrina web.

---

## 1. Entidades Principales

### A. Categoría (`Category`)
```typescript
interface Category {
  id: string;              // 'escolar', 'oficina', 'arte', 'regalos'
  name: string;            // 'Útiles Escolares'
  icon?: string;           // '🎒' o referencia de ícono
  order: number;           // Orden en la barra de categorías
}
```

### B. Producto (`Product`)
```typescript
interface Product {
  id: string;
  name: string;            // 'Cuaderno Éxito N°3 48 Hojas Rayado'
  detail: string;          // 'Tapa dura, forrado en papel araña azul, hojas reforzadas'
  price: number;           // 3800 (en pesos argentinos)
  photoUrl: string;        // '/images/productos/cuaderno-exito-3.webp'
  categoryId: string;      // Relación con Category.id
  isFeatured?: boolean;    // Si aparece en destacados de portada
  isAvailable?: boolean;   // Control simple de visibilidad
}
```

### C. Promoción (`Promotion`)
```typescript
interface Promotion {
  id: string;
  name: string;            // 'Pack Mochila + Cartuchera Canopla'
  detail: string;          // 'Mochila reforzada 18 pulgadas + cartuchera doble piso'
  season: string;          // 'Vuelta al Cole' | 'Día del Niño' | 'Especial Oficina'
  startDate: string;       // '2026-02-15'
  endDate: string;         // '2026-03-31'
  bannerUrl?: string;      // Imagen o diseño gráfico de la promo
  discountNote?: string;   // 'Ahorrá un 20%' o '$35.000 (Antes $42.000)'
}
```

### D. Horario de Atención (`BusinessSchedule`)
```typescript
interface ScheduleShift {
  id: string;
  days: string;            // 'Lunes a Viernes' | 'Sábados' | 'Feriados'
  shiftName: string;       // 'Turno Mañana' | 'Turno Tarde' | 'Horario Corrido'
  openTime: string;        // '09:30'
  closeTime: string;       // '13:30'
  isClosed?: boolean;      // Para domingos o feriados
}

interface StoreInfo {
  name: string;            // 'Librería Motivos'
  location: string;        // 'Guaymallén, Mendoza, Argentina'
  address: string;         // Dirección física exacta
  googleMapsUrl: string;   // Enlace para app de mapas
  whatsappNumber: string;  // '549261XXXXXXX' (formato internacional sin signos)
  shifts: ScheduleShift[];
}
```

---

## 2. Datos Mock de Ejemplo (Guaymallén, Mendoza)

```json
{
  "categories": [
    { "id": "todos", "name": "Todos", "order": 0 },
    { "id": "escolar", "name": "Escolar", "icon": "🎒", "order": 1 },
    { "id": "oficina", "name": "Oficina & Comercial", "icon": "📁", "order": 2 },
    { "id": "arte", "name": "Arte & Diseño", "icon": "🎨", "order": 3 },
    { "id": "regalos", "name": "Regalería & Didácticos", "icon": "🎁", "order": 4 }
  ],
  "promotions": [
    {
      "id": "promo-vuelta-al-cole",
      "name": "Combo Vuelta al Cole Primaria",
      "detail": "1 Repuesto 480h + 2 Cuadernos tapa dura + 1 Cartuchera + Lapicera borrable",
      "season": "Vuelta al Cole",
      "startDate": "2026-02-15",
      "endDate": "2026-03-15",
      "discountNote": "15% OFF de contado/transferencia"
    }
  ],
  "schedule": [
    { "id": "s1", "days": "Lunes a Viernes", "shiftName": "Turno Mañana", "openTime": "09:30", "closeTime": "13:30" },
    { "id": "s2", "days": "Lunes a Viernes", "shiftName": "Turno Tarde", "openTime": "17:00", "closeTime": "20:30" },
    { "id": "s3", "days": "Sábados", "shiftName": "Turno Mañana", "openTime": "10:00", "closeTime": "13:30" },
    { "id": "s4", "days": "Domingos", "shiftName": "Cerrado", "openTime": "", "closeTime": "", "isClosed": true }
  ]
}
```
