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

function formatearTimestampBaja(fechaRaw: any): string | null {
  if (!fechaRaw) return null;
  try {
    const d = new Date(fechaRaw);
    if (isNaN(d.getTime())) return String(fechaRaw);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    const horas = String(d.getHours()).padStart(2, '0');
    const minutos = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${anio} ${horas}:${minutos} hs`;
  } catch {
    return String(fechaRaw);
  }
}

interface AdminContextType {
  // Autenticación
  isAuthenticated: boolean;
  adminUser: { username: string; nombre: string } | null;
  token: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Sincronización Backend
  backendEnLinea: boolean;
  sincronizarConBackend: () => Promise<void>;

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
  // Estado de Autenticación
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<{ username: string; nombre: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Estado de Sincronización con Backend
  const [backendEnLinea, setBackendEnLinea] = useState<boolean>(false);

  const [categorias, setCategorias] = useState<CategoriaAdmin[]>(CATEGORIAS_INICIALES);
  const [productos, setProductos] = useState<ProductoAdmin[]>(PRODUCTOS_INICIALES);
  const [promociones, setPromociones] = useState<PromocionAdmin[]>(PROMOCIONES_INICIALES);
  const [horarios, setHorarios] = useState<HorarioAtencionAdmin[]>(HORARIOS_INICIALES);

  // Función para sincronizar datos reales desde Spring Boot REST API (incluyendo bajas lógicas para el panel)
  const sincronizarConBackend = async () => {
    try {
      const [resCat, resProd, resProm, resHor] = await Promise.all([
        fetch('http://localhost:8080/api/categorias?incluirInactivas=true').then((r) => (r.ok ? r.json() : null)),
        fetch('http://localhost:8080/api/productos?incluirInactivos=true').then((r) => (r.ok ? r.json() : null)),
        fetch('http://localhost:8080/api/promociones?incluirInactivas=true').then((r) => (r.ok ? r.json() : null)),
        fetch('http://localhost:8080/api/horarios?incluirInactivos=true').then((r) => (r.ok ? r.json() : null)),
      ]);

      if (resCat && Array.isArray(resCat) && resCat.length > 0) {
        const catMapeadas: CategoriaAdmin[] = resCat.map((c: any) => ({
          idCategoria: String(c.id || c.idCategoria),
          nombreCategoria: c.nombreTC || c.nombreCategoria,
          slugCategoria: c.slugCategoria || '',
          iconoCategoria: c.iconoCategoria || 'FolderTree',
          descripcionCategoria: c.descripcionTC || '',
          ordenCategoria: c.ordenCategoria || 1,
          fechaHoraBajaCategoria: c.fechaHoraBajaTC 
            ? formatearTimestampBaja(c.fechaHoraBajaTC) 
            : (c.activo === false ? 'Baja lógica' : null),
        }));
        setCategorias(catMapeadas);
      }

      if (resProd && Array.isArray(resProd) && resProd.length > 0) {
        const prodMapeados: ProductoAdmin[] = resProd.map((p: any) => ({
          idProducto: String(p.id || p.idProducto),
          nombreProducto: p.nombreProducto,
          detalleProducto: p.detalleProducto || '',
          precioProducto: Number(p.precioProducto || 0),
          precioDescuentoProducto: p.precioDescuentoProducto !== null && p.precioDescuentoProducto !== undefined ? Number(p.precioDescuentoProducto) : null,
          fechaFinDescuento: p.fechaFinDescuento ? new Date(p.fechaFinDescuento).toISOString() : null,
          tieneDescuentoVigente: !!p.tieneDescuentoVigente,
          precioEfectivo: p.precioEfectivo !== undefined ? Number(p.precioEfectivo) : Number(p.precioProducto || 0),
          fotoProducto: p.fotoProducto || '',
          categoriaId: String(p.tipoCategoriaId || ''),
          codTC: p.codigoProducto || String(p.tipoCategoriaId || ''),
          categoriaNombre: p.tipoCategoriaNombre || '',
          destacadoProducto: !!p.destacadoProducto,
          enOfertaProducto: !!p.enOfertaProducto,
          ultimasUnidadesProducto: !!p.ultimasUnidadesProducto,
          nuevoIngresoProducto: !!p.nuevoIngresoProducto,
          iconoProducto: p.iconoProducto || null,
          badgeProducto: p.badgeProducto || null,
          fechaHoraBajaProducto: p.fechaHoraBajaProducto 
            ? formatearTimestampBaja(p.fechaHoraBajaProducto) 
            : (p.activo === false ? 'Baja lógica' : null),
        }));
        setProductos(prodMapeados);
      }

      if (resProm && Array.isArray(resProm) && resProm.length > 0) {
        const promMapeadas: PromocionAdmin[] = resProm.map((pr: any) => ({
          idPromocion: String(pr.id || pr.idPromocion),
          nombrePromocion: pr.nombrePromocion,
          detallePromocion: pr.detallePromocion || '',
          temporadaPromocion: pr.temporadaPromocion || 'Especial Primavera 2026',
          fechaInicioPromocion: pr.fechaInicioPromocion || '',
          fechaFinPromocion: pr.fechaFinPromocion || '',
          fechaHoraFinPromocion: pr.fechaFinPromocion || '',
          descuentoTextoPromocion: pr.descuentoTexto || '',
          condicionPromocion: pr.condicionPromocion || '',
          fotoComboPromocion: pr.fotoCombo || '',
          fechaHoraBajaPromocion: pr.fechaHoraBajaPromocion 
            ? formatearTimestampBaja(pr.fechaHoraBajaPromocion) 
            : (pr.activo === false ? 'Baja lógica' : null),
        }));
        setPromociones(promMapeadas);
      }

      if (resHor && Array.isArray(resHor) && resHor.length > 0) {
        const horMapeados: HorarioAtencionAdmin[] = resHor.map((h: any) => ({
          idHorarioAtencion: String(h.id || h.idHorarioAtencion),
          diasTextoHA: h.diasTextoHA || h.diasSemanaHA || 'Lunes a Viernes',
          diasSemanaHA: [1, 2, 3, 4, 5],
          nombreTurnoHA: h.nombreTurnoHA || 'Turno',
          horaInicioHA: h.horaInicioHA || '09:30',
          horaFinHA: h.horaFinHA || '13:30',
          esCerradoHA: !!h.esCerradoHA,
          fechaHoraBajaHA: h.fechaHoraBajaHA 
            ? formatearTimestampBaja(h.fechaHoraBajaHA) 
            : (h.activo === false ? 'Baja lógica' : null),
        }));
        setHorarios(horMapeados);
      }

      setBackendEnLinea(true);
    } catch {
      setBackendEnLinea(false);
    }
  };

  // Carga inicial de localStorage y sessionStorage en cliente
  useEffect(() => {
    try {
      // 1. Verificar sesión activa de administrador
      const sesionToken = sessionStorage.getItem('motivos_admin_token');
      const sesionUser = sessionStorage.getItem('motivos_admin_user');
      if (sesionToken) {
        setToken(sesionToken);
        setIsAuthenticated(true);
        if (sesionUser) {
          try {
            setAdminUser(JSON.parse(sesionUser));
          } catch {
            setAdminUser({ username: 'admin', nombre: 'Administrador Librería Motivos' });
          }
        }
      }

      // 2. Entidades desde caché local
      const catGuardadas = localStorage.getItem('motivos_admin_categorias');
      if (catGuardadas) setCategorias(JSON.parse(catGuardadas));

      const prodGuardados = localStorage.getItem('motivos_admin_productos');
      if (prodGuardados) setProductos(JSON.parse(prodGuardados));

      const promoGuardadas = localStorage.getItem('motivos_admin_promociones');
      if (promoGuardadas) setPromociones(JSON.parse(promoGuardadas));

      const horGuardados = localStorage.getItem('motivos_admin_horarios');
      if (horGuardados) setHorarios(JSON.parse(horGuardados));

      // 3. Consultar backend Spring Boot si está activo
      sincronizarConBackend();
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
    const slug = data.slugCategoria || data.nombreCategoria.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const nueva: CategoriaAdmin = {
      ...data,
      slugCategoria: slug,
      idCategoria: `cat-${Date.now()}`,
      fechaHoraBajaCategoria: null,
    };
    setCategorias((prev) => [...prev, nueva]);

    if (backendEnLinea) {
      fetch('http://localhost:8080/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codTC: `CAT-${Date.now().toString().slice(-4)}`,
          nombreTC: data.nombreCategoria,
          slugCategoria: slug,
          iconoCategoria: data.iconoCategoria || 'FolderTree',
          descripcionTC: data.descripcionCategoria || '',
          ordenCategoria: data.ordenCategoria || 1,
        }),
      })
        .then(() => sincronizarConBackend())
        .catch(() => {});
    }
  };

  const editarCategoria = (categoria: CategoriaAdmin) => {
    setCategorias((prev) =>
      prev.map((c) => (c.idCategoria === categoria.idCategoria ? categoria : c))
    );

    if (backendEnLinea) {
      const numId = Number(categoria.idCategoria.replace(/\D/g, ''));
      if (!isNaN(numId) && numId > 0) {
        fetch(`http://localhost:8080/api/categorias/${numId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombreTC: categoria.nombreCategoria,
            slugCategoria: categoria.slugCategoria,
            iconoCategoria: categoria.iconoCategoria,
            descripcionTC: categoria.descripcionCategoria,
            ordenCategoria: categoria.ordenCategoria,
          }),
        })
          .then(() => sincronizarConBackend())
          .catch(() => {});
      }
    }
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

    if (backendEnLinea) {
      const numId = Number(idCategoria.replace(/\D/g, ''));
      if (!isNaN(numId) && numId > 0) {
        fetch(`http://localhost:8080/api/categorias/${numId}`, {
          method: 'DELETE',
        })
          .then(() => sincronizarConBackend())
          .catch(() => {});
      }
    }
  };

  const reactivarCategoria = (idCategoria: string) => {
    setCategorias((prev) =>
      prev.map((c) =>
        c.idCategoria === idCategoria
          ? { ...c, fechaHoraBajaCategoria: null }
          : c
      )
    );

    if (backendEnLinea) {
      const numId = Number(idCategoria.replace(/\D/g, ''));
      if (!isNaN(numId) && numId > 0) {
        fetch(`http://localhost:8080/api/categorias/${numId}/reactivar`, {
          method: 'PATCH',
        })
          .then(() => sincronizarConBackend())
          .catch(() => {});
      }
    }
  };

  // ABM Productos
  const crearProducto = (data: Omit<ProductoAdmin, 'idProducto' | 'fechaHoraBajaProducto'>) => {
    const cat = categorias.find((c) => c.idCategoria === data.categoriaId);
    const nuevoId = `prod-${Date.now()}`;
    const tieneDesc = !!(data.precioDescuentoProducto && data.fechaFinDescuento && new Date(data.fechaFinDescuento).getTime() > Date.now());
    const nuevo: ProductoAdmin = {
      ...data,
      idProducto: nuevoId,
      codTC: data.codTC !== undefined ? data.codTC : data.categoriaId,
      categoriaNombre: cat ? cat.nombreCategoria : '',
      tieneDescuentoVigente: tieneDesc,
      precioEfectivo: tieneDesc && data.precioDescuentoProducto ? data.precioDescuentoProducto : data.precioProducto,
      fechaHoraBajaProducto: null,
    };
    setProductos((prev) => [nuevo, ...prev]);

    // Persistencia en backend si está activo
    if (backendEnLinea) {
      const tipoCatId = Number(data.categoriaId) || (cat ? Number(cat.idCategoria) : 1);
      const urlPost = !isNaN(tipoCatId) && tipoCatId > 0 
        ? `http://localhost:8080/api/productos?categoriaId=${tipoCatId}` 
        : 'http://localhost:8080/api/productos';

      fetch(urlPost, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigoProducto: `PROD-${Date.now().toString().slice(-4)}`,
          nombreProducto: data.nombreProducto,
          precioProducto: data.precioProducto,
          precioDescuentoProducto: data.precioDescuentoProducto ?? null,
          fechaFinDescuento: data.fechaFinDescuento ?? null,
          detalleProducto: data.detalleProducto,
          fotoProducto: data.fotoProducto,
          destacadoProducto: data.destacadoProducto,
          enOfertaProducto: data.enOfertaProducto,
          ultimasUnidadesProducto: data.ultimasUnidadesProducto ?? false,
          nuevoIngresoProducto: data.nuevoIngresoProducto ?? false,
          iconoProducto: data.iconoProducto || null,
          badgeProducto: data.badgeProducto,
        }),
      })
        .then(() => sincronizarConBackend())
        .catch(() => {});
    }
  };

  const editarProducto = (producto: ProductoAdmin) => {
    const cat = categorias.find((c) => c.idCategoria === producto.categoriaId);
    const tieneDesc = !!(producto.precioDescuentoProducto && producto.fechaFinDescuento && new Date(producto.fechaFinDescuento).getTime() > Date.now());
    setProductos((prev) =>
      prev.map((p) =>
        p.idProducto === producto.idProducto
          ? { 
              ...producto, 
              codTC: producto.codTC !== undefined ? producto.codTC : producto.categoriaId,
              categoriaNombre: cat ? cat.nombreCategoria : p.categoriaNombre,
              tieneDescuentoVigente: tieneDesc,
              precioEfectivo: tieneDesc && producto.precioDescuentoProducto ? producto.precioDescuentoProducto : producto.precioProducto,
            }
          : p
      )
    );

    if (backendEnLinea) {
      const numId = Number(producto.idProducto.replace(/\D/g, ''));
      if (!isNaN(numId) && numId > 0) {
        const tipoCatId = Number(producto.categoriaId) || (cat ? Number(cat.idCategoria) : 1);
        const urlPut = !isNaN(tipoCatId) && tipoCatId > 0 
          ? `http://localhost:8080/api/productos/${numId}?categoriaId=${tipoCatId}` 
          : `http://localhost:8080/api/productos/${numId}`;

        fetch(urlPut, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombreProducto: producto.nombreProducto,
            precioProducto: producto.precioProducto,
            precioDescuentoProducto: producto.precioDescuentoProducto ?? null,
            fechaFinDescuento: producto.fechaFinDescuento ?? null,
            detalleProducto: producto.detalleProducto,
            fotoProducto: producto.fotoProducto,
            destacadoProducto: producto.destacadoProducto,
            enOfertaProducto: producto.enOfertaProducto,
            ultimasUnidadesProducto: producto.ultimasUnidadesProducto ?? false,
            nuevoIngresoProducto: producto.nuevoIngresoProducto ?? false,
            iconoProducto: producto.iconoProducto || null,
            badgeProducto: producto.badgeProducto,
          }),
        })
          .then(() => sincronizarConBackend())
          .catch(() => {});
      }
    }
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

    if (backendEnLinea) {
      const numId = Number(idProducto.replace(/\D/g, ''));
      if (!isNaN(numId) && numId > 0) {
        fetch(`http://localhost:8080/api/productos/${numId}`, {
          method: 'DELETE',
        })
          .then(() => sincronizarConBackend())
          .catch(() => {});
      }
    }
  };

  const reactivarProducto = (idProducto: string) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.idProducto === idProducto
          ? { ...p, fechaHoraBajaProducto: null }
          : p
      )
    );

    if (backendEnLinea) {
      const numId = Number(idProducto.replace(/\D/g, ''));
      if (!isNaN(numId) && numId > 0) {
        fetch(`http://localhost:8080/api/productos/${numId}/reactivar`, {
          method: 'PATCH',
        })
          .then(() => sincronizarConBackend())
          .catch(() => {});
      }
    }
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

    if (backendEnLinea) {
      fetch('http://localhost:8080/api/promociones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codPromocion: `PROMO-${Date.now().toString().slice(-4)}`,
          nombrePromocion: data.nombrePromocion,
          detallePromocion: data.detallePromocion,
          temporadaPromocion: data.temporadaPromocion || 'Especial Primavera 2026',
          descuentoTexto: data.descuentoTextoPromocion,
          condicionPromocion: data.condicionPromocion,
          fotoCombo: data.fotoComboPromocion,
        }),
      })
        .then(() => sincronizarConBackend())
        .catch(() => {});
    }
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

    if (backendEnLinea) {
      const numId = Number(promocion.idPromocion.replace(/\D/g, ''));
      if (!isNaN(numId) && numId > 0) {
        fetch(`http://localhost:8080/api/promociones/${numId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombrePromocion: promocion.nombrePromocion,
            detallePromocion: promocion.detallePromocion,
            temporadaPromocion: promocion.temporadaPromocion,
            descuentoTexto: promocion.descuentoTextoPromocion,
            condicionPromocion: promocion.condicionPromocion,
            fotoCombo: promocion.fotoComboPromocion,
          }),
        })
          .then(() => sincronizarConBackend())
          .catch(() => {});
      }
    }
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

    if (backendEnLinea) {
      const numId = Number(idPromocion.replace(/\D/g, ''));
      if (!isNaN(numId) && numId > 0) {
        fetch(`http://localhost:8080/api/promociones/${numId}`, {
          method: 'DELETE',
        })
          .then(() => sincronizarConBackend())
          .catch(() => {});
      }
    }
  };

  const reactivarPromocion = (idPromocion: string) => {
    setPromociones((prev) =>
      prev.map((pr) =>
        pr.idPromocion === idPromocion
          ? { ...pr, fechaHoraBajaPromocion: null }
          : pr
      )
    );

    if (backendEnLinea) {
      const numId = Number(idPromocion.replace(/\D/g, ''));
      if (!isNaN(numId) && numId > 0) {
        fetch(`http://localhost:8080/api/promociones/${numId}/reactivar`, {
          method: 'PATCH',
        })
          .then(() => sincronizarConBackend())
          .catch(() => {});
      }
    }
  };

  // ABM Horarios
  const crearHorario = (data: Omit<HorarioAtencionAdmin, 'idHorarioAtencion' | 'fechaHoraBajaHA'>) => {
    const nuevo: HorarioAtencionAdmin = {
      ...data,
      idHorarioAtencion: `ha-${Date.now()}`,
      fechaHoraBajaHA: null,
    };
    setHorarios((prev) => [...prev, nuevo]);

    if (backendEnLinea) {
      fetch('http://localhost:8080/api/horarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codHA: `HA-${Date.now().toString().slice(-4)}`,
          nombreTurnoHA: data.nombreTurnoHA,
          diasTextoHA: data.diasTextoHA,
          diasSemanaHA: data.diasTextoHA,
          horaInicioHA: data.horaInicioHA || '09:00',
          horaFinHA: data.horaFinHA || '13:00',
          esCerradoHA: !!data.esCerradoHA,
          detallesHA: data.diasTextoHA,
        }),
      })
        .then(() => sincronizarConBackend())
        .catch(() => {});
    }
  };

  const editarHorario = (horario: HorarioAtencionAdmin) => {
    setHorarios((prev) =>
      prev.map((h) => (h.idHorarioAtencion === horario.idHorarioAtencion ? horario : h))
    );

    if (backendEnLinea) {
      const numId = Number(horario.idHorarioAtencion.replace(/\D/g, ''));
      if (!isNaN(numId) && numId > 0) {
        fetch(`http://localhost:8080/api/horarios/${numId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombreTurnoHA: horario.nombreTurnoHA,
            diasTextoHA: horario.diasTextoHA,
            diasSemanaHA: horario.diasTextoHA,
            horaInicioHA: horario.horaInicioHA,
            horaFinHA: horario.horaFinHA,
            esCerradoHA: !!horario.esCerradoHA,
          }),
        })
          .then(() => sincronizarConBackend())
          .catch(() => {});
      }
    }
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

    if (backendEnLinea) {
      const numId = Number(idHorarioAtencion.replace(/\D/g, ''));
      if (!isNaN(numId) && numId > 0) {
        fetch(`http://localhost:8080/api/horarios/${numId}`, {
          method: 'DELETE',
        })
          .then(() => sincronizarConBackend())
          .catch(() => {});
      }
    }
  };

  const reactivarHorario = (idHorarioAtencion: string) => {
    setHorarios((prev) =>
      prev.map((h) =>
        h.idHorarioAtencion === idHorarioAtencion
          ? { ...h, fechaHoraBajaHA: null }
          : h
      )
    );

    if (backendEnLinea) {
      const numId = Number(idHorarioAtencion.replace(/\D/g, ''));
      if (!isNaN(numId) && numId > 0) {
        fetch(`http://localhost:8080/api/horarios/${numId}/reactivar`, {
          method: 'PATCH',
        })
          .then(() => sincronizarConBackend())
          .catch(() => {});
      }
    }
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

  // Autenticación de Administrador (Conecta con Spring Boot o fallback seguro de contingencia)
  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.autenticado) {
          const userObj = {
            username: data.username || username,
            nombre: data.nombre || 'Administrador Librería Motivos',
          };
          const authToken = data.token || `token-${Date.now()}`;

          setToken(authToken);
          setAdminUser(userObj);
          setIsAuthenticated(true);

          sessionStorage.setItem('motivos_admin_token', authToken);
          sessionStorage.setItem('motivos_admin_user', JSON.stringify(userObj));
          return { success: true };
        } else {
          return {
            success: false,
            error: data.mensaje || 'Credenciales incorrectas.',
          };
        }
      } else {
        const data = await res.json().catch(() => ({}));
        return {
          success: false,
          error: data.mensaje || 'Usuario o contraseña no válidos.',
        };
      }
    } catch {
      // Contingencia local si el backend Spring Boot no está levantado
      if (
        username.trim().toLowerCase() === 'admin' &&
        password.trim() === 'motivosAdministrador2026!'
      ) {
        const userObj = {
          username: 'admin',
          nombre: 'Administrador Librería Motivos',
        };
        const fallbackToken = `token-local-${Date.now()}`;

        setToken(fallbackToken);
        setAdminUser(userObj);
        setIsAuthenticated(true);

        sessionStorage.setItem('motivos_admin_token', fallbackToken);
        sessionStorage.setItem('motivos_admin_user', JSON.stringify(userObj));
        return { success: true };
      }
      return {
        success: false,
        error: 'Credenciales inválidas. Compruebe el usuario y contraseña del sistema.',
      };
    }
  };

  const logout = () => {
    if (token) {
      fetch('http://localhost:8080/api/admin/auth/logout', {
        method: 'POST',
        headers: { 'X-Admin-Token': token },
      }).catch(() => {});
    }
    setToken(null);
    setAdminUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('motivos_admin_token');
    sessionStorage.removeItem('motivos_admin_user');
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        token,
        login,
        logout,
        backendEnLinea,
        sincronizarConBackend,
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
