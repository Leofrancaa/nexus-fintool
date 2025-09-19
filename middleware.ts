// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = [
    "/categorias",
    "/cartoes",
    "/limites",
    "/receitas",
    "/despesas",
    "/investimentos",
    "/dashboard"
];

const PUBLIC_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Verificar se é uma rota protegida
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        path.startsWith(route)
    );

    const isPublicRoute = PUBLIC_ROUTES.includes(path);

    // Para rotas protegidas, verificamos no client-side se há token
    // O middleware do Next.js não pode acessar localStorage diretamente
    if (isProtectedRoute) {
        // Adicionar header personalizado para identificar rotas protegidas
        const response = NextResponse.next();
        response.headers.set('x-protected-route', 'true');
        return response;
    }

    // Rota raiz redireciona para dashboard (será tratado no client)
    if (path === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/categorias/:path*",
        "/cartoes/:path*",
        "/limites/:path*",
        "/receitas/:path*",
        "/despesas/:path*",
        "/investimentos/:path*",
        "/dashboard/:path*",
        "/login",
        "/register",
        "/"
    ],
};