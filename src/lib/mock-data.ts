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

export const DATOS_LIBRERIA_MOTIVOS: DatosNegocio = {
  nombre: 'Librería Motivos',
  rubro: 'Librería, Papelería y Regalería',
  ubicacion: 'Guaymallén, Mendoza',
  localidad: 'Guaymallén, Mendoza',
  direccion: 'Juan Carlos Lucero M-D-C44, M5521 Guaymallén, Mendoza, Argentina',
  direccionCompleta: 'Juan Carlos Lucero M-D-C44, M5521 Guaymallén, Mendoza, Argentina',
  telefonoWhatsApp: '02615635813', // Mendoza: 0261 563-5813 -> Internacional: +54 9 261 563-5813
  googleMapsUrl: 'https://maps.google.com/?q=-32.9197,-68.7942+(Librer%C3%ADa+Motivos+-+Juan+Carlos+Lucero+M-D-C44,+Guaymall%C3%A9n)',
  googleMapsEmbedUrl: 'https://maps.google.com/maps?q=-32.9197,-68.7942&t=&z=16&ie=UTF8&iwloc=&output=embed',
  googleReviewsUrl: 'https://maps.google.com/?q=Libreria+Motivos+Guaymallen+Mendoza#reviews',
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
