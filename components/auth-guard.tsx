"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"

// Rotas que requerem autenticação
const protectedRoutes = ["/dashboard", "/profile"]

// Rotas que não devem ser acessadas quando autenticado
const authRoutes = ["/login", "/register"]

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Não fazer nada enquanto estiver carregando
    if (isLoading) return

    // Evitar redirecionamentos múltiplos
    if (isRedirecting) return

    // Verificar se a rota atual é protegida
    if (protectedRoutes.includes(pathname) && !user) {
      console.log("Rota protegida acessada sem autenticação, redirecionando para login")
      setIsRedirecting(true)
      router.push("/login")
      return
    }

    // Verificar se a rota atual é de autenticação
    if (authRoutes.includes(pathname) && user) {
      console.log("Rota de autenticação acessada com autenticação, redirecionando para dashboard")
      setIsRedirecting(true)
      router.push("/dashboard")
      return
    }
  }, [isLoading, user, pathname, router, isRedirecting])

  // Mostrar indicador de carregamento enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Mostrar indicador de carregamento durante redirecionamento
  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
