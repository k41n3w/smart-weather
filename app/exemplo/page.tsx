"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bike, Car, ArrowLeft, Umbrella, AlertTriangle } from "lucide-react"
import { WeatherDisplay } from "@/components/weather-display"

// Define the example recommendations
const examples = [
  {
    id: 1,
    profile: {
      type: "athlete",
      name: "Atleta",
      description: "Recomendações para treinos e atividades ao ar livre",
      icon: "Bike",
    },
    weather: {
      location: "São Paulo",
      temperature: 18,
      feelsLike: 16,
      unit: "C",
      condition: "rainy",
      humidity: 85,
      wind: 20,
      precipitation: 70,
      sunrise: "6:15 AM",
      sunset: "6:45 PM",
      forecast: [
        {
          date: new Date().toISOString(),
          condition: "rainy",
          highTemp: 19,
          lowTemp: 15,
          humidity: 85,
          wind: 20,
          precipitation: 70,
        },
        {
          date: new Date(Date.now() + 86400000).toISOString(),
          condition: "cloudy",
          highTemp: 22,
          lowTemp: 16,
          humidity: 75,
          wind: 15,
          precipitation: 30,
        },
      ],
    },
    recommendation: {
      id: "rec-1",
      profile_type: "athlete",
      weather_condition: "rainy",
      temperature_min: 15,
      temperature_max: 20,
      title: "Clima desfavorável para corrida",
      description: "A chuva forte pode afetar seu desempenho e aumentar o risco de lesões.",
      tips: [
        "Considere treinar em ambiente fechado hoje",
        "Se precisar correr ao ar livre, use roupas impermeáveis",
        "Evite áreas com poças d'água e superfícies escorregadias",
        "Reduza a intensidade do treino devido às condições adversas",
      ],
      warning: "Risco de hipotermia em exposição prolongada à chuva",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 2,
    profile: {
      type: "driver",
      name: "Motorista",
      description: "Informações sobre condições das estradas",
      icon: "Car",
    },
    weather: {
      location: "Curitiba",
      temperature: 22,
      feelsLike: 20,
      unit: "C",
      condition: "stormy",
      humidity: 90,
      wind: 35,
      precipitation: 85,
      sunrise: "6:30 AM",
      sunset: "7:00 PM",
      forecast: [
        {
          date: new Date().toISOString(),
          condition: "stormy",
          highTemp: 23,
          lowTemp: 18,
          humidity: 90,
          wind: 35,
          precipitation: 85,
        },
        {
          date: new Date(Date.now() + 86400000).toISOString(),
          condition: "rainy",
          highTemp: 20,
          lowTemp: 15,
          humidity: 80,
          wind: 25,
          precipitation: 60,
        },
      ],
    },
    recommendation: {
      id: "rec-2",
      profile_type: "driver",
      weather_condition: "stormy",
      temperature_min: 20,
      temperature_max: 25,
      title: "Alerta de granizo na região",
      description: "Previsão de tempestade com granizo nas próximas horas.",
      tips: [
        "Evite deslocamentos não essenciais",
        "Se estiver dirigindo, procure abrigo seguro como postos de gasolina com cobertura",
        "Reduza a velocidade e aumente a distância de seguimento",
        "Ligue os faróis baixos para melhorar a visibilidade",
      ],
      warning: "Granizo pode causar danos ao veículo e reduzir drasticamente a visibilidade",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 3,
    profile: {
      type: "tourist",
      name: "Turista",
      description: "Sugestões de atividades baseadas no clima",
      icon: "Umbrella",
    },
    weather: {
      location: "Brasília",
      temperature: 32,
      feelsLike: 34,
      unit: "C",
      condition: "sunny",
      humidity: 20,
      wind: 5,
      precipitation: 0,
      sunrise: "6:00 AM",
      sunset: "6:30 PM",
      forecast: [
        {
          date: new Date().toISOString(),
          condition: "sunny",
          highTemp: 33,
          lowTemp: 22,
          humidity: 20,
          wind: 5,
          precipitation: 0,
        },
        {
          date: new Date(Date.now() + 86400000).toISOString(),
          condition: "sunny",
          highTemp: 34,
          lowTemp: 23,
          humidity: 18,
          wind: 6,
          precipitation: 0,
        },
      ],
    },
    recommendation: {
      id: "rec-3",
      profile_type: "tourist",
      weather_condition: "sunny",
      temperature_min: 30,
      temperature_max: 40,
      title: "Alerta de baixa umidade",
      description: "Condições de calor intenso com umidade muito baixa.",
      tips: [
        "Treine nas primeiras horas da manhã ou final da tarde",
        "Hidrate-se com mais frequência, antes, durante e após o treino",
        "Use protetor solar e roupas leves que protejam do sol",
        "Reduza a intensidade e duração do treino",
      ],
      warning: "Risco de desidratação e insolação devido à combinação de calor e baixa umidade",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
]

export default function ExamplePage() {
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const [fadeState, setFadeState] = useState("in")

  const currentExample = examples[currentExampleIndex]

  useEffect(() => {
    // Change example every 15 seconds
    const interval = setInterval(() => {
      setFadeState("out")

      setTimeout(() => {
        setCurrentExampleIndex((prev) => (prev + 1) % examples.length)
        setFadeState("in")
      }, 500) // Wait for fade out animation to complete
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const handleChangeExample = (index: number) => {
    if (index === currentExampleIndex) return

    setFadeState("out")
    setTimeout(() => {
      setCurrentExampleIndex(index)
      setFadeState("in")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Smart Weather</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/register">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 mb-4 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar para a página inicial</span>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">Exemplo de recomendações personalizadas</h1>
              <p className="text-muted-foreground">
                Veja como diferentes perfis de usuários recebem recomendações específicas baseadas no clima.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {examples.map((example, index) => (
              <Button
                key={index}
                variant={currentExampleIndex === index ? "default" : "outline"}
                onClick={() => handleChangeExample(index)}
                className="gap-2"
              >
                {example.profile.type === "athlete" && <Bike className="h-4 w-4" />}
                {example.profile.type === "driver" && <Car className="h-4 w-4" />}
                {example.profile.type === "tourist" && <Umbrella className="h-4 w-4" />}
                {example.profile.name}
              </Button>
            ))}
          </div>

          <div className={`transition-opacity duration-500 ${fadeState === "out" ? "opacity-0" : "opacity-100"}`}>
            <Card className="mb-6 overflow-hidden">
              <CardHeader className="bg-primary/5 pb-2">
                <CardTitle>Previsão do tempo para {currentExample.weather.location}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <WeatherDisplay weatherData={currentExample.weather} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-primary/5 pb-2">
                <CardTitle>Recomendações para {currentExample.profile.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
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

                  {currentExample.recommendation.warning && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-md">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm">{currentExample.recommendation.warning}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Gostou do que viu? Crie sua conta agora e receba recomendações personalizadas para o seu perfil.
            </p>
            <Link href="/register">
              <Button size="lg">Criar conta gratuita</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
