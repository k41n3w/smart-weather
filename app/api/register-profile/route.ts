import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import type { Database } from "@/types/database.types"

export async function POST(request: Request) {
  try {
    console.log("=== INÍCIO DO PROCESSO DE REGISTRO DE PERFIL ===")

    const body = await request.json()
    const { userId, name, email, city, profile_type } = body

    console.log("Dados recebidos:", { userId, name, email, city, profile_type })

    if (!userId || !name || !email || !city || !profile_type) {
      console.log("Erro: Dados incompletos")
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Verificar se as variáveis de ambiente estão definidas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Erro: Variáveis de ambiente não configuradas corretamente")
      return NextResponse.json({ error: "Configuração do servidor incompleta" }, { status: 500 })
    }

    console.log("Criando cliente Supabase com service role key")

    // Criar cliente Supabase com service role key
    const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log("Cliente Supabase criado com sucesso")
    console.log("Criando perfil para usuário:", userId)

    // Tentar inserir no schema smart_weather
    let profileCreated = false
    try {
      console.log("Tentando inserir no schema smart_weather")
      const { data: profileData, error: profileError } = await supabaseAdmin
        .schema("smart_weather")
        .from("user_profiles")
        .insert({
          id: userId,
          name,
          email,
          city,
          country: "Brasil",
          profile_type,
        })
        .select()

      if (profileError) {
        console.error("Erro ao inserir perfil no schema smart_weather:", profileError)
        console.log("Detalhes completos do erro:", JSON.stringify(profileError, null, 2))
      } else {
        console.log("Perfil criado com sucesso no schema smart_weather:", profileData)
        profileCreated = true
      }
    } catch (error) {
      console.error("Exceção ao criar perfil no schema smart_weather:", error)
      console.log("Detalhes completos da exceção:", JSON.stringify(error, null, 2))
    }

    // Se falhou no schema smart_weather, tentar no schema public
    if (!profileCreated) {
      try {
        console.log("Tentando inserir no schema public")
        const { data: profileData, error: profileError } = await supabaseAdmin
          .from("user_profiles")
          .insert({
            id: userId,
            name,
            email,
            city,
            country: "Brasil",
            profile_type,
          })
          .select()

        if (profileError) {
          console.error("Erro ao inserir perfil no schema public:", profileError)
          console.log("Detalhes completos do erro:", JSON.stringify(profileError, null, 2))
        } else {
          console.log("Perfil criado com sucesso no schema public:", profileData)
          profileCreated = true
        }
      } catch (error) {
        console.error("Exceção ao criar perfil no schema public:", error)
        console.log("Detalhes completos da exceção:", JSON.stringify(error, null, 2))
      }
    }

    if (!profileCreated) {
      console.log("Falha ao criar perfil em ambos os schemas")
      return NextResponse.json({ error: "Não foi possível criar o perfil do usuário" }, { status: 500 })
    }

    // Criar preferências do usuário no schema smart_weather
    let preferencesCreated = false
    try {
      console.log("Tentando criar preferências do usuário no schema smart_weather")
      const { data: prefData, error: preferencesError } = await supabaseAdmin
        .schema("smart_weather")
        .from("user_preferences")
        .insert({
          user_id: userId,
          temperature_unit: "C",
          theme: "light",
          notifications_enabled: true,
        })
        .select()

      if (preferencesError) {
        console.error("Erro ao criar preferências no schema smart_weather:", preferencesError)
        console.log("Detalhes completos do erro:", JSON.stringify(preferencesError, null, 2))
      } else {
        console.log("Preferências criadas com sucesso no schema smart_weather:", prefData)
        preferencesCreated = true
      }
    } catch (error) {
      console.error("Exceção ao criar preferências no schema smart_weather:", error)
      console.log("Detalhes completos da exceção:", JSON.stringify(error, null, 2))
    }

    // Se falhou no schema smart_weather, tentar no schema public
    if (!preferencesCreated) {
      try {
        console.log("Tentando criar preferências do usuário no schema public")
        const { data: prefData, error: preferencesError } = await supabaseAdmin
          .from("user_preferences")
          .insert({
            user_id: userId,
            temperature_unit: "C",
            theme: "light",
            notifications_enabled: true,
          })
          .select()

        if (preferencesError) {
          console.error("Erro ao criar preferências no schema public:", preferencesError)
          console.log("Detalhes completos do erro:", JSON.stringify(preferencesError, null, 2))
        } else {
          console.log("Preferências criadas com sucesso no schema public:", prefData)
          preferencesCreated = true
        }
      } catch (error) {
        console.error("Exceção ao criar preferências no schema public:", error)
        console.log("Detalhes completos da exceção:", JSON.stringify(error, null, 2))
      }
    }

    // Criar localização do usuário no schema smart_weather
    let locationCreated = false
    try {
      console.log("Tentando criar localização do usuário no schema smart_weather")
      const { data: locData, error: locationError } = await supabaseAdmin
        .schema("smart_weather")
        .from("user_locations")
        .insert({
          user_id: userId,
          city,
          country: "Brasil",
          is_default: true,
        })
        .select()

      if (locationError) {
        console.error("Erro ao criar localização no schema smart_weather:", locationError)
        console.log("Detalhes completos do erro:", JSON.stringify(locationError, null, 2))
      } else {
        console.log("Localização criada com sucesso no schema smart_weather:", locData)
        locationCreated = true
      }
    } catch (error) {
      console.error("Exceção ao criar localização no schema smart_weather:", error)
      console.log("Detalhes completos da exceção:", JSON.stringify(error, null, 2))
    }

    // Se falhou no schema smart_weather, tentar no schema public
    if (!locationCreated) {
      try {
        console.log("Tentando criar localização do usuário no schema public")
        const { data: locData, error: locationError } = await supabaseAdmin
          .from("user_locations")
          .insert({
            user_id: userId,
            city,
            country: "Brasil",
            is_default: true,
          })
          .select()

        if (locationError) {
          console.error("Erro ao criar localização no schema public:", locationError)
          console.log("Detalhes completos do erro:", JSON.stringify(locationError, null, 2))
        } else {
          console.log("Localização criada com sucesso no schema public:", locData)
          locationCreated = true
        }
      } catch (error) {
        console.error("Exceção ao criar localização no schema public:", error)
        console.log("Detalhes completos da exceção:", JSON.stringify(error, null, 2))
      }
    }

    // Criar tabelas se necessário
    if (!preferencesCreated || !locationCreated) {
      try {
        console.log("Tentando criar tabelas ausentes")

        // Verificar e criar tabela user_preferences se necessário
        if (!preferencesCreated) {
          console.log("Tentando criar tabela user_preferences no schema public")
          await supabaseAdmin.rpc("create_user_preferences_if_not_exists")
        }

        // Verificar e criar tabela user_locations se necessário
        if (!locationCreated) {
          console.log("Tentando criar tabela user_locations no schema public")
          await supabaseAdmin.rpc("create_user_locations_if_not_exists")
        }

        // Tentar novamente após criar as tabelas
        if (!preferencesCreated) {
          console.log("Tentando criar preferências novamente após criar tabela")
          await supabaseAdmin.from("user_preferences").insert({
            user_id: userId,
            temperature_unit: "C",
            theme: "light",
            notifications_enabled: true,
          })
        }

        if (!locationCreated) {
          console.log("Tentando criar localização novamente após criar tabela")
          await supabaseAdmin.from("user_locations").insert({
            user_id: userId,
            city,
            country: "Brasil",
            is_default: true,
          })
        }
      } catch (error) {
        console.error("Erro ao criar tabelas:", error)
        console.log("Detalhes completos do erro:", JSON.stringify(error, null, 2))
        // Não interromper o fluxo se a criação de tabelas falhar
      }
    }

    console.log("=== FIM DO PROCESSO DE REGISTRO DE PERFIL ===")
    return NextResponse.json({
      success: true,
      profileCreated,
      preferencesCreated,
      locationCreated,
      message: "Perfil criado com sucesso. Preferências e localização podem requerer configuração adicional.",
    })
  } catch (error) {
    console.error("Erro não tratado no servidor:", error)
    console.log("Detalhes completos do erro não tratado:", JSON.stringify(error, null, 2))
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
