# Arquitectura de Componentes y Separación Modular — Frontend Pro

Patrón de diseño y separación de responsabilidades para Next.js en Librería Motivos.

---

## 1. Principio de Responsabilidad Única (SRP)

*   **Capa de Dominio (`src/types/`):**
    *   Define entidades puras: `TurnoHorario`, `EstadoAtencion`, `Product`, `Promotion`, `Category`.
    *   No importa React, JSX ni estilos.
*   **Capa de Servicios y Utilidades (`src/lib/`):**
    *   Contiene funciones deterministas y clases con lógica pura de negocio:
        *   `HorarioAtencion.evaluarEstado(fecha: Date)`
        *   `buildWhatsAppLink(telefono, mensaje)`
        *   `formatPesosArgentinos(monto: number)`
*   **Capa de Presentación (`src/components/`):**
    *   Se limita a renderizar UI, recibir eventos del usuario y delegar el cómputo en la capa de servicios.
    *   No contiene cadenas mágicas de URLs ni algoritmos de cálculo.

---

## 2. Ejemplo Práctico: Separación de Horarios

### ❌ Anti-patrón (Lógica acoplada dentro del componente)
```tsx
// MAL: El componente visual calcula fechas, minutos y reglas de turnos internamente
export function BadHeader() {
  const ahora = new Date();
  const estaAbierto = ahora.getHours() >= 9 && ahora.getHours() < 13; // ❌ Frágil e inconsistente en SSR
  return <div>{estaAbierto ? 'Abierto' : 'Cerrado'}</div>;
}
```

### ✅ Patrón Correcto (Separación estricta de responsabilidades)
```tsx
// 1. Dominio y cálculo en src/types/horario.ts
export class HorarioAtencion {
  evaluarEstado(fecha: Date): EstadoAtencion { ... }
}

// 2. Componente visual en src/components/layout/Header.tsx
export function Header() {
  const [estado, setEstado] = useState<EstadoAtencion>(ESTADO_FALLBACK);

  useEffect(() => {
    // Lectura segura en cliente
    setEstado(gestorHorarios.evaluarEstado(new Date()));
  }, []);

  return (
    <header>
      <Badge variant={estado.estaAbierto ? 'success' : 'destructive'}>
        {estado.estadoTexto}
      </Badge>
    </header>
  );
}
```
