"use client"

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"

// Cria um singleton para o cliente Supabase no lado do cliente
let supabaseClient: ReturnType<typeof createClientInstance> | undefined = undefined

function createClientInstance() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL ou chave anônima não definidas")
    throw new Error("Supabase URL ou chave anônima não definidas")
  }

  try {
    console.log("Criando cliente Supabase com URL:", supabaseUrl)
    const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        // Adicionar timeout para todas as requisições
        fetch: (url, options) => {
          const controller = new AbortController()
          const { signal } = controller

          // Criar um timeout de 10 segundos
          const timeoutId = setTimeout(() => {
            controller.abort()
          }, 10000)

          return fetch(url, { ...options, signal }).finally(() => {
            clearTimeout(timeoutId)
          })
        },
      },
    })

    return client
  } catch (error) {
    console.error("Erro ao criar cliente Supabase:", error)
    throw error
  }
}

// Cliente para uso no lado do cliente
export function getSupabaseClient() {
  // Verificar se estamos no lado do cliente
  if (typeof window === "undefined") {
    throw new Error("getSupabaseClient deve ser usado apenas no lado do cliente")
  }

  if (!supabaseClient) {
    try {
      supabaseClient = createClientInstance()
    } catch (error) {
      console.error("Erro ao inicializar cliente Supabase:", error)
      throw error
    }
  }

  return supabaseClient
}

// Cliente para uso no lado do servidor
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL ou chave anônima não definidas")
    throw new Error("Supabase URL ou chave anônima não definidas")
  }

  try {
    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
      global: {
        // Adicionar timeout para todas as requisições
        fetch: (url, options) => {
          const controller = new AbortController()
          const { signal } = controller

          // Criar um timeout de 10 segundos
          const timeoutId = setTimeout(() => {
            controller.abort()
          }, 10000)

          return fetch(url, { ...options, signal }).finally(() => {
            clearTimeout(timeoutId)
          })
        },
      },
    })
  } catch (error) {
    console.error("Erro ao criar cliente Supabase para servidor:", error)
    throw error
  }
}
