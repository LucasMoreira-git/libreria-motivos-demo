'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Store, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  KeyRound
} from 'lucide-react';

interface AdminLoginFormProps {
  onSuccess?: () => void;
}

export function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const { login } = useAdmin();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const res = await login(username, password);
      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setError(res.error || 'Credenciales no válidas.');
      }
    } catch {
      setError('Error al conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-[#fef5f6] via-[#fbf0f2] to-[#ede4f6] text-slate-800 font-sans selection:bg-[#fbecee] selection:text-[#6e2e38]">
      
      {/* Fondo decorativo con halos sutiles en tonos rosados y lilas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#f4d0d6]/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#ded0f2]/40 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Card Principal */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#f2d3d8] shadow-xl shadow-purple-900/5">
          
          {/* Header del Card */}
          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#fef5f6] text-[#6e2e38] border border-[#f3cad2] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#d97786]" />
              <span>Acceso Administrativo</span>
            </div>

            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d97786] via-[#b978b5] to-[#7e4f9e] text-white flex items-center justify-center font-heading font-black text-2xl shadow-md border border-white/40">
              M
            </div>

            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-black text-purple-950 tracking-tight">
                Librería Motivos
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Panel de control para catálogo, promociones y horarios
              </p>
            </div>
          </div>

          {/* Alerta de Error */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-[#fef5f6] border border-[#f4d0d6] text-[#6e2e38] text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#d97786] mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold">Error de Autenticación:</span>
                <p className="leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="username" 
                className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
              >
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#d97786] focus:ring-2 focus:ring-[#d97786]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#d97786] focus:ring-2 focus:ring-[#d97786]/20 transition-all"
                />
              </div>
            </div>

            {/* Ayuda de credenciales para demostración */}
            <div className="p-2.5 rounded-xl bg-[#ede4f6]/60 border border-[#ded0f2] text-[11px] text-purple-950 flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-purple-700 shrink-0" />
              <span>
                Clave predeterminada: <strong>motivosAdmin2026!</strong>
              </span>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#d97786] hover:bg-[#c46372] active:scale-98 text-white font-bold text-sm shadow-md shadow-[#d97786]/20 transition-all disabled:opacity-60 cursor-pointer min-h-[46px]"
            >
              {cargando ? (
                <span>Verificando credenciales...</span>
              ) : (
                <>
                  <span>Ingresar al Panel de Administración</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Enlace hacia la Vitrina Web */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-purple-950 font-bold transition-colors"
            >
              <Store className="w-4 h-4 text-[#d97786]" />
              <span>Volver a la Vitrina Web</span>
            </Link>

            <span className="text-slate-400 font-medium">Guaymallén, Mendoza</span>
          </div>

        </div>

        {/* Footer pequeño */}
        <p className="text-center text-[11px] text-slate-400 mt-4 font-medium">
          Librería Motivos • Sistema de Gestión y Administración
        </p>

      </div>
    </div>
  );
}
