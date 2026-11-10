'use client';

import React, { useState } from 'react';
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
  ExternalLink,
  Tag
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { ProductoAdmin } from '@/types/admin';

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

  // Campos del formulario mapeados al modelo de dominio
  const [nombreProducto, setNombreProducto] = useState('');
  const [detalleProducto, setDetalleProducto] = useState('');
  const [precioProducto, setPrecioProducto] = useState<number>(0);
  const [fotoProducto, setFotoProducto] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [destacadoProducto, setDestacadoProducto] = useState(false);
  const [enOfertaProducto, setEnOfertaProducto] = useState(false);
  const [badgeProducto, setBadgeProducto] = useState<'OFERTA' | 'NOVEDAD' | null>(null);

  // Mensaje de feedback
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const mostrarExito = (msg: string) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setProductoSeleccionadoId(null);
    setNombreProducto('');
    setDetalleProducto('');
    setPrecioProducto(0);
    setFotoProducto('');
    setCategoriaId(categorias[0]?.idCategoria || 'escolar');
    setDestacadoProducto(false);
    setEnOfertaProducto(false);
    setBadgeProducto(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (prod: ProductoAdmin) => {
    setModoEdicion(true);
    setProductoSeleccionadoId(prod.idProducto);
    setNombreProducto(prod.nombreProducto);
    setDetalleProducto(prod.detalleProducto);
    setPrecioProducto(prod.precioProducto);
    setFotoProducto(prod.fotoProducto);
    setCategoriaId(prod.categoriaId);
    setDestacadoProducto(prod.destacadoProducto);
    setEnOfertaProducto(prod.enOfertaProducto);
    setBadgeProducto(prod.badgeProducto);
    setModalAbierto(true);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreProducto.trim()) {
      alert('El nombre del producto es obligatorio');
      return;
    }
    if (precioProducto < 0) {
      alert('El precio debe ser mayor o igual a 0');
      return;
    }

    if (modoEdicion && productoSeleccionadoId) {
      const prodOriginal = productos.find((p) => p.idProducto === productoSeleccionadoId);
      editarProducto({
        idProducto: productoSeleccionadoId,
        nombreProducto,
        detalleProducto,
        precioProducto: Number(precioProducto),
        fotoProducto: fotoProducto.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
        categoriaId,
        destacadoProducto,
        enOfertaProducto,
        badgeProducto,
        fechaHoraBajaProducto: prodOriginal?.fechaHoraBajaProducto || null,
      });
      mostrarExito('¡Producto actualizado correctamente!');
    } else {
      crearProducto({
        nombreProducto,
        detalleProducto,
        precioProducto: Number(precioProducto),
        fotoProducto: fotoProducto.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
        categoriaId,
        destacadoProducto,
        enOfertaProducto,
        badgeProducto,
      });
      mostrarExito('¡Nuevo producto dado de alta exitosamente!');
    }

    setModalAbierto(false);
  };

  // Filtrado de la tabla DataGrid
  const productosFiltrados = productos.filter((p) => {
    // Filtro estado baja lógica
    if (estadoFiltro === 'activos' && p.fechaHoraBajaProducto) return false;
    if (estadoFiltro === 'bajas' && !p.fechaHoraBajaProducto) return false;

    // Filtro categoría
    if (categoriaFiltro !== 'todas' && p.categoriaId !== categoriaFiltro) return false;

    // Filtro texto
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
            Mapeo de atributos: <code className="font-mono text-blue-900 font-semibold">precioProducto</code>, <code className="font-mono text-blue-900 font-semibold">fechaHoraBajaProducto</code>, categorías y fotos.
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
                <th className="py-3 px-4">precioProducto</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4">Estado (Baja Lógica)</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((prod) => {
                  const estaDadoDeBaja = !!prod.fechaHoraBajaProducto;

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
                            src={prod.fotoProducto}
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

                      {/* Precio */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 text-xs sm:text-sm">
                        $ {prod.precioProducto.toLocaleString('es-AR')}
                      </td>

                      {/* Badges */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {prod.badgeProducto && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 border border-orange-200">
                              {prod.badgeProducto}
                            </span>
                          )}
                          {prod.destacadoProducto && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                              Destacado
                            </span>
                          )}
                          {!prod.badgeProducto && !prod.destacadoProducto && (
                            <span className="text-slate-400 text-xs">-</span>
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
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-slate-100 transition-colors"
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
                              className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
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
                    No se encontraron productos que coincidan con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal de Formulario: Alta y Modificación de Producto */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
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
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cuerpo del Formulario */}
            <form onSubmit={handleGuardar} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Precio en ARS (precioProducto) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={100}
                    value={precioProducto}
                    onChange={(e) => setPrecioProducto(Number(e.target.value))}
                    placeholder="24500"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono font-bold focus:outline-hidden focus:border-blue-900 focus:bg-white transition-all"
                  />
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  URL de la Foto (fotoProducto)
                </label>
                <input
                  type="url"
                  value={fotoProducto}
                  onChange={(e) => setFotoProducto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-blue-900 focus:bg-white transition-all text-xs font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">Si se omite, se asignará una foto simulada por defecto.</p>
              </div>

              {/* Opciones booleanas y Badges */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="font-bold text-slate-700 block text-xs">
                  Opciones Visuales en la Vitrina
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={destacadoProducto}
                      onChange={(e) => setDestacadoProducto(e.target.checked)}
                      className="rounded text-blue-900 focus:ring-blue-500"
                    />
                    <span>Producto Destacado</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={enOfertaProducto}
                      onChange={(e) => setEnOfertaProducto(e.target.checked)}
                      className="rounded text-blue-900 focus:ring-blue-500"
                    />
                    <span>En Oferta Especial</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Badge Superpuesto (badgeProducto)
                  </label>
                  <select
                    value={badgeProducto || ''}
                    onChange={(e) => setBadgeProducto((e.target.value as 'OFERTA' | 'NOVEDAD') || null)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                  >
                    <option value="">Sin Badge</option>
                    <option value="OFERTA">OFERTA</option>
                    <option value="NOVEDAD">NOVEDAD</option>
                  </select>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold transition-all shadow-md active:scale-95"
                >
                  {modoEdicion ? 'Guardar Cambios' : 'Registrar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
