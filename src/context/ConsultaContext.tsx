'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Producto } from '@/types/catalogo';

export interface ConsultaItem {
  producto: Producto;
  cantidad: number;
}

interface ConsultaContextValue {
  items: ConsultaItem[];
  totalUnidades: number;
  estaEnLista: (productoId: string) => boolean;
  toggleProducto: (producto: Producto) => void;
  actualizarCantidad: (productoId: string, delta: number) => void;
  quitarProducto: (productoId: string) => void;
  limpiarLista: () => void;
}

const STORAGE_KEY = 'libreria_motivos_lista_consulta_v1';

const ConsultaContext = createContext<ConsultaContextValue | undefined>(undefined);

export function ConsultaProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ConsultaItem[]>([]);
  const [hidratado, setHidratado] = useState(false);

  // Hidratación segura en cliente desde sessionStorage
  useEffect(() => {
    try {
      const guardado = sessionStorage.getItem(STORAGE_KEY);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignorar errores de almacenamiento en navegación privada
    } finally {
      setHidratado(true);
    }
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignorar si sessionStorage no está disponible
    }
  }, [items, hidratado]);

  const estaEnLista = useCallback(
    (productoId: string) => items.some((i) => i.producto.id === productoId),
    [items]
  );

  const toggleProducto = useCallback((producto: Producto) => {
    setItems((prev) => {
      const existe = prev.some((i) => i.producto.id === producto.id);
      if (existe) {
        return prev.filter((i) => i.producto.id !== producto.id);
      }
      return [...prev, { producto, cantidad: 1 }];
    });
  }, []);

  const actualizarCantidad = useCallback((productoId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.producto.id !== productoId) return item;
          const nuevaCantidad = item.cantidad + delta;
          return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null;
        })
        .filter((item): item is ConsultaItem => item !== null)
    );
  }, []);

  const quitarProducto = useCallback((productoId: string) => {
    setItems((prev) => prev.filter((i) => i.producto.id !== productoId));
  }, []);

  const limpiarLista = useCallback(() => {
    setItems([]);
  }, []);

  const totalUnidades = useMemo(
    () => items.reduce((acc, item) => acc + item.cantidad, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      totalUnidades,
      estaEnLista,
      toggleProducto,
      actualizarCantidad,
      quitarProducto,
      limpiarLista,
    }),
    [items, totalUnidades, estaEnLista, toggleProducto, actualizarCantidad, quitarProducto, limpiarLista]
  );

  return <ConsultaContext.Provider value={value}>{children}</ConsultaContext.Provider>;
}

export function useConsulta(): ConsultaContextValue {
  const ctx = useContext(ConsultaContext);
  if (!ctx) {
    throw new Error('useConsulta debe utilizarse dentro de un ConsultaProvider');
  }
  return ctx;
}
