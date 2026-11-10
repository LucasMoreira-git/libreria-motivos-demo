'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PromoHero } from '@/components/modules/PromoHero';
import { ProductGrid } from '@/components/modules/ProductGrid';
import { ScheduleWidget } from '@/components/modules/ScheduleWidget';
import { LocationSection } from '@/components/modules/LocationSection';
import { WhatsAppFloatingCTA } from '@/components/layout/WhatsAppFloatingCTA';
import { DATOS_LIBRERIA_MOTIVOS } from '@/lib/mock-data';
import { getGeneralWhatsAppLink } from '@/lib/whatsapp';
import { MapPin, CreditCard, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

export default function Home() {
  const whatsappUrl = getGeneralWhatsAppLink(DATOS_LIBRERIA_MOTIVOS.telefonoWhatsApp);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800 selection:bg-rose-100 selection:text-rose-900">
      
      {/* 1. Header Principal (Mobile First + Estado en Vivo en Background + WhatsApp CTA) */}
      <Header />

      {/* Contenedor Principal de la Vitrina Web */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 sm:pb-8 relative z-0">
        
        {/* 2. Hero de Promociones de Temporada ("Especial Primavera 2026") */}
        <PromoHero />

        {/* 3. Catálogo Interactivo de Productos (Buscador + CategoryChips + Grilla + Modal) */}
        <ProductGrid />

        {/* 4. Banner de Propuesta de Valor y Atención de Barrio */}
        <section 
          aria-label="Valores del negocio"
          className="my-8 sm:my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white shadow-md border border-rose-900/40 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-pink-200 border border-white/15">
              <HeartHandshake className="w-3.5 h-3.5 text-pink-300" />
              Comercio Tradicional de Guaymallén
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-black text-white tracking-tight">
              ¿Tenés tu lista de útiles o pedido de oficina?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Mandanos una foto o detalle por WhatsApp y te armamos el presupuesto con las mejores opciones y marcas disponibles.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 shrink-0 min-h-[48px]"
          >
            <span>Enviar Lista por WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </section>

        {/* 5. Información del Local: Horarios por Turnos Independientes */}
        <ScheduleWidget />

        {/* 6. Sección de Ubicación: ¿Dónde encontrarnos? (Layout 2 columnas, minimapa Google Maps, animación al scroll) */}
        <LocationSection />

        {/* 7. Beneficios de Compra Vecinal */}
        <section 
          aria-label="Ventajas del comercio local"
          className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900">Atención Personalizada</h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Asesoramiento directo y presupuestos a medida por WhatsApp.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900">Medios de Pago en Local</h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Efectivo, tarjetas de débito/crédito y transferencias bancarias.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading text-xs sm:text-sm font-bold text-slate-900">Retiro en Guaymallén</h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Reservás desde la vitrina y retirás en el día en el local.</p>
            </div>
          </div>
        </section>

      </main>

      {/* 7. Botón Flotante Fijo de WhatsApp (Siempre accesible en el Thumb Zone) */}
      <WhatsAppFloatingCTA />

      {/* 8. Pie de Página Institucional Completo */}
      <Footer />

    </div>
  );
}
