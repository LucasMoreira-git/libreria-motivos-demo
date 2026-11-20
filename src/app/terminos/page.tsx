import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, Tag, Store, CreditCard } from 'lucide-react';
import { DATOS_LIBRERIA_MOTIVOS } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Términos y Condiciones — Librería Motivos',
  description:
    'Condiciones generales de uso de la vitrina web, precios de referencia, disponibilidad y retiro en Librería Motivos.',
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#fafafb] text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-purple-900 hover:text-[#d97786] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la vitrina de Librería Motivos</span>
        </Link>

        <article className="bg-white rounded-3xl border border-[#ded0f2] shadow-sm p-6 sm:p-10 space-y-7">
          <header className="space-y-2 border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef5f6] border border-[#f2d3d8] text-[11px] font-bold uppercase tracking-wider text-[#6e2e38]">
              <FileText className="w-3.5 h-3.5 text-[#d97786]" />
              <span>Condiciones de Uso</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
              Términos y Condiciones
            </h1>
            <p className="text-xs text-slate-500">
              Vigentes para el uso del catálogo web de Librería Motivos (Guaymallén, Mendoza)
            </p>
          </header>

          <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading text-base font-extrabold text-purple-950 flex items-center gap-2">
              <Store className="w-4 h-4 text-[#d97786]" />
              1. Carácter informativo de la vitrina web
            </h2>
            <p>
              Este sitio web es un catálogo digital informativo pensado para facilitar consultas y
              presupuestos. La compra, pago y retiro de los productos se concreta directamente en
              nuestro local comercial ({DATOS_LIBRERIA_MOTIVOS.direccion}) o mediante coordinación
              previa por WhatsApp.
            </p>
          </section>

          <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading text-base font-extrabold text-purple-950 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-700" />
              2. Precios y medios de pago
            </h2>
            <p>
              Todos los precios publicados están expresados en <strong>Pesos Argentinos (ARS)</strong>{' '}
              y son válidos de referencia para pagos en <strong>efectivo, débito o transferencia</strong>.
              Los pagos con tarjeta de crédito y planes en cuotas se consultan directamente en el
              local y pueden contar con recargos según la promoción bancaria vigente.
            </p>
            <p>
              Los precios y la disponibilidad de stock están sujetos a modificaciones sin previo
              aviso. Te recomendamos confirmar stock por WhatsApp antes de acercarte si buscás un
              artículo específico.
            </p>
          </section>

          <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading text-base font-extrabold text-purple-950 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              3. Promociones y fotos de referencia
            </h2>
            <p>
              Las promociones de temporada y descuentos programados rigen exclusivamente dentro de
              las fechas indicadas o hasta agotar el stock disponible en el local. Las imágenes de
              los artículos son ilustrativas y pueden presentar pequeñas variaciones de color o
              presentación según el fabricante.
            </p>
          </section>

          <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading text-base font-extrabold text-purple-950 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              4. Cambios y contacto
            </h2>
            <p>
              Para cambios de productos, presupuestos de listas escolares o cualquier inquietud,
              comunicate con nosotros por WhatsApp al{' '}
              <a
                href={`tel:${DATOS_LIBRERIA_MOTIVOS.telefonoWhatsApp}`}
                className="font-bold text-purple-900 underline hover:text-[#d97786]"
              >
                +54 9 261 563-5813
              </a>{' '}
              en nuestros horarios de atención.
            </p>
          </section>

          <footer className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <Link href="/privacidad" className="font-bold text-purple-900 hover:text-[#d97786] underline">
              Leer Política de Privacidad
            </Link>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-purple-950 text-white font-bold hover:bg-purple-900 transition-colors"
            >
              Volver al catálogo
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
}
