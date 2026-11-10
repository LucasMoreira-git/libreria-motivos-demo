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
  LayoutGrid,
  Backpack,
  Briefcase,
  Palette,
  Gift,
  Ruler
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { CategoriaAdmin } from '@/types/admin';

const ICONOS_DISPONIBLES = [
  { id: 'LayoutGrid', label: 'Cuadrícula (Todos)', Icono: LayoutGrid },
  { id: 'Backpack', label: 'Mochila (Escolar)', Icono: Backpack },
  { id: 'Briefcase', label: 'Maletín (Oficina)', Icono: Briefcase },
  { id: 'Palette', label: 'Paleta (Arte)', Icono: Palette },
  { id: 'Gift', label: 'Regalo (Didácticos)', Icono: Gift },
  { id: 'Ruler', label: 'Regla (Técnico)', Icono: Ruler },
];

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
  const [iconoCategoria, setIconoCategoria] = useState('LayoutGrid');
  const [descripcionCategoria, setDescripcionCategoria] = useState('');
  const [ordenCategoria, setOrdenCategoria] = useState<number>(0);

  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const mostrarExito = (msg: string) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setCategoriaSeleccionadaId(null);
    setNombreCategoria('');
    setSlugCategoria('');
    setIconoCategoria('LayoutGrid');
    setDescripcionCategoria('');
    setOrdenCategoria(categorias.length);
    setModalAbierto(true);
  };

  const abrirModalEditar = (cat: CategoriaAdmin) => {
    setModoEdicion(true);
    setCategoriaSeleccionadaId(cat.idCategoria);
    setNombreCategoria(cat.nombreCategoria);
    setSlugCategoria(cat.slugCategoria);
    setIconoCategoria(cat.iconoCategoria);
    setDescripcionCategoria(cat.descripcionCategoria || '');
    setOrdenCategoria(cat.ordenCategoria);
    setModalAbierto(true);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreCategoria.trim()) {
      alert('El nombre de la categoría es obligatorio');
      return;
    }

    const slug = slugCategoria.trim() || nombreCategoria.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (modoEdicion && categoriaSeleccionadaId) {
      const catOriginal = categorias.find((c) => c.idCategoria === categoriaSeleccionadaId);
      editarCategoria({
        idCategoria: categoriaSeleccionadaId,
        nombreCategoria,
        slugCategoria: slug,
        iconoCategoria,
        descripcionCategoria,
        ordenCategoria: Number(ordenCategoria),
        fechaHoraBajaCategoria: catOriginal?.fechaHoraBajaCategoria || null,
      });
      mostrarExito('¡Categoría actualizada correctamente!');
    } else {
      crearCategoria({
        nombreCategoria,
        slugCategoria: slug,
        iconoCategoria,
        descripcionCategoria,
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
      
      {/* Encabezado */}
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
            Mapeo de atributos: <code className="font-mono text-indigo-900 font-semibold">nombreCategoria</code>, <code className="font-mono text-indigo-900 font-semibold">slugCategoria</code>, <code className="font-mono text-indigo-900 font-semibold">fechaHoraBajaCategoria</code>.
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

      {mensajeExito && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, slug o descripción..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-indigo-900 transition-all"
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

        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setEstadoFiltro('todos')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              estadoFiltro === 'todos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setEstadoFiltro('activos')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              estadoFiltro === 'activos' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Activas
          </button>
          <button
            type="button"
            onClick={() => setEstadoFiltro('bajas')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              estadoFiltro === 'bajas' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Bajas
          </button>
        </div>
      </div>

      {/* Tabla DataGrid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/90 text-slate-500 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Orden</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">slugCategoria</th>
                <th className="py-3 px-4">Ícono Lucide</th>
                <th className="py-3 px-4">Estado (Baja Lógica)</th>
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
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">
                        #{cat.ordenCategoria}
                      </td>

                      <td className="py-3 px-4">
                        <div>
                          <p className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                            {cat.nombreCategoria}
                          </p>
                          {cat.descripcionCategoria && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {cat.descripcionCategoria}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-xs text-slate-600">
                        {cat.slugCategoria}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200">
                          <code className="text-indigo-900 font-bold">{cat.iconoCategoria}</code>
                        </span>
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
                            Activa
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => abrirModalEditar(cat)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-900 hover:bg-slate-100 transition-colors"
                            title="Editar categoría"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {estaDadaDeBaja ? (
                            <button
                              type="button"
                              onClick={() => {
                                reactivarCategoria(cat.idCategoria);
                                mostrarExito(`¡Categoría "${cat.nombreCategoria}" reactivada exitosamente!`);
                              }}
                              className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                              title="Reactivar categoría"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`¿Dar de baja lógica a la categoría "${cat.nombreCategoria}"?`)) {
                                  bajaLogicaCategoria(cat.idCategoria);
                                  mostrarExito(`Categoría "${cat.nombreCategoria}" marcada con baja lógica.`);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
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
                    No se encontraron categorías.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Formulario */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-indigo-900" />
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {modoEdicion ? 'Modificar Categoría' : 'Nueva Categoría'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGuardar} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ícono Semántico Lucide (iconoCategoria)
                </label>
                <select
                  value={iconoCategoria}
                  onChange={(e) => setIconoCategoria(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-hidden focus:border-indigo-900 focus:bg-white transition-all"
                >
                  {ICONOS_DISPONIBLES.map((ico) => (
                    <option key={ico.id} value={ico.id}>
                      {ico.label} — {ico.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Descripción (descripcionCategoria)
                </label>
                <textarea
                  rows={2}
                  value={descripcionCategoria}
                  onChange={(e) => setDescripcionCategoria(e.target.value)}
                  placeholder="Descripción informativa del rubro para la vitrina..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-indigo-900 focus:bg-white transition-all"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold transition-all shadow-md active:scale-95"
                >
                  {modoEdicion ? 'Guardar Cambios' : 'Registrar Categoría'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
