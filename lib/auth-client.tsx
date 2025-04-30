"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User, Session } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"
import type { UserProfile } from "@/types/user"

// Contexto de autenticação
type AuthContextType = {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  isLoading: boolean
  error: Error | null
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Função para criar cliente Supabase
const createSupabaseClient = () => {
  return createClientComponentClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    options: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        fetch: (...args) => {
          const [url, options] = args
          const controller = new AbortController()
          const { signal } = controller

          // Timeout de 8 segundos
          const timeoutId = setTimeout(() => controller.abort(), 8000)

          return fetch(url as string, {
            ...(options as RequestInit),
            signal,
          }).finally(() => clearTimeout(timeoutId))
        },
      },
    },
  })
}

// Chave para armazenar o perfil no localStorage
const PROFILE_STORAGE_KEY = "user_profile_cache"

// Provider de autenticação
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [supabase] = useState(() => createSupabaseClient())
  const [isInitialized, setIsInitialized] = useState(false)

  // Função para buscar perfil do usuário
  const fetchUserProfile = useCallback(
    async (userId: string) => {
      try {
        console.log("Buscando perfil do usuário:", userId)

        // Primeiro, tentar carregar do cache
        try {
          const cachedProfile = localStorage.getItem(PROFILE_STORAGE_KEY)
          if (cachedProfile) {
            const parsed = JSON.parse(cachedProfile)
            if (parsed.id === userId) {
              console.log("Perfil carregado do cache")
              setProfile(parsed)
              return parsed
            }
          }
        } catch (e) {
          console.warn("Erro ao acessar cache:", e)
        }

        // Se não tiver no cache, buscar do Supabase
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const { data, error } = await supabase
          .schema("smart_weather")
          .from("user_profiles")
          .select("*")
          .eq("id", userId)
          .single()
          .abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (error) {
          console.error("Erro ao buscar perfil:", error)
          throw error
        }

        if (!data) {
          throw new Error("Perfil não encontrado")
        }

        console.log("Perfil carregado com sucesso:", data)

        // Salvar no cache
        try {
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data))
        } catch (e) {
          console.warn("Erro ao salvar no cache:", e)
        }

        setProfile(data)
        return data
      } catch (e) {
        console.error("Erro ao buscar perfil:", e)

        // Se for erro de timeout, tentar usar cache
        if (e instanceof DOMException && e.name === "AbortError") {
          try {
            const cachedProfile = localStorage.getItem(PROFILE_STORAGE_KEY)
            if (cachedProfile) {
              const parsed = JSON.parse(cachedProfile)
              if (parsed.id === userId) {
                console.log("Usando perfil do cache após timeout")
                setProfile(parsed)
                return parsed
              }
            }
          } catch (cacheError) {
            console.warn("Erro ao acessar cache após timeout:", cacheError)
          }
        }

        throw e
      }
    },
    [supabase],
  )

  // Inicializar autenticação
  useEffect(() => {
    if (isInitialized) return
    setIsInitialized(true)

    const initAuth = async () => {
      try {
        console.log("Inicializando autenticação")

        // Verificar sessão atual com timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        try {
          const { data, error } = await supabase.auth.getSession()
          clearTimeout(timeoutId)

          if (error) throw error

          const currentSession = data?.session
          setSession(currentSession)

          if (currentSession?.user) {
            setUser(currentSession.user)

            // Tentar carregar perfil
            try {
              await fetchUserProfile(currentSession.user.id)
            } catch (profileError) {
              console.error("Erro ao carregar perfil inicial:", profileError)
              // Continuar mesmo com erro no perfil
            }
          }
        } catch (e) {
          console.error("Erro ao verificar sessão:", e)

          // Se for timeout, tentar carregar do localStorage
          if (e instanceof DOMException && e.name === "AbortError") {
            console.log("Timeout ao verificar sessão, tentando localStorage")

            try {
              // Verificar se há dados de autenticação no localStorage
              const cachedProfile = localStorage.getItem(PROFILE_STORAGE_KEY)
              if (cachedProfile) {
                const parsed = JSON.parse(cachedProfile)
                console.log("Usando perfil do cache após timeout de sessão")
                setProfile(parsed)
              }
            } catch (cacheError) {
              console.warn("Erro ao acessar cache após timeout de sessão:", cacheError)
            }
          }
        }

        // Configurar listener para mudanças de autenticação
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          console.log("Evento de autenticação:", event)

          // Ignorar eventos duplicados
          if (event === "INITIAL_SESSION") return

          setSession(newSession)

          if (newSession?.user) {
            setUser(newSession.user)

            if (event === "SIGNED_IN") {
              try {
                await fetchUserProfile(newSession.user.id)
              } catch (profileError) {
                console.error("Erro ao carregar perfil após login:", profileError)
              }
            }
          } else {
            setUser(null)
            setProfile(null)

            // Limpar cache ao fazer logout
            if (event === "SIGNED_OUT") {
              try {
                localStorage.removeItem(PROFILE_STORAGE_KEY)
              } catch (e) {
                console.warn("Erro ao limpar cache:", e)
              }
            }
          }
        })

        return () => {
          subscription.unsubscribe()
        }
      } catch (e) {
        console.error("Erro na inicialização da autenticação:", e)
        setError(e instanceof Error ? e : new Error(String(e)))
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [supabase, fetchUserProfile, isInitialized])

  // Função para fazer logout
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setSession(null)

      // Limpar cache
      try {
        localStorage.removeItem(PROFILE_STORAGE_KEY)
      } catch (e) {
        console.warn("Erro ao limpar cache durante logout:", e)
      }
    } catch (e) {
      console.error("Erro ao fazer logout:", e)
      throw e
    }
  }, [supabase])

  // Função para atualizar perfil
  const refreshProfile = useCallback(async () => {
    if (!user) return

    try {
      await fetchUserProfile(user.id)
    } catch (e) {
      console.error("Erro ao atualizar perfil:", e)
    }
  }, [user, fetchUserProfile])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        error,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }

  return context
}
