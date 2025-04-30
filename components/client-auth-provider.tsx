"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

// Criar contexto de autenticação
const AuthContext = createContext<{
  user: User | null
  loading: boolean
}>({
  user: null,
  loading: true,
})

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}

// Provedor de autenticação para o lado do cliente
export function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se estamos no lado do cliente
    if (typeof window === "undefined") return

    try {
      const supabase = getSupabaseClient()

      // Verificar sessão atual
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user || null)
        setLoading(false)
      })

      // Configurar listener para mudanças de autenticação
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      })

      // Limpar subscription quando o componente for desmontado
      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error("Erro ao inicializar AuthProvider:", error)
      setLoading(false)
    }
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}
