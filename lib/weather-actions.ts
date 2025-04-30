"use server"

import type { WeatherData, ForecastDay } from "@/types/weather"

// Função para converter timestamp Unix para formato de hora (HH:MM)
function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// Função para mapear códigos de condição climática da OpenWeather para nossas condições
function mapWeatherCondition(weatherId: number): string {
  // Códigos baseados na documentação da OpenWeather: https://openweathermap.org/weather-conditions
  if (weatherId >= 200 && weatherId < 300) return "Thunderstorm"
  if (weatherId >= 300 && weatherId < 400) return "Drizzle"
  if (weatherId >= 500 && weatherId < 600) return "Rain"
  if (weatherId >= 600 && weatherId < 700) return "Snow"
  if (weatherId >= 700 && weatherId < 800) return "Fog"
  if (weatherId === 800) return "Clear"
  if (weatherId > 800) return "Cloudy"
  return "Clear" // Padrão
}

// Função para calcular a probabilidade de precipitação com base nos dados da OpenWeather
function calculatePrecipitation(pop: number): number {
  return Math.round(pop * 100)
}

// Dados de fallback para quando a API falhar
const fallbackWeatherData: Record<string, WeatherData> = {
  default: {
    location: "Localização Padrão",
    temperature: 25,
    feelsLike: 26,
    unit: "C",
    condition: "Clear",
    humidity: 60,
    wind: 10,
    precipitation: 0,
    sunrise: "06:00",
    sunset: "18:00",
    forecast: [
      {
        date: new Date().toISOString().split("T")[0],
        condition: "Clear",
        highTemp: 27,
        lowTemp: 22,
        humidity: 60,
        wind: 10,
        precipitation: 0,
      },
      {
        date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        condition: "Cloudy",
        highTemp: 26,
        lowTemp: 21,
        humidity: 65,
        wind: 12,
        precipitation: 10,
      },
      {
        date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
        condition: "Rain",
        highTemp: 24,
        lowTemp: 20,
        humidity: 75,
        wind: 15,
        precipitation: 40,
      },
      {
        date: new Date(Date.now() + 259200000).toISOString().split("T")[0],
        condition: "Clear",
        highTemp: 25,
        lowTemp: 21,
        humidity: 60,
        wind: 8,
        precipitation: 0,
      },
      {
        date: new Date(Date.now() + 345600000).toISOString().split("T")[0],
        condition: "Clear",
        highTemp: 28,
        lowTemp: 23,
        humidity: 55,
        wind: 7,
        precipitation: 0,
      },
    ],
  },
  "São Paulo": {
    location: "São Paulo, BR",
    temperature: 23,
    feelsLike: 24,
    unit: "C",
    condition: "Cloudy",
    humidity: 70,
    wind: 8,
    precipitation: 20,
    sunrise: "06:15",
    sunset: "18:30",
    forecast: [
      {
        date: new Date().toISOString().split("T")[0],
        condition: "Cloudy",
        highTemp: 24,
        lowTemp: 19,
        humidity: 70,
        wind: 8,
        precipitation: 20,
      },
      {
        date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        condition: "Rain",
        highTemp: 22,
        lowTemp: 18,
        humidity: 80,
        wind: 10,
        precipitation: 60,
      },
      {
        date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
        condition: "Rain",
        highTemp: 21,
        lowTemp: 17,
        humidity: 85,
        wind: 12,
        precipitation: 70,
      },
      {
        date: new Date(Date.now() + 259200000).toISOString().split("T")[0],
        condition: "Cloudy",
        highTemp: 23,
        lowTemp: 18,
        humidity: 75,
        wind: 9,
        precipitation: 30,
      },
      {
        date: new Date(Date.now() + 345600000).toISOString().split("T")[0],
        condition: "Clear",
        highTemp: 25,
        lowTemp: 19,
        humidity: 65,
        wind: 7,
        precipitation: 10,
      },
    ],
  },
  "Rio de Janeiro": {
    location: "Rio de Janeiro, BR",
    temperature: 28,
    feelsLike: 30,
    unit: "C",
    condition: "Clear",
    humidity: 65,
    wind: 12,
    precipitation: 0,
    sunrise: "06:10",
    sunset: "18:25",
    forecast: [
      {
        date: new Date().toISOString().split("T")[0],
        condition: "Clear",
        highTemp: 30,
        lowTemp: 24,
        humidity: 65,
        wind: 12,
        precipitation: 0,
      },
      {
        date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        condition: "Clear",
        highTemp: 31,
        lowTemp: 25,
        humidity: 60,
        wind: 10,
        precipitation: 0,
      },
      {
        date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
        condition: "Cloudy",
        highTemp: 29,
        lowTemp: 24,
        humidity: 70,
        wind: 15,
        precipitation: 20,
      },
      {
        date: new Date(Date.now() + 259200000).toISOString().split("T")[0],
        condition: "Rain",
        highTemp: 27,
        lowTemp: 23,
        humidity: 75,
        wind: 18,
        precipitation: 50,
      },
      {
        date: new Date(Date.now() + 345600000).toISOString().split("T")[0],
        condition: "Cloudy",
        highTemp: 28,
        lowTemp: 24,
        humidity: 70,
        wind: 14,
        precipitation: 30,
      },
    ],
  },
}

// Função principal para buscar dados climáticos da OpenWeather API
export async function fetchWeatherData(city: string): Promise<WeatherData> {
  try {
    console.log("Server Action: Iniciando fetchWeatherData para cidade:", city)

    // CORREÇÃO: Usar apenas a variável de ambiente do servidor
    const apiKey = process.env.OPENWEATHER_API_KEY

    if (!apiKey) {
      console.error("Server Action: OpenWeather API key não encontrada")
      throw new Error("OpenWeather API key não encontrada. Verifique as variáveis de ambiente.")
    }

    if (!city || city.trim() === "") {
      console.error("Server Action: Cidade não fornecida")
      throw new Error("É necessário fornecer uma cidade válida")
    }

    console.log("Server Action: Buscando dados atuais para:", city)

    // Adicionar timeout para a requisição
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos de timeout

    try {
      // Buscar dados atuais
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`,
        {
          cache: "no-store",
          signal: controller.signal,
        },
      )

      clearTimeout(timeoutId)

      if (!currentResponse.ok) {
        const errorText = await currentResponse.text()
        console.error("Server Action: Erro ao buscar dados climáticos:", currentResponse.status, errorText)

        if (currentResponse.status === 404) {
          throw new Error(`Cidade "${city}" não encontrada. Verifique o nome da cidade.`)
        }

        throw new Error(`Erro ao buscar dados climáticos: ${currentResponse.statusText}`)
      }

      const currentData = await currentResponse.json()
      console.log("Server Action: Dados atuais recebidos para:", city)

      console.log("Server Action: Buscando previsão para:", city)

      // Novo controller para a segunda requisição
      const controller2 = new AbortController()
      const timeoutId2 = setTimeout(() => controller2.abort(), 10000)

      // Buscar previsão para 5 dias
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`,
        {
          cache: "no-store",
          signal: controller2.signal,
        },
      )

      clearTimeout(timeoutId2)

      if (!forecastResponse.ok) {
        const errorText = await forecastResponse.text()
        console.error("Server Action: Erro ao buscar previsão:", forecastResponse.status, errorText)
        throw new Error(`Erro ao buscar previsão: ${forecastResponse.statusText}`)
      }

      const forecastData = await forecastResponse.json()
      console.log("Server Action: Dados de previsão recebidos para:", city)

      // Processar dados de previsão para obter previsão diária
      const dailyForecast = processDailyForecast(forecastData.list)

      // Construir objeto WeatherData
      const weatherData = {
        location: `${currentData.name}, ${currentData.sys.country}`,
        temperature: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        unit: "C",
        condition: mapWeatherCondition(currentData.weather[0].id),
        humidity: currentData.main.humidity,
        wind: Math.round(currentData.wind.speed * 3.6), // Converter m/s para km/h
        precipitation: forecastData.list[0]?.pop ? calculatePrecipitation(forecastData.list[0].pop) : 0,
        sunrise: formatTime(currentData.sys.sunrise),
        sunset: formatTime(currentData.sys.sunset),
        forecast: dailyForecast,
      }

      console.log("Server Action: Dados processados com sucesso para:", city)
      return weatherData
    } catch (fetchError) {
      clearTimeout(timeoutId)

      // Verificar se é um erro de timeout ou abort
      if (fetchError.name === "AbortError") {
        console.error("Server Action: Timeout ao buscar dados da OpenWeather API")
        throw new Error("Timeout ao buscar dados climáticos. A API demorou muito para responder.")
      }

      // Verificar se é um erro de rede
      if (fetchError instanceof TypeError && fetchError.message.includes("fetch")) {
        console.error("Server Action: Erro de rede ao buscar dados da OpenWeather API:", fetchError)
        console.log("Server Action: Usando dados de fallback para:", city)

        // Usar dados de fallback
        const normalizedCity = city.toLowerCase().trim()

        // Verificar se temos dados de fallback para esta cidade
        if (normalizedCity.includes("são paulo") || normalizedCity.includes("sao paulo")) {
          return { ...fallbackWeatherData["São Paulo"], location: `${city}, BR (Fallback)` }
        } else if (normalizedCity.includes("rio de janeiro")) {
          return { ...fallbackWeatherData["Rio de Janeiro"], location: `${city}, BR (Fallback)` }
        } else {
          // Usar dados padrão de fallback
          return { ...fallbackWeatherData.default, location: `${city} (Fallback)` }
        }
      }

      // Repassar outros erros
      throw fetchError
    }
  } catch (error) {
    console.error("Server Action: Erro ao buscar dados da OpenWeather API:", error)

    // Se for um erro conhecido, repassar
    if (error instanceof Error) {
      throw error
    }

    // Para erros desconhecidos, usar mensagem genérica
    throw new Error("Erro ao buscar dados climáticos. Por favor, tente novamente mais tarde.")
  }
}

// Função para processar dados de previsão e agrupá-los por dia
function processDailyForecast(forecastList: any[]): ForecastDay[] {
  if (!forecastList || !Array.isArray(forecastList) || forecastList.length === 0) {
    console.warn("Server Action: Lista de previsão vazia ou inválida")
    return []
  }

  const dailyMap = new Map<string, any[]>()

  // Agrupar previsões por dia
  forecastList.forEach((item) => {
    if (!item || !item.dt) {
      console.warn("Server Action: Item de previsão inválido:", item)
      return
    }

    const date = new Date(item.dt * 1000)
    const dateKey = date.toISOString().split("T")[0]

    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, [])
    }

    dailyMap.get(dateKey)?.push(item)
  })

  // Processar cada dia para obter valores máximos/mínimos
  const dailyForecast: ForecastDay[] = []

  dailyMap.forEach((dayItems, dateKey) => {
    // Ignorar o dia atual, pois já temos dados mais precisos
    if (dateKey === new Date().toISOString().split("T")[0] && dailyForecast.length > 0) {
      return
    }

    // Encontrar temperatura máxima e mínima
    let highTemp = -100
    let lowTemp = 100
    let totalHumidity = 0
    let totalWind = 0
    let maxPrecipitation = 0
    const conditions: Record<string, number> = {}

    dayItems.forEach((item: any) => {
      // Temperatura
      highTemp = Math.max(highTemp, item.main.temp_max)
      lowTemp = Math.min(lowTemp, item.main.temp_min)

      // Umidade e vento
      totalHumidity += item.main.humidity
      totalWind += item.wind.speed

      // Precipitação
      if (item.pop) {
        maxPrecipitation = Math.max(maxPrecipitation, item.pop)
      }

      // Condição
      const condition = mapWeatherCondition(item.weather[0].id)
      conditions[condition] = (conditions[condition] || 0) + 1
    })

    // Determinar a condição predominante
    let predominantCondition = "Clear"
    let maxCount = 0

    Object.entries(conditions).forEach(([condition, count]) => {
      if (count > maxCount) {
        maxCount = count
        predominantCondition = condition
      }
    })

    // Criar objeto de previsão diária
    dailyForecast.push({
      date: dateKey,
      condition: predominantCondition,
      highTemp: Math.round(highTemp),
      lowTemp: Math.round(lowTemp),
      humidity: Math.round(totalHumidity / dayItems.length),
      wind: Math.round((totalWind / dayItems.length) * 3.6), // Converter m/s para km/h
      precipitation: calculatePrecipitation(maxPrecipitation),
    })
  })

  // Limitar a 5 dias
  return dailyForecast.slice(0, 5)
}
