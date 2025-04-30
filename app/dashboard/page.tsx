"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-client"
import { Loader2, RefreshCw, LogOut, Bug, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { WeatherDisplay } from "@/components/weather-display"
import RecommendationsPanel from "@/components/recommendations-panel"
import ForecastSection from "@/components/forecast-section"
import { fetchWeatherData } from "@/lib/openweather-service"
import { getRecommendations } from "@/lib/recommendations-service"
import type { WeatherData } from "@/types/weather"
import type { Recommendation } from "@/types/recommendation"
import type { ProfileType } from "@/types/user"
import AuthGuard from "@/components/auth-guard"
import { useToast } from "@/hooks/use-toast"

const PROFILE_STORAGE_KEY = "user-profile"

export default function DashboardPage() {
  const { user, profile, signOut } = useAuth()
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [showDebug, setShowDebug] = useState(false)

  // Estados para os dados de clima e recomendações
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [weatherError, setWeatherError] = useState<string | null>(null)

  // Função para adicionar logs
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${message}`)
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev])
  }

  // Carregar dados de clima quando o perfil estiver disponível
  useEffect(() => {
    if (profile) {
      loadWeatherData()
    }
  }, [profile])

  // Função para carregar dados de clima e recomendações
  const loadWeatherData = async () => {
    if (!profile) return

    setWeatherLoading(true)
    setWeatherError(null)
    addLog(`Carregando dados de clima para: ${profile.city}`)

    try {
      // Carregar dados de clima
      const weather = await fetchWeatherData(profile.city)
      setWeatherData(weather)
      addLog("Dados de clima carregados com sucesso")

      // Carregar recomendações baseadas no clima e perfil
      const rec = await getRecommendations(profile.profile_type as ProfileType, weather.condition, weather.temperature)
      setRecommendation(rec)
      addLog("Recomendações carregadas com sucesso")
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      setWeatherError(`Erro ao carregar dados de clima: ${error instanceof Error ? error.message : String(error)}`)
      addLog(`Erro ao carregar dados de clima: ${error instanceof Error ? error.message : String(error)}`)

      toast({
        title: "Erro ao carregar dados",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      })
    } finally {
      setWeatherLoading(false)
    }
  }

  // Função para atualizar informações
  const handleRefresh = async () => {
    setIsRefreshing(true)
    addLog("Atualizando informações")

    try {
      await loadWeatherData()
      toast({
        title: "Dados atualizados",
        description: "Os dados de clima e recomendações foram atualizados.",
      })
    } catch (e) {
      addLog(`Erro ao atualizar: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Função para fazer logout
  const handleLogout = async () => {
    setIsLoggingOut(true)
    addLog("Iniciando logout")

    try {
      await signOut()
      addLog("Logout realizado com sucesso")
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      })
    } catch (e) {
      addLog(`Erro no logout: ${e instanceof Error ? e.message : String(e)}`)
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar desconectar.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <AuthGuard>
      <div className="container py-8">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Olá, {profile?.name || "Usuário"}</h1>
            <p className="text-muted-foreground">
              Aqui estão suas recomendações personalizadas para {profile?.city || "sua cidade"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Atualizar
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile">Perfil</Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogOut className="h-4 w-4 mr-2" />}
              Sair
            </Button>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna da esquerda - Clima atual */}
          <div className="lg:col-span-1">
            <WeatherDisplay
              weatherData={weatherData}
              isLoading={weatherLoading}
              onRefresh={loadWeatherData}
              className="h-full"
            />
            {weatherData && weatherData.location.includes("Fallback") && (
              <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-sm">
                <p className="text-yellow-800 dark:text-yellow-300 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" />
                  Usando dados offline. Não foi possível conectar à API de clima.
                </p>
              </div>
            )}
          </div>

          {/* Coluna da direita - Recomendações */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  Recomendações para{" "}
                  {profile?.profile_type === "athlete"
                    ? "Atleta"
                    : profile?.profile_type === "driver"
                      ? "Motorista"
                      : profile?.profile_type === "farmer"
                        ? "Agricultor"
                        : profile?.profile_type === "tourist"
                          ? "Turista"
                          : profile?.profile_type === "student"
                            ? "Estudante"
                            : "seu perfil"}
                </CardTitle>
                <CardDescription>
                  Baseado nas condições climáticas atuais em {profile?.city || "sua cidade"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {weatherLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Carregando recomendações...</p>
                  </div>
                ) : weatherError ? (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md text-red-800 dark:text-red-300">
                    <p className="font-medium">Erro ao carregar dados</p>
                    <p className="text-sm mt-1">{weatherError}</p>
                    <Button className="mt-4" onClick={loadWeatherData}>
                      Tentar novamente
                    </Button>
                  </div>
                ) : recommendation ? (
                  <RecommendationsPanel recommendation={recommendation} />
                ) : (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                    <p>Nenhuma recomendação disponível no momento.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Previsão para os próximos dias */}
        {weatherData && weatherData.forecast && weatherData.forecast.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Previsão para os próximos dias</h2>
            <ForecastSection forecast={weatherData.forecast} />
          </div>
        )}

        {/* Seção de depuração colapsável */}
        <div className="mt-8">
          <Button
            variant="outline"
            className="w-full flex justify-between items-center"
            onClick={() => setShowDebug(!showDebug)}
          >
            <span className="flex items-center">
              <Bug className="h-4 w-4 mr-2" />
              Informações de Depuração
            </span>
            {showDebug ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {showDebug && (
            <Card className="mt-2">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Status de autenticação */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Status de Autenticação</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted rounded-md">
                        <p>
                          <strong>Usuário autenticado:</strong> {user ? "Sim" : "Não"}
                        </p>
                        <p>
                          <strong>Perfil carregado:</strong> {profile ? "Sim" : "Não"}
                        </p>
                        <p>
                          <strong>ID do usuário:</strong> {user?.id || "N/A"}
                        </p>
                        <p>
                          <strong>Email:</strong> {user?.email || "N/A"}
                        </p>
                      </div>

                      <div className="p-4 bg-muted rounded-md">
                        <p>
                          <strong>Nome:</strong> {profile?.name || "N/A"}
                        </p>
                        <p>
                          <strong>Cidade:</strong> {profile?.city || "N/A"}
                        </p>
                        <p>
                          <strong>Tipo de perfil:</strong> {profile?.profile_type || "N/A"}
                        </p>
                        <p>
                          <strong>Status da rede:</strong> {navigator.onLine ? "Online" : "Offline"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Logs */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Logs</h3>
                    <div className="p-4 bg-muted rounded-md overflow-auto max-h-60">
                      {logs.length > 0 ? (
                        logs.map((log, i) => (
                          <div key={i} className="text-xs mb-1">
                            {log}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground">Nenhum log disponível</p>
                      )}
                    </div>
                  </div>

                  {/* Ações de depuração */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Ações de Depuração</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={() => window.location.reload()}>
                        Recarregar página
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          try {
                            localStorage.removeItem(PROFILE_STORAGE_KEY)
                            localStorage.removeItem("supabase.auth.token")
                            document.cookie.split(";").forEach((c) => {
                              document.cookie = c
                                .replace(/^ +/, "")
                                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
                            })
                            toast({
                              title: "Cache limpo",
                              description: "Os dados de autenticação foram limpos.",
                            })
                          } catch (e) {
                            console.error("Erro ao limpar cache:", e)
                          }
                        }}
                      >
                        Limpar cache
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/diagnostico">Diagnóstico completo</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
