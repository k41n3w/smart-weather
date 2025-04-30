"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase"
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

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}

// Componente principal de providers
export function Providers({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [profileError, setProfileError] = useState<Error | null>(null)
  const [debugLogs, setDebugLogs] = useState<string[]>([])

  // Usar ref para evitar múltiplas inicializações
  const initialized = useRef(false)
  const redirecting = useRef(false)
  const authCheckAttempts = useRef(0)

  // Função para adicionar logs
  const addLog = (message: string) => {
    console.log(`Providers: ${message}`)
    setDebugLogs((prev) => [...prev, `[${new Date().toISOString()}] ${message}`])
  }

  // Garantir que o componente só seja renderizado no cliente
  useEffect(() => {
    setIsClient(true)
    addLog("Cliente detectado")
  }, [])

  // Função para buscar o perfil do usuário
  const fetchUserProfile = async (userId: string) => {
    try {
      addLog(`Buscando perfil do usuário: ${userId}`)
      setProfileError(null)

      const supabase = getSupabaseClient()

      // Adicionar logs detalhados para depuração
      addLog("Iniciando consulta ao Supabase para perfil")

      const { data, error } = await supabase
        .schema("smart_weather")
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single()

      addLog("Consulta ao Supabase concluída")

      if (error) {
        addLog(`Erro ao buscar perfil do usuário: ${error.message}`)
        setProfileError(new Error(error.message))
        setProfile(null)

        // Mesmo com erro, continuar o fluxo
        addLog("Continuando fluxo mesmo com erro no perfil")
        handlePostProfileFetch(userId)
        return
      }

      if (!data) {
        addLog(`Perfil não encontrado para o usuário: ${userId}`)
        setProfileError(new Error("Perfil não encontrado"))
        setProfile(null)

        // Mesmo sem perfil, continuar o fluxo
        addLog("Continuando fluxo mesmo sem perfil")
        handlePostProfileFetch(userId)
        return
      }

      addLog(`Perfil encontrado: ${JSON.stringify(data)}`)
      setProfile(data)

      // Continuar o fluxo após obter o perfil
      handlePostProfileFetch(userId)
    } catch (error) {
      addLog(`Erro ao buscar perfil do usuário: ${error instanceof Error ? error.message : String(error)}`)
      setProfileError(error instanceof Error ? error : new Error(String(error)))
      setProfile(null)

      // Mesmo com exceção, continuar o fluxo
      addLog("Continuando fluxo mesmo com exceção")
      handlePostProfileFetch(null)
    }
  }

  // Função para lidar com o fluxo após buscar o perfil
  const handlePostProfileFetch = (userId: string | null) => {
    addLog("Processando pós-busca de perfil")

    // Finalizar carregamento
    setIsLoading(false)

    // Verificar se deve redirecionar
    const pathname = window.location.pathname

    if ((pathname === "/login" || pathname === "/register") && !redirecting.current) {
      addLog("Redirecionando para dashboard da página de login")
      redirecting.current = true

      // Usar setTimeout para garantir que o estado foi atualizado
      setTimeout(() => {
        addLog("Executando redirecionamento para dashboard")
        window.location.href = "/dashboard"
      }, 100)
    }
  }

  // Inicializar autenticação
  useEffect(() => {
    if (!isClient || initialized.current) {
      return
    }

    initialized.current = true
    addLog("Inicializando autenticação")

    const fetchSession = async () => {
      // Limitar tentativas para evitar loops
      authCheckAttempts.current += 1
      if (authCheckAttempts.current > 3) {
        addLog(`Limite de tentativas de verificação de autenticação atingido (${authCheckAttempts.current})`)
        setIsLoading(false)
        return
      }

      addLog(`Verificando sessão (tentativa ${authCheckAttempts.current})`)

      try {
        const supabase = getSupabaseClient()

        // Verificar se há uma sessão ativa
        const {
          data: { session: activeSession },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          addLog(`Erro ao buscar sessão: ${error.message}`)
          setIsLoading(false)
          return
        }

        addLog(`Sessão: ${activeSession ? "Ativa" : "Inativa"}`)
        setSession(activeSession)

        if (activeSession?.user) {
          addLog(`Usuário encontrado na sessão: ${activeSession.user.id}`)
          setUser(activeSession.user)

          // Buscar perfil do usuário
          await fetchUserProfile(activeSession.user.id)
        } else {
          addLog("Nenhum usuário na sessão")
          setUser(null)
          setProfile(null)
          setIsLoading(false)

          // Verificar se está em uma página protegida e redirecionar se necessário
          const pathname = window.location.pathname
          if ((pathname === "/dashboard" || pathname === "/profile") && !redirecting.current) {
            addLog("Redirecionando para login da página protegida")
            redirecting.current = true
            window.location.href = "/login"
          }
        }
      } catch (error) {
        addLog(`Erro ao buscar sessão: ${error instanceof Error ? error.message : String(error)}`)
        setIsLoading(false)
      }
    }

    fetchSession()

    // Configurar listener para mudanças de autenticação
    const supabase = getSupabaseClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      addLog(`Evento de autenticação: ${event}`)

      // Ignorar eventos duplicados
      if (event === "INITIAL_SESSION") {
        addLog("Ignorando evento INITIAL_SESSION")
        return
      }

      setSession(newSession)

      if (newSession?.user) {
        addLog(`Usuário atualizado: ${newSession.user.id}`)
        setUser(newSession.user)

        if (event === "SIGNED_IN") {
          // Buscar perfil após login
          await fetchUserProfile(newSession.user.id)
        }
      } else {
        addLog("Usuário removido")
        setUser(null)
        setProfile(null)
        setIsLoading(false)

        if (event === "SIGNED_OUT" && !redirecting.current) {
          // Redirecionar para a página inicial após logout
          addLog("Redirecionando para página inicial após SIGNED_OUT")
          redirecting.current = true
          window.location.href = "/"
        }
      }
    })

    return () => {
      addLog("Limpando subscription")
      subscription.unsubscribe()
    }
  }, [isClient])

  const signOut = async () => {
    try {
      addLog("Iniciando processo de logout")
      const supabase = getSupabaseClient()
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setSession(null)
      addLog("Logout concluído")

      if (!redirecting.current) {
        redirecting.current = true
        addLog("Redirecionando para página inicial após logout")
        window.location.href = "/"
      }
    } catch (error) {
      addLog(`Erro ao fazer logout: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      addLog(`Atualizando perfil para usuário: ${user.id}`)
      await fetchUserProfile(user.id)
    } else {
      addLog("Tentativa de atualizar perfil sem usuário autenticado")
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
