'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import { 
  Lock, 
  User, 
  Store, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminLoginFormProps {
  onSuccess?: () => void;
}

export function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const { login } = useAdmin();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cargando) return;

    // Trampa silenciosa anti-bots (campo oculto que solo completan scripts automatizados)
    if (honeypot.trim() !== '') {
      setError('No pudimos validar tu solicitud. Intentá nuevamente.');
      return;
    }

    if (!username.trim() || !password.trim()) {
      setError('Ingresá tu usuario y contraseña para continuar.');
      return;
    }

    setError(null);
    setCargando(true);

    try {
      const res = await login(username.trim(), password);
      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setError(
          res.error ||
            'No pudimos validar tus credenciales. Revisá los datos e intentá nuevamente.'
        );
      }
    } catch {
      setError('No pudimos validar tus credenciales. Revisá los datos e intentá nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#fafafb] bg-gradient-to-b from-[#ffffff] via-[#fefcfd] to-[#faf8fc] text-slate-800 font-sans selection:bg-[#fbecee] selection:text-[#6e2e38] relative overflow-hidden">
      
      {/* Iluminación ambiental tenue detrás de la tarjeta (halo rosado/azulado muy suave) */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#f4d0d6]/20 via-[#ded0f2]/20 to-[#e0e7ff]/20 blur-3xl pointer-events-none" 
      />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Card Principal */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-purple-950/4">
          
          {/* Header del Card con espaciado armonioso y jerarquía visual trabajada */}
          <div className="text-center mb-6">
            
            {/* 1. Etiqueta «Acceso administrativo» */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#fef5f6] text-[#6e2e38] border border-[#f3cad2] shadow-2xs mb-4">
              <Sparkles className="w-3 h-3 text-[#d97786]" />
              <span>Acceso Administrativo</span>
            </div>

            {/* 2. Logo oficial con sombra discreta */}
            <div className="mx-auto w-24 h-24 rounded-full overflow-hidden shadow-md border-2 border-white ring-2 ring-[#f3cad2] bg-[#fdfbf7]">
              <img
                src="/images/logo-motivos.jpg"
                alt="Logo oficial de Librería Motivos"
                className="w-full h-full object-cover"
              />
            </div>

            {/* 3. Nombre de la librería con mayor respiro vertical */}
            <h1 className="font-heading text-xl sm:text-2xl font-black text-purple-950 tracking-tight leading-snug mt-3.5">
              Librería Motivos
            </h1>

            {/* 4. Subtítulo descriptivo y cercano */}
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed max-w-xs mx-auto">
              Gestioná el catálogo, las promociones y la información del local
            </p>
          </div>

          {/* Alerta de Error: solo visible tras intento fallido, con animación suave de entrada */}
          {error && (
            <div 
              role="alert"
              className="mb-5 p-3 rounded-2xl bg-[#fef5f6] border border-[#f4d0d6] text-[#6e2e38] text-xs flex items-start gap-2.5 animate-in fade-in zoom-in-95 duration-200"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-[#d97786] mt-0.5" />
              <p className="font-semibold leading-relaxed">{error}</p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo oculto trampa para bots (honeypot) */}
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="website">Sitio web</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

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
                  onChange={(e) => handleInputChange(setUsername, e.target.value)}
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
                  type={mostrarPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => handleInputChange(setPassword, e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#d97786] focus:ring-2 focus:ring-[#d97786]/20 transition-all"
                />
                
                {/* Botón para Mostrar / Ocultar Contraseña */}
                <button
                  type="button"
                  onClick={() => setMostrarPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden transition-colors cursor-pointer"
                  aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  title={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {mostrarPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#d97786] hover:bg-[#c46372] active:scale-98 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-60 cursor-pointer min-h-[46px]"
            >
              {cargando ? (
                <span>Validando credenciales...</span>
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
