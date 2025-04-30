"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bike, Car, AlertTriangle } from "lucide-react"
import WeatherAnimation from "@/components/weather-animation"

// Define the example recommendations
const examples = [
  {
    id: 1,
    profile: {
      type: "athlete",
      name: "Atleta",
      icon: <Bike className="h-5 w-5" />,
    },
    weather: {
      condition: "rainy",
      temperature: 18,
      humidity: 85,
      wind: 20,
      location: "São Paulo",
    },
    recommendation: {
      title: "Clima desfavorável para corrida",
      description: "A chuva forte pode afetar seu desempenho e aumentar o risco de lesões.",
      tips: [
        "Considere treinar em ambiente fechado hoje",
        "Se precisar correr ao ar livre, use roupas impermeáveis",
        "Evite áreas com poças d'água e superfícies escorregadias",
        "Reduza a intensidade do treino devido às condições adversas",
      ],
      warning: "Risco de hipotermia em exposição prolongada à chuva",
    },
  },
  {
    id: 2,
    profile: {
      type: "driver",
      name: "Motorista",
      icon: <Car className="h-5 w-5" />,
    },
    weather: {
      condition: "stormy",
      temperature: 22,
      humidity: 90,
      wind: 35,
      location: "Curitiba",
    },
    recommendation: {
      title: "Alerta de granizo na região",
      description: "Previsão de tempestade com granizo nas próximas horas.",
      tips: [
        "Evite deslocamentos não essenciais",
        "Se estiver dirigindo, procure abrigo seguro como postos de gasolina com cobertura",
        "Reduza a velocidade e aumente a distância de seguimento",
        "Ligue os faróis baixos para melhorar a visibilidade",
      ],
      warning: "Granizo pode causar danos ao veículo e reduzir drasticamente a visibilidade",
    },
  },
  {
    id: 3,
    profile: {
      type: "athlete",
      name: "Corredor",
      icon: <Bike className="h-5 w-5" />,
    },
    weather: {
      condition: "sunny",
      temperature: 32,
      humidity: 20,
      wind: 5,
      location: "Brasília",
    },
    recommendation: {
      title: "Alerta de baixa umidade",
      description: "Condições de calor intenso com umidade muito baixa.",
      tips: [
        "Treine nas primeiras horas da manhã ou final da tarde",
        "Hidrate-se com mais frequência, antes, durante e após o treino",
        "Use protetor solar e roupas leves que protejam do sol",
        "Reduza a intensidade e duração do treino",
      ],
      warning: "Risco de desidratação e insolação devido à combinação de calor e baixa umidade",
    },
  },
]

export default function RecommendationPreview() {
  const [currentExample, setCurrentExample] = useState(examples[0])
  const [fadeState, setFadeState] = useState("in")

  useEffect(() => {
    // Change example every 10 seconds
    const interval = setInterval(() => {
      setFadeState("out")

      setTimeout(() => {
        setCurrentExample((prev) => {
          const currentIndex = examples.findIndex((ex) => ex.id === prev.id)
          const nextIndex = (currentIndex + 1) % examples.length
          return examples[nextIndex]
        })
        setFadeState("in")
      }, 500) // Wait for fade out animation to complete
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className={`transition-opacity duration-500 ${fadeState === "out" ? "opacity-0" : "opacity-100"}`}>
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <div className="bg-primary/10 p-2 rounded-full">{currentExample.profile.icon}</div>
            <CardTitle className="text-lg">Perfil: {currentExample.profile.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold">{currentExample.weather.temperature}°C</div>
                <div className="text-muted-foreground">{currentExample.weather.location}</div>
              </div>
              <div className="text-right">
                <div>Umidade: {currentExample.weather.humidity}%</div>
                <div>Vento: {currentExample.weather.wind} km/h</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">{currentExample.recommendation.title}</h3>
                <p className="text-muted-foreground mt-1">{currentExample.recommendation.description}</p>
              </div>

              <ul className="space-y-2">
                {currentExample.recommendation.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    </div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-md">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{currentExample.recommendation.warning}</p>
              </div>

              <Button className="w-full">Ver previsão completa</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div
        className={`relative h-[400px] rounded-lg overflow-hidden shadow-xl transition-opacity duration-500 ${fadeState === "out" ? "opacity-0" : "opacity-100"}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-blue-500">
          <WeatherAnimation condition={currentExample.weather.condition} />
        </div>
      </div>
    </div>
  )
}
