'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { 
  Database, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export function AdminSimulationToolbar() {
  // Bandera de entorno: en producción se apaga configurando NEXT_PUBLIC_ENABLE_DEV_TOOLS=false
  // Si la variable no está explícitamente en 'false', se habilita para modo demostración.
  const isDevToolsEnabled = process.env.NEXT_PUBLIC_ENABLE_DEV_TOOLS !== 'false';

  const { backendEnLinea, sincronizarConBackend } = useAdmin();
  const [ejecutando, setEjecutando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error' | 'info'; texto: string } | null>(null);

  if (!isDevToolsEnabled) {
    return null;
  }

  const handlePrecargarEnBD = async () => {
    setEjecutando(true);
    setMensaje(null);

    try {
      const res = await fetch('http://localhost:8080/api/admin/simulacion/ejecutar?forzar=true', {
        method: 'POST',
        headers: {
          'X-Admin-Password': 'motivosAdministrador2026!'
        }
      });

      if (res.ok) {
        const data = await res.json();
        await sincronizarConBackend();
        setMensaje({
          tipo: 'exito',
          texto: `✓ Base de datos precargada con éxito: ${data.totalProductos || 10} productos, ${data.totalCategorias || 5} categorías, ${data.totalPromociones || 2} promociones y ${data.totalHorarios || 4} turnos.`
        });
      } else {
        setMensaje({
          tipo: 'error',
          texto: 'El servidor backend respondió con un error. Verifique que Spring Boot y MySQL estén iniciados.'
        });
      }
    } catch {
      setMensaje({
        tipo: 'info',
        texto: 'Spring Boot no está iniciado en el puerto 8080. El panel continúa operando normalmente en modo local de contingencia.'
      });
    } finally {
      setEjecutando(false);
      setTimeout(() => setMensaje(null), 6000);
    }
  };

  const handleSincronizar = async () => {
    setEjecutando(true);
    try {
      await sincronizarConBackend();
      setMensaje({
        tipo: 'exito',
        texto: '✓ Datos sincronizados con el backend.'
      });
    } catch {
      setMensaje({
        tipo: 'info',
        texto: 'Modo local activo. No se detectó servidor Spring Boot en puerto 8080.'
      });
    } finally {
      setEjecutando(false);
      setTimeout(() => setMensaje(null), 4000);
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-[#ded0f2] p-4 sm:p-5 shadow-xs space-y-3 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Identificador de herramienta */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#ede4f6] text-purple-950 border border-[#ded0f2]">
              <Sparkles className="w-3 h-3 text-[#d97786]" />
              Herramienta de Simulación & Sincronización
            </span>

            {/* Badge de estado del backend */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              backendEnLinea 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${backendEnLinea ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{backendEnLinea ? 'Backend Spring Boot Conectado' : 'Modo Demostración Local'}</span>
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Control de datos para la presentación al cliente. Desactivable en producción sin efectos colaterales.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={ejecutando}
            onClick={handleSincronizar}
            title="Consultar datos más recientes"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${ejecutando ? 'animate-spin' : ''}`} />
            <span>Sincronizar</span>
          </button>

          <button
            type="button"
            disabled={ejecutando}
            onClick={handlePrecargarEnBD}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#d97786] hover:bg-[#c46372] active:scale-95 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{ejecutando ? 'Procesando...' : 'Precargar Catálogo Inicial en BD'}</span>
          </button>
        </div>
      </div>

      {/* Banner de feedback temporal */}
      {mensaje && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1 ${
          mensaje.tipo === 'exito'
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            : mensaje.tipo === 'error'
            ? 'bg-rose-50 text-rose-900 border border-rose-200'
            : 'bg-amber-50 text-amber-900 border border-amber-200'
        }`}>
          {mensaje.tipo === 'exito' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {mensaje.tipo === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
          {mensaje.tipo === 'info' && <Server className="w-4 h-4 text-amber-600 shrink-0" />}
          <span className="font-medium leading-relaxed">{mensaje.texto}</span>
        </div>
      )}
    </div>
  );
}
