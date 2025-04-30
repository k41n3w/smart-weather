"use client"

// Este arquivo foi substituído por lib/weather-actions.ts
// Mantido apenas para compatibilidade com código existente

import type { WeatherData, WeatherForecast } from "@/types/weather"
import { fetchWeatherData as fetchWeatherServerAction } from "./weather-actions"

// Função de compatibilidade que usa o Server Action
export async function getCurrentWeather(city: string): Promise<WeatherData> {
  try {
    // Obter dados do servidor
    return await fetchWeatherServerAction(city)
  } catch (error) {
    console.error("Erro ao buscar dados climáticos:", error)
    throw error
  }
}

export async function getWeatherForecast(city: string): Promise<WeatherForecast> {
  try {
    // Usar o Server Action para buscar a previsão
    // Não implementamos esta funcionalidade específica no Server Action,
    // mas podemos adicionar se necessário
    throw new Error("Esta função foi descontinuada. Use fetchWeatherData do Server Action.")
  } catch (error) {
    console.error("Error fetching weather forecast:", error)
    throw error
  }
}

// Outras funções foram movidas para weather-actions.ts
