"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { apiRequest } from "@/lib/auth";
import type { Categoria } from "@/types/category";

// Cache simples em memória por tipo de categoria
const cache: Record<string, { data: Categoria[]; timestamp: number }> = {};
const CACHE_TTL = 60_000; // 1 minuto

export function useCategories(tipo?: "despesa" | "receita") {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const cacheKey = tipo ?? "all";
  const mountedRef = useRef(true);

  const fetchCategories = useCallback(async (force = false) => {
    const cached = cache[cacheKey];
    if (!force && cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setCategorias(cached.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const url = tipo ? `/api/categories?tipo=${tipo}` : "/api/categories";
      const res = await apiRequest(url);
      if (!res.ok) return;
      const data = await res.json();
      const result: Categoria[] = data.data || [];

      cache[cacheKey] = { data: result, timestamp: Date.now() };

      if (mountedRef.current) {
        setCategorias(result);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [tipo, cacheKey]);

  useEffect(() => {
    mountedRef.current = true;
    fetchCategories();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchCategories]);

  // Invalida o cache e recarrega (útil após criar nova categoria)
  const invalidate = useCallback(() => {
    delete cache[cacheKey];
    fetchCategories(true);
  }, [cacheKey, fetchCategories]);

  return { categorias, loading, invalidate };
}
