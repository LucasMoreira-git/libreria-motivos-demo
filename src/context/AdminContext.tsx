'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CategoriaAdmin, 
  ProductoAdmin, 
  PromocionAdmin, 
  HorarioAtencionAdmin 
} from '@/types/admin';
import { CATEGORIAS_MOCK, PRODUCTOS_MOCK, PROMOCIONES_MOCK } from '@/lib/mock-catalogo';
import { TURNOS_MOCK } from '@/lib/mock-data';

// Seeds iniciales adaptados al modelo de dominio estricto
const CATEGORIAS_INICIALES: CategoriaAdmin[] = CATEGORIAS_MOCK.map((c) => ({
  idCategoria: c.id,
  nombreCategoria: c.nombre,
  slugCategoria: c.slug,
  iconoCategoria: c.iconoLucide || 'LayoutGrid',
  descripcionCategoria: c.descripcion || '',
  ordenCategoria: c.orden,
  fechaHoraBajaCategoria: null,
}));

const PRODUCTOS_INICIALES: ProductoAdmin[] = PRODUCTOS_MOCK.map((p) => ({
  idProducto: p.id,
  nombreProducto: p.nombre,
  detalleProducto: p.detalle,
  precioProducto: p.precio,
  fotoProducto: p.fotoProducto || p.foto || '',
  categoriaId: p.categoriaId,
  codTC: p.categoriaId,
  categoriaNombre: p.categoriaNombre || '',
  destacadoProducto: !!p.destacado,
  enOfertaProducto: !!p.enOferta,
  badgeProducto: p.badge || null,
  fechaHoraBajaProducto: null,
}));

const PROMOCIONES_INICIALES: PromocionAdmin[] = PROMOCIONES_MOCK.map((pr) => ({
  idPromocion: pr.id,
  nombrePromocion: pr.nombre,
  detallePromocion: pr.detalle,
  temporadaPromocion: pr.temporadaPromocion || pr.temporada || 'Especial Primavera 2026',
  fechaInicioPromocion: pr.fechaInicio,
  fechaFinPromocion: pr.fechaFin,
  fechaHoraFinPromocion: pr.fechaFin,
  descuentoTextoPromocion: pr.descuentoTexto,
  condicionPromocion: pr.condicion || '',
  badgeTextoPromocion: pr.badgeTexto || '',
  fotoComboPromocion: pr.fotoCombo || '',
  fechaHoraBajaPromocion: null,
}));

const HORARIOS_INICIALES: HorarioAtencionAdmin[] = TURNOS_MOCK.map((t) => ({
  idHorarioAtencion: t.id,
  diasTextoHA: t.diasTexto,
  diasSemanaHA: t.diasSemana,
  nombreTurnoHA: t.nombreTurno,
  horaInicioHA: t.horaApertura,
  horaFinHA: t.horaCierre,
  esCerradoHA: !!t.esCerrado,
  fechaHoraBajaHA: null,
}));

function obtenerFechaHoraActual(): string {
  const ahora = new Date();
  const dia = String(ahora.getDate()).padStart(2, '0');
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const anio = ahora.getFullYear();
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${anio} ${horas}:${minutos} hs`;
}

interface AdminContextType {
  // Entidades
  categorias: CategoriaAdmin[];
  productos: ProductoAdmin[];
  promociones: PromocionAdmin[];
  horarios: HorarioAtencionAdmin[];

  // Operaciones ABM Categorías
  crearCategoria: (categoria: Omit<CategoriaAdmin, 'idCategoria' | 'fechaHoraBajaCategoria'>) => void;
  editarCategoria: (categoria: CategoriaAdmin) => void;
  bajaLogicaCategoria: (idCategoria: string) => void;
  reactivarCategoria: (idCategoria: string) => void;

  // Operaciones ABM Productos
  crearProducto: (producto: Omit<ProductoAdmin, 'idProducto' | 'fechaHoraBajaProducto'>) => void;
  editarProducto: (producto: ProductoAdmin) => void;
  bajaLogicaProducto: (idProducto: string) => void;
  reactivarProducto: (idProducto: string) => void;

  // Operaciones ABM Promociones
  crearPromocion: (promocion: Omit<PromocionAdmin, 'idPromocion' | 'fechaHoraBajaPromocion'>) => void;
  editarPromocion: (promocion: PromocionAdmin) => void;
  bajaLogicaPromocion: (idPromocion: string) => void;
  reactivarPromocion: (idPromocion: string) => void;

  // Operaciones ABM Horarios
  crearHorario: (horario: Omit<HorarioAtencionAdmin, 'idHorarioAtencion' | 'fechaHoraBajaHA'>) => void;
  editarHorario: (horario: HorarioAtencionAdmin) => void;
  bajaLogicaHorario: (idHorarioAtencion: string) => void;
  reactivarHorario: (idHorarioAtencion: string) => void;

  // Utilidades
  restablecerDatos: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [categorias, setCategorias] = useState<CategoriaAdmin[]>(CATEGORIAS_INICIALES);
  const [productos, setProductos] = useState<ProductoAdmin[]>(PRODUCTOS_INICIALES);
  const [promociones, setPromociones] = useState<PromocionAdmin[]>(PROMOCIONES_INICIALES);
  const [horarios, setHorarios] = useState<HorarioAtencionAdmin[]>(HORARIOS_INICIALES);

  // Carga inicial de localStorage en cliente
  useEffect(() => {
    try {
      const catGuardadas = localStorage.getItem('motivos_admin_categorias');
      if (catGuardadas) setCategorias(JSON.parse(catGuardadas));

      const prodGuardados = localStorage.getItem('motivos_admin_productos');
      if (prodGuardados) setProductos(JSON.parse(prodGuardados));

      const promoGuardadas = localStorage.getItem('motivos_admin_promociones');
      if (promoGuardadas) setPromociones(JSON.parse(promoGuardadas));

      const horGuardados = localStorage.getItem('motivos_admin_horarios');
      if (horGuardados) setHorarios(JSON.parse(horGuardados));
    } catch {
      // Ignorar errores de parseo
    }
  }, []);

  // Sincronización a localStorage
  useEffect(() => {
    try {
      localStorage.setItem('motivos_admin_categorias', JSON.stringify(categorias));
    } catch {}
  }, [categorias]);

  useEffect(() => {
    try {
      localStorage.setItem('motivos_admin_productos', JSON.stringify(productos));
    } catch {}
  }, [productos]);

  useEffect(() => {
    try {
      localStorage.setItem('motivos_admin_promociones', JSON.stringify(promociones));
    } catch {}
  }, [promociones]);

  useEffect(() => {
    try {
      localStorage.setItem('motivos_admin_horarios', JSON.stringify(horarios));
    } catch {}
  }, [horarios]);

  // ABM Categorías
  const crearCategoria = (data: Omit<CategoriaAdmin, 'idCategoria' | 'fechaHoraBajaCategoria'>) => {
    const nueva: CategoriaAdmin = {
      ...data,
      idCategoria: `cat-${Date.now()}`,
      fechaHoraBajaCategoria: null,
    };
    setCategorias((prev) => [...prev, nueva]);
  };

  const editarCategoria = (categoria: CategoriaAdmin) => {
    setCategorias((prev) =>
      prev.map((c) => (c.idCategoria === categoria.idCategoria ? categoria : c))
    );
  };

  const bajaLogicaCategoria = (idCategoria: string) => {
    const timestampBaja = obtenerFechaHoraActual();
    setCategorias((prev) =>
      prev.map((c) =>
        c.idCategoria === idCategoria
          ? { ...c, fechaHoraBajaCategoria: timestampBaja }
          : c
      )
    );
  };

  const reactivarCategoria = (idCategoria: string) => {
    setCategorias((prev) =>
      prev.map((c) =>
        c.idCategoria === idCategoria
          ? { ...c, fechaHoraBajaCategoria: null }
          : c
      )
    );
  };

  // ABM Productos
  const crearProducto = (data: Omit<ProductoAdmin, 'idProducto' | 'fechaHoraBajaProducto'>) => {
    const cat = categorias.find((c) => c.idCategoria === data.categoriaId);
    const nuevo: ProductoAdmin = {
      ...data,
      idProducto: `prod-${Date.now()}`,
      codTC: data.codTC !== undefined ? data.codTC : data.categoriaId,
      categoriaNombre: cat ? cat.nombreCategoria : '',
      fechaHoraBajaProducto: null,
    };
    setProductos((prev) => [nuevo, ...prev]);
  };

  const editarProducto = (producto: ProductoAdmin) => {
    const cat = categorias.find((c) => c.idCategoria === producto.categoriaId);
    setProductos((prev) =>
      prev.map((p) =>
        p.idProducto === producto.idProducto
          ? { 
              ...producto, 
              codTC: producto.codTC !== undefined ? producto.codTC : producto.categoriaId,
              categoriaNombre: cat ? cat.nombreCategoria : p.categoriaNombre 
            }
          : p
      )
    );
  };

  const bajaLogicaProducto = (idProducto: string) => {
    const timestampBaja = obtenerFechaHoraActual();
    setProductos((prev) =>
      prev.map((p) =>
        p.idProducto === idProducto
          ? { ...p, fechaHoraBajaProducto: timestampBaja }
          : p
      )
    );
  };

  const reactivarProducto = (idProducto: string) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.idProducto === idProducto
          ? { ...p, fechaHoraBajaProducto: null }
          : p
      )
    );
  };

  // ABM Promociones
  const crearPromocion = (data: Omit<PromocionAdmin, 'idPromocion' | 'fechaHoraBajaPromocion'>) => {
    const nueva: PromocionAdmin = {
      ...data,
      idPromocion: `promo-${Date.now()}`,
      fechaHoraFinPromocion: data.fechaHoraFinPromocion || data.fechaFinPromocion,
      fechaHoraBajaPromocion: null,
    };
    setPromociones((prev) => [nueva, ...prev]);
  };

  const editarPromocion = (promocion: PromocionAdmin) => {
    setPromociones((prev) =>
      prev.map((pr) =>
        pr.idPromocion === promocion.idPromocion
          ? {
              ...promocion,
              fechaHoraFinPromocion: promocion.fechaHoraFinPromocion || promocion.fechaFinPromocion,
            }
          : pr
      )
    );
  };

  const bajaLogicaPromocion = (idPromocion: string) => {
    const timestampBaja = obtenerFechaHoraActual();
    setPromociones((prev) =>
      prev.map((pr) =>
        pr.idPromocion === idPromocion
          ? { ...pr, fechaHoraBajaPromocion: timestampBaja }
          : pr
      )
    );
  };

  const reactivarPromocion = (idPromocion: string) => {
    setPromociones((prev) =>
      prev.map((pr) =>
        pr.idPromocion === idPromocion
          ? { ...pr, fechaHoraBajaPromocion: null }
          : pr
      )
    );
  };

  // ABM Horarios
  const crearHorario = (data: Omit<HorarioAtencionAdmin, 'idHorarioAtencion' | 'fechaHoraBajaHA'>) => {
    const nuevo: HorarioAtencionAdmin = {
      ...data,
      idHorarioAtencion: `ha-${Date.now()}`,
      fechaHoraBajaHA: null,
    };
    setHorarios((prev) => [...prev, nuevo]);
  };

  const editarHorario = (horario: HorarioAtencionAdmin) => {
    setHorarios((prev) =>
      prev.map((h) => (h.idHorarioAtencion === horario.idHorarioAtencion ? horario : h))
    );
  };

  const bajaLogicaHorario = (idHorarioAtencion: string) => {
    const timestampBaja = obtenerFechaHoraActual();
    setHorarios((prev) =>
      prev.map((h) =>
        h.idHorarioAtencion === idHorarioAtencion
          ? { ...h, fechaHoraBajaHA: timestampBaja }
          : h
      )
    );
  };

  const reactivarHorario = (idHorarioAtencion: string) => {
    setHorarios((prev) =>
      prev.map((h) =>
        h.idHorarioAtencion === idHorarioAtencion
          ? { ...h, fechaHoraBajaHA: null }
          : h
      )
    );
  };

  const restablecerDatos = () => {
    setCategorias(CATEGORIAS_INICIALES);
    setProductos(PRODUCTOS_INICIALES);
    setPromociones(PROMOCIONES_INICIALES);
    setHorarios(HORARIOS_INICIALES);
    try {
      localStorage.removeItem('motivos_admin_categorias');
      localStorage.removeItem('motivos_admin_productos');
      localStorage.removeItem('motivos_admin_promociones');
      localStorage.removeItem('motivos_admin_horarios');
    } catch {}
  };

  return (
    <AdminContext.Provider
      value={{
        categorias,
        productos,
        promociones,
        horarios,
        crearCategoria,
        editarCategoria,
        bajaLogicaCategoria,
        reactivarCategoria,
        crearProducto,
        editarProducto,
        bajaLogicaProducto,
        reactivarProducto,
        crearPromocion,
        editarPromocion,
        bajaLogicaPromocion,
        reactivarPromocion,
        crearHorario,
        editarHorario,
        bajaLogicaHorario,
        reactivarHorario,
        restablecerDatos,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin debe utilizarse dentro de un AdminProvider');
  }
  return context;
}
