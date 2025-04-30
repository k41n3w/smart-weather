"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { WeatherData } from "@/types/weather"
import WeatherAnimation from "./weather-animation"
import { Thermometer, Droplets, Wind, RefreshCw, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WeatherDisplayProps {
  weatherData: WeatherData
  isLoading?: boolean
  onRefresh?: () => void
  className?: string
}

export function WeatherDisplay({
  weatherData,
  isLoading = false,
  onRefresh = () => {},
  className,
}: WeatherDisplayProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setIsRefreshing(false)
    }
  }, [isLoading])

  const handleRefresh = () => {
    setIsRefreshing(true)
    onRefresh()
  }

  if (isLoading && !weatherData) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Carregando dados do clima...</p>
        </CardContent>
      </Card>
    )
  }

  if (!weatherData) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground">Nenhum dado de clima disponível</p>
          <Button onClick={onRefresh} variant="outline" className="mt-4">
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  const isFallbackData = weatherData.location.includes("Fallback")

  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="relative">
          <div className="h-40 bg-gradient-to-b from-blue-500 to-blue-300">
            <WeatherAnimation condition={weatherData.condition} />
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-20" />
        </div>

        <div className="p-6 pt-2 relative">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold">{weatherData.location}</h2>
              <p className="text-muted-foreground">Atualizado às {new Date().toLocaleTimeString()}</p>
            </div>

            <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={cn("h-5 w-5", isRefreshing && "animate-spin")} />
              <span className="sr-only">Atualizar</span>
            </Button>
          </div>

          {isFallbackData && (
            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-sm">
              <p className="text-yellow-800 dark:text-yellow-300 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" />
                Usando dados offline. Não foi possível conectar à API de clima.
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center">
            <div className="text-6xl font-bold mr-4">
              {weatherData.temperature}°{weatherData.unit}
            </div>
            <div>
              <p className="text-xl capitalize">{weatherData.condition}</p>
              <p className="text-muted-foreground">
                Sensação térmica: {weatherData.feelsLike}°{weatherData.unit}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
              <Thermometer className="h-6 w-6 mb-1 text-orange-500" />
              <span className="text-sm text-muted-foreground">Sensação</span>
              <span className="font-medium">
                {weatherData.feelsLike}°{weatherData.unit}
              </span>
            </div>

            <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
              <Droplets className="h-6 w-6 mb-1 text-blue-500" />
              <span className="text-sm text-muted-foreground">Umidade</span>
              <span className="font-medium">{weatherData.humidity}%</span>
            </div>

            <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
              <Wind className="h-6 w-6 mb-1 text-cyan-500" />
              <span className="text-sm text-muted-foreground">Vento</span>
              <span className="font-medium">{weatherData.wind} km/h</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default WeatherDisplay
