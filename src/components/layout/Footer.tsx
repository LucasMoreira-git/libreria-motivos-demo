'use client';

import React, { useState } from 'react';
import { DATOS_LIBRERIA_MOTIVOS } from '@/lib/mock-data';
import { getGeneralWhatsAppLink } from '@/lib/whatsapp';
import { 
  ArrowRight, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

// Ícono SVG de Instagram oficial
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

// Ícono SVG de WhatsApp oficial
function WhatsAppIcon({ className = "w-4 h-4", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.075-1.92-.455-1.583-.655-2.6-2.272-2.678-2.378-.078-.106-.642-.857-.642-1.635 0-.778.406-1.161.55-1.319.144-.158.315-.198.42-.198.106 0 .211.002.304.007.098.005.23-.037.36.275.144.405.485 1.182.527 1.27.042.088.07.19.012.305-.058.115-.088.187-.174.288-.087.102-.183.228-.261.306-.088.087-.18.182-.077.359.102.176.455.75 1.003 1.238.706.629 1.301.823 1.488.916.187.093.298.078.409-.05.111-.129.475-.553.602-.743.127-.19.254-.158.428-.094.174.064 1.107.522 1.297.617.19.095.317.143.364.222.048.079.048.46-.096.865z" />
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.66 1.45 5.174L2 22l4.981-1.411A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.603 0-3.097-.478-4.354-1.3l-.312-.206-2.954.836.837-2.883-.204-.326A8.136 8.136 0 013.833 12c0-4.502 3.665-8.167 8.167-8.167 4.502 0 8.167 3.665 8.167 8.167z" />
    </svg>
  );
}

// Ícono SVG de Facebook
function FacebookIcon({ className = "w-4 h-4", ...props }: React.SVGProps<SVGSVGElement>) {
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState('');
  const [suscrito, setSuscrito] = useState(false);
  const whatsappUrl = getGeneralWhatsAppLink(DATOS_LIBRERIA_MOTIVOS.telefonoWhatsApp);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSuscrito(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer 
      role="contentinfo"
      aria-label="Pie de página institucional"
      className="w-full bg-gradient-to-b from-[#fbf8fd] via-[#f7f2fa] to-[#ede4f6] text-slate-700 border-t border-purple-200/80 mt-auto transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8">
        
        {/* PARTE SUPERIOR: Grilla de 4 Columnas inspirada en la referencia visual */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12">
          
          {/* COLUMNA 1: Información del Negocio y Dirección */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-purple-950">
              Librería Motivos
            </h4>
            
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Encontranos en nuestro local de Guaymallén y{' '}
              <a 
                href={DATOS_LIBRERIA_MOTIVOS.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-purple-900 underline hover:text-purple-950 transition-colors inline-flex items-center gap-0.5"
              >
                <span>Ver en Google Maps</span>
                <ExternalLink className="w-3 h-3 inline" />
              </a>
            </p>

            <div className="space-y-1.5 pt-1 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                <a 
                  href={`tel:${DATOS_LIBRERIA_MOTIVOS.telefonoWhatsApp}`}
                  className="font-medium hover:text-purple-950 transition-colors"
                >
                  +54 9 261 563-5813
                </a>
              </p>
              <p className="flex items-start gap-2 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-purple-700 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Juan Carlos Lucero M-D-C44, M5521 Guaymallén, Mendoza
                </span>
              </p>
            </div>
          </div>

          {/* COLUMNA 2: Catálogo & Rubros */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-purple-950">
              Catálogo & Rubros
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#catalogo" className="text-slate-600 hover:text-purple-950 transition-colors">
                  Útiles Escolares & Colegiales
                </a>
              </li>
              <li>
                <a href="#catalogo" className="text-slate-600 hover:text-purple-950 transition-colors">
                  Artículos de Oficina & Comercial
                </a>
              </li>
              <li>
                <a href="#catalogo" className="text-slate-600 hover:text-purple-950 transition-colors">
                  Artística, Acrílicos y Pinceles
                </a>
              </li>
              <li>
                <a href="#catalogo" className="text-slate-600 hover:text-purple-950 transition-colors">
                  Regalería & Didácticos Infantiles
                </a>
              </li>
              <li>
                <a href="#catalogo" className="text-slate-600 hover:text-purple-950 transition-colors">
                  Dibujo Técnico y Geometría
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: Atención & Servicios */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-purple-950">
              Atención & Servicios
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#horarios" className="text-slate-600 hover:text-purple-950 transition-colors">
                  Horarios de Atención Semanales
                </a>
              </li>
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-purple-950 transition-colors">
                  Presupuestos de Listas Escolares
                </a>
              </li>
              <li>
                <a href="#ubicacion" className="text-slate-600 hover:text-purple-950 transition-colors">
                  Retiro en el Día en Local
                </a>
              </li>
              <li>
                <a href="#ubicacion" className="text-slate-600 hover:text-purple-950 transition-colors">
                  Medios de Pago: Efectivo / Débito / Transf.
                </a>
              </li>
              <li>
                <a 
                  href={DATOS_LIBRERIA_MOTIVOS.googleReviewsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-600 hover:text-purple-950 transition-colors"
                >
                  Opiniones de Clientes (4.9 ★)
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: Novedades & Presupuestos (Good Emails) */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-purple-950">
              Novedades & Listas
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ingresá tu email para enterarte antes que nadie de nuevas promociones de temporada, ofertas escolares y lanzamientos.
            </p>

            {/* Input pill estilizado con flecha idéntico a la referencia visual */}
            <form onSubmit={handleNewsletterSubmit} className="pt-1">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  required
                  aria-label="Dirección de correo electrónico para novedades"
                  className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-full pl-4 pr-12 py-2.5 border border-purple-200/90 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-purple-400 transition-all"
                />
                <button
                  type="submit"
                  aria-label="Suscribirme a las novedades"
                  className="absolute right-1 w-8 h-8 rounded-full bg-purple-900 hover:bg-purple-950 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {suscrito && (
                <p className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mt-2 animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>¡Gracias! Te avisaremos de las próximas novedades.</span>
                </p>
              )}
            </form>
          </div>

        </div>

        {/* DIVIDER HORIZONTAL SUTIL */}
        <div className="w-full border-t border-purple-200/80 my-2" />

        {/* PARTE INFERIOR: Redes Sociales (izq) | Slogan Itálico (centro) | Sello Emblemático de Marca (der) */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          {/* Izquierda: Redes Sociales */}
          <div className="flex items-center gap-3">
            <a
              href={DATOS_LIBRERIA_MOTIVOS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Librería Motivos"
              title="Instagram: @motivos.regalos_"
              className="w-9 h-9 rounded-full bg-white border border-purple-200 text-purple-900 hover:text-white hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp de Librería Motivos"
              title="WhatsApp: 0261 563-5813"
              className="w-9 h-9 rounded-full bg-white border border-purple-200 text-purple-900 hover:text-white hover:bg-[#25D366] flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>

            <a
              href={DATOS_LIBRERIA_MOTIVOS.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ubicación en Google Maps"
              title="Cómo llegar en Google Maps"
              className="w-9 h-9 rounded-full bg-white border border-purple-200 text-purple-900 hover:text-white hover:bg-blue-900 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook de Librería Motivos"
              title="Página de Facebook"
              className="w-9 h-9 rounded-full bg-white border border-purple-200 text-purple-900 hover:text-white hover:bg-[#1877F2] flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Centro: Slogan Itálico de Marca y Copyright */}
          <div className="flex flex-col items-center text-center space-y-1">
            <p className="font-heading italic font-semibold text-xs sm:text-sm text-purple-950 tracking-wide">
              LIBRERÍA MOTIVOS — Tradición, Calidad y Calidez Vecinal en Guaymallén
            </p>
            <p className="text-[11px] text-slate-500">
              © 2026 Librería Motivos. Todos los derechos reservados. Mendoza, Argentina.
            </p>
          </div>

          {/* Derecha: Sello Emblemático / Logo Badge inspirado en el cuadro de la imagen de referencia */}
          <div className="shrink-0 bg-white/95 px-5 py-3 rounded-2xl border border-purple-200 shadow-2xs flex flex-col items-center justify-center text-center">
            {/* Círculo con monograma M y líneas horizontales dobles laterales */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-purple-300" />
              <div className="w-7 h-7 rounded-full border border-purple-400 flex items-center justify-center text-purple-900 font-serif font-black text-sm bg-purple-50">
                M
              </div>
              <div className="w-6 h-0.5 bg-purple-300" />
            </div>
            {/* Texto en letra serif/cursiva sutil */}
            <span className="font-serif italic text-xs font-semibold text-purple-900 tracking-wider mt-1">
              librería motivos
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}
