'use client';

import React from 'react';
import { DATOS_LIBRERIA_MOTIVOS } from '@/lib/mock-data';
import { getGeneralWhatsAppLink } from '@/lib/whatsapp';

export function WhatsAppFloatingCTA() {
  const whatsappUrl = getGeneralWhatsAppLink(DATOS_LIBRERIA_MOTIVOS.telefonoWhatsApp);

  return (
    <aside 
      aria-label="Contacto rápido por WhatsApp"
      className="fixed bottom-5 right-4 z-40 pointer-events-auto w-fit h-fit touch-manipulation"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir chat de WhatsApp con Librería Motivos"
        className="group flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] hover:scale-[1.03] text-white font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 ease-out select-none border border-emerald-400/40 touch-manipulation cursor-pointer"
      >
        {/* SVG Oficial de WhatsApp (sin giros de ícono) */}
        <svg 
          className="w-5 h-5 sm:w-6 sm:h-6 fill-current shrink-0 transition-opacity" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.075-1.92-.455-1.583-.655-2.6-2.272-2.678-2.378-.078-.106-.642-.857-.642-1.635 0-.778.406-1.161.55-1.319.144-.158.315-.198.42-.198.106 0 .211.002.304.007.098.005.23-.037.36.275.144.405.485 1.182.527 1.27.042.088.07.19.012.305-.058.115-.088.187-.174.288-.087.102-.183.228-.261.306-.088.087-.18.182-.077.359.102.176.455.75 1.003 1.238.706.629 1.301.823 1.488.916.187.093.298.078.409-.05.111-.129.475-.553.602-.743.127-.19.254-.158.428-.094.174.064 1.107.522 1.297.617.19.095.317.143.364.222.048.079.048.46-.096.865z" />
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.66 1.45 5.174L2 22l4.981-1.411A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.603 0-3.097-.478-4.354-1.3l-.312-.206-2.954.836.837-2.883-.204-.326A8.136 8.136 0 013.833 12c0-4.502 3.665-8.167 8.167-8.167 4.502 0 8.167 3.665 8.167 8.167z" />
        </svg>

        <span className="hidden xs:inline">¿Dudas? Chateá con nosotros</span>
        <span className="xs:hidden font-bold">Consultar</span>
      </a>
    </aside>
  );
}
