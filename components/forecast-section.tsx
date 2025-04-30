import { Card, CardContent } from "@/components/ui/card"
import { Cloud, CloudRain, CloudSnow, Sun, CloudLightning } from "lucide-react"
import type { ForecastDay } from "@/types/weather"

interface ForecastSectionProps {
  forecast: ForecastDay[]
}

export default function ForecastSection({ forecast }: ForecastSectionProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
      case "clear":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "cloudy":
      case "partly cloudy":
        return <Cloud className="h-8 w-8 text-slate-400" />
      case "rainy":
      case "rain":
      case "drizzle":
        return <CloudRain className="h-8 w-8 text-blue-400" />
      case "snowy":
      case "snow":
        return <CloudSnow className="h-8 w-8 text-slate-200" />
      case "stormy":
      case "thunderstorm":
        return <CloudLightning className="h-8 w-8 text-purple-500" />
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {forecast.map((day, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <div className="font-medium mb-2">
                {new Date(day.date).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="mb-2">{getWeatherIcon(day.condition)}</div>
              <div className="text-lg font-bold mb-1">
                {day.highTemp}° / {day.lowTemp}°
              </div>
              <div className="text-sm text-muted-foreground">{day.condition}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                <div>Precipitation: {day.precipitation}%</div>
                <div>Humidity: {day.humidity}%</div>
                <div>Wind: {day.wind} km/h</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
