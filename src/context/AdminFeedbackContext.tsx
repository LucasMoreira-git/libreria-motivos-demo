'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X,
} from 'lucide-react';

export type TipoNotificacion = 'exito' | 'advertencia' | 'error' | 'info';

export interface NotificacionItem {
  id: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje?: string;
}

export interface OpcionesConfirmacion {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  variante?: 'peligro' | 'advertencia' | 'info';
}

interface EstadoConfirmacion extends OpcionesConfirmacion {
  resolver: (confirmado: boolean) => void;
}

interface AdminFeedbackContextValue {
  notificar: (opciones: Omit<NotificacionItem, 'id'>) => void;
  confirmar: (opciones: OpcionesConfirmacion) => Promise<boolean>;
}

const AdminFeedbackContext = createContext<AdminFeedbackContextValue | undefined>(undefined);

export function AdminFeedbackProvider({ children }: { children: React.ReactNode }) {
  const [notificaciones, setNotificaciones] = useState<NotificacionItem[]>([]);
  const [dialogoConfirmacion, setDialogoConfirmacion] = useState<EstadoConfirmacion | null>(null);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  const quitarNotificacion = useCallback((id: string) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notificar = useCallback(
    ({ tipo, titulo, mensaje }: Omit<NotificacionItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setNotificaciones((prev) => [...prev.slice(-3), { id, tipo, titulo, mensaje }]);
      setTimeout(() => {
        setNotificaciones((prev) => prev.filter((n) => n.id !== id));
      }, 4000);
    },
    []
  );

  const confirmar = useCallback((opciones: OpcionesConfirmacion): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogoConfirmacion({
        ...opciones,
        resolver: resolve,
      });
    });
  }, []);

  const cerrarConfirmacion = (resultado: boolean) => {
    if (dialogoConfirmacion) {
      dialogoConfirmacion.resolver(resultado);
      setDialogoConfirmacion(null);
    }
  };

  // Cerrar diálogo con Escape
  useEffect(() => {
    if (!dialogoConfirmacion) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrarConfirmacion(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dialogoConfirmacion]);

  const estilosToast = (tipo: TipoNotificacion) => {
    switch (tipo) {
      case 'exito':
        return {
          caja: 'bg-white border-emerald-200 shadow-lg shadow-emerald-950/5',
          iconoBg: 'bg-emerald-50 text-emerald-600',
          barra: 'bg-emerald-500',
          Icono: CheckCircle2,
        };
      case 'advertencia':
        return {
          caja: 'bg-white border-amber-200 shadow-lg shadow-amber-950/5',
          iconoBg: 'bg-amber-50 text-amber-600',
          barra: 'bg-amber-500',
          Icono: AlertTriangle,
        };
      case 'error':
        return {
          caja: 'bg-white border-rose-200 shadow-lg shadow-rose-950/5',
          iconoBg: 'bg-rose-50 text-rose-600',
          barra: 'bg-rose-500',
          Icono: XCircle,
        };
      default:
        return {
          caja: 'bg-white border-purple-200 shadow-lg shadow-purple-950/5',
          iconoBg: 'bg-purple-50 text-purple-700',
          barra: 'bg-purple-500',
          Icono: Info,
        };
    }
  };

  return (
    <AdminFeedbackContext.Provider value={{ notificar, confirmar }}>
      {children}

      {montado &&
        createPortal(
          <>
            {/* Contenedor de Notificaciones Animadas (Toast Stack) */}
            <div
              aria-live="polite"
              className="fixed top-4 right-4 z-[120] flex flex-col gap-2.5 w-[calc(100vw-2rem)] max-w-sm pointer-events-none"
            >
              {notificaciones.map((n) => {
                const estilo = estilosToast(n.tipo);
                const Icono = estilo.Icono;
                return (
                  <div
                    key={n.id}
                    className={`pointer-events-auto relative overflow-hidden rounded-2xl border p-3.5 pr-9 flex items-start gap-3 animate-in slide-in-from-right-8 fade-in duration-200 ${estilo.caja}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${estilo.iconoBg}`}
                    >
                      <Icono className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="font-heading text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {n.titulo}
                      </p>
                      {n.mensaje && (
                        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {n.mensaje}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => quitarNotificacion(n.id)}
                      aria-label="Cerrar notificación"
                      className="absolute top-2.5 right-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {/* Barra de progreso visual */}
                    <div
                      className={`absolute bottom-0 left-0 h-1 ${estilo.barra} toast-progress-bar`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Modal de Confirmación Animado (Reemplaza window.confirm) */}
            {dialogoConfirmacion && (
              <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-xs animate-in fade-in duration-150"
                onClick={() => cerrarConfirmacion(false)}
              >
                <div
                  className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        dialogoConfirmacion.variante === 'peligro'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200/80'
                          : dialogoConfirmacion.variante === 'advertencia'
                            ? 'bg-amber-50 text-amber-600 border border-amber-200/80'
                            : 'bg-purple-50 text-purple-700 border border-purple-200/80'
                      }`}
                    >
                      {dialogoConfirmacion.variante === 'info' ? (
                        <Info className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading text-base font-bold text-slate-900 leading-snug">
                        {dialogoConfirmacion.titulo}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                        {dialogoConfirmacion.mensaje}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => cerrarConfirmacion(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer min-h-[42px]"
                    >
                      {dialogoConfirmacion.textoCancelar || 'Cancelar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => cerrarConfirmacion(true)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-sm active:scale-95 transition-all cursor-pointer min-h-[42px] ${
                        dialogoConfirmacion.variante === 'peligro'
                          ? 'bg-rose-600 hover:bg-rose-700'
                          : dialogoConfirmacion.variante === 'advertencia'
                            ? 'bg-amber-600 hover:bg-amber-700'
                            : 'bg-[#d97786] hover:bg-[#c46372]'
                      }`}
                    >
                      {dialogoConfirmacion.textoConfirmar || 'Confirmar'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>,
          document.body
        )}
    </AdminFeedbackContext.Provider>
  );
}

export function useAdminFeedback(): AdminFeedbackContextValue {
  const ctx = useContext(AdminFeedbackContext);
  if (!ctx) {
    throw new Error('useAdminFeedback debe usarse dentro de AdminFeedbackProvider');
  }
  return ctx;
}
