'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type AdminTheme = 'claro' | 'oscuro';

const STORAGE_KEY_ADMIN_THEME = 'motivos_admin_theme_v1';

interface AdminThemeContextValue {
  theme: AdminTheme;
  setTheme: (nuevoTema: AdminTheme, eventoOrigen?: React.MouseEvent<HTMLElement>) => void;
  cambiando: boolean;
}

const AdminThemeContext = createContext<AdminThemeContextValue | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>('claro');
  const [cambiando, setCambiando] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY_ADMIN_THEME);
      if (guardado === 'claro' || guardado === 'oscuro') {
        setThemeState(guardado);
      } else if (guardado) {
        localStorage.setItem(STORAGE_KEY_ADMIN_THEME, 'claro');
      }
    } catch {
      // Ignorar si storage no está disponible
    }
  }, []);

  const aplicarTema = (nuevoTema: AdminTheme) => {
    setThemeState(nuevoTema);
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_THEME, nuevoTema);
    } catch {
      // Ignorar
    }
  };

  const setTheme = (nuevoTema: AdminTheme, eventoOrigen?: React.MouseEvent<HTMLElement>) => {
    if (nuevoTema === theme) return;

    setCambiando(true);
    setTimeout(() => setCambiando(false), 450);

    // Animación circular suave con View Transitions API si el navegador la soporta
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (typeof window !== 'undefined' && typeof doc.startViewTransition === 'function') {
      const x = eventoOrigen?.clientX ?? window.innerWidth - 120;
      const y = eventoOrigen?.clientY ?? 36;
      const maxRadio = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = doc.startViewTransition(() => {
        aplicarTema(nuevoTema);
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadio}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 460,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        })
        .catch(() => {
          // Si falla la animación, el tema ya fue aplicado
        });
      return;
    }

    aplicarTema(nuevoTema);
  };

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme, cambiando }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) {
    throw new Error('useAdminTheme debe usarse dentro de AdminThemeProvider');
  }
  return ctx;
}
