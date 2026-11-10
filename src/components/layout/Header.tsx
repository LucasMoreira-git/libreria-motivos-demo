'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  ChevronDown, 
  Sparkles, 
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

  // La evaluación corre en background con la hora real del cliente
  useEffect(() => {
    const actualizar = () => {
      setEstado(gestorHorarios.evaluarEstado(new Date()));
    };

    actualizar();
    const interval = setInterval(actualizar, 60000);
    return () => clearInterval(interval);
  }, []);

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
    <header className="sticky top-0 z-30 w-full bg-[#ede4f6] backdrop-blur-md border-b border-purple-200/90 shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* 1. IZQUIERDA: Logo e Identidad del Negocio (Identidad de Marca en armonía morada suave) */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white shadow-sm shrink-0 border border-purple-400/50">
              <span className="text-xl sm:text-2xl font-black tracking-tighter select-none font-serif text-white">
                M
              </span>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center border-2 border-white shadow-2xs">
                <Sparkles className="w-2 h-2 text-purple-950" />
              </div>
            </div>

            <a 
              href="/" 
              className="group inline-flex items-center focus:outline-hidden"
              aria-label="Ir a página de inicio de Librería Motivos"
            >
              <h1 className="font-heading text-base sm:text-lg lg:text-xl font-extrabold text-purple-950 tracking-tight leading-none group-hover:text-purple-700 transition-colors truncate">
                {DATOS_LIBRERIA_MOTIVOS.nombre}
              </h1>
            </a>
          </div>

          {/* 2. CENTRO: Enlaces de Navegación Rápida (Desktop / Tablet) */}
          <nav 
            aria-label="Navegación rápida de secciones"
            className="hidden md:flex items-center gap-5 lg:gap-7"
          >
            <a 
              href="#catalogo" 
              className="text-xs lg:text-sm font-semibold text-purple-900/90 hover:text-purple-950 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-purple-700 after:transition-all after:duration-200"
            >
              Catálogo
            </a>
            <a 
              href="#promociones" 
              className="text-xs lg:text-sm font-semibold text-purple-900/90 hover:text-purple-950 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-purple-700 after:transition-all after:duration-200"
            >
              Promociones
            </a>
            <a 
              href="#horarios" 
              className="text-xs lg:text-sm font-semibold text-purple-900/90 hover:text-purple-950 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-purple-700 after:transition-all after:duration-200"
            >
              Horarios
            </a>
            <a 
              href="#ubicacion" 
              className="text-xs lg:text-sm font-semibold text-purple-900/90 hover:text-purple-950 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-purple-700 after:transition-all after:duration-200"
            >
              Ubicación
            </a>
          </nav>

          {/* 3. DERECHA: Búsqueda Global, Redes Sociales y Badge Interactivo de Estado */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Ícono de Búsqueda Global de Lucide React */}
            <button
              type="button"
              onClick={handleScrollToSearch}
              aria-label="Buscar productos en el catálogo"
              title="Buscar en el catálogo"
              className="p-2 sm:p-2.5 rounded-xl text-purple-900 hover:text-purple-950 hover:bg-purple-200/60 active:scale-95 transition-all duration-200 touch-manipulation cursor-pointer flex items-center justify-center border border-purple-200/70"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Íconos Sutiles a Instagram y Reseñas de Google Maps (Visibles en sm y desktop) */}
            <div className="hidden sm:flex items-center gap-1 border-l border-purple-200/90 pl-1.5 ml-0.5">
              {/* Instagram */}
              <a
                href={DATOS_LIBRERIA_MOTIVOS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Seguir a Librería Motivos en Instagram"
                title="Instagram de Librería Motivos"
                className="p-2 rounded-xl text-purple-800 hover:text-purple-950 hover:bg-purple-200/60 active:scale-95 transition-all duration-200 touch-manipulation flex items-center justify-center"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              {/* Reseñas de Google Maps */}
              <a
                href={DATOS_LIBRERIA_MOTIVOS.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver opiniones y reseñas en Google Maps"
                title="Opiniones en Google Maps (4.9 ★)"
                className="p-2 rounded-xl text-purple-800 hover:text-amber-700 hover:bg-amber-100/60 active:scale-95 transition-all duration-200 touch-manipulation flex items-center gap-1"
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span className="hidden xl:inline text-xs font-bold text-purple-950">4.9 ★</span>
              </a>
            </div>

            {/* Badge Interactivo de Estado ('Abierto'/'Cerrado') con Tooltip Limpio (sin animaciones pulsantes) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMostrarTooltipHorarios(!mostrarTooltipHorarios)}
                className="group focus:outline-hidden rounded-full focus-visible:ring-2 focus-visible:ring-rose-500 active:scale-95 transition-all duration-200 touch-manipulation cursor-pointer select-none"
                aria-expanded={mostrarTooltipHorarios}
                aria-haspopup="dialog"
                aria-label={`Estado actual: ${estado.estadoTexto}. ${estado.mensajeDetalle}. Tocar para ver la grilla completa de horarios.`}
              >
                {estado.estaAbierto ? (
                  /* Badge ABIERTO AHORA (Verde, sin efecto pulsante) */
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300/80 hover:bg-emerald-100 transition-colors shadow-2xs">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                    <span className="whitespace-nowrap font-bold">Abierto ahora</span>
                    <ChevronDown className={`w-3 h-3 text-emerald-600 transition-transform duration-200 ${mostrarTooltipHorarios ? 'rotate-180' : ''}`} />
                  </span>
                ) : (
                  /* Badge CERRADO (Rojo) */
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300/80 hover:bg-rose-100 transition-colors shadow-2xs">
                    <span className="inline-block w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                    <span className="whitespace-nowrap font-bold">Cerrado</span>
                    <ChevronDown className={`w-3 h-3 text-rose-600 transition-transform duration-200 ${mostrarTooltipHorarios ? 'rotate-180' : ''}`} />
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
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-950 hover:bg-rose-100/70 hover:text-rose-900 transition-colors touch-manipulation"
                      >
                        <Tag className="w-4 h-4 text-rose-500" />
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
                        <span>4.9 ★</span>
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
