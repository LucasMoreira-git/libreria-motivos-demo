'use client';

import React, { useState } from 'react';
import { 
  FolderTree, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  RotateCcw, 
  X, 
  CheckCircle2,
  AlertCircle,
  Eye,
  Hash,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { CategoriaAdmin } from '@/types/admin';
import { AppIcon, VisualIconPicker, CATEGORY_ICON_OPTIONS, getLucideIcon } from '@/lib/icon-registry';

export default function ABMCategoriasPage() {
  const { categorias, crearCategoria, editarCategoria, bajaLogicaCategoria, reactivarCategoria } = useAdmin();

  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<'todos' | 'activos' | 'bajas'>('todos');

  // Modal Formulario
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [categoriaSeleccionadaId, setCategoriaSeleccionadaId] = useState<string | null>(null);

  // Campos del Modelo de Dominio
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [slugCategoria, setSlugCategoria] = useState('');
  const [iconoCategoria, setIconoCategoria] = useState('backpack');
  const [descripcionCategoria, setDescripcionCategoria] = useState('');
  const [ordenCategoria, setOrdenCategoria] = useState<number>(0);

  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  const mostrarExito = (msg: string) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setCategoriaSeleccionadaId(null);
    setNombreCategoria('');
    setSlugCategoria('');
    setIconoCategoria('backpack');
    setDescripcionCategoria('');
    setOrdenCategoria(categorias.length + 1);
    setErrorValidacion(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (cat: CategoriaAdmin) => {
    setModoEdicion(true);
    setCategoriaSeleccionadaId(cat.idCategoria);
    setNombreCategoria(cat.nombreCategoria);
    setSlugCategoria(cat.slugCategoria);
    setIconoCategoria(cat.iconoCategoria || 'backpack');
    setDescripcionCategoria(cat.descripcionCategoria || '');
    setOrdenCategoria(cat.ordenCategoria);
    setErrorValidacion(null);
    setModalAbierto(true);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    if (!nombreCategoria.trim()) {
      setErrorValidacion('El nombre de la categoría es obligatorio.');
      return;
    }

    const slug = slugCategoria.trim() || nombreCategoria.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (modoEdicion && categoriaSeleccionadaId) {
      const catOriginal = categorias.find((c) => c.idCategoria === categoriaSeleccionadaId);
      editarCategoria({
        idCategoria: categoriaSeleccionadaId,
        nombreCategoria: nombreCategoria.trim(),
        slugCategoria: slug,
        iconoCategoria: iconoCategoria || 'backpack',
        descripcionCategoria: descripcionCategoria.trim(),
        ordenCategoria: Number(ordenCategoria),
        fechaHoraBajaCategoria: catOriginal?.fechaHoraBajaCategoria || null,
      });
      mostrarExito('¡Categoría actualizada correctamente!');
    } else {
      crearCategoria({
        nombreCategoria: nombreCategoria.trim(),
        slugCategoria: slug,
        iconoCategoria: iconoCategoria || 'backpack',
        descripcionCategoria: descripcionCategoria.trim(),
        ordenCategoria: Number(ordenCategoria),
      });
      mostrarExito('¡Categoría registrada exitosamente!');
    }

    setModalAbierto(false);
  };

  const categoriasFiltradas = categorias.filter((c) => {
    if (estadoFiltro === 'activos' && c.fechaHoraBajaCategoria) return false;
    if (estadoFiltro === 'bajas' && !c.fechaHoraBajaCategoria) return false;

    const q = busqueda.toLowerCase().trim();
    if (!q) return true;
    return (
      c.nombreCategoria.toLowerCase().includes(q) ||
      c.slugCategoria.toLowerCase().includes(q) ||
      (c.descripcionCategoria && c.descripcionCategoria.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-indigo-900" />
            <span>ABM Categorías</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
              {categoriasFiltradas.length} registros
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mapeo de atributos: <code className="font-mono text-indigo-900 font-semibold">nombreCategoria</code>, <code className="font-mono text-indigo-900 font-semibold">slugCategoria</code>, <code className="font-mono text-indigo-900 font-semibold">iconoCategoria</code> y orden visual.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirModalCrear}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 touch-manipulation cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Banner de Feedback */}
      {mensajeExito && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* 2. Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, slug o descripción..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-900 transition-all"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Selector de Estado */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setEstadoFiltro('todos')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              estadoFiltro === 'todos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setEstadoFiltro('activos')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              estadoFiltro === 'activos' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Activos
          </button>
          <button
            type="button"
            onClick={() => setEstadoFiltro('bajas')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              estadoFiltro === 'bajas' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Bajas
          </button>
        </div>
      </div>

      {/* 3. Tabla DataGrid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/90 text-slate-500 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Orden</th>
                <th className="py-3 px-4">Categoría & Ícono</th>
                <th className="py-3 px-4">Slug URL</th>
                <th className="py-3 px-4">Descripción</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categoriasFiltradas.length > 0 ? (
                categoriasFiltradas.map((cat) => {
                  const estaDadaDeBaja = !!cat.fechaHoraBajaCategoria;

                  return (
                    <tr 
                      key={cat.idCategoria}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        estaDadaDeBaja ? 'bg-rose-50/20 text-slate-500' : 'text-slate-800'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-400 text-xs">
                        #{cat.ordenCategoria}
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center shrink-0">
                            <AppIcon name={cat.iconoCategoria || 'backpack'} size={15} className="text-indigo-900" />
                          </div>
                          <div>
                            <span className="block">{cat.nombreCategoria}</span>
                            <span className="text-[10px] text-slate-400 font-mono font-normal">
                              Ícono: {cat.iconoCategoria}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-xs text-slate-500">
                        /{cat.slugCategoria}
                      </td>

                      <td className="py-3 px-4 text-slate-500 text-xs max-w-xs truncate">
                        {cat.descripcionCategoria || '-'}
                      </td>

                      <td className="py-3 px-4">
                        {estaDadaDeBaja ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              Baja Lógica
                            </span>
                            <p className="text-[10px] font-mono text-slate-500">
                              {cat.fechaHoraBajaCategoria}
                            </p>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Activo
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => abrirModalEditar(cat)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-900 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Editar categoría"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {estaDadaDeBaja ? (
                            <button
                              type="button"
                              onClick={() => {
                                reactivarCategoria(cat.idCategoria);
                                mostrarExito(`¡Categoría "${cat.nombreCategoria}" reactivada con éxito!`);
                              }}
                              className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                              title="Reactivar categoría"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`¿Dar de baja lógica a la categoría "${cat.nombreCategoria}"? Sus productos asociados no se eliminarán.`)) {
                                  bajaLogicaCategoria(cat.idCategoria);
                                  mostrarExito(`Categoría "${cat.nombreCategoria}" marcada con baja lógica.`);
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
                    No se encontraron categorías con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal con Vista Previa en Vivo */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            
            {/* Header del Modal */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-indigo-900" />
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {modoEdicion ? 'Modificar Categoría' : 'Alta de Nueva Categoría'}
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

            {errorValidacion && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorValidacion}</span>
              </div>
            )}

            {/* Grid 2 Columnas: Formulario + Vista Previa en Vivo */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              
              {/* Formulario */}
              <form onSubmit={handleGuardar} id="form-categoria" className="lg:col-span-7 p-6 space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nombre de Categoría (nombreCategoria) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nombreCategoria}
                    onChange={(e) => {
                      setNombreCategoria(e.target.value);
                      if (!modoEdicion) {
                        setSlugCategoria(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    placeholder="Ej: Artículos de Oficina"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-indigo-900 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Slug URL (slugCategoria)
                    </label>
                    <input
                      type="text"
                      value={slugCategoria}
                      onChange={(e) => setSlugCategoria(e.target.value)}
                      placeholder="articulos-de-oficina"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono text-xs focus:outline-hidden focus:border-indigo-900 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Orden Visual (ordenCategoria)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={ordenCategoria}
                      onChange={(e) => setOrdenCategoria(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono focus:outline-hidden focus:border-indigo-900 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Selector Visual de Icono Lucide */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <VisualIconPicker
                    selectedIcon={iconoCategoria}
                    onSelect={setIconoCategoria}
                    options={CATEGORY_ICON_OPTIONS}
                    titulo="Ícono Vectorial Representativo (Lucide React)"
                    permiteDesmarcar={false}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Descripción Informativa (descripcionCategoria)
                  </label>
                  <textarea
                    rows={2}
                    value={descripcionCategoria}
                    onChange={(e) => setDescripcionCategoria(e.target.value)}
                    placeholder="Descripción del rubro para orientar al cliente en la vitrina web..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-indigo-900 focus:bg-white transition-all"
                  />
                </div>
              </form>

              {/* Vista Previa en Vivo (Columna Derecha) */}
              <div className="lg:col-span-5 p-6 bg-slate-50/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-heading font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-indigo-900" />
                      <span>Vista Previa en Vitrina Web</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      ● En Vivo
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-4">
                    Así observarán los visitantes este botón de filtro en la barra de navegación del catálogo:
                  </p>

                  <div className="space-y-4 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Estado Inactivo (en la barra de filtros):
                      </span>
                      <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                        <AppIcon name={iconoCategoria || 'backpack'} size={16} className="text-slate-600" />
                        <span>{nombreCategoria.trim() || 'Nombre de Categoría'}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Estado Activo / Seleccionado:
                      </span>
                      <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-semibold bg-[#d97786] text-white shadow-sm ring-1 ring-[#c46372]/30">
                        <AppIcon name={iconoCategoria || 'backpack'} size={16} className="text-white" />
                        <span>{nombreCategoria.trim() || 'Nombre de Categoría'}</span>
                      </div>
                    </div>

                    {descripcionCategoria.trim() && (
                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                        <span className="font-bold text-slate-700">Detalle:</span> {descripcionCategoria.trim()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Identificador SVG:</span>
                    <span className="font-mono font-bold text-indigo-900">{iconoCategoria}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ruta de filtro:</span>
                    <span className="font-mono text-slate-700">/{slugCategoria || 'slug'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Modal */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 cursor-pointer text-xs sm:text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="form-categoria"
                className="px-5 py-2 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer text-xs sm:text-sm"
              >
                {modoEdicion ? 'Guardar Cambios' : 'Registrar Categoría'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
