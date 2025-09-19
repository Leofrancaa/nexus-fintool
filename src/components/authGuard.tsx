// src/components/authGuard.tsx - Versão simplificada
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

const PROTECTED_ROUTES = [
  "/categorias",
  "/cartoes",
  "/limites",
  "/receitas",
  "/despesas",
  "/investimentos",
  "/dashboard",
];

const PUBLIC_ROUTES = ["/login", "/register"];

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();

      const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
      );
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

      // Se estiver em rota protegida sem autenticação -> login
      if (isProtectedRoute && !authenticated) {
        router.replace("/login");
        return;
      }

      // Se estiver em rota pública com autenticação -> dashboard
      if (isPublicRoute && authenticated) {
        router.replace("/dashboard");
        return;
      }

      setIsLoading(false);
    };

    // Pequeno delay para evitar race conditions
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E1116]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D4AA]"></div>
          <p className="text-white text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
