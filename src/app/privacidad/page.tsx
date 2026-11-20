import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, MessageCircle, Database, Cookie } from 'lucide-react';
import { DATOS_LIBRERIA_MOTIVOS } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Política de Privacidad — Librería Motivos',
  description:
    'Información simple y transparente sobre cómo protegemos tus datos en la vitrina web de Librería Motivos.',
};

export default function PrivacidadPage() {
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
              <ShieldCheck className="w-3.5 h-3.5 text-[#d97786]" />
              <span>Transparencia y Privacidad</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
              Política de Privacidad
            </h1>
            <p className="text-xs text-slate-500">
              Última actualización: 2026 • Librería Motivos (Guaymallén, Mendoza, Argentina)
            </p>
          </header>

          <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading text-base font-extrabold text-purple-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#d97786]" />
              1. Qué es esta página y qué datos recopilamos
            </h2>
            <p>
              La web de <strong>Librería Motivos</strong> funciona como una vitrina informativa
              para que puedas consultar nuestro catálogo de productos, promociones vigentes,
              horarios de atención y ubicación.
            </p>
            <p>
              <strong>No te pedimos registrarte, ni creamos cuentas de clientes, ni solicitamos
              datos de tarjetas de crédito o débito</strong> a través de este sitio.
            </p>
          </section>

          <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading text-base font-extrabold text-purple-950 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              2. Consultas por WhatsApp y Redes Sociales
            </h2>
            <p>
              Cuando elegís armar una lista de productos y tocás el botón de consulta, la página te
              redirige a <strong>WhatsApp</strong> con el mensaje preparado. Los datos que compartas
              en esa conversación (como tu número de teléfono, nombre o lista escolar) se usan
              únicamente para responder tu consulta y preparar tu pedido en el local.
            </p>
            <p>
              Jamás vendemos, alquilamos ni cedemos tu teléfono o datos personales a terceros.
            </p>
          </section>

          <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading text-base font-extrabold text-purple-950 flex items-center gap-2">
              <Cookie className="w-4 h-4 text-purple-700" />
              3. Cookies y almacenamiento en tu navegador
            </h2>
            <p>
              Este sitio utiliza únicamente almacenamiento técnico local de tu navegador para
              recordar tu preferencia sobre cookies y mantener los productos que vas sumando a tu
              lista de consulta mientras recorrés el catálogo. No utilizamos cookies publicitarias
              invasivas ni rastreadores de terceros.
            </p>
          </section>

          <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <h2 className="font-heading text-base font-extrabold text-purple-950 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-600" />
              4. Tus derechos (Ley 25.326 — Argentina)
            </h2>
            <p>
              De acuerdo con la Ley Nacional de Protección de Datos Personales N.º 25.326, tenés
              derecho a solicitar información, actualización o eliminación de cualquier dato que nos
              hayas brindado por WhatsApp o en el local. Podés escribirnos directamente al{' '}
              <a
                href={`tel:${DATOS_LIBRERIA_MOTIVOS.telefonoWhatsApp}`}
                className="font-bold text-purple-900 underline hover:text-[#d97786]"
              >
                +54 9 261 563-5813
              </a>{' '}
              o acercarte a {DATOS_LIBRERIA_MOTIVOS.direccion}.
            </p>
          </section>

          <footer className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <Link href="/terminos" className="font-bold text-purple-900 hover:text-[#d97786] underline">
              Leer Términos y Condiciones
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
