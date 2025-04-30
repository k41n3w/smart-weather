import type { Recommendation } from "@/types/recommendation"
import { getSupabaseClient } from "@/lib/supabase"
import type { ProfileType } from "@/types/user"

/**
 * Busca recomendações com base no tipo de perfil, condição climática e temperatura
 */
export async function fetchRecommendations(
  profileType: ProfileType,
  weatherCondition: string,
  temperature: number,
): Promise<Recommendation | null> {
  try {
    const supabase = getSupabaseClient()

    // Buscar recomendações que correspondam ao perfil e condição climática
    const { data, error } = await supabase
      .schema("smart_weather")
      .from("recommendations")
      .select("*")
      .eq("profile_type", profileType)
      .eq("weather_condition", weatherCondition.toLowerCase())
      .or(`temperature_min.lte.${temperature},temperature_min.is.null`)
      .or(`temperature_max.gte.${temperature},temperature_max.is.null`)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error || !data || data.length === 0) {
      console.log("Nenhuma recomendação específica encontrada, buscando recomendação genérica")

      // Se não encontrar uma recomendação específica, buscar uma recomendação genérica para o perfil
      const { data: genericData, error: genericError } = await supabase
        .schema("smart_weather")
        .from("recommendations")
        .select("*")
        .eq("profile_type", profileType)
        .is("weather_condition", null)
        .order("created_at", { ascending: false })
        .limit(1)

      if (genericError || !genericData || genericData.length === 0) {
        console.log("Nenhuma recomendação genérica encontrada")
        return null
      }

      return genericData[0] as Recommendation
    }

    return data[0] as Recommendation
  } catch (error) {
    console.error("Erro ao buscar recomendações:", error)
    return null
  }
}

/**
 * Função para gerar recomendações de fallback caso não haja recomendações no banco de dados
 */
export function generateFallbackRecommendation(
  profileType: ProfileType,
  weatherCondition: string,
  temperature: number,
): Recommendation {
  // Recomendações padrão baseadas no perfil e condição climática
  const fallbackRecommendations: Record<ProfileType, Record<string, Partial<Recommendation>>> = {
    athlete: {
      rainy: {
        title: "Clima desfavorável para atividades ao ar livre",
        description: "A chuva pode afetar seu desempenho e aumentar o risco de lesões.",
        tips: [
          "Considere treinar em ambiente fechado hoje",
          "Se precisar treinar ao ar livre, use roupas impermeáveis",
          "Evite áreas com poças d'água e superfícies escorregadias",
          "Reduza a intensidade do treino devido às condições adversas",
        ],
        warning: "Risco de hipotermia em exposição prolongada à chuva",
      },
      sunny: {
        title: "Bom clima para atividades ao ar livre",
        description: "Aproveite o dia ensolarado para suas atividades físicas.",
        tips: [
          "Use protetor solar e roupas leves",
          "Mantenha-se hidratado durante o treino",
          "Evite os horários de pico de calor (entre 11h e 15h)",
          "Leve água extra e considere paradas para descanso",
        ],
        warning: temperature > 30 ? "Risco de insolação em exposição prolongada ao sol" : null,
      },
      default: {
        title: "Recomendações para seu treino",
        description: "Dicas gerais para suas atividades físicas hoje.",
        tips: [
          "Verifique a previsão do tempo antes de sair",
          "Vista-se adequadamente para as condições climáticas",
          "Mantenha-se hidratado",
          "Tenha um plano alternativo caso o clima mude",
        ],
        warning: null,
      },
    },
    driver: {
      rainy: {
        title: "Condições adversas para direção",
        description: "A chuva reduz a visibilidade e a aderência dos pneus.",
        tips: [
          "Reduza a velocidade e aumente a distância de seguimento",
          "Ligue os faróis baixos para melhorar a visibilidade",
          "Evite freadas bruscas e manobras repentinas",
          "Verifique o funcionamento dos limpadores de para-brisa",
        ],
        warning: "Risco de aquaplanagem em áreas com acúmulo de água",
      },
      stormy: {
        title: "Alerta de tempestade",
        description: "Condições perigosas para direção devido à tempestade.",
        tips: [
          "Evite deslocamentos não essenciais",
          "Se estiver dirigindo, procure um local seguro para parar",
          "Mantenha distância de árvores e estruturas que possam cair",
          "Fique atento a alagamentos e bloqueios nas vias",
        ],
        warning: "Risco de alagamentos e queda de árvores",
      },
      default: {
        title: "Recomendações para sua viagem",
        description: "Dicas gerais para uma direção segura hoje.",
        tips: [
          "Verifique as condições das estradas antes de sair",
          "Mantenha seu veículo em boas condições",
          "Respeite os limites de velocidade",
          "Tenha rotas alternativas em mente",
        ],
        warning: null,
      },
    },
    farmer: {
      rainy: {
        title: "Chuva favorável para cultivos",
        description: "Aproveite a umidade para atividades específicas.",
        tips: [
          "Bom momento para plantio de determinadas culturas",
          "Verifique sistemas de drenagem para evitar alagamentos",
          "Adie aplicação de defensivos que podem ser lavados pela chuva",
          "Monitore o acúmulo de água em áreas sensíveis",
        ],
        warning: null,
      },
      sunny: {
        title: "Dia favorável para atividades ao ar livre",
        description: "Aproveite o clima seco para tarefas específicas.",
        tips: [
          "Bom momento para colheita e secagem de grãos",
          "Ideal para aplicação de defensivos (sem vento forte)",
          "Verifique a irrigação das culturas sensíveis ao calor",
          "Proteja trabalhadores do sol forte com pausas e hidratação",
        ],
        warning: temperature > 32 ? "Risco de estresse hídrico em culturas sensíveis" : null,
      },
      default: {
        title: "Recomendações para suas atividades agrícolas",
        description: "Dicas gerais para o manejo da propriedade hoje.",
        tips: [
          "Planeje as atividades de acordo com a previsão do tempo",
          "Priorize tarefas que se adequem às condições climáticas atuais",
          "Mantenha equipamentos preparados para mudanças no clima",
          "Monitore culturas sensíveis às variações climáticas",
        ],
        warning: null,
      },
    },
    tourist: {
      rainy: {
        title: "Atividades para dia chuvoso",
        description: "Não deixe a chuva atrapalhar sua experiência turística.",
        tips: [
          "Visite museus, galerias e centros culturais",
          "Experimente a gastronomia local em restaurantes e cafés",
          "Aproveite atividades indoor como cinema, teatro ou shopping",
          "Leve um guarda-chuva ou capa de chuva para deslocamentos",
        ],
        warning: null,
      },
      sunny: {
        title: "Dia perfeito para explorar ao ar livre",
        description: "Aproveite o clima favorável para conhecer atrações externas.",
        tips: [
          "Visite parques, praças e pontos turísticos ao ar livre",
          "Experimente passeios de barco ou atividades aquáticas",
          "Use protetor solar, óculos de sol e chapéu",
          "Mantenha-se hidratado durante os passeios",
        ],
        warning: temperature > 30 ? "Risco de insolação em exposição prolongada ao sol" : null,
      },
      default: {
        title: "Recomendações para seu passeio",
        description: "Dicas gerais para aproveitar seu dia de turismo.",
        tips: [
          "Verifique a previsão do tempo antes de sair",
          "Tenha planos alternativos para diferentes condições climáticas",
          "Leve roupas adequadas para mudanças no clima",
          "Consulte locais sobre as melhores atividades para o clima atual",
        ],
        warning: null,
      },
    },
    student: {
      rainy: {
        title: "Dia ideal para estudos internos",
        description: "Aproveite o clima chuvoso para focar nos estudos.",
        tips: [
          "Organize seu material de estudo e crie um ambiente aconchegante",
          "Prepare uma bebida quente para acompanhar a sessão de estudos",
          "Utilize o som da chuva como concentração (ou use white noise)",
          "Planeje intervalos curtos para descanso mental",
        ],
        warning: null,
      },
      sunny: {
        title: "Equilibre estudos e ar livre",
        description: "Aproveite o dia ensolarado para estudar de forma diferente.",
        tips: [
          "Considere estudar em um parque ou área externa com sombra",
          "Faça intervalos curtos para caminhar e tomar sol (vitamina D)",
          "Mantenha-se hidratado durante as sessões de estudo",
          "Alterne entre atividades internas e externas para manter o foco",
        ],
        warning: null,
      },
      default: {
        title: "Recomendações para seus estudos",
        description: "Dicas gerais para otimizar seu aprendizado hoje.",
        tips: [
          "Organize seu ambiente de estudo de acordo com o clima",
          "Planeje pausas estratégicas para manter a concentração",
          "Mantenha água e lanches saudáveis por perto",
          "Adapte seu cronograma de estudos às condições do dia",
        ],
        warning: null,
      },
    },
  }

  // Normalizar a condição climática
  const normalizedCondition = weatherCondition.toLowerCase()

  // Obter recomendações para o perfil
  const profileRecommendations = fallbackRecommendations[profileType]

  // Tentar obter recomendação específica para a condição climática
  let recommendation = profileRecommendations[normalizedCondition]

  // Se não houver recomendação específica, usar a padrão
  if (!recommendation) {
    recommendation = profileRecommendations.default
  }

  // Construir e retornar a recomendação completa
  return {
    id: `fallback-${profileType}-${normalizedCondition}`,
    profile_type: profileType,
    weather_condition: normalizedCondition,
    temperature_min: null,
    temperature_max: null,
    title: recommendation.title || "Recomendações personalizadas",
    description: recommendation.description || "Dicas baseadas no clima atual e seu perfil.",
    tips: recommendation.tips || [
      "Verifique a previsão do tempo regularmente",
      "Adapte suas atividades às condições climáticas",
    ],
    warning: recommendation.warning,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

/**
 * Função principal que tenta buscar recomendações do banco de dados
 * e, se não encontrar, gera recomendações de fallback
 */
export async function getRecommendations(
  profileType: ProfileType,
  weatherCondition: string,
  temperature: number,
): Promise<Recommendation> {
  // Tentar buscar do banco de dados
  const dbRecommendation = await fetchRecommendations(profileType, weatherCondition, temperature)

  // Se encontrou no banco, retornar
  if (dbRecommendation) {
    return dbRecommendation
  }

  // Caso contrário, gerar recomendação de fallback
  return generateFallbackRecommendation(profileType, weatherCondition, temperature)
}
