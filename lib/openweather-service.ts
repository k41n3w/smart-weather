"use client"

import type { WeatherData } from "@/types/weather"
import { fetchWeatherData as fetchWeatherServerAction } from "./weather-actions"

// Função para obter dados do clima usando o Server Action
export async function fetchWeatherData(city: string): Promise<WeatherData> {
  try {
    console.log("Cliente: Iniciando fetchWeatherData para cidade:", city)

    // Adicionar timeout para a chamada ao Server Action
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Timeout ao buscar dados climáticos. O servidor demorou muito para responder."))
      }, 15000) // 15 segundos de timeout
    })

    // Usar Promise.race para implementar timeout
    const result = await Promise.race([fetchWeatherServerAction(city), timeoutPromise])

    console.log("Cliente: Dados climáticos recebidos com sucesso")
    return result as WeatherData
  } catch (error) {
    console.error("Cliente: Erro ao buscar dados climáticos:", error)

    // Repassar o erro para ser tratado pelo componente
    if (error instanceof Error) {
      throw error
    }

    throw new Error("Erro desconhecido ao buscar dados climáticos")
  }
}
