'use client';

import React, { useState } from 'react';
import { Promocion } from '@/types/catalogo';
import { PROMOCIONES_MOCK } from '@/lib/mock-catalogo';
import { DATOS_LIBRERIA_MOTIVOS } from '@/lib/mock-data';
import { getPromoWhatsAppLink } from '@/lib/whatsapp';
import { Sparkles, Calendar, Tag, ArrowRight } from 'lucide-react';

interface PromoHeroProps {
  promociones?: Promocion[];
}

export function PromoHero({ promociones = PROMOCIONES_MOCK }: PromoHeroProps) {
  const [promoActivaIndex, setPromoActivaIndex] = useState(0);
  const promoActual = promociones[promoActivaIndex] || promociones[0];

  if (!promoActual) return null;

  const whatsappPromoUrl = getPromoWhatsAppLink(
    promoActual,
    DATOS_LIBRERIA_MOTIVOS.telefonoWhatsApp
  );

  const fotoCombo =
    promoActual.fotoCombo ||
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80';

  return (
    <section 
      id="promociones"
      aria-label="Promociones de Temporada"
      className="w-full my-4 sm:my-6 scroll-mt-24"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fef5f6] via-[#fbf0f2] to-[#f7e6e9] text-slate-900 shadow-sm border border-[#f2d3d8] p-6 sm:p-8 lg:p-10 transition-all hero-stagger-container">
        
        {/* Decoraciones de fondo sutiles en tono pastel suave y natural */}
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/70 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#f4d0d6]/40 blur-xl pointer-events-none" />

        {/* Grid de 2 Columnas: Texto y CTA a la izquierda, Foto representativa a la derecha */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-center">
          
          {/* COLUMNA IZQUIERDA: Textos, Vigencia y CTA */}
          <div className="space-y-4">
            
            {/* Badges de Temporada y Descuento en rosado suave natural */}
            <div className="flex flex-wrap items-center gap-2 hero-stagger-desc">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-black tracking-wide uppercase bg-white/90 backdrop-blur-md text-[#6e2e38] border border-[#f3cad2] shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#d97786]" />
                {promoActual.temporadaPromocion || promoActual.temporada}
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-[#d97786] text-white shadow-2xs">
                <Tag className="w-3 h-3 text-white" />
                {promoActual.descuentoTexto}
              </span>
            </div>

            {/* Título Principal con Poppins y tono oscuro contrastado sobre fondo pastel */}
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-slate-900 hero-stagger-title">
              {promoActual.nombre}
            </h2>

            {/* Detalle descriptivo */}
            <p className="text-xs sm:text-sm lg:text-base text-slate-700 leading-relaxed hero-stagger-desc">
              {promoActual.detalle}
            </p>

            {/* Vigencia y Condiciones */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[11px] sm:text-xs text-slate-600 font-medium hero-stagger-desc">
              <div className="inline-flex items-center gap-1.5 bg-white/85 px-3 py-1 rounded-lg backdrop-blur-xs border border-[#f3cad2] text-slate-700 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-[#d97786]" />
                <span>Válido: {promoActual.fechaInicio} al {promoActual.fechaFin}</span>
              </div>
              {promoActual.condicion && (
                <span className="text-slate-500 italic">
                  • {promoActual.condicion}
                </span>
              )}
            </div>

            {/* CTA de WhatsApp para la Promoción con entrada escalonada y respuesta táctil interactiva */}
            <div className="pt-2 flex flex-col xs:flex-row items-stretch xs:items-center gap-3 hero-stagger-button">
              <a
                href={whatsappPromoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Pedir por WhatsApp la promoción ${promoActual.nombre}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#d97786] hover:bg-[#c46372] text-white font-extrabold text-sm sm:text-base shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 ease-out min-h-[48px] touch-manipulation cursor-pointer select-none"
              >
                {/* Ícono de WhatsApp SVG oficial */}
                <svg 
                  className="w-5 h-5 fill-[#25D366] shrink-0" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.075-1.92-.455-1.583-.655-2.6-2.272-2.678-2.378-.078-.106-.642-.857-.642-1.635 0-.778.406-1.161.55-1.319.144-.158.315-.198.42-.198.106 0 .211.002.304.007.098.005.23-.037.36.275.144.405.485 1.182.527 1.27.042.088.07.19.012.305-.058.115-.088.187-.174.288-.087.102-.183.228-.261.306-.088.087-.18.182-.077.359.102.176.455.75 1.003 1.238.706.629 1.301.823 1.488.916.187.093.298.078.409-.05.111-.129.475-.553.602-.743.127-.19.254-.158.428-.094.174.064 1.107.522 1.297.617.19.095.317.143.364.222.048.079.048.46-.096.865z" />
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.66 1.45 5.174L2 22l4.981-1.411A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.603 0-3.097-.478-4.354-1.3l-.312-.206-2.954.836.837-2.883-.204-.326A8.136 8.136 0 013.833 12c0-4.502 3.665-8.167 8.167-8.167 4.502 0 8.167 3.665 8.167 8.167z" />
                </svg>
                <span>Aprovechar Promo</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </a>

              {/* Selector si hay más de una promoción */}
              {promociones.length > 1 && (
                <div className="flex items-center gap-1.5 px-2 py-1">
                  {promociones.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPromoActivaIndex(idx)}
                      aria-label={`Ver promoción ${p.nombre}`}
                      className={`h-2.5 rounded-full transition-all duration-200 touch-manipulation cursor-pointer ${
                        idx === promoActivaIndex 
                          ? 'w-7 bg-[#d97786] shadow-xs' 
                          : 'w-2.5 bg-[#f4d0d6] hover:bg-[#e89ba6]'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* COLUMNA DERECHA: Foto Representativa del Combo con entrada desde la derecha */}
          <div className="relative w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[350px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-md border-2 border-white/80 group hero-stagger-image">
            <img
              src={fotoCombo}
              alt={promoActual.nombre}
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {/* Overlay sutil inferior con badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
              <span className="bg-white/95 backdrop-blur-md text-slate-900 text-xs font-black px-3 py-1 rounded-full shadow-md">
                Combo Especial 🎒
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
