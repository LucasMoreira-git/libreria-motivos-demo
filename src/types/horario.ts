export type DiaSemana = 
  | 'lunes'
  | 'martes'
  | 'miercoles'
  | 'jueves'
  | 'viernes'
  | 'sabado'
  | 'domingo';

export interface TurnoHorario {
  id: string;
  diasSemana: number[]; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  diasTexto: string;    // Ej: "Lunes a Viernes"
  nombreTurno: string;  // Ej: "Turno Mañana" | "Turno Tarde"
  horaApertura: string; // Formato "HH:mm" (ej: "09:30")
  horaCierre: string;   // Formato "HH:mm" (ej: "13:30")
  esCerrado?: boolean;
}

export interface EstadoAtencion {
  estaAbierto: boolean;
  estadoTexto: 'Abierto ahora' | 'Cerrado';
  mensajeDetalle: string;
  badgeVariant: 'success' | 'destructive';
  turnoActual?: TurnoHorario;
  proximoTurno?: {
    diasTexto: string;
    horaApertura: string;
    nombreTurno: string;
  };
}

export class HorarioAtencion {
  turnos: TurnoHorario[];

  constructor(turnos: TurnoHorario[]) {
    this.turnos = turnos;
  }

  /**
   * Evalúa el estado de atención en base a una fecha/hora dada
   */
  evaluarEstado(fecha: Date): EstadoAtencion {
    const diaActual = fecha.getDay(); // 0 = Domingo, 6 = Sábado
    const horaActualMinutos = fecha.getHours() * 60 + fecha.getMinutes();

    // 1. Buscar si hay algún turno activo en este momento
    for (const turno of this.turnos) {
      if (turno.esCerrado) continue;
      if (turno.diasSemana.includes(diaActual)) {
        const [hApertura, mApertura] = turno.horaApertura.split(':').map(Number);
        const [hCierre, mCierre] = turno.horaCierre.split(':').map(Number);

        const aperturaMinutos = hApertura * 60 + mApertura;
        const cierreMinutos = hCierre * 60 + mCierre;

        if (horaActualMinutos >= aperturaMinutos && horaActualMinutos < cierreMinutos) {
          return {
            estaAbierto: true,
            estadoTexto: 'Abierto ahora',
            mensajeDetalle: `Cierra a las ${turno.horaCierre} hs (${turno.nombreTurno})`,
            badgeVariant: 'success',
            turnoActual: turno,
          };
        }
      }
    }

    // 2. Si está cerrado, buscar el próximo turno hoy
    const turnosHoy = this.turnos
      .filter((t) => !t.esCerrado && t.diasSemana.includes(diaActual))
      .sort((a, b) => a.horaApertura.localeCompare(b.horaApertura));

    for (const turno of turnosHoy) {
      const [hApertura, mApertura] = turno.horaApertura.split(':').map(Number);
      const aperturaMinutos = hApertura * 60 + mApertura;

      if (horaActualMinutos < aperturaMinutos) {
        return {
          estaAbierto: false,
          estadoTexto: 'Cerrado',
          mensajeDetalle: `Abre hoy a las ${turno.horaApertura} hs (${turno.nombreTurno})`,
          badgeVariant: 'destructive',
          proximoTurno: {
            diasTexto: 'Hoy',
            horaApertura: turno.horaApertura,
            nombreTurno: turno.nombreTurno,
          },
        };
      }
    }

    // 3. Si no hay más turnos hoy, buscar el próximo en los siguientes días
    for (let offset = 1; offset <= 7; offset++) {
      const proximoDia = (diaActual + offset) % 7;
      const turnosProxDia = this.turnos
        .filter((t) => !t.esCerrado && t.diasSemana.includes(proximoDia))
        .sort((a, b) => a.horaApertura.localeCompare(b.horaApertura));

      if (turnosProxDia.length > 0) {
        const prox = turnosProxDia[0];
        const diaNombre = offset === 1 ? 'mañana' : prox.diasTexto;
        return {
          estaAbierto: false,
          estadoTexto: 'Cerrado',
          mensajeDetalle: `Abre ${diaNombre} a las ${prox.horaApertura} hs`,
          badgeVariant: 'destructive',
          proximoTurno: {
            diasTexto: diaNombre,
            horaApertura: prox.horaApertura,
            nombreTurno: prox.nombreTurno,
          },
        };
      }
    }

    return {
      estaAbierto: false,
      estadoTexto: 'Cerrado',
      mensajeDetalle: 'Consultar horarios especiales',
      badgeVariant: 'destructive',
    };
  }
}
