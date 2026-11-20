import { HorarioAtencion, TurnoHorario } from '@/types/horario';

export interface DatosNegocio {
  nombre: string;
  rubro: string;
  ubicacion: string;
  direccion: string;
  localidad: string;
  direccionCompleta: string;
  telefonoWhatsApp: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  googleReviewsUrl: string;
  instagramUrl: string;
  mensajePredeterminadoWA: string;
}

export const DEFAULT_BRAND_IMAGE = '/images/logo-motivos.jpg';

/**
 * Normaliza fechas tipo "DD/MM/YYYY", "YYYY-MM-DD" o ISO a "YYYY-MM-DD"
 * para inputs <input type="date"> y envío al backend Spring Boot.
 */
export function aFormatoFechaInput(fecha?: string | null): string {
  if (!fecha) return '';
  const limpia = fecha.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(limpia)) {
    return limpia.slice(0, 10);
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(limpia)) {
    const [d, m, y] = limpia.split('/');
    return `${y}-${m}-${d}`;
  }
  const parsed = new Date(limpia);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return '';
}

/**
 * Formatea una fecha "YYYY-MM-DD" o ISO al formato argentino legible "DD/MM/YYYY".
 */
export function formatearFechaLegible(fecha?: string | null): string {
  if (!fecha) return '';
  const limpia = fecha.trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(limpia)) return limpia;
  if (/^\d{4}-\d{2}-\d{2}/.test(limpia)) {
    const [y, m, d] = limpia.slice(0, 10).split('-');
    return `${d}/${m}/${y}`;
  }
  return limpia;
}

export function parsearDiasSemanaDesdeTexto(texto: string): number[] {
  const t = texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (t.includes('lunes') && t.includes('viernes') && t.includes(' a ')) {
    return [1, 2, 3, 4, 5];
  }
  if (t.includes('lunes') && t.includes('sabado') && t.includes(' a ')) {
    return [1, 2, 3, 4, 5, 6];
  }

  const dias: number[] = [];
  if (t.includes('domingo') || t.includes('feriado')) dias.push(0);
  if (t.includes('lunes')) dias.push(1);
  if (t.includes('martes')) dias.push(2);
  if (t.includes('miercoles')) dias.push(3);
  if (t.includes('jueves')) dias.push(4);
  if (t.includes('viernes')) dias.push(5);
  if (t.includes('sabado')) dias.push(6);

  return dias;
}

export const DATOS_LIBRERIA_MOTIVOS: DatosNegocio = {
  nombre: 'Librería Motivos',
  rubro: 'Librería, Papelería y Regalería',
  ubicacion: 'Guaymallén, Mendoza',
  localidad: 'Guaymallén, Mendoza',
  direccion: 'Juan Carlos Lucero M-D-C44, M5521 Guaymallén, Mendoza, Argentina',
  direccionCompleta: 'Juan Carlos Lucero M-D-C44, M5521 Guaymallén, Mendoza, Argentina',
  telefonoWhatsApp: '02615635813', // Mendoza: 0261 563-5813 -> Internacional: +54 9 261 563-5813
  googleMapsUrl: 'https://maps.app.goo.gl/2zK93jiRrQ9iUK3f6',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3349.1845502107517!2d-68.792417!3d-32.91972200000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e0d37ec42f4e1%3A0xd725a9af62ef59ee!2sLibrer%C3%ADa%20Motivos!5e0!3m2!1ses!2sar!4v1795148038449!5m2!1ses!2sar',
  googleReviewsUrl: 'https://maps.app.goo.gl/2zK93jiRrQ9iUK3f6',
  instagramUrl: 'https://www.instagram.com/motivos.regalos_/',
  mensajePredeterminadoWA:
    '¡Hola Librería Motivos! 👋 Visité su vitrina web y quisiera hacerles una consulta.',
};

/**
 * Turnos independientes mockeados según el análisis de sistemas del negocio:
 * - Lunes a Viernes: 09:30 a 13:30 (Mañana) y 17:00 a 20:30 (Tarde)
 * - Sábados: 10:00 a 13:30 (Mañana)
 * - Sábados Tarde y Domingos: Cerrado
 */
export const TURNOS_MOCK: TurnoHorario[] = [
  {
    id: 't-lv-manana',
    diasSemana: [1, 2, 3, 4, 5], // Lunes a Viernes
    diasTexto: 'Lunes a Viernes',
    nombreTurno: 'Turno Mañana',
    horaApertura: '09:30',
    horaCierre: '13:30',
  },
  {
    id: 't-lv-tarde',
    diasSemana: [1, 2, 3, 4, 5], // Lunes a Viernes
    diasTexto: 'Lunes a Viernes',
    nombreTurno: 'Turno Tarde',
    horaApertura: '17:00',
    horaCierre: '20:30',
  },
  {
    id: 't-sab-manana',
    diasSemana: [6], // Sábado
    diasTexto: 'Sábados',
    nombreTurno: 'Turno Mañana',
    horaApertura: '10:00',
    horaCierre: '13:30',
  },
  {
    id: 't-domingos',
    diasSemana: [0], // Domingo
    diasTexto: 'Domingos y Feriados',
    nombreTurno: 'Cerrado',
    horaApertura: '00:00',
    horaCierre: '00:00',
    esCerrado: true,
  },
];

// Instancia singleton de la clase HorarioAtencion con los datos mockeados
export const gestorHorarios = new HorarioAtencion(TURNOS_MOCK);
