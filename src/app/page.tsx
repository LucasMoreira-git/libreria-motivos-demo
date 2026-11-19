'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PromoHero } from '@/components/modules/PromoHero';
import { ProductGrid } from '@/components/modules/ProductGrid';
import { ScheduleWidget } from '@/components/modules/ScheduleWidget';
import { LocationSection } from '@/components/modules/LocationSection';
import { WhatsAppFloatingCTA } from '@/components/layout/WhatsAppFloatingCTA';
import { ConsultaListaBar } from '@/components/modules/ConsultaListaBar';
import { DATOS_LIBRERIA_MOTIVOS } from '@/lib/mock-data';
import { getGeneralWhatsAppLink } from '@/lib/whatsapp';
import { useAdmin } from '@/context/AdminContext';
import { Producto, TipoCategoria, Promocion } from '@/types/catalogo';
import { MapPin, CreditCard, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

export default function Home() {
  const { productos, categorias, promociones, horarios } = useAdmin();
  const whatsappUrl = getGeneralWhatsAppLink(DATOS_LIBRERIA_MOTIVOS.telefonoWhatsApp);

  // Timestamp cliente para evitar conflictos de prerender con Date.now() en Next.js
  const [timestampActual, setTimestampActual] = useState<number | null>(null);

  useEffect(() => {
    setTimestampActual(Date.now());
    const interval = setInterval(() => {
      setTimestampActual(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Mapeo dinámico y reactivo del catálogo en vivo (excluyendo bajas lógicas)
  const productosActivos: Producto[] = useMemo(() => {
    return productos
      .filter((p) => !p.fechaHoraBajaProducto)
      .map((p) => {
        // Verificar si el descuento sigue vigente por fecha
        const fechaFin = p.fechaFinDescuento ? new Date(p.fechaFinDescuento).getTime() : null;
        const tieneDescuentoVigente = Boolean(
          p.precioDescuentoProducto &&
          p.precioDescuentoProducto > 0 &&
          fechaFin !== null &&
          (timestampActual === null ? (p.tieneDescuentoVigente ?? true) : fechaFin > timestampActual)
        );

        const precioFinal = tieneDescuentoVigente && p.precioDescuentoProducto
          ? p.precioDescuentoProducto
          : p.precioProducto;

        const precioTachado = tieneDescuentoVigente ? p.precioProducto : undefined;

        return {
          id: p.idProducto,
          nombre: p.nombreProducto,
          detalle: p.detalleProducto,
          precio: precioFinal,
          precioAnterior: precioTachado,
          precioDescuento: p.precioDescuentoProducto,
          precioDescuentoProducto: p.precioDescuentoProducto,
          fechaFinDescuento: p.fechaFinDescuento,
          tieneDescuentoVigente,
          precioEfectivo: precioFinal,
          foto: p.fotoProducto,
          categoriaId: p.categoriaId,
          categoriaNombre: p.categoriaNombre,
          destacado: p.destacadoProducto,
          enOferta: tieneDescuentoVigente ? true : p.enOfertaProducto,
          ultimasUnidades: p.ultimasUnidadesProducto,
          ultimasUnidadesProducto: p.ultimasUnidadesProducto,
          nuevoIngreso: p.nuevoIngresoProducto,
          nuevoIngresoProducto: p.nuevoIngresoProducto,
          badge: p.badgeProducto as any,
          badgeProducto: p.badgeProducto,
          icono: p.iconoProducto || null,
          iconoProducto: p.iconoProducto || null,
        };
      });
  }, [productos, timestampActual]);

  const categoriasActivas: TipoCategoria[] = useMemo(() => {
    return categorias
      .filter((c) => !c.fechaHoraBajaCategoria)
      .map((c) => ({
        id: c.idCategoria,
        nombre: c.nombreCategoria,
        slug: c.slugCategoria,
        iconoLucide: c.iconoCategoria,
        descripcion: c.descripcionCategoria,
        orden: c.ordenCategoria,
      }));
  }, [categorias]);

  const promocionesActivas: Promocion[] = useMemo(() => {
    return promociones
      .filter((pr) => !pr.fechaHoraBajaPromocion)
      .map((pr) => ({
        id: pr.idPromocion,
        nombre: pr.nombrePromocion,
        detalle: pr.detallePromocion,
        temporadaPromocion: pr.temporadaPromocion,
        temporada: pr.temporadaPromocion,
        fechaInicio: pr.fechaInicioPromocion,
        fechaFin: pr.fechaFinPromocion,
        descuentoTexto: pr.descuentoTextoPromocion,
        condicion: pr.condicionPromocion,
        badgeTexto: pr.badgeTextoPromocion,
        fotoCombo: pr.fotoComboPromocion,
      }));
  }, [promociones]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800 selection:bg-purple-100 selection:text-purple-900">
      
      {/* 1. Header Principal (Mobile First + Estado en Vivo en Background + WhatsApp CTA) */}
      <Header />

      {/* Contenedor Principal de la Vitrina Web */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 sm:pb-8 relative z-0">
        
        {/* 2. Hero de Promociones de Temporada (Conectado a la BD / AdminContext) */}
        <PromoHero promociones={promocionesActivas.length > 0 ? promocionesActivas : undefined} />

        {/* 3. Barra Compacta de Confianza Vecinal (Entre Hero y Catálogo) */}
        <section 
          aria-label="Ventajas del comercio local"
          className="w-full my-4 sm:my-5 grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200/90 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-900 border border-purple-200/60 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-heading text-xs font-bold text-slate-900 leading-tight">Atención Personalizada</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Asesoramiento directo y presupuestos por WhatsApp.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200/90 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-heading text-xs font-bold text-slate-900 leading-tight">Medios de Pago en Local</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Precios web en efectivo, débito o transf. Crédito en local.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200/90 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-heading text-xs font-bold text-slate-900 leading-tight">Retiro en Guaymallén</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Reservás tu lista y retirás en el día sin espera.</p>
            </div>
          </div>
        </section>

        {/* 4. Catálogo Interactivo de Productos (Conectado en vivo a la BD / AdminContext) */}
        <ProductGrid 
          productosIniciales={productosActivos.length > 0 ? productosActivos : undefined} 
          categorias={categoriasActivas.length > 0 ? categoriasActivas : undefined} 
        />

        {/* 5. Banner de Propuesta de Valor y Atención de Barrio */}
        <section 
          aria-label="Valores del negocio"
          className="w-full my-8 sm:my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950/70 to-slate-900 text-white shadow-md border border-purple-900/40 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-purple-200 border border-white/15">
              <HeartHandshake className="w-3.5 h-3.5 text-purple-300" />
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

        {/* 6. Información del Local: Horarios por Turnos Independientes (Conectado en vivo) */}
        <ScheduleWidget horarios={horarios} />

        {/* 7. Sección de Ubicación: ¿Dónde encontrarnos? */}
        <LocationSection />

      </main>

      {/* 8. Barra Flotante de Lista Multi-Producto o CTA General de WhatsApp */}
      <ConsultaListaBar />
      <WhatsAppFloatingCTA />

      {/* 9. Pie de Página Institucional Completo */}
      <Footer />

    </div>
  );
}
