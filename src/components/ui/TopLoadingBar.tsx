'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * TopLoadingBar: Barra superior minimalista con los colores de marca que responde
 * instantáneamente al hacer clic en cualquier enlace interno de la aplicación
 * y se completa suavemente cuando la nueva ruta termina de cargar.
 */
export function TopLoadingBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progreso, setProgreso] = useState(0);

  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutOcultarRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutSeguridadRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cargandoRef = useRef(false);

  const limpiarTimers = () => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
    if (timeoutOcultarRef.current) {
      clearTimeout(timeoutOcultarRef.current);
      timeoutOcultarRef.current = null;
    }
    if (timeoutSeguridadRef.current) {
      clearTimeout(timeoutSeguridadRef.current);
      timeoutSeguridadRef.current = null;
    }
  };

  const finalizarBarra = () => {
    limpiarTimers();
    if (!cargandoRef.current) return;
    cargandoRef.current = false;
    setProgreso(100);
    timeoutOcultarRef.current = setTimeout(() => {
      setVisible(false);
      setProgreso(0);
    }, 240);
  };

  const iniciarBarra = () => {
    limpiarTimers();
    cargandoRef.current = true;
    setVisible(true);
    setProgreso(22);

    intervaloRef.current = setInterval(() => {
      setProgreso((prev) => {
        if (prev >= 88) return prev;
        const paso = prev < 55 ? 10 : prev < 75 ? 5 : 2;
        return Math.min(88, prev + paso);
      });
    }, 180);

    // Seguro anti-bloqueo por si una navegación es cancelada
    timeoutSeguridadRef.current = setTimeout(() => {
      finalizarBarra();
    }, 8000);
  };

  // Completar la barra en cuanto cambia efectivamente la ruta
  useEffect(() => {
    finalizarBarra();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Escuchar clics en enlaces internos (Next.js <Link>)
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const hrefAttr = anchor.getAttribute('href') || '';
      if (
        !hrefAttr ||
        hrefAttr.startsWith('#') ||
        hrefAttr.startsWith('mailto:') ||
        hrefAttr.startsWith('tel:') ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download')
      ) {
        return;
      }

      try {
        const destino = new URL(anchor.href, window.location.origin);
        if (destino.origin !== window.location.origin) return;
        if (destino.pathname === window.location.pathname && destino.search === window.location.search) {
          return;
        }
        iniciarBarra();
      } catch {
        // Ignorar URLs inválidas
      }
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
      limpiarTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Cargando sección"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progreso}
      className="fixed top-0 left-0 right-0 z-[120] h-[3px] bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-[#d97786] via-[#a779cf] to-[#d97786] transition-all duration-200 ease-out shadow-[0_0_10px_rgba(217,119,134,0.65)]"
        style={{ width: `${progreso}%` }}
      />
    </div>
  );
}
