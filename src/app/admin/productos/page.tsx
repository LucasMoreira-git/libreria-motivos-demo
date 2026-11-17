'use client';

import React, { useState, useRef } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  RotateCcw, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  Upload, 
  Image as ImageIcon,
  Eye, 
  Sparkles, 
  Clock, 
  Percent, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { ProductoAdmin } from '@/types/admin';
import { DATOS_LIBRERIA_MOTIVOS } from '@/lib/mock-data';

const BADGES_DISPONIBLES = [
  { valor: '', etiqueta: 'Sin Badge Superpuesto' },
  { valor: 'MÁS VENDIDO', etiqueta: '🔥 MÁS VENDIDO (Top ventas)' },
  { valor: 'OFERTA ESPECIAL', etiqueta: '🏷️ OFERTA ESPECIAL' },
  { valor: 'NUEVO INGRESO', etiqueta: '✨ NUEVO INGRESO' },
  { valor: 'NOVEDAD', etiqueta: '🆕 NOVEDAD' },
  { valor: 'ÚLTIMAS UNIDADES', etiqueta: '⚠️ ÚLTIMAS UNIDADES' },
  { valor: 'ESCOLAR 2026', etiqueta: '🎒 ESCOLAR 2026' },
  { valor: 'DIBUJO TÉCNICO', etiqueta: '📐 DIBUJO TÉCNICO' },
  { valor: 'LÍNEA PREMIUM', etiqueta: '👑 LÍNEA PREMIUM' },
  { valor: 'EDICIÓN LIMITADA', etiqueta: '⭐ EDICIÓN LIMITADA' },
  { valor: 'IMPERDIBLE', etiqueta: '💥 IMPERDIBLE' },
  { valor: 'RECOMENDADO', etiqueta: '👍 RECOMENDADO' },
  { valor: 'PRECIO AMIGO', etiqueta: '🤝 PRECIO AMIGO' },
  { valor: 'COMBO AHORRO', etiqueta: '📦 COMBO AHORRO' },
];

function aFormatoInputDateTime(isoString?: string | null): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  } catch {
    return '';
  }
}

function obtenerEstiloBadge(textoBadge: string): string {
  const t = textoBadge.toUpperCase();
  if (t.includes('OFERTA') || t.includes('DESCUENTO')) return 'bg-[#d97786] text-white';
  if (t.includes('VENDIDO') || t.includes('TOP')) return 'bg-amber-500 text-slate-950 font-black';
  if (t.includes('NOVEDAD') || t.includes('NUEVO')) return 'bg-blue-600 text-white';
  if (t.includes('STOCK') || t.includes('UNIDADES') || t.includes('LIMITAD')) return 'bg-orange-600 text-white';
  if (t.includes('ESCOLAR')) return 'bg-indigo-600 text-white';
  if (t.includes('PREMIUM') || t.includes('EDICIÓN') || t.includes('EDICION')) return 'bg-slate-900 text-amber-300 border border-amber-300/40';
  if (t.includes('TÉCNICO') || t.includes('TECNICO')) return 'bg-cyan-700 text-white';
  if (t.includes('AMIGO') || t.includes('AHORRO') || t.includes('IMPERDIBLE')) return 'bg-emerald-600 text-white';
  return 'bg-slate-900/90 text-white';
}

export default function ABMProductosPage() {
  const { productos, categorias, crearProducto, editarProducto, bajaLogicaProducto, reactivarProducto } = useAdmin();

  // Estados de filtrado
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [estadoFiltro, setEstadoFiltro] = useState<'todos' | 'activos' | 'bajas'>('todos');

  // Estados del Formulario (Alta / Modificación)
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState<string | null>(null);

  // Campos del formulario
  const [nombreProducto, setNombreProducto] = useState('');
  const [detalleProducto, setDetalleProducto] = useState('');
  const [precioProducto, setPrecioProducto] = useState<number | ''>('');
  const [categoriaId, setCategoriaId] = useState('');
  const [fotoProducto, setFotoProducto] = useState('');
  const [mostrarUrlExterna, setMostrarUrlExterna] = useState(false);

  // 4 Opciones Visuales de Vitrina
  const [destacadoProducto, setDestacadoProducto] = useState(false);
  const [enOfertaProducto, setEnOfertaProducto] = useState(false);
  const [ultimasUnidadesProducto, setUltimasUnidadesProducto] = useState(false);
  const [nuevoIngresoProducto, setNuevoIngresoProducto] = useState(false);

  // Badges superpuestos
  const [badgeProducto, setBadgeProducto] = useState<string>('');

  // Sección Descuentos Programados
  const [tieneDescuento, setTieneDescuento] = useState(false);
  const [precioDescuentoProducto, setPrecioDescuentoProducto] = useState<number | ''>('');
  const [fechaFinDescuento, setFechaFinDescuento] = useState('');

  // Referencia para upload de archivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mensaje de feedback
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  const mostrarExito = (msg: string) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setProductoSeleccionadoId(null);
    setNombreProducto('');
    setDetalleProducto('');
    setPrecioProducto(''); // Casilla vacía por defecto sin el molesto 0 inicial
    setCategoriaId(categorias[0]?.idCategoria || '1');
    setFotoProducto('');
    setMostrarUrlExterna(false);
    setDestacadoProducto(false);
    setEnOfertaProducto(false);
    setUltimasUnidadesProducto(false);
    setNuevoIngresoProducto(false);
    setBadgeProducto('');
    setTieneDescuento(false);
    setPrecioDescuentoProducto('');
    setFechaFinDescuento('');
    setErrorValidacion(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (prod: ProductoAdmin) => {
    setModoEdicion(true);
    setProductoSeleccionadoId(prod.idProducto);
    setNombreProducto(prod.nombreProducto);
    setDetalleProducto(prod.detalleProducto);
    setPrecioProducto(prod.precioProducto || '');
    setCategoriaId(prod.categoriaId);
    setFotoProducto(prod.fotoProducto || '');
    setMostrarUrlExterna(prod.fotoProducto?.startsWith('http') && !prod.fotoProducto?.startsWith('data:image'));
    setDestacadoProducto(!!prod.destacadoProducto);
    setEnOfertaProducto(!!prod.enOfertaProducto);
    setUltimasUnidadesProducto(!!prod.ultimasUnidadesProducto);
    setNuevoIngresoProducto(!!prod.nuevoIngresoProducto);
    setBadgeProducto(prod.badgeProducto || '');

    const tieneDescVig = Boolean(prod.precioDescuentoProducto && prod.precioDescuentoProducto > 0);
    setTieneDescuento(tieneDescVig);
    setPrecioDescuentoProducto(tieneDescVig && prod.precioDescuentoProducto ? prod.precioDescuentoProducto : '');
    setFechaFinDescuento(aFormatoInputDateTime(prod.fechaFinDescuento));
    setErrorValidacion(null);
    setModalAbierto(true);
  };

  // Manejo de carga de foto real con compresión automática en cliente
  const handleCargarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorValidacion('Por favor seleccioná un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawData = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setFotoProducto(compressed);
        } else {
          setFotoProducto(rawData);
        }
        setErrorValidacion(null);
      };
      img.src = rawData;
    };
    reader.readAsDataURL(file);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    if (!nombreProducto.trim()) {
      setErrorValidacion('El nombre del producto es obligatorio.');
      return;
    }

    if (precioProducto === '' || Number(precioProducto) <= 0) {
      setErrorValidacion('El precio del producto es obligatorio y no puede ser $0.');
      return;
    }

    if (tieneDescuento) {
      if (precioDescuentoProducto === '' || Number(precioDescuentoProducto) <= 0) {
        setErrorValidacion('Si activás el descuento, ingresá un precio rebajado mayor a $0.');
        return;
      }
      if (Number(precioDescuentoProducto) >= Number(precioProducto)) {
        setErrorValidacion('El precio con descuento debe ser menor al precio original.');
        return;
      }
      if (!fechaFinDescuento) {
        setErrorValidacion('Ingresá hasta qué fecha y hora estará disponible el descuento.');
        return;
      }
    }

    const fotoFinal = fotoProducto.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80';
    const precioNumerico = Number(precioProducto);
    const precioDescNumerico = tieneDescuento && precioDescuentoProducto !== '' ? Number(precioDescuentoProducto) : null;
    const fechaFinIso = tieneDescuento && fechaFinDescuento ? new Date(fechaFinDescuento).toISOString() : null;

    if (modoEdicion && productoSeleccionadoId) {
      const prodOriginal = productos.find((p) => p.idProducto === productoSeleccionadoId);
      editarProducto({
        idProducto: productoSeleccionadoId,
        nombreProducto: nombreProducto.trim(),
        detalleProducto: detalleProducto.trim(),
        precioProducto: precioNumerico,
        precioDescuentoProducto: precioDescNumerico,
        fechaFinDescuento: fechaFinIso,
        fotoProducto: fotoFinal,
        categoriaId,
        destacadoProducto,
        enOfertaProducto: tieneDescuento ? true : enOfertaProducto,
        ultimasUnidadesProducto,
        nuevoIngresoProducto,
        badgeProducto: badgeProducto.trim() || null,
        fechaHoraBajaProducto: prodOriginal?.fechaHoraBajaProducto || null,
      });
      mostrarExito('¡Producto actualizado correctamente con sus opciones de vitrina!');
    } else {
      crearProducto({
        nombreProducto: nombreProducto.trim(),
        detalleProducto: detalleProducto.trim(),
        precioProducto: precioNumerico,
        precioDescuentoProducto: precioDescNumerico,
        fechaFinDescuento: fechaFinIso,
        fotoProducto: fotoFinal,
        categoriaId,
        destacadoProducto,
        enOfertaProducto: tieneDescuento ? true : enOfertaProducto,
        ultimasUnidadesProducto,
        nuevoIngresoProducto,
        badgeProducto: badgeProducto.trim() || null,
      });
      mostrarExito('¡Nuevo producto registrado exitosamente!');
    }

    setModalAbierto(false);
  };

  // Cálculos para la vista previa en vivo
  const categoriaSeleccionadaObj = categorias.find((c) => c.idCategoria === categoriaId);
  const nombreCategoriaPreview = categoriaSeleccionadaObj ? categoriaSeleccionadaObj.nombreCategoria : 'Categoría';
  const precioOriginalNum = precioProducto === '' ? 0 : Number(precioProducto);
  const precioDescNum = precioDescuentoProducto === '' ? 0 : Number(precioDescuentoProducto);
  
  // Descuento en tiempo real para la preview
  const ahoraMs = Date.now();
  const fechaFinDescMs = fechaFinDescuento ? new Date(fechaFinDescuento).getTime() : 0;
  const descuentoActivoEnPreview = Boolean(
    tieneDescuento &&
    precioDescNum > 0 &&
    precioDescNum < precioOriginalNum &&
    (!fechaFinDescuento || fechaFinDescMs > ahoraMs)
  );
  const porcentajeOffPreview = descuentoActivoEnPreview && precioOriginalNum > 0
    ? Math.round(((precioOriginalNum - precioDescNum) / precioOriginalNum) * 100)
    : null;

  // Filtrado de la tabla DataGrid
  const productosFiltrados = productos.filter((p) => {
    if (estadoFiltro === 'activos' && p.fechaHoraBajaProducto) return false;
    if (estadoFiltro === 'bajas' && !p.fechaHoraBajaProducto) return false;
    if (categoriaFiltro !== 'todas' && p.categoriaId !== categoriaFiltro) return false;

    const q = busqueda.toLowerCase().trim();
    if (!q) return true;
    return (
      p.nombreProducto.toLowerCase().includes(q) ||
      p.detalleProducto.toLowerCase().includes(q) ||
      (p.categoriaNombre && p.categoriaNombre.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Encabezado del Módulo y Botón de Alta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-900" />
            <span>ABM Productos</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
              {productosFiltrados.length} registros
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mapeo de atributos: <code className="font-mono text-blue-900 font-semibold">precioProducto</code>, <code className="font-mono text-blue-900 font-semibold">precioDescuentoProducto</code>, opciones visuales, fotos reales y bajas lógicas.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirModalCrear}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 touch-manipulation cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Banner de Feedback */}
      {mensajeExito && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* 2. Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Input Buscador */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, detalle o categoría..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-900 transition-all"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filtros Combinados */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de Categoría */}
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-blue-900"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.idCategoria} value={cat.idCategoria}>
                {cat.nombreCategoria}
              </option>
            ))}
          </select>

          {/* Selector de Estado (Bajas Lógicas) */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs">
            <button
              type="button"
              onClick={() => setEstadoFiltro('todos')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                estadoFiltro === 'todos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setEstadoFiltro('activos')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                estadoFiltro === 'activos' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Activos
            </button>
            <button
              type="button"
              onClick={() => setEstadoFiltro('bajas')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                estadoFiltro === 'bajas' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Bajas
            </button>
          </div>
        </div>
      </div>

      {/* 3. Tabla DataGrid de Productos */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/90 text-slate-500 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Artículo</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Precio (ARS)</th>
                <th className="py-3 px-4">Opciones Vitrina & Badges</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((prod) => {
                  const estaDadoDeBaja = !!prod.fechaHoraBajaProducto;
                  const tieneDescVigente = Boolean(
                    prod.precioDescuentoProducto &&
                    prod.precioDescuentoProducto > 0 &&
                    prod.fechaFinDescuento &&
                    new Date(prod.fechaFinDescuento).getTime() > Date.now()
                  );

                  return (
                    <tr 
                      key={prod.idProducto}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        estaDadoDeBaja ? 'bg-rose-50/20 text-slate-500' : 'text-slate-800'
                      }`}
                    >
                      {/* Artículo con Foto */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.fotoProducto || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80'}
                            alt={prod.nombreProducto}
                            className={`w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 ${
                              estaDadoDeBaja ? 'grayscale opacity-60' : ''
                            }`}
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-heading font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {prod.nombreProducto}
                            </p>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {prod.detalleProducto}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                          {prod.categoriaNombre || prod.categoriaId}
                        </span>
                      </td>

                      {/* Precio con Descuento si está vigente */}
                      <td className="py-3 px-4">
                        {tieneDescVigente && prod.precioDescuentoProducto ? (
                          <div className="space-y-0.5">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-mono font-black text-rose-700 text-sm">
                                $ {prod.precioDescuentoProducto.toLocaleString('es-AR')}
                              </span>
                              <span className="text-[10px] text-slate-400 line-through font-mono">
                                ${prod.precioProducto.toLocaleString('es-AR')}
                              </span>
                            </div>
                            <span className="inline-block text-[10px] font-bold text-rose-600 bg-rose-50 px-1 py-0.2 rounded border border-rose-200">
                              Rebaja por tiempo limitado
                            </span>
                          </div>
                        ) : (
                          <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                            $ {prod.precioProducto.toLocaleString('es-AR')}
                          </span>
                        )}
                      </td>

                      {/* Opciones Vitrina & Badges */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {prod.badgeProducto && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${obtenerEstiloBadge(prod.badgeProducto)}`}>
                              {prod.badgeProducto}
                            </span>
                          )}
                          {prod.destacadoProducto && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              ⭐ Destacado
                            </span>
                          )}
                          {prod.ultimasUnidadesProducto && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-200">
                              ⚠️ Stock Crítico
                            </span>
                          )}
                          {prod.nuevoIngresoProducto && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                              ✨ Nuevo Ingreso
                            </span>
                          )}
                          {!prod.badgeProducto && !prod.destacadoProducto && !prod.ultimasUnidadesProducto && !prod.nuevoIngresoProducto && (
                            <span className="text-slate-400 text-xs">Estándar</span>
                          )}
                        </div>
                      </td>

                      {/* Estado con Marca Temporal de Baja Lógica */}
                      <td className="py-3 px-4">
                        {estaDadoDeBaja ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              Baja Lógica
                            </span>
                            <p className="text-[10px] font-mono text-slate-500">
                              {prod.fechaHoraBajaProducto}
                            </p>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Activo
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => abrirModalEditar(prod)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Editar producto"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {estaDadoDeBaja ? (
                            <button
                              type="button"
                              onClick={() => {
                                reactivarProducto(prod.idProducto);
                                mostrarExito(`¡Producto "${prod.nombreProducto}" reactivado exitosamente!`);
                              }}
                              className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                              title="Reactivar producto (quitar baja lógica)"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`¿Dar de baja lógica al producto "${prod.nombreProducto}"? No se destruirá de la base de datos.`)) {
                                  bajaLogicaProducto(prod.idProducto);
                                  mostrarExito(`Producto "${prod.nombreProducto}" marcado con baja lógica.`);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Dar de baja lógica"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No se encontraron productos que coincidan con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal de Formulario con Vista Previa en Tiempo Real */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* Cabecera del Formulario */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-900" />
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {modoEdicion ? 'Modificar Producto' : 'Alta de Nuevo Producto'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error de validación si existe */}
            {errorValidacion && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorValidacion}</span>
              </div>
            )}

            {/* Layout Grid 2 Columnas: Formulario + Vista Previa en Vitrina */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              
              {/* Columna Izquierda: Formulario (7/12) */}
              <form onSubmit={handleGuardar} id="form-producto" className="lg:col-span-7 p-6 space-y-4 text-xs sm:text-sm">
                
                {/* Nombre */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nombre del Producto (nombreProducto) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nombreProducto}
                    onChange={(e) => setNombreProducto(e.target.value)}
                    placeholder="Ej: Repuesto Escolar Rivadavia N°3 x 480 Hojas"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-900 focus:bg-white transition-all font-medium"
                  />
                </div>

                {/* Detalle */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Detalle / Descripción (detalleProducto) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={detalleProducto}
                    onChange={(e) => setDetalleProducto(e.target.value)}
                    placeholder="Ej: Hojas rayadas reforzadas para carpeta escolar..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-900 focus:bg-white transition-all font-medium"
                  />
                </div>

                {/* Precio y Categoría */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Precio en ARS (precioProducto) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">$</span>
                      <input
                        type="number"
                        required
                        min={1}
                        step={100}
                        value={precioProducto}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPrecioProducto(val === '' ? '' : Number(val));
                        }}
                        placeholder="Ej: 5600"
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono font-bold focus:outline-hidden focus:border-blue-900 focus:bg-white transition-all"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">No puede quedar en $0.</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Categoría (categoriaId) *
                    </label>
                    <select
                      value={categoriaId}
                      onChange={(e) => setCategoriaId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-hidden focus:border-blue-900 focus:bg-white transition-all"
                    >
                      {categorias.map((c) => (
                        <option key={c.idCategoria} value={c.idCategoria}>
                          {c.nombreCategoria}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subida de Imagen Real (Foto desde Cámara / Archivo) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-blue-900" />
                      <span>Foto Real del Producto (Subir Archivo / Cámara)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setMostrarUrlExterna(!mostrarUrlExterna)}
                      className="text-[11px] text-blue-900 hover:underline font-semibold cursor-pointer"
                    >
                      {mostrarUrlExterna ? 'Usar archivo de foto' : 'O usar enlace externo'}
                    </button>
                  </div>

                  {!mostrarUrlExterna ? (
                    <div>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*"
                        onChange={handleCargarFoto}
                        className="hidden"
                      />

                      {fotoProducto ? (
                        <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
                          <img 
                            src={fotoProducto} 
                            alt="Previsualización de foto real" 
                            className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">Foto cargada con éxito</p>
                            <p className="text-[11px] text-slate-500">Optimizada para carga veloz en la vitrina</p>
                            <div className="flex gap-2 mt-1.5">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-[11px] font-bold text-blue-900 hover:text-blue-800 cursor-pointer"
                              >
                                Cambiar foto
                              </button>
                              <span className="text-slate-300">•</span>
                              <button
                                type="button"
                                onClick={() => setFotoProducto('')}
                                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                              >
                                Quitar foto
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-200 hover:border-blue-900 bg-white hover:bg-blue-50/20 rounded-xl p-5 text-center cursor-pointer transition-all duration-200"
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mx-auto mb-2">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-slate-800">
                            Hacé clic para subir o sacar una foto real del producto
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Admite formatos JPG, PNG, WebP desde tu celular o computadora
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        value={fotoProducto}
                        onChange={(e) => setFotoProducto(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:border-blue-900 transition-all text-xs font-mono"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">Si se omite, se asignará una foto simulada por defecto.</p>
                    </div>
                  )}
                </div>

                {/* Sección de Descuentos Programados (Separada de Promociones) */}
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tieneDescuento}
                        onChange={(e) => setTieneDescuento(e.target.checked)}
                        className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Percent className="w-4 h-4 text-rose-600" />
                        <span>Aplicar Descuento Especial a este producto</span>
                      </span>
                    </label>
                    {tieneDescuento && porcentajeOffPreview !== null && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[11px] shadow-2xs">
                        {porcentajeOffPreview}% OFF
                      </span>
                    )}
                  </div>

                  {tieneDescuento && (
                    <div className="space-y-3 pt-2 border-t border-rose-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Precio con Descuento (ARS) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">$</span>
                            <input
                              type="number"
                              required={tieneDescuento}
                              min={1}
                              step={100}
                              value={precioDescuentoProducto}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPrecioDescuentoProducto(val === '' ? '' : Number(val));
                              }}
                              placeholder="Ej: 4200"
                              className="w-full pl-7 pr-3 py-2 rounded-xl border border-rose-200 bg-white text-slate-900 font-mono font-bold focus:outline-hidden focus:border-rose-600 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Válido hasta (Fecha y Hora) *
                          </label>
                          <input
                            type="datetime-local"
                            required={tieneDescuento}
                            value={fechaFinDescuento}
                            onChange={(e) => setFechaFinDescuento(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-white text-slate-900 focus:outline-hidden focus:border-rose-600 text-xs font-medium"
                          />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-rose-200/60 text-[11px] text-slate-600 leading-relaxed flex items-start gap-1.5">
                        <Clock className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>
                          <strong>Regla automática:</strong> Cumplida la fecha fijada, el descuento se dará de baja automáticamente sin intervención manual y la vitrina volverá a mostrar el precio original (${precioOriginalNum > 0 ? precioOriginalNum.toLocaleString('es-AR') : '...'}).
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4 Opciones Visuales de Vitrina */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <span className="font-bold text-slate-800 block text-xs flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-900" />
                    <span>4 Opciones Visuales en la Vitrina Web</span>
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/90 cursor-pointer text-xs hover:border-slate-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={destacadoProducto}
                        onChange={(e) => setDestacadoProducto(e.target.checked)}
                        className="rounded text-blue-900 focus:ring-blue-500 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">⭐ Producto Destacado</span>
                        <span className="text-[10px] text-slate-500">Prioridad alta en portada</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/90 cursor-pointer text-xs hover:border-slate-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={enOfertaProducto}
                        onChange={(e) => setEnOfertaProducto(e.target.checked)}
                        className="rounded text-blue-900 focus:ring-blue-500 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">🏷️ En Oferta Especial</span>
                        <span className="text-[10px] text-slate-500">Etiquetado promocional</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/90 cursor-pointer text-xs hover:border-slate-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={ultimasUnidadesProducto}
                        onChange={(e) => setUltimasUnidadesProducto(e.target.checked)}
                        className="rounded text-blue-900 focus:ring-blue-500 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">⚠️ Disponibilidad Limitada</span>
                        <span className="text-[10px] text-slate-500">Alerta de stock crítico</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/90 cursor-pointer text-xs hover:border-slate-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={nuevoIngresoProducto}
                        onChange={(e) => setNuevoIngresoProducto(e.target.checked)}
                        className="rounded text-blue-900 focus:ring-blue-500 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">✨ Nuevo Ingreso</span>
                        <span className="text-[10px] text-slate-500">Lanzamiento de temporada</span>
                      </div>
                    </label>
                  </div>

                  {/* Selector Extenso de Badges */}
                  <div className="pt-2 border-t border-slate-200/80">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Badge Superpuesto en Tarjeta
                    </label>
                    <select
                      value={badgeProducto}
                      onChange={(e) => setBadgeProducto(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-900"
                    >
                      {BADGES_DISPONIBLES.map((b) => (
                        <option key={b.valor} value={b.valor}>
                          {b.etiqueta}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </form>

              {/* Columna Derecha: Vista Previa en Vitrina Web en Tiempo Real (5/12) */}
              <div className="lg:col-span-5 p-6 bg-slate-50/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-heading font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-blue-900" />
                      <span>Vista Previa en Vitrina Web</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full animate-pulse">
                      ● En Vivo
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-4">
                    Así observarán los clientes de Guaymallén esta tarjeta en el catálogo público antes de que guardes los cambios:
                  </p>

                  {/* Tarjeta Simulación Vitrina Web */}
                  <div className="w-full max-w-xs mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden flex flex-col transition-all duration-200">
                    {/* Imagen de la tarjeta */}
                    <div className="relative w-full h-[200px] overflow-hidden bg-slate-100">
                      <img
                        src={fotoProducto || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80'}
                        alt={nombreProducto || 'Vista previa del producto'}
                        className="w-full h-full object-cover object-center select-none"
                      />

                      {/* Categoría Top Left */}
                      <span className="absolute top-2.5 left-2.5 z-10 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                        {nombreCategoriaPreview}
                      </span>

                      {/* Badges Top Right */}
                      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1">
                        {badgeProducto ? (
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md ${obtenerEstiloBadge(badgeProducto)}`}>
                            {badgeProducto}
                          </span>
                        ) : descuentoActivoEnPreview && porcentajeOffPreview ? (
                          <span className="bg-[#d97786] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
                            {porcentajeOffPreview}% OFF
                          </span>
                        ) : null}

                        {ultimasUnidadesProducto && (
                          <span className="bg-amber-600/90 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                            Últimas unid.
                          </span>
                        )}
                        {nuevoIngresoProducto && !badgeProducto && (
                          <span className="bg-indigo-600/90 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                            Nuevo ingreso
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          {nuevoIngresoProducto && (
                            <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-1 py-0.2 rounded">
                              ✨ Novedad
                            </span>
                          )}
                          {ultimasUnidadesProducto && (
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-1 py-0.2 rounded">
                              ⚠️ Stock limitado
                            </span>
                          )}
                        </div>

                        <h4 className="font-heading font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2">
                          {nombreProducto.trim() || 'Nombre del Producto'}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {detalleProducto.trim() || 'Descripción y especificaciones del producto para los clientes...'}
                        </p>
                      </div>

                      {/* Precios y Botón CTA */}
                      <div className="pt-2 border-t border-slate-100 mt-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-col">
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <span className="font-heading text-base font-black text-slate-900">
                                $ {descuentoActivoEnPreview && precioDescNum > 0
                                  ? precioDescNum.toLocaleString('es-AR')
                                  : (precioOriginalNum > 0 ? precioOriginalNum.toLocaleString('es-AR') : '0')}
                              </span>
                              {descuentoActivoEnPreview && precioOriginalNum > 0 && (
                                <span className="text-[10px] text-slate-400 line-through">
                                  ${precioOriginalNum.toLocaleString('es-AR')}
                                </span>
                              )}
                              {porcentajeOffPreview && (
                                <span className="text-[9px] font-black text-[#b34f60] bg-rose-50 px-1 py-0.2 rounded">
                                  -{porcentajeOffPreview}%
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-[#8b4f58]">
                              Precio contado/transf.
                            </span>
                          </div>

                          <div className="py-1.5 px-2.5 rounded-xl border border-[#eed0d5] bg-[#fbf0f2] text-[#6e2e38] font-bold text-[10px] shadow-2xs select-none">
                            <span>Consultar</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Resumen del estado de la vitrina */}
                <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estado de precio:</span>
                    <span className="font-bold text-slate-800">
                      {descuentoActivoEnPreview ? 'Con descuento promocional' : 'Precio regular'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Visibilidad:</span>
                    <span className="font-bold text-slate-800">
                      {destacadoProducto ? 'Destacado en Portada' : 'En Catálogo General'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer con Botones de Acción */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition-colors cursor-pointer text-xs sm:text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="form-producto"
                className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer text-xs sm:text-sm"
              >
                {modoEdicion ? 'Guardar Cambios' : 'Registrar Producto'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
