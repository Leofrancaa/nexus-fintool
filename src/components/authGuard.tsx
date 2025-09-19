// src/components/AuthGuard.tsx
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
  const [isAuthed, setIsAuthed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuthed(authenticated);

      const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
      );
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

      if (isProtectedRoute && !authenticated) {
        // Rota protegida sem autenticação -> login
        router.replace("/login");
        return;
      }

      if (isPublicRoute && authenticated) {
        // Rota pública com autenticação -> dashboard
        router.replace("/dashboard");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Loading state
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
