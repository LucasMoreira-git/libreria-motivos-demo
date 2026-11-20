'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DATOS_LIBRERIA_MOTIVOS, type DatosNegocio } from '@/lib/mock-data';
import { MapPin, Navigation, ExternalLink, Compass, Copy, Check } from 'lucide-react';

interface LocationSectionProps {
  datos?: DatosNegocio;
}

export function LocationSection({ datos = DATOS_LIBRERIA_MOTIVOS }: LocationSectionProps) {
  const [haSidoVisto, setHaSidoVisto] = useState<boolean>(false);
  const [copiada, setCopiada] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);

  const direccionVisible = datos.direccionCompleta || datos.direccion;

  const handleCopiarDireccion = async () => {
    try {
      await navigator.clipboard.writeText(direccionVisible);
      setCopiada(true);
      setTimeout(() => setCopiada(false), 2500);
    } catch {
      // Fallback para navegadores sin permisos de clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = direccionVisible;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopiada(true);
        setTimeout(() => setCopiada(false), 2500);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  // Intersection Observer para detonar la animación secuencial una sola vez al llegar a la sección
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setHaSidoVisto(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHaSidoVisto(true);
          observer.disconnect(); // Detonación única
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="ubicacion"
      ref={sectionRef}
      aria-label="¿Dónde encontrarnos?"
      className="w-full my-8 sm:my-12 scroll-mt-24 overflow-hidden"
    >
      <div className="w-full bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-sm overflow-hidden">
        
        {/* Contenedor Responsive: 2 columnas en Desktop / 1 columna apilada en Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
          
          {/* COLUMNA IZQUIERDA: Información y CTA */}
          <div className="flex flex-col justify-between space-y-6">
            
            {/* Secuencia 1: Título introductorio (Fade in + translate-y, 400ms) */}
            <div
              className={`space-y-2 transition-all duration-400 ease-out ${
                haSidoVisto
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200/80">
                <Compass className="w-3.5 h-3.5 text-blue-900" />
                <span>Ubicación y Local</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ¿Dónde encontrarnos?
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                Te esperamos en nuestro local tradicional en Guaymallén. Podés acercarte a retirar tus compras coordinadas por WhatsApp o venir a elegir tus artículos escolares, comerciales y didácticos con atención personalizada.
              </p>
            </div>

            {/* Secuencia 2: Bloque de Información de Dirección + CTA (Fade in + translate-y, 400ms con delay 150ms) */}
            <div
              className={`space-y-4 transition-all duration-400 ease-out delay-[150ms] ${
                haSidoVisto
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              {/* Tarjeta de Datos de Dirección */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3.5 text-xs sm:text-sm">
                
                {/* Dirección completa */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100/70 text-blue-900 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-blue-900" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Dirección Completa
                    </span>
                    <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                      <p className="font-heading font-bold text-slate-900 leading-snug">
                        {direccionVisible}
                      </p>
                      <button
                        type="button"
                        onClick={handleCopiarDireccion}
                        aria-label="Copiar dirección al portapapeles"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all duration-200 active:scale-95 cursor-pointer touch-manipulation shrink-0 min-h-[36px] ${
                          copiada
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                            : 'bg-white hover:bg-blue-50 text-blue-900 border-slate-200 hover:border-blue-300 shadow-2xs'
                        }`}
                      >
                        {copiada ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>¡Copiada!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                            <span>Copiar dirección</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Localidad y Referencia Barrial */}
                <div className="flex items-start gap-3 pt-2 border-t border-slate-200/60">
                  <div className="w-8 h-8 rounded-xl bg-blue-100/70 text-blue-900 flex items-center justify-center shrink-0 mt-0.5">
                    <Navigation className="w-4 h-4 text-blue-900" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Localidad y Accesibilidad
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {datos.localidad || datos.ubicacion}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Zona San Francisco del Monte / Parque Urquiza (cerca de Átomo Elpidio González y Urquiza).
                    </p>
                  </div>
                </div>

              </div>

              {/* Botón CTA Principal en Azul Corporativo con feedback visual interactivo */}
              <div className="pt-1">
                <a
                  href={datos.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver ubicación de ${datos.nombre} en Google Maps`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-out min-h-[48px] touch-manipulation cursor-pointer select-none"
                >
                  <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Ver en Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                </a>
              </div>

            </div>

          </div>

          {/* COLUMNA DERECHA: Minimapa Incrustado (Secuencia 3: Fade in + translate-y, 500ms con delay 300ms) */}
          <div
            className={`w-full min-h-[260px] sm:min-h-[320px] lg:min-h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm relative bg-slate-100 transition-all duration-500 ease-out delay-[300ms] ${
              haSidoVisto
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-4 scale-[0.99] pointer-events-none'
            }`}
          >
            {/* Iframe oficial de Google Maps apuntando a la ficha exacta de Librería Motivos */}
            <iframe
              title={`Minimapa con ubicación oficial de ${datos.nombre}`}
              src={datos.googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="w-full h-full min-h-[260px] sm:min-h-[320px] lg:min-h-[360px]"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
