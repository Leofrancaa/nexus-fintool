import { NextRequest, NextResponse } from 'next/server'

// Define rotas públicas (não precisam de login)
const publicPaths = ['/login', '/register']

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const path = request.nextUrl.pathname

    const isPublic = publicPaths.includes(path)

    if (!token && !isPublic) {
        // Redireciona para login se tentar acessar rota privada sem token
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token && path === '/login') {
        // Se já estiver logado e tentar acessar /login, redireciona pro dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard',
        '/categorias',
        '/despesas',
        '/receitas',
        '/investimentos',
        '/',         // raiz redireciona para login
        '/login',    // protegida contra acesso se já tiver token
        '/register',
    ],
}
