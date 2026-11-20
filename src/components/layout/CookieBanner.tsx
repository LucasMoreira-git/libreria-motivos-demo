'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cookie } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'motivos_cookie_consent';

export function CookieBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const decision = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!decision) {
        setVisible(true);
      }
    } catch {
      setVisible(false);
    }
  }, []);

  // No mostrar en el panel de administración ni si ya decidió
  if (!visible || pathname?.startsWith('/admin')) {
    return null;
  }

  const responder = (eleccion: 'accepted' | 'rejected') => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, eleccion);
    } catch {
      // Ignorar si el navegador bloquea storage
    }
    setVisible(false);
  };

  return (
    <aside
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-40 bg-white/95 backdrop-blur-md border border-[#ded0f2] shadow-lg shadow-purple-950/10 rounded-2xl p-4 animate-fade-in"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#fef5f6] border border-[#f2d3d8] text-[#d97786] flex items-center justify-center shrink-0 mt-0.5">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="space-y-2.5 flex-1">
          <p className="text-xs text-slate-600 leading-relaxed">
            Usamos cookies básicas para que el catálogo funcione bien y recordar tu lista de
            consulta.{' '}
            <Link
              href="/privacidad"
              className="font-bold text-purple-900 underline hover:text-[#d97786] transition-colors"
            >
              Ver privacidad
            </Link>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => responder('rejected')}
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
            >
              Rechazar
            </button>
            <button
              type="button"
              onClick={() => responder('accepted')}
              className="flex-1 px-3 py-1.5 rounded-xl bg-[#d97786] hover:bg-[#c46372] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
