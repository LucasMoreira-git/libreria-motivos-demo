'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink, 
  Search, 
  Star, 
  Menu, 
  X,
  PackageSearch,
  Tag,
  Calendar
} from 'lucide-react';
import { gestorHorarios, DATOS_LIBRERIA_MOTIVOS } from '@/lib/mock-data';
import { EstadoAtencion } from '@/types/horario';

const ANUNCIOS_BARRIALES = [
  'Retiro en el día en Guaymallén • Mandanos tu lista escolar por WhatsApp',
  'Efectivo, débito y transferencia sin recargo • Crédito disponible en local',
  'Cerca del Átomo de Elpidio González y Urquiza • Atención personalizada',
];

// Ícono SVG de Instagram estilizado según la estética de Lucide (stroke 2, sin dependencias externas)
function InstagramIcon({ className = "w-4 h-4", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={2} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// Estado inicial estático para evitar impurezas en SSR prerender
const ESTADO_FALLBACK: EstadoAtencion = {
  estaAbierto: true,
  estadoTexto: 'Abierto ahora',
  mensajeDetalle: 'Horario: 09:30 a 13:30 hs y 17:00 a 20:30 hs',
  badgeVariant: 'success',
};

export function Header() {
  const [mostrarTooltipHorarios, setMostrarTooltipHorarios] = useState(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [estado, setEstado] = useState<EstadoAtencion>(ESTADO_FALLBACK);
  const [indiceAnuncio, setIndiceAnuncio] = useState(0);

  // La evaluación corre en background con la hora real del cliente
  useEffect(() => {
    const actualizar = () => {
      setEstado(gestorHorarios.evaluarEstado(new Date()));
    };

    actualizar();
    const interval = setInterval(actualizar, 60000);
    return () => clearInterval(interval);
  }, []);

  // Rotación automática suave de los mensajes barriales en la franja superior
  useEffect(() => {
    const timer = setInterval(() => {
      setIndiceAnuncio((prev) => (prev + 1) % ANUNCIOS_BARRIALES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const irAnuncioAnterior = () => {
    setIndiceAnuncio((prev) => (prev - 1 + ANUNCIOS_BARRIALES.length) % ANUNCIOS_BARRIALES.length);
  };

  const irAnuncioSiguiente = () => {
    setIndiceAnuncio((prev) => (prev + 1) % ANUNCIOS_BARRIALES.length);
  };

  // Función para enfocar el buscador global
  const handleScrollToSearch = () => {
    setMenuMovilAbierto(false);
    const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Buscar"]');
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        searchInput.focus();
      }, 350);
    } else {
      const catalogoSection = document.getElementById('catalogo');
      if (catalogoSection) {
        catalogoSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-gradient-to-r from-[#f6dce3]/95 via-[#eee0f7]/95 to-[#f6dce3]/95 backdrop-blur-md border-b border-[#e2c2d6] shadow-md shadow-purple-950/8 transition-all">
      {/* Mini barra superior de anuncios barriales con flechas y rotación */}
      <div className="w-full bg-[#c96f80] text-white border-b border-[#b95e70]/60">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-8 sm:h-9 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={irAnuncioAnterior}
            aria-label="Mensaje anterior"
            className="p-1 rounded-full text-white/85 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <p
            key={indiceAnuncio}
            className="text-[11px] sm:text-xs font-bold tracking-wide text-center truncate animate-in fade-in duration-300"
          >
            {ANUNCIOS_BARRIALES[indiceAnuncio]}
          </p>

          <button
            type="button"
            onClick={irAnuncioSiguiente}
            aria-label="Siguiente mensaje"
            className="p-1 rounded-full text-white/85 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-22 gap-3">
          
          {/* 1. IZQUIERDA: Logo Floral + Nombre de Marca con Tipografía Elegante */}
          <div className="flex items-center min-w-0">
            <a 
              href="/" 
              className="group inline-flex items-center gap-2.5 sm:gap-3.5 min-w-0 focus:outline-hidden"
              aria-label="Ir a página de inicio de Librería Motivos"
            >
              <div className="relative shrink-0">
                <div
                  aria-hidden="true"
                  className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#d97786]/40 via-[#b88ce2]/35 to-[#f5b7c2]/45 blur-xs opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                />
                <img
                  src="/images/logo-motivos.jpg"
                  alt="Motivos - Regalos y Mimos"
                  className="relative w-12 h-12 sm:w-15 sm:h-15 rounded-full object-cover shadow-md border-2 border-white ring-2 ring-[#e8b8c4] bg-[#fdfbf7] group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="min-w-0">
                <h1 className="font-brand text-lg sm:text-2xl lg:text-[26px] font-bold tracking-tight text-[#4c1c54] group-hover:text-[#b34f60] leading-none transition-colors truncate">
                  {DATOS_LIBRERIA_MOTIVOS.nombre}
                </h1>
                <span className="hidden xs:block text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#7f4658] mt-1 truncate">
                  Escolar • Regalería • Guaymallén
                </span>
              </div>
            </a>
          </div>

          {/* 2. CENTRO: Barra de Navegación Elevada Blanca que resalta sobre el navbar rosado/lila */}
          <nav 
            aria-label="Navegación rápida de secciones"
            className="hidden md:flex items-center gap-1 lg:gap-1.5 px-2.5 py-1.5 rounded-full bg-white border border-[#e5c9dc] shadow-sm shadow-purple-950/8"
          >
            <a 
              href="#catalogo" 
              className="px-4 py-1.5 rounded-full text-xs lg:text-sm font-bold text-purple-950 hover:bg-[#fef2f4] hover:text-[#b34f60] transition-all duration-200"
            >
              Catálogo
            </a>
            <a 
              href="#promociones" 
              className="px-4 py-1.5 rounded-full text-xs lg:text-sm font-bold text-purple-950 hover:bg-[#fef2f4] hover:text-[#b34f60] transition-all duration-200"
            >
              Promociones
            </a>
            <a 
              href="#horarios" 
              className="px-4 py-1.5 rounded-full text-xs lg:text-sm font-bold text-purple-950 hover:bg-[#f4ecfa] hover:text-purple-800 transition-all duration-200"
            >
              Horarios
            </a>
            <a 
              href="#ubicacion" 
              className="px-4 py-1.5 rounded-full text-xs lg:text-sm font-bold text-purple-950 hover:bg-[#f4ecfa] hover:text-purple-800 transition-all duration-200"
            >
              Ubicación
            </a>
          </nav>

          {/* 3. DERECHA: Búsqueda Global, Redes Sociales y Badge Interactivo de Estado */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Botón de Búsqueda Global con etiqueta en escritorio */}
            <button
              type="button"
              onClick={handleScrollToSearch}
              aria-label="Buscar productos en el catálogo"
              title="Buscar en el catálogo"
              className="px-2.5 py-2 sm:px-3 sm:py-2 rounded-full bg-white/90 hover:bg-white text-purple-900 hover:text-[#b34f60] active:scale-95 transition-all duration-200 touch-manipulation cursor-pointer flex items-center justify-center gap-1.5 border border-[#e5d2ee] shadow-2xs hover:shadow-xs"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="hidden xl:inline text-xs font-bold">Buscar</span>
            </button>

            {/* Íconos a Instagram y Reseñas de Google Maps */}
            <div className="hidden sm:flex items-center gap-1.5">
              <a
                href={DATOS_LIBRERIA_MOTIVOS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Seguir a Librería Motivos en Instagram"
                title="Instagram: @motivos.regalos_"
                className="w-9 h-9 rounded-full bg-white/90 hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-500 text-pink-600 hover:text-white border border-[#e5d2ee] hover:border-transparent shadow-2xs active:scale-95 transition-all duration-200 touch-manipulation flex items-center justify-center"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href={DATOS_LIBRERIA_MOTIVOS.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver opiniones y reseñas en Google Maps"
                title="Opiniones en Google Maps (4.9 estrellas)"
                className="px-2.5 h-9 rounded-full bg-white/90 hover:bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs active:scale-95 transition-all duration-200 touch-manipulation flex items-center gap-1"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span className="text-xs font-extrabold text-purple-950">4.9</span>
              </a>
            </div>

            {/* Badge Interactivo de Estado ('Abierto'/'Cerrado') */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMostrarTooltipHorarios(!mostrarTooltipHorarios)}
                className="group focus:outline-hidden rounded-full focus-visible:ring-2 focus-visible:ring-[#d97786] active:scale-95 transition-all duration-200 touch-manipulation cursor-pointer select-none"
                aria-expanded={mostrarTooltipHorarios}
                aria-haspopup="dialog"
                aria-label={`Estado actual: ${estado.estadoTexto}. ${estado.mensajeDetalle}. Tocar para ver la grilla completa de horarios.`}
              >
                {estado.estaAbierto ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300/90 hover:bg-emerald-100 transition-colors shadow-xs">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                    </span>
                    <span className="whitespace-nowrap font-bold">Abierto ahora</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-emerald-600 transition-transform duration-200 ${mostrarTooltipHorarios ? 'rotate-180' : ''}`} />
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold bg-white/95 text-[#9f3f50] border border-[#f0c5ce] hover:bg-[#fef2f4] transition-colors shadow-xs">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#d97786] shrink-0" />
                    <span className="whitespace-nowrap font-bold">Cerrado</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#d97786] transition-transform duration-200 ${mostrarTooltipHorarios ? 'rotate-180' : ''}`} />
                  </span>
                )}
              </button>

              {/* Tooltip Limpio con Grilla de Horarios de la entidad HorarioAtencion */}
              {mostrarTooltipHorarios && (
                <>
                  {/* Telón semitransparente con touch-manipulation para cerrar al tocar fuera */}
                  <div 
                    className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] touch-manipulation cursor-pointer" 
                    onClick={() => setMostrarTooltipHorarios(false)}
                    aria-hidden="true"
                  />

                  {/* Caja flotante del Tooltip */}
                  <div 
                    role="dialog"
                    aria-label="Grilla de horarios de atención"
                    className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-88 max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200/90 p-4 sm:p-5 z-50 text-slate-800 animate-in fade-in-50 zoom-in-95 duration-150"
                  >
                    {/* Encabezado del Tooltip */}
                    <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900">
                            Horarios de Atención
                          </h4>
                          <p className="text-[11px] text-slate-500">Librería Motivos • Guaymallén</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMostrarTooltipHorarios(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors touch-manipulation cursor-pointer"
                        aria-label="Cerrar ventana de horarios"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Estado en vivo en tiempo real */}
                    <div className={`mt-3 p-2.5 rounded-xl text-xs flex items-center gap-2.5 ${
                      estado.estaAbierto 
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80' 
                        : 'bg-rose-50 text-rose-900 border border-rose-200/80'
                    }`}>
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${estado.estaAbierto ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      <div className="min-w-0">
                        <p className="font-bold text-[11px] uppercase tracking-wide">
                          {estado.estadoTexto}
                        </p>
                        <p className="text-xs font-medium opacity-90 truncate">
                          {estado.mensajeDetalle}
                        </p>
                      </div>
                    </div>

                    {/* Grilla Limpia de Horarios desde la entidad HorarioAtencion */}
                    <div className="mt-3.5 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                        Turnos Semanales
                      </span>
                      <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-100 divide-y divide-slate-100 text-xs">
                        
                        {/* Lunes a Viernes */}
                        <div className="py-2 first:pt-0 flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-slate-900">Lunes a Viernes</p>
                            <p className="text-[10px] text-slate-500">Turno Mañana y Tarde</p>
                          </div>
                          <div className="text-right font-medium text-slate-700 space-y-0.5">
                            <p className="font-mono text-[11px] sm:text-xs">09:30 a 13:30 hs</p>
                            <p className="font-mono text-[11px] sm:text-xs">17:00 a 20:30 hs</p>
                          </div>
                        </div>

                        {/* Sábados */}
                        <div className="py-2 flex items-center justify-between gap-2">
                          <div>
                            <p className="font-semibold text-slate-900">Sábados</p>
                            <p className="text-[10px] text-slate-500">Turno Mañana</p>
                          </div>
                          <div className="text-right font-medium text-slate-700">
                            <p className="font-mono text-[11px] sm:text-xs">10:00 a 13:30 hs</p>
                          </div>
                        </div>

                        {/* Domingos y Feriados */}
                        <div className="py-2 last:pb-0 flex items-center justify-between gap-2 text-slate-400">
                          <div>
                            <p className="font-medium">Domingos y Feriados</p>
                            <p className="text-[10px] text-slate-400">Sin atención presencial</p>
                          </div>
                          <span className="font-semibold text-rose-500/80">Cerrado</span>
                        </div>
                      </div>
                    </div>

                    {/* Pie del Tooltip con Mapa y Reseñas de Google */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1 text-slate-500 truncate mr-2">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span className="truncate">Guaymallén, Mendoza</span>
                      </div>
                      <a
                        href={DATOS_LIBRERIA_MOTIVOS.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-900 font-bold hover:underline shrink-0 inline-flex items-center gap-1 p-1 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        <span>Cómo llegar</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Botón de Menú Rápido Móvil (Solo visible en < 768px) */}
            <div className="md:hidden relative">
              <button
                type="button"
                onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
                className="p-2 rounded-xl text-slate-600 hover:text-blue-900 hover:bg-slate-100 active:scale-95 transition-all duration-200 touch-manipulation cursor-pointer border border-transparent hover:border-slate-200"
                aria-expanded={menuMovilAbierto}
                aria-label="Abrir menú de navegación"
              >
                {menuMovilAbierto ? (
                  <X className="w-5 h-5 text-slate-800" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-800" />
                )}
              </button>

              {/* Panel Desplegable Móvil */}
              {menuMovilAbierto && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] touch-manipulation cursor-pointer" 
                    onClick={() => setMenuMovilAbierto(false)}
                    aria-hidden="true"
                  />

                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#fcfaff] rounded-2xl shadow-xl border border-purple-200/90 p-4 z-50 text-slate-800 animate-in fade-in-50 zoom-in-95 duration-150 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900/60 block px-1">
                      Navegación Rápida
                    </span>
                    
                    <div className="space-y-1">
                      <a
                        href="#catalogo"
                        onClick={() => setMenuMovilAbierto(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-950 hover:bg-purple-100/70 hover:text-purple-900 transition-colors touch-manipulation"
                      >
                        <PackageSearch className="w-4 h-4 text-purple-700" />
                        <span>Catálogo de Artículos</span>
                      </a>

                      <a
                        href="#promociones"
                        onClick={() => setMenuMovilAbierto(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-950 hover:bg-purple-100/70 hover:text-purple-900 transition-colors touch-manipulation"
                      >
                        <Tag className="w-4 h-4 text-purple-700" />
                        <span>Promociones Especiales</span>
                      </a>

                      <a
                        href="#horarios"
                        onClick={() => setMenuMovilAbierto(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-950 hover:bg-emerald-100/70 hover:text-emerald-900 transition-colors touch-manipulation"
                      >
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>Horarios de Atención</span>
                      </a>

                      <a
                        href="#ubicacion"
                        onClick={() => setMenuMovilAbierto(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-950 hover:bg-blue-100/70 hover:text-blue-900 transition-colors touch-manipulation"
                      >
                        <MapPin className="w-4 h-4 text-blue-700" />
                        <span>¿Dónde encontrarnos?</span>
                      </a>
                    </div>

                    <div className="pt-2 border-t border-purple-100 flex items-center justify-around">
                      <a
                        href={DATOS_LIBRERIA_MOTIVOS.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-purple-900 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                      >
                        <InstagramIcon className="w-4 h-4 text-pink-600" />
                        <span>Instagram</span>
                      </a>

                      <a
                        href={DATOS_LIBRERIA_MOTIVOS.googleReviewsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-purple-900 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                        <span>4.9</span>
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
