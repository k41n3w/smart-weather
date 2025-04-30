"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"
import { getSupabaseClient } from "./supabase"
import type { UserProfile } from "@/types/user"
import { Loader2 } from "lucide-react"

// Contexto de autenticação
interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Usar ref para evitar múltiplas inicializações
  const initialized = useRef(false)
  const redirecting = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Garantir que o componente só seja renderizado no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Função para buscar o perfil do usuário com timeout
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("AuthProvider: Buscando perfil do usuário:", userId)

      const supabase = getSupabaseClient()

      // Criar uma promessa com timeout
      const profilePromise = supabase
        .schema("smart_weather")
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single()

      const timeoutPromise = new Promise((_, reject) => {
        const id = setTimeout(() => {
          clearTimeout(id)
          reject(new Error("Timeout ao buscar perfil do usuário"))
        }, 5000)
      })

      // Usar Promise.race para implementar o timeout
      const { data, error } = (await Promise.race([
        profilePromise,
        timeoutPromise.then(() => {
          throw new Error("Timeout ao buscar perfil do usuário")
        }),
      ])) as any

      if (error) {
        console.error("AuthProvider: Erro ao buscar perfil do usuário:", error)
        setProfile(null)
        return
      }

      if (!data) {
        console.error("AuthProvider: Perfil não encontrado para o usuário:", userId)
        setProfile(null)
        return
      }

      console.log("AuthProvider: Perfil encontrado:", data)
      setProfile(data)
    } catch (error) {
      console.error("AuthProvider: Erro ao buscar perfil do usuário:", error)
      setProfile(null)
    }
  }

  // Inicializar autenticação
  useEffect(() => {
    if (!isClient || initialized.current) return

    initialized.current = true
    console.log("AuthProvider: Inicializando autenticação")

    // Configurar um timeout global para evitar carregamento infinito
    timeoutRef.current = setTimeout(() => {
      console.log("AuthProvider: Timeout global atingido, finalizando carregamento")
      setIsLoading(false)
    }, 10000)

    const fetchSession = async () => {
      try {
        const supabase = getSupabaseClient()

        // Criar uma promessa com timeout para getSession
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => {
          const id = setTimeout(() => {
            clearTimeout(id)
            reject(new Error("Timeout ao buscar sessão"))
          }, 5000)
        })

        // Usar Promise.race para implementar o timeout
        const {
          data: { session: activeSession },
          error,
        } = (await Promise.race([
          sessionPromise,
          timeoutPromise.then(() => {
            throw new Error("Timeout ao buscar sessão")
          }),
        ])) as any

        if (error) {
          console.error("AuthProvider: Erro ao buscar sessão:", error)
          setIsLoading(false)
          return
        }

        console.log("AuthProvider: Sessão:", activeSession ? "Ativa" : "Inativa")
        setSession(activeSession)

        if (activeSession?.user) {
          console.log("AuthProvider: Usuário encontrado na sessão:", activeSession.user.id)
          setUser(activeSession.user)
          await fetchUserProfile(activeSession.user.id)
        } else {
          console.log("AuthProvider: Nenhum usuário na sessão")
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        console.error("AuthProvider: Erro ao buscar sessão:", error)
      } finally {
        setIsLoading(false)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }

    fetchSession()

    // Configurar listener para mudanças de autenticação
    const supabase = getSupabaseClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("AuthProvider: Evento de autenticação:", event)
      setSession(newSession)

      if (newSession?.user) {
        console.log("AuthProvider: Usuário atualizado:", newSession.user.id)
        setUser(newSession.user)
        await fetchUserProfile(newSession.user.id)

        if (event === "SIGNED_IN" && !redirecting.current) {
          // Redirecionar para o dashboard após login
          console.log("AuthProvider: Redirecionando para dashboard após SIGNED_IN")
          redirecting.current = true
          router.push("/dashboard")
        }
      } else {
        console.log("AuthProvider: Usuário removido")
        setUser(null)
        setProfile(null)

        if (event === "SIGNED_OUT" && !redirecting.current) {
          // Redirecionar para a página inicial após logout
          console.log("AuthProvider: Redirecionando para página inicial após SIGNED_OUT")
          redirecting.current = true
          router.push("/")
        }
      }
    })

    return () => {
      console.log("AuthProvider: Limpando subscription")
      subscription.unsubscribe()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isClient, router])

  const signOut = async () => {
    try {
      const supabase = getSupabaseClient()
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setSession(null)
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id)
    }
  }

  // Mostrar loader enquanto verifica se está no cliente
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando...</span>
      </div>
    )
  }

  // Contexto de autenticação
  const authContextValue: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
