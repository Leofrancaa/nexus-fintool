import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/categorias", "/cartoes", "/limites", "/receitas", "/despesas", "/investimentos", "/dashboard"];

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    const isProtected = PROTECTED_ROUTES.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/categorias", "/cartoes", "/limites", "/receitas", "/despesas", "/investimentos", "/dashboard"],
};
