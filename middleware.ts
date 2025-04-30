// Este arquivo está sendo substituído pelo componente AuthGuard
// Mantido apenas para referência

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rotas que requerem autenticação
const protectedRoutes = ["/dashboard", "/profile"]

// Rotas que não devem ser acessadas quando autenticado
const authRoutes = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  // Middleware desativado - usando AuthGuard no cliente
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
